import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaShoppingCart } from "react-icons/fa";

const SideBar = () => {
return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-5">
      {/* Logo */}
    <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>

      {/* Navigation Links */}
    <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
        <FaTachometerAlt className="text-xl" />
        <span>Dashboard</span>
        </Link>

        <Link to="/add" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
        <FaBoxOpen className="text-xl" />
        <span>Add Product</span>
        </Link>

        <Link to="/list" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
        <FaClipboardList className="text-xl" />
        <span>Product List</span>
        </Link>

        <Link to="/orders" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
        <FaShoppingCart className="text-xl" />
        <span>Orders</span>
        </Link>
    </nav>
    </div>
);
};

export default SideBar;
