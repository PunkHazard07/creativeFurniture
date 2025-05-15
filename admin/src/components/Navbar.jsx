import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({setToken}) => {
const navigate = useNavigate();

const handleLogout = async () => {
    try {
    const response = await fetch("http://localhost:8080/api/logout-admin", {
        method: "POST",
        credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Logout failed");
    }

      // Remove token from local storage
    localStorage.removeItem("token");
    setToken(""); // Update token state

    alert("Logged out successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
    console.error("Logout Error:", error.message);
    }
};

return (
    <nav className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
      {/* Business Logo */}
    <h1 className="text-2xl font-bold">Creative Furniture</h1>

      {/* Logout Button */}
    <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
    >
        Logout
    </button>
    </nav>
);
};

export default Navbar;
