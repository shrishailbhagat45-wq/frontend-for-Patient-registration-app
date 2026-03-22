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
  const clinicPhone = doctorData?.phone || doctorData?.phoneNumber || "+91 234 567 8900";
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
          /* ── A5 page setup ── */
          @page {
            size: A5 portrait;
            margin: 0mm;
          }

          /* Force color printing */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box !important;
          }

          /* Hide everything except prescription */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 148mm !important;
            height: 210mm !important;
          }

          .no-print { display: none !important; }

          /* Outer wrapper — flush */
          .rx-print-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }

          /* Card fills the A5 page exactly */
          .rx-card {
            width: 148mm !important;
            max-width: 148mm !important;
            min-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
          }

          /* Header: side-by-side on print regardless of screen size */
          .rx-header {
            background-color: #1e3a5f !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 10px 14px !important;
            border-top: none !important;
          }
          .rx-header-left {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 8px !important;
            border-top: none !important;
            padding-top: 0 !important;
          }
          .rx-header-right {
            text-align: right !important;
            border-top: none !important;
            padding-top: 0 !important;
          }
          .rx-header h1 { font-size: 13px !important; }
          .rx-header p  { font-size: 8px !important; }
          .rx-header img { width: 32px !important; height: 32px !important; }

          /* Stripe */
          .rx-stripe {
            background-color: #3b82f6 !important;
            height: 2px !important;
            display: block !important;
            flex-shrink: 0 !important;
          }

          /* All inner sections: tighter padding for A5 */
          .rx-meta   { padding: 5px 14px !important; }
          .rx-patient{ padding: 8px 14px !important; }
          .rx-remarks-box { padding: 6px 14px !important; background-color: #fffbeb !important; }
          .rx-meds   { padding: 6px 14px !important; flex: 1 !important; }
          .rx-footer {
            padding: 8px 14px !important;
            background-color: #f8fafc !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-end !important;
            flex-shrink: 0 !important;
          }

          /* Typography scale-down for A5 */
          .rx-patient-name { font-size: 16px !important; }
          .rx-label        { font-size: 7px !important; }
          .rx-value        { font-size: 11px !important; }
          .rx-drug-name    { font-size: 11px !important; }
          .rx-drug-str     { font-size: 9px !important; }
          .rx-freq {
            background-color: #1e3a5f !important;
            color: #cbd5e1 !important;
            font-size: 8px !important;
            padding: 2px 4px !important;
          }

          /* Notes column visible on print */
          .rx-notes-col { display: block !important; }

          /* Watermark smaller on A5 */
          .rx-watermark img {
            width: 100px !important;
            height: 100px !important;
          }

          /* Divider */
          .rx-divider { margin: 6px 0 !important; }

          /* Footer text */
          .rx-footer-text { font-size: 8px !important; }
          .rx-sig-text    { font-size: 9px !important; }
        }
      `}</style>

      <div className="bg-slate-100 min-h-screen">
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
          <PrintButton />
        </div>

        {/* ── Page wrapper ── */}
        <div className="rx-print-wrapper pt-20 pb-10 px-2 sm:px-4 md:px-6">

          {/* ── Card ── */}
          <div className="rx-card w-full max-w-3xl mx-auto bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">

            {/* HEADER */}
            <div className="rx-header bg-[#1e3a5f] px-4 py-4 md:px-7 md:py-5 flex-shrink-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                <div className="rx-header-left flex items-center gap-3 min-w-0">
                  <img
                    src="/clinic logo.png"
                    alt=""
                    className="w-10 h-10 md:w-14 md:h-14 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h1 className="text-white text-lg md:text-xl font-semibold tracking-tight leading-tight truncate">
                      {clinicName}
                    </h1>
                    <p className="text-[#93afd4] text-[9px] tracking-[0.14em] uppercase mt-0.5">
                      Medical Clinic
                    </p>
                  </div>
                </div>
                <div className="rx-header-right border-t border-white/10 pt-3 md:border-0 md:pt-0 md:text-right flex-shrink-0">
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
            <div className="rx-stripe h-[2px] bg-blue-500 flex-shrink-0" />

            {/* Rx META */}
            <div className="rx-meta px-4 md:px-7 py-2 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[18px] text-slate-300 leading-none" style={{ fontFamily: "Georgia, serif" }}>℞</span>
                <span className="rx-label text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">Prescription</span>
              </div>
              <p className="rx-label text-[10px] text-slate-400">
                Issued&nbsp;
                <span className="rx-value text-slate-600 font-medium text-[12px] md:text-[13px]">{formattedDate}</span>
              </p>
            </div>

            {/* PATIENT */}
            <div className="rx-patient px-4 md:px-7 py-4 border-b border-slate-100 flex-shrink-0">
              <p className="rx-label text-[9px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Patient</p>
              <h2 className="rx-patient-name text-[20px] md:text-[24px] font-medium text-slate-900 tracking-tight mt-0.5 leading-tight">
                {patientData.name || "—"}
              </h2>
              <div className="rx-divider h-px bg-slate-100 my-3" />
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {demographics.map(({ label, val }) => (
                    <div key={label}>
                      <p className="rx-label text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">{label}</p>
                      <p className="rx-value text-[12px] md:text-[13px] font-medium text-slate-800 mt-0.5 capitalize">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {vitals.map(({ label, value }) => (
                    <div key={label} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5">
                      <span className="rx-label text-[9px] tracking-[0.12em] uppercase text-slate-400 font-bold">{label}</span>
                      <span className="rx-value text-[12px] font-semibold text-slate-700">{value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* REMARKS */}
            {prescriptionData.Diagnosis && (
              <div className="rx-remarks-box px-4 md:px-7 py-3 bg-amber-50 border-b border-amber-100 flex-shrink-0">
                <p className="rx-label text-[9px] tracking-[0.14em] uppercase text-amber-600 font-semibold mb-1">Clinical Notes</p>
                <p className="text-[12px] text-amber-900 leading-relaxed">{prescriptionData.Diagnosis}</p>
              </div>
            )}

            {/* MEDICATIONS */}
            <div className="rx-meds px-4 md:px-7 py-4 relative flex-1">
              {/* Watermark */}
              <div className="rx-watermark absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <img
                  src="/clinic logo.png"
                  alt=""
                  className="w-40 md:w-56 h-40 md:h-56 object-contain"
                  style={{ opacity: 0.1 }}
                />
              </div>

              {/* Column headers */}
              <div className="flex items-center pb-2 border-b border-slate-200" style={{ position: "relative", zIndex: 1 }}>
                <span className="rx-label flex-1 text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">Medication</span>
                <span className="rx-label w-10 text-center text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">Qty</span>
                <span className="rx-label w-16 text-center text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold">Freq</span>
                <span className="rx-notes-col rx-label hidden md:block w-24 text-[9px] tracking-[0.14em] uppercase text-slate-400 font-semibold pl-2">Notes</span>
              </div>

              {/* Drug rows */}
              <div style={{ position: "relative", zIndex: 1 }}>
                {prescriptionData.drug?.map((drug, idx) => (
                  <div key={idx} className="flex items-start py-2.5 border-b border-slate-50 last:border-b-0">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="rx-drug-name text-[13px] font-medium text-slate-900 leading-snug">{drug.name}</p>
                      {drug.strength && (
                        <p className="rx-drug-str text-[11px] text-slate-400 mt-0.5">{drug.strength}</p>
                      )}
                      {drug.remarks && (
                        <p className="md:hidden text-[11px] text-slate-400 italic mt-0.5">{drug.remarks}</p>
                      )}
                    </div>
                    <span className="w-10 text-center text-[13px] font-semibold text-slate-700 pt-0.5 flex-shrink-0">
                      {drug.quantity}
                    </span>
                    <div className="w-16 flex justify-center pt-0.5 flex-shrink-0">
                      <span
                        className="rx-freq inline-flex items-center justify-center bg-[#1e3a5f] text-slate-300 text-[10px] font-medium rounded"
                        style={{ padding: "3px 5px", letterSpacing: "0.04em", minWidth: "46px" }}
                      >
                        {drug.frequency}
                      </span>
                    </div>
                    <span className="rx-notes-col hidden md:block w-24 text-[11px] text-slate-400 pt-0.5 pl-2">
                      {drug.remarks || "—"}
                    </span>
                  </div>
                ))}

                {/* Empty rows */}
                {Array.from({ length: Math.max(0, 7 - (prescriptionData.drug?.length || 0)) }).map((_, i) => (
                  <div key={`e-${i}`} className="py-4 border-b border-slate-50 last:border-b-0" />
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className="rx-footer px-4 md:px-7 py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-0">
                <div className="rx-footer-text text-[10px] text-slate-400 leading-relaxed space-y-0.5">
                  <p>{clinicAddress}</p>
                  <p>{clinicPhone} · {clinicEmail}</p>
                </div>
                <div className="flex-shrink-0">
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}