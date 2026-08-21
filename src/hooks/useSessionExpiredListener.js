import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../redux/authSlice';
import { clearCart } from '../redux/cartSlice';
import { SESSION_EXPIRED_EVENT } from '../utils/sessionExpired';

/**
 * Listens for the session-expired event fired by fetchWithAuth / useTokenRefresh
 * when a refresh-token attempt definitively fails, and logs the user out
 * client-side (mirrors NavBar's manual logout). ProtectedRoute already redirects
 * to /login as soon as isAuthenticated flips to false, so no manual navigation
 * is needed here.
 */
export const useSessionExpiredListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleSessionExpired = () => {
            dispatch(logoutSuccess());
            dispatch(clearCart());
        };
    
        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    }, [dispatch]);
}