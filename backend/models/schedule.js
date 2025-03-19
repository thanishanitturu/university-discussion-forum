const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // GridFS file ID
  fileName: { type: String, required: true }, // Name of the uploaded PDF file
  fileUrl: { type: String, required: true }, // Public URL to access the file
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User ", required: true }, // Admin who uploaded the file
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
