import React from 'react';
import { FiUser, FiPhone, FiMail } from 'react-icons/fi';

/**
 * Calculate age from birthday
 */
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

/**
 * Display patient information header
 */
const PatientDetailsCard = ({ patient }) => {
  if (!patient) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <p className="text-amber-700">Loading patient information...</p>
      </div>
    );
  }

  const age = calculateAge(patient.birthday);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FiUser className="text-indigo-600 text-lg" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Patient Name</p>
              <p className="font-semibold text-gray-800">{patient.name || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiPhone className="text-indigo-600 text-lg" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Contact</p>
              <p className="font-semibold text-gray-800">{patient.phone || patient.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase">Patient ID</p>
            <p className="font-mono text-sm text-gray-800">{patient.id || patient._id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Age</p>
            <p className="font-semibold text-gray-800">{age ? `${age} years` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsCard;
