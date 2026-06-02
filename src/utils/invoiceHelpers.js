

/**
 * Generate unique ID without uuid dependency
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new billing item
 */
export const createBillingItem = (type, item, quantity = 1) => {
  // Extract prices - services/labTests use sellingPrice, medicines use sellingPricePerTablet
  const sellingPrice = item.sellingPrice || item.sellingPricePerTablet || item.price || 0;
  const actualPrice = item.actualPrice || item.actualPricePerTablet || 0;
  
  console.log('Creating billing item:', { 
    itemName: item.serviceName || item.testName || item.medicineName,
    sellingPrice, 
    actualPrice,
    item 
  });
  
  return {
    id: item.id || item._id, // Use item's ID from database
    itemId: item.id || item._id,
    type, // 'service', 'labTest', 'medicine'
    itemName: item.serviceName || item.testName || item.medicineName,
    actualPrice, // Cost price (hidden from frontend, for expense analysis)
    sellingPrice, // Selling price (shown to user)
    quantity,
    subtotal: sellingPrice * quantity, // Selling price total
    actualSubtotal: actualPrice * quantity, // Cost price total (for profit calculation)
    isDeleted: false,
    deletedAt: null,
  };
};

/**
 * Calculate invoice totals (for display and database storage)
 */
export const calculateTotals = (items, taxRate = 0) => {
  const validItems = items.filter(item => !item.isDeleted);
  
  // Selling price calculations (shown to user)
  const subtotal = validItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  // Actual cost calculations (for expense analysis - hidden from user)
  const actualCostSubtotal = validItems.reduce((sum, item) => sum + (item.actualSubtotal || 0), 0);
  const actualCostTaxAmount = actualCostSubtotal * (taxRate / 100);
  const actualCostTotal = actualCostSubtotal + actualCostTaxAmount;
  
  // Profit calculations
  const profit = subtotal - actualCostSubtotal;
  const profitMargin = subtotal > 0 ? ((profit / subtotal) * 100) : 0;

  return {
    // Frontend display data
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    itemCount: validItems.length,
    
    // Backend cost analysis data (for expense analysis)
    actualCostSubtotal: parseFloat(actualCostSubtotal.toFixed(2)),
    actualCostTaxAmount: parseFloat(actualCostTaxAmount.toFixed(2)),
    actualCostTotal: parseFloat(actualCostTotal.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    profitMargin: parseFloat(profitMargin.toFixed(2)),
  };
};

/**
 * Remove item (soft delete for undo support)
 */
export const removeItem = (items, itemId) => {
  return items.map(item =>
    item.id === itemId
      ? { ...item, isDeleted: true, deletedAt: new Date().toISOString() }
      : item
  );
};

/**
 * Restore deleted item (undo)
 */
export const restoreItem = (items, itemId) => {
  return items.map(item =>
    item.id === itemId
      ? { ...item, isDeleted: false, deletedAt: null }
      : item
  );
};

/**
 * Update item quantity
 */
export const updateItemQuantity = (items, itemId, quantity) => {
  return items.map(item =>
    item.id === itemId
      ? {
          ...item,
          quantity: Math.max(1, quantity),
          subtotal: item.sellingPrice * Math.max(1, quantity),
          actualSubtotal: item.actualPrice * Math.max(1, quantity),
        }
      : item
  );
};

/**
 * Get deleted items for undo
 */
export const getDeletedItems = (items) => {
  return items.filter(item => item.isDeleted).sort((a, b) => 
    new Date(b.deletedAt) - new Date(a.deletedAt)
  );
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Prepare invoice data for database storage with cost analysis
 * Includes only non-deleted items with all cost and profit calculations
 */
export const prepareInvoiceForDatabase = (items, totals, patientId, doctorId, clinicId, taxRate) => {
  const validItems = items.filter(item => !item.isDeleted);
  
  return {
    patientId,
    doctorId,
    clinicId,
    items: validItems.map(item => ({
      id: item.id,
      type: item.type,
      itemId: item.itemId,
      itemName: item.itemName,
      sellingPrice: parseFloat(item.sellingPrice) || 0, // Price shown to customer
      actualPrice: parseFloat(item.actualPrice) || 0, // Cost price (hidden)
      quantity: item.quantity,
      subtotal: parseFloat(item.subtotal) || 0, // Selling price total
      actualSubtotal: parseFloat(item.actualSubtotal) || 0, // Cost total
      margin: parseFloat((item.subtotal - item.actualSubtotal).toFixed(2)) || 0, // Profit per item
    })),
    
    // Selling price summary (shown to customer)
    subtotal: parseFloat(totals.subtotal) || 0,
    taxRate: parseFloat(taxRate) || 0,
    taxAmount: parseFloat(totals.taxAmount) || 0,
    totalAmount: parseFloat(totals.total) || 0,
    
    // Cost analysis (for expense analysis)
    actualCostSubtotal: parseFloat(totals.actualCostSubtotal) || 0,
    actualCostTaxAmount: parseFloat(totals.actualCostTaxAmount) || 0,
    actualCostTotal: parseFloat(totals.actualCostTotal) || 0,
    profit: parseFloat(totals.profit) || 0,
    profitMargin: parseFloat(totals.profitMargin) || 0,
    
    // Metadata
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
};
