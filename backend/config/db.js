const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient, GridFSBucket } = require("mongodb");

let db, gridfsBucket;

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully!");

        // ✅ Connect using MongoClient for GridFSBucket
        const client = new MongoClient(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        db = client.db(process.env.DB_NAME); // Replace with your actual database name
        gridfsBucket = new GridFSBucket(db, { bucketName: "uploads" });

        console.log("✅ GridFSBucket initialized successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

// ✅ Correctly export the function and variables
module.exports = { connectDB, db, gridfsBucket };
