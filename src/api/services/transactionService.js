import apiClient from "../apiClient";
import routes from "../routes";

/**
 * Transaction service for handling transaction-related API operations
 */
const transactionService = {
  /**
   * Get transaction history with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Field to sort by
   * @param {string} params.sortOrder - Sort direction (asc/desc)
   * @param {Object} params.filters - Additional filtering criteria
   * @returns {Promise<Object>} Transactions list with pagination info
   */
  getTransactions: async (params = {}) => {
    try {
      return await apiClient.get(routes.TRANSACTION.BASE, params);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  /**
   * Get a single transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  getTransactionById: async (id) => {
    try {
      return await apiClient.get(routes.TRANSACTION.SINGLE(id));
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  },

  /**
   * Submit a new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction with fraud analysis
   */
  createTransaction: async (transactionData) => {
    try {
      return await apiClient.post(routes.TRANSACTION.BASE, transactionData);
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  /**
   * Get transaction fraud risk score
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Fraud analysis results
   */
  getFraudRiskScore: async (id) => {
    try {
      return await apiClient.get(routes.TRANSACTION.FRAUD_SCORE(id));
    } catch (error) {
      console.error(`Error fetching fraud score for transaction ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get transaction statistics
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.period - Time period (day, week, month, year)
   * @param {string} params.from - Start date
   * @param {string} params.to - End date
   * @returns {Promise<Object>} Transaction statistics
   */
  getTransactionStats: async (params = {}) => {
    try {
      return await apiClient.get(routes.TRANSACTION.STATS, params);
    } catch (error) {
      console.error("Error fetching transaction statistics:", error);
      throw error;
    }
  },

  /**
   * Get transaction history for a specific user
   * @param {string} userId - User ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} User's transaction history
   */
  getUserTransactions: async (userId, params = {}) => {
    try {
      return await apiClient.get(
        routes.TRANSACTION.USER_TRANSACTIONS(userId),
        params
      );
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Flag a transaction as fraudulent
   * @param {string} id - Transaction ID
   * @param {Object} data - Additional data about the fraud
   * @returns {Promise<Object>} Updated transaction
   */
  flagAsFraudulent: async (id, data = {}) => {
    try {
      return await apiClient.post(routes.TRANSACTION.FLAG_FRAUD(id), data);
    } catch (error) {
      console.error(`Error flagging transaction ${id} as fraudulent:`, error);
      throw error;
    }
  },

  /**
   * Mark a transaction as legitimate (not fraud)
   * @param {string} id - Transaction ID
   * @param {Object} data - Additional notes or data
   * @returns {Promise<Object>} Updated transaction
   */
  markAsLegitimate: async (id, data = {}) => {
    try {
      return await apiClient.post(routes.TRANSACTION.MARK_LEGITIMATE(id), data);
    } catch (error) {
      console.error(`Error marking transaction ${id} as legitimate:`, error);
      throw error;
    }
  },
};

export default transactionService;
