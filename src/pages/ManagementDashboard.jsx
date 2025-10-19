import React from 'react'
import RegisterReceptionist from '../components/RegisterReceptionist'
import Navbar from '../components/Navbar'

export default function ManagementDashboard() {
  return (
    <> 
    <Navbar />
    <div className='mt-20'>
        <RegisterReceptionist />
    </div>
    </>
  )
}
