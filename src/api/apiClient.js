import { API_BASE_URL, REQUEST_TIMEOUT, getAuthHeaders } from "./config";

/**
 * Custom error class for API responses
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

/**
 * Function to handle API response
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get("Content-Type") || "";

  let data;
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new ApiError(
      data.message || response.statusText,
      response.status,
      data
    );
  }

  return data;
};

/**
 * Function to create a controller with timeout
 */
const createControllerWithTimeout = () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  return { controller, timeout };
};

/**
 * Base API client for making HTTP requests
 */
const apiClient = {
  /**
   * Make a GET request
   */
  get: async (endpoint, params = {}, customHeaders = {}) => {
    const { controller, timeout } = createControllerWithTimeout();
    try {
      // Build URL with query parameters
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });

      // Make the request
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { ...getAuthHeaders(), ...customHeaders },
        signal: controller.signal,
      });

      return await handleResponse(response);
    } finally {
      clearTimeout(timeout);
    }
  },

  /**
   * Make a POST request
   */
  post: async (endpoint, data = {}, customHeaders = {}) => {
    const { controller, timeout } = createControllerWithTimeout();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { ...getAuthHeaders(), ...customHeaders },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return await handleResponse(response);
    } finally {
      clearTimeout(timeout);
    }
  },

  /**
   * Make a PUT request
   */
  put: async (endpoint, data = {}, customHeaders = {}) => {
    const { controller, timeout } = createControllerWithTimeout();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), ...customHeaders },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return await handleResponse(response);
    } finally {
      clearTimeout(timeout);
    }
  },

  /**
   * Make a DELETE request
   */
  delete: async (endpoint, customHeaders = {}) => {
    const { controller, timeout } = createControllerWithTimeout();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders(), ...customHeaders },
        signal: controller.signal,
      });

      return await handleResponse(response);
    } finally {
      clearTimeout(timeout);
    }
  },

  /**
   * Make a PATCH request
   */
  patch: async (endpoint, data = {}, customHeaders = {}) => {
    const { controller, timeout } = createControllerWithTimeout();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), ...customHeaders },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return await handleResponse(response);
    } finally {
      clearTimeout(timeout);
    }
  },
};

export default apiClient;
