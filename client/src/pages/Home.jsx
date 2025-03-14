import React, { useEffect, useState } from "react";

const platforms = {
  Codeforces: "https://codeforces.com/api/contest.list",
  LeetCode: "http://leetcode-contest-api.fronte.io",
  CodeChef: "https://codechef-api.vercel.app/contests",
};

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(Object.keys(platforms));
  const [bookmarked, setBookmarked] = useState(() => {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
  });

  const fetchContests = async () => {
    let allContests = [];

    await Promise.all(
      selectedPlatforms.map(async (platform) => {
        try {
          const response = await fetch(platforms[platform]);

          if (!response.ok) {
            throw new Error(`Failed to fetch ${platform}`);
          }

          const data = await response.json();
          let contestsFromAPI = [];

          if (platform === "Codeforces" && data.status === "OK") {
            contestsFromAPI = data.result.map((contest) => ({
              id: contest.id,
              name: contest.name,
              start_time: new Date(contest.startTimeSeconds * 1000),
              url: `https://codeforces.com/contest/${contest.id}`,
            }));
          } else {
            contestsFromAPI = data.map((contest) => ({
              id: contest.id || `${platform}-${contest.name}`,
              name: contest.name,
              start_time: new Date(contest.start_time),
              url: contest.url || "#",
            }));
          }

          allContests = [...allContests, ...contestsFromAPI];
        } catch (error) {
          console.error(`Error fetching ${platform}:`, error);
        }
      })
    );

    return allContests;
  };

  useEffect(() => {
    const loadContests = async () => {
      setError(null);
      let fetchedContests = await fetchContests();

      // Sorting contests in descending order based on start_time
      fetchedContests.sort((a, b) => b.start_time - a.start_time);
      
      setContests(fetchedContests);
    };

    loadContests();
  }, [selectedPlatforms]);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleBookmark = (contest) => {
    let updatedBookmarks;
    if (bookmarked.some((b) => b.id === contest.id)) {
      updatedBookmarks = bookmarked.filter((b) => b.id !== contest.id);
    } else {
      updatedBookmarks = [...bookmarked, contest];
    }
    setBookmarked(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  const now = new Date();

  const upcomingContests = contests.filter((contest) => contest.start_time > now);
  const completedContests = contests.filter((contest) => contest.start_time <= now);

  return (
    <div className="p-4 md:mx-12 mt-3 rounded-md shadow-lg">
      <h2 className="text-xl font-bold">Upcoming & Completed Contests</h2>

      {/* Platform Filters */}
      <div className="flex gap-2 my-4">
        {Object.keys(platforms).map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={`p-2 rounded-md border ${
              selectedPlatforms.includes(platform) ? "bg-purple-500 text-white" : "bg-gray-400"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Upcoming Contests */}
      <h3 className="text-lg font-semibold mt-4">Upcoming Contests</h3>
      <ul>
        {upcomingContests.length > 0 ? (
          upcomingContests.map((contest) => (
            <li key={contest.id} className="mt-2 p-2 border flex justify-between items-center">
              <div>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  <strong>{contest.name}</strong>
                </a>
                <span> - {contest.start_time.toLocaleString()}</span>
              </div>
              <button
                onClick={() => toggleBookmark(contest)}
                className="ml-4 p-2 bg-yellow-400 rounded-md"
              >
                {bookmarked.some((b) => b.id === contest.id) ? "Unbookmark" : "Bookmark"}
              </button>
            </li>
          ))
        ) : (
          <p>No upcoming contests.</p>
        )}
      </ul>

      {/* Completed Contests */}
      <h3 className="text-lg font-semibold mt-6">Completed Contests</h3>
      <ul>
        {completedContests.length > 0 ? (
          completedContests.map((contest) => (
            <li key={contest.id} className="mt-2 p-2 border flex justify-between items-center">
              <div>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  <strong>{contest.name}</strong>
                </a>
                <span> - {contest.start_time.toLocaleString()}</span>
              </div>
              <button
                onClick={() => toggleBookmark(contest)}
                className="ml-4 p-2 bg-yellow-400 rounded-md"
              >
                {bookmarked.some((b) => b.id === contest.id) ? "Unbookmark" : "Bookmark"}
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
