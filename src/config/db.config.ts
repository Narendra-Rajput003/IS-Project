import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
}