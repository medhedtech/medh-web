"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ItemDashboard = ({ item }) => {
  const currentPath = usePathname();
  const { name, path, icon, tag, subItems, onClick } = item;
  const isActive = currentPath === path;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      router.push(path);
    }
  };

  return (
    <li
      className={`py-3 border-b border-borderColor dark:border-borderColor-dark ${
        tag ? "flex justify-between items-center " : ""
      }`}
    >
      <div className="flex font-Open items-center w-full">
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
            <div
              onClick={() => {
                handleItemClick();
                toggleDropdown();
              }}
              className="leading-1.8 flex gap-3 text-contentColor pl-10 cursor-pointer"
            >
              {icon} {name}
            </div>
          )}
        </div>

        {/* Right-aligned Icons */}
        <div className="flex items-center space-x-2 pr-2">
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
            <span className="text-xs font-medium text-whiteColor px-2 bg-primaryColor leading-tight rounded-2xl">
              {tag}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {subItems && isDropdownOpen && (
        <ul className="pl-16 mt-2 font-Open space-y-1">
          {" "}
          {/* Increase padding for indentation */}
          {subItems.map((subItem, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Link
                href={subItem.path}
                className={`${
                  currentPath === subItem.path
                    ? "bg-primaryColor text-white rounded-r-lg px-4 py-2 shadow-md"
                    : "text-contentColor dark:text-contentColor-dark"
                } block w-full  items-center`}
              >
                {/* Render sub-item icons and text with a little offset */}
                <div className="flex">
                  <span className="mr-2 mt-1">{subItem.icon}</span>
                  <span className="whitespace-nowrap">{subItem.name}</span>{" "}
                </div>
                {/* Prevent wrapping */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default ItemDashboard;
