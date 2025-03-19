// routes/announcements.js
const express = require("express");
const router = express.Router();
const Jobs = require("../models/jobs"); // Import the Announcement model
const authenticateUser = require('../middleware/authenticateUser'); 


// GET: Fetch all announcements
// router.get("/", async (req, res) => {
//   try {
//     const jobs = await Jobs.find().populate("postedBy", "name");
//     // Populate createdBy with user name
//     console.log(jobs)
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching announcements" });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const jobs = await Jobs.find();

    const populatedJobs = await Jobs.find().populate("postedBy", "name");
   

    res.json(populatedJobs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});


// POST: Create a new announcement
router.post('/', authenticateUser, async (req, res) => {
  const { title, description,applyLink} = req.body;
  const postedBy=req.user.id // Log request body
// Get user name from the authenticated user
  

  try {
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
   

    // Create a new announcement
    const newJob = new Jobs({
      title,
      description,
      applyLink,
      postedBy,
    });

   
    // Save the announcement to the database
    const savedJob = await newJob.save();
    console.log("job Saved:", savedJob); // Log the saved announcement
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error Details:", error); // Log the full error object
  }
});

router.delete("/:id",async(req,res)=>
{
    try {
    const jobId=req.params.id;

    const job = await Jobs.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: "Club not found" });
    }

    // Ensure only the coordinator can delete the club
    

    // Delete the club
    await Jobs.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
    console.error("Error deleting JOb:", error);
    res.status(500).json({ message: "Error deleting Job", error: error.message });
    }
})

module.exports = router;