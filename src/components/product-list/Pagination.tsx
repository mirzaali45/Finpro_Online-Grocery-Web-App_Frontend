interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-sm bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:hover:bg-neutral-800 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`relative px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
            currentPage === pageNumber
              ? "bg-indigo-600 text-white font-medium transform scale-105"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          }`}
        >
          {/* Glow effect for active page */}
          {currentPage === pageNumber && (
            <div className="absolute inset-0 bg-indigo-600 rounded-lg blur opacity-50 -z-10" />
          )}
          {pageNumber}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-sm bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:hover:bg-neutral-800 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
