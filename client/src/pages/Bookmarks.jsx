import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const { user, token } = useContext(AuthContext);
  const [bookmarked, setBookmarked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
  if (!user || !token) return;
  
  try {
    const res = await axios.get("http://localhost:5000/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Ensure only necessary fields are stored
    setBookmarked(res.data.map(({ contestId, name, platform, start_time, url }) => ({
      contestId, name, platform, start_time, url
    })));
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
  }
};


    fetchBookmarks();
  }, [user, token]);

  const removeBookmark = async (contestId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarked(prev => prev.filter(contest => contest.id !== contestId && contest._id !== contestId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
      setError("Failed to remove bookmark");
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  if (!user) {
    return (
      <div className="p-4 md:mx-12 mt-3">
        <h2 className="text-xl font-bold text-purple-500">Bookmarked Contests</h2>
        <p className="mt-4">Please log in to view your bookmarked contests.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:mx-12 mt-3 rounded-md shadow-lg">
      <h2 className="text-xl font-bold text-purple-500">Bookmarked Contests</h2>
      
      {loading && <p className="text-blue-500 mt-4">Loading bookmarks...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {!loading && !error && bookmarked.length === 0 && (
        <div className="mt-4">
          <p>No bookmarked contests found.</p>
          <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
            Go to contests page to bookmark some contests
          </Link>
        </div>
      )}
      
      {!loading && !error && bookmarked.length > 0 && (
        <ul>
          {bookmarked.map((contest) => (
            <li key={contest._id || contest.id} className="mt-2 p-4 border rounded-md flex justify-between items-center">
              <div>
                <span className="px-2 py-1 mr-2 text-xs bg-purple-500 text-white rounded-md">
                  {contest.platform}
                </span>
                <a 
                  href={contest.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  <strong>{contest.name}</strong>
                </a>
                <div className="text-sm text-gray-600 mt-1">
                  {formatDate(contest.start_time)}
                </div>
              </div>
              <button
                onClick={() => removeBookmark(contest._id || contest.id)}
                className="ml-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmarks;