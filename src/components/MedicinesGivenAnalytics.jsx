import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiPackage } from "react-icons/fi";
import { getAllInvoicesByClinic } from "../API/billing";

const PERIODS = [
  { value: "today", label: "Today" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

function isWithinPeriod(dateValue, period) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  if (period === "today") {
    return date.toDateString() === now.toDateString();
  }
  if (period === "month") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }
  return date.getFullYear() === now.getFullYear();
}

function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MedicinesGivenAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const clinicId = localStorage.getItem("clinicId");
  const {
    data: invoices = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medicine-given-analytics", clinicId],
    queryFn: () => getAllInvoicesByClinic(clinicId),
    enabled: !!clinicId,
  });

  const { medicines, totalUnits, totalRevenue } = useMemo(() => {
    const medicineMap = new Map();
    let units = 0;
    let revenue = 0;

    invoices
      .filter(
        (invoice) =>
          String(invoice.status || "").toLowerCase() !== "draft" &&
          isWithinPeriod(invoice.createdAt, selectedPeriod),
      )
      .forEach((invoice) => {
        const invoiceId = invoice._id || invoice.id;
        (invoice.items || [])
          .filter((item) =>
            ["medicine", "medicines"].includes(String(item.type).toLowerCase()),
          )
          .forEach((item) => {
            const name = item.itemName || "Unnamed medicine";
            const quantity = Number(item.quantity) || 0;
            const itemRevenue =
              Number(item.totalPrice) ||
              (Number(item.unitPrice) || 0) * quantity;
            const medicine = medicineMap.get(name) || {
              name,
              quantity: 0,
              revenue: 0,
              invoiceIds: new Set(),
            };

            medicine.quantity += quantity;
            medicine.revenue += itemRevenue;
            if (invoiceId) medicine.invoiceIds.add(invoiceId);
            medicineMap.set(name, medicine);
            units += quantity;
            revenue += itemRevenue;
          });
      });

    return {
      medicines: [...medicineMap.values()]
        .map(({ invoiceIds, ...medicine }) => ({
          ...medicine,
          invoiceCount: invoiceIds.size,
        }))
        .sort((a, b) => b.quantity - a.quantity),
      totalUnits: units,
      totalRevenue: revenue,
    };
  }, [invoices, selectedPeriod]);

  return (
    <section className="py-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Medicines Given
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Dispensed medicines from completed invoices
          </p>
        </div>
        <div className="flex gap-2" aria-label="Report period">
          {PERIODS.map((period) => (
            <button
              key={period.value}
              type="button"
              aria-pressed={selectedPeriod === period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                selectedPeriod === period.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {!clinicId ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Clinic information is unavailable. Please sign in again and retry.
        </div>
      ) : isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
            role="status"
            aria-label="Loading medicine report"
          />
        </div>
      ) : isError ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          role="alert"
        >
          Could not load the medicine report. Please try again later.
        </div>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Medicine units given</p>
              <p className="mt-1 text-2xl font-semibold text-blue-700">
                {totalUnits}
              </p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Medicine types</p>
              <p className="mt-1 text-2xl font-semibold text-violet-700">
                {medicines.length}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Medicine sales</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-700">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {medicines.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center px-4 text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiPackage size={22} />
                </span>
                <p className="font-medium text-slate-700">
                  No medicines given for this period
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Medicine items from completed invoices will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Medicine</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Units given
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Invoices
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Sales
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medicines.map((medicine) => (
                      <tr
                        key={medicine.name}
                        className="text-sm text-slate-700"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {medicine.name}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {medicine.quantity}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {medicine.invoiceCount}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(medicine.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
