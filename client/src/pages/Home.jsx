import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { AiOutlineBook, AiFillBook } from "react-icons/ai";
import { toast } from "react-hot-toast";

const ContestList = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Codeforces", "CodeChef", "LeetCode"]);

  useEffect(() => {
    fetch("http://localhost:5000/api/contests/all")
      .then((response) => response.json())
      .then((data) => {
        setContests(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch contests");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !token) return;

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarked(res.data.map(({ contestId }) => contestId));
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      }
    };

    fetchBookmarks();

    const handleBookmarkUpdate = () => fetchBookmarks();
    window.addEventListener("bookmark-updated", handleBookmarkUpdate);

    return () => {
      window.removeEventListener("bookmark-updated", handleBookmarkUpdate);
    };
  }, [user, token]);

  const toggleBookmark = async (contest) => {
    if (!user) {
      toast.error("Please log in to bookmark contests.");
      return;
    }

    const isBookmarked = bookmarked.includes(contest._id);
    try {
      if (isBookmarked) {
        await axios.delete(`http://localhost:5000/api/bookmarks/${contest._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarked((prev) => prev.filter((id) => id !== contest._id));
        toast.success("Bookmark removed.");
        window.dispatchEvent(new Event("bookmark-updated"));
      } else {
        await axios.post(
          "http://localhost:5000/api/bookmarks",
          {
            _id: contest._id,
            title: contest.title,
            platform: contest.platform,
            startTime: contest.startTime,
            url: contest.url,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookmarked((prev) => [...prev, contest._id]);
        toast.success("Contest bookmarked!");
      }
    } catch (error) {
      toast.error("Failed to update bookmark.");
      console.error("Error toggling bookmark:", error);
    }
  };

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const now = new Date();
  const filteredContests = contests.filter((contest) => selectedPlatforms.includes(contest.platform));
  const upcomingContests = filteredContests.filter((contest) => new Date(contest.startTime) > now);
  const completedContests = filteredContests.filter((contest) => new Date(contest.startTime) <= now);

  return (
    <div className="p-4 md:mx-12 mt-3 rounded-md shadow-lg">
      <h2 className="text-xl font-bold">Upcoming & Completed Contests</h2>

      <div className="flex gap-2 my-4">
        {["Codeforces", "CodeChef", "LeetCode"].map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={`p-2 rounded-md border ${
              selectedPlatforms.includes(platform) ? "bg-purple-500 text-white" : "dark:bg-gray-600"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {loading && <p className="text-blue-500">Loading contests...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* UPCOMING CONTESTS */}
      <h3 className="text-lg font-semibold mt-4">Upcoming Contests</h3>
      <ul>
        {upcomingContests.length > 0 ? (
          upcomingContests.map((contest) => (
            <li key={contest._id} className="mt-2 p-2 border flex justify-between items-center">
              <div>
                <span className="px-2 py-1 mr-2 text-xs bg-purple-500 text-white rounded-md">
                  {contest.platform}
                </span>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  <strong>{contest.title}</strong>
                </a>
                <span> - {new Date(contest.startTime).toLocaleString()}</span>
              </div>
              <button onClick={() => toggleBookmark(contest)} className="ml-4 p-2 rounded-md flex items-center gap-2 bg-yellow-400">
                {bookmarked.includes(contest._id) ? <AiFillBook /> : <AiOutlineBook />}
                {bookmarked.includes(contest._id) ? "Unbookmark" : "Bookmark"}
              </button>
            </li>
          ))
        ) : (
          <p>No upcoming contests.</p>
        )}
      </ul>

      {/* COMPLETED CONTESTS */}
      <h3 className="text-lg font-semibold mt-6">Completed Contests</h3>
      <ul>
        {completedContests.length > 0 ? (
          completedContests.map((contest) => (
            <li key={contest._id} className="mt-2 p-2 border flex justify-between items-center">
              <div>
                <span className="px-2 py-1 mr-2 text-xs bg-purple-500 text-white rounded-md">
                  {contest.platform}
                </span>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  <strong>{contest.title}</strong>
                </a>
                <span> - {new Date(contest.startTime).toLocaleString()}</span>
              </div>
              <button onClick={() => toggleBookmark(contest)} className="ml-4 p-2 rounded-md flex items-center gap-2 bg-yellow-400">
                {bookmarked.includes(contest._id) ? <AiFillBook /> : <AiOutlineBook />}
                {bookmarked.includes(contest._id) ? "Unbookmark" : "Bookmark"}
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
