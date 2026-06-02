/**
 * Transform payment methods analytics data into pie chart format
 * @param {Object} analyticsData - Raw data from API
 * @returns {Object} Formatted data for Chart.js
 */
export function transformPaymentMethodsData(analyticsData) {
  if (!analyticsData || !analyticsData.paymentMethods) {
    return null;
  }

  const paymentMethods = analyticsData.paymentMethods;

  // Color palette for different payment methods
  const colorMap = {
    cash: 'rgba(34, 197, 94, 0.8)',      // Green
    card: 'rgba(59, 130, 246, 0.8)',     // Blue
    upi: 'rgba(168, 85, 247, 0.8)',      // Purple
    other: 'rgba(249, 115, 22, 0.8)',    // Orange
  };

  const borderColorMap = {
    cash: 'rgba(34, 197, 94, 1)',
    card: 'rgba(59, 130, 246, 1)',
    upi: 'rgba(168, 85, 247, 1)',
    other: 'rgba(249, 115, 22, 1)',
  };

  const labels = paymentMethods.map((method) =>
    method.paymentMethod.charAt(0).toUpperCase() + method.paymentMethod.slice(1)
  );

  const amounts = paymentMethods.map((method) => method.totalAmount);
  const colors = paymentMethods.map((method) =>
    colorMap[method.paymentMethod.toLowerCase()] || colorMap.other
  );
  const borderColors = paymentMethods.map((method) =>
    borderColorMap[method.paymentMethod.toLowerCase()] || borderColorMap.other
  );

  return {
    labels,
    datasets: [
      {
        label: 'Payment Amount (₹)',
        data: amounts,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
}

/**
 * Format analytics data for display with additional metrics
 * @param {Object} analyticsData - Raw data from API
 * @returns {Object} Formatted data with metrics
 */
export function formatAnalyticsMetrics(analyticsData) {
  if (!analyticsData || !analyticsData.paymentMethods) {
    return {};
  }

  const metrics = {};
  analyticsData.paymentMethods.forEach((method) => {
    metrics[method.paymentMethod] = {
      totalAmount: method.totalAmount,
      count: method.count,
      avgAmount: method.avgAmount,
      percentage: (
        (method.totalAmount / analyticsData.totalRevenue) *
        100
      ).toFixed(2),
    };
  });

  return {
    totalRevenue: analyticsData.totalRevenue,
    period: analyticsData.period,
    metrics,
  };
}
