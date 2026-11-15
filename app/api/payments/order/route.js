import {
  getAuthenticatedSender,
  initiateRazorpay,
  PaymentServiceError,
} from "@/server/paymentService";

export async function POST(request) {
  try {
    const sender = await getAuthenticatedSender();
    let body;

    try {
      body = await request.json();
    } catch {
      throw new PaymentServiceError("Invalid payment request.");
    }

    const order = await initiateRazorpay(sender, body?.quantity, body?.creatorUsername);
    return Response.json(order);
  } catch (error) {
    if (error instanceof PaymentServiceError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    console.error("Could not create a Razorpay order.", error);
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }
}
