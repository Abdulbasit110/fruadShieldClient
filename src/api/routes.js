/**
 * API Routes Configuration
 *
 * This file centralizes all API endpoint paths to avoid hardcoding them
 * throughout the application and make maintenance easier.
 */

// Auth endpoints
const AUTH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/signup",
  REFRESH_TOKEN: "/auth/refresh-token",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_TOKEN: "/auth/verify-code",
  RESET_PASSWORD: "/auth/reset-password",
};

// User endpoints
const USER = {
  PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/password",
  NOTIFICATIONS: "/users/notifications",
  NOTIFICATION_PREFERENCES: "/users/notifications/preferences",
  MARK_ALL_NOTIFICATIONS_READ: "/users/notifications/read-all",
};

// Transaction endpoints
const TRANSACTION = {
  BASE: "/transactions",
  STATS: "/transactions/stats",
  USER_TRANSACTIONS: (userId) => `/users/${userId}/transactions`,
  SINGLE: (id) => `/transactions/${id}`,
  FRAUD_SCORE: (id) => `/transactions/${id}/fraud-score`,
  FLAG_FRAUD: (id) => `/transactions/${id}/flag-fraud`,
  MARK_LEGITIMATE: (id) => `/transactions/${id}/mark-legitimate`,
};

// Fraud detection endpoints
const FRAUD = {
  DASHBOARD: "/fraud/dashboard",
  ANALYZE: "/fraud/analyze",
  ALERTS: "/fraud/alerts",
  ALERT_DETAILS: (id) => `/fraud/alerts/${id}`,
  UPDATE_ALERT_STATUS: (id) => `/fraud/alerts/${id}/status`,
  MODEL_PERFORMANCE: "/fraud/model/performance",
};

// Export all route groups
export default {
  AUTH,
  USER,
  TRANSACTION,
  FRAUD,
};
