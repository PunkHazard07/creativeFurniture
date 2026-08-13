const PaginationControls = ({ page, totalPages, onPaginate }) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="text-sm text-gray-500">
      Showing {page} of {totalPages} pages
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onPaginate('prev')}
        disabled={page === 1}
        className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
          page === 1
            ? 'text-gray-400 bg-gray-100'
            : 'text-gray-700 bg-white hover:bg-gray-50'
        }`}
      >
        Previous
      </button>
      <button
        onClick={() => onPaginate('next')}
        disabled={page >= totalPages}
        className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
          page >= totalPages
            ? 'text-gray-400 bg-gray-100'
            : 'text-gray-700 bg-white hover:bg-gray-50'
        }`}
      >
        Next
      </button>
    </div>
  </div>
);

export default PaginationControls;