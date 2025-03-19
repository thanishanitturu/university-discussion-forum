const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }, // Store user name
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store user ID
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who disliked
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }], // References to replies
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Thread", threadSchema);
