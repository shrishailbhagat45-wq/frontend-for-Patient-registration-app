import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAppointments, updateAppointmentStatus } from '../API/Appointment';
import AppointmentModal from './AppointmentModal';
import { FiCalendar, FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Link } from 'react-router';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

const COLUMNS = [
  'Patient Name', 'UHID', 'Mobile', 'Date',
  'Time From', 'Time To', 'Status', 'Actions',
];

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    Waiting:   'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status || '—'}
    </span>
  );
}

// ─── ActionsDropdown ──────────────────────────────────────────────────────────
// Renders the menu via a portal so it escapes overflow:hidden/auto containers.
function ActionsDropdown({ appointment, onStatusChange, onRefetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);
  const isTerminal = appointment.status === 'completed' || appointment.status === 'cancelled';

  // Position the portal menu below the button on open
  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        zIndex: 9999,
        minWidth: '12rem',
      });
    }
  }, [isOpen]);

  const handleSelect = async (newStatus) => {
    setIsOpen(false);
    onStatusChange(appointment._id, newStatus);
    try {
      await updateAppointmentStatus(appointment._id, newStatus);
      onRefetch();
    } catch {
      toast.error('Failed to update status. Please try again.');
      onStatusChange(appointment._id, appointment.status);
    }
  };

  const menu = isOpen && !isTerminal ? ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div style={menuStyle} className="bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
        <button
          type="button"
          onClick={() => handleSelect('completed')}
          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
        >
          Mark as Completed
        </button>
        <button
          type="button"
          onClick={() => handleSelect('cancelled')}
          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-slate-100"
        >
          Mark as Cancelled
        </button>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        type="button"
        disabled={isTerminal}
        onClick={() => setIsOpen((p) => !p)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Actions
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {menu}
    </div>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ─── AppointmentTable ─────────────────────────────────────────────────────────
// Accepts optional onStatsChange(todayCount, waitingCount) so the parent
// can update its stat cards without duplicating the query.
export default function AppointmentTable({ onStatsChange }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuses, setStatuses] = useState({});

  const { data: appointments = [], isLoading, isError, refetch } = useQuery({
  queryKey: ['appointments'],
  queryFn: getAppointments,
  select: (res) =>
    Array.isArray(res)
      ? res
      : res?.data ?? res?.appointments ?? [],
});

useEffect(() => {
  if (!onStatsChange || appointments.length === 0) return;

  const today = new Date().toDateString();

  const todayCount = appointments.filter(
    (a) => new Date(a.date).toDateString() === today
  ).length;

  const waitingCount = appointments.filter(
    (a) => a.status === 'waiting'
  ).length;

  onStatsChange(todayCount, waitingCount);
}, [appointments, onStatsChange]);

  const handleStatusChange = (id, newStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  const rows = appointments.map((a) => ({
    ...a,
    status: statuses[a._id] ?? a.status,
    // Resolve patient fields from flat or nested shape
    _name:  a.patientName  || a.patientId?.name        || '—',
    _uhid:  a.uhid         || a.patientId?.uhid         || '—',
    _phone: a.phoneNumber  || a.patientId?.phoneNumber  || '—',
  }));

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">

        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between rounded-t-lg">
          <div>
            <p className="text-base font-semibold text-slate-800">Appointments</p>
            <p className="text-xs text-slate-500 mt-0.5">All doctor's appointments</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <FiRefreshCw className="text-base" />
          </button>
        </div>

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-slate-600 text-sm">Failed to load appointments.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="text-base" />
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {COLUMNS.map((col) => (
                    <th key={col} className="px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
              <FiCalendar className="text-blue-400 text-2xl" />
            </div>
            <div>
              <p className="text-slate-700 font-medium">No appointments yet</p>
              <p className="text-slate-500 text-sm mt-1">Click "New Appointment" to get started.</p>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {COLUMNS.map((col) => (
                    <th key={col} className="px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="px-4 py-3 text-sm text-slate-800 font-medium whitespace-nowrap">
                      <Link to ={a.patientId._id?`/patient/${a.patientId._id}`:'/'}>{a._name}</Link></td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{a._uhid}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{a._phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(a.date)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{a.timeFrom || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{a.timeTo || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ActionsDropdown appointment={a} onStatusChange={handleStatusChange} onRefetch={refetch} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          queryClient.invalidateQueries(['appointments']);
        }}
      />
    </>
  );
}
