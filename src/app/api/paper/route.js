import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Paper from "@/models/Paper";
import { connectToDB } from "@/utils/connectToDb";
import { getCurrentUser } from "@/utils/auth";
export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const user = await getCurrentUser();
    if(!user){
      return NextResponse.json(
        {success: false, message: "Unauthorised req"}, 
        {status: 401}
      )
    } 
    const {
      title,
      duration,
      description,
      subjects,
    } = body;

    console.log("Received paper data:", body);
    // 🔴 Required fields check
    if (!title || !duration || !description) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // 🔴 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    // 🔴 Logical validations
    if (duration <= 0) {
      return NextResponse.json(
        { success: false, message: "Duration must be greater than 0" },
        { status: 400 }
      );
    }

    // ✅ Create paper
    const paper = await Paper.create({
      userId: user._id,
      ...body,
    });

    return NextResponse.json(
      {
        success: true,
        data: paper,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating paper:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}