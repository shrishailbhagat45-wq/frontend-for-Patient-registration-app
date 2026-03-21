import { useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "./Navbar";
import PrintButton from "../components/PrintButton";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../API/user";

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()))
    age--;
  return age;
};

export default function PrescriptionComponent({
  patientData,
  prescriptionData,
}) {
  const navigate = useNavigate();
  const contentRef = useRef();

  const formattedDate = prescriptionData.createdAt
    ? new Date(prescriptionData.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const doctorId =
    prescriptionData.doctorId ||
    patientData.doctorId ||
    localStorage.getItem("doctorId");

  const { data: doctorData = {}, isLoading: isDoctorLoading } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      if (!doctorId) return {};
      const res = await getUserById(doctorId);
      return res?.data || res || {};
    },
    enabled: !!doctorId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const doctorName =
    doctorData?.name ||
    doctorData?.fullName ||
    doctorData?.doctorName ||
    "Unknown Doctor";
  const specialization =
    doctorData?.specialization ||
    doctorData?.speciality ||
    doctorData?.department ||
    "General Physician";
  const qualification =
    doctorData?.qualification ||
    doctorData?.qualifications ||
    doctorData?.degree ||
    "MBBS, MD";

  const clinicName = doctorData?.clinicName || "Pardeshi Clinic";
  const clinicAddress =
    doctorData?.clinicAddress ||
    "Jivaji Mandir, Near, Kolhapur Road, Ichalkaranji, Maharashtra 416115";
  const clinicPhone =
    doctorData?.phone || doctorData?.phoneNumber || "+1 234 567 8900";
  const clinicEmail = doctorData?.email || "info@pardeshclinic.com";

  const vitals = [
    { label: "BP", value: patientData.bloodPressure },
    { label: "PR", value: patientData.pulseRate },
    { label: "BS", value: patientData.bloodSugarLevel },
  ];

  const demographics = [
    {
      label: "Age",
      val: patientData.birthday
        ? `${calculateAge(patientData.birthday)} yrs`
        : "—",
    },
    { label: "Gender", val: patientData.gender || "—" },
    {
      label: "Weight",
      val: patientData.weight ? `${patientData.weight} kg` : "—",
    },
  ];

  const handleGoBack = () => {
    if (patientData._id) navigate(`/patient/${patientData._id}`);
    else navigate(-1);
  };

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm 14mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="bg-slate-100 min-h-screen print:bg-white">
        <div className="no-print">
          <Navbar />
        </div>

        {/* Floating action buttons */}
        <div className="no-print fixed top-20 md:left-72 left-4 z-50">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-sm font-medium rounded-lg px-4 py-2 shadow-sm transition-all"
          >
            <IoArrowBack className="text-slate-400" />
            Back to Patient
          </button>
        </div>
        <div className="no-print fixed top-20 right-4 sm:right-6 z-50">
          <PrintButton contentRef={contentRef} />
        </div>

        {/* ─── Prescription card ─────────────────────────────────── */}
        <div
          className="pt-24 pb-16 px-4 sm:px-6 print:pt-0 print:pb-0 print:px-0"
          ref={contentRef}
        >
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded overflow-hidden relative print:rounded-none print:border-0 print:shadow-none print:max-w-none">

            {/* ── All content sits above watermark ───────────────── */}
            <div className="relative z-10">
              {/* ── HEADER ───────────────────────────────────────── */}
              <div className="bg-[#1e3a5f] px-7 py-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 p-1">
                    <img
                      src="/clinic logo.png"
                      alt=""
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-white text-xl font-semibold tracking-tight leading-none">
                      {clinicName}
                    </h1>
                    <p className="text-[#93afd4] text-[10px] tracking-[0.14em] uppercase mt-1.5">
                      Medical Clinic
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-200 text-[15px] font-medium tracking-tight">
                    {isDoctorLoading ? "…" : `Dr. ${doctorName}`}
                  </p>
                  <p className="text-blue-400 text-[11px] font-medium mt-1">
                    {isDoctorLoading ? "…" : specialization}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {isDoctorLoading ? "…" : qualification}
                  </p>
                </div>
              </div>

              {/* Blue accent stripe */}
              <div className="h-[2px] bg-blue-500" />

              {/* ── Rx META STRIP ────────────────────────────────── */}
              <div className="px-7 py-2.5 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-[20px] text-slate-300 leading-none"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    ℞
                  </span>
                  <span className="text-[9.5px] tracking-[0.15em] uppercase text-slate-400 font-semibold">
                    Prescription
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Issued&nbsp;
                  <span className="text-slate-600 font-medium text-[13px]">
                    {formattedDate}
                  </span>
                </p>
              </div>

              {/* ── PATIENT — name LEFT, demos + vitals RIGHT ─────── */}
              <div className="px-7 py-5 flex items-start gap-8 border-b border-slate-100">
                {/* Left: Patient name */}
                <div className="min-w-[180px]">
                  <p className="text-[9px] tracking-[0.16em] uppercase text-slate-400 font-semibold">
                    Patient
                  </p>
                  <h2 className="text-[24px] font-medium text-slate-900 tracking-tight mt-1 leading-tight">
                    {patientData.name || "—"}
                  </h2>
                </div>

                {/* Vertical divider */}
                <div className="w-px self-stretch bg-slate-100 flex-shrink-0" />

                {/* Right: Demographics + Vitals */}
                <div className="flex-1 flex flex-col gap-3 pt-0.5">
                  <div className="flex gap-8">
                    {demographics.map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">
                          {label}
                        </p>
                        <p className="text-[13px] font-medium text-slate-800 mt-0.5 capitalize">
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {vitals.map(({ label, value }) => (
                      <div
                        key={label}
                        className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5"
                      >
                        <span className="text-[9px] tracking-[0.12em] uppercase text-slate-400 font-bold">
                          {label}
                        </span>
                        <span className="text-[12px] font-semibold text-slate-700">
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── REMARKS (conditional) ────────────────────────── */}
              {prescriptionData.remarks && (
                <div className="px-7 py-3 bg-amber-50/60 border-b border-amber-100">
                  <p className="text-[9px] tracking-[0.14em] uppercase text-amber-600 font-semibold mb-1">
                    Clinical Notes
                  </p>
                  <p className="text-[12px] text-amber-900/80 leading-relaxed">
                    {prescriptionData.remarks}
                  </p>
                </div>
              )}

              {/* ── MEDICATIONS TABLE ─────────────────────────────── */}
              <div className="px-7 py-5 relative">
                {/* ── WATERMARK ──────────────────────────────────────── */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <img
                      src="/clinic logo.png"
                      alt=""
                      className="w-64 h-64 object-contain"
                      style={{ opacity: 0.15 }}
                    />
                  </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th
                        className="text-left text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold pb-2.5"
                        style={{ width: "44%" }}
                      >
                        Medication
                      </th>
                      <th
                        className="text-center text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold pb-2.5"
                        style={{ width: "11%" }}
                      >
                        Qty
                      </th>
                      <th
                        className="text-center text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold pb-2.5"
                        style={{ width: "18%" }}
                      >
                        Frequency
                      </th>
                      <th
                        className="text-left text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold pb-2.5"
                        style={{ width: "27%" }}
                      >
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptionData.drug?.map((drug, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-50 last:border-b-0"
                      >
                        <td className="py-3 pr-4">
                          <p className="text-[13px] font-medium text-slate-900">
                            {drug.name}
                          </p>
                          {drug.strength && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {drug.strength}
                            </p>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-[13px] font-semibold text-slate-700">
                            {drug.quantity}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className="inline-block bg-[#1e3a5f] text-slate-300 text-[10px] font-medium px-2.5 py-0.5 rounded"
                            style={{ letterSpacing: "0.05em" }}
                          >
                            {drug.frequency}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-[11px] text-slate-400">
                            {drug.remarks || "—"}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Padding empty rows */}
                    {Array.from({
                      length: Math.max(
                        0,
                        5 - (prescriptionData.drug?.length || 0),
                      ),
                    }).map((_, i) => (
                      <tr
                        key={`e-${i}`}
                        className="border-b border-slate-50 last:border-b-0"
                      >
                        <td className="py-[18px]" colSpan={4} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── FOOTER ───────────────────────────────────────── */}
              <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-between items-end">
                <div className="text-[10px] text-slate-400 leading-relaxed space-y-0.5">
                  <p>{clinicAddress}</p>
                  <p>
                    {clinicPhone} · {clinicEmail}
                  </p>
                </div>
              </div>
            </div>
            {/* end relative z-10 */}
          </div>
        </div>
      </div>
    </>
  );
}
