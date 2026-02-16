import React from 'react'

export default function PrintButton() {
    const handlePrint = () => {
    window.print();
  };
  return (
    <div>
         {/* Print Button */}
              <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handlePrint}
                 className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                >
                  Print
                </button>
              </div>              {/* Hide print button when printing */}
      <style>
        {`
          @media print {
            /* Hide elements */
            .no-print {
              display: none !important;
            }
            .navBar{
              display: none !important;
            }
            
            /* Preserve colors */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Page setup */
            @page {
              size: A4 portrait;
              margin: 5mm 5mm;
            }
            
            body {
              margin: 0;
              padding: 0;
              background: white !important;
            }
            
            /* Container adjustments */
            .print-container {
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
            
            /* Main prescription card */
            .bg-white {
              box-shadow: none !important;
              border-radius: 0 !important;
              max-width: 100% !important;
              margin: 0 !important;
            }
            
            /* Header - compact */
            .bg-gradient-to-r.from-blue-600 {
              padding: 12px 16px !important;
            }
            
            /* All sections - reduced padding */
            .p-8 {
              padding: 16px !important;
            }
            
            .p-6 {
              padding: 12px !important;
            }
            
            .p-4 {
              padding: 8px !important;
            }
            
            .px-8 {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }
            
            .pt-8 {
              padding-top: 12px !important;
            }
            
            .pb-12 {
              padding-bottom: 0 !important;
            }
            
            .pt-24 {
              padding-top: 0 !important;
            }
            
            /* Gaps and margins */
            .gap-6 {
              gap: 16px !important;
            }
            
            .gap-4 {
              gap: 12px !important;
            }
            
            .gap-3 {
              gap: 8px !important;
            }
            
            .mb-6 {
              margin-bottom: 12px !important;
            }
            
            .mb-4 {
              margin-bottom: 10px !important;
            }
            
            .mt-6 {
              margin-top: 12px !important;
            }
            
            /* Typography adjustments */
            h1 {
              font-size: 22px !important;
            }
            
            h2 {
              font-size: 20px !important;
            }
            
            .text-5xl {
              font-size: 36px !important;
            }
            
            .text-4xl {
              font-size: 32px !important;
            }
            
            .text-2xl {
              font-size: 18px !important;
            }
            
            .text-xl {
              font-size: 18px !important;
            }
            
            .text-lg {
              font-size: 15px !important;
            }
            
            .text-base {
              font-size: 13px !important;
            }
            
            .text-sm {
              font-size: 12px !important;
            }
            
            .text-xs {
              font-size: 10px !important;
            }
            
            /* Table styling */
            table {
              font-size: 12px !important;
            }
            
            th, td {
              padding: 8px !important;
            }
            
            /* Prevent page breaks */
            .print-container,
            .bg-white,
            .rounded-xl,
            table,
            .bg-yellow-50 {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            /* Icons */
            svg {
              max-width: 32px !important;
              max-height: 32px !important;
            }
            
            /* Signature area */
            .border-b-2.border-gray-400 {
              height: 40px !important;
              width: 120px !important;
            }
          }
        `}
      </style>
      
    </div>
  )
}
