import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User schema
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["email_verification", "password_reset"], // Purpose of the OTP
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true, // Expiry time for the OTP
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

export const Otp = mongoose.model("Otp", otpSchema);
