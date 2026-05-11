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
// CREATE PATIENT
// ==========================
export async function createPatient(patientData) {
  try {
    const birthdayISO = patientData.birthDate
      ? new Date(patientData.birthDate).toISOString()
      : null;

    const data = {
      name: patientData.name,
      gender: patientData.gender,
      birthday: birthdayISO,
      phoneNumber: patientData.phoneNumber,
      weight: Number(patientData.weight),
      clinicId: localStorage.getItem("clinicId"),
    };

    const response = await api.post("/patient/create", data);

    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
}

// ==========================
// GET PATIENTS
// ==========================
export async function getPatients(name) {
  try {
    const data = {
      name: name.trim(),
      clinicId: localStorage.getItem("clinicId"),
    };

    const response = await api.post("/patient/getPatient", data);

    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
}

// ==========================
// GET PATIENT BY ID
// ==========================
export async function getPatientById(id) {
  try {
    const response = await api.get(`/patient/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
}

// ==========================
// GET PRESCRIPTION BY ID
// ==========================
export async function getPrescriptionById(id) {
  try {
    const response = await api.get(`/prescriptions/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching prescription:", error);
    throw error;
  }
}

// ==========================
// ADD PATIENT TO QUEUE
// ==========================
export async function addPatientToQueue(patient) {
  try {
    const data = {
      name: patient.name,
      patientId: patient._id,
      clinicId: patient.clinicId,
      doctorId: localStorage.getItem("doctorId"),
      phoneNumber: patient.phoneNumber,
    };

    const response = await api.post("/patient-queue", data);

    return response.data;
  } catch (error) {
    console.error("Error adding patient to queue:", error);
    throw error;
  }
}

// ==========================
// GET QUEUED PATIENTS
// ==========================
export async function getQueuedPatients() {
  try {
    const response = await api.get("/patient-queue", {
      headers: {
        doctorId: localStorage.getItem("doctorId"),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching queued patients:", error);
    throw error;
  }
}

// ==========================
// REMOVE FROM QUEUE
// ==========================
export async function removeFromQueueById(id) {
  try {
    const response = await api.delete(`/patient-queue/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error removing patient from queue:", error);
    throw error;
  }
}

// ==========================
// UPDATE PATIENT VITALS
// ==========================
export async function updatePatientVitals(patientId, vitalsData) {
  try {
    const response = await api.put(
      `/patient/${patientId}`,
      vitalsData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating patient vitals:", error);
    throw error;
  }
}

// ==========================
// CHECK BACKEND STATUS
// ==========================
export async function backendIsInitialized() {
  try {
    
    const response = await api.get("/");

    return response.status;
  } catch (error) {
    console.error("Error checking backend:", error);
    throw error;
  }
}