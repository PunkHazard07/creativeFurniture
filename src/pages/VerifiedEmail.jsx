import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifiedEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user navigates directly to this page without being redirected,
    // redirect them to the home page after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="mb-6 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Email Verified!</h2>
        <p className="text-lg text-gray-600 mb-6">Your email has been successfully verified. You can now access all features of our platform.</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full md:w-auto rounded-md bg-blue-600 py-3 px-6 text-white hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifiedEmail;