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
      type: String, // URL (Cloudinary / S3 / etc.)
      default: null,
    },

    type: {
      type: String,
      enum: ["mcq", "numerical"],
      required: true,
    },

    category: {
      type: String, // user-defined (Physics, Math, etc.)
      required: true,
      trim: true,
    },

    options: [
      {
        type: String,
      },
    ],

    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      // string (MCQ) or number (numerical)
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Question ||
  mongoose.model("Question", questionSchema);
