import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import { authOptions } from "@/server/auth";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";
import Payment from "@/server/models/Payment";
import SignedInUser from "@/server/models/signedInUser";
import Transaction from "@/server/models/Transaction";

const coffeePriceInPaise = 2000;
const allowedQuantities = new Set([1, 2, 3, 5, 10]);

export class PaymentServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PaymentServiceError";
    this.status = status;
  }
}

export async function getAuthenticatedSender() {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (
    !sessionUser?.id
    || !sessionUser.provider
    || !["google", "github"].includes(sessionUser.provider)
  ) {
    throw new PaymentServiceError("Sign in before supporting a creator.", 401);
  }

  const providerPrefix = `${sessionUser.provider}:`;
  if (
    !sessionUser.id.startsWith(providerPrefix)
    || sessionUser.id.length === providerPrefix.length
  ) {
    throw new PaymentServiceError("Your sign-in session is invalid.", 401);
  }

  await connectToDatabase();
  const sender = await SignedInUser.findOne({
    authUserId: sessionUser.id,
    provider: sessionUser.provider,
    providerAccountId: sessionUser.id.slice(providerPrefix.length),
  }).select("_id name email").lean();

  if (!sender) {
    throw new PaymentServiceError("Your sign-in record could not be found.", 401);
  }

  return sender;
}

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

export async function initiateRazorpay(sender, quantity, creatorUsername) {
  if (!Number.isInteger(quantity) || !allowedQuantities.has(quantity)) {
    throw new PaymentServiceError("Choose a valid coffee quantity.");
  }

  if (typeof creatorUsername !== "string" || !creatorUsername.trim()) {
    throw new PaymentServiceError("A creator is required for this payment.");
  }

  const creator = await CreatorProfile.findOne({
    username: creatorUsername.trim().toLowerCase(),
  }).select("username").lean();

  if (!creator) {
    throw new PaymentServiceError("The selected creator could not be found.", 404);
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
    senderUserId: String(sender._id),
    senderName: sender.name || null,
    senderEmail: sender.email || null,
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

function getPaymentReceipt(payment) {
  return {
    verified: true,
    orderId: payment.razorpay_order_id,
    paymentId: payment.razorpay_payment_id,
    amountInPaise: payment.amountInPaise,
    currency: payment.currency,
  };
}

export async function verifyRazorpayPayment(sender, orderId, paymentId, signature) {
  if (
    typeof orderId !== "string"
    || typeof paymentId !== "string"
    || typeof signature !== "string"
    || !/^[a-f\d]{64}$/i.test(signature)
  ) {
    throw new PaymentServiceError("Invalid Razorpay payment verification details.");
  }

  const { client, keySecret } = getRazorpayClient();
  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const receivedSignature = Buffer.from(signature, "hex");

  if (!timingSafeEqual(expectedSignature, receivedSignature)) {
    throw new PaymentServiceError("Razorpay payment signature verification failed.", 403);
  }

  const transaction = await Transaction.findOne({ razorpay_order_id: orderId });
  if (!transaction) {
    throw new PaymentServiceError("The Razorpay order could not be found.", 404);
  }

  if (transaction.senderUserId !== String(sender._id)) {
    throw new PaymentServiceError("This payment does not belong to your account.", 403);
  }

  if (
    transaction.status === "paid"
    && transaction.razorpay_payment_id !== paymentId
  ) {
    throw new PaymentServiceError(
      "This Razorpay order is already associated with another payment.",
      409,
    );
  }

  const existingPayment = await Payment.findOne({ razorpay_order_id: orderId });
  if (existingPayment && existingPayment.razorpay_payment_id !== paymentId) {
    throw new PaymentServiceError(
      "This Razorpay order is already associated with another payment.",
      409,
    );
  }

  if (existingPayment && existingPayment.transactionId.toString() !== transaction._id.toString()) {
    throw new PaymentServiceError("The saved payment does not match this order.", 409);
  }

  if (existingPayment && transaction.status === "paid") {
    return getPaymentReceipt(existingPayment);
  }

  let gatewayPayment = await client.payments.fetch(paymentId);
  if (
    gatewayPayment.order_id !== orderId
    || gatewayPayment.amount !== transaction.amountInPaise
    || gatewayPayment.currency !== "INR"
  ) {
    throw new PaymentServiceError("The Razorpay payment details do not match this order.", 403);
  }

  if (gatewayPayment.status === "authorized") {
    gatewayPayment = await client.payments.capture(
      paymentId,
      transaction.amountInPaise,
      "INR",
    );
  }

  if (gatewayPayment.status !== "captured") {
    throw new PaymentServiceError("Razorpay has not captured this payment yet.", 409);
  }

  const capturedAt = gatewayPayment.captured_at
    ? new Date(gatewayPayment.captured_at * 1000)
    : new Date();
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

  if (
    savedPayment.razorpay_payment_id !== paymentId
    || savedPayment.transactionId.toString() !== transaction._id.toString()
  ) {
    throw new PaymentServiceError("The saved payment does not match the Razorpay response.", 409);
  }

  const updatedTransaction = await Transaction.findOneAndUpdate(
    {
      _id: transaction._id,
      status: "pending",
      razorpay_payment_id: { $in: [null, paymentId] },
    },
    {
      $set: {
        status: "paid",
        razorpay_payment_id: paymentId,
        paidAt: capturedAt,
      },
    },
    { new: true, runValidators: true },
  );

  if (!updatedTransaction) {
    const currentTransaction = await Transaction.findById(transaction._id)
      .select("status razorpay_payment_id")
      .lean();

    if (
      currentTransaction?.status !== "paid"
      || currentTransaction.razorpay_payment_id !== paymentId
    ) {
      throw new PaymentServiceError(
        "This Razorpay order has already been completed with a different payment.",
        409,
      );
    }
  }

  return getPaymentReceipt(savedPayment);
}
