import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../API/Patient";
import { FiSearch, FiPhone } from "react-icons/fi";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // FIXED
  const debounceTimer = useRef(null);

  const { data, isFetching: isSearching } = useQuery({
    queryKey: ["patientSearch", debouncedTerm],
    queryFn: () => getPatients(debouncedTerm),
    enabled: debouncedTerm.length >= 2,
    select: (res) => (Array.isArray(res) ? res : res?.data ?? []),
    staleTime: 30_000,
  });

  const patients = data ?? [];

  const handleSearchChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

    setSearchTerm(value);

    // Clear previous timeout
    clearTimeout(debounceTimer.current);

    if (value.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        setDebouncedTerm(value.trim());
      }, 350);
    } else {
      setDebouncedTerm("");
    }
  };

  return (
    <div className="relative w-full">
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
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {patients.length > 0 && debouncedTerm.length >= 2 && (
        <ul className="absolute left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-lg mt-1 z-10 max-h-80 overflow-y-auto">
          {patients.map((patient) => (
            <li
              key={patient._id}
              className="px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors group"
            >
              <Link
                to={`/patient/${patient._id}`}
                className="flex items-center gap-3 no-underline"
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedTerm("");
                }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {patient.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {patient.name}
                  </div>

                  {patient.phoneNumber && (
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <FiPhone className="text-xs" />
                      {patient.phoneNumber}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}