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
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export default function PrescriptionComponent({ patientData, prescriptionData }) {
  const navigate = useNavigate();
  const contentRef = useRef();

  const formattedDate = prescriptionData.createdAt
    ? new Date(prescriptionData.createdAt).toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
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
    doctorData?.name || doctorData?.fullName || doctorData?.doctorName || "Unknown Doctor";
  const specialization =
    doctorData?.specialization || doctorData?.speciality || doctorData?.department || "General Physician";
  const qualification =
    doctorData?.qualification || doctorData?.qualifications || doctorData?.degree || "MBBS, MD";

  const clinicName = doctorData?.clinicName || "Pardeshi Clinic";
  const clinicAddress =
    doctorData?.clinicAddress || "Jivaji Mandir, Kolhapur Road, Ichalkaranji, Maharashtra 416115";
  const clinicPhone = doctorData?.phone || doctorData?.phoneNumber || "+1 234 567 8900";
  const clinicEmail = doctorData?.email || "info@pardeshclinic.com";

  const vitals = [
    { label: "BP", value: patientData.bloodPressure },
    { label: "PR", value: patientData.pulseRate },
    { label: "BS", value: patientData.bloodSugarLevel },
  ];

  const demographics = [
    { label: "Age", val: patientData.birthday ? `${calculateAge(patientData.birthday)} yrs` : "—" },
    { label: "Gender", val: patientData.gender || "—" },
    { label: "Weight", val: patientData.weight ? `${patientData.weight} kg` : "—" },
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
        <div className="no-print"><Navbar /></div>

        {/* Floating buttons */}
        <div className="no-print fixed top-20 md:left-72 left-3 z-50">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-sm font-medium rounded-lg px-3 py-2 shadow-sm transition-all"
          >
            <IoArrowBack className="text-slate-400 flex-shrink-0" />
            <span className="hidden sm:inline">Back to Patient</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
        <div className="no-print fixed top-20 right-3 sm:right-6 z-50">
          <PrintButton contentRef={contentRef} />
        </div>

        {/* Page wrapper */}
        <div
          className="pt-20 pb-10 px-2 sm:px-4 md:px-6 print:pt-0 print:pb-0 print:px-0"
          ref={contentRef}
        >
          <div className="w-full max-w-3xl mx-auto bg-white border border-slate-200 rounded-lg overflow-hidden print:rounded-none print:border-0 print:max-w-none">

            {/* ── HEADER
                Single column always. Logo row on top, doctor row below.
                On md+ they sit side by side.
            ────────────────────────────────────── */}
            <div className="bg-[#1e3a5f] px-4 py-4 md:px-7 md:py-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">

                {/* Clinic logo + name */}
                <div className="flex items-center gap-3 min-w-0">
                    <img src="/clinic logo.png" alt="" className="w-8 h-8 md:w-24 md:h-24 object-contain" />
                  <div className="min-w-0">
                    <h1 className="text-white text-base md:text-xl font-semibold tracking-tight leading-tight truncate">
                      {clinicName}
                    </h1>
                    <p className="text-[#93afd4] text-[9px] tracking-[0.14em] uppercase mt-0.5">
                      Medical Clinic
                    </p>
                  </div>
                </div>

                {/* Doctor info — below on mobile, right on md+ */}
                <div className="border-t border-white/10 pt-3 md:border-0 md:pt-0 md:text-right flex-shrink-0">
                  <p className="text-slate-200 text-sm md:text-[15px] font-medium">
                    {isDoctorLoading ? "…" : `Dr. ${doctorName}`}
                  </p>
                  <p className="text-blue-400 text-[11px] font-medium mt-0.5">
                    {isDoctorLoading ? "…" : specialization}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {isDoctorLoading ? "…" : qualification}
                  </p>
                </div>
              </div>
            </div>

            {/* Blue stripe */}
            <div className="h-[2px] bg-blue-500" />

            {/* ── Rx META STRIP ────────────────────────────────────── */}
            <div className="px-4 md:px-7 py-2.5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[18px] text-slate-300 leading-none" style={{ fontFamily: "Georgia, serif" }}>℞</span>
                <span className="text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">Prescription</span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                Issued&nbsp;
                <span className="text-slate-600 font-medium text-[11px] md:text-[13px]">{formattedDate}</span>
              </p>
            </div>

            {/* ── PATIENT SECTION
                Mobile:  fully stacked, no side-by-side
                Desktop: name left | divider | demos+vitals right
            ────────────────────────────────────── */}
            <div className="px-4 md:px-7 py-4 border-b border-slate-100">

              {/* Patient name — always full width */}
              <p className="text-[9px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Patient</p>
              <h2 className="text-[20px] md:text-[24px] font-medium text-slate-900 tracking-tight mt-0.5 leading-tight">
                {patientData.name || "—"}
              </h2>

              {/* Divider */}
              <div className="h-px bg-slate-100 my-3" />

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
              {/* Demographics */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
                  {demographics.map(({ label, val }) => (
                    <div key={label}>
                      <p className="text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">{label}</p>
                      <p className="text-[12px] md:text-[13px] font-medium text-slate-800 mt-0.5 capitalize">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Vitals chips */}
                <div className="flex flex-wrap gap-2">
                  {vitals.map(({ label, value }) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5"
                    >
                      <span className="text-[9px] tracking-[0.12em] uppercase text-slate-400 font-bold">{label}</span>
                      <span className="text-[12px] font-semibold text-slate-700">{value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── REMARKS ──────────────────────────────────────────── */}
            {prescriptionData.remarks && (
              <div className="px-4 md:px-7 py-3 bg-amber-50/60 border-b border-amber-100">
                <p className="text-[9px] tracking-[0.14em] uppercase text-amber-600 font-semibold mb-1">
                  Clinical Notes
                </p>
                <p className="text-[12px] text-amber-900/80 leading-relaxed">{prescriptionData.remarks}</p>
              </div>
            )}

            {/* ── MEDICATIONS
                Mobile:  simple stacked rows — NO table
                Desktop: standard 4-column table
            ────────────────────────────────────── */}
            <div className="px-4 md:px-7 py-4 relative">

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <img
                  src="/clinic logo.png"
                  alt=""
                  className="w-36 md:w-56 h-36 md:h-56 object-contain"
                  style={{ opacity: 0.23 }}
                />
              </div>

              {/* Column headers — shared by both layouts */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 relative z-10">
                <span className="text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">Medication</span>
                <div className="flex items-center gap-4 md:gap-8">
                  <span className="text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold w-6 text-center">Qty</span>
                  <span className="text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold w-14 text-center">Freq</span>
                  <span className="hidden md:block text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold w-28">Notes</span>
                </div>
              </div>

              {/* Drug rows */}
              <div className="relative z-10">
                {prescriptionData.drug?.map((drug, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 py-3 border-b border-slate-50 last:border-b-0">
                    {/* Left: name + strength + notes (notes on mobile too) */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-900 leading-snug">{drug.name}</p>
                      {drug.strength && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{drug.strength}</p>
                      )}
                      {/* Notes visible on mobile below name */}
                      {drug.remarks && (
                        <p className="md:hidden text-[11px] text-slate-400 italic mt-0.5">{drug.remarks}</p>
                      )}
                    </div>

                    {/* Right: qty + freq + notes (notes on desktop) */}
                    <div className="flex items-center gap-4 md:gap-8 flex-shrink-0 pt-0.5">
                      <span className="text-[13px] font-semibold text-slate-700 w-6 text-center">
                        {drug.quantity}
                      </span>
                      <span
                        className="inline-flex items-center justify-center bg-[#1e3a5f] text-slate-300 text-[10px] font-medium rounded w-14"
                        style={{ padding: "3px 0", letterSpacing: "0.04em" }}
                      >
                        {drug.frequency}
                      </span>
                      <span className="hidden md:block text-[11px] text-slate-400 w-28">
                        {drug.remarks || "—"}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Empty padding rows — desktop only */}
                {Array.from({ length: Math.max(0, 5 - (prescriptionData.drug?.length || 0)) }).map((_, i) => (
                  <div key={`e-${i}`} className="hidden md:block py-[18px] border-b border-slate-50 last:border-b-0" />
                ))}
              </div>
            </div>

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <div className="px-4 md:px-7 py-3 md:py-4 border-t border-slate-100 bg-slate-50/60">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-0">
                <div className="text-[10px] text-slate-400 leading-relaxed space-y-0.5">
                  <p>{clinicAddress}</p>
                  <p>{clinicPhone} · {clinicEmail}</p>
                </div>
                <div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}