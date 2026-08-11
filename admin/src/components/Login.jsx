import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const AdminLogin = ({setToken}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = useAuthStore((s) => s.login);
    const isLoggingIn = useAuthStore((s) => s.isLoggingIn);
    const loginError = useAuthStore((s) => s.loginError);

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

            {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}

            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                <div>
                    <label className="block text-gray-600 font-medium">Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-600 font-medium">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                    {isLoggingIn ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
                Don't have an account?{" "}
                <span
                    className="text-blue-500 font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate("/register")}
                >
                    Register here
                </span>
            </p>
        </div>
    </div>
    );
};

export default AdminLogin;