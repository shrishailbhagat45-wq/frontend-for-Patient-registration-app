import axios from "axios";
import axiosRetry from "axios-retry";

const url =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Axios instance
const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Retry failed requests
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

// Automatically attach latest token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// GET PAYMENT METHODS ANALYTICS
// ==========================
export async function getPaymentMethodsAnalytics(period = "today") {
  try {
    const clinicId = localStorage.getItem("clinicId");
    
    const response = await api.get(
      `/invoices/analytics/payment-methods?period=${period}&clinicId=${clinicId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching payment methods analytics:", error);
    throw error;
  }
}

// ==========================
// GET DOCTOR PERFORMANCE ANALYTICS
// ==========================
export async function getDoctorPerformanceAnalytics(period = "today") {
  try {
    const clinicId = localStorage.getItem("clinicId");
    
    const response = await api.get(
      `/invoices/analytics/doctor-performance?period=${period}&clinicId=${clinicId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching doctor performance analytics:", error);
    throw error;
  }
}
