export function getActiveDoctorId() {
  if (localStorage.getItem("role") === "Receptionist") {
    return localStorage.getItem("activeDoctorId");
  }

  return localStorage.getItem("doctorId");
}
