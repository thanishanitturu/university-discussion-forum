const express = require("express");
const cors = require("cors");
const {connectDB} = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
// const passport = require("passport");
const session = require("express-session");
// require("./config/passport"); // Import Google strategy
const authRoutes = require("./routes/auth");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");
const announcementsRoutes=require("./routes/announcements");
const clubsRoutes=require('./routes/clubs');
const threadRoutes=require('./routes/threads');
const alumniRoutes=require('./routes/alumni');
const jobRoutes=require('./routes/jobs');
const scheduleRoutes=require('./routes/schedule')
const userRoutes=require('./routes/user');

dotenv.config();
connectDB();

const app = express();

app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// ✅ Add express-session middleware BEFORE passport.initialize()
app.use(
  session({
    secret: process.env.JWT_SECRET || "yourSecretKey", // Use a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // ✅ Secure cookies only in production
  })
);

// ✅ Initialize Passport AFTER express-session
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/auth/google/callback", // ✅ Dynamic callback URL
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           user = new User({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             profilePicture: profile.photos[0].value,
//           });
//           await user.save();
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

app.use("/auth", authRoutes);
app.use("/announcements",announcementsRoutes);
app.use("/clubs",clubsRoutes);
app.use("/threads",threadRoutes);
app.use("/alumni",alumniRoutes);
app.use("/jobs",jobRoutes);
app.use("/schedules",scheduleRoutes);
app.use("/users",userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
