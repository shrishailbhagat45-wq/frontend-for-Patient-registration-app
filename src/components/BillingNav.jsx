import React from 'react';
import {
  FiActivity,
  FiClipboard,
  FiPackage,
  FiBarChart2,
} from 'react-icons/fi';

const tabs = [
  {
    id: 'services',
    label: 'Services',
    icon: FiClipboard,
  },
  {
    id: 'lab-tests',
    label: 'Lab Tests',
    icon: FiActivity,
  },
  {
    id: 'medicines',
    label: 'Medicines',
    icon: FiPackage,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: FiBarChart2,
  },
];

export default function BillingNav({onClickTab}) {
  const [activeTab, setActiveTab] = React.useState('services');
  function handleTabClick(tabId) {
    setActiveTab(tabId);
    onClickTab(tabId);

  }
  return (
    <div className="w-full overflow-x-auto">
      
      {/* Navigation Container */}
      <div className="flex min-w-max items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:min-w-0 md:justify-between">
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                group flex items-center gap-1 rounded-xl px-2 py-3 text-sm font-semibold transition-all duration-200
                md:flex-1 md:justify-center
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <Icon
                size={18}
                className={`transition ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-700'
                }`}
              />

              <span className="whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}