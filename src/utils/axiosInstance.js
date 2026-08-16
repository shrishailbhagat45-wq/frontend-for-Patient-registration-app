import axios from 'axios';
import axiosRetry from 'axios-retry';
import { handleError, ErrorTypes } from './errorHandler';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

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
      const originalRequest = error.config;

      // Avoid infinite loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Refresh token flow
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token -> force logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('role');
          localStorage.removeItem('clinicId');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        // Shared state for single refresh call
        if (!axiosInstance._isRefreshing) {
          axiosInstance._isRefreshing = true;
          axiosInstance._refreshSubscribers = [];

          // Use a plain axios instance to call refresh endpoint (avoid interceptor loop)
          // Send the refresh token in the Authorization header (Bearer) so
          // the server returns a new access token (and not necessarily a new refresh token).
          const plainAxios = axios.create({ baseURL });

          return plainAxios.post(
            '/auth/refresh-token',
            null,
            { headers: { Authorization: `Bearer ${refreshToken}` } }
          )
            .then((res) => {
              const data = res.data.data || res.data;
              const newToken = data.token || data.accessToken;
              const newRefresh = data.refreshToken || data.refresh;

              if (newToken) localStorage.setItem('token', newToken);
              if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

              axiosInstance._isRefreshing = false;

              // Retry all subscribers
              axiosInstance._refreshSubscribers.forEach((cb) => cb(newToken));
              axiosInstance._refreshSubscribers = [];

              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            })
            .catch((refreshError) => {
              // Refresh failed -> clear storage and redirect
              axiosInstance._isRefreshing = false;
              axiosInstance._refreshSubscribers = [];
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userId');
              localStorage.removeItem('role');
              localStorage.removeItem('clinicId');
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            });
        }

        // If refresh already in progress, queue the request
        return new Promise((resolve, reject) => {
          axiosInstance._refreshSubscribers.push((token) => {
            // set the Authorization header and retry
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
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
