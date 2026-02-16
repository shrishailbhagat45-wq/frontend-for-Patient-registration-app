import { GiCaduceus } from "react-icons/gi";
import { FaPrescription } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "./Navbar";
import PrintButton from '../components/PrintButton';
import { useNavigate } from "react-router-dom";

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
    <div className="bg-gray-50 min-h-screen"> 
      <Navbar />
      
      {/* Back Button and Print Button - Hidden when printing */}
      <div className='fixed top-20 sm:left-2 lg:left-70 z-50 print:hidden'>
      <button
          onClick={handleGoBack}
          className='inline-flex items-center gap-2 text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 transition-all shadow-md hover:shadow-lg'
        >
          <IoArrowBack className="text-lg" />
          Back to Patient
        </button>
      </div>
      <div className='fixed top-20 right-6 z-50 print:hidden flex gap-3'>
        
        <PrintButton />
      </div>

      {/* Main Prescription Container */}
      <div className="print-container pt-24 pb-12 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl mx-auto print:shadow-none print:rounded-none">
            {/* Header Section - Compact */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Dr. [Doctor's Name]</h1>
                  <p className="text-blue-100 text-sm">Specialty: General Physician • MBBS, MD</p>
                </div>
                <div className="text-4xl md:text-5xl opacity-20">
                  <GiCaduceus />
                </div>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          </div>

          {/* Patient Information Section */}
          <div className="p-8 border-b-2 border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Patient Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient Name</label>
                <div className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1">
                  {patientData.name || ""}
                </div>
              </div>
              
              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
                <div className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1">
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Patient Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</label>
                <div className="text-base font-semibold text-gray-800 border-b-2 border-gray-300 pb-1">
                  {patientData.age || ""} years
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</label>
                <div className="text-base font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 capitalize">
                  {patientData.gender || ""}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</label>
                <div className="text-base font-semibold text-gray-800 border-b-2 border-gray-300 pb-1">
                  {patientData.weight || ""} kg
                </div>
              </div>
            </div>

            {/* Diagnosis Section */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Diagnosis / Remarks</label>
              <div className="text-base text-gray-800 border-b-2 border-gray-300 pb-2 min-h-[40px]">
                {prescriptionData.remarks || "N/A"}
              </div>
            </div>
          </div>

          {/* Prescription Symbol */}
          <div className="px-8 pt-8">
            <div className="flex items-center gap-3 text-gray-700">
              <FaPrescription className="text-5xl text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Prescription</h2>
                <p className="text-sm text-gray-500">Medications prescribed below</p>
              </div>
            </div>
          </div>

          {/* Medications Table */}
          <div className="p-8">
            <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <th className="p-4 text-left font-bold text-gray-700 border-b-2 border-blue-200">
                      Drug Name
                    </th>
                    <th className="p-4 text-center font-bold text-gray-700 border-b-2 border-blue-200 w-24">
                      Quantity
                    </th>
                    <th className="p-4 text-center font-bold text-gray-700 border-b-2 border-blue-200 w-28">
                      Frequency
                    </th>
                    <th className="p-4 text-left font-bold text-gray-700 border-b-2 border-blue-200 w-80">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {prescriptionData.drug?.map((drug, idx) => (
                    <tr 
                      key={idx} 
                      className={`${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="font-semibold text-gray-900">{drug.name}</div>
                        {drug.strength && (
                          <div className="text-xs text-gray-500 mt-0.5">{drug.strength}</div>
                        )}
                      </td>
                      <td className="p-4 text-center border-b border-gray-200 font-semibold text-gray-800">
                        {drug.quantity}
                      </td>
                      <td className="p-4 text-center border-b border-gray-200">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          {drug.frequency}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-700 text-xs">
                        {drug.remarks || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-xs text-gray-700">
                <span className="font-bold text-yellow-700">Note:</span> Please follow the prescribed dosage and frequency. 
                Complete the full course of medication unless advised otherwise.
              </p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-blue-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Clinic Address</p>
                <p className="text-sm text-gray-700">
                  Jivaji Mandir, Near Kolhapur Road, Jawaharnagar,<br />
                  Ichalkaranji, Maharashtra 416115
                </p>
              </div>
              <div className="border-t-2 md:border-t-0 md:border-l-2 border-gray-300 pt-4 md:pt-0 md:pl-6">
                <p className="text-xs text-gray-500 mb-2">Doctor's Signature</p>
                <div className="w-48 h-16 border-b-2 border-gray-400"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
