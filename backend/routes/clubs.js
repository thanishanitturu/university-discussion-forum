const express = require("express");
const router = express.Router();
const multer = require("multer");
const Club = require("../models/clubs");
const authenticateUser = require('../middleware/authenticateUser'); 

// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Save files in the "uploads" directory
//   },

//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Unique filename
//   },
// });

const storage = multer.memoryStorage();
const upload = multer({ storage });


// Fetch all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find().populate("coordinator", "name email"); // Populate coordinator details
    const formattedClubs = clubs.map(club => ({
      ...club._doc,
      logo: club.logo?.data ? club.logo.data.toString("base64") : null, // Convert Buffer to Base64
    }));

    res.status(200).json(formattedClubs);

    
  } catch (error) {
    res.status(500).json({ message: "Error fetching clubs", error });
  }
});



router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { name, description, coordinator } = req.body; // Extract text fields

    if (!req.file) {
      return res.status(400).json({ message: "Logo image is required" });
    }
    // console.log(req.body)

    const newClub = new Club({
      name,
      description,
      coordinator,
      logo: {
        data: req.file.buffer, // Store image as binary buffer
        contentType: req.file.mimetype,
      },
      members: [coordinator],
    });

    const savedClub = await newClub.save();
    res.status(201).json(savedClub);
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({ message: "Error creating club", error: error.message });
  }
});



// Join a club
// router.post("/:clubId/join", authenticateUser, async (req, res) => {
//   const { clubId } = req.params;
//   const userId = req.user.id; // Get the current user's ID

//   try {
//     const club = await Club.findById(clubId);
//     if (!club) {
//       return res.status(404).json({ message: "Club not found" });
//     }

//     // Check if the user is already a member
//     if (club.members.includes(userId)) {
//       return res.status(400).json({ message: "User is already a member" });
//     }

//     // Add the user to the members list
//     club.members.push(userId);
//     await club.save();

//     res.status(200).json(club);
//   } catch (error) {
//     res.status(500).json({ message: "Error joining club", error });
//   }
// });

router.post("/:clubId/join", authenticateUser, async (req, res) => {
  const { clubId } = req.params;
  const userId = req.user.id; // Get the current user's ID
  const userName = req.user.name; // Get the user's name

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if the user is already a member
   if (club.members.includes(userName)) {
  return res.status(400).json({ message: "User is already a member" });
}


    // Add user as an object with id and name
    club.members.push(userName );
    await club.save();

    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ message: "Error joining club", error });
  }
});




router.delete("/:clubId", authenticateUser, async (req, res) => {
  try {
    const { clubId } = req.params;

    // Find the club
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Ensure only the coordinator can delete the club
    

    // Delete the club
    await Club.findByIdAndDelete(clubId);
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ message: "Error deleting club", error: error.message });
  }
});


router.get("/clubs/:id/logo", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club || !club.logo.data) {
      return res.status(404).send("Image not found");
    }
    res.set("Content-Type", club.logo.contentType);
    res.send(club.logo.data);
  } catch (error) {
    res.status(500).send("Error retrieving image");
  }
});


module.exports = router;