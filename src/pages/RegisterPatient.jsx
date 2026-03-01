import { useState } from "react";
import { createPatient, getPatients } from "../API/Patient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import {
  FaUser,
  FaPhone,
  FaWeight,
  FaCalendarAlt,
  FaVenusMars,
  FaInfoCircle,
} from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const RegisterPatient = () => {  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthDate: "",
    phoneNumber: "",
    weight: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For name field, only allow letters and spaces
    if (name === 'name') {
      // Check if there are any invalid characters (not letters or spaces)
      const hasInvalidChars = /[^a-zA-Z\s]/.test(value);
      
      if (hasInvalidChars) {
        setNameError("Only alphabetic characters and spaces are allowed");
        // Show error briefly then clear it after 2 seconds
        setTimeout(() => setNameError(""), 2000);
      } else {
        setNameError("");
      }
      
      // Remove any characters that are not letters or spaces
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
      setForm((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createPatient(form);
      if (response.status === 201) {
        toast.success("Patient Registered Successfully");
        navigate("/home");
      } else {
        toast.error("Error in registering patient");
      }    } catch (error) {
      // Show specific error message from backend if available
      const errorMessage = error.response?.data?.message?.[0] || 
                          error.response?.data?.message ||
                          error.response?.data?.error ||
                          "Error in registering patient. Please check all fields.";
      toast.error(errorMessage);
      
      // Parse backend validation errors and set field-specific errors
      const backendMessages = error.response?.data?.message;
      if (Array.isArray(backendMessages)) {
        const errors = {};
        backendMessages.forEach((msg) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("name")) errors.name = msg;
          else if (lowerMsg.includes("gender")) errors.gender = msg;
          else if (lowerMsg.includes("birthday") || lowerMsg.includes("birth")) errors.birthDate = msg;
          else if (lowerMsg.includes("phone")) errors.phoneNumber = msg;
          else if (lowerMsg.includes("weight")) errors.weight = msg;
        });
        setFieldErrors(errors);
        // Clear field errors after 5 seconds
        setTimeout(() => setFieldErrors({}), 5000);
      }
      
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="min-h-screen bg-slate-50 pt-20 px-4 pb-8">
        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 text-sm"
            >
              <IoArrowBack className="text-lg" />
              <span>Back to Home</span>
            </button>
            <h2 className="text-2xl font-semibold text-slate-800">
              Register New Patient
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter patient details to create a new record
            </p>
          </div>          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">              {/* Name Field */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                  htmlFor="name"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-slate-400 text-sm" />
                  </div>
                  <input
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-slate-800 transition-colors ${
                      nameError
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter patient's full name"
                    required
                  />
                </div>
                {nameError && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <FaInfoCircle className="text-sm" />
                    {nameError}
                  </p>
                )}              </div>{/* Gender Field */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                  htmlFor="gender"
                >
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaVenusMars className="text-slate-400 text-sm" />
                  </div>
                  <select
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-slate-800 transition-colors appearance-none ${
                      fieldErrors.gender
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {fieldErrors.gender && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <FaInfoCircle className="text-sm" />
                    {fieldErrors.gender}
                  </p>
                )}
              </div>              {/* Birth Date and Weight Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Birth Date Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                    htmlFor="birthDate"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-slate-400 text-sm" />
                    </div>
                    <input
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-slate-800 transition-colors ${
                        fieldErrors.birthDate
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={form.birthDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  {fieldErrors.birthDate && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <FaInfoCircle className="text-sm" />
                      {fieldErrors.birthDate}
                    </p>
                  )}
                </div>                {/* Weight Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                    htmlFor="weight"
                  >
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaWeight className="text-slate-400 text-sm" />
                    </div>
                    <input
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-slate-800 transition-colors ${
                        fieldErrors.weight
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      type="number"
                      id="weight"
                      name="weight"
                      value={form.weight}
                      onChange={handleChange}
                      placeholder="Weight"
                      min="0"
                      max="500"
                      step="0.1"
                      required
                    />
                  </div>
                  {fieldErrors.weight && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <FaInfoCircle className="text-sm" />
                      {fieldErrors.weight}
                    </p>
                  )}
                </div>
              </div>              {/* Phone Number Field */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                  htmlFor="phoneNumber"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-slate-400 text-sm" />
                  </div>
                  <input
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-slate-800 transition-colors ${
                      fieldErrors.phoneNumber
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    minLength={10}
                    maxLength={10}
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
                {fieldErrors.phoneNumber && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <FaInfoCircle className="text-sm" />
                    {fieldErrors.phoneNumber}
                  </p>
                )}
              </div>{/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium text-sm shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Register Patient</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPatient;
