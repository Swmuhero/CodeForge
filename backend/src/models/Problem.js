import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    explanation: { type: String, default: "" }
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    Java: { type: String, default: "" },
    JS: { type: String, default: "" },
    Python: { type: String, default: "" },
    "C++": { type: String, default: "" }
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true
    },
    constraints: [{ type: String, required: true }],
    tags: [{ type: String, index: true }],
    publicTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
    starterCode: starterCodeSchema
  },
  { timestamps: true }
);

problemSchema.index({ title: "text", tags: "text", description: "text" });

export default mongoose.model("Problem", problemSchema);
