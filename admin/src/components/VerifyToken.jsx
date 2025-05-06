import React, { useState, useEffect } from "react";
import {  Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login"
import Register from "./Register";
import Dashboard from "../pages/Dashboard";
import Add from "../pages/Add";
import List from "../pages/List";
import Orders from "../pages/Orders";
import Navbar from "./Navbar";
import SideBar from "./SideBar";

const VerifyToken = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigation

  // Verify Token on Load and Whenever Token Changes
  //fixing the cold start issue
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsValidToken(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.valid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          localStorage.removeItem("token"); // Remove invalid token
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setIsValidToken(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]); //  Runs when `token` updates

  //  Listen for Local Storage Token Changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token") || ""); // Update token when changed
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading while verifying token
  }

  return !token || !isValidToken ? (
        <Routes>
          {/* If no token or invalid, show login & register */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <>
          {/* If logged in, show admin layout */}
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <SideBar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-base">
              <Routes>
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </div>
          </div>
        </>
      )}

export default VerifyToken;