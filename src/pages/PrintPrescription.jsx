import { useLocation } from 'react-router-dom';
import PrescriptionComponent from "../components/PrescriptionComponent";

export default function PrintPrescription() {
  const location = useLocation();
  const { prescriptionData, patientData } = location.state || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print Button */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 16px' }}>
        <button
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Print
        </button>
      </div>
      <PrescriptionComponent patientData={patientData} prescriptionData={prescriptionData} />
      {/* Hide print button when printing */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  );
}
