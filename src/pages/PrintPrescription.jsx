import { useLocation } from 'react-router-dom';
import PrescriptionComponent from "../components/PrescriptionComponent";


export default function PrintPrescription() {
  const location = useLocation();
  const { prescriptionData, patientData } = location.state || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div >
      <PrescriptionComponent patientData={patientData} prescriptionData={prescriptionData} />
    </div>
  );
}
