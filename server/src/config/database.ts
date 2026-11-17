import mongoose from "mongoose";
import { config } from "./index.js";

export async function connectDB(): Promise<typeof mongoose> {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const conn = await mongoose.connect(config.mongoUri);
    return conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}

