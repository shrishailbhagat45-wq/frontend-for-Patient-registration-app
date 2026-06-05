import axios from 'axios';
import axiosRetry from 'axios-retry';
import { handleError, ErrorTypes } from './errorHandler';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Create axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry logic for failed requests
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status >= 500 && error.response?.status < 600)
    );
  },
  shouldResetTimeout: true,
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  },
});

// Request interceptor - attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response
    return response;
  },
  (error) => {
    // Handle specific error scenarios

    // Network error
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle 401 Unauthorized - token expired or invalid
    if (status === 401) {
      console.error('Authentication error: Token expired or invalid');
      
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('clinicId');

      // Redirect to login only if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (status === 403) {
      console.error('Authorization error: Insufficient permissions');
    }

    // Handle 404 Not Found
    if (status === 404) {
      console.error('Resource not found:', error.config.url);
    }

    // Handle 422 Validation Error
    if (status === 422 || status === 400) {
      console.error('Validation error:', error.response.data);
    }

    // Handle 500+ Server errors
    if (status >= 500) {
      console.error('Server error:', status, error.response.data);
    }

    // Reject the promise so the caller can handle it
    return Promise.reject(error);
  }
);

export default axiosInstance;
