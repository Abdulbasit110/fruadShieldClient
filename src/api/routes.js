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
  NOTIFICATIONS: "/auth/notifications",
};

// User endpoints
const USER = {
  BASE: "/users",
  PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/password",
  NOTIFICATIONS: "/transactions/notifications",
  NOTIFICATION_PREFERENCES: "/users/notifications/preferences",
  MARK_ALL_NOTIFICATIONS_READ: "/users/notifications/read-all",
  ADMIN_USERS: "/auth/users",
  ADMIN_UPDATE_USER: (userId) => `/auth/approve-user/${userId}`,
  ADMIN_INVITE: "/users/admin/invite",
  MAKE_ADMIN: "/auth/make-admin",
};

// Transaction endpoints
const TRANSACTION = {
  BASE: "/transactions",
  BY_DATE: "/transactions/by-date",
  STATS: "/transactions/stats",
  DASHBOARD_STATS: "/transactions/dashboard-stats",
  MODEL_PARAMS: "/model_params/all",
  UPDATE_MODEL_PARAMS: (id) => `/model_params/update/${id}`,
  USER_TRANSACTIONS: (userId) => `/users/${userId}/transactions`,
  SINGLE: (id) => `/transactions/${id}`,
  FRAUD_SCORE: (id) => `/transactions/${id}/fraud-score`,
  FLAG_FRAUD: (id) => `/transactions/${id}/flag-fraud`,
  MARK_LEGITIMATE: (id) => `/transactions/${id}/mark-legitimate`,
  SENDER_FEATURES: "/model/features",
  SENDER_FEATURE: (id) => `/model/features/${id}`,
};

// Customer Transaction endpoints (live customer data)
const CUSTOMER_TRANSACTION = {
  BASE: "/customer-transactions",
  BY_DATE: "/customer-transactions/by-date",
  STATS: "/customer-transactions/stats",
  FLAGGED: "/customer-transactions/flagged",
  SINGLE: (id) => `/customer-transactions/${id}`,
  REVIEW: (id) => `/customer-transactions/${id}/review`,
  FLAG: (id) => `/customer-transactions/${id}/flag`,
  CREATE: "/customer-transactions/create",
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
  CUSTOMER_TRANSACTION,
  FRAUD,
};
