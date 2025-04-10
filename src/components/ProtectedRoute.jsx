import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../api/services";

/**
 * Protected Route component that checks authentication before rendering children
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} [props.requireAdmin=false] - Whether the route requires admin privileges
 * @returns {React.ReactNode} The protected content or a redirect
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated, saving the current location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If route requires admin privileges, check if the user is an admin
  if (requireAdmin && currentUser?.role !== "admin") {
    // Redirect to dashboard if user is not an admin
    return <Navigate to="/app/dashboard" replace />;
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
