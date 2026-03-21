import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatientById, updatePatientVitals } from '../API/Patient';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { FiArrowLeft, FiEdit2, FiSave, FiX } from 'react-icons/fi';

// Helper function to calculate age from birthDate
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default function EditPatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    phoneNumber: '',
    weight: '',
    bloodPressure: '',
    pulseRate: '',
    bloodSugarLevel: '',
  });

  // Fetch patient data
  const { data: patientData = {}, isLoading, refetch } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const patient = await getPatientById(id);
      return patient.data || {};
    },
    enabled: !!id,
  });

  // Populate form with patient data
  useEffect(() => {
    if (patientData && Object.keys(patientData).length > 0) {
      setFormData({
        name: patientData.name || '',
        gender: patientData.gender || '',
        birthday: patientData.birthday ? patientData.birthday.split('T')[0] : '',
        phoneNumber: patientData.phoneNumber || '',
        weight: patientData.weight || '',
        bloodPressure: patientData.bloodPressure || '',
        pulseRate: patientData.pulseRate || '',
        bloodSugarLevel: patientData.bloodSugarLevel || '',
      });
    }
  }, [patientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const vitalsData = {};
      
      if (formData.weight) vitalsData.weight = parseFloat(formData.weight);
      if (formData.bloodPressure) vitalsData.bloodPressure = formData.bloodPressure;
      if (formData.pulseRate) vitalsData.pulseRate = parseInt(formData.pulseRate);
      if (formData.bloodSugarLevel) vitalsData.bloodSugarLevel = parseFloat(formData.bloodSugarLevel);
      if (formData.phoneNumber) vitalsData.phoneNumber = formData.phoneNumber;
      if (formData.name) vitalsData.name = formData.name;
      if (formData.gender) vitalsData.gender = formData.gender;
      if (formData.birthday) vitalsData.birthday = new Date(formData.birthday).toISOString();

      await updatePatientVitals(id, vitalsData);
      toast.success('Patient information updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    if (patientData && Object.keys(patientData).length > 0) {
      setFormData({
        name: patientData.name || '',
        gender: patientData.gender || '',
        birthday: patientData.birthday ? patientData.birthday.split('T')[0] : '',
        phoneNumber: patientData.phoneNumber || '',
        weight: patientData.weight || '',
        bloodPressure: patientData.bloodPressure || '',
        pulseRate: patientData.pulseRate || '',
        bloodSugarLevel: patientData.bloodSugarLevel || '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading patient information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="w-full px-0 md:max-w-4xl md:mx-auto md:px-8 pt-20 pb-8">
        
        {/* Back Button */}
        <div className="px-4 md:px-0">
          <button
            onClick={() => navigate(`/patient/${id}`)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 text-sm"
          >
            <FiArrowLeft className="text-base" />
            <span>Back to Patient Info</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm border-b md:border border-slate-200 p-4 md:p-6 mb-0 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-bold text-xl md:text-2xl">
                  {formData.name?.charAt(0).toUpperCase() || 'P'}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold text-slate-800 truncate">
                  {formData.name?.toUpperCase() || 'PATIENT'}
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  {formData.birthday ? `${calculateAge(formData.birthday)} years old` : 'Age not set'}
                </p>
              </div>
            </div>

            {/* Edit/Save/Cancel Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2.5 md:py-2 bg-blue-600 text-white rounded-lg md:rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm active:scale-95 whitespace-nowrap"
                >
                  <FiEdit2 className="text-base" />
                  Edit Info
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-2 bg-slate-200 text-slate-700 rounded-lg md:rounded-md hover:bg-slate-300 transition-colors font-medium shadow-sm text-sm disabled:opacity-50 active:scale-95 whitespace-nowrap"
                  >
                    <FiX className="text-base" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-2 bg-green-600 text-white rounded-lg md:rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm text-sm disabled:opacity-50 active:scale-95 whitespace-nowrap"
                  >
                    <FiSave className="text-base" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm border-b md:border border-slate-200 p-0 md:p-6">
          <div className="space-y-6 p-4 md:p-0">
            
            {/* Basic Information Section */}
            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs Section */}
            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                Vital Signs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                
                {/* Weight */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                    placeholder="e.g. 70.5"
                  />
                </div>

                {/* Blood Pressure */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                    placeholder="e.g. 120/80"
                  />
                </div>

                {/* Pulse Rate */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Pulse Rate (bpm)
                  </label>
                  <input
                    type="number"
                    name="pulseRate"
                    value={formData.pulseRate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                    placeholder="e.g. 72"
                  />
                </div>

                {/* Blood Sugar Level */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                    Blood Sugar Level (mg/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="bloodSugarLevel"
                    value={formData.bloodSugarLevel}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>
            </div>

            {/* Info Message */}
            {!isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-blue-700">
                  Click the "Edit Info" button to modify patient information.
                </p>
              </div>
            )}

            {isEditing && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-amber-700">
                  You are in edit mode. Make changes and click "Save" to update patient information.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
