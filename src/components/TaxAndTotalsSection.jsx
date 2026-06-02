import React from 'react';
import { FiPercent } from 'react-icons/fi';
import { formatCurrency } from '../utils/invoiceHelpers';

/**
 * Display totals with customizable tax calculation
 */
const TaxAndTotalsSection = ({ totals, taxRate, onTaxRateChange }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-6 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Invoice Summary</h3>

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-semibold">Subtotal</span>
          <span className="text-lg font-bold text-gray-800">{formatCurrency(totals.subtotal)}</span>
        </div>

        {/* Tax Rate */}
        <div className="border-t border-indigo-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FiPercent className="text-indigo-600" size={18} />
            <label className="text-sm font-semibold text-gray-700">Tax Rate (%)</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={taxRate}
              onChange={(e) => onTaxRateChange(Math.max(0, parseFloat(e.target.value) || 0))}
              className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <span className="text-sm text-gray-600">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Adjust tax rate as needed (GST, VAT, Service Tax, etc.)
          </p>
        </div>

        {/* Tax Amount */}
        <div className="border-t border-indigo-200 pt-4 flex items-center justify-between">
          <span className="text-gray-600 font-semibold">Tax Amount</span>
          <span className="text-lg font-bold text-indigo-600">{formatCurrency(totals.taxAmount)}</span>
        </div>

        {/* Total */}
        <div className="border-t-2 border-indigo-300 pt-4 flex items-center justify-between bg-white px-4 py-3 rounded-lg">
          <span className="text-lg font-bold text-gray-800">Total Amount</span>
          <span className="text-2xl font-bold text-indigo-600">{formatCurrency(totals.total)}</span>
        </div>

        {/* Item Count */}
        <div className="text-xs text-gray-500 text-right">
          Total items: {totals.itemCount}
        </div>
      </div>
    </div>
  );
};

export default TaxAndTotalsSection;
