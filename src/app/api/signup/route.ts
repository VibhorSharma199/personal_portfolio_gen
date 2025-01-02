import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/models/UserModel.js";
import { dbConnect } from "@/dbConfig/dbConfig.js";
import bcryptjs from "bcryptjs";
dbConnect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { name, email, password } = reqBody;
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all fields", success: false },
        { status: 401 }
      );
    }
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      return NextResponse.json(
        { message: "User already exist", success: false },
        { status: 401 }
      );
    }
    const hashedPass = await bcryptjs.hash(password, 10);
    await new userModel({
      name,
      email,
      password: hashedPass,
    }).save();
    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: { name, email },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error occoured", error: error, success: false },
      { status: 500 }
    );
  }
}
