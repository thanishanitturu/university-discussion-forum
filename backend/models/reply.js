const mongoose=require("mongoose")

const replySchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true }, // Associated thread
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reply", replySchema);
