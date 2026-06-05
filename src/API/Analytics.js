import api from "../utils/axiosInstance";

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
