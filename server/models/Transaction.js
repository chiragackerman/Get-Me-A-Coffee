import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amountInPaise: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
    creatorUsername: { type: String, required: true, trim: true, lowercase: true },
    senderUserId: { type: String, trim: true },
    senderName: { type: String, trim: true, default: null },
    senderEmail: { type: String, trim: true, lowercase: true, default: null },
    razorpay_order_id: { type: String, required: true, unique: true },
    razorpay_payment_id: { type: String, default: null },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: { type: Date, default: null },
  },
  {
    collection: "transactions",
    timestamps: true,
  },
);

export default mongoose.models.Transaction
  || mongoose.model("Transaction", transactionSchema);
