import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState('');
const navigate = useNavigate();

const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    

    try {
        const response = await fetch('http://localhost:8080/api/register-admin', {
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
                throw new Error(data.message || 'Registration failed');
            }

            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
        setError(error.message || 'Registration failed');
    } finally {
        setLoading(false);
    }
};

return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Admin Account</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
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
                {loading ? 'Registering...' : 'Sign Up'}
            </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <span
                className="text-blue-500 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate('/login')}
            >
                Login here
            </span>
        </p>
    </div>
</div>
);
};

export default Register;

