// API Configuration

// Base URL for API endpoints
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Default request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// Default headers for API requests
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Function to create headers with authentication
const getAuthHeaders = () => {
  const headers = { ...DEFAULT_HEADERS };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export { API_BASE_URL, REQUEST_TIMEOUT, DEFAULT_HEADERS, getAuthHeaders };
