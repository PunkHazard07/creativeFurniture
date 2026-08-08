import { useEffect }  from 'react'
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCart } from './redux/cartSlice';
import { checkAuthStatus } from './redux/authSlice';
import Home from './pages/Home';
import About from './pages/About';
import Cart from './pages/Cart';
import Collection from './pages/Collection';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyResetToken from './components/VerifyResetToken';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerifiedEmail from './pages/VerifiedEmail';
import ResendVerification from './pages/ResendVerification';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import OrderConfirmationPage from './pages/OrderConfirmation';
import Product from './pages/Product';
import CategoryProduct from './pages/CategoryProduct';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Profile from './pages/Profile';


const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthStatus())
      .unwrap()
      .then((user) => {
        if (user && user.verified) {
          dispatch(fetchCart());
        }
      })
      .catch(() => {
        // Guest or unverified user — leave the local guest cart untouched.
      });
  }, [dispatch]);

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
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/verify-reset-token' element={<VerifyResetToken />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/verified-email' element={<VerifiedEmail />} />
        <Route path='/resend-verification' element={<ResendVerification />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/order' element={<Order />} />
        <Route path='/order-success' element={<OrderConfirmationPage />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/category/:category' element={<CategoryProduct />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App