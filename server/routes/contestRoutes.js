import express from "express";
import Contest from "../models/Contest.js";

const router = express.Router();

// Get stored contests from MongoDB
router.get("/", async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    console.error("❌ Error fetching contests:", error.message);
    res.status(500).json({ error: "Failed to fetch contests. Try again later." });
  }
});

export default router;
