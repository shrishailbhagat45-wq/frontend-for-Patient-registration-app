import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { FiX, FiSearch, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getPatients, createPatient } from '../API/Patient';
import { createAppointment } from '../API/Appointment';

// ─── Validation schema ────────────────────────────────────────────────────────
// Only the appointment-level fields are required unconditionally.
// Patient fields (name, phoneNumber, gender) are required only when registering
// a new patient — enforced in handleSave after checking patientIsPresent.
const schema = z.object({
  name:        z.string().optional(),
  phoneNumber: z.string().optional(),
  gender:      z.string().optional(),
  birthDate:   z.string().optional(),
  address:     z.string().optional(),
  date:        z.string().min(1, 'Date is required'),
  timeFrom:    z.string().min(1, 'Time From is required'),
  timeTo:      z.string().min(1, 'Time To is required'),
}).refine(
  (d) => !d.timeFrom || !d.timeTo || d.timeTo > d.timeFrom,
  { message: 'Time To must be after Time From', path: ['timeTo'] }
);

// ─── AppointmentModal ─────────────────────────────────────────────────────────
export default function AppointmentModal({ isOpen, onClose, onSuccess }) {
  const todayISO = new Date().toISOString().split('T')[0];

  // The patient selected from the search dropdown.
  // patientIsPresent = true  → skip createPatient, go straight to addPatientToQueue
  // patientIsPresent = false → createPatient first, then addPatientToQueue
  const [selectedPatient, setSelectedPatient] = useState(null);
  const patientIsPresent = selectedPatient !== null;

  // Search input value (controlled separately from RHF — it's not a form field)
  const [searchQuery, setSearchQuery] = useState('');
  // debouncedQuery is what actually triggers the API call — updates 350ms after typing stops
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchContainerRef = useRef(null);
  const debounceTimer = useRef(null);

  // ─── react-hook-form ────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', phoneNumber: '', gender: '', birthDate: '', address: '',
      date: todayISO, timeFrom: '', timeTo: '',
    },
  });

  // ─── Patient search via useQuery ────────────────────────────────────────────
  // Uses the existing getPatients endpoint. Enabled only when debouncedQuery ≥ 2 chars.
  const {
    data: searchResults = [],
    isFetching: isSearching,
    isError: isSearchError,
    refetch: retrySearch,
  } = useQuery({
    queryKey: ['patientSearch', debouncedQuery],
    queryFn: () => getPatients(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    select: (data) => {
      const list = Array.isArray(data) ? data : data?.data ?? [];
      return list.slice(0, 10);
    },
    staleTime: 30_000,
  });

  // Show dropdown when there's an active debounced query
  useEffect(() => {
    setShowDropdown(debouncedQuery.length >= 2);
  }, [debouncedQuery, searchResults]);

  // ─── Reset everything when the modal opens ──────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      reset({
        name: '', phoneNumber: '', gender: '', birthDate: '', address: '',
        date: new Date().toISOString().split('T')[0],
        timeFrom: '', timeTo: '',
      });
      setSelectedPatient(null);
      setSearchQuery('');
      setDebouncedQuery('');
      setShowDropdown(false);
      setIsSaving(false);
    }
  }, [isOpen, reset]);

  // ─── Escape key ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // ─── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ─── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const onOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // ─── Patient selection from dropdown ────────────────────────────────────────
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowDropdown(false);
    setSearchQuery(patient.name || '');

    // Pre-fill patient fields (read-only display)
    setValue('name', patient.name || '');
    setValue('phoneNumber', patient.phoneNumber || '');
    setValue('gender', patient.gender || '');
    setValue('birthDate', patient.birthday
      ? new Date(patient.birthday).toISOString().split('T')[0]
      : '');
    setValue('address', patient.address || '');
  };

  // ─── Clear patient selection when search is cleared ─────────────────────────
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce the actual API query key
    clearTimeout(debounceTimer.current);
    if (value.length >= 2) {
      debounceTimer.current = setTimeout(() => setDebouncedQuery(value), 350);
    } else {
      setDebouncedQuery('');
      setShowDropdown(false);
    }

    if (!value) {
      setSelectedPatient(null);
      setValue('name', '');
      setValue('phoneNumber', '');
      setValue('gender', '');
      setValue('birthDate', '');
      setValue('address', '');
    }
  };

  // ─── Save: register new patient (if needed) then create appointment ────────
  const onSubmit = async (data) => {

  if (!patientIsPresent) {

    let hasError = false;

    if (!data.name?.trim()) {
      setError('name', { message: 'Name is required' });
      hasError = true;
    }

    if (!/^\d{10}$/.test(data.phoneNumber || '')) {
      setError('phoneNumber', {
        message: 'Enter a valid 10-digit phone number'
      });
      hasError = true;
    }

    if (!data.gender) {
      setError('gender', { message: 'Gender is required' });
      hasError = true;
    }

    if (hasError) return;
  }

  setIsSaving(true);

  try {

    let patientId;

    /**
     * EXISTING PATIENT
     */
    if (patientIsPresent) {

      patientId = selectedPatient._id;

    } else {

      /**
       * CREATE NEW PATIENT
       */
      try {

        const created = await createPatient({
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate || null,
          phoneNumber: data.phoneNumber,
          weight: 0,
        });

        patientId = created?.data?._id;

        if (!patientId) {
          toast.error('Failed to get patient ID');
          return;
        }

      } catch (error) {

        console.error(error);

        toast.error('Failed to register patient. Please try again.');
        return;
      }
    }

    /**
     * CREATE APPOINTMENT
     */
    try {

      await createAppointment({
        patientId,
        clinicId: localStorage.getItem('clinicId'),
        doctorId: localStorage.getItem('doctorId'),
        date: data.date,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
      });

      toast.success('Appointment booked successfully!');

      onSuccess();

    } catch (error) {

      console.error(error);

      toast.error('Failed to create appointment. Please try again.');
    }

  } finally {

    setIsSaving(false);
  }
};

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const inputCls = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-slate-800 transition-colors ${
      errors[field]
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
    }`;

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">{errors[field].message}</p>
    ) : null;

  if (!isOpen) return null;

  const modal = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="fixed inset-0 z-[51] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby="appt-modal-title"
      >
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-lg z-10">
            <div>
              <h2 id="appt-modal-title" className="text-lg font-semibold text-slate-800">
                New Appointment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {patientIsPresent
                  ? `Patient: ${selectedPatient.name} — booking appointment`
                  : 'Search for an existing patient or fill in details to register a new one'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md p-1.5 transition-colors"
              aria-label="Close"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="px-6 py-6 space-y-5">

              {/* ── Patient search ── */}
              <div ref={searchContainerRef} className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Search Patient
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-slate-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name or phone number…"
                    className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                    autoComplete="off"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiLoader className="text-slate-400 text-sm animate-spin" />
                    </div>
                  )}
                </div>

                {isSearchError && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <p className="text-xs text-red-600">Search failed.</p>
                    <button type="button" onClick={() => retrySearch()} className="text-xs text-blue-600 hover:underline">
                      Retry
                    </button>
                  </div>
                )}

                {/* Dropdown */}
                {showDropdown && !isSearching && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">No patient found</div>
                    ) : (
                      searchResults.map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => handleSelectPatient(p)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                          <span className="text-sm font-medium text-slate-800">{p.name}</span>
                          <span className="text-xs text-slate-500 ml-2">{p.phoneNumber}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* ── Patient status indicator ── */}
              {patientIsPresent && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  Existing patient — registration will be skipped
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatient(null);
                      setSearchQuery('');
                      setValue('name', ''); setValue('phoneNumber', '');
                      setValue('gender', ''); setValue('birthDate', '');
                      setValue('address', '');
                    }}
                    className="ml-auto text-xs text-green-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* ── Patient details ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name {!patientIsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    readOnly={patientIsPresent}
                    placeholder="Patient's full name"
                    className={inputCls('name') + (patientIsPresent ? ' bg-slate-50 cursor-not-allowed' : '')}
                  />
                  <FieldError field="name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone Number {!patientIsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    {...register('phoneNumber')}
                    type="tel"
                    readOnly={patientIsPresent}
                    placeholder="10-digit number"
                    maxLength={10}
                    className={inputCls('phoneNumber') + (patientIsPresent ? ' bg-slate-50 cursor-not-allowed' : '')}
                  />
                  <FieldError field="phoneNumber" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Gender {!patientIsPresent && <span className="text-red-500">*</span>}
                  </label>
                  {patientIsPresent ? (
                    <input
                      {...register('gender')}
                      type="text"
                      readOnly
                      className={inputCls('gender') + ' bg-slate-50 cursor-not-allowed'}
                    />
                  ) : (
                    <select {...register('gender')} className={inputCls('gender') + ' appearance-none'}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                  <FieldError field="gender" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    {...register('birthDate')}
                    type="date"
                    readOnly={patientIsPresent}
                    max={todayISO}
                    className={inputCls('birthDate') + (patientIsPresent ? ' bg-slate-50 cursor-not-allowed' : '')}
                  />
                  <FieldError field="birthDate" />
                </div>
              </div>

              {/* ── Address ── */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Address
                </label>
                <input
                  {...register('address')}
                  type="text"
                  readOnly={patientIsPresent}
                  placeholder="Optional"
                  className={inputCls('address') + (patientIsPresent ? ' bg-slate-50 cursor-not-allowed' : '')}
                />
                <FieldError field="address" />
              </div>

              {/* ── Appointment details ── */}
              <div className="border-t border-slate-200 pt-1">                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Appointment Details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input {...register('date')} type="date" className={inputCls('date')} />
                  <FieldError field="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Time From <span className="text-red-500">*</span>
                  </label>
                  <input {...register('timeFrom')} type="time" className={inputCls('timeFrom')} />
                  <FieldError field="timeFrom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Time To <span className="text-red-500">*</span>
                  </label>
                  <input {...register('timeTo')} type="time" className={inputCls('timeTo')} />
                  <FieldError field="timeTo" />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg sticky bottom-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <FiLoader className="animate-spin text-base" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>{patientIsPresent ? 'Book Appointment' : 'Register & Book Appointment'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modal, document.body);
}
