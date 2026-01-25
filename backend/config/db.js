import mongoose from "mongoose";

const connectDB = async (mongoURI) => {
  try {
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }

  // Handle disconnections gracefully
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔁 MongoDB reconnected successfully!");
  });
};

export default connectDB;
