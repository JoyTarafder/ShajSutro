import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  connectionPromise = mongoose.connect(uri, {
    dbName: "shajsutro",
  });

  try {
    const conn = await connectionPromise;
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    connectionPromise = null;
    throw error;
  }
};

export default connectDB;
