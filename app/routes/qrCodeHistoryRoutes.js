import { Router } from "express";
import {
  addNewQRCodeHistory,
  checkRangeInHistory,
  fetchQRCodeHistories,
  getLatestCode,
} from "../controllers/qrCodeHistoryController.js";
const qrCodeHistoryRoutes = Router();
qrCodeHistoryRoutes.post("/history", addNewQRCodeHistory);
qrCodeHistoryRoutes.get("/histories", fetchQRCodeHistories);
qrCodeHistoryRoutes.get("/latest-code-history", getLatestCode);
qrCodeHistoryRoutes.get("/check-range-in-history", checkRangeInHistory);
export default qrCodeHistoryRoutes;
