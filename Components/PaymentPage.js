"use client";

import { useState } from "react";
import Script from "next/script";
import { initiateRazorpay, verifyRazorpayPayment } from "../actions/useractions";

const coffeeQuantities = [1, 2, 3, 5, 10];
const coffeePrice = 20;

const PaymentPage = ({ creatorUsername, isTestMode }) => {
    const [quantity, setQuantity] = useState(coffeeQuantities[0]);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const total = quantity * coffeePrice;

    const pay = async () => {
        if (!window.Razorpay) {
            setErrorMessage("The payment gateway is not ready. Please try again.");
            return;
        }

        setIsProcessing(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const order = await initiateRazorpay(quantity, creatorUsername);
            const checkout = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Get Me A Coffee",
                description: `${quantity} coffee${quantity === 1 ? "" : "s"}`,
                order_id: order.orderId,
                theme: { color: "#3399cc" },
                handler: async (response) => {
                    try {
                        await verifyRazorpayPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature,
                        );
                        setSuccessMessage("Payment successful. Thank you for your support!");
                    } catch (error) {
                        console.error("Could not verify the Razorpay payment.", error);
                        setErrorMessage(
                            "Payment was received, but we could not verify it. Please contact support.",
                        );
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => setIsProcessing(false),
                },
            });

            checkout.on("payment.failed", (response) => {
                setErrorMessage(response.error.description || "Payment failed. Please try again.");
                setIsProcessing(false);
            });
            checkout.open();
        } catch (error) {
            console.error("Could not start the Razorpay checkout.", error);
            setErrorMessage("Could not start the payment. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
                onReady={() => setIsScriptLoaded(true)}
                onError={() => setErrorMessage("Could not load the payment gateway. Please reload the page.")}
            />

            <section
                aria-labelledby="buy-coffee-title"
                className="rounded-2xl border border-coffee-border bg-warm-white p-6 shadow-sm sm:p-7"
            >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2
                            id="buy-coffee-title"
                            className="font-heading text-2xl font-bold text-espresso"
                        >
                            Buy Them a Coffee
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-mocha">
                            Support this creator and help them keep creating.
                        </p>
                        {isTestMode && (
                            <p className="mt-2 text-sm leading-6 text-mocha">
                                Test mode does not transfer real money. Use Razorpay&apos;s test
                                payment flow; a real UPI app cannot verify the test QR as a live
                                UPI payment.
                            </p>
                        )}
                    </div>
                    <p className="text-sm font-semibold text-coffee">₹20 per coffee</p>
                </div>

                <fieldset className="mt-6">
                    <legend className="mb-3 text-sm font-semibold text-espresso">
                        Choose a quantity
                    </legend>
                    <div className="grid grid-cols-5 gap-2 sm:max-w-md sm:gap-3">
                        {coffeeQuantities.map((amount) => (
                            <button
                                aria-pressed={quantity === amount}
                                className={`rounded-xl border px-2 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee ${quantity === amount
                                    ? "border-coffee bg-coffee text-warm-white"
                                    : "border-coffee-border bg-cream text-espresso hover:bg-latte"
                                    }`}
                                key={amount}
                                onClick={() => setQuantity(amount)}
                                type="button"
                            >
                                {amount}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <div className="mt-6 flex flex-col gap-4 border-t border-coffee-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p aria-live="polite" className="text-lg font-semibold text-espresso">
                        Total: ₹{total}
                    </p>
                    <button
                        className="rounded-full bg-coffee px-7 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!isScriptLoaded || isProcessing}
                        title="Proceed to pay"
                        type="button"
                        onClick={pay}
                    >
                        {isProcessing ? "Processing..." : isScriptLoaded ? "Buy Coffee" : "Loading payment..."}
                    </button>
                </div>
                {errorMessage && (
                    <p className="mt-4 text-sm text-red-700" role="alert">
                        {errorMessage}
                    </p>
                )}
                {successMessage && (
                    <p className="mt-4 text-sm text-green-700" role="status">
                        {successMessage}
                    </p>
                )}
            </section>
        </>
    );
};

export default PaymentPage;
