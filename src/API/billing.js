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

// ==========================
// add service for billing dashboard
export async function addService(serviceData) {
  const data = {
    clinicId: localStorage.getItem("clinicId"),
    ...serviceData,
  };
  console.log("Adding service with data:", data);
  try {
    const response = await api.post(
      "/services-billing",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error adding service:",
      error
    );
    throw error;
  }
}

// ==========================
// GET SERVICES
export async function getServices() {
  try {
    const clinicId = localStorage.getItem("clinicId");
    const response = await api.get(
      `/services-billing/${clinicId}`
    );
    
    console.log("Services API Response:", response.data);
    
    // Handle both array and object responses
    const data = response.data;
    return Array.isArray(data) ? data : data.services || data.data || [];
  } catch (error) {
    console.error(
      "Error fetching services:",
      error
    );
    throw error;
  }
}

// ==========================
// UPDATE SERVICE
export async function updateService(serviceId, serviceData) {
  try {
    const response = await api.put(
      `/services-billing/${serviceId}`,
      serviceData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating service:",
      error
    );
    throw error;
  }
}

// ==========================
// DELETE SERVICE
export async function deleteService(serviceId) {
  try {
    const response = await api.delete(
      `/services-billing/${serviceId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting service:",
      error
    );
    throw error;
  }
}

// ==========================
// ADD LAB TEST
export async function addLabTest(testData) {
  const data = {
    clinicId: localStorage.getItem("clinicId"),
    ...testData,
  };
  console.log("Adding lab test with data:", data);
  try {
    const response = await api.post(
      "/lab-test-billing",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error adding lab test:",
      error
    );
    throw error;
  }
}

// ==========================
// GET LAB TESTS
export async function getLabTests() {
  try {
    const clinicId = localStorage.getItem("clinicId");
    const response = await api.get(
      `/lab-test-billing/${clinicId}`
    );
    
    console.log("Lab Tests API Response:", response.data);
    
    // Handle both array and object responses
    const data = response.data;
    return Array.isArray(data) ? data : data.labTests || data.data || [];
  } catch (error) {
    console.error(
      "Error fetching lab tests:",
      error
    );
    throw error;
  }
}

// ==========================
// UPDATE LAB TEST
export async function updateLabTest(testId, testData) {
  try {
    const response = await api.put(
      `/lab-test-billing/${testId}`,
      testData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating lab test:",
      error
    );
    throw error;
  }
}

// ==========================
// DELETE LAB TEST
export async function deleteLabTest(testId) {
  try {
    const response = await api.delete(
      `/lab-test-billing/${testId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting lab test:",
      error
    );
    throw error;
  }
}

// ==========================
// ADD MEDICINE
export async function addMedicine(medicineData) {
  const data = {
    clinicId: localStorage.getItem("clinicId"),
    ...medicineData,
  };
  console.log("Adding medicine with data:", data);
  try {
    const response = await api.post(
      "/medicines-billing",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error adding medicine:",
      error
    );
    throw error;
  }
}

// ==========================
// GET MEDICINES
export async function getMedicines(clinicId) {
  try {
    const response = await api.get(
      `/medicines-billing/${clinicId}`
    );
    
    console.log("Medicines API Response:", response.data);
    
    // Handle both array and object responses
    const data = response.data;
    return Array.isArray(data) ? data : data.medicines || data.data || [];
  } catch (error) {
    console.error(
      "Error fetching medicines:",
      error
    );
    throw error;
  }
}

// ==========================
// UPDATE MEDICINE
export async function updateMedicine(medicineId, medicineData) {
  try {
    const response = await api.put(
      `/medicines-billing/${medicineId}`,
      medicineData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating medicine:",
      error
    );
    throw error;
  }
}

// ==========================
// DELETE MEDICINE
export async function deleteMedicine(medicineId) {
  try {
    const response = await api.delete(
      `/medicines-billing /${medicineId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting medicine:",
      error
    );
    throw error;
  }
}

// ==========================
// INVOICE MANAGEMENT
// ==========================

/**
 * Create new invoice
 */
export async function createInvoice(invoiceData) {
  try {
    const response = await api.post(
      "/invoices",
      invoiceData
    );
    console.log("Invoice created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

/**
 * Get invoice by ID
 */
export async function getInvoice(invoiceId) {
  try {
    const response = await api.get(
      `/invoices/${invoiceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
}

/**
 * Get invoices by patient ID
 */
export async function getInvoicesByPatient(patientId, page = 1, limit = 10) {
  try {
    const response = await api.get(
      `/invoices/patient/${patientId}?page=${page}&limit=${limit}`
    );
    
    const data = response.data;
    console.log('getInvoicesByPatient response:', data);
    
    // Handle paginated response { data: [...], pagination: {...} }
    if (data.data && data.pagination) {
      return {
        invoices: Array.isArray(data.data) ? data.data : [],
        pagination: data.pagination,
      };
    }
    // Handle { invoices: [...], pagination: {...} }
    if (data.invoices && data.pagination) {
      return {
        invoices: data.invoices,
        pagination: data.pagination,
      };
    }
    // Handle simple array response
    return {
      invoices: Array.isArray(data) ? data : [],
      pagination: { page: 1, limit: 10, total: (Array.isArray(data) ? data : []).length },
    };
  } catch (error) {
    console.error("Error fetching patient invoices:", error);
    throw error;
  }
}

/**
 * Get invoices by clinic
 */
export async function getInvoicesByClinic(clinicId) {
  try {
    const response = await api.get(
      `/invoices/clinic/${clinicId}`
    );
    
    const data = response.data;
    return Array.isArray(data) ? data : data.invoices || [];
  } catch (error) {
    console.error("Error fetching clinic invoices:", error);
    throw error;
  }
}

/**
 * Get invoices by doctor
 */
export async function getInvoicesByDoctor(doctorId) {
  try {
    const response = await api.get(
      `/invoices/doctor/${doctorId}`
    );
    
    const data = response.data;
    return Array.isArray(data) ? data : data.invoices || [];
  } catch (error) {
    console.error("Error fetching doctor invoices:", error);
    throw error;
  }
}

/**
 * Update invoice
 */
export async function updateInvoice(invoiceId, invoiceData) {
  try {
    const response = await api.put(
      `/invoices/${invoiceId}`,
      invoiceData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
}

/**
 * Delete invoice
 */
export async function deleteInvoice(invoiceId) {
  try {
    const response = await api.delete(
      `/invoices/${invoiceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
}

/**
 * Get latest invoice by patient ID
 */
export async function getLatestInvoiceByPatient(patientId) {
  try {
    const response = await api.get(
      `/invoices/patient/${patientId}/latest`
    );
    
    const data = response.data;
    console.log('getLatestInvoiceByPatient response:', data);
    
    return data;
  } catch (error) {
    console.error("Error fetching latest patient invoice:", error);
    throw error;
  }
}

/**
 * Generate invoice PDF
 */
export async function generateInvoicePDF(invoiceId) {
  try {
    const response = await api.get(
      `/invoices/${invoiceId}/pdf`,
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    throw error;
  }
}
