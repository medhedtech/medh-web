// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const ItemDashboard = ({ item }) => {
//   const currentPath = usePathname();

//   const { name, path, icon, tag } = item;
//   const isActive = currentPath === path ? true : false;
//   return (
//     <li
//       className={`py-3 border-b border-borderColor dark:border-borderColor-dark ${
//         tag ? "flex justify-between items-center " : ""
//       }`}
//     >
//       <Link
//         href={path}
//         className={`${
//           isActive
//             ? "bg-primaryColor text-white py-4 rounded-r-5"
//             : "text-contentColor dark:text-contentColor-dark "
//         }   leading-1.8 flex gap-3 text-nowrap justify-start pl-10`}
//       >
//         {icon} {name}
//       </Link>
//       {tag ? (
//         <span className="text-size-10 font-medium text-whiteColor px-9px bg-primaryColor leading-14px rounded-2xl">
//           12
//         </span>
//       ) : (
//         ""
//       )}
//     </li>
//   );
// };

// export default ItemDashboard;
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ItemDashboard = ({ item }) => {
  const currentPath = usePathname();
  const { name, path, icon, tag, subItems } = item;
  const isActive = currentPath === path;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <li
      className={`py-3 border-b border-borderColor dark:border-borderColor-dark ${
        tag ? "flex justify-between items-center " : ""
      }`}
    >
      <div className="flex items-center w-full">
        {/* Main Link Content */}
        <div className="flex-grow">
          {path ? (
            <Link
              href={path}
              className={`${
                isActive
                  ? "bg-primaryColor text-white py-4 px-4 rounded-r-lg shadow-md"
                  : "text-contentColor dark:text-contentColor-dark"
              } leading-1.8 flex gap-3 text-nowrap pl-10`}
            >
              {icon} {name}
            </Link>
          ) : (
            <div className="leading-1.8 flex gap-3 text-contentColor pl-10 ">
              {icon} {name} {/* Render as heading if no path */}
            </div>
          )}
        </div>

        {/* Right-aligned Icons */}
        <div className="flex items-center space-x-2 pr-4">
          {subItems && (
            <button
              onClick={toggleDropdown}
              className="text-contentColor dark:text-contentColor-dark"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className={`transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 011.414 0L8 9.586l4.94-4.94a.5.5 0 11.707.708l-5.5 5.5a.5.5 0 01-.708 0l-5.5-5.5a.5.5 0 010-.707z"
                />
              </svg>
            </button>
          )}
          {tag && (
            <span className="text-size-10 font-medium text-whiteColor px-2 bg-primaryColor leading-14px rounded-2xl">
              {tag}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {subItems && isDropdownOpen && (
        <ul className="pl-10 mt-2 space-y-1">
          {subItems.map((subItem, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Link
                href={subItem.path}
                className={`${
                  currentPath === subItem.path
                    ? "bg-primaryColor text-white rounded-r-lg px-4 py-2 shadow-md"
                    : "text-contentColor dark:text-contentColor-dark"
                } block w-full flex items-center`}
              >
                {subItem.icon && (
                  <span className="mr-2">
                    {subItem.icon}
                  </span>
                )}
                {subItem.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default ItemDashboard;
