const express = require("express");
const router = express.Router();
const Alumni = require("../models/alumni"); // Import the Alumni model
const multer=require('multer');
const authenticateUser = require('../middleware/authenticateUser'); 


const storage = multer.memoryStorage();
const upload = multer({ storage });

//fetch alumni
router.get("/", async (req, res) => {
  try {
    const alumnis = await Alumni.find()
    const formattedAlumni = alumnis.map(alumni => ({
      ...alumni._doc,
      profile: alumni.profile?.data ? alumni.profile.data.toString("base64") : null, // Convert Buffer to Base64
    }));
    res.status(200).json(formattedAlumni);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/alumni/:id/profile", async (req, res) => {
    try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni || !alumni.profile.data) {
        return res.status(404).send("Image not found");
    }
    res.set("Content-Type", alumni.profile.contentType);
    res.send(alumni.profile.data);
    } catch (error) {
    res.status(500).send("Error retrieving image");
    }
});

router.post("/", upload.single("profile"), async (req, res) => {
  try {
    const { alumniName, jobDescription, contactInfo } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // Create a new alumni object
    const newAlumni = new Alumni({
      profile: {
        data: req.file.buffer, // Store image as binary buffer
        contentType: req.file.mimetype, // Store MIME type of the image
      },
      alumniName,
      jobDescription,
      contactInfo, // Parse contactInfo if it's sent as a JSON string
    });

    // Save the new alumni to the database
    await newAlumni.save();

    // Respond with the created alumni
    res.status(201).json(newAlumni);
  } catch (error) {
    console.error("Error creating alumni:", error);
    res.status(500).json({ message: "Error creating alumni", error });
  }
});



router.delete("/:id", async (req, res) => {
    try {
    const alumniId=req.params.id;

    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
        return res.status(404).json({ message: "Club not found" });
    }

    // Ensure only the coordinator can delete the club
    

    // Delete the club
    await Alumni.findByIdAndDelete(alumniId);
    res.status(200).json({ message: "Alumni deleted successfully" });
    } catch (error) {
    console.error("Error deleting Alumni:", error);
    res.status(500).json({ message: "Error deleting Alumni", error: error.message });
    }
    
});


module.exports = router;