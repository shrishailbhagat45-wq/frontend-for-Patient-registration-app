import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { Navigate, Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import RegisterPatient from './pages/RegisterPatient.jsx'
import './index.css'
import RootLayout from './RootLayout.jsx'
import PatientInfo from './pages/PatientInfo.jsx'
import EditPatientProfile from './pages/EditPatientProfile.jsx'
import DetailPrescription from './pages/DetailPrescription.jsx'
import PrintPrescription from './pages/PrintPrescription.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import BillingDashBoard from './pages/BillingDashBoard.jsx'
import Billing from './pages/Billing.jsx'
import ManagementDashboard from './pages/ManagementDashboard.jsx'
import Profile from './pages/Profile.jsx'
import GetBillingInfo from './pages/GetBillingInfo.jsx'

const queryClient = new QueryClient()

const RequireAuth = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

const router = createBrowserRouter([
  { path: '/', element: <RootLayout /> },
  {path: '/login', element: <Login />},
  {
    element: <RequireAuth />,
    children: [
      {path:'/home',element:<Home />},
      {path: '/register', element: <RegisterPatient />},
      {path: '/patient/:id', element: <PatientInfo />},
      {path: '/patient-profile/:id', element: <EditPatientProfile />}, 
      {path: '/prescription/:prescriptionId', element: <DetailPrescription />}, 
      {path: '/print-prescription', element: <PrintPrescription />},
      {path:'/billing-dashboard',element:<BillingDashBoard />},
      {path:'/billing/:patientId', element:<Billing/>},
      {path:'/management-dashboard',element:<ManagementDashboard/>},
      {path:'/profile',element:<Profile/>},
      {path:'/billing-info',element:<GetBillingInfo/>}
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer />
  </QueryClientProvider>
)

