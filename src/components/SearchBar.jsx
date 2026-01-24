import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients } from "../API/Patient";
import { addPatientToQueue,getQueuedPatients,removeFromQueueById } from "../API/Patient";


export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [add, setAdd] = useState({});
  const [queue, setQueue] = useState([]); // queued patients

  useEffect( () => {
    getQueueData();
  }, [add]);

  async function getQueueData () {
    const res=await getQueuedPatients();
    console.log("Fetched queued patients:", res);
    if(res) setQueue(res);
  }

  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSelectedPatient(null);

    if (!value.trim()) {
      setFilteredPatients([]);
      return;
    }

    try {
      const res = await getPatients(value);
      setFilteredPatients(res?.data ?? []);
    } catch (err) {
      console.error("Search error", err);
      setFilteredPatients([]);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setFilteredPatients([]);
  };

  const addToQueue =async (e, patient) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Adding to queue:", patient);
    const res = await addPatientToQueue(patient);
    if (res) {
      setSearchTerm("");
      setAdd(res);
      setFilteredPatients([]);
      setSelectedPatient(null);
    }
  };

  const removeFromQueue = async (id) => {
    const next =await removeFromQueueById(id);
    setAdd(next);

  };

  return (
    <div className="relative w-full max-w-2xl px-4">
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <input
          type="text"
          placeholder="Search for existing patients..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 text-lg border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-black bg-gray-100 shadow-2xl"
          autoComplete="off"
        />
        {/* top Add button removed as requested */}
      </form>

      {filteredPatients.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 shadow-lg rounded mt-1 z-10 max-h-60 overflow-y-auto text-black">
          {filteredPatients.map((patient) => (
            <li
              key={patient._id}
              className="px-4 py-2 cursor-pointer hover:bg-fuchsia-50 border-b border-gray-100 flex items-center justify-between"
              onClick={() => handleSelectPatient(patient)}
            >
              <Link to={`/patient/${patient._id}`} className="flex-1 no-underline text-black">
                <div className="text-sm font-medium">{patient.name}</div>
                <div className="text-xs text-gray-500">
                  {patient.phoneNumber ? `• ${patient.phoneNumber}` : ""}
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => addToQueue(e, patient)}
                className="ml-4 inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Queue table - phone column removed */}
      <div className="mt-4 bg-white shadow rounded overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold">Queued Patients</div>
          <div className="text-xs text-gray-500">Patients added to the queue appear below</div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Phone Number</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {!queue ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                  No patients added.
                </td>
              </tr>
            ) : (
              queue.map((p, i=0) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 text-sm">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{p.phoneNumber}</td>
                  <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => removeFromQueue(e.target.value)}
                        className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
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