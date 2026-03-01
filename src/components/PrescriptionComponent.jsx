import { GiCaduceus } from "react-icons/gi";
import { FaPrescription } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "./Navbar";
import PrintButton from '../components/PrintButton';
import { useNavigate } from "react-router-dom";

// Helper function to calculate age from birthDate
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default function PrescriptionComponent({patientData, prescriptionData}) {
  const navigate = useNavigate();
  
  // Format date
  const formattedDate = prescriptionData.createdAt
    ? new Date(prescriptionData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : "";

  const handleGoBack = () => {
    if (patientData._id) {
      navigate(`/patient/${patientData._id}`);
    } else {
      navigate(-1); // Go back to previous page if no patient ID
    }
  };
  return (
    <div className="bg-slate-50 min-h-screen"> 
      <Navbar />
      
      {/* Back Button and Print Button - Hidden when printing */}
      <div className='fixed top-20 md:left-70 sm:left-6 z-50 print:hidden'>
        <button
          onClick={handleGoBack}
          className='inline-flex items-center gap-2 text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 font-medium rounded-md text-sm px-4 py-2 transition-all shadow-sm hover:shadow-md'
        >
          <IoArrowBack className="text-base" />
          <span className="hidden sm:inline">Back to Patient</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>
      <div className='fixed top-20 right-4 sm:right-6 z-50 print:hidden'>
        <PrintButton />
      </div>      {/* Main Prescription Container */}
      <div className="print-container pt-45 pb-12 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden max-w-5xl mx-auto print:shadow-none print:rounded-none print:border-0">
          {/* Header Section - Compact */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold">Dr. [Doctor's Name]</h1>
                  <p className="text-blue-100 text-sm mt-0.5">Specialty: General Physician • MBBS, MD</p>
                </div>
                <div className="text-3xl md:text-4xl opacity-20">
                  <GiCaduceus />
                </div>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          </div>          {/* Patient Information Section */}
          <div className="p-6 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Patient Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient Name</label>
                <div className="text-base font-semibold text-slate-900 border-b-2 border-slate-300 pb-1">
                  {patientData.name || ""}
                </div>
              </div>
              
              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
                <div className="text-base font-semibold text-slate-900 border-b-2 border-slate-300 pb-1">
                  {formattedDate}
                </div>
              </div>
            </div>            {/* Patient Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Age</label>
                <div className="text-sm font-semibold text-slate-800 border-b-2 border-slate-300 pb-1">
                  {patientData.birthday ? `${calculateAge(patientData.birthday)} years` : ""}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gender</label>
                <div className="text-sm font-semibold text-slate-800 border-b-2 border-slate-300 pb-1 capitalize">
                  {patientData.gender || ""}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Weight</label>
                <div className="text-sm font-semibold text-slate-800 border-b-2 border-slate-300 pb-1">
                  {patientData.weight || ""} kg
                </div>
              </div>
            </div>

            {/* Diagnosis Section */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Diagnosis / Remarks</label>
              <div className="text-sm text-slate-800 border-b-2 border-slate-300 pb-2 min-h-[40px]">
                {prescriptionData.remarks || "N/A"}
              </div>
            </div>
          </div>          {/* Prescription Symbol */}
          <div className="px-6 pt-6">
            <div className="flex items-center gap-3 text-slate-700">
              <FaPrescription className="text-4xl text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Prescription</h2>
                <p className="text-sm text-slate-500">Medications prescribed below</p>
              </div>
            </div>
          </div>

          {/* Medications Table */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                      Drug Name
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 border-b border-slate-200 w-24">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 border-b border-slate-200 w-28">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-slate-200 w-80">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {prescriptionData.drug?.map((drug, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 border-b border-slate-100">
                        <div className="font-semibold text-slate-900">{drug.name}</div>
                        {drug.strength && (
                          <div className="text-xs text-slate-500 mt-0.5">{drug.strength}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center border-b border-slate-100 font-semibold text-slate-800">
                        {drug.quantity}
                      </td>
                      <td className="px-4 py-3 text-center border-b border-slate-100">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          {drug.frequency}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-100 text-slate-700 text-xs">
                        {drug.remarks || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-md">
              <p className="text-xs text-slate-700">
                <span className="font-semibold text-amber-700">Note:</span> Please follow the prescribed dosage and frequency. 
                Complete the full course of medication unless advised otherwise.
              </p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Clinic Address</p>
                <p className="text-sm text-slate-700">
                  Jivaji Mandir, Near Kolhapur Road, Jawaharnagar,<br />
                  Ichalkaranji, Maharashtra 416115
                </p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-300 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                <p className="text-xs text-slate-500 mb-2">Doctor's Signature</p>
                <div className="w-48 h-12 border-b-2 border-slate-400"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
