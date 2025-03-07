import Link from "next/link";
import React from "react";

const DropdownItems = ({ list, onItemClick }) => {
  const { items } = list;
  return (
    <ul className="flex flex-col">
      {items?.map((item, idx) => (
        <li key={idx} className="group">
          <Link
            href={item.path}
            onClick={onItemClick}
            className="flex items-center px-4 py-2 text-sm text-contentColor dark:text-contentColor-dark hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-md transition-colors duration-200"
          >
            {item.icon && (
              <span className="mr-2 text-primary-500 dark:text-primary-400">
                {item.icon}
              </span>
            )}
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                {item.badge}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DropdownItems;
