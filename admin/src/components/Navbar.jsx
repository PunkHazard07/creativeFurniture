import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const Navbar = () => {
const navigate = useNavigate();
const logout = useAuthStore((s) => s.logout);

const handleLogout = async () => {
    await logout()
    alert("Logged out successfully!");
    navigate("/login");
};

return (
    <nav className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
      {/* Business Logo */}
    <h1 className="text-2xl font-bold">Creative Furniture</h1>

      {/* Logout Button */}
    <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
    >
        Logout
    </button>
    </nav>
  );
};

export default Navbar;