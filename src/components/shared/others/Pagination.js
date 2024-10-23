"use client";

import ButtonPagination from "../buttons/ButtonPagination";

const Pagination = ({ pages, handlePagesnation, currentPage }) => {
  const pageNumbers = Array.from({ length: pages }, (_, idx) => idx + 1);

  return (
    <div className="flex justify-between space-x-4 text-[#5C6574]">
      <span className="mt-1">{`Page ${currentPage} of ${pages}`}</span>
      <ul className="flex items-center space-x-3">
        <li>
          <ButtonPagination
            type={"prev"}
            handlePagesnation={() =>
              currentPage > 1 && handlePagesnation(currentPage - 1)
            }
            idx={"prev"}
          />
        </li>
        {pageNumbers.map((page) => (
          <li key={page}>
            {page === 1 ||
            page === pages ||
            (page >= currentPage - 1 && page <= currentPage + 1) ? (
              <ButtonPagination
                idx={page}
                id={page}
                handlePagesnation={() => handlePagesnation(page)}
                currentPage={currentPage}
              />
            ) : (
              page === currentPage && (
                <span className="text-[#5C6574]">...</span>
              )
            )}
          </li>
        ))}
        <li>
          <ButtonPagination
            type={"next"}
            handlePagesnation={() =>
              currentPage < pages && handlePagesnation(currentPage + 1)
            }
            idx={"next"}
          />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
