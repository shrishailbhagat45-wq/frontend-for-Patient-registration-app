import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInvoicesByPatient } from '../API/billing';
import { FiChevronLeft, FiChevronRight, FiFileText, FiCalendar, FiDollarSign, FiAlertCircle, FiEdit } from 'react-icons/fi';
import LoadingList from './LoadingList';

/**
 * Display invoices for a patient with pagination support
 */
const InvoiceList = ({ patientId }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  // Fetch invoices with pagination
  const {
    data: invoiceData = { invoices: [], pagination: { page: 1, limit: 3, total: 0 } },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['invoices', patientId, currentPage],
    queryFn: async () => {
      const result = await getInvoicesByPatient(patientId, currentPage, limit);
      return result;
    },
    enabled: !!patientId,
  });

  const { invoices = [], pagination = {} } = invoiceData;
  const totalPages = Math.ceil((pagination.total || 0) / limit);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LoadingList />
        <LoadingList />
        <LoadingList />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50 px-6 py-14 text-center">
        <p className="text-sm text-red-600">Error loading invoices: {error?.message}</p>
      </div>
    );
  }

  // Empty state
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <FiFileText size={22} className="text-slate-400" />
        </div>
        <p className="mb-1 text-[15px] font-semibold text-slate-700">
          No invoices yet
        </p>
        <p className="text-sm text-slate-400">
          Invoices will appear here once created
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Invoice Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {invoices.map((invoice) => (
          <div
            key={invoice._id || invoice.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-slate-300"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Invoice
                </p>
                <p className="text-sm font-mono font-bold text-slate-900">
                  #{invoice._id?.substring(0, 8) || invoice.id?.substring(0, 8)}
                </p>
              </div>

              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                invoice.paymentStatus === 'paid' || (invoice.amountRemaining === 0 && invoice.totalAmount > 0)
                  ? 'bg-emerald-100 text-emerald-700'
                  : invoice.paymentStatus === 'partial' || invoice.paymentStatus === 'partially_paid' || (invoice.amountPaid > 0 && invoice.amountRemaining > 0)
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
              }`}>
                {invoice.paymentStatus === 'paid' || (invoice.amountRemaining === 0 && invoice.totalAmount > 0)
                  ? 'Paid'
                  : invoice.paymentStatus === 'partial' || invoice.paymentStatus === 'partially_paid' || (invoice.amountPaid > 0 && invoice.amountRemaining > 0)
                    ? 'Partial'
                    : 'Unpaid'}
              </span>
              <button
                onClick={() => navigate(`/invoice/${patientId}/${invoice._id || invoice.id}`)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                title="Edit invoice"
              >
                <FiEdit size={14} />
                Edit
              </button>
            </div>

            <div className="grid gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FiCalendar size={14} className="text-slate-400" />
                <span>{formatDate(invoice.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <FiDollarSign size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(invoice.totalAmount)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FiAlertCircle size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Due</p>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(
                      invoice.amountRemaining ?? (invoice.totalAmount || 0) - (invoice.amountPaid || 0)
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FiFileText size={14} className="text-slate-400" />
                <span>{invoice.items?.length || 0} items</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex justify-between mb-1">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Tax:</span>
                <span className="font-medium">{formatCurrency(invoice.totalTax || invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-semibold mb-3">
                <span>Total:</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>

              {/* Items */}
              {invoice.items && invoice.items.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="font-semibold text-slate-700 mb-2">Items:</p>
                  <div className="space-y-1">
                    {invoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-600">
                        <div className="flex-1">
                          <span className="font-medium text-slate-700">{item.itemName}</span>
                          <span className="text-slate-500 ml-1">
                            ({item.quantity}x {formatCurrency(item.sellingPrice)})
                          </span>
                        </div>
                        <span className="text-slate-700 font-medium">{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Previous page"
          >
            <FiChevronLeft size={18} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Next page"
          >
            <FiChevronRight size={18} />
          </button>

          {/* Info */}
          <span className="ml-2 text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
