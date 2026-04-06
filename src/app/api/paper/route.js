import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Paper from "@/models/Paper";
import { connectToDB } from "@/utils/connectToDb";


export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      userId,
      title,
      duration,
      totalQuestions,
      description,
    } = body;

    // 🔴 Required fields check
    if (!userId || !title || !duration || !totalQuestions) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // 🔴 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
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

    if (totalQuestions <= 0) {
      return NextResponse.json(
        { success: false, message: "Total questions must be at least 1" },
        { status: 400 }
      );
    }

    // ✅ Create paper
    const paper = await Paper.create({
      userId,
      title,
      duration,
      totalQuestions,
      description,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Paper created successfully",
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