import apiClient from "../apiClient";
import routes from "../routes";

/**
 * User service for handling user-related API operations
 */
const userService = {
  /**
   * Get all users (for admin panel)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query
   * @returns {Promise<Object>} Users list with pagination
   */
  getAllUsers: async (params = {}) => {
    try {
      return await apiClient.get(routes.USER.ADMIN_USERS, { params });
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  /**
   * Update user (for admin)
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async (userId, userData) => {
    try {
      return await apiClient.put(
        routes.USER.ADMIN_UPDATE_USER(userId),
        userData
      );
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Invite new user (for admin)
   * @param {Object} userData - User data with email and role
   * @returns {Promise<Object>} Success message
   */
  inviteUser: async (userData) => {
    try {
      return await apiClient.post(routes.USER.ADMIN_INVITE, userData);
    } catch (error) {
      console.error("Error inviting user:", error);
      throw error;
    }
  },

  /**
   * Make Admin
   * @param {string} email - User data with email and role
   */
  makeAdmin: async (email) => {
    try {
      return await apiClient.post(routes.USER.MAKE_ADMIN, email);
    } catch (error) {
      console.error("Error inviting user:", error);
      throw error;
    }
  },
  /**
   * GET ALL NOTIFICAT
   * @param {string} email - User data with email and role
   */
  makeAdmin: async (email) => {
    try {
      return await apiClient.post(routes.USER.MAKE_ADMIN, email);
    } catch (error) {
      console.error("Error inviting user:", error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  getProfile: async () => {
    try {
      return await apiClient.get(routes.USER.PROFILE);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - User profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  updateProfile: async (profileData) => {
    try {
      return await apiClient.put(routes.USER.PROFILE, profileData);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  changePassword: async (passwordData) => {
    try {
      return await apiClient.put(routes.USER.CHANGE_PASSWORD, passwordData);
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  /**
   * Get user notification preferences
   * @returns {Promise<Object>} User notification preferences
   */
  getNotificationPreferences: async () => {
    try {
      return await apiClient.get(routes.USER.NOTIFICATION_PREFERENCES);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      throw error;
    }
  },

  /**
   * Update user notification preferences
   * @param {Object} preferences - Notification preferences
   * @returns {Promise<Object>} Updated preferences
   */
  updateNotificationPreferences: async (preferences) => {
    try {
      return await apiClient.put(
        routes.USER.NOTIFICATION_PREFERENCES,
        preferences
      );
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      throw error;
    }
  },

  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {boolean} params.unreadOnly - Filter to unread notifications only
   * @returns {Promise<Object>} User notifications with pagination
   */
  getNotifications: async (params = {}) => {
    try {
      return await apiClient.get(routes.USER.NOTIFICATIONS, { params });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  markNotificationAsRead: async (notificationId) => {
    try {
      return await apiClient.put(
        `${routes.USER.NOTIFICATIONS}/${notificationId}/read`
      );
    } catch (error) {
      console.error(
        `Error marking notification ${notificationId} as read:`,
        error
      );
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Success message
   */
  markAllNotificationsAsRead: async () => {
    try {
      return await apiClient.put(routes.USER.MARK_ALL_NOTIFICATIONS_READ);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Success message
   */
  deleteNotification: async (notificationId) => {
    try {
      return await apiClient.delete(
        `${routes.USER.NOTIFICATIONS}/${notificationId}`
      );
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },
};

export default userService;
