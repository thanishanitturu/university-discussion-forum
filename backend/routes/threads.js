const express = require("express");
const Thread = require("../models/threads"); // Import Thread model
const Reply = require("../models/reply"); // Import Reply model
const router = express.Router();

// ✅ Create a new thread
router.post("/", async (req, res) => {
  try {
    const { title, content, author, authorId } = req.body;

    if (!title || !content || !author || !authorId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newThread = new Thread({ title, content, author, authorId });
    await newThread.save();

    res.status(201).json({ message: "Thread created successfully", newThread });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all threads
router.get("/", async (req, res) => {
  try {
    const threads = await Thread.find().populate("replies").sort({ createdAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get a single thread by ID
router.get("/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate("replies");
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Like a thread
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const thread = await Thread.findById(req.params.id);
    
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    // Add user to likes and remove from dislikes if present
    thread.likes.addToSet(userId);
    thread.dislikes.pull(userId);

    await thread.save();
    res.status(200).json({ message: "Thread liked", thread });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Dislike a thread
router.post("/:id/dislike", async (req, res) => {
  try {
    const { userId } = req.body;
    const thread = await Thread.findById(req.params.id);

    if (!thread) return res.status(404).json({ error: "Thread not found" });

    // Add user to dislikes and remove from likes if present
    thread.dislikes.addToSet(userId);
    thread.likes.pull(userId);

    await thread.save();
    res.status(200).json({ message: "Thread disliked", thread });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:threadId/replies", async (req, res) => {
  try {
    const { content, author, authorId } = req.body;
    const threadId = req.params.threadId;

    // Check if thread exists
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Create a new reply
    const reply = new Reply({ threadId, content, author, authorId });
    await reply.save();

    // Store the reply ID in the thread's replies array
    thread.replies.push(reply._id);
    await thread.save();

    res.status(201).json({ message: "Reply added", reply });
  } catch (error) {
    res.status(500).json({ message: "Error adding reply", error: error.message });
  }
});

// ✅ Delete a thread
router.delete("/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    // Delete all replies associated with this thread
    await Reply.deleteMany({ threadId: thread._id });

    // Delete the thread itself
    await thread.deleteOne();

    res.status(200).json({ message: "Thread and associated replies deleted successfully" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
