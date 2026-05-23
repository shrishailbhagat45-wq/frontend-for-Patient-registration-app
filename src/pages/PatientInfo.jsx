import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatientById } from '../API/Patient';
import { getPrescriptionsByPatientId } from '../API/Prescriptions';
import { useParams, useNavigate, Link } from 'react-router-dom';

import LoadingList from '../components/LoadingList';
import ListPrescription from '../components/ListPrescription';
import CreatePrescription from '../components/CreatePrescription';
import Navbar from '../components/Navbar';

import {
  FiUser,
  FiPhone,
  FiFileText,
  FiPlus,
  FiDollarSign,
  FiArrowLeft,
  FiActivity,
  FiDroplet,
  FiHeart,
} from 'react-icons/fi';

const calculateAge = (birthDate) => {
  if (!birthDate) return null;

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

const VitalBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
    <Icon size={13} className="text-slate-400" />

    <span className="text-xs font-medium text-slate-400">
      {label}
    </span>

    <span className="text-xs font-semibold text-slate-700">
      {value}
    </span>
  </div>
);

export default function PatientInfo() {
  const [showModal, setShowModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: patientData = {} } = useQuery({
    queryKey: ['patient', id],

    queryFn: async () => {
      const patient = await getPatientById(id);
      return patient.data || {};
    },

    enabled: !!id,
  });

  const {
    data: listOfPrescriptions = [],
    isLoading: isPrescriptionsLoading,
  } = useQuery({
    queryKey: ['prescriptions', id, showModal],

    queryFn: async () => {
      const prescriptions = await getPrescriptionsByPatientId(id);
      return prescriptions.data || [];
    },

    enabled: !!id,
  });

  useEffect(() => {
    if (!showModal) {
      setEditingPrescription(null);
    }
  }, [showModal]);

  const genderLabel =
    patientData.gender === 'female'
      ? 'Female'
      : patientData.gender === 'male'
      ? 'Male'
      : patientData.gender
      ? patientData.gender
      : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-20">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="mb-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <FiArrowLeft size={14} />
          Back to patients
        </button>

        {/* Patient Card */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            
            {/* Left Section */}
            <div className="flex items-center gap-4">
              
              {/* Avatar */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-2xl font-bold text-white">
                {patientData.name?.charAt(0).toUpperCase() || 'P'}
              </div>

              {/* Info */}
              <div>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                  {patientData.name || 'Patient'}
                </p>

                {/* Meta Info */}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  
                  {patientData.birthday && (
                    <span className="text-sm font-medium text-slate-500">
                      {calculateAge(patientData.birthday)} yrs
                    </span>
                  )}

                  {genderLabel && (
                    <>
                      <span className="h-4 w-px bg-slate-200" />

                      <span className="text-sm text-slate-500">
                        {genderLabel}
                      </span>
                    </>
                  )}

                  {patientData.phone && (
                    <>
                      <span className="h-4 w-px bg-slate-200" />

                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        <FiPhone size={12} />
                        {patientData.phone}
                      </span>
                    </>
                  )}
                </div>

                {/* Vitals */}
                {(patientData.bloodPressure ||
                  patientData.pulseRate ||
                  patientData.bloodSugarLevel) && (
                  <div className="mt-3 flex flex-wrap gap-2">

                    {patientData.bloodPressure && (
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                        <FiActivity
                          size={11}
                          className="text-slate-400"
                        />

                        <span className="font-medium text-slate-400">
                          BP
                        </span>

                        <span className="font-mono font-semibold">
                          {patientData.bloodPressure}
                        </span>
                      </div>
                    )}

                    {patientData.pulseRate && (
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                        <FiHeart
                          size={11}
                          className="text-slate-400"
                        />

                        <span className="font-medium text-slate-400">
                          PR
                        </span>

                        <span className="font-mono font-semibold">
                          {patientData.pulseRate}
                        </span>
                      </div>
                    )}

                    {patientData.bloodSugarLevel && (
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                        <FiDroplet
                          size={11}
                          className="text-slate-400"
                        />

                        <span className="font-medium text-slate-400">
                          BS
                        </span>

                        <span className="font-mono font-semibold">
                          {patientData.bloodSugarLevel}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap items-center gap-3">

              <Link
                to={`/patient-profile/${id}`}
                className="no-underline"
              >
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-md hover:shadow-lg">
                  <FiUser size={14} />
                  Edit Info
                </button>
              </Link>

              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-md hover:shadow-lg">
                <FiDollarSign size={14} />
                Create Bill
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-teal-600 active:scale-95 shadow-md hover:shadow-lg"
              >
                <FiPlus size={15} />
                New Prescription
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
              Medical History
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Prescriptions

              <span className="ml-2 text-sm font-medium text-slate-400">
                ({listOfPrescriptions.length})
              </span>
            </h2>
          </div>
        </div>

        {/* Loading */}
        {isPrescriptionsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <LoadingList />
            <LoadingList />
            <LoadingList />
          </div>
        ) : listOfPrescriptions.length === 0 ? (

          /* Empty State */
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <FiFileText size={22} className="text-slate-400" />
            </div>

            <p className="mb-1 text-[15px] font-semibold text-slate-700">
              No prescriptions yet
            </p>

            <p className="mb-5 text-sm text-slate-400">
              Add the first prescription for this patient
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-teal-600 active:scale-95 shadow-md hover:shadow-lg"
            >
              <FiPlus size={14} />
              Create First Prescription
            </button>
          </div>
        ) : (

          /* Prescription Grid */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listOfPrescriptions.map((prescription, idx) => (
              <ListPrescription
                key={prescription._id || idx}
                prescription={prescription}
                idx={idx}
                onEdit={(p) => {
                  setEditingPrescription(p);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreatePrescription
          showModal={showModal}
          setShowModal={setShowModal}
          initialPrescription={editingPrescription}
          patientData={patientData}
        />
      )}
    </div>
  );
}