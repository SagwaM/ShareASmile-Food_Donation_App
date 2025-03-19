import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({allowedRoles}) => {
  const { user, token } = useAuth(); // Get user from AuthContext

  // Prevent navigation if user/token doesn't exist
  if (!user || !token) return <Navigate to="/login" replace />;
  
  // If user exists but role is not allowed, redirect home 
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
