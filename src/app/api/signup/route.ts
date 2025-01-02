import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/models/UserModel";
import { Otp } from "@/models/otpModel"; // Separate OTP Schema
import { dbConnect } from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/utils/sendEmail"; // Utility function for email
dbConnect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { name, email, password } = reqBody;

    // Check for required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all fields", success: false },
        { status: 401 }
      );
    }

    // Check if the user already exists
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 401 }
      );
    }

    // Hash the user's password
    const hashedPass = await bcryptjs.hash(password, 10);

    // Create the user
    const newUser = await new userModel({
      name,
      email,
      password: hashedPass,
    }).save();

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP in the database
    await Otp.create({
      userId: newUser._id,
      otp,
      purpose: "email_verification",
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
    });

    // Send the OTP to the user's email
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP for email verification is: ${otp}`,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "User created successfully. Check your email for the OTP.",
        success: true,
        user: { name, email },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      // Narrow down the type of error
      console.error("Error in registration:", error.message);
      return NextResponse.json(
        { message: "Error occurred", error: error.message, success: false },
        { status: 500 }
      );
    } else {
      // Handle cases where error is not an instance of Error
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { message: "An unexpected error occurred", success: false },
        { status: 500 }
      );
    }
  }
}
