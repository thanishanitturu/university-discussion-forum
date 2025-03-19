const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const Schedule = require("../models/schedule");
require("dotenv").config();

const router = express.Router();

// ✅ Initialize GridFSBucket
let gridfsBucket;
mongoose.connection.once("open", () => {
  gridfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads", // Custom bucket name
  });
  console.log("✅ GridFSBucket initialized");
});

// ✅ Setup Multer Storage for GridFS
const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ storage });

// ✅ Fetch All Schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("uploadedBy", "name");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error: error.message });
  }
});

// ✅ Upload New Schedule
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, uploadedBy } = req.body;
    const fileName = `${Date.now()}-${req.file.originalname}`; // Unique filename

    // Upload file to GridFS
    const uploadStream = gridfsBucket.openUploadStream(fileName, {
      metadata: { uploadedBy }, // Optional metadata
    });

    uploadStream.end(req.file.buffer, async () => {
      const fileId = uploadStream.id; // Get the file ID
      const fileUrl = `http://localhost:5000/schedules/file/${fileId}`;

      // Save schedule details to MongoDB
      const newSchedule = new Schedule({
        title,
        description,
        date: new Date(),
        fileId,
        fileName,
        fileUrl,
        uploadedBy,
      });

      await newSchedule.save();
      res.status(201).json(newSchedule);
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading schedule", error: error.message });
  }
});

// ✅ Retrieve and Stream File from GridFS
router.get("/file/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if file exists
    const file = await mongoose.connection.db.collection("uploads.files").findOne({ _id: fileId });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Stream file to the client
    res.set("Content-Type", file.contentType || "application/octet-stream");
    const downloadStream = gridfsBucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving file", error: error.message });
  }
});

// ✅ Delete a File
router.delete("/file/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Delete file from GridFS
    await gridfsBucket.delete(fileId);

    // Delete file reference from database
    await Schedule.findOneAndDelete({ fileId });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
});

module.exports = router;