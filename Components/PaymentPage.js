"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";

const coffeeQuantities = [1, 2, 3, 5, 10];
const coffeePrice = 20;

async function postPaymentRequest(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.error || "The payment request could not be completed.");
        error.status = response.status;
        throw error;
    }

    return result;
}

const PaymentPage = ({ creatorUsername, isAuthenticated }) => {
    const [quantity, setQuantity] = useState(coffeeQuantities[0]);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [receipt, setReceipt] = useState(null);
    const successDialogRef = useRef(null);
    const signInDialogRef = useRef(null);
    const [showSignInDialog, setShowSignInDialog] = useState(false);
    const total = quantity * coffeePrice;

    useEffect(() => {
        if (receipt && !successDialogRef.current?.open) {
            successDialogRef.current?.showModal();
        }
    }, [receipt]);

    useEffect(() => {
        if (showSignInDialog && !signInDialogRef.current?.open) {
            signInDialogRef.current?.showModal();
        }
    }, [showSignInDialog]);

    const pay = async () => {
        if (!isAuthenticated) {
            setShowSignInDialog(true);
            return;
        }

        if (!window.Razorpay) {
            setErrorMessage("The payment gateway is not ready. Please try again.");
            return;
        }

        setIsProcessing(true);
        setErrorMessage("");
        setReceipt(null);

        try {
            const order = await postPaymentRequest("/api/payments/order", {
                quantity,
                creatorUsername,
            });
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
                        const paymentReceipt = await postPaymentRequest(
                            "/api/payments/verify",
                            {
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                            },
                        );
                        setReceipt(paymentReceipt);
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
                setErrorMessage(response.error?.description || "Payment failed. Please try again.");
                setIsProcessing(false);
            });
            checkout.open();
        } catch (error) {
            if (error.status === 401) {
                setShowSignInDialog(true);
                setIsProcessing(false);
                return;
            }

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
                        aria-busy={!isScriptLoaded || isProcessing}
                        className="rounded-full bg-coffee px-7 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!isScriptLoaded || isProcessing}
                        title="Proceed to pay"
                        type="button"
                        onClick={pay}
                    >
                        {isProcessing || !isScriptLoaded ? (
                            <span
                                aria-hidden="true"
                                className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-warm-white/40 border-t-warm-white align-[-3px] motion-reduce:animate-none"
                            />
                        ) : null}
                        {isProcessing ? "Processing..." : isScriptLoaded ? "Buy Coffee" : "Loading payment..."}
                    </button>
                </div>
                {errorMessage && (
                    <p className="mt-4 text-sm text-red-700" role="alert">
                        {errorMessage}
                    </p>
                )}
            </section>
            <dialog
                aria-labelledby="payment-success-title"
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-coffee-border bg-warm-white p-0 text-espresso shadow-2xl backdrop:bg-espresso/60"
                ref={successDialogRef}
                onClose={() => setReceipt(null)}
            >
                {receipt && (
                    <div className="p-6 sm:p-8">
                        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                            Payment complete
                        </p>
                        <h2
                            className="mt-2 font-heading text-2xl font-bold text-espresso"
                            id="payment-success-title"
                        >
                            Thank you for your support!
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-mocha">
                            Your payment of{" "}
                            {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: receipt.currency,
                            }).format(receipt.amountInPaise / 100)}{" "}
                            has been confirmed.
                        </p>
                        <dl className="mt-5 space-y-3 rounded-xl bg-cream p-4 text-sm">
                            <div>
                                <dt className="font-semibold text-mocha">Razorpay order ID</dt>
                                <dd className="mt-1 break-all font-mono text-espresso">
                                    {receipt.orderId}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-mocha">Payment ID</dt>
                                <dd className="mt-1 break-all font-mono text-espresso">
                                    {receipt.paymentId}
                                </dd>
                            </div>
                        </dl>
                        <button
                            className="mt-6 w-full rounded-full bg-coffee px-6 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
                            onClick={() => successDialogRef.current?.close()}
                            type="button"
                        >
                            Done
                        </button>
                    </div>
                )}
            </dialog>
            <dialog
                aria-describedby="sign-in-required-description"
                aria-labelledby="sign-in-required-title"
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-coffee-border bg-warm-white p-0 text-espresso shadow-2xl backdrop:bg-espresso/60"
                ref={signInDialogRef}
                onClose={() => setShowSignInDialog(false)}
            >
                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-latte text-2xl">
                            <span aria-hidden="true">☕</span>
                        </div>
                        <button
                            aria-label="Close sign-in dialog"
                            className="rounded-full p-2 text-mocha transition-colors hover:bg-cream hover:text-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
                            onClick={() => signInDialogRef.current?.close()}
                            type="button"
                        >
                            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                    <h2
                        className="mt-5 font-heading text-2xl font-bold text-espresso sm:text-3xl"
                        id="sign-in-required-title"
                    >
                        Please Sign In to Proceed
                    </h2>
                    <p
                        className="mt-3 leading-7 text-mocha"
                        id="sign-in-required-description"
                    >
                        You need to sign in to your account before supporting a creator with a coffee.
                    </p>
                    <Link
                        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-coffee px-6 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
                        href={`/signin?callbackUrl=${encodeURIComponent(`/${creatorUsername}`)}`}
                    >
                        Sign In
                    </Link>
                </div>
            </dialog>
        </>
    );
};

export default PaymentPage;
