import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    authUserId: { type: String, required: true },
    username: { type: String, required: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    provider: { type: String, required: true, enum: ["google", "github"] },
    profileImage: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: null },
    creatorCategory: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

userSchema.index({ authUserId: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

export default mongoose.models.CreatorProfile
  || mongoose.model("CreatorProfile", userSchema);