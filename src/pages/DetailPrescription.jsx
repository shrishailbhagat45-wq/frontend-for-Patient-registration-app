import { useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import { getPrescriptionById } from '../API/Patient';
import PrescriptionComponent from "../components/PrescriptionComponent";

export default function DetailPrescription() {
  const { prescriptionId } = useParams();

  // Fetch prescription data
  const { data: prescriptionData = {}, isLoading, error } = useQuery({
    queryKey: ['prescription', prescriptionId],
    queryFn: async () => {
      if (!prescriptionId) {
        console.error("Missing prescription ID");
        return {};
      }
      const prescription = await getPrescriptionById(prescriptionId);
      return prescription.data || {};
    },
    enabled: !!prescriptionId,
  });

  const patientData = prescriptionData.patientData || {};

  return (
    <div>
      <PrescriptionComponent patientData={patientData} prescriptionData={prescriptionData} />
    </div>
  );
}
