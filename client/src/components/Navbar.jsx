import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for mobile menu

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900", "text-white");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <nav className="p-4 bg-gray-800 text-white">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <Link to="/" className="text-xl font-bold md:ml-[-90px]">Contest Tracker</Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 md:mr-[-90px]">
          <Link to="/" className="hover:underline mt-2">Home</Link>
          <Link to="/bookmarks" className="hover:underline mt-2">Bookmarked</Link>
          <Link to="/admin" className="hover:underline mt-2">Admin</Link>
          <button onClick={() => setDarkMode(!darkMode)} className="bg-gray-700 px-4 py-2 rounded">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-2 mt-4">
          <Link to="/" className="hover:underline" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/bookmarks" className="hover:underline" onClick={() => setIsOpen(false)}>Bookmarked</Link>
          <Link to="/admin" className="hover:underline" onClick={() => setIsOpen(false)}>Admin</Link>
          <button onClick={() => setDarkMode(!darkMode)} className="bg-gray-700 px-4 py-2 rounded w-full text-center">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
