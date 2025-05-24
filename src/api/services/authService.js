import apiClient from "../apiClient";
import routes from "../routes";

/**
 * Authentication service for handling user authentication operations
 */
const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(routes.AUTH.LOGIN, credentials);

      // Store token in localStorage for subsequent API calls
      if (response.token) {
        localStorage.setItem("authToken", response.token);

        // Store user data if available
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user data
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(routes.AUTH.REGISTER, userData);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user or null if not authenticated
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  /**
   * Refresh auth token
   * @returns {Promise<Object>} New token data
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post(routes.AUTH.REFRESH_TOKEN);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      return response;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  /**
   * Request password reset for a user
   * @param {Object} data - Password reset request data
   * @param {string} data.email - User email
   * @returns {Promise<Object>} Success message
   */
  forgotPassword: async (data) => {
    try {
      return await apiClient.post(routes.AUTH.FORGOT_PASSWORD, data);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  /**
   * Verify code sent during password reset process
   * @param {Object} data - Verification data
   * @param {string} data.email - User email
   * @param {string} data.verificationCode - Verification code
   * @returns {Promise<Object>} Success message
   */
  verifyCode: async (data) => {
    try {
      return await apiClient.post(routes.AUTH.VERIFY_TOKEN, data);
    } catch (error) {
      console.error("Code verification error:", error);
      throw error;
    }
  },

  /**
   * Get user notifications
   * @returns {Promise<Object>} User notifications with pagination
   */
  getNotifications: async () => {
    try {
      return await apiClient.get(routes.AUTH.NOTIFICATIONS);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },
  /**
   * Reset user password with token
   * @param {Object} data - Password reset data
   * @param {string} data.email - User email
   * @param {string} data.code - Verification code
   * @param {string} data.new_password - New password
   * @param {string} data.token - Reset token (optional, will check localStorage if not provided)
   * @returns {Promise<Object>} Success message
   */
  resetPassword: async (data) => {
    try {
      // Extract token and remove from payload
      const { token, ...resetData } = data;

      // Get token from params, localStorage or sessionStorage
      const resetToken =
        token ||
        localStorage.getItem("resetToken") ||
        sessionStorage.getItem("resetToken");

      // Custom headers for token authentication
      const authHeaders = resetToken
        ? {
            Authorization: resetToken.startsWith("Bearer ")
              ? resetToken
              : `Bearer ${resetToken}`,
          }
        : {};

      // For debugging, let's try a simpler approach without custom header formatting
      if (resetToken) {
        // Set token directly to localStorage for getAuthHeaders() to pick up
        const originalToken = localStorage.getItem("authToken");
        localStorage.setItem("authToken", resetToken);

        try {
          // Make the API call
          const result = await apiClient.post(
            routes.AUTH.RESET_PASSWORD,
            resetData
          );

          // Restore original token if there was one
          if (originalToken) {
            localStorage.setItem("authToken", originalToken);
          } else {
            localStorage.removeItem("authToken");
          }

          return result;
        } catch (error) {
          // Restore original token if there was one
          if (originalToken) {
            localStorage.setItem("authToken", originalToken);
          } else {
            localStorage.removeItem("authToken");
          }
          throw error;
        }
      } else {
        // No token, just make the regular call
        return await apiClient.post(routes.AUTH.RESET_PASSWORD, resetData);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};

export default authService;
