import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lower: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lower: true,
    },
    password: {
      type: String,
      select: false,
    },
    provider: { type: String, default: "local" }, // e.g., "local", "google", "github"
    providerId: { type: String }, // ID from OAuth provider
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
