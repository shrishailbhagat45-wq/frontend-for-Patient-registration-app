import { toast } from 'react-toastify';

/**
 * Error Types for classification
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Error Messages Map
 */
const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'Network error. Please check your internet connection.',
  [ErrorTypes.AUTHENTICATION]: 'Authentication failed. Please login again.',
  [ErrorTypes.AUTHORIZATION]: 'You do not have permission to perform this action.',
  [ErrorTypes.VALIDATION]: 'Please check your input and try again.',
  [ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorTypes.SERVER]: 'Server error. Please try again later.',
  [ErrorTypes.CLIENT]: 'Something went wrong. Please try again.',
  [ErrorTypes.TIMEOUT]: 'Request timeout. Please try again.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred.',
};

/**
 * Classify error based on status code and error details
 */
export function classifyError(error) {
  // Network errors (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return ErrorTypes.TIMEOUT;
    }
    return ErrorTypes.NETWORK;
  }

  const status = error.response.status;

  // HTTP status code classification
  if (status === 401) {
    return ErrorTypes.AUTHENTICATION;
  } else if (status === 403) {
    return ErrorTypes.AUTHORIZATION;
  } else if (status === 404) {
    return ErrorTypes.NOT_FOUND;
  } else if (status === 422 || status === 400) {
    return ErrorTypes.VALIDATION;
  } else if (status >= 500) {
    return ErrorTypes.SERVER;
  } else if (status >= 400) {
    return ErrorTypes.CLIENT;
  }

  return ErrorTypes.UNKNOWN;
}

/**
 * Extract meaningful error message from error object
 */
export function extractErrorMessage(error) {
  // Check for custom message from backend
  if (error.response?.data?.message) {
    const message = error.response.data.message;
    
    // Handle array of error messages (validation errors)
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    
    return message;
  }

  // Check for error description
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Check for axios error message
  if (error.message) {
    return error.message;
  }

  // Fallback to error type message
  const errorType = classifyError(error);
  return ErrorMessages[errorType];
}

/**
 * Log error for debugging (can be extended to send to monitoring service)
 */
export function logError(error, context = {}) {
  const errorType = classifyError(error);
  const errorMessage = extractErrorMessage(error);

  console.error('Error occurred:', {
    type: errorType,
    message: errorMessage,
    context,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString(),
    fullError: error,
  });

  // TODO: Send to monitoring service (e.g., Sentry, LogRocket)
  // sendToMonitoring({ type: errorType, message: errorMessage, context });
}

/**
 * Handle error with toast notification and logging
 * @param {Error} error - The error object
 * @param {Object} options - Configuration options
 * @param {string} options.context - Context where error occurred
 * @param {string} options.customMessage - Custom error message to display
 * @param {boolean} options.showToast - Whether to show toast notification (default: true)
 * @param {Function} options.onError - Callback function to execute after error handling
 * @returns {Object} - { type, message } for further handling if needed
 */
export function handleError(error, options = {}) {
  const {
    context = 'Application',
    customMessage = null,
    showToast = true,
    onError = null,
  } = options;

  // Log error for debugging
  logError(error, { context });

  // Get error type and message
  const errorType = classifyError(error);
  const errorMessage = customMessage || extractErrorMessage(error);

  // Show toast notification
  if (showToast) {
    switch (errorType) {
      case ErrorTypes.AUTHENTICATION:
        toast.error(errorMessage, {
          autoClose: 5000,
          onClose: () => {
            // Redirect to login page after toast closes
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          },
        });
        break;

      case ErrorTypes.NETWORK:
      case ErrorTypes.TIMEOUT:
        toast.error(errorMessage, {
          autoClose: 7000,
          icon: '🌐',
        });
        break;

      case ErrorTypes.VALIDATION:
        toast.warning(errorMessage, {
          autoClose: 5000,
          icon: '⚠️',
        });
        break;

      case ErrorTypes.SERVER:
        toast.error(errorMessage, {
          autoClose: 6000,
          icon: '🔧',
        });
        break;

      default:
        toast.error(errorMessage, {
          autoClose: 5000,
        });
    }
  }

  // Execute custom callback if provided
  if (onError && typeof onError === 'function') {
    onError(error, errorType, errorMessage);
  }

  // Return error details for further handling
  return {
    type: errorType,
    message: errorMessage,
    originalError: error,
  };
}

/**
 * Async wrapper for API calls with automatic error handling
 * @param {Function} apiCall - The async API function to call
 * @param {Object} options - Error handling options (same as handleError)
 * @returns {Promise<{success: boolean, data?: any, error?: Object}>}
 */
export async function withErrorHandling(apiCall, options = {}) {
  try {
    const result = await apiCall();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const errorDetails = handleError(error, options);
    return {
      success: false,
      error: errorDetails,
    };
  }
}

/**
 * React Hook for error handling in components
 */
export function useErrorHandler() {
  const handleComponentError = (error, options = {}) => {
    return handleError(error, {
      showToast: true,
      ...options,
    });
  };

  return { handleError: handleComponentError };
}

/**
 * Format validation errors from backend
 */
export function formatValidationErrors(errors) {
  if (Array.isArray(errors)) {
    return errors.map((err) => err.message || err).join('\n');
  }

  if (typeof errors === 'object') {
    return Object.entries(errors)
      .map(([field, messages]) => {
        const messageStr = Array.isArray(messages) ? messages.join(', ') : messages;
        return `${field}: ${messageStr}`;
      })
      .join('\n');
  }

  return errors;
}
