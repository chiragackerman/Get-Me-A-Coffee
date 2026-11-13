"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";
import Payment from "../server/models/Payment.js";
import Transaction from "../server/models/Transaction.js";

const coffeePriceInPaise = 2000;
const allowedQuantities = new Set([1, 2, 3, 5, 10]);

function getRazorpayClient() {
    const keyId = process.env.KEY_ID;
    const keySecret = process.env.KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Razorpay KEY_ID and KEY_SECRET must be configured.");
    }

    return {
        client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
        keyId,
        keySecret,
    };
}

export async function initiateRazorpay(quantity, creatorUsername) {
    if (!Number.isInteger(quantity) || !allowedQuantities.has(quantity)) {
        throw new Error("Choose a valid coffee quantity.");
    }

    if (typeof creatorUsername !== "string" || !creatorUsername.trim()) {
        throw new Error("A creator is required for this payment.");
    }

    await connectToDatabase();

    const creator = await CreatorProfile.findOne({
        username: creatorUsername.trim().toLowerCase(),
    }).select("username").lean();

    if (!creator) {
        throw new Error("The selected creator could not be found.");
    }

    const amount = quantity * coffeePriceInPaise;
    const { client, keyId } = getRazorpayClient();
    const order = await client.orders.create({
        amount,
        currency: "INR",
    });

    await Transaction.create({
        amountInPaise: amount,
        quantity,
        creatorUsername: creator.username,
        razorpay_order_id: order.id,
        status: "pending",
    });

    return {
        keyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
    };
}

export async function verifyRazorpayPayment(orderId, paymentId, signature) {
    if (
        typeof orderId !== "string"
        || typeof paymentId !== "string"
        || typeof signature !== "string"
        || !/^[a-f\d]{64}$/i.test(signature)
    ) {
        throw new Error("Invalid Razorpay payment verification details.");
    }

    const { client, keySecret } = getRazorpayClient();
    const expectedSignature = createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest();
    const receivedSignature = Buffer.from(signature, "hex");

    if (!timingSafeEqual(expectedSignature, receivedSignature)) {
        throw new Error("Razorpay payment signature verification failed.");
    }

    await connectToDatabase();
    const transaction = await Transaction.findOne({ razorpay_order_id: orderId });

    if (!transaction) {
        throw new Error("The Razorpay order could not be found.");
    }

    if (
        transaction.status === "paid"
        && transaction.razorpay_payment_id !== paymentId
    ) {
        throw new Error("This Razorpay order is already associated with another payment.");
    }

    const existingPayment = await Payment.findOne({ razorpay_order_id: orderId });
    if (existingPayment && existingPayment.razorpay_payment_id !== paymentId) {
        throw new Error("This Razorpay order is already associated with another payment.");
    }

    if (existingPayment && transaction.status === "paid") {
        return { verified: true };
    }

    let gatewayPayment = await client.payments.fetch(paymentId);
    if (
        gatewayPayment.order_id !== orderId
        || gatewayPayment.amount !== transaction.amountInPaise
        || gatewayPayment.currency !== "INR"
    ) {
        throw new Error("The Razorpay payment details do not match this order.");
    }

    if (gatewayPayment.status === "authorized") {
        gatewayPayment = await client.payments.capture(
            paymentId,
            transaction.amountInPaise,
            "INR",
        );
    }

    if (gatewayPayment.status !== "captured") {
        throw new Error("Razorpay has not captured this payment yet.");
    }

    const capturedAt = gatewayPayment.captured_at
        ? new Date(gatewayPayment.captured_at * 1000)
        : null;
    const savedPayment = await Payment.findOneAndUpdate(
        { razorpay_order_id: orderId },
        {
            $setOnInsert: {
                transactionId: transaction._id,
                amountInPaise: gatewayPayment.amount,
                currency: gatewayPayment.currency,
                quantity: transaction.quantity,
                creatorUsername: transaction.creatorUsername,
                razorpay_order_id: orderId,
                razorpay_payment_id: gatewayPayment.id,
                method: gatewayPayment.method,
                email: gatewayPayment.email || null,
                contact: gatewayPayment.contact || null,
                status: "captured",
                capturedAt,
            },
        },
        { new: true, upsert: true, runValidators: true },
    );

    if (savedPayment.razorpay_payment_id !== paymentId) {
        throw new Error("The saved payment does not match the Razorpay response.");
    }

    if (transaction.status !== "paid") {
        transaction.status = "paid";
        transaction.razorpay_payment_id = paymentId;
        transaction.paidAt = new Date();
        await transaction.save();
    }

    return { verified: true };
}