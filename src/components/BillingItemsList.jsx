import React from 'react';
import { FiTrash2, FiRotateCcw, FiEdit2 } from 'react-icons/fi';
import { getDeletedItems, formatCurrency } from '../utils/invoiceHelpers';

/**
 * Display and manage billing items in invoice
 */
const BillingItemsList = ({ items, onRemoveItem, onRestoreItem, onQuantityChange, onUndoAll }) => {
  const activeItems = items.filter(item => !item.isDeleted);
  const deletedItems = getDeletedItems(items);

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Invoice Items ({activeItems.length})
        </h3>
        {deletedItems.length > 0 && (
          <button
            onClick={onUndoAll}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <FiRotateCcw size={14} />
            Undo All
          </button>
        )}
      </div>

      {activeItems.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-sm">No items added yet. Add items to create invoice.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Item</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Type</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Price</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Qty</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Subtotal</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 text-gray-800 font-semibold">{item.itemName}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
                      {item.type === 'labTest' ? 'Lab Test' : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-gray-700">{formatCurrency(item.sellingPrice)}</td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-10 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                      <button
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-800">
                    {formatCurrency(item.subtotal)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deleted Items Section */}
      {deletedItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Recently Removed ({deletedItems.length})
          </p>
          <div className="space-y-2">
            {deletedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded text-sm"
              >
                <span className="text-gray-600">
                  {item.itemName} <span className="text-gray-400">({item.quantity}x {formatCurrency(item.sellingPrice)})</span>
                </span>
                <button
                  onClick={() => onRestoreItem(item.id)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Restore item"
                >
                  <FiRotateCcw size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingItemsList;
