import { FiActivity, FiClipboard, FiPackage } from "react-icons/fi";

const tabs = [
  {
    id: "services",
    label: "Services",
    icon: FiClipboard,
  },
  {
    id: "lab-tests",
    label: "Lab Tests",
    icon: FiActivity,
  },
  {
    id: "medicines",
    label: "Medicines",
    icon: FiPackage,
  },
];

export default function BillingNav({ activeTab, onClickTab }) {
  return (
    <div className="w-full overflow-x-auto">
      <div
        className="mb-2 flex min-w-max gap-2 border-b border-slate-200 md:min-w-0"
        role="tablist"
        aria-label="Billing sections"
      >
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`billing-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="billing-panel"
              onClick={() => onClickTab(tab.id)}
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
    </div>
  );
}
