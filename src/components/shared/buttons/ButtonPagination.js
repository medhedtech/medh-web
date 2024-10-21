"use client";

const ButtonPagination = ({
  id,
  idx,
  type,
  limit,
  skip,
  totalItems,
  handlePagesnation,
  currentPage,
}) => {
  return (
    <button
      onClick={() => handlePagesnation(idx)}
      className={`${
        idx === currentPage
          ? "text-[#5F2DED] border-b-2 border-[#5F2DED] font-bold"
          : "text-[#5C6574]"
      } px-3 py-1 transition-colors duration-200`}
      disabled={
        type === "prev" && !skip
          ? true
          : type === "next" && skip + limit >= totalItems
          ? true
          : false
      }
    >
      {type === "prev" ? (
        <i className="icofont-double-left"></i>
      ) : type === "next" ? (
        <i className="icofont-double-right"></i>
      ) : (
        id
      )}
    </button>
  );
};

export default ButtonPagination;
