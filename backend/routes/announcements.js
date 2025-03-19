// routes/announcements.js
const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcements"); // Import the Announcement model
const authenticateUser = require('../middleware/authenticateUser'); 


// GET: Fetch all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("createdBy", "name"); // Populate createdBy with user name
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements" });
  }
});

// POST: Create a new announcement
router.post('/', authenticateUser, async (req, res) => {
  const { title, description } = req.body;
  console.log("Request Body - Title:", title, "Description:", description); // Log request body
  const createdBy = req.user.name; // Get user name from the authenticated user
  console.log("Request User:", req.user); // Log the authenticated user

  try {
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Create a new announcement
    const newAnnouncement = new Announcement({
      title,
      description,
      createdBy,
    });

    // Save the announcement to the database
    const savedAnnouncement = await newAnnouncement.save();
    console.log("Announcement Saved:", savedAnnouncement); // Log the saved announcement
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error("Error Details:", error); // Log the full error object

    // Handle specific types of errors
    if (error.name === 'ValidationError') {
      // Mongoose validation error (e.g., missing required fields)
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    } else if (error.name === 'MongoError' && error.code === 11000) {
      // MongoDB duplicate key error (e.g., unique constraint violation)
      return res.status(400).json({ message: 'Duplicate Key Error', error: error.message });
    } else if (error.name === 'CastError') {
      // Mongoose cast error (e.g., invalid data type)
      return res.status(400).json({ message: 'Invalid Data Type', error: error.message });
    } else {
      // Generic server error
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
});

module.exports = router;