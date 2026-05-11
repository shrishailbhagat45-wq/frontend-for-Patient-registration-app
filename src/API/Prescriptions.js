import axios from "axios";
import axiosRetry from "axios-retry";

// ==========================
// BASE URL
// ==========================
const url =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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
// GET PRESCRIPTIONS BY PATIENT ID
// ==========================
export async function getPrescriptionsByPatientId(id) {
  try {
    const response = await api.get(
      `/prescriptions/patient/${id}`
    );

    console.log(
      "Fetched prescriptions response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching prescriptions:",
      error
    );
    throw error;
  }
}

// ==========================
// CREATE PRESCRIPTION
// ==========================
export async function createPrescription(
  id,
  prescriptionData
) {
  try {
    console.log(
      "Creating prescription with data:",
      prescriptionData
    );

    const response = await api.post(
      `/prescriptions/add/${id}`,
      prescriptionData
    );

    console.log(
      "Prescription created:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating prescription:",
      error
    );
    throw error;
  }
}

// ==========================
// UPDATE PRESCRIPTION
// ==========================
export async function updatePrescription(
  id,
  prescriptionData
) {
  try {
    console.log(
      "Updating prescription:",
      id,
      prescriptionData
    );

    const response = await api.put(
      `/prescriptions/${id}`,
      prescriptionData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating prescription:",
      error
    );
    throw error;
  }
}

// ==========================
// GET DRUG SUGGESTIONS
// ==========================
export async function getDrugSuggestions(name) {
  try {
    const response = await api.post(
      "/drugs",
      { name }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching drug suggestions:",
      error
    );
    throw error;
  }
}