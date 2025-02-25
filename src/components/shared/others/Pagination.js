"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ pages, handlePagesnation, currentPage }) => {
  // Don't render pagination if there's only one page
  if (pages <= 1) return null;

  // Function to determine which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(pages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('ellipsis-start');
    } else if (startPage === 2) {
      pageNumbers.push(2);
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== pages) {
        pageNumbers.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (endPage < pages - 1) {
      pageNumbers.push('ellipsis-end');
    } else if (endPage === pages - 1) {
      pageNumbers.push(pages - 1);
    }
    
    // Always show last page if more than one page
    if (pages > 1) {
      pageNumbers.push(pages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Pagination" className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-medium text-gray-900 dark:text-white">{pages}</span>
      </div>
      
      <ul className="flex items-center gap-1">
        {/* Previous button */}
        <li>
          <button
            onClick={() => currentPage > 1 && handlePagesnation(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
              currentPage <= 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
        </li>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <li key={`${page}-${index}`}>
            {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
              <span className="flex items-center justify-center w-9 h-9 text-gray-500 dark:text-gray-400">
                <MoreHorizontal size={18} />
              </span>
            ) : (
              <button
                onClick={() => handlePagesnation(page)}
                className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                  page === currentPage
                    ? "bg-green-600 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {/* Next button */}
        <li>
          <button
            onClick={() => currentPage < pages && handlePagesnation(currentPage + 1)}
            disabled={currentPage >= pages}
            className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
              currentPage >= pages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
