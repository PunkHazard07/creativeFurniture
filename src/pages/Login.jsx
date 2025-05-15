import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authSlice';
import { clearCart, fetchCart } from '../redux/cartSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localCart = useSelector((state) => state.cart.cartItems); // Get cart items from Redux store
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsLoading(true);
    setNeedsVerification(false);

    try {
      const loginResponse = await fetch (`${import.meta.env.VITE_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        const token = loginData.token;
        
        //save token in redux and localStorage
        dispatch(login({token}));

        // only attempt to merge cart if there are items in local cart
        if (localCart.length > 0) {
          
          try {
              //map items to match backend expectations
              const itemsToMerge = localCart.map(item =>({
                id: item.id || item.productID,
                productID: item.id || item.productID,
                quantity: item.quantity,
                price: item.price 
              }));

              const mergeResponse = await fetch('http://localhost:8080/api/cart/merge', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items: itemsToMerge }),
              });

              const mergeData = await mergeResponse.json();

              if(mergeData.success) {
                //clear local cart and fetch updated cart from server
                dispatch(clearCart());
                await dispatch(fetchCart()).unwrap();
                console.log('Cart merged successfully')
              } else {
                console.warn('Cart merged successfully:', mergeData.message);
              }
          }  catch (mergeError) {
            console.error('Error merging cart:', mergeError);
          }
        } else {
          //if no loacal items, fetch user's cart from server
          await dispatch(fetchCart()).unwrap();
        }

        setIsLoading(false);
        
        //check if we need to redirect to checkout page
        const shouldRedirectToCheckout = localStorage.getItem('redirectToCheckout') === 'true';
        if (shouldRedirectToCheckout) {
          //clear the flag 
          localStorage.removeItem('redirectToCheckout'); // Clear the flag
          navigate('/checkout'); // Redirect to checkout page
        } else {
          navigate('/'); // Redirect to home page
        }
      
      } else {
        // Check if the issue is email verification
        if (loginData.isVerified === false) {
          setNeedsVerification(true);
          setError("Please verify your email before logging in.");
        } else {
          setError(loginData.message || 'Login failed. Please try again.');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('An error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {needsVerification ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your email address needs to be verified. Please check your email for a verification link or request a new one.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/resend-verification")}
                className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition-colors"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => {
                  setNeedsVerification(false);
                  setError("");
                }}
                className="w-full rounded-md bg-gray-300 py-2 px-4 text-gray-700 hover:bg-gray-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input 
                type="email"
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input 
                type="password"
                placeholder="Enter your password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <div className="text-right mt-1">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-gray-600">
          Don't have an account? 
          <a href="/register" className="text-blue-600 hover:underline ml-1">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;