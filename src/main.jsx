import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPatient from './pages/RegisterPatient.jsx'
import './index.css'
import App from './App.jsx'
import PatientInfo from './pages/PatientInfo.jsx'
import DetailPrescription from './pages/DetailPrescription.jsx'
import PrintPrescription from './pages/PrintPrescription.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {path: '/register', element: <RegisterPatient />},
  {path: '/patient/:id', element: <PatientInfo />}, 
  {path: '/prescription/:prescriptionId', element: <DetailPrescription />}, 
  {path: '/print-prescription', element: <PrintPrescription />},
]);

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>
  
)
