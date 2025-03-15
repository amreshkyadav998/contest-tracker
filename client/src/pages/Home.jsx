import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const platforms = {
  Codeforces: "https://codeforces.com/api/contest.list",
  LeetCode: "http://leetcode-contest-api.fronte.io",
  CodeChef: "http://localhost:5000/api/contests/full-data",
};

const ContestList = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(Object.keys(platforms));
  const [bookmarked, setBookmarked] = useState([]);

  // Define togglePlatform to handle platform selection
  const togglePlatform = (platform) => {
    setSelectedPlatforms((prevSelectedPlatforms) => {
      if (prevSelectedPlatforms.includes(platform)) {
        // Remove platform from selectedPlatforms
        return prevSelectedPlatforms.filter((p) => p !== platform);
      } else {
        // Add platform to selectedPlatforms
        return [...prevSelectedPlatforms, platform];
      }
    });
  };

  // Fetch contests from the selected platforms
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
              platform: "Codeforces",
            }));
          } else if (platform === "CodeChef") {
            contestsFromAPI = [
              {
                id: data.contest_code,
                name: data.contest_name,
                start_time: new Date(data.contest_start_date_iso),
                end_time: new Date(data.contest_end_date_iso),
                duration: data.contest_duration,
                url: `https://www.codechef.com/${data.contest_code}`,
                platform: "CodeChef",
                participants: data.distinct_users,
              },
            ];
          }
          // Add LeetCode fetch logic when backend API is available
  
          allContests = [...allContests, ...contestsFromAPI];
        } catch (error) {
          console.error(`Error fetching ${platform}:`, error);
        }
      })
    );
  
    setLoading(false);
    return allContests.sort((a, b) => a.start_time - b.start_time);
  };
  

  // Fetch bookmarks from backend API
  const fetchBookmarks = async () => {
    if (!user || !token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
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
      const fetchedContests = await fetchContests();
      setContests(fetchedContests);
    };
  
    loadContests();
  }, [selectedPlatforms]);
  

  // Fetch bookmarks when user or token changes
  useEffect(() => {
    fetchBookmarks();
  }, [user, token]);

  const toggleBookmark = async (contest) => {
    if (!user || !token) {
      setError("Please log in to bookmark contests");
      return;
    }

    try {
      const isBookmarked = bookmarked.some((b) => b.contestId === contest.id);

      if (contest.platform === "CodeChef") {
        // Handle CodeChef bookmarking differently
        alert(`Bookmarking for CodeChef contests works differently.`);
        // Perform specific logic for CodeChef contests
      } else {
        if (isBookmarked) {
          await axios.delete(`http://localhost:5000/api/bookmarks/${contest.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBookmarked((prev) => prev.filter((b) => b.contestId !== contest.id));
        } else {
          const { data } = await axios.post(
            "http://localhost:5000/api/bookmarks",
            {
              id: contest.id,
              name: contest.name,
              platform: contest.platform,
              start_time: contest.start_time,
              url: contest.url,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setBookmarked((prev) => [...prev, data]);
        }
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
    return bookmarked.some((b) => b.id === contestId || b._id === contestId);
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
                  isContestBookmarked(contest.id) ? "bg-yellow-400 text-white" : "bg-yellow-400"
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
                  isContestBookmarked(contest.id) ? "bg-yellow-400 text-white" : "bg-yellow-400"
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
