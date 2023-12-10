import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { connect } from "./config/database.js"; // Import

import qrCodeHistoryRoutes from "./app/routes/qrCodeHistoryRoutes.js";
config();
const app = express();
const port = 3000; // Choose the port number you prefer
const db_connection_string = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/qr-code-history", qrCodeHistoryRoutes);
app.get("/api", async (_, res) => {
  res.json({ message: "QR Code History API" });
});

// Start the server
app.listen(port, () => {
  connect(db_connection_string);
  console.log(`Server running on port ${port}`);
});
