import express from "express";
import axios from "axios";
import Contest from "../models/chefmodel.js";

const router = express.Router();

// Fetch and save contests from CodeChef API
router.get("/fetch", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&limit=10&mode=all"
    );

    if (!response.data || !response.data.future_contests) {
      return res.status(400).json({ message: "Invalid API response" });
    }

    const contests = response.data.future_contests.map((contest) => {
      const startTime = Date.parse(contest.contest_start_date_iso) 
        ? new Date(contest.contest_start_date_iso) 
        : null;

      return {
        contest_id: contest.contest_code,
        name: contest.contest_name,
        start_time: startTime,
        url: `https://www.codechef.com/${contest.contest_code}`,
      };
    });

    // Filter out invalid dates before saving
    const validContests = contests.filter(contest => contest.start_time !== null);

    // Save contests to DB
    for (let contest of validContests) {
      await Contest.findOneAndUpdate(
        { contest_id: contest.contest_id },
        contest,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Contests updated successfully", contests: validContests });
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all stored contests from DB
router.get("/codechef", async (req, res) => {
  try {
    const contests = await Contest.find().sort({ start_time: 1 });
    res.status(200).json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get full raw contest data from CodeChef API
router.get("/full-data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching full contest data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
