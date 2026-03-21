import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatientById } from '../API/Patient';
import { getPrescriptionsByPatientId } from '../API/Prescriptions';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import LoadingList from '../components/LoadingList';
import ListPrescription from '../components/ListPrescription';
import CreatePrescription from '../components/CreatePrescription';
import Navbar from '../components/Navbar';
import { FiUser, FiPhone, FiFileText, FiPlus, FiDollarSign, FiArrowLeft, FiCalendar } from 'react-icons/fi';

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

export default function PatientInfo() {
  const [showModal, setShowModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  
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
  const { data: listOfPrescriptions = [], isLoading: isPrescriptionsLoading } = useQuery({
    queryKey: ['prescriptions', id, showModal],
    queryFn: async () => {
      const prescriptions = await getPrescriptionsByPatientId(id);
      return prescriptions.data || [];
    },
    enabled: !!id,
  });

  // clear editing state when modal closes
  useEffect(() => {
    if (!showModal) setEditingPrescription(null);
  }, [showModal]);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="w-full px-0 md:max-w-7xl md:mx-auto md:px-8 pt-20 pb-8">
        
        {/* Back Button */}
        <div className="px-4 md:px-0">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 text-sm"
          >
            <FiArrowLeft className="text-base" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm border-b md:border border-slate-200 p-4 md:p-6 mb-0 md:mb-6">
          {/* Patient Avatar and Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-xl md:text-2xl">
                {patientData.name?.charAt(0).toUpperCase() || 'P'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-semibold text-slate-800 truncate">
                {patientData.name?.toUpperCase() || 'PATIENT'}
              </h1>                
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs md:text-sm text-slate-600">
                {patientData.birthday && (
                  <span className="flex items-center gap-1">
                    <FiUser className="text-slate-400 text-xs md:text-sm" />
                    {calculateAge(patientData.birthday)}y
                  </span>
                )}
                {patientData.gender && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="capitalize">{patientData.gender?.charAt(0)}</span>
                  </>
                )}
                {patientData.bloodPressure && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>BP: {patientData.bloodPressure}</span>
                  </>
                )}
                {patientData.pulseRate && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>PR: {patientData.pulseRate}</span>
                  </>
                )}
                {patientData.bloodSugarLevel && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>BS: {patientData.bloodSugarLevel}</span>
                  </>
                )}
                {patientData.phone && (
                  <>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1 text-xs md:text-sm">
                      <FiPhone className="text-slate-400 text-xs md:text-sm" />
                      <span className="hidden sm:inline">{patientData.phone}</span>
                      <span className="sm:hidden">{patientData.phone?.slice(-4)}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Full Width on Mobile */}
          <div className="grid grid-cols-1 sm:flex sm:gap-3 gap-2">
            <Link to={`/patient-profile/${id}`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2.5 md:py-2 bg-purple-600 text-white rounded-lg md:rounded-md hover:bg-purple-700 transition-colors font-medium shadow-sm text-sm active:scale-95 touch-highlight-transparent">
                <FiUser className="text-base" />
                <span>Edit Info</span>
              </button>
            </Link>
            <Link to={`/billing/${id}`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2.5 md:py-2 bg-green-600 text-white rounded-lg md:rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm text-sm active:scale-95 touch-highlight-transparent">
                <FiDollarSign className="text-base" />
                <span>Create Bill</span>
              </button>
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2.5 md:py-2 bg-blue-600 text-white rounded-lg md:rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm active:scale-95 touch-highlight-transparent"
            >
              <FiPlus className="text-base" />
              <span>New Prescription</span>
            </button>
          </div>
        </div>

        {/* Prescriptions Section */}
        <div className="px-4 md:px-0 mb-6">
          <div className="flex items-center gap-3 mb-4 mt-6 md:mt-0">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FiFileText className="text-blue-600 text-lg md:text-xl" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800">Medical History</h2>
              <p className="text-xs md:text-sm text-slate-500">
                {listOfPrescriptions.length} prescription{listOfPrescriptions.length !== 1 ? 's' : ''} on record
              </p>
            </div>
          </div>

          {/* Prescriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {isPrescriptionsLoading ? (
              <>
                <LoadingList />
                <LoadingList />
                <LoadingList />
              </>
              ) : listOfPrescriptions.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <div className="text-center py-10 md:py-12 bg-white rounded-lg border border-slate-200">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-slate-100 rounded-full">
                      <FiFileText className="text-slate-400 text-3xl md:text-4xl" />
                    </div>
                    <p className="text-slate-600 font-medium text-sm md:text-base">No prescriptions yet</p>
                    <p className="text-xs md:text-sm text-slate-400 px-4">Create the first prescription for this patient</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm active:scale-95"
                    >
                      <FiPlus className="text-base" />
                      Create First Prescription
                    </button>
                  </div>
                </div>
              </div>
              ) : (
              listOfPrescriptions.map((prescription, idx) => (
                <ListPrescription
                  key={prescription._id || idx}
                  prescription={prescription}
                  idx={idx}
                  onEdit={(p) => { setEditingPrescription(p); setShowModal(true); }}
                />
              ))
            )}
          </div>
        </div>

        {/* Prescription Modal */}
        {showModal && (
          <CreatePrescription showModal={showModal} setShowModal={setShowModal} initialPrescription={editingPrescription} />
        )}
      </div>
    </div>
  );
}

