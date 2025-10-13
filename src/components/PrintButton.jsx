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
              </div>

              {/* Hide print button when printing */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            .navBar{
              display: none !important;
              }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container {
                page-break-inside: avoid;  /* prevent splitting */
                page-break-before: avoid;
                page-break-after: avoid;
            }
            @page {
                    size: A5 portrait; 
                    margin: 0;     
                }
            body {
                margin: 0;
                padding: 0;
            }
          }
        `}
      </style>
      
    </div>
  )
}
