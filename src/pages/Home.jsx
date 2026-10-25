import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import AppointmentTable from "../components/AppointmentTable";
import AppointmentModal from "../components/AppointmentModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiUsers, FiCalendar, FiActivity } from "react-icons/fi";
import { getDoctor } from "../API/user";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const queryClient = useQueryClient();
  const clinicId = localStorage.getItem("clinicId");
  const isReceptionist = localStorage.getItem("role") === "Receptionist";
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    () => localStorage.getItem("activeDoctorId") || "",
  );
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["clinicDoctors", clinicId],
    queryFn: () => getDoctor(clinicId),
    enabled: isReceptionist && Boolean(clinicId),
    select: (response) =>
      Array.isArray(response) ? response : (response?.data ?? []),
  });

  useEffect(() => {
    if (!isReceptionist || doctorsLoading) return;
    const currentDoctor = doctors.find(
      (doctor) => (doctor._id || doctor.id) === selectedDoctorId,
    );
    const nextDoctorId = currentDoctor
      ? selectedDoctorId
      : doctors[0]?._id || doctors[0]?.id || "";
    setSelectedDoctorId(nextDoctorId);
    if (nextDoctorId) localStorage.setItem("activeDoctorId", nextDoctorId);
    else localStorage.removeItem("activeDoctorId");
  }, [doctors, doctorsLoading, isReceptionist, selectedDoctorId]);

  const doctorId = isReceptionist
    ? doctors.some((doctor) => (doctor._id || doctor.id) === selectedDoctorId)
      ? selectedDoctorId
      : ""
    : localStorage.getItem("doctorId");
  const selectedDoctor = doctors.find(
    (doctor) => (doctor._id || doctor.id) === doctorId,
  );

  const handleDoctorChange = (nextDoctorId) => {
    setSelectedDoctorId(nextDoctorId);
    if (nextDoctorId) localStorage.setItem("activeDoctorId", nextDoctorId);
    else localStorage.removeItem("activeDoctorId");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-20 px-4 md:px-8 lg:px-12 pb-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-1">
            Patient Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage appointments and patient flow
          </p>
        </div>

        {isReceptionist && (
          <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Managing doctor
              </p>
              <p className="text-xs text-slate-500">
                Appointments and patient flow for the selected doctor
              </p>
            </div>
            <select
              aria-label="Select doctor to manage"
              value={doctorId}
              onChange={(event) => handleDoctorChange(event.target.value)}
              disabled={doctorsLoading || doctors.length === 0}
              className="w-full sm:w-72 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
            >
              <option value="">
                {doctorsLoading ? "Loading doctors..." : "No doctors available"}
              </option>
              {doctors.map((doctor) => (
                <option
                  key={doctor._id || doctor.id}
                  value={doctor._id || doctor.id}
                >
                  {doctor.name}
                  {doctor.specialization ? ` · ${doctor.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Today's Appointments
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {todayCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUsers className="text-blue-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Status</p>
                  <p className="text-xl font-semibold text-green-600 mt-2">
                    {waitingCount > 0 ? `${waitingCount} Waiting` : "All Clear"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiActivity className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={!doctorId}
              className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg shadow-sm p-5 hover:shadow-md transition-all cursor-pointer transform hover:scale-105 text-left disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 font-medium">
                    Quick Actions
                  </p>
                  <p className="text-lg font-semibold text-white mt-2">
                    New Appointment
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCalendar className="text-white text-2xl" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-6xl mx-auto mb-6">
          <SearchBar />
        </div>

        {/* Appointments */}
        <div className="max-w-6xl mx-auto">
          {isReceptionist && !doctorId ? (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-800">
                {doctorsLoading
                  ? "Loading clinic doctors..."
                  : "No doctors are available"}
              </p>
              {!doctorsLoading && (
                <p className="mt-1 text-sm text-slate-500">
                  Add a doctor to this clinic before managing appointments.
                </p>
              )}
            </div>
          ) : (
            <AppointmentTable
              doctorId={doctorId}
              doctorName={selectedDoctor?.name}
              onStatsChange={(today, waiting) => {
                setTodayCount(today);
                setWaitingCount(waiting);
              }}
            />
          )}
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorId={doctorId}
        doctors={doctors}
        onDoctorChange={handleDoctorChange}
        onSuccess={() => {
          setIsModalOpen(false);
          queryClient.invalidateQueries(["appointments"]);
        }}
      />
    </div>
  );
};

export default Home;
