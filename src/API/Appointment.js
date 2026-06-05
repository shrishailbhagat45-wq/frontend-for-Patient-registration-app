import api from "../utils/axiosInstance";

// ==========================
// CREATE APPOINTMENT
// ==========================
export async function createAppointment(appointmentData) {
  try {
    const data = {
      patientId: appointmentData.patientId,
      clinicId: appointmentData.clinicId,
      doctorId: appointmentData.doctorId,
      date: appointmentData.date,
      timeFrom: appointmentData.timeFrom,
      timeTo: appointmentData.timeTo,
    };

    const response = await api.post("/appointment/create", data);

    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

// ==========================
// GET APPOINTMENTS
// ==========================
export async function getAppointments() {
  try {
    const response = await api.get("/appointment/doctor", {
      headers: {
        doctorId: localStorage.getItem("doctorId"),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

// ==========================
// UPDATE APPOINTMENT STATUS
// ==========================
export async function updateAppointmentStatus(id, status) {
  try {
    const response = await api.patch(`/appointment/${id}/status`, { status });

    return response.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
}
