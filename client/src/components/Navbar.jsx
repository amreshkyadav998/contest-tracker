import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for mobile menu

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("User Admin Status:", user?.is_admin);
  console.log(user)


  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
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
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
          {isAuthenticated && <Link to="/bookmarks" className="hover:underline mt-2">Bookmarks</Link>}
          {isAuthenticated && user?.isAdmin && <Link to="/admin" className="hover:underline mt-2">Admin</Link>}
          <Link to="/codechef" className="hover:underline mt-2">CodeChef</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline mt-2">Login</Link>
              <Link to="/signup" className="hover:underline mt-2">Signup</Link>
            </>
          )}
          <button onClick={toggleDarkMode} className="bg-gray-700 px-4 py-2 rounded">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-2 mt-4">
          <Link to="/" className="hover:underline" onClick={() => setIsOpen(false)}>Home</Link>
          {isAuthenticated && <Link to="/bookmarks" className="hover:underline" onClick={() => setIsOpen(false)}>Bookmarks</Link>}
          {isAuthenticated && user?.isAdmin && <Link to="/admin" className="hover:underline" onClick={() => setIsOpen(false)}>Admin</Link>}
          <Link to="/codechef" className="hover:underline" onClick={() => setIsOpen(false)}>CodeChef</Link>
          <button onClick={toggleDarkMode} className="bg-gray-700 px-4 py-2 rounded w-full text-center">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded w-full">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" className="hover:underline" onClick={() => setIsOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
