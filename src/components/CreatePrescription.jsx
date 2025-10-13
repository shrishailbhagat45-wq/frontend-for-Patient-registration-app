import React, { useState, useRef } from "react";
import { createPrescription } from "../API/Patient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";


export default function CreatePrescription({ showModal, setShowModal }) {
  const [drugs, setDrugs] = useState([
    { name: "", strength: "", quantity: "", frequency: "", remarks: "" },
  ]);

  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();

  const handleDrugChange = (idx, field, value) => {
    const updated = drugs.map((drug, i) =>
      i === idx ? { ...drug, [field]: value } : drug
    );
    setDrugs(updated);
  };

  const addNewDrug = () => {
    setDrugs([
      ...drugs,
      { name: "", strength: "", quantity: "", frequency: "" },
    ]);
  };

  const handleClose = () => {
    setShowModal(false);
    setDrugs([
      { name: "", strength: "", quantity: "", frequency: ""},
    ]);
  };

  const handleSavePreview = async () => {
    console.log("Current drugs:", drugs);
    const prescriptionData = { "drug": drugs, "remarks": remarks };
    const id = window.location.pathname.split("/").pop();
    const response= await createPrescription(id,prescriptionData);
    console.log("prescription response:",response);
    if(response.status===201){
        toast.success("Prescription is save Successfully");
        navigate("/print-prescription",{state:{prescriptionData:response.data,patientData:response.data.patientData}});
    }else{
        toast.error("Error in saving prescription");
    }
  };


  return (
    <div className="fixed inset-0 text-black bg-gray-950/60 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl min-w-[360px] max-w-[95vw] max-h-[80vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Create Prescription
        </h3>
        {drugs.map((drug, idx) => (
          <div key={idx} className="mb-8 bg-gray-100 rounded-xl p-4 shadow">
            <div className="flex gap-4 mb-2">
              <div className="flex flex-col w-[60%]">
                <label className="text-sm font-semibold mb-1">Drug Name</label>
                <input
                  type="text"
                  value={drug.name}
                  onChange={(e) =>
                    handleDrugChange(idx, "name", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Drug Name"
                />
              </div>
              <div className="flex flex-col w-[10%]">
                <label className="text-sm font-semibold mb-1">Strength</label>
                <input
                  type="text"
                  value={drug.strength}
                  onChange={(e) =>
                    handleDrugChange(idx, "strength", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="50mg"
                />
              </div>
              <div className="flex flex-col w-[10%]">
                <label className="text-sm font-semibold mb-1">Quantity</label>
                <input
                  type="text"
                  value={drug.quantity}
                  onChange={(e) =>
                    handleDrugChange(idx, "quantity", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="9"
                />
              </div>
              <div className="flex flex-col w-[20%]">
                <label className="text-sm font-semibold mb-1">Frequency</label>
                <select value={drug.frequency}
                  onChange={(e) =>
                    handleDrugChange(idx, "frequency", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="1-1-1"
                >
                  <option value="">Select</option>
                  <option value="1-1-1">1-1-1</option>
                  <option value="1-0-1">1-0-1</option>
                  <option value="1-0-0">1-0-0</option>
                  <option value="0-0-1">0-0-1</option>
                </select>
              </div>
            </div>
            
          </div>
        ))}
        <div className="mt-2">
              <label className="text-sm font-semibold mb-1">Diagnosis</label>
              <textarea
                value={remarks}
                onChange={(e) =>{
                  setRemarks(e.target.value);
                }
                }
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Remarks"
              />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleSavePreview}
          >
            Save & Preview
          </button>
          <button
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={addNewDrug}
          >
            Add New Drug
          </button>
          <button
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
       
      </div>
    </div>
  );
}
