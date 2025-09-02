import React, { useEffect, useState } from 'react';
import { getPatientById, getPrescriptionsByPatientId } from '../API/Patient';
import LoadingList from '../components/LoadingList';
import ListPrescription from '../components/ListPrescription';

export default function PatientInfo() {
  const [showModal, setShowModal] = useState(false);
  const [drugs, setDrugs] = useState([
    { name: '', strength: '', quantity: '', frequency: '', remarks: '' }
  ]);
  const [patientData, setPatientData] = useState({});
  const [listOfPrescriptions, setListOfPrescriptions] = useState([]);
  

  useEffect(() => {
    getDataRelatedToPatient(); 
    fetchPrescriptions();
  }, []);

  const handleDrugChange = (idx, field, value) => {
    const updated = drugs.map((drug, i) =>
      i === idx ? { ...drug, [field]: value } : drug
    );
    setDrugs(updated);
  };

  const addNewDrug = () => {
    setDrugs([
      ...drugs,
      { name: '', strength: '', quantity: '', frequency: '', remarks: '' }
    ]);
  };

  const handleClose = () => {
    setShowModal(false);
    setDrugs([{ name: '', strength: '', quantity: '', frequency: '', remarks: '' }]);
  };

  async function getDataRelatedToPatient() { 
    // Fetch and set patient data here
    const id = window.location.pathname.split("/").pop();
    const patient = await getPatientById(id);
    setPatientData(patient.data);
  } 

  async function fetchPrescriptions() {
    // Fetch and set prescriptions related to the patient here
    const id = window.location.pathname.split("/").pop();
    const listOfPrescriptions=await getPrescriptionsByPatientId(id);
    setListOfPrescriptions(listOfPrescriptions.data);
   
    console.log("Fetched prescriptions:", listOfPrescriptions);
  }

  return (
    <div className="p-8 min-h-screen min-w-screen bg-white">
      {console.log()}
      {/* Top bar and prescription list */}
      <div className="flex justify-between items-center mb-8">
        <div className="font-bold text-black text-lg">{patientData.name}</div>
        <button
          className="bg-black text-white px-6 py-2 rounded-md  font-semibold shadow"
          onClick={() => setShowModal(true)}
        >
          New prescription
        </button>
      </div>
      <h2 className="text-3xl text-black font-bold text-center mb-8">Pervious Prescriptions</h2>
      {/* Placeholder for previous prescriptions */}
      <div className="flex justify-center gap-4  space-y-6">

        {listOfPrescriptions.length==0?<LoadingList/> :listOfPrescriptions.map((prescription, idx) => (
         <ListPrescription />
        ))}
      </div>
      <div>

      </div>
      <div className="flex justify-center mt-8">
        <div className="flex justify-center items-center">
          <button className="bg-black text-white font-semibold px-6 py-2 rounded-md shadow inset-0 m-auto">
            Load more
          </button>
        </div>
      </div>


      {/* Floating Modal */}
      {showModal && (
        <div className="fixed inset-0 text-black  bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl min-w-[500px] max-w-[95vw]">
            <h3 className="text-2xl font-bold mb-6 text-center">Create Prescription</h3>
            {drugs.map((drug, idx) => (
              <div key={idx} className="mb-8 bg-gray-100 rounded-xl p-4 shadow">
                <div className="flex gap-4 mb-2">
                  <div className="flex flex-col w-1/4">
                    <label className="text-sm font-semibold mb-1">Drug Name</label>
                    <input
                      type="text"
                      value={drug.name}
                      onChange={e => handleDrugChange(idx, 'name', e.target.value)}
                      className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Drug Name"
                    />
                  </div>
                  <div className="flex flex-col w-1/5">
                    <label className="text-sm font-semibold mb-1">Strength</label>
                    <input
                      type="text"
                      value={drug.strength}
                      onChange={e => handleDrugChange(idx, 'strength', e.target.value)}
                      className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="50mg"
                    />
                  </div>
                  <div className="flex flex-col w-1/5">
                    <label className="text-sm font-semibold mb-1">Quantity</label>
                    <input
                      type="text"
                      value={drug.quantity}
                      onChange={e => handleDrugChange(idx, 'quantity', e.target.value)}
                      className="border px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="9"
                    />
                  </div>
                  <div className="flex flex-col w-1/5">
                    <label className="text-sm font-semibold mb-1">Frequency</label>
                    <input
                      type="text"
                      value={drug.frequency}
                      onChange={e => handleDrugChange(idx, 'frequency', e.target.value)}
                      className="border px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="1-1-1"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="text-sm font-semibold mb-1">Remarks</label>
                  <textarea
                    value={drug.remarks}
                    onChange={e => handleDrugChange(idx, 'remarks', e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Remarks"
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-4 mt-6">
              <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
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
          </div>
        </div>
      )}
    </div>
  );
}
