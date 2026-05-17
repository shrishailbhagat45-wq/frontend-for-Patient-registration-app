import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatientById } from '../API/Patient';
import { getPrescriptionsByPatientId } from '../API/Prescriptions';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingList from '../components/LoadingList';
import ListPrescription from '../components/ListPrescription';
import CreatePrescription from '../components/CreatePrescription';
import Navbar from '../components/Navbar';
import { FiUser, FiPhone, FiFileText, FiPlus, FiDollarSign, FiArrowLeft, FiActivity, FiDroplet, FiHeart } from 'react-icons/fi';

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const VitalBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
    <Icon size={13} className="text-slate-400" />
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <span className="text-xs font-semibold text-slate-700">{value}</span>
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

  const { data: listOfPrescriptions = [], isLoading: isPrescriptionsLoading } = useQuery({
    queryKey: ['prescriptions', id, showModal],
    queryFn: async () => {
      const prescriptions = await getPrescriptionsByPatientId(id);
      return prescriptions.data || [];
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!showModal) setEditingPrescription(null);
  }, [showModal]);

  const genderLabel = patientData.gender === 'female' ? 'Female'
    : patientData.gender === 'male' ? 'Male'
    : patientData.gender ? patientData.gender : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .pi-root * { box-sizing: border-box; }

        .pi-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
          font-family: inherit;
          letter-spacing: 0.01em;
          text-decoration: none;
        }
        .pi-btn:active { transform: scale(0.97); }

        .pi-btn-outline {
          background: white;
          color: #374151;
          border: 1.5px solid #e5e7eb;
        }
        .pi-btn-outline:hover { background: #f9fafb; border-color: #d1d5db; color: #111827; }

        .pi-btn-primary {
          background: #1d4ed8;
          color: white;
        }
        .pi-btn-primary:hover { background: #1e40af; }

        .pi-btn-ghost {
          background: transparent;
          color: #6b7280;
          padding: 8px 14px;
          border: none;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .pi-btn-ghost:hover { background: #f3f4f6; color: #374151; }

        .pi-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
        }

        .pi-avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #1d4ed8;
          color: white;
          font-size: 22px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pi-rx-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 20px;
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .pi-rx-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          transform: translateY(-1px);
        }

        .pi-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .pi-empty {
          background: white;
          border-radius: 14px;
          border: 1.5px dashed #e5e7eb;
          padding: 56px 24px;
          text-align: center;
        }

        .pi-divider {
          width: 1px;
          height: 16px;
          background: #e5e7eb;
          display: inline-block;
          margin: 0 4px;
          vertical-align: middle;
        }

        .pi-stat-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          background: #f8f9fb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 12px;
          color: #374151;
        }
        .pi-stat-pill span.lbl { color: #9ca3af; font-weight: 500; }
        .pi-stat-pill span.val { font-weight: 600; font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="pi-root">
        <Navbar />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 48px' }}>

          {/* Back */}
          <button className="pi-btn-ghost" onClick={() => navigate('/home')} style={{ marginBottom: 20 }}>
            <FiArrowLeft size={14} />
            Back to patients
          </button>

          {/* Patient Card */}
          <div className="pi-card" style={{ padding: '24px 28px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>

              {/* Left: identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="pi-avatar">
                  {patientData.name?.charAt(0).toUpperCase() || 'P'}
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
                    {patientData.name || 'Patient'}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                    {patientData.birthday && (
                      <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                        {calculateAge(patientData.birthday)} yrs
                      </span>
                    )}
                    {genderLabel && (
                      <>
                        <span className="pi-divider" />
                        <span style={{ fontSize: 13, color: '#6b7280' }}>{genderLabel}</span>
                      </>
                    )}
                    {patientData.phone && (
                      <>
                        <span className="pi-divider" />
                        <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FiPhone size={12} />
                          {patientData.phone}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Vitals row */}
                  {(patientData.bloodPressure || patientData.pulseRate || patientData.bloodSugarLevel) && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      {patientData.bloodPressure && (
                        <div className="pi-stat-pill">
                          <FiActivity size={11} style={{ color: '#9ca3af' }} />
                          <span className="lbl">BP</span>
                          <span className="val">{patientData.bloodPressure}</span>
                        </div>
                      )}
                      {patientData.pulseRate && (
                        <div className="pi-stat-pill">
                          <FiHeart size={11} style={{ color: '#9ca3af' }} />
                          <span className="lbl">PR</span>
                          <span className="val">{patientData.pulseRate}</span>
                        </div>
                      )}
                      {patientData.bloodSugarLevel && (
                        <div className="pi-stat-pill">
                          <FiDroplet size={11} style={{ color: '#9ca3af' }} />
                          <span className="lbl">BS</span>
                          <span className="val">{patientData.bloodSugarLevel}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: actions */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to={`/patient-profile/${id}`} style={{ textDecoration: 'none' }}>
                  <button className="pi-btn pi-btn-outline">
                    <FiUser size={14} />
                    Edit Info
                  </button>
                </Link>
                <Link to={`/billing/${id}`} style={{ textDecoration: 'none' }}>
                  <button className="pi-btn pi-btn-outline">
                    <FiDollarSign size={14} />
                    Create Bill
                  </button>
                </Link>
                <button className="pi-btn pi-btn-primary" onClick={() => setShowModal(true)}>
                  <FiPlus size={15} />
                  New Prescription
                </button>
              </div>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p className="pi-section-label">Medical History</p>
              <h2 style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 600, color: '#111827' }}>
                Prescriptions
                <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>
                  ({listOfPrescriptions.length})
                </span>
              </h2>
            </div>
          </div>

          {/* Grid */}
          {isPrescriptionsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              <LoadingList /><LoadingList /><LoadingList />
            </div>
          ) : listOfPrescriptions.length === 0 ? (
            <div className="pi-empty">
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <FiFileText size={22} color="#9ca3af" />
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#374151' }}>No prescriptions yet</p>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#9ca3af' }}>Add the first prescription for this patient</p>
              <button className="pi-btn pi-btn-primary" onClick={() => setShowModal(true)}>
                <FiPlus size={14} />
                Create First Prescription
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {listOfPrescriptions.map((prescription, idx) => (
                <ListPrescription
                  key={prescription._id || idx}
                  prescription={prescription}
                  idx={idx}
                  onEdit={(p) => { setEditingPrescription(p); setShowModal(true); }}
                />
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <CreatePrescription
            showModal={showModal}
            setShowModal={setShowModal}
            initialPrescription={editingPrescription}
            patientData={patientData}
          />
        )}
      </div>
    </div>
  );
}