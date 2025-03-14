import React, { useState, useEffect } from "react";

const Bookmarks = () => {
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    setBookmarked(JSON.parse(localStorage.getItem("bookmarks")) || []);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold md:ml-[48px] text-purple-500">Bookmarked Contests</h2>
      {bookmarked.length > 0 ? (
        <ul>
          {bookmarked.map((contest, index) => (
            <li key={index} className="mt-2 p-2 border md:mx-[48px]">
              <strong>{contest.name}</strong> - {contest.start_time}
            </li>
          ))}
        </ul>
      ) : (
        <p className="md:ml-[48px]">No bookmarked contests found.</p>
      )}
    </div>
  );
};

export default Bookmarks;
