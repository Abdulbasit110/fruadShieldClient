import apiClient from "../apiClient";
import routes from "../routes";

/**
 * Customer Transaction service for handling live customer transaction API operations
 * This service handles real customer transactions, separate from training data
 */
const customerTransactionService = {
  /**
   * Get customer transactions with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Field to sort by
   * @param {string} params.sortOrder - Sort direction (asc/desc)
   * @param {Object} params.filters - Additional filtering criteria
   * @returns {Promise<Object>} Customer transactions list with pagination info
   */
  getCustomerTransactions: async (params = {}) => {
    try {
      return await apiClient.get(routes.CUSTOMER_TRANSACTION.BASE, params);
    } catch (error) {
      console.error("Error fetching customer transactions:", error);
      throw error;
    }
  },

  /**
   * Get customer transactions by date range
   * @param {Object} params - Query parameters
   * @param {string} params.start_date - Start date
   * @param {string} params.end_date - End date
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @returns {Promise<Object>} Customer transactions list with pagination info
   */
  getCustomerTransactionsByDate: async (params = {}) => {
    try {
      return await apiClient.get(routes.CUSTOMER_TRANSACTION.BY_DATE, params);
    } catch (error) {
      console.error("Error fetching customer transactions by date:", error);
      throw error;
    }
  },

  /**
   * Get a single customer transaction by ID
   * @param {string} id - Customer transaction ID
   * @returns {Promise<Object>} Customer transaction details
   */
  getCustomerTransactionById: async (id) => {
    try {
      return await apiClient.get(routes.CUSTOMER_TRANSACTION.SINGLE(id));
    } catch (error) {
      console.error(`Error fetching customer transaction ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new customer transaction with prediction
   * @param {Object} transactionData - Customer transaction data
   * @returns {Promise<Object>} Created customer transaction with fraud analysis
   */
  createCustomerTransaction: async (transactionData) => {
    try {
      return await apiClient.post(
        routes.CUSTOMER_TRANSACTION.CREATE,
        transactionData
      );
    } catch (error) {
      console.error("Error creating customer transaction:", error);
      throw error;
    }
  },

  /**
   * Get customer transaction statistics for dashboard
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.period - Time period (day, week, month, year)
   * @param {string} params.from - Start date
   * @param {string} params.to - End date
   * @returns {Promise<Object>} Customer transaction statistics
   */
  getCustomerTransactionStats: async (params = {}) => {
    try {
      return await apiClient.get(routes.CUSTOMER_TRANSACTION.STATS, params);
    } catch (error) {
      console.error("Error fetching customer transaction statistics:", error);
      throw error;
    }
  },

  /**
   * Get flagged customer transactions for review
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Flagged customer transactions list
   */
  getFlaggedTransactions: async (params = {}) => {
    try {
      return await apiClient.get(routes.CUSTOMER_TRANSACTION.FLAGGED, params);
    } catch (error) {
      console.error("Error fetching flagged customer transactions:", error);
      throw error;
    }
  },

  /**
   * Flag a customer transaction for review
   * @param {string} id - Customer transaction ID
   * @param {Object} data - Additional data about the flag
   * @returns {Promise<Object>} Updated customer transaction
   */
  flagCustomerTransaction: async (id, data = {}) => {
    try {
      return await apiClient.post(routes.CUSTOMER_TRANSACTION.FLAG(id), data);
    } catch (error) {
      console.error(`Error flagging customer transaction ${id}:`, error);
      throw error;
    }
  },

  /**
   * Review a customer transaction (approve/reject)
   * @param {string} id - Customer transaction ID
   * @param {Object} data - Review data including status and notes
   * @returns {Promise<Object>} Updated customer transaction
   */
  reviewCustomerTransaction: async (id, data = {}) => {
    try {
      return await apiClient.post(routes.CUSTOMER_TRANSACTION.REVIEW(id), data);
    } catch (error) {
      console.error(`Error reviewing customer transaction ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics specifically for customer transactions
   * @returns {Promise<Object>} Dashboard statistics for live customer data
   */
  getDashboardStats: async () => {
    try {
      return await apiClient.get(routes.CUSTOMER_TRANSACTION.STATS);
    } catch (error) {
      console.error(
        "Error fetching customer transaction dashboard statistics:",
        error
      );
      throw error;
    }
  },
};

export default customerTransactionService;
