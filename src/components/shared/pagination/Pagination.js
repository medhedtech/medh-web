// "use client";
// import { useState } from "react";

// export default function Pagination({ totalPages = 15, currentPage = 1 }) {
//   const [page, setPage] = useState(currentPage);

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   return (
//     <div className="flex justify-between space-x-4 text-[#5C6574] dark:text-gray-300">
//       <span className="mt-1">{`Page ${page} of ${totalPages}`}</span>
//       <ul className="flex items-center space-x-3">
//         {[...Array(totalPages)].map((_, index) =>
//           index + 1 === 1 ||
//           index + 1 === totalPages ||
//           (index + 1 >= page - 1 && index + 1 <= page + 1) ? (
//             <li key={index}>
//               <button
//                 onClick={() => handlePageChange(index + 1)}
//                 className={`${
//                   page === index + 1
//                     ? "text-[#7ECA9D] dark:text-[#F6B335] border-b-2 border-[#7ECA9D] dark:border-[#F6B335] font-bold"
//                     : "text-[#5C6574] dark:text-gray-300 "
//                 } px-3 py-1 transition-colors duration-200`}
//               >
//                 {index + 1}
//               </button>
//             </li>
//           ) : index === page ? (
//             <li key={index}>
//               <span className="text-[#5C6574] ">...</span>
//             </li>
//           ) : null
//         )}
//       </ul>
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function Pagination({
  totalPages = 15,
  currentPage = 1,
  onPageChange,
}) {
  const [page, setPage] = useState(currentPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  return (
    <div className="flex justify-between space-x-4 text-[#5C6574] dark:text-gray-300">
      <span className="mt-1">{`Page ${page} of ${totalPages}`}</span>
      <ul className="flex items-center space-x-3">
        {[...Array(totalPages)].map((_, index) =>
          index + 1 === 1 ||
          index + 1 === totalPages ||
          (index + 1 >= page - 1 && index + 1 <= page + 1) ? (
            <li key={index}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={`${
                  page === index + 1
                    ? "text-[#7ECA9D] dark:text-[#F6B335] border-b-2 border-[#7ECA9D] dark:border-[#F6B335] font-bold"
                    : "text-[#5C6574] dark:text-gray-300 "
                } px-3 py-1 transition-colors duration-200`}
              >
                {index + 1}
              </button>
            </li>
          ) : index === page ? (
            <li key={index}>
              <span className="text-[#5C6574] ">...</span>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
