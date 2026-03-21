import React, { useState, useRef, useEffect } from "react";
import {
  createPrescription,
  getDrugSuggestions,
  updatePrescription,
} from "../API/Prescriptions";
import { updatePatientVitals } from "../API/Patient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function CreatePrescription({
  showModal,
  setShowModal,
  initialPrescription,
}) {
  const [drugs, setDrugs] = useState([
    { name: "", strength: "", quantity: "", frequency: "", remarks: "" },
  ]);
  const [Diagnosis, setDiagnosis] = useState("");
  const [remarks, setRemarks] = useState("");
  const [suggestions, setSuggestions] = useState({}); // { idx: [suggestion, ...] }
  const [highlight, setHighlight] = useState({}); // { idx: highlightedIndex }
  const [weight, setWeight] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [pulseRate, setPulseRate] = useState("");
  const [bloodSugarLevel, setBloodSugarLevel] = useState("");
  const timersRef = useRef({});
  const lastQueryRef = useRef({});
  const navigate = useNavigate();

  const handleDrugChange = (idx, field, value) => {
    setDrugs((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)),
    );
  };

  const addNewDrug = () => {
    setDrugs((prev) => [
      ...prev,
      { name: "", strength: "", quantity: "", frequency: "", remarks: "" },
    ]);
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
    setDrugs([
      { name: "", strength: "", quantity: "", frequency: "", remarks: "" },
    ]);
    setRemarks("");
    setSuggestions({});
    setHighlight({});
    setWeight("");
    setBloodPressure("");
    setPulseRate("");
    setBloodSugarLevel("");
  };

  // populate form when editing an existing prescription
  useEffect(() => {
    if (initialPrescription && showModal) {
      const presetDrugs =
        Array.isArray(initialPrescription.drug) &&
        initialPrescription.drug.length
          ? initialPrescription.drug.map((d) => ({
              name: d.name || "",
              strength: d.strength || "",
              quantity: d.quantity || "",
              frequency: d.frequency || "",
              remarks: d.remarks || "",
            }))
          : [
              {
                name: "",
                strength: "",
                quantity: "",
                frequency: "",
                remarks: "",
              },
            ];
      setDrugs(presetDrugs);
      setDiagnosis(
        initialPrescription.remarks || initialPrescription.Diagnosis || "",
      );
    }
  }, [initialPrescription, showModal]);

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
          setSuggestions((s) => ({
            ...s,
            [idx]: Array.isArray(data) ? data : [],
          }));
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
    const name =
      typeof suggestion === "string" ? suggestion : (suggestion.name ?? "");
    // auto-fill strength from content field if available
    const strength =
      typeof suggestion === "object" ? (suggestion.content ?? "") : "";
    setDrugs((prev) =>
      prev.map((d, i) =>
        i === idx ? { ...d, name, ...(strength && { strength }) } : d,
      ),
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
    const prescriptionData = { drug: drugs, Diagnosis };
    try {
      if (initialPrescription && initialPrescription._id) {
        // update flow
        await updatePrescription(initialPrescription._id, prescriptionData);
        
        // Update vitals if provided
        if (weight || bloodPressure || pulseRate || bloodSugarLevel) {
          const patientId = window.location.pathname.split("/").pop();
          const vitalsData = {
            ...(weight && { weight: parseFloat(weight) }),
            ...(bloodPressure && { bloodPressure }),
            ...(pulseRate && { pulseRate: parseInt(pulseRate) }),
            ...(bloodSugarLevel && { bloodSugarLevel: parseFloat(bloodSugarLevel) }),
          };
          await updatePatientVitals(patientId, vitalsData);
        }
        
        toast.success("Prescription updated");
        // close modal and return to patient page (no navigation to print)
        handleClose();
      } else {
        // create flow
        const id = window.location.pathname.split("/").pop();

        const response = await createPrescription(id, prescriptionData);
        if (response?.status === 201) {
          // Update vitals if provided
          if (weight || bloodPressure || pulseRate || bloodSugarLevel) {
            const vitalsData = {
              ...(weight && { weight: parseFloat(weight) }),
              ...(bloodPressure && { bloodPressure }),
              ...(pulseRate && { pulseRate: parseInt(pulseRate) }),
              ...(bloodSugarLevel && { bloodSugarLevel: parseFloat(bloodSugarLevel) }),
            };
            await updatePatientVitals(id, vitalsData);
          }
          
          toast.success("Prescription saved");
          navigate("/print-prescription", {
            state: {
              prescriptionData: response.data,
              patientData: response.data.patientData,
            },
          });
          handleClose();
        } else {
          toast.error("Error saving prescription");
        }
      }
    } catch (err) {
      console.error("Error in saving/updating prescription", err);
      toast.error("Failed to save/update prescription");
    }
  };

  if (!showModal) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Create Prescription
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Add medications and diagnosis for the patient
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {" "}
          {drugs.map((drug, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-lg p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end relative"
            >
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Drug Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={drug.name}
                  onChange={(e) => handleDrugNameInput(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="e.g. Paracetamol"
                />
                {suggestions[idx] && suggestions[idx].length > 0 && (
                  <ul className="absolute left-4 right-4 bg-white border border-slate-200 shadow-xl rounded-lg mt-1 z-30 max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {suggestions[idx].map((sug, sidx) => {
                      const name =
                        typeof sug === "string" ? sug : (sug.name ?? "");
                      const company =
                        typeof sug === "object" ? (sug.company ?? "") : "";
                      const content =
                        typeof sug === "object" ? (sug.content ?? "") : "";
                      const isActive = (highlight[idx] ?? 0) === sidx;
                      return (
                        <li
                          key={sidx}
                          onMouseDown={(ev) => {
                            ev.preventDefault();
                            selectSuggestion(idx, sug);
                          }}
                          className={
                            "px-3 py-2.5 cursor-pointer transition-colors " +
                            (isActive
                              ? "bg-blue-600"
                              : "hover:bg-slate-50")
                          }
                        >
                          {/* Drug name */}
                          <p className={
                            "text-sm font-semibold leading-tight " +
                            (isActive ? "text-white" : "text-slate-900")
                          }>
                            {name}
                          </p>
                          {/* Content (composition) */}
                          {content && (
                            <p className={
                              "text-xs mt-0.5 leading-snug " +
                              (isActive ? "text-blue-100" : "text-slate-500")
                            }>
                              {content}
                            </p>
                          )}
                          {/* Company */}
                          {company && (
                            <p className={
                              "text-[10px] mt-1 font-medium uppercase tracking-wide " +
                              (isActive ? "text-blue-200" : "text-slate-400")
                            }>
                              {company}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={drug.quantity}
                  onChange={(e) =>
                    handleDrugChange(idx, "quantity", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  value={drug.frequency}
                  onChange={(e) =>
                    handleDrugChange(idx, "frequency", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="1-1-1">1-1-1</option>
                  <option value="1-0-1">1-0-1</option>
                  <option value="1-0-0">1-0-0</option>
                  <option value="0-0-1">0-0-1</option>
                  <option value="0-1-0">0-1-0</option>
                </select>
              </div>

              {/* Per-drug remarks */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Remarks
                </label>
                <input
                  type="text"
                  value={drug.remarks || ""}
                  onChange={(e) =>
                    handleDrugChange(idx, "remarks", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="Optional notes"
                />
              </div>

              <div className="sm:col-span-1 flex justify-end">
                {drugs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDrug(idx)}
                    className="text-red-600 hover:bg-red-50 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                    aria-label={`Remove drug ${idx + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}{" "}
          {/* Vital Signs Section */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Patient Vital Signs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="e.g. 70.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="e.g. 120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pulse Rate (bpm)
                </label>
                <input
                  type="number"
                  value={pulseRate}
                  onChange={(e) => setPulseRate(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="e.g. 72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Blood Sugar Level (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={bloodSugarLevel}
                  onChange={(e) => setBloodSugarLevel(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="e.g. 100"
                />
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">These vital signs will be saved to patient information, not the prescription</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Diagnosis / Remarks
            </label>
            <textarea
              value={Diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={4}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
              placeholder="Enter diagnosis, symptoms, or additional remarks..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={addNewDrug}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md shadow-sm hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Another Drug
            </button>

            <div className="flex-1"></div>

            <button
              onClick={handleClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors font-medium text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSavePreview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {initialPrescription && initialPrescription._id
                ? "Update"
                : "Save & Preview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}