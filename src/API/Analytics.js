import api from "../utils/axiosInstance";

// ==========================
// GET PAYMENT METHODS ANALYTICS
// ==========================
export async function getPaymentMethodsAnalytics(period = "today") {
  try {
    const clinicId = localStorage.getItem("clinicId");

    const response = await api.get(
      `/invoices/analytics/payment-methods?period=${period}&clinicId=${clinicId}`,
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
      `/invoices/analytics/doctor-performance?period=${period}&clinicId=${clinicId}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching doctor performance analytics:", error);
    throw error;
  }
}

// ==========================
// GET FINANCIAL SUMMARY ANALYTICS
// ==========================
export async function getFinancialSummaryAnalytics(period = "today") {
  try {
    const clinicId = localStorage.getItem("clinicId");
    const response = await api.get(
      `/invoices/analytics/financial-summary?period=${period}&clinicId=${clinicId}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching financial summary analytics:", error);
    throw error;
  }
}

// ==========================
// GET DASHBOARD ANALYTICS
// ==========================
export async function getDashboardAnalytics(period = "today") {
  try {
    const clinicId = localStorage.getItem("clinicId");
    const response = await api.get(
      `/invoices/analytics/dashboard?period=${period}&clinicId=${clinicId}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    throw error;
  }
}

export async function getCompanyPrescriptionAnalytics({
  page = 1,
  limit = 20,
  doctorId,
  month,
  year,
} = {}) {
  try {
    const params = { page, limit };
    if (doctorId) params.doctorId = doctorId;
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;

    const response = await api.get("/prescriptions/analytics/companies", {
      params,
    });
    const result = response.data;

    if (!Array.isArray(result?.data) || !result?.pagination) {
      throw new Error("Unexpected company analytics response");
    }

    return result;
  } catch (error) {
    console.error("Error fetching prescription company analytics:", error);
    throw error;
  }
}
