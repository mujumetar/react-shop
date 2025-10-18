const cron = require("node-cron");
const axios = require("axios");

const API_URL = "https://dilkhush-api-49h6.onrender.com/products"; // your live Render API URL

console.log("⏰ Cron job started: Pinging every 1 minute...");

cron.schedule("* * * * *", async () => {
  try {
    const res = await axios.get(API_URL);
    console.log(`✅ Ping success at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error("❌ Ping failed:", err.message);
  }
});
