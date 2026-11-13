import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      unique: true,
    },
    amountInPaise: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, uppercase: true },
    quantity: { type: Number, required: true, min: 1 },
    creatorUsername: { type: String, required: true, trim: true, lowercase: true },
    razorpay_order_id: { type: String, required: true, unique: true },
    razorpay_payment_id: { type: String, required: true, unique: true },
    method: { type: String, required: true },
    email: { type: String, default: null, trim: true, lowercase: true },
    contact: { type: String, default: null, trim: true },
    status: { type: String, enum: ["captured"], required: true },
    capturedAt: { type: Date, default: null },
  },
  {
    collection: "payments",
    timestamps: true,
  },
);

export default mongoose.models.SuccessfulPayment
  || mongoose.model("SuccessfulPayment", paymentSchema);