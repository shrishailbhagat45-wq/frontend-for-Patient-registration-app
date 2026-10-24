import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { getCompanyPrescriptionAnalytics } from "../API/Analytics";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

const COMPANY_PAGE_SIZE = 20;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MedicinesGivenAnalytics() {
  const [companyPage, setCompanyPage] = useState(1);
  const [companyYear, setCompanyYear] = useState("");
  const [companyMonth, setCompanyMonth] = useState("");

  const {
    data: companyAnalytics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "prescription-company-analytics",
      companyPage,
      companyYear,
      companyMonth,
    ],
    queryFn: () =>
      getCompanyPrescriptionAnalytics({
        page: companyPage,
        limit: COMPANY_PAGE_SIZE,
        ...(companyYear ? { year: Number(companyYear) } : {}),
        ...(companyMonth ? { month: Number(companyMonth) } : {}),
      }),
  });

  const companyChartData = useMemo(() => {
    const companies = companyAnalytics?.data ?? [];
    if (companies.length === 0) return null;

    return {
      labels: companies.map((company) => company.company),
      datasets: [
        {
          label: "Prescribed drug entries",
          data: companies.map((company) => company.prescribedDrugCount),
          backgroundColor: "rgba(37, 99, 235, 0.75)",
          borderColor: "rgb(37, 99, 235)",
          borderWidth: 1,
        },
      ],
    };
  }, [companyAnalytics]);

  const companyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: true, maxRotation: 45, minRotation: 0 },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  const companyPieData = useMemo(() => {
    const companies = companyAnalytics?.data ?? [];
    if (companies.length === 0) return null;

    return {
      labels: companies.map((company) => company.company),
      datasets: [
        {
          label: "Share of prescribed medicines",
          data: companies.map((company) => company.prescribedDrugCount),
          backgroundColor: [
            "#2563eb",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
            "#ef4444",
            "#06b6d4",
            "#f97316",
            "#84cc16",
            "#ec4899",
            "#64748b",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  }, [companyAnalytics]);

  const companyPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label(context) {
            const values = context.dataset.data;
            const total = values.reduce((sum, value) => sum + value, 0);
            const percentage = total
              ? ((context.parsed / total) * 100).toFixed(1)
              : "0.0";
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  const pagination = companyAnalytics?.pagination;

  return (
    <section className="py-5">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Medicines prescribed by company
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Compare prescribed drug entries by company to support medicine
          purchasing discussions.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing up to {COMPANY_PAGE_SIZE} companies per page.
          </p>
          <div className="flex flex-wrap gap-2">
            <label className="text-sm text-slate-600">
              Year
              <select
                value={companyYear}
                onChange={(event) => {
                  setCompanyYear(event.target.value);
                  setCompanyMonth("");
                  setCompanyPage(1);
                }}
                className="ml-2 rounded-md border border-slate-300 bg-white px-2 py-2"
              >
                <option value="">All time</option>
                {Array.from({ length: 6 }, (_, index) => {
                  const year = new Date().getFullYear() - index;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Month
              <select
                value={companyMonth}
                onChange={(event) => {
                  setCompanyMonth(event.target.value);
                  setCompanyPage(1);
                }}
                disabled={!companyYear}
                className="ml-2 rounded-md border border-slate-300 bg-white px-2 py-2 disabled:bg-slate-100"
              >
                <option value="">All months</option>
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {isLoading ? (
          <div
            className="flex min-h-64 items-center justify-center"
            role="status"
            aria-label="Loading company analytics"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          </div>
        ) : isError ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            Could not load company prescription analytics. Please try again
            later.
          </div>
        ) : companyChartData ? (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                  Prescribed drug entries by company
                </h3>
                <div className="h-80">
                  <Bar data={companyChartData} options={companyChartOptions} />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                  Percentage share by company
                </h3>
                <div className="h-80">
                  <Pie data={companyPieData} options={companyPieOptions} />
                </div>
              </div>
            </div>
            {pagination?.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setCompanyPage((page) => page - 1)}
                  disabled={companyPage <= 1}
                  className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-slate-600">
                  Page {companyPage} of {pagination.totalPages} (
                  {pagination.total} companies)
                </span>
                <button
                  type="button"
                  onClick={() => setCompanyPage((page) => page + 1)}
                  disabled={companyPage >= pagination.totalPages}
                  className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
            No company prescription data found for this period.
          </div>
        )}
      </section>
    </section>
  );
}
