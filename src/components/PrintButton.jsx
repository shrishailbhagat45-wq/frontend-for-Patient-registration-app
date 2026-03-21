export default function PrintButton({ contentRef }) {
  const handlePrint = () => {
    if (!contentRef?.current) {
      alert('Content not ready to print');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Unable to open print window');
      return;
    }
    
    const content = contentRef.current.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Print Prescription</title>
          <style>
            ${styles}
            @media print {
              .no-print { display: none !important; }
              .navBar { display: none !important; }
              body { margin: 0; padding: 10mm; }
              .print-container { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div>
      <div className="no-print">
        <button
          onClick={handlePrint}
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
        >
          Print
        </button>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            /* Hide elements */
            .no-print {
              display: none !important;
            }
            .navBar {
              display: none !important;
            }
            
            /* Preserve colors and formatting */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            
            /* Container adjustments */
            .print-container {
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
}
