import RegisterReceptionist from '../components/RegisterReceptionist'
import Navbar from '../components/Navbar'
import RegisterDoctor from '../components/RegisterDoctor'

const role=localStorage.getItem('role')

export default function ManagementDashboard() {
  return (
    <div className="min-h-screen bg-slate-50"> 
    <Navbar />
    <div className='pt-20 pb-8'>
        <RegisterReceptionist />
        {role==='Admin'?<RegisterDoctor />:''}
    </div>
    </div>
  )
}
