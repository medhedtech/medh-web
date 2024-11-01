"use client";
import {
  BellIcon,
  GreenSearch,
  SearchIcon,
  SettingIcon,
} from "@/assets/images/icon/SearchIcon";
import Link from "next/link";
import { useState } from "react";

const HeadingDashboard = ({ userName = "Manik", children, path }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full py-4 ">
      {isFocused ? (
        // Focused layout
        <div className="flex flex-col gap-4 w-full px-4 ">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFocused(false)}
              className="text-blue-500 text-xl"
            >
              <div>
                <svg
                  width="32"
                  height="24"
                  viewBox="0 0 32 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M31.2623 11.9996C31.2623 12.8868 30.5357 13.6134 29.6485 13.6134H6.08742L13.3888 20.9559C14.0351 21.6022 14.0351 22.6109 13.3888 23.2552C13.1068 23.5392 12.7033 23.6998 12.2587 23.6998C11.8552 23.6998 11.4126 23.5392 11.1306 23.2161L1.08334 13.1296C0.439017 12.4833 0.439017 11.4747 1.08334 10.8695L11.1306 0.783045C11.7749 0.138725 12.7836 0.138725 13.4299 0.783045C14.0743 1.42938 14.0743 2.43803 13.4299 3.08235L6.08742 10.3857H29.6485C30.5357 10.3857 31.2623 11.1124 31.2623 11.9996Z"
                    fill="#202244"
                  />
                </svg>
              </div>
            </button>
            <h2 className="text-2xl font-Open  text-blackColor dark:text-white">
              Search
            </h2>
          </div>
          <div className="flex items-center bg-white border dark:bg-inherit border-gray-300 rounded-full shadow-md px-4 py-4 w-full">
            <SearchIcon className="text-gray-400  mr-2" />
            <input
              type="text"
              className="w-full border-none outline-none text-xl dark:bg-inherit dark:text-white"
              placeholder="Search anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => setIsFocused(false)}
            />
            <div className="ml-auto  rounded-full">
              <GreenSearch className="text-white" />
            </div>
          </div>
        </div>
      ) : (
        // Default layout when not focused
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex flex-col w-full md:w-80">
            <h2 className="text-xl md:text-2xl font-Open text-blackColor dark:text-white">
              Good Morning, {userName}
            </h2>
            <h4 className="text-sm md:text-md text-gray-500">
              What do you want to learn today?
            </h4>
          </div>
          <div className="flex flex-col md:flex-row justify-between w-full gap-4 md:items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-[70%] lg:w-[60%] xl:w-[85%]">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="px-10 py-2 rounded-full w-full shadow-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
                placeholder="Search anything"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
              />
              <GreenSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <BellIcon className="text-gray-500 hover:text-blackColor dark:text-gray-300 dark:hover:text-white cursor-pointer" />
              <SettingIcon className="text-gray-500 hover:text-blackColor dark:text-gray-300 dark:hover:text-white cursor-pointer" />
              {/* User Profile Image */}
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                {/* Placeholder for user's profile image */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadingDashboard;
