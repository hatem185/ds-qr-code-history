import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { connect } from "./config/database.js"; // Import
// import { getConnectionInfo } from "./config/connection.js";
import qrCodeHistoryRoutes from "./app/routes/qrCodeHistoryRoutes.js";
config();
const app = express();
const port = 3000; // Choose the port number you prefer
// const db_connection_string = process.env.MONGODB_URI;
const ENVITONMENT = process.env.ENVIRONMENT;
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/qr-code-history", qrCodeHistoryRoutes);
app.get("/api", async (_, res) => {
  res.json({ message: "QR Code History API" });
});

// Start the server
app.listen(port, async () => {
  let db_connection_string = "";
  if (ENVITONMENT === "development") {
    db_connection_string = process.env.LOCAL_DATABASE_URL;
  } else {
    //   db_connection_string = (await getConnectionInfo()).DATABASE_URL;
    db_connection_string = process.env.RENDER_DATABASE_URL;
  }
  connect(db_connection_string);

  console.log(`Server running on port ${port}`);
});
