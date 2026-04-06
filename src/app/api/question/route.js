import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Question from "@/models/Question";
import { connectToDB } from "@/utils/connectToDb";


export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      paperId,
      questionText,
      image,
      type,
      category,
      options,
      correctAnswer,
      marks,
      negativeMarks,
      explanation,
    } = body;

    // 🔴 Basic validation
    if (!paperId || !questionText || !type || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔴 Type-based validation
    if (type === "mcq") {
      if (!options || options.length < 2) {
        return NextResponse.json(
          { success: false, message: "MCQ must have at least 2 options" },
          { status: 400 }
        );
      }

      const hasCorrect = options.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        return NextResponse.json(
          { success: false, message: "At least one correct option required" },
          { status: 400 }
        );
      }
    }

    if (type === "numerical") {
      if (correctAnswer === undefined || correctAnswer === null) {
        return NextResponse.json(
          { success: false, message: "Numerical must have correctAnswer" },
          { status: 400 }
        );
      }
    }

    // ✅ Create question
    const question = await Question.create({
      paperId,
      questionText,
      image,
      type,
      category,
      options: type === "mcq" ? options : [],
      correctAnswer: type === "numerical" ? correctAnswer : null,
      marks,
      negativeMarks,
      explanation,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Question created successfully",
        data: question,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question:", error);

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