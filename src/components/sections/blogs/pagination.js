const Pagination = ({ currentPage, totalPages, handlePagesnation }) => {
    const getPages = () => {
      let pages = [];
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages = [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage > totalPages - 3) {
          pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
          pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
      }
      return pages;
    };
  
    return (
      <div className="flex  justify-end space-x-2 mt-6">
        {/* Previous Button */}
        {currentPage > 0 && (
          <button
            onClick={() => handlePagesnation("prev")}
            className="px-4 py-2 bg-white text-gray-600 rounded-md shadow hover:bg-gray-200"
          >
            &laquo;
          </button>
        )}
  
        {/* Page Numbers */}
        {getPages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-4 py-2 bg-white text-gray-600 rounded-md shadow">...</span>
            ) : (
              <button
                onClick={() => handlePagesnation(page - 1)}
                className={`px-4 py-2 rounded-md shadow ${
                  page - 1 === currentPage
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
  
        {/* Next Button */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => handlePagesnation("next")}
            className="px-4 py-2 bg-white text-gray-600 rounded-md shadow hover:bg-gray-200"
          >
            &raquo;
          </button>
        )}
      </div>
    );
  };
  
  export default Pagination;
  