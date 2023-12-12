import QRCodeHistory from "../models/qrCodeHistory.js";
import { calcNumberOfPages } from "../utils/helper.js";

async function fetchQRCodeHistories(req = new Request(), res = new Response()) {
  const limit = req.query.limit || 15;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  try {
    const qrCodeHistories = await QRCodeHistory.find(
      {},
      {},
      {
        sort: {
          createdAt: -1,
        },
        skip: skip,
        limit: limit,
      }
    );
    res.json({ qrCodeHistories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching QR code histories" });
  }
}
async function addNewQRCodeHistory(req = new Request(), res = new Response()) {
  const codesPerPage = +req.query.codesPerPage || 6;
  const { serial_number, qty_codes, printed_pages_number } = req.body;
  const lastCode = serial_number + (qty_codes - 1);
  const resultChecking = await checkSerialNumberOverlap(
    serial_number,
    lastCode
  );
  if (resultChecking.exists !== "not_exists") {
    return res.json({
      message: resultChecking.message,
      data: { exists: resultChecking.exists },
    });
  }
  const numberOfPages = calcNumberOfPages(qty_codes, codesPerPage);
  try {
    const qrCodeHistory = new QRCodeHistory({
      first_code: serial_number,
      qty_codes,
      last_code: lastCode,
      last_page_codes_number: qty_codes % codesPerPage,
      codes_per_page: codesPerPage,
      printed_pages_number: printed_pages_number,
      number_of_pages: numberOfPages,
    });
    const result = await qrCodeHistory.save();
    res.status(201).json({
      message: "QR code history added successfully",
      data: result.toJSON(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding QR code history" });
  }
}
async function getLatestCode(_ = new Request(), res = new Response()) {
  try {
    const latestCodeDocument = await QRCodeHistory.findOne(
      {},
      {},
      { sort: { last_code: -1 } }
    );
    if (latestCodeDocument) {
      const data = latestCodeDocument.toJSON();
      console.log("Latest Code Document:", latestCodeDocument);
      console.log("Latest Last Code:", latestCodeDocument.last_code);
      return res.json({
        message: "Done",
        data: data,
        latestCode: data.last_code,
      });
    } else {
      console.log("No documents found in the collection.");
      return res.json({
        message: "No documents found in the collection",
        latestCode: -1,
      });
    }
  } catch (error) {
    console.error("Error fetching latest code:", error);
    return res.json({
      message: "Error fetching latest code from server",
      latestCode: -1,
    });
  }
}
async function checkRangeInHistory(req = new Request(), res = new Response()) {
  const { serial_number, qty_codes } = req.query;
  const lastCode = +serial_number + +(qty_codes - 1);
  console.log(`CheckRangeInHistory: ${serial_number}, ${lastCode}`);

  const resultChecking = await checkSerialNumberOverlap(
    serial_number,
    lastCode
  );
  return res.json(resultChecking);
}
async function checkSerialNumberOverlap(serialNumber, lastCode) {
  const overlapQuery = {
    $or: [
      {
        $and: [
          //first_code >= serialNumber && last_code <= lastCode
          { first_code: { $gte: serialNumber } },
          { last_code: { $lte: lastCode } },
        ],
      },
      {
        $or: [
          {
            //first_code <= serialNumber && last_code >= serialNumber
            first_code: { $lte: serialNumber },
            last_code: { $gte: serialNumber },
          },
          //first_code <= lastCode && last_code >= lastCode
          { first_code: { $lte: lastCode }, last_code: { $gte: lastCode } },
        ],
      },
    ],
  };

  try {
    const overlappingDocuments = await QRCodeHistory.find(overlapQuery);

    if (overlappingDocuments.length > 0) {
      console.log("Overlap detected. Serial number range is already in use.");
      // Handle overlap case here if needed
      return {
        message: "Overlap detected. Serial number range is already in use.",
        exists: "exists",
      };
    } else {
      console.log("No overlap. Proceed with the insertion.");
      return {
        message: "No overlap. Proceed with the insertion.",
        exists: "not_exists",
      };
    }
  } catch (error) {
    console.error("Error checking for overlap:", error);
    return {
      message: "Error checking for overlap",
      exists: "error",
    };
  }
}

export {
  fetchQRCodeHistories,
  addNewQRCodeHistory,
  checkRangeInHistory,
  getLatestCode,
};
