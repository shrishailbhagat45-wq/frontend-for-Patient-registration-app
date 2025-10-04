import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {getPrescriptionById } from '../API/Patient';
import PrescriptionComponent from "../components/PrescriptionComponent";

export default function DetailPrescription() {

  const [prescriptionData, setPrescriptionData] = useState({});
  const [patientData, setPatientData] = useState({});

  useEffect(() => { 
    fetchData();
  }, []);

  const {prescriptionId } = useParams();
  

  async function fetchData() {
    
    const prescription = await getPrescriptionById(prescriptionId);
    if (!prescription) {
      console.error("Error fetching data");
    }
    setPrescriptionData(prescription.data);
    setPatientData(prescription.data.patientData);
  }

 return (
    <div>
      
      <PrescriptionComponent patientData={patientData} prescriptionData={prescriptionData}/>
    </div>
    

  )
}
