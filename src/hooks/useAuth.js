import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/services";
import { toast } from "react-toastify";

/**
 * Custom hook for authentication management
 *
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const isLoggedIn = authService.isAuthenticated();

      setUser(currentUser);
      setIsAuthenticated(isLoggedIn);
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const response = await authService.login(credentials);
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success("Login successful");
        navigate("/dashboard");
        return response;
      } catch (error) {
        toast.error(error.message || "Login failed");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  /**
   * Register a new user
   */
  const register = useCallback(
    async (userData) => {
      setLoading(true);
      try {
        const response = await authService.register(userData);
        toast.success("Registration successful. Please login.");
        navigate("/login");
        return response;
      } catch (error) {
        toast.error(error.message || "Registration failed");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info("You have been logged out");
    navigate("/login");
  }, [navigate]);

  /**
   * Update user profile in state after changes
   */
  const updateUserProfile = useCallback((updatedUser) => {
    const currentUser = authService.getCurrentUser();
    const updatedUserData = { ...currentUser, ...updatedUser };
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
  };
};

export default useAuth;
