import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPatients } from "../API/Patient";
import { addPatientToQueue, getQueuedPatients, removeFromQueueById } from "../API/Patient";
import { FiSearch, FiUser, FiPhone, FiClock } from "react-icons/fi";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  // Fetch queued patients
  const { data: queue = [] } = useQuery({
    queryKey: ['queuedPatients'],
    queryFn: async () => {
      const res = await getQueuedPatients();
      console.log("Fetched queued patients:", res);
      return res || [];
    },
  });
  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSelectedPatient(null);

    if (!value.trim()) {
      setFilteredPatients([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await getPatients(value);
      setFilteredPatients(res?.data ?? []);
    } catch (err) {
      console.error("Search error", err);
      setFilteredPatients([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setFilteredPatients([]);
  };
  const addToQueue = async (e, patient) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Adding to queue:", patient);
    const res = await addPatientToQueue(patient);
    if (res) {
      setSearchTerm("");
      setFilteredPatients([]);
      setSelectedPatient(null);
      queryClient.invalidateQueries(['queuedPatients']);
    }
  };
  const removeFromQueue = async (id) => {
    await removeFromQueueById(id);
    queryClient.invalidateQueries(['queuedPatients']);
  };
  return (
    <div className="relative w-full">
      <form onSubmit={(e) => e.preventDefault()} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400 text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search for existing patients..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white transition-all placeholder:text-slate-400 shadow-sm"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </form>

      {filteredPatients.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-lg mt-1 z-10 max-h-80 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <li
              key={patient._id}
              className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-slate-100 last:border-0 flex items-center justify-between transition-colors group"
              onClick={() => handleSelectPatient(patient)}
            >
              <Link to={`/patient/${patient._id}`} className="flex-1 no-underline flex items-center gap-3">
                {/* Patient Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {patient.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    {patient.phoneNumber && (
                      <span className="flex items-center gap-1">
                        <FiPhone className="text-xs" />
                        {patient.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => addToQueue(e, patient)}
                className="ml-4 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all shadow-sm hover:shadow"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Queue table */}
      <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden border border-slate-200">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-slate-800">Queued Patients</div>
              <div className="text-xs text-slate-500 mt-0.5">Patients waiting to be seen</div>
            </div>
            {queue && queue.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <FiClock className="text-sm" />
                <span className="text-sm font-medium">{queue.length} in queue</span>
              </div>
            )}
          </div>
        </div>

        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Phone Number</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {!queue || queue.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center">
                  <FiUser className="mx-auto text-slate-300 text-4xl mb-2" />
                  <div className="text-slate-400 text-sm font-medium">No patients in queue</div>
                  <div className="text-slate-400 text-xs mt-1">Search and add patients to get started</div>
                </td>
              </tr>
            ) : (
              queue.map((p, i) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3 text-sm text-slate-600 font-medium">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.phoneNumber}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeFromQueue(p._id)}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium opacity-100"
                      value={p._id}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}