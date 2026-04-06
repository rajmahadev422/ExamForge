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
      default: 0,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
      min: 1,
    },
    subject:{
      type: [],
      required: true, 
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    attempts:{
      type: Number,
      default: 0,
      required: true
    }
  },
  { timestamps: true },
);

export default mongoose.models.Paper || mongoose.model("Paper", paperSchema);
