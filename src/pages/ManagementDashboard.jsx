import { useEffect, useState } from "react";
import { FiUserCheck, FiUsers } from "react-icons/fi";
import RegisterReceptionist from "../components/RegisterReceptionist";
import RegisterDoctor from "../components/RegisterDoctor";
import Navbar from "../components/Navbar";

export default function ManagementDashboard() {
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("receptionists");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    if (storedRole) {
      setRole(storedRole.trim());
    }
  }, []);

  const tabs = [
    { id: "receptionists", label: "Receptionists", icon: FiUsers },
    ...(role === "Admin"
      ? [{ id: "doctors", label: "Doctors", icon: FiUserCheck }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-4 pb-8 pt-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-5 text-2xl font-semibold text-slate-900">
            Staff Management
          </h1>
          <div
            className="mb-2 flex flex-wrap gap-2 border-b border-slate-200"
            role="tablist"
            aria-label="Staff sections"
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`staff-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="staff-panel"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
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
            id="staff-panel"
            role="tabpanel"
            aria-labelledby={`staff-tab-${activeTab}`}
          >
            {activeTab === "doctors" && role === "Admin" ? (
              <RegisterDoctor />
            ) : (
              <RegisterReceptionist />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
