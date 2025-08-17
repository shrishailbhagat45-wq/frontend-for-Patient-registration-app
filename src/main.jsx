import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPatient from './pages/RegisterPatient.jsx'
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {path: '/register', element: <RegisterPatient />},
]);

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>
  
)
