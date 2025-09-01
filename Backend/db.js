const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://dilkhush:dilkhush33@dilkhush0.dmmiqfu.mongodb.net/dilkhushdb?retryWrites=true&w=majority&appName=dilkhush0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30s timeout for server selection
});

const db = mongoose.connection;

// Connection successful
db.on("connected", () => {
    console.log("✅ MongoDB connected successfully.");
});

// Connection error
db.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
});

// Disconnected
db.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected.");
});

module.exports = db;
