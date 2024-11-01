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

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full py-4 px-0 bg-white border-b-2 border-borderColor dark:bg-gray-800 dark:border-borderColor-dark">
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
            className="px-10 py-2 rounded-full w-full shadow-md border  dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
            placeholder="Search anything"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};

export default HeadingDashboard;
