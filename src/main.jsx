import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPatient from './pages/RegisterPatient.jsx'
import './index.css'
import App from './App.jsx'
import PatientInfo from './pages/PatientInfo.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {path: '/register', element: <RegisterPatient />},
  {path: '/patient/:id', element: <PatientInfo />}, // Assuming you want to use the same component for patient info
]);

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>
  
)
