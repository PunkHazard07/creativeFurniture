import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Spinner size="lg" color="indigo" />
          <p className="text-gray-600 font-medium mt-4">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname === "/checkout") {
      localStorage.setItem("redirectToCheckout", "true");
    }
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute