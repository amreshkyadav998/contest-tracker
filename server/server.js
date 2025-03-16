import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";
import  fetchAndSaveContests  from "./utils/scrapper.js";

import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Fetch contest data on server start
fetchAndSaveContests();

// Schedule to update contest data every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Fetching latest contest data...");
  await fetchAndSaveContests();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/contests", contestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
