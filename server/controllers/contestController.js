import axios from "axios";
import Contest from "../models/chefmodel.js";

// Fetch and save the entire API response
export const fetchAndSaveContests = async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
    );

    if (!response.data) {
      return res.status(400).json({ message: "Invalid API response" });
    }

    // Store the entire response in the database
    await Contest.findOneAndUpdate(
      {}, // Empty filter means it will update the first document found
      { raw_data: response.data },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Contests data stored successfully" });
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
