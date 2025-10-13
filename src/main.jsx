import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPatient from './pages/RegisterPatient.jsx'
import './index.css'
import App from './App.jsx'
import PatientInfo from './pages/PatientInfo.jsx'
import DetailPrescription from './pages/DetailPrescription.jsx'
import PrintPrescription from './pages/PrintPrescription.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import BillingDashBoard from './pages/BillingDashBoard.jsx'
import Billing from './pages/Billing.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {path: '/login', element: <Login />},
  {path:'/home',element:<Home />},
  {path: '/register', element: <RegisterPatient />},
  {path: '/patient/:id', element: <PatientInfo />}, 
  {path: '/prescription/:prescriptionId', element: <DetailPrescription />}, 
  {path: '/print-prescription', element: <PrintPrescription />},
  {path:'/billing-dashboard',element:<BillingDashBoard />},
  {path:'/billing/:patientId', element:<Billing/>}
]);

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>
  
)
