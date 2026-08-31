import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "../redux/authSlice";


const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const prefillEmail = location.state?.email || searchParams.get("email") || "";

  const [email, setEmail] = useState(prefillEmail);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle', 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("verifying");
    setMessage("");

    try {
      const params = new URLSearchParams({ email: email.trim(), code: code.trim() });
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/verify-email?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });

      const data = await response.json();

      const isAlreadyVerified = data.message && data.message.toLowerCase().includes("already verified");

      if (response.ok || isAlreadyVerified) {
        dispatch(checkAuthStatus());
        navigate("/verified-email");
        return;
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to verify email.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage("An error occurred while verifying your email.");
    }
  };

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Email Verification</h2>

        {status === "success" ? (
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
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Enter the verification code we emailed you.
            </p>

            {status === "error" && (
              <p className="text-red-500 text-center text-sm">{message}</p>
            )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter the code from your email"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "verifying"}
              className={`w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition-colors ${
                status === "verifying" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {status === "verifying" ? "Verifying..." : "Verify Email"}
            </button>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/resend-verification")}
                className="text-blue-600 hover:underline text-sm"
              >
                Didn't get a code? Resend verification email
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-gray-500 hover:underline text-sm"
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

export default VerifyEmail;