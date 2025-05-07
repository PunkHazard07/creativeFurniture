import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch from redux
import { login } from "../redux/authSlice"; // Import your login action

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // Create dispatch function

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("No verification token found in URL.");
          return;
        }

        const response = await fetch(`http://localhost:8080/api/verify-email?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Verification response:", data);

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");

          if (data.token) {
            // Dispatch login action and save token in Redux
            dispatch(login({ token: data.token }));
          }
        } else {
          // Check if it's an already verified case
          if (data.message && data.message.toLowerCase().includes("already verified")) {
            setStatus("success");
            setMessage(data.message);
          } else {
            setStatus("error");
            setMessage(data.message || "Failed to verify email.");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred while verifying your email.");
      }
    };

    verifyEmailToken();
  }, [location.search, dispatch]);

  const handleRedirect = () => {
    if (status === "success") {
      navigate("/"); // Redirect to homepage or dashboard
    } else {
      navigate("/login"); // Redirect to login if verification failed
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Email Verification</h2>

        {status === "verifying" && (
          <div className="text-center">
            <div className="mb-4 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mb-4 text-green-600">{message}</p>
            <button
              onClick={handleRedirect}
              className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition-colors"
            >
              Continue to Website
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="mb-4 text-red-600">{message}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/resend-verification")}
                className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition-colors"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full rounded-md bg-gray-300 py-2 px-4 text-gray-700 hover:bg-gray-400 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

