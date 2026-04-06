import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Paper || mongoose.model("Paper", paperSchema);
