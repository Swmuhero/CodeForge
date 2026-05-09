import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);

  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
