import React, { useState, useRef } from "react";
import { createPrescription } from "../API/Patient";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";


export default function CreatePrescription({ showModal, setShowModal }) {
  const [drugs, setDrugs] = useState([
    { name: "", strength: "", quantity: "", frequency: "", remarks: "" },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [remarks, setRemarks] = useState("");
  const previewRef = useRef(null);

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
    setShowPreview(false);
  };

  const handleSavePreview = async () => {
    setShowPreview(true);
    console.log("Current drugs:", drugs);
    const prescriptionData = { "drug": drugs, "remarks": remarks };
    const id = window.location.pathname.split("/").pop();
    const response= await createPrescription(id,prescriptionData);
    if(response.status===201){
        toast.success("Prescription is save Successfully");
        
        
    }else{
        toast.error("Error in saving prescription");
    }
  };

  const handlePrint = () => {
    const printContents = previewRef.current.innerHTML;
    console.log("Printing contents:", printContents);
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write(printContents);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    setShowModal(false);
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
              <div className="flex flex-col w-1/4">
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
              <div className="flex flex-col w-1/5">
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
              <div className="flex flex-col w-1/5">
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
              <div className="flex flex-col w-1/5">
                <label className="text-sm font-semibold mb-1">Frequency</label>
                <input
                  type="text"
                  value={drug.frequency}
                  onChange={(e) =>
                    handleDrugChange(idx, "frequency", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="1-1-1"
                />
              </div>
            </div>
            
          </div>
        ))}
        <div className="mt-2">
              <label className="text-sm font-semibold mb-1">Remarks</label>
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
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            onClick={handleSavePreview}
          >
            Save & Preview
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            onClick={addNewDrug}
          >
            Add New Drug
          </button>
          <button
            className="bg-red-400 text-white px-4 py-2 rounded shadow hover:bg-red-500 transition ml-auto"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        {showPreview && (
          <div>
          <div className="mt-8" ref={previewRef}>
            <h4 className="text-lg font-bold mb-4 text-center">
              Prescription Preview
            </h4>
            {drugs.map((drug, idx) => (
              <div key={idx} className="mb-4 p-4 bg-gray-200 rounded">
                <div>
                  <span className="font-semibold">Drug Name:</span> {drug.name}
                </div>
                <div>
                  <span className="font-semibold">Strength:</span>{" "}
                  {drug.strength}
                </div>
                <div>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {drug.quantity}
                </div>
                <div>
                  <span className="font-semibold">Frequency:</span>{" "}
                  {drug.frequency}
                </div>
                <div>
                  <span className="font-semibold">Remarks:</span> {remarks}
                </div>
              </div>
            ))}
            
          </div>
          <button
              className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition block mx-auto mt-4"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
