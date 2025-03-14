import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import cron from "node-cron";
import Contest from "./models/Contest.js";
import contestRoutes from "./routes/contestRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Fetch LeetCode contests every 6 hours
cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("📡 Fetching LeetCode contest data...");
    const response = await axios.get("https://leetcode.com/contest/api/list/");
    
    if (!response.data || !response.data.contests) {
      throw new Error("Invalid API response");
    }

    const contests = response.data.contests.map(({ title, start_time }) => ({
      contest_name: title,
      start_time,
    }));

    await Contest.deleteMany({});
    await Contest.insertMany(contests);

    console.log("✅ Updated LeetCode Contests Data");
  } catch (error) {
    console.error("❌ Error fetching contests:", error);
  }
});

app.use("/api/contests", contestRoutes);
app.use("/api/solutions", solutionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
