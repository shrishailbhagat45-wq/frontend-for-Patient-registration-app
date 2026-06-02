import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

// Components
import PatientDetailsCard from '../components/PatientDetailsCard';
import DoctorSelector from '../components/DoctorSelector';
import BillingItemSelector from '../components/BillingItemSelector';
import BillingItemsList from '../components/BillingItemsList';
import TaxAndTotalsSection from '../components/TaxAndTotalsSection';
import Navbar from '../components/Navbar';

// Utilities
import {
  createBillingItem,
  removeItem,
  restoreItem,
  updateItemQuantity,
  calculateTotals,
  prepareInvoiceForDatabase,
} from '../utils/invoiceHelpers';

// API imports
import {
  getServices,
  getLabTests,
  getMedicines,
  createInvoice,
  getInvoice,
  updateInvoice,
} from '../API/billing';
import { getPatientById } from '../API/Patient';
import { getAllDoctors } from '../API/user';

/**
 * Main Invoice Page
 * Handles creating and managing invoices with services, lab tests, and medicines
 */
const Invoice = () => {
  const { patientId, invoiceId } = useParams();
  const navigate = useNavigate();
  const clinicId = localStorage.getItem('clinicId');

  // State
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [taxRate, setTaxRate] = useState(18); // Default 18% GST
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'card', 'upi'
  const [invoiceStatus, setInvoiceStatus] = useState('unpaid'); // 'unpaid', 'partial', 'paid'
  const [amountPaid, setAmountPaid] = useState('');
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Fetch patient data
  const {
    data: patient,
    isLoading: isPatientLoading,
    error: patientError,
  } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const response = await getPatientById(patientId);
      return response.data || response;
    },
    enabled: !!patientId,
  });

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services', clinicId],
    queryFn: async () => {
      const response = await getServices();
      const data = Array.isArray(response) ? response : response.data || response.services || [];
      console.log('Services:', data);
      return data;
    },
    enabled: !!clinicId,
  });

  // Fetch lab tests
  const { data: labTests = [], isLoading: labTestsLoading } = useQuery({
    queryKey: ['labTests', clinicId],
    queryFn: async () => {
      const response = await getLabTests();
      const data = Array.isArray(response) ? response : response.data || response.labTests || [];
      console.log('Lab Tests:', data);
      return data;
    },
    enabled: !!clinicId,
  });

  // Fetch medicines
  const { data: medicines = [], isLoading: medicinesLoading } = useQuery({
    queryKey: ['medicines', clinicId],
    queryFn: async () => {
      const response = await getMedicines(clinicId);
      const data = Array.isArray(response) ? response : response.data || response.medicines || [];
      console.log('Medicines:', data);
      return data;
    },
    enabled: !!clinicId,
  });

  // Fetch doctors for the clinic
  const {
    data: doctors = [],
    isLoading: doctorsLoading,
  } = useQuery({
    queryKey: ['clinicDoctors', clinicId],
    queryFn: async () => {
      const response = await getAllDoctors();
      const data = Array.isArray(response) ? response : response.data || response.doctors || [];
      console.log('Doctors:', data);
      return data;
    },
    enabled: !!clinicId,
  });

  // Calculate totals
  const totals = calculateTotals(invoiceItems, taxRate);

  // Fetch invoice for editing
  const {
    data: existingInvoice,
    isLoading: isInvoiceLoading,
    error: invoiceError,
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null;
      const response = await getInvoice(invoiceId);
      return response;
    },
    enabled: !!invoiceId,
  });

  // Sync existing invoice data when editing
  useEffect(() => {
    if (!existingInvoice) return;

    setInvoiceItems(
      (existingInvoice.items || []).map((item) => ({
        ...item,
        id: item.itemId || item.id || item._id,
        itemId: item.itemId || item.id || item._id,
        subtotal: item.subtotal ?? (item.sellingPrice * item.quantity),
        actualSubtotal: item.actualSubtotal ?? (item.actualPrice * item.quantity),
        isDeleted: false,
        deletedAt: null,
      }))
    );
    setTaxRate(existingInvoice.taxRate ?? 18);
    setPaymentMethod(existingInvoice.paymentMethod || 'cash');
    setInvoiceStatus(existingInvoice.status || 'unpaid');
    setAmountPaid(existingInvoice.amountPaid != null ? String(existingInvoice.amountPaid) : '');
  }, [existingInvoice]);

  useEffect(() => {
    if (!existingInvoice || !doctors.length) return;
    const doctorId = existingInvoice.doctorId || existingInvoice.doctor?._id || existingInvoice.doctor?.id;
    const doctor = doctors.find((d) => (d.id || d._id) === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
    }
  }, [existingInvoice, doctors]);

  // Handle item addition
  const handleAddItem = (type, item, quantity) => {
    const newItem = createBillingItem(type, item, quantity);
    setInvoiceItems([...invoiceItems, newItem]);
  };

  // Handle item removal
  const handleRemoveItem = (itemId) => {
    setInvoiceItems(removeItem(invoiceItems, itemId));
  };

  // Handle item restoration (undo)
  const handleRestoreItem = (itemId) => {
    setInvoiceItems(restoreItem(invoiceItems, itemId));
  };

  // Handle undo all deleted items
  const handleUndoAll = () => {
    setInvoiceItems(
      invoiceItems.map(item => ({
        ...item,
        isDeleted: false,
        deletedAt: null,
      }))
    );
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      toast.warning('Quantity must be at least 1');
      return;
    }
    setInvoiceItems(updateItemQuantity(invoiceItems, itemId, newQuantity));
  };

  // Handle invoice creation
  const handleCreateInvoice = async () => {
    if (!selectedDoctor) {
      toast.warning('Please select a doctor');
      return;
    }

    const activeItems = invoiceItems.filter(item => !item.isDeleted);
    if (activeItems.length === 0) {
      toast.warning('Please add items to the invoice');
      return;
    }

    setIsCreatingInvoice(true);

    try {
      // Prepare invoice data with cost analysis for database
      const invoiceData = prepareInvoiceForDatabase(
        invoiceItems,
        totals,
        patientId,
        selectedDoctor.id || selectedDoctor._id,
        clinicId,
        taxRate
      );

      // Add payment method, status, and payment details
      invoiceData.paymentMethod = paymentMethod;
      invoiceData.status = invoiceStatus;
      const totalAmount = totals.total || 0;
      const parsedPaidAmount = Number(amountPaid);
      const paidAmount = invoiceStatus === 'paid'
        ? totalAmount
        : invoiceStatus === 'unpaid'
          ? 0
          : Number.isFinite(parsedPaidAmount)
            ? Math.min(Math.max(parsedPaidAmount, 0), totalAmount)
            : 0;
      invoiceData.amountPaid = paidAmount;
      invoiceData.amountRemaining = Math.max(totalAmount - paidAmount, 0);

      // Call API to create or update invoice
      const response = invoiceId
        ? await updateInvoice(invoiceId, invoiceData)
        : await createInvoice(invoiceData);

      toast.success(invoiceId ? 'Invoice updated successfully!' : 'Invoice created successfully!');
      if (patientId) {
        navigate(`/patient/${patientId}`);
      } else {
        navigate('/invoices');
      }
    } catch (error) {
      console.error('Invoice creation error:', error);
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  // Error handling
  if (patientError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading patient information</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 mt-12 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
            <p className="text-gray-600 mt-1">Add services, lab tests, and medicines</p>
          </div>
          <button
            onClick={() => patientId ? navigate(`/patient/${patientId}`) : navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Go back"
          >
            <FiX size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Details */}
            <PatientDetailsCard patient={patient} />

            {/* Doctor Selection */}
            <DoctorSelector
              selectedDoctor={selectedDoctor}
              onDoctorChange={setSelectedDoctor}
              doctors={doctors}
              isLoading={doctorsLoading}
            />

            {/* Add Items */}
            <BillingItemSelector
              services={services}
              labTests={labTests}
              medicines={medicines}
              onAddItem={handleAddItem}
              isLoading={servicesLoading || labTestsLoading || medicinesLoading}
            />

            {/* Items List */}
            <BillingItemsList
              items={invoiceItems}
              onRemoveItem={handleRemoveItem}
              onRestoreItem={handleRestoreItem}
              onQuantityChange={handleQuantityChange}
              onUndoAll={handleUndoAll}
            />
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1 space-y-4">
            {/* Totals */}
            <TaxAndTotalsSection
              totals={totals}
              taxRate={taxRate}
              onTaxRateChange={setTaxRate}
            />

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                {[
                  { value: 'cash', label: '💵 Cash' },
                  { value: 'card', label: '💳 Card' },
                  { value: 'upi', label: '📱 UPI' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Invoice Status */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Invoice Status
              </label>
              <select
                value={invoiceStatus}
                onChange={(e) => {
                  const value = e.target.value;
                  setInvoiceStatus(value);
                  if (value === 'paid') {
                    setAmountPaid(totals.total || 0);
                  } else if (value === 'unpaid') {
                    setAmountPaid(0);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="unpaid">❌ Unpaid</option>
                <option value="partial">🟡 Partial</option>
                <option value="paid">✅ Paid</option>
              </select>

              {invoiceStatus === 'partial' && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totals.total || 0}
                    step="0.01"
                    inputMode="decimal"
                    value={amountPaid}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      if (rawValue === '') {
                        setAmountPaid('');
                        return;
                      }
                      const parsed = parseFloat(rawValue);
                      if (Number.isNaN(parsed)) {
                        return;
                      }
                      setAmountPaid(String(Math.min(Math.max(parsed, 0), totals.total || 0)));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              )}

              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Amount Remaining:</span>{' '}
                  {(() => {
                    const parsedPaid = Number(amountPaid);
                    const paidValue = invoiceStatus === 'paid'
                      ? totals.total || 0
                      : invoiceStatus === 'unpaid'
                        ? 0
                        : Number.isFinite(parsedPaid)
                          ? Math.min(Math.max(parsedPaid, 0), totals.total || 0)
                          : 0;
                    return (Math.max((totals.total || 0) - paidValue, 0)).toFixed(2);
                  })()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCreateInvoice}
                disabled={isCreatingInvoice || invoiceItems.filter(i => !i.isDeleted).length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold"
              >
                <FiSave size={18} />
                {isCreatingInvoice ? (invoiceId ? 'Updating...' : 'Creating...') : (invoiceId ? 'Update Invoice' : 'Create Invoice')}
              </button>

              <button
                onClick={() => {
                  setInvoiceItems([]);
                  setSelectedDoctor(null);
                  setTaxRate(18);
                  setPaymentMethod('cash');
                  setInvoiceStatus('unpaid');
                  setAmountPaid(0);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Clear All
              </button>

              <button
                onClick={() => patientId ? navigate(`/patient/${patientId}`) : navigate(-1)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-800">
              <p className="font-semibold mb-1">💡 Tips:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Adjust tax rate as per your requirement</li>
                <li>• Modify quantities anytime</li>
                <li>• Undo removed items if needed</li>
                <li>• Doctor selection is required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Invoice;
