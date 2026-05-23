import { React,useState } from 'react';
import Navbar from '../components/Navbar';
import BillingNav from '../components/BillingNav';
import Services from '../components/Services';
import LabTest from '../components/LabTest';
import Medicines from '../components/Medicines';

export default function BillingDashBoard() {
  const [activeTab, setActiveTab] = useState('services');
  function onClickTab(tabId) {
    setActiveTab(tabId);
    console.log('Active tab:', tabId);
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 lg:px-12 pb-8">
        <div className="max-w-6xl mx-auto mb-6">
          <h1 className='text-2xl md:text-3xl font-semibold text-slate-800 mb-1 '>Billing Dashboard</h1>
        </div>
        <BillingNav onClickTab={onClickTab} />
        {activeTab === 'services' && <Services />}
        {activeTab === 'lab-tests' && <LabTest />}
        {activeTab === 'medicines' && <Medicines />}
      </div>
    </div>
  )
}
