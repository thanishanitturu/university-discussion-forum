const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User ", required: true }, // Reference to the user who posted the job
  applyLink: { type: String, required: true }, // Link to apply for the job
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);