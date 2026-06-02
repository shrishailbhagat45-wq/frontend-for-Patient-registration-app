import React, { useState } from 'react';
import { FiPlus, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

/**
 * Component to add billing items (Services, Lab Tests, Medicines) to invoice with search
 */
const BillingItemSelector = ({
  services = [],
  labTests = [],
  medicines = [],
  onAddItem,
  isLoading,
}) => {
  const [itemType, setItemType] = useState('service');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('BillingItemSelector - Services:', services);
    console.log('BillingItemSelector - Lab Tests:', labTests);
    console.log('BillingItemSelector - Medicines:', medicines);
  }, [services, labTests, medicines]);

  const getItemList = () => {
    switch (itemType) {
      case 'service':
        return services;
      case 'labTest':
        return labTests;
      case 'medicine':
        return medicines;
      default:
        return [];
    }
  };

  const getItemName = (item) => {
    return item.serviceName || item.testName || item.medicineName;
  };

  // Get filtered items based on search query
  const filteredItems = getItemList().filter((item) => {
    const itemName = getItemName(item).toLowerCase();
    return itemName.includes(searchQuery.toLowerCase());
  });

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchQuery(getItemName(item));
    setShowSuggestions(false);
  };

  const handleAddItem = () => {
    if (!selectedItem) {
      toast.warning('Please select an item');
      return;
    }

    if (quantity < 1) {
      toast.warning('Quantity must be at least 1');
      return;
    }

    console.log('Found item:', selectedItem);
    onAddItem(itemType, selectedItem, parseInt(quantity));
    setSelectedItem(null);
    setSearchQuery('');
    setQuantity(1);
    toast.success('Item added to invoice');
  };

  const itemList = getItemList();

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Add Items to Invoice</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Item Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
          <div className="relative">
            <select
              value={itemType}
              onChange={(e) => {
                setItemType(e.target.value);
                setSelectedItem(null);
                setSearchQuery('');
              }}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="service">Service</option>
              <option value="labTest">Lab Test</option>
              <option value="medicine">Medicine</option>
            </select>
            <FiChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none text-sm" />
          </div>
        </div>

        {/* Item Search Input */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Item</label>
          <div className="relative">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 text-gray-400 text-sm" size={16} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                disabled={isLoading || !itemList.length}
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedItem(null);
                  }}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchQuery && filteredItems.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {filteredItems.map((item) => {
                  const itemId = item.id || item._id;
                  const itemName = getItemName(item);
                  const price = item.sellingPrice || item.sellingPricePerTablet || item.price || 0;
                  console.log('Suggestion item:', { itemName, price, item });
                  
                  return (
                    <button
                      key={itemId}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className={`w-full text-left px-3 py-3 hover:bg-indigo-50 transition-colors text-sm border-b border-gray-100 last:border-b-0 ${
                        selectedItem?.id === item.id || selectedItem?._id === item._id
                          ? 'bg-indigo-100 text-indigo-900 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="flex-1 font-medium">{itemName}</span>
                        <span className="text-indigo-600 font-bold whitespace-nowrap">₹{parseFloat(price).toFixed(2)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results Message */}
            {showSuggestions && searchQuery && filteredItems.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3">
                <p className="text-sm text-gray-500 text-center">No items found</p>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) ))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Add Button */}
        <div className="flex items-end">
          <button
            onClick={handleAddItem}
            disabled={isLoading || !itemList.length || !selectedItem}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm font-semibold"
          >
            <FiPlus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* No Items Available Message */}
      {!isLoading && itemList.length === 0 && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
          <p className="font-semibold">No {itemType}s available</p>
          <p className="text-xs">Please create some items first</p>
        </div>
      )}

      {/* Item Preview */}
      {selectedItem && (
        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded text-sm">
          <div className="grid grid-cols-2 gap-2 text-indigo-900">
            <div>
              <span className="text-xs text-indigo-700">Selling Price:</span>
              <p className="font-semibold">₹{parseFloat(selectedItem.sellingPrice || selectedItem.sellingPricePerTablet || selectedItem.price || 0).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-indigo-700">Subtotal:</span>
              <p className="font-semibold">₹{((selectedItem.sellingPrice || selectedItem.sellingPricePerTablet || selectedItem.price || 0) * quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingItemSelector;
