import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatientById, getPrescriptionsByPatientId } from '../API/Patient';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'
import LoadingList from '../components/LoadingList';
import ListPrescription from '../components/ListPrescription';
import CreatePrescription from '../components/CreatePrescription';
import Navbar from '../components/Navbar';

export default function PatientInfo() {
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  
  // Fetch patient data
  const { data: patientData = {} } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const patient = await getPatientById(id);
      return patient.data || {};
    },
    enabled: !!id,
  });

  // Fetch prescriptions with dependency on showModal to refresh
  const { data: listOfPrescriptions = [] } = useQuery({
    queryKey: ['prescriptions', id, showModal],
    queryFn: async () => {
      const prescriptions = await getPrescriptionsByPatientId(id);
      return prescriptions.data || [];
    },
    enabled: !!id,
  });

  return (
    <div>
      <Navbar />
    <div className="pt-8 px-4 min-h-screen min-w-full bg-white">
      
      {/* Top bar and prescription list */}
      <div className="flex justify-between items-center mt-12 mb-8">
        <div className="font-bold text-black text-lg font-mono underline">{(patientData.name)? (patientData.name).toUpperCase():""}'s Reports</div>
        <button
          className="text-white bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={() => setShowModal(true)}
        >
          New prescription
        </button>
      </div>
      <h2 className="text-3xl text-black font-bold text-center mb-8">Pervious Prescriptions</h2>

      {/* Placeholder for previous prescriptions */}
      <div className="flex flex-col md:flex-row  md:flex flex-wrap justify-center gap-4 px-4 ">

        {listOfPrescriptions.length==0?<><LoadingList /><LoadingList /><LoadingList/></> :listOfPrescriptions.map((prescription, idx) => (
         <ListPrescription  prescription={prescription} idx={idx}/>
        ))}
      </div>
    

      <div className="flex justify-center mt-8">
        <div className="flex justify-center items-center">
          <Link to={`/billing/${id}`}>
          <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 inset-0 m-auto">
            Create Bill
          </button>
          </Link>
        </div>
      </div>


      {/* Floating Modal */}
      {showModal && (
        <CreatePrescription showModal={showModal} setShowModal={setShowModal}/>
      )}
    </div>
    </div>
  );
  
}
