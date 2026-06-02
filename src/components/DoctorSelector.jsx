import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

/**
 * Doctor selection dropdown
 */
const DoctorSelector = ({ selectedDoctor, onDoctorChange, doctors, isLoading }) => {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select Doctor
      </label>
      <div className="relative">
        <select
          value={selectedDoctor?.id || selectedDoctor?._id || ''}
          onChange={(e) => {
            const doctor = doctors.find(d => (d.id || d._id) === e.target.value);
            onDoctorChange(doctor);
          }}
          disabled={isLoading || !doctors.length}
          className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {isLoading ? 'Loading doctors...' : 'Choose a doctor'}
          </option>
          {doctors.map((doctor) => {
            const doctorId = doctor.id || doctor._id;
            return (
              <option key={doctorId} value={doctorId}>
                {doctor.name || 'Unknown'}
              </option>
            );
          })}
        </select>
        <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>

      {selectedDoctor && (
        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded">
          <p className="text-sm text-indigo-900">
            <span className="font-semibold">Selected:</span> {selectedDoctor.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;
