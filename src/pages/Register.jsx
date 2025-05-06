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
  const navigate = useNavigate(); // Hook for navigation

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
      navigate("/login"); // Redirect to login page

    } catch (err) {
    setError(err.message);
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-700">
        Create an Account
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
            </label>
            <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Full Name"
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
            placeholder="insert your email"
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
            />
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
            {loading ? "Registering..." : "Register"}
        </button>
        </form>
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
