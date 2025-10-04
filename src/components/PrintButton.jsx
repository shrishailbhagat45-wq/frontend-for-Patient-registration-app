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
                  style={{
                    padding: '8px 16px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
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
