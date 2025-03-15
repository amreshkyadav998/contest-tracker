import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const platforms = {
  Codeforces: "https://codeforces.com/api/contest.list",
  LeetCode: "http://leetcode-contest-api.fronte.io",
  CodeChef: "https://corsproxy.io/?https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
};

const ContestList = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(Object.keys(platforms));
  const [bookmarked, setBookmarked] = useState([]);

  const fetchContests = async () => {
    let allContests = [];
    setLoading(true);

    await Promise.all(
      selectedPlatforms.map(async (platform) => {
        try {
          console.log(`Fetching ${platform} contests from: ${platforms[platform]}`);
          const response = await fetch(platforms[platform]);

          const data = await response.json();
          console.log(`${platform} data:`, data);
          let contestsFromAPI = [];

          if (platform === "Codeforces" && data.status === "OK") {
            contestsFromAPI = data.result.map((contest) => ({
              id: contest.id,
              name: contest.name,
              start_time: new Date(contest.startTimeSeconds * 1000),
              url: `https://codeforces.com/contest/${contest.id}`,
              platform: "Codeforces"
            }));
          }
          // Add similar mappings for LeetCode and CodeChef here
          
          allContests = [...allContests, ...contestsFromAPI];
        } catch (error) {
          console.error(`Error fetching ${platform}:`, error);
        }
      })
    );
    
    setLoading(false);
    return allContests;
  };

  // Fetch bookmarks from backend API
  const fetchBookmarks = async () => {
    if (!user || !token) return;
    
    try {
      const res = await axios.get("http://localhost:5000/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarked(res.data);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    }
  };

  // Fetch contests and bookmarks when the component loads or selected platforms change
  useEffect(() => {
    const loadContests = async () => {
      setError(null);
      let fetchedContests = await fetchContests();
      fetchedContests.sort((a, b) => a.start_time - b.start_time);
      setContests(fetchedContests);
    };

    loadContests();
  }, [selectedPlatforms]);

  // Fetch bookmarks when user or token changes
  useEffect(() => {
    fetchBookmarks();
  }, [user, token]);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleBookmark = async (contest) => {
    if (!user || !token) {
      setError("Please log in to bookmark contests");
      return;
    }

    try {
      const isBookmarked = bookmarked.some((b) => b.id === contest.id);
      
      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(`http://localhost:5000/api/bookmarks/${contest.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarked(prev => prev.filter(b => b.id !== contest.id));
      } else {
        // Add bookmark
        const { data } = await axios.post(
          "http://localhost:5000/api/bookmarks", 
          contest, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarked(prev => [...prev, data]);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setError("Failed to update bookmark");
    }
  };

  const now = new Date();
  const upcomingContests = contests.filter((contest) => contest.start_time > now);
  const completedContests = contests.filter((contest) => contest.start_time <= now);

  // Helper function to check if a contest is bookmarked
  const isContestBookmarked = (contestId) => {
    return bookmarked.some(b => b.id === contestId || b._id === contestId);
  };

  return (
    <div className="p-4 md:mx-12 mt-3 rounded-md shadow-lg">
      <h2 className="text-xl font-bold">Upcoming & Completed Contests</h2>

      <div className="flex gap-2 my-4">
        {Object.keys(platforms).map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={`p-2 rounded-md border ${
              selectedPlatforms.includes(platform) ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {loading && <p className="text-blue-500">Loading contests...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <h3 className="text-lg font-semibold mt-4">Upcoming Contests</h3>
      <ul>
        {upcomingContests.length > 0 ? (
          upcomingContests.map((contest) => (
            <li key={contest.id} className="mt-2 p-2 border flex justify-between items-center">
              <div>
                <span className="px-2 py-1 mr-2 text-xs bg-purple-500 text-white rounded-md">{contest.platform}</span>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  <strong>{contest.name}</strong>
                </a>
                <span> - {contest.start_time.toLocaleString()}</span>
              </div>
              <button
                onClick={() => toggleBookmark(contest)}
                className={`ml-4 p-2 rounded-md ${
                  isContestBookmarked(contest.id) 
                    ? "bg-yellow-400 text-white" 
                    : "bg-yellow-400"
                }`}
              >
                {isContestBookmarked(contest.id) ? "Unbookmark" : "Bookmark"}
              </button>
            </li>
          ))
        ) : (
          <p>No upcoming contests.</p>
        )}
      </ul>

      <h3 className="text-lg font-semibold mt-6">Completed Contests</h3>
      <ul>
        {completedContests.length > 0 ? (
          completedContests.map((contest) => (
            <li key={contest.id} className="mt-2 p-2 border flex justify-between items-center">
              <div>
                <span className="px-2 py-1 mr-2 text-xs bg-purple-500 text-white rounded-md">{contest.platform}</span>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  <strong>{contest.name}</strong>
                </a>
                <span> - {contest.start_time.toLocaleString()}</span>
              </div>
              <button
                onClick={() => toggleBookmark(contest)}
                className={`ml-4 p-2 rounded-md ${
                  isContestBookmarked(contest.id) 
                    ? "bg-yellow-400 text-white" 
                    : "bg-yellow-400"
                }`}
              >
                {isContestBookmarked(contest.id) ? "Unbookmark" : "Bookmark"}
              </button>
            </li>
          ))
        ) : (
          <p>No completed contests.</p>
        )}
      </ul>
    </div>
  );
};

export default ContestList;