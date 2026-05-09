import mongoose from "mongoose";
import { SUPPORTED_LANGUAGES } from "../config/languages.js";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true
    },
    code: { type: String, required: true },
    language: {
      type: String,
      enum: SUPPORTED_LANGUAGES,
      required: true
    },
    result: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded"],
      required: true,
      index: true
    },
    executionTimeMs: { type: Number, default: 0 },
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 }
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
submissionSchema.index({ userId: 1, result: 1 });

export default mongoose.model("Submission", submissionSchema);
