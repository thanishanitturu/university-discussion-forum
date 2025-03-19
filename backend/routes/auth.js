const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Otp = require("../models/Otp");



const router = express.Router();

// JWT Token Generation
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, userType: user.userType }, // Include user details in the token payload
    process.env.JWT_SECRET 
  );
};



router.post("/signup", async (req, res) => {
  const { name, email, password, userType } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    // Create a new user instance
    user = new User({ name, email, password: await bcrypt.hash(password, 10), userType });
    // Save the user to the database
    await user.save();
    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err); 
    // Log the error for debugging
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(err.errors).map(err => err.message).join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
});
// Route to handle user type selection
// router.post('/save-user-type', async (req, res) => {
//   console.log("Received Data:", req.body); // Log the request body
//   const { userType, googleId, name, email } = req.body;
//   if (!userType || !googleId || !name || !email) {
//     console.log("Missing Fields:", { userType, googleId, name, email });
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     let existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const newUser = new User({ googleId, name, email, userType, verified: true });
//     await newUser.save();
//     const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.status(201).json({ message: "User saved successfully", token });
//   } catch (error) {
//     console.error("Error saving user to database:", error.message);
//     res.status(500).json({ message: "Error saving user to database" });
//   }
// });

// router.post('/save-user-type', async (req, res) => {
//   console.log("Received Data:", req.body); // Log the request body

//   const { userType, googleId, name, email } = req.body;

//   if (!userType || !googleId || !name || !email) {
//     console.log("Missing Fields:", { userType, googleId, name, email });
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     let existingUser = await User.findOne({ email });

//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found. Please sign up first." });
//     }

//     // Update the userType
//     existingUser.userType = userType;
//     await existingUser.save();

//     const token = jwt.sign({ id: existingUser._id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.status(200).json({ message: "User type updated successfully", token });
//     const redirectURL=`${process.env.CLIENT_URL}/login`;
//     res.redirect(redirectURL)
//   } catch (error) {
//     console.error("Error updating user type:", error.message);
//     res.status(500).json({ message: "Error updating user type" });
//   }
// });



// Login with Email & Password
router.post("/login", async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (user.userType !== userType) return res.status(400).json({ message: "Invalid user type" });

        const token = generateToken(user);
        return res.json({ token, user, message: "Login successful" }); // Ensure message is returned
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});


// Google OAuth Authentication
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   async (req, res) => {
//     try {
//       console.log("User Data:", req.user);

//       let user = await User.findOne({ email: req.user.email });

//       if (!user) {
//         // Redirect new users to select user type
//         const redirectUrl = `${process.env.CLIENT_URL}/select-user-type?email=${req.user.email}&name=${req.user.displayName}&googleId=${req.user.id}`;
//         return res.redirect(redirectUrl);
//       }

//       // If the user exists but doesn't have a userType, ask them to select it
//       if (!user.userType) {
//         const redirectUrl = `${process.env.CLIENT_URL}/select-user-type?email=${user.email}&name=${user.name}&googleId=${user.googleId}`;
//         return res.redirect(redirectUrl);
//       }

//       // Existing user with userType: Generate token and redirect to the main app
//       const token = generateToken(user);
//       res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
//     } catch (error) {
//       console.error("Error in Google callback:", error.message);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   async (req, res) => {
//     try {
//       console.log("User Data:", req.user);

//       let user = await User.findOne({ email: req.user.email });

//       if (!user) {
//         // Create a new user with only basic details
//         user = new User({
//           googleId: req.user.id,
//           name: req.user.displayName,
//           email: req.user.email,
//           verified: true, // Mark Google users as verified
//         });
//         await user.save();
//       }

//       // If the user doesn't have a userType, redirect them to select one
//       if (!user.userType) {
//         const redirectUrl = `${process.env.CLIENT_URL}/select-user-type?email=${user.email}&name=${user.name}&googleId=${user.googleId}`;
//         return res.redirect(redirectUrl);
//       }

//       // Existing user with userType: Generate token and redirect to main app
//       const token = generateToken(user);
//       res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
//     } catch (error) {
//       console.error("Error in Google callback:", error.message);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );


module.exports = router;
