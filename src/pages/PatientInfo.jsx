import React, { useEffect, useState } from 'react';
import { getPatientById, getPrescriptionsByPatientId } from '../API/Patient';
import LoadingList from '../components/LoadingList';
import ListPrescription from '../components/ListPrescription';
import CreatePrescription from '../components/CreatePrescription';
import Navbar from '../components/Navbar';

export default function PatientInfo() {
  const [showModal, setShowModal] = useState(false);
  
  const [patientData, setPatientData] = useState({});
  const [listOfPrescriptions, setListOfPrescriptions] = useState([]);
  

  useEffect(() => {
    getDataRelatedToPatient(); 
    fetchPrescriptions();
  }, [showModal]);

  

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
  }

  return (
    <div className="p-8 min-h-screen min-w-screen bg-white">
      <Navbar />
      {/* Top bar and prescription list */}
      <div className="flex justify-between items-center mt-12 mb-8">
        <div className="font-bold text-black text-lg font-mono underline">{(patientData.name)? (patientData.name).toUpperCase():""}'s Reports</div>
        <button
          className="bg-black text-white px-6 py-2 rounded-md  font-semibold shadow"
          onClick={() => setShowModal(true)}
        >
          New prescription
        </button>
      </div>
      <h2 className="text-3xl text-black font-bold text-center mb-8">Pervious Prescriptions</h2>

      {/* Placeholder for previous prescriptions */}
      <div className="flex flex-col md:flex-row  md:flex flex-wrap justify-center gap-4 space-y-6 ">

        {listOfPrescriptions.length==0?<><LoadingList /><LoadingList /><LoadingList/></> :listOfPrescriptions.map((prescription, idx) => (
         <ListPrescription  prescription={prescription} idx={idx}/>
        ))}
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
        <CreatePrescription showModal={showModal} setShowModal={setShowModal}/>
      )}
    </div>
  );
}
