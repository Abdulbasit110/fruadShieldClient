import { useState, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Custom hook for making API calls with loading state and error handling
 *
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Hook configuration options
 * @param {boolean} options.showSuccessToast - Whether to show a success toast
 * @param {string} options.successMessage - Custom success message
 * @param {boolean} options.showErrorToast - Whether to show an error toast
 * @param {Function} options.onSuccess - Callback for successful API calls
 * @param {Function} options.onError - Callback for failed API calls
 * @returns {Object} API call state and executor function
 */
const useApi = (
  apiCall,
  {
    showSuccessToast = false,
    successMessage = "Operation successful",
    showErrorToast = true,
    onSuccess = null,
    onError = null,
  } = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Execute the API call with the provided parameters
   */
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(...args);
        setData(result);

        // Show success toast if configured
        if (showSuccessToast) {
          toast.success(successMessage);
        }

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        setError(err);

        // Show error toast if configured
        if (showErrorToast) {
          toast.error(err.message || "An error occurred during the operation");
        }

        // Call error callback if provided
        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      apiCall,
      showSuccessToast,
      successMessage,
      showErrorToast,
      onSuccess,
      onError,
    ]
  );

  return {
    loading,
    error,
    data,
    execute,
    reset: useCallback(() => {
      setData(null);
      setError(null);
    }, []),
  };
};

export default useApi;
