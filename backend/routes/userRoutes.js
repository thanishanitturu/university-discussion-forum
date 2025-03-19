const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Add a user
router.post("/add", async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "User added successfully" });
});

module.exports = router;
