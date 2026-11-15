import {
  getAuthenticatedSender,
  PaymentServiceError,
  verifyRazorpayPayment,
} from "@/server/paymentService";

export async function POST(request) {
  try {
    const sender = await getAuthenticatedSender();
    let body;

    try {
      body = await request.json();
    } catch {
      throw new PaymentServiceError("Invalid payment verification request.");
    }

    const receipt = await verifyRazorpayPayment(
      sender,
      body?.orderId,
      body?.paymentId,
      body?.signature,
    );
    return Response.json(receipt);
  } catch (error) {
    if (error instanceof PaymentServiceError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    console.error("Could not verify the Razorpay payment.", error);
    return Response.json(
      { error: "Could not verify the payment. Please contact support." },
      { status: 500 },
    );
  }
}
