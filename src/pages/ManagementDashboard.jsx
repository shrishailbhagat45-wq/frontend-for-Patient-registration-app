import React from 'react'
import RegisterReceptionist from '../components/RegisterReceptionist'
import Navbar from '../components/Navbar'

export default function ManagementDashboard() {
  return (
    <div className="min-h-screen bg-slate-50"> 
    <Navbar />
    <div className='pt-20 pb-8'>
        <RegisterReceptionist />
    </div>
    </div>
  )
}
