import apiClient from "../apiClient";
import routes from "../routes";

/**
 * Fraud detection service for handling fraud-related API operations
 */
const fraudService = {
  /**
   * Get fraud detection statistics dashboard data
   * @returns {Promise<Object>} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      return await apiClient.get(routes.FRAUD.DASHBOARD);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  /**
   * Submit a transaction for fraud analysis
   * @param {Object} transactionData - Transaction data to analyze
   * @returns {Promise<Object>} Fraud analysis result
   */
  analyzeTransaction: async (transactionData) => {
    try {
      return await apiClient.post(routes.FRAUD.ANALYZE, transactionData);
    } catch (error) {
      console.error("Error analyzing transaction:", error);
      throw error;
    }
  },

  /**
   * Get fraud detection alerts history
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Number of items per page
   * @param {string} params.sortBy - Field to sort by
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @returns {Promise<Object>} Fraud alerts with pagination
   */
  getAlerts: async (params = {}) => {
    try {
      return await apiClient.get(routes.FRAUD.ALERTS, params);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  },

  /**
   * Get details for a specific fraud alert
   * @param {string} alertId - ID of the alert to retrieve
   * @returns {Promise<Object>} Alert details
   */
  getAlertDetails: async (alertId) => {
    try {
      return await apiClient.get(routes.FRAUD.ALERT_DETAILS(alertId));
    } catch (error) {
      console.error(`Error fetching alert ${alertId}:`, error);
      throw error;
    }
  },

  /**
   * Update the status of a fraud alert
   * @param {string} alertId - ID of the alert to update
   * @param {string} status - New status (e.g., 'resolved', 'false_positive')
   * @param {string} notes - Optional notes about the update
   * @returns {Promise<Object>} Updated alert
   */
  updateAlertStatus: async (alertId, status, notes = "") => {
    try {
      return await apiClient.put(routes.FRAUD.UPDATE_ALERT_STATUS(alertId), {
        status,
        notes,
      });
    } catch (error) {
      console.error(`Error updating alert ${alertId}:`, error);
      throw error;
    }
  },

  /**
   * Get fraud detection model performance metrics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (e.g., '7d', '30d', '1y')
   * @returns {Promise<Object>} Model performance metrics
   */
  getModelPerformance: async (params = {}) => {
    try {
      return await apiClient.get(routes.FRAUD.MODEL_PERFORMANCE, params);
    } catch (error) {
      console.error("Error fetching model performance:", error);
      throw error;
    }
  },

  /**
   * Get transaction history with optional filtering
   * @param {Object} filters - Query parameters for filtering transactions
   * @returns {Promise<Object>} Transactions with pagination
   */
  getTransactions: async (filters = {}) => {
    try {
      return await apiClient.get(routes.TRANSACTION.BASE, filters);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },
};

export default fraudService;
