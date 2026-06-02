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
// LOGIN
// ==========================
export async function login(email, password) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data.data;
  } catch (error) {
    console.error("Invalid credentials:", error);
    throw error;
  }
}

// ==========================
// ADD RECEPTIONIST
// ==========================
export async function addReceptionist(receptionistData) {
  try {
    const data = {
      ...receptionistData,
      doctorId: localStorage.getItem("doctorId"),
    };

    const response = await api.post(
      "/user/addReceptionist",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error adding receptionist:", error);
    throw error;
  }
}

// ==========================
// GET RECEPTIONISTS
// ==========================
export async function getReceptionist() {
  try {
    const payload = {
      role: localStorage.getItem("role"),
      doctorId: localStorage.getItem("doctorId"),
      clinicId: localStorage.getItem("clinicId"),
    };
    const response = await api.post("/user/receptionists", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching receptionists:", error);
    throw error;
  }
}

// ==========================
// GET USER BY ID
// ==========================
export async function getUserById(id) {
  try {
    const response = await api.get(`/user/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// ==========================
// UPDATE USER
// ==========================
export async function updateUser(userData) {
  try {
    const id = localStorage.getItem("Id");

    const data = {
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      specialization: userData.specialization,
    };

    const response = await api.put(`/user/${id}`, data);

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// ==========================
// UPDATE PASSWORD
// ==========================
export async function updatePassword(passwordData) {
  try {
    const id = localStorage.getItem("Id");

    const data = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    const response = await api.put(
      `/user/password/${id}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}


// ==========================
// ADD DOCTOR
// ==========================
export async function addDoctor(doctorData) {
  const data={...doctorData,
    clinicId: localStorage.getItem('clinicId')
  }
  try {
    const response = await api.post(
      "/user/addDoctor",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
}

// ==========================
// GET DOCTOR
// ==========================
export async function getDoctor() {
  const id=localStorage.getItem("clinicId")
  try {
    const response = await api.get(`/user/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
}

// ==========================
// Get all doctors including the admin doctor for the clinic
// ==========================
export async function getAllDoctors() {
  const clinicId = localStorage.getItem("clinicId");
  try {
    const response = await api.get(`/user/allDoctors/${clinicId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
}

// ==========================
// CREATE CLINIC
// ==========================
export async function createClinic(data) {
  try {
    const response = await api.post(
      "/clinic/register",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
}


// ==========================
// DELETE USERS
// ==========================

export async function deleteUser(id){
  try {
    const response = await api.delete(`/user/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
}