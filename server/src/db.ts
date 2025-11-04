import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Meeting from "./models/meeting";

let mongoServer: MongoMemoryServer;

const connectDB = async () => {
  try {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log("MongoDB Memory Server connected...");

    // Optional: Clear existing data and insert dummy data
    await resetDatabase();

    console.log("Database reset completed...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Function to reset database
const resetDatabase = async () => {
  console.log("Resetting database - PLEASE WAIT...");

  // Example: Drop collections or specific documents
  await Meeting.deleteMany({});

  const meetings = [];
  const now = new Date().getTime();

  for (let i = 0; i < 100; i++) {
    const randomStartDate = new Date(
      // Random date between now and 24 hours later
      now + Math.floor(Math.random() * 1000 * 60 * 60 * 24)
    );

    meetings.push({
      title: `Dummy Meeting ${i + 1}`,
      startTime: randomStartDate,
      endTime: new Date(randomStartDate.getTime() + 60 * 60 * 1000), // 1 hour later
    });
  }

  await Meeting.insertMany(meetings);
};

export default connectDB;
