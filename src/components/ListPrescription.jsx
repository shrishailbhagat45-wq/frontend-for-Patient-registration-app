import { Link } from "react-router";

export default function ListPrescription({
  prescription,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  // Format date
  const formattedDate = new Date(prescription.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const drugCount = prescription.drug?.length || 0;
  const displayDrugs = prescription.drug?.slice(0, 3) || [];
  const remainingCount = drugCount - 3;
  const patientName = prescription.patientName || "Patient";

  return (
    <article className="group relative h-full w-full">
      <Link
        to={`/prescription/${prescription._id}`}
        aria-label={`View prescription for ${patientName}, dated ${formattedDate}`}
        className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
      >
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between pr-20 text-white">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold tracking-wide truncate">
                {patientName}
              </h3>
              <p className="text-blue-100 text-xs flex items-center gap-1.5 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="truncate">{formattedDate}</span>
              </p>
            </div>
          </div>
        </div>
        {/* Medications Section */}
        <div className="p-4 flex-1">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5a2 2 0 012-2h2a2 2 0 012 2v2H9V5z"
                    />
                  </svg>
                </div>
                <h4 className="text-xs font-semibold text-slate-700 truncate">
                  Medications
                </h4>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold flex-shrink-0">
                {drugCount}
              </span>
            </div>

            <div className="space-y-2">
              {displayDrugs.map((drug, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-slate-200 hover:border-blue-200"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-slate-900 text-xs truncate">
                      {drug.name}
                      {drug.strength && (
                        <span className="text-slate-600 ml-1">
                          {drug.strength}
                        </span>
                      )}
                    </p>
                    {drug.remarks && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {drug.remarks}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-center px-1.5">
                      <p className="text-xs text-slate-500 font-medium">Qty</p>
                      <p className="text-xs font-bold text-slate-800">
                        {drug.quantity}
                      </p>
                    </div>
                    <div className="h-6 w-px bg-slate-300"></div>
                    <div className="text-center px-1.5">
                      <p className="text-xs text-slate-500 font-medium">Freq</p>
                      <p className="text-xs font-bold text-blue-600">
                        {drug.frequency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {remainingCount > 0 && (
                <div className="text-center py-1.5 px-2.5 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-medium text-blue-600">
                    +{remainingCount} more medication
                    {remainingCount > 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis/Remarks Preview */}
          {prescription.remarks && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 mb-0.5">
                    Diagnosis
                  </p>
                  <p className="text-xs text-slate-700 line-clamp-2">
                    {prescription.remarks}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
      {(onEdit || (onDelete && prescription._id)) && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(prescription)}
              aria-label={`Edit prescription for ${patientName}`}
              title="Edit prescription"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.5 7.125L16.875 4.5M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
          )}
          {onDelete && prescription._id && (
            <button
              type="button"
              onClick={() => onDelete(prescription)}
              disabled={isDeleting}
              aria-label={`Delete prescription for ${patientName}`}
              title="Delete prescription"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-red-500/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 7h12m-10 0V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0l-.7 12.1a1 1 0 01-1 .9H8.7a1 1 0 01-1-.9L7 7m3 3v6m4-6v6"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
