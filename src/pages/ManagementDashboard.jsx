import { useEffect, useState } from 'react'
import RegisterReceptionist from '../components/RegisterReceptionist'
import RegisterDoctor from '../components/RegisterDoctor'
import Navbar from '../components/Navbar'

export default function ManagementDashboard() {

  const [role, setRole] = useState('')

  useEffect(() => {
    const storedRole = localStorage.getItem('role')

    if (storedRole) {
      setRole(storedRole.trim())
    }
  }, [])

  console.log(role)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-20 pb-8 space-y-6">

        {/* Receptionist Registration */}
        <RegisterReceptionist />

        {/* Only Admin Can See */}
        {role === 'Admin' && (
          <RegisterDoctor />
        )}

      </div>
    </div>
  )
}