// ResendVerification.jsx - Component to resend verification email
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("http://localhost:8080/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Verification email sent successfully!");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to send verification email.");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Resend Verification Email</h2>
        
        {status === "success" ? (
          <div className="text-center">
            <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="mb-4 text-green-600">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && <p className="text-red-500 text-center">{message}</p>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "sending"}
              className={`w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition-colors ${
                status === "sending" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {status === "sending" ? "Sending..." : "Resend Verification Email"}
            </button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;