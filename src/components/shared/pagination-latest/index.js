import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="flex justify-center mt-5">
      {/* Previous Button */}
      <button
        onClick={() => paginate(currentPage - 1)}
        className={`px-4 py-2 mr-2 rounded-full text-white flex items-center justify-center ${
          currentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#7ECA9D] hover:bg-[#6AB38B]"
        } shadow-lg transition duration-300 transform hover:scale-105`}
        disabled={currentPage === 1}
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {[...Array(totalPages).keys()].map((pageNumber) => {
          const isActive = currentPage === pageNumber + 1;
          return (
            <button
              key={pageNumber + 1}
              onClick={() => paginate(pageNumber + 1)}
              className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-300 transform ${
                isActive
                  ? "bg-gradient-to-r from-[#7ECA9D] to-[#6AB38B] text-white shadow-xl scale-100"
                  : "bg-gray-100 text-gray-800 hover:bg-[#7ECA9D] hover:text-white"
              }`}
            >
              {pageNumber + 1}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => paginate(currentPage + 1)}
        className={`px-4 py-2 ml-2 rounded-full text-white flex items-center justify-center ${
          currentPage === totalPages
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#7ECA9D] hover:bg-[#6AB38B]"
        } shadow-lg transition duration-300 transform hover:scale-105`}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default PaginationComponent;
