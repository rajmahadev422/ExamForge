import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/utils/connectToDb";
import Question from "@/models/Question";


export async function GET(req, { params }) {
  if(!params) return NextResponse.json(
    {success: false, message: "params are not defined"}, {status:400}
  ) 
  try {
    await connectToDB();

    const { paperId } = await params;
    // 🔴 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return NextResponse.json(
        { success: false, message: "Invalid paperId" },
        { status: 400 }
      );
    }

    // ✅ Fetch questions
    const questions = await Question.find({ paperId })
      .sort({ createdAt: 1 }); // optional: keep order

    if (!questions.length) {
      return NextResponse.json(
        { success: false, message: "No questions found for this paper" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: questions.length,
        data: questions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);

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