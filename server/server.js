import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";
import  fetchAndSaveContests  from "./utils/scrapper.js";
import {fetchCodeChefContests} from "./controllers/fetchCodechef.js"
import { fetchCodeforcesContests } from "./controllers/fetchcodeforces.js";
import { fetchLeetCodeContests } from "./controllers/fetchleetcode.js";

import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/contests";
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(" Connected to MongoDB");
}).catch((error) => console.error(" MongoDB connection error:", error));

// Fetch contest data on server start
// fetchAndSaveContests();
fetchCodeChefContests();
fetchCodeforcesContests();
fetchLeetCodeContests();
cron.schedule("0 * * * *", fetchAndSaveContests);
cron.schedule("0 * * * *", fetchCodeChefContests);
cron.schedule("0 * * * *", fetchCodeforcesContests);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/solutions", solutionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
