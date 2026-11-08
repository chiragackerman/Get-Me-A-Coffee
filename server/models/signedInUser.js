import mongoose from "mongoose";

const signedInUserSchema = new mongoose.Schema(
  {
    authUserId: { type: String, required: true, unique: true },
    provider: { type: String, required: true, enum: ["google", "github"] },
    providerAccountId: { type: String, required: true },
    name: { type: String, default: null },
    email: { type: String, default: null, lowercase: true, trim: true },
    profileImage: { type: String, default: "/user_pofile_icon.png" },
    firstSignInAt: { type: Date, required: true },
    lastSignInAt: { type: Date, required: true },
    signInCount: { type: Number, default: 0, min: 0 },
  },
  {
    collection: "signed_in_users",
    timestamps: true,
  },
);

export default mongoose.models.SignedInUser
  || mongoose.model("SignedInUser", signedInUserSchema);
