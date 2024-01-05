import mongoose from "mongoose";

const qrCodeHistorySchema = new mongoose.Schema({
  first_code: {
    type: Number,
    required: true,
  },
  last_code: {
    type: Number,
    required: true,
  },
  qty_codes: {
    type: Number,
    required: true,
  },
  number_of_pages: { type: Number, required: true },
  codes_per_page: { type: Number, required: true },
  printed_pages_number: {
    type: Number,
    require: true,
  },
  last_page_codes_number: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: false,
  },
  suffix: {
    type: String,
    required: false,
  },
});
const QRCodeHistory = mongoose.model("QRCodeHistory", qrCodeHistorySchema);
export default QRCodeHistory;
