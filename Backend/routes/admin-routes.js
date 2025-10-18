const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load env variables
dotenv.config();

// Import routes
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoute"); // your admin route file

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for image uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inventoryDB")
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

// Test root route
app.get("/", (req, res) => {
    res.send("🚀 Inventory API is running successfully!");
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
