import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function RequireAdmin() {
  const role = localStorage.getItem("role");
  return role === "Admin" ? <Outlet /> : <Navigate to="/home" replace />;
}
