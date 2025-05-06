import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({setToken}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            //store token in local storage
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setToken(data.accessToken); //update token state

            navigate('/dashboard');
        } catch (error) {
            setError(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                    {loading ? "Logging in..." : "Login"}
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

