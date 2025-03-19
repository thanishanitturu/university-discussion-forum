const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // ⏳ Auto-delete in 5 min
});

module.exports = mongoose.model("Otp", OtpSchema);
