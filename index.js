import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { connect } from "./config/database.js"; // Import
// import { getConnectionInfo } from "./config/connection";
import qrCodeHistoryRoutes from "./app/routes/qrCodeHistoryRoutes.js";
config();
const app = express();
const port = 3000; // Choose the port number you prefer
// const db_connection_string = process.env.MONGODB_URI;
const db_connection_string = process.env.DATABASE_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/qr-code-history", qrCodeHistoryRoutes);
app.get("/api", async (_, res) => {
  res.json({ message: "QR Code History API" });
});

// Start the server
app.listen(port, async () => {
  // var connectionInfo = await getConnectionInfo();
  connect(db_connection_string);
  console.log(`Server running on port ${port}`);
});
