import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
      index: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      enum: ["mcq", "numerical"],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ MCQ Options
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],

    // ✅ For numerical
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
    },

    // 🔥 NEW FIELDS
    marks: {
      type: Number,
      required: true,
      default: 4,
      min: 0,
    },

    negativeMarks: {
      type: Number,
      default: 1,
      min: 0,
    },

    explanation: {
      type: String,
    },
  },
  { timestamps: true },
);


export default mongoose.models.Question || mongoose.model("Question", questionSchema);