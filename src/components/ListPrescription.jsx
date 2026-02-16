import React from 'react'
import { Link } from 'react-router'

export default function ListPrescription({prescription, idx}) {
  // Format date
  const formattedDate = new Date(prescription.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const drugCount = prescription.drug?.length || 0;
  const displayDrugs = prescription.drug?.slice(0, 3) || [];
  const remainingCount = drugCount - 3;
  return (
    <div
      key={idx}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 w-full max-w-sm h-[480px] flex flex-col"
    >      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex-shrink-0">
        <div className="flex items-center justify-between text-white">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-lg font-bold tracking-wide truncate">
              {prescription.patientName?.toUpperCase()}
            </h3>
            <p className="text-blue-100 text-xs flex items-center gap-1.5 mt-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{formattedDate}</span>
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Medications Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-gray-800 truncate">
                Medications
              </h4>
            </div>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold flex-shrink-0">
              {drugCount}
            </span>
          </div>

          <div className="space-y-2">
            {displayDrugs.map((drug, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-gray-200 hover:border-blue-200"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-semibold text-gray-900 text-xs truncate">
                    {drug.name}
                    {drug.strength && <span className="text-gray-600 ml-1">{drug.strength}</span>}
                  </p>
                  {drug.remarks && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{drug.remarks}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-center px-1.5">
                    <p className="text-xs text-gray-500 font-medium">Qty</p>
                    <p className="text-xs font-bold text-gray-800">{drug.quantity}</p>
                  </div>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="text-center px-1.5">
                    <p className="text-xs text-gray-500 font-medium">Freq</p>
                    <p className="text-xs font-bold text-blue-600">{drug.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {remainingCount > 0 && (
              <div className="text-center py-1.5 px-2.5 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-600">
                  +{remainingCount} more
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis/Remarks Preview */}
        {prescription.remarks && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Diagnosis</p>
                <p className="text-xs text-gray-700 line-clamp-2">{prescription.remarks}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0 flex-shrink-0">
        <Link to={`/prescription/${prescription._id}`}>
          <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group text-sm">
            <span className="truncate">View Full Prescription</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  )
}
