import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './redux/cartSlice';
import Home from './pages/Home';
import About from './pages/About';
import Cart from './pages/Cart';
import Collection from './pages/Collection';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import OrderConfirmationPage from './pages/OderConfirmation';
import Product from './pages/Product';
import NavBar from './components/NavBar';
import Footer from './components/Footer';


const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // get token from Redux store

  // Fetch cart items when the component mounts or when the token changes
  // This ensures that the cart is fetched for logged-in users
  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [token, dispatch]);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/order' element={<Order />} />
        <Route path='/order-success' element={<OrderConfirmationPage />} />
        <Route path='/product/:id' element={<Product />} />
      </Routes>

      <Footer />

    </div>
  )
}

export default App