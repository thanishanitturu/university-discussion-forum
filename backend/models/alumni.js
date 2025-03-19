const mongoose = require("mongoose");

const alumni = new mongoose.Schema({
  profile: {
    data: Buffer,
    contentType: String,
  }, 
  alumniName: { type: String, required: true }, // Name of the alumni
  jobDescription: { type: String, required: true }, // Job description of the alumni
  contactInfo: { // Contact information of the alumni
    email: { type: String, required: true },
    linkedIn: { type: String }, // Optional LinkedIn profile
    phone: { type: String }, // Optional phone number
  },
 });

module.exports = mongoose.model("Alumni", alumni);