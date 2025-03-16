import fs from "fs";
import path from "path";
import Contest from "../models/Contest.js";

const DATA_FILE = path.resolve("server/utils/data.json");

export const saveContestsToDB = async (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(400).json({ error: "No contest data available" });
    }

    const contestData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

    // Save contests to MongoDB
    await Contest.deleteMany({});
    await Contest.insertMany([...contestData.present_contests, ...contestData.future_contests, ...contestData.past_contests]);

    res.json({ message: "✅ Contests saved to database" });
  } catch (error) {
    console.error("❌ Error saving to database:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
