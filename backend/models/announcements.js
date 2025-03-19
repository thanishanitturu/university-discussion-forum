const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the announcement
createdBy:{type:String,required:true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Announcement", announcementSchema);