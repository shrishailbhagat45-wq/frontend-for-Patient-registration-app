import { useState } from "react";
import { FiBarChart2, FiPackage } from "react-icons/fi";
import Analytics from "../components/Analytics";
import MedicinesGivenAnalytics from "../components/MedicinesGivenAnalytics";
import Navbar from "../components/Navbar";

const tabs = [
  { id: "payments", label: "Payment & revenue insights", icon: FiBarChart2 },
  { id: "medicines", label: "Medicines Given", icon: FiPackage },
];

export default function InsightsDashboard() {
  const [activeTab, setActiveTab] = useState("payments");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="px-4 pb-8 pt-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-5 text-2xl font-semibold text-slate-900">
            Analysis
          </h1>
          <div
            className="mb-2 flex flex-wrap gap-2 border-b border-slate-200"
            role="tablist"
            aria-label="Analysis reports"
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`analysis-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls="analysis-panel"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  <TabIcon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div
            id="analysis-panel"
            role="tabpanel"
            aria-labelledby={`analysis-tab-${activeTab}`}
          >
            {activeTab === "payments" ? (
              <Analytics />
            ) : (
              <MedicinesGivenAnalytics />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
