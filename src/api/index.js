import apiClient from "./apiClient";
import {
  API_BASE_URL,
  REQUEST_TIMEOUT,
  DEFAULT_HEADERS,
  getAuthHeaders,
} from "./config";
import { ApiError } from "./apiClient";
import services from "./services";
import routes from "./routes";

// Re-export all components
export {
  apiClient,
  API_BASE_URL,
  REQUEST_TIMEOUT,
  DEFAULT_HEADERS,
  getAuthHeaders,
  ApiError,
  services,
  routes,
};

// Default export of the API object
export default {
  client: apiClient,
  config: {
    API_BASE_URL,
    REQUEST_TIMEOUT,
    DEFAULT_HEADERS,
    getAuthHeaders,
  },
  services,
  routes,
};
