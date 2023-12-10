import mongoose from "mongoose";

async function connect(uri) {
  try {
    console.log("waiting for connection with database...");
    await mongoose.connect(uri);
    console.log("Database is connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}
export { connect };
