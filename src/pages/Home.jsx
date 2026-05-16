import { useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentModal from '../components/AppointmentModal';
import { useQueryClient } from '@tanstack/react-query';
import { FiUsers, FiCalendar, FiActivity } from 'react-icons/fi';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const queryClient = useQueryClient();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-20 px-4 md:px-8 lg:px-12 pb-8">

        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-1">
            Patient Management
          </h1>
          <p className="text-sm text-slate-500">Manage appointments and patient flow</p>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Today's Appointments</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{todayCount}</p>
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
                    {waitingCount > 0 ? `${waitingCount} Waiting` : 'All Clear'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiActivity className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg shadow-sm p-5 hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 font-medium">Quick Actions</p>
                  <p className="text-lg font-semibold text-white mt-2">New Appointment</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCalendar className="text-white text-2xl" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Search */}
        <div className="max-w-6xl mx-auto mb-6">
          <SearchBar />
        </div>

        {/* Appointments */}
        <div className="max-w-6xl mx-auto">
          <AppointmentTable
            onStatsChange={(today, waiting) => {
              setTodayCount(today);
              setWaitingCount(waiting);
            }}
          />
        </div>

      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          queryClient.invalidateQueries(['appointments']);
        }}
      />
    </div>
  );
};

export default Home;
