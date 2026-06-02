import React, { useState, useEffect } from 'react';
import { getPaymentMethodsAnalytics, getDoctorPerformanceAnalytics } from '../API/Analytics';
import ChartComponent from './ChartComponent';
import {
  transformPaymentMethodsData,
  formatAnalyticsMetrics,
} from '../utils/chartDataHelpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  
  // Doctor performance state
  const [doctorData, setDoctorData] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState(null);

  // Fetch analytics data when period changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getPaymentMethodsAnalytics(selectedPeriod);
        setAnalyticsData(data);
        setMetrics(formatAnalyticsMetrics(data));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch analytics data'
        );
        console.error('Analytics fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  // Fetch doctor performance data
  useEffect(() => {
    const fetchDoctorPerformance = async () => {
      setDoctorLoading(true);
      setDoctorError(null);

      try {
        const data = await getDoctorPerformanceAnalytics(selectedPeriod);
        setDoctorData(data);
      } catch (err) {
        setDoctorError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch doctor performance data'
        );
        console.error('Doctor performance fetch error:', err);
      } finally {
        setDoctorLoading(false);
      }
    };

    fetchDoctorPerformance();
  }, [selectedPeriod]);

  const chartData = analyticsData
    ? transformPaymentMethodsData(analyticsData)
    : null;

  // Prepare doctor performance chart data
  const doctorChartData = doctorData?.doctors
    ? {
        labels: doctorData.doctors.map((d) => d.doctorName),
        datasets: [
          {
            label: 'Total Revenue (₹)',
            data: doctorData.doctors.map((d) => d.totalRevenue),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total Profit (₹)',
            data: doctorData.doctors.map((d) => d.totalProfit),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total Expense (₹)',
            data: doctorData.doctors.map((d) => d.totalExpense),
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const doctorChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doctor Performance Overview',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '₹' + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Find top performing doctors
  const topDoctor = doctorData?.doctors?.reduce(
    (max, doctor) => (doctor.totalRevenue > max.totalRevenue ? doctor : max),
    doctorData?.doctors?.[0] || {}
  );

  const topProfitDoctor = doctorData?.doctors?.reduce(
    (max, doctor) => (doctor.totalProfit > max.totalProfit ? doctor : max),
    doctorData?.doctors?.[0] || {}
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 text-sm">Payment & revenue insights</p>
      </div>

      {/* Period Selection */}
      <div className="mb-6 flex gap-2">
        {PERIODS.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedPeriod === period.value
                ? 'bg-blue-500 text-white shadow-md scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Revenue Summary Cards */}
      {!isLoading && metrics && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {/* Total Revenue Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
            <p className="text-gray-600 text-xs font-medium">Total Revenue</p>
            <p className="text-xl font-bold text-blue-600 mt-1">
              ₹{metrics.totalRevenue?.toFixed(2)}
            </p>
          </div>

          {/* Payment Method Cards */}
          {Object.entries(metrics.metrics).map(([method, data]) => (
            <div
              key={method}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200"
            >
              <p className="text-gray-600 text-xs font-medium capitalize">
                {method}
              </p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                ₹{data.totalAmount?.toFixed(2)}
              </p>
              <div className="mt-2 flex justify-between text-xs text-gray-600">
                <span>{data.count}x</span>
                <span className="font-semibold text-purple-700">{data.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payment Methods Pie Chart */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Payment Distribution
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ChartComponent
              type="pie"
              data={chartData}
              title=""
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Detailed Payment Breakdown */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Payment Details
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded text-red-600">
                {error}
              </div>
            ) : analyticsData && analyticsData.paymentMethods ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analyticsData.paymentMethods.map((method) => (
                  <div
                    key={method.paymentMethod}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold text-gray-900 capitalize text-sm">
                      {method.paymentMethod}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      ₹{method.totalAmount?.toFixed(2)}
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                      <p>{method.count} transaction{method.count !== 1 ? 's' : ''}</p>
                      <p>Avg: ₹{method.avgAmount?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Performance Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Performance</h1>
        <p className="text-gray-600 text-sm mb-4">Revenue and profit analysis by doctor</p>

        {/* Doctor Summary Cards */}
        {!doctorLoading && doctorData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
              <p className="text-gray-600 text-xs font-medium">Total Doctors</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {doctorData.totalDoctors}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200">
              <p className="text-gray-600 text-xs font-medium">Total Revenue</p>
              <p className="text-xl font-bold text-green-600 mt-1">
                ₹{doctorData.doctors
                  .reduce((sum, d) => sum + d.totalRevenue, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
              <p className="text-gray-600 text-xs font-medium">Total Profit</p>
              <p className="text-xl font-bold text-purple-600 mt-1">
                ₹{doctorData.doctors
                  .reduce((sum, d) => sum + d.totalProfit, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg shadow-sm border border-orange-200">
              <p className="text-gray-600 text-xs font-medium">Total Invoices</p>
              <p className="text-xl font-bold text-orange-600 mt-1">
                {doctorData.doctors.reduce((sum, d) => sum + d.invoiceCount, 0)}
              </p>
            </div>
          </div>
        )}

        {/* Doctor Performance Chart and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {doctorLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : doctorError ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded text-red-600">
                  {doctorError}
                </div>
              ) : doctorChartData ? (
                <div className="h-96">
                  <Bar data={doctorChartData} options={doctorChartOptions} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Doctor Analysis Cards */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Performance Analysis</h2>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-green-500">💰</span> Top Revenue Generator
              </h3>
              {topDoctor && topDoctor.doctorName && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-bold text-green-700">{topDoctor.doctorName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Revenue: ₹{topDoctor.totalRevenue?.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {topDoctor.invoiceCount} invoice(s) | Avg: ₹{topDoctor.avgInvoiceAmount?.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-blue-500">📈</span> Most Profitable
              </h3>
              {topProfitDoctor && topProfitDoctor.doctorName && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-700">{topProfitDoctor.doctorName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Profit: ₹{topProfitDoctor.totalProfit?.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Margin: {topProfitDoctor.profitMargin?.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>

            {/* Individual Doctor Cards */}
            <h2 className="text-lg font-bold text-gray-900 mb-3">Doctor Details</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {doctorData?.doctors?.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-900">{doctor.doctorName}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Revenue:</span>
                      <span className="ml-1 font-semibold text-green-600">
                        ₹{doctor.totalRevenue?.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Profit:</span>
                      <span className="ml-1 font-semibold text-blue-600">
                        ₹{doctor.totalProfit?.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Expense:</span>
                      <span className="ml-1 font-semibold text-red-600">
                        ₹{doctor.totalExpense?.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Margin:</span>
                      <span className="ml-1 font-semibold text-purple-600">
                        {doctor.profitMargin?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Invoices:</span>
                      <span className="ml-1 font-semibold text-orange-600">
                        {doctor.invoiceCount} (Avg: ₹{doctor.avgInvoiceAmount?.toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
