import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      // Show success message instead of immediately redirecting
      setRegistered(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        {!registered ? (
          <>
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-700">
              Create an Account
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Insert your email"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  required
                  minLength="8"
                />
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 transition-colors"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">
              We've sent a verification email to <span className="font-semibold">{formData.email}</span>. 
              Please check your inbox and click the verification link to complete your registration.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/resend-verification")}
                className="w-full rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <a href="/login" className="text-blue-500 hover:underline">
            {" "}
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;