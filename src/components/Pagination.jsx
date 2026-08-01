import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  itemName = 'item',
  onPageChange,
  className = '',
}) {
  console.log('Pagination render:', { currentPage, totalPages, totalCount });
  
  if (totalPages <= 1) {
    console.log('Pagination hidden: totalPages <= 1');
    return null;
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`mt-6 flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        title="Previous page"
        aria-label="Previous page"
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        title="Next page"
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>

      {/* Info */}
      <span className="ml-2 text-xs text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
