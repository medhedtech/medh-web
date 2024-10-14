"use client";

import ButtonPagination from "../buttons/ButtonPagination";

const Pagination = ({ pages, handlePagesnation, currentPage }) => {
  const pageNumbers = Array.from({ length: pages }, (_, idx) => idx + 1);

  return (
    <div>
      <ul className="flex items-center justify-center gap-15px mt-60px mb-30px">
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
            <ButtonPagination
              idx={page}
              id={page}
              handlePagesnation={() => handlePagesnation(page)}
              currentPage={currentPage}
            />
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
