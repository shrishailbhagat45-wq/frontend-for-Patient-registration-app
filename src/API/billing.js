import axios from "axios";
import axiosRetry from "axios-retry";

// ==========================
// BASE URL
// ==========================
const url =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// ==========================
// AXIOS INSTANCE
// ==========================
const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// RETRY CONFIG
// ==========================
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

// ==========================
// AUTO ATTACH TOKEN
// ==========================
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
// GET BILLING ITEMS
// ==========================
export async function getBillingItems() {
  try {
    const doctorId = localStorage.getItem("doctorId");

    const response = await api.get(
      `/billing/${doctorId}`
    );

    console.log(
      "Billing items response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching billing items:",
      error
    );
    throw error;
  }
}

// ==========================
// ADD BILLING ITEM
// ==========================
export async function addItem(item) {
  try {
    const doctorId = localStorage.getItem("doctorId");

    const response = await api.post(
      `/billing/${doctorId}`,
      item
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error adding billing item:",
      error
    );
    throw error;
  }
}

// ==========================
// UPDATE BILLING ITEM
// ==========================
export async function updateItem(id, item) {
  try {
    const response = await api.put(
      `/billing/${id}`,
      item
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating billing item:",
      error
    );
    throw error;
  }
}

// ==========================
// DELETE BILLING ITEM
// ==========================
export async function deleteItem(id) {
  try {
    const response = await api.delete(
      `/billing/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting billing item:",
      error
    );
    throw error;
  }
}

// ==========================
// CREATE BILL
// ==========================
export async function createBill(billData) {
  try {
    const response = await api.post(
      "/patient-bills",
      billData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating bill:",
      error
    );
    throw error;
  }
}

// ==========================
// GET PATIENT BILLS
// ==========================
export async function getPatientBills({
  doctorId,
  date,
  month,
}) {
  try {
    const params = {};

    if (doctorId) params.doctorId = doctorId;
    if (date) params.date = date;
    if (month) params.month = month;

    const response = await api.get(
      "/patient-bills",
      { params }
    );

    console.log(
      "Fetched patient bills:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching patient bills:",
      error
    );
    throw error;
  }
}