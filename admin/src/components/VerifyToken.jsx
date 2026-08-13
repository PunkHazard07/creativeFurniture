import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login"
import Register from "./Register";
import Dashboard from "../pages/Dashboard";
import AddProduct from "../pages/AddProduct";
import ListProduct from "../pages/ListProduct";
import Orders from "../pages/Orders";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import Spinner from "./Spinner";
import { useAuthStore } from "../stores/authStore";

const VerifyToken = () => {
  const token = useAuthStore((s) => s.token);
  const isValidToken = useAuthStore((s) => s.isValidToken);
  const isCheckingToken = useAuthStore((s) => s.isCheckingToken);
  const checkToken = useAuthStore((s) => s.checkToken);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

    useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkToken();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkToken]);

  if (isCheckingToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" color="indigo" />
      </div>
    );
  }

  return !token || !isValidToken ? (
        <Routes>
          {/* If no token or invalid, show login & register */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <>
          {/* If logged in, show admin layout */}
          <Navbar/>
          <hr />
          <div className="flex w-full">
            <SideBar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-base">
              <Routes>
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/list-product" element={<ListProduct />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </div>
          </div>
        </>
      )}

export default VerifyToken;