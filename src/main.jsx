import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import RootLayout from "./RootLayout.jsx";
import PatientInfo from "./pages/PatientInfo.jsx";
import EditPatientProfile from "./pages/EditPatientProfile.jsx";
import DetailPrescription from "./pages/DetailPrescription.jsx";
import PrintPrescription from "./pages/PrintPrescription.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import BillingDashBoard from "./pages/BillingDashBoard.jsx";
import Billing from "./pages/Billing.jsx";
import ManagementDashboard from "./pages/ManagementDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Create from "./pages/Create.jsx";
import CreateClinic from "./pages/CreateClinic.jsx";
import Invoice from "./pages/Invoice.jsx";
import InsightsDashboard from "./pages/InsightsDashboard.jsx";
import RequireAuth from "./RequireAuth.jsx";

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <RootLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/createClinic", element: <CreateClinic /> },
  {
    element: <RequireAuth />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/patient/:id", element: <PatientInfo /> },
      { path: "/patient-profile/:id", element: <EditPatientProfile /> },
      {
        path: "/prescription/:prescriptionId",
        element: <DetailPrescription />,
      },
      { path: "/print-prescription", element: <PrintPrescription /> },
      { path: "/billing-dashboard", element: <BillingDashBoard /> },
      { path: "/Insights-Dashboard", element: <InsightsDashboard /> },
      { path: "/billing/:patientId", element: <Billing /> },
      { path: "/management-dashboard", element: <ManagementDashboard /> },
      { path: "/profile", element: <Profile /> },
      { path: "/invoice/:patientId/:invoiceId?", element: <Invoice /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer />
  </QueryClientProvider>,
);
