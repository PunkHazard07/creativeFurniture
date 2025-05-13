import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'

const NavBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const dropdownRef = useRef(null)

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const cartCount = useSelector((state) => {
        const items = state.cart?.cartItems || []
        return items.reduce((total, item) => total + item.quantity, 0)
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    try {
        if (token) {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/logoutUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Attempt to parse the response regardless of status
            const data = await response.json();

            if (!response.ok) {
                console.warn('Server logout failed:', data.message);
                // You can choose to alert the user here if needed
            }
        }
    } catch (error) {
        console.warn('Logout request failed:', error.message || error);
        // Log the error but continue to clear the session
    } finally {
        // Clear auth info and redirect no matter what
        localStorage.removeItem('authToken');
        dispatch(logout());
        navigate('/');
    }
};


    // 🔍 Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between items-center relative z-50">
            {/* Mobile Menu Button */}
            <button className="lg:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Logo & Business Name */}
            <Link to="/" className="flex items-center space-x-2">
                <p className="text-xl font-bold">Creative Furniture</p>
            </Link>


            {/* Navigation Links */}
            <div
                className={`${
                    menuOpen ? 'flex' : 'hidden'
                } flex-col absolute top-16 left-0 w-full bg-gray-900 lg:flex lg:flex-row lg:relative lg:top-0 lg:w-auto lg:space-x-6 lg:bg-transparent z-50`}
            >
                <Link to="/" className="p-3 lg:p-0 hover:text-gray-400">
                    Home
                </Link>
                <Link to="/collection" className="p-3 lg:p-0 hover:text-gray-400">
                    Collection
                </Link>
                <Link to="/contact" className="p-3 lg:p-0 hover:text-gray-400">
                    Contact
                </Link>
                <Link to="/about" className="p-3 lg:p-0 hover:text-gray-400">
                    About
                </Link>
            </div>

            {/* Right-side Icons */}
            <div className="flex items-center space-x-6">
                {/* Shopping Cart */}
                <div className="relative">
                    <Link to="/cart" className="text-2xl hover:text-gray-400 relative">
                        <FaShoppingCart />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="cursor-pointer hover:text-gray-400 text-xl flex items-center space-x-2"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <FaUser />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                            {!isAuthenticated ? (
                                <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">
                                    Login
                                </Link>
                            ) : (
                                <>
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                                        Profile
                                    </Link>
                                    <Link to="/order" className="block px-4 py-2 hover:bg-gray-200">
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar
