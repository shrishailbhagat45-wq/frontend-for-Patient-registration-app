import React, { useState, useRef, useEffect } from "react";
import { createPrescription, getDrugSuggestions } from "../API/Patient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function CreatePrescription({ showModal, setShowModal }) {
  const [drugs, setDrugs] = useState([
    { name: "", strength: "", quantity: "", frequency: "", remarks: "" },
  ]);
  const [remarks, setRemarks] = useState("");
  const [suggestions, setSuggestions] = useState({}); // { idx: [suggestion, ...] }
  const [highlight, setHighlight] = useState({}); // { idx: highlightedIndex }
  const timersRef = useRef({});
  const lastQueryRef = useRef({});
  const navigate = useNavigate();

  const handleDrugChange = (idx, field, value) => {
    setDrugs((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)));
  };

  const addNewDrug = () => {
    setDrugs((prev) => [...prev, { name: "", strength: "", quantity: "", frequency: "" }]);
  };

  const removeDrug = (idx) => {
    setDrugs((prev) => prev.filter((_, i) => i !== idx));
    setSuggestions((s) => {
      const copy = { ...s };
      delete copy[idx];
      return copy;
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setDrugs([{ name: "", strength: "", quantity: "", frequency: "" }]);
    setRemarks("");
    setSuggestions({});
    setHighlight({});
  };

  // debounce and fetch drug suggestions for a specific drug input
  const fetchSuggestions = (idx, query) => {
    clearTimeout(timersRef.current[idx]);
    if (!query || query.trim().length < 1) {
      setSuggestions((s) => ({ ...s, [idx]: [] }));
      return;
    }

    // debounce 300ms
    timersRef.current[idx] = setTimeout(async () => {
      lastQueryRef.current[idx] = query;
      try {
        const res = await getDrugSuggestions(query);
        const data = res?.data ?? res ?? [];
        // apply only if query unchanged
        if (lastQueryRef.current[idx] === query) {
          setSuggestions((s) => ({ ...s, [idx]: Array.isArray(data) ? data : [] }));
          setHighlight((h) => ({ ...h, [idx]: 0 }));
        }
      } catch (err) {
        console.error("Drug suggestions error", err);
        setSuggestions((s) => ({ ...s, [idx]: [] }));
      }
    }, 300);
  };

  // call when user types in name field
  const handleDrugNameInput = (idx, value) => {
    handleDrugChange(idx, "name", value);
    fetchSuggestions(idx, value);
  };

  const selectSuggestion = (idx, suggestion) => {
    // suggestion might be string or object { name }
    const name = typeof suggestion === "string" ? suggestion : suggestion.name ?? "";
    setDrugs((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, name: name } : d))
    );
    setSuggestions((s) => ({ ...s, [idx]: [] }));
  };

  // keyboard navigation inside suggestion list
  const handleKeyDown = (e, idx) => {
    const list = suggestions[idx] || [];
    if (!list.length) return;
    const curr = highlight[idx] ?? 0;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(curr + 1, list.length - 1);
      setHighlight((h) => ({ ...h, [idx]: next }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(curr - 1, 0);
      setHighlight((h) => ({ ...h, [idx]: prev }));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = list[curr];
      if (sel) selectSuggestion(idx, sel);
    } else if (e.key === "Escape") {
      setSuggestions((s) => ({ ...s, [idx]: [] }));
    }
  };

  const handleSavePreview = async () => {
    const prescriptionData = { drug: drugs, remarks };
    const id = window.location.pathname.split("/").pop();
    try {
      const response = await createPrescription(id, prescriptionData);
      if (response?.status === 201) {
        toast.success("Prescription saved");
        navigate("/print-prescription", {
          state: { prescriptionData: response.data, patientData: response.data.patientData },
        });
        handleClose();
      } else {
        toast.error("Error saving prescription");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save prescription");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl sm:text-2xl font-semibold">Create Prescription</h3>
        </div>

        <div className="p-6 space-y-6">
          {drugs.map((drug, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end relative"
            >
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                <input
                  type="text"
                  value={drug.name}
                  onChange={(e) => handleDrugNameInput(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g. Paracetamol"
                />
                {suggestions[idx] && suggestions[idx].length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg rounded mt-1 z-30 max-h-44 overflow-y-auto text-black">
                    {suggestions[idx].map((sug, sidx) => {
                      const label = typeof sug === "string" ? sug : sug.name ?? "";
                      const isActive = (highlight[idx] ?? 0) === sidx;
                      return (
                        <li
                          key={sidx}
                          onMouseDown={(ev) => {
                            // mouseDown to avoid losing focus before click
                            ev.preventDefault();
                            selectSuggestion(idx, sug);
                          }}
                          className={
                            "px-3 py-2 cursor-pointer flex justify-between items-center " +
                            (isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100")
                          }
                        >
                          <span>{label}</span>
                          
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>


              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={drug.quantity}
                  onChange={(e) => handleDrugChange(idx, "quantity", e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Freq</label>
                <select
                  value={drug.frequency}
                  onChange={(e) => handleDrugChange(idx, "frequency", e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">--</option>
                  <option value="1-1-1">1-1-1</option>
                  <option value="1-0-1">1-0-1</option>
                  <option value="1-0-0">1-0-0</option>
                  <option value="0-0-1">0-0-1</option>
                </select>
              </div>

              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeDrug(idx)}
                  className="text-red-600 hover:bg-red-50 rounded-md px-2 py-1 text-sm"
                  aria-label={`Remove drug ${idx + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis / Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter diagnosis or remarks..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleSavePreview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            >
              Save & Preview
            </button>

            <button
              onClick={addNewDrug}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition"
            >
              Add New Drug
            </button>

            <button
              onClick={handleClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
