"use client";
import {
  BellIcon,
  GreenSearch,
  SearchIcon,
  SettingIcon,
} from "@/assets/images/icon/SearchIcon";
import Link from "next/link";
import { useState } from "react";

const HeadingDashboard = ({ userName = "Manik" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div className="flex items-center justify-between p-8 w-full">
      {!focused && (
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-blackColor dark:text-white">
            Good Morning, {userName}
          </h2>
          <h4 className="text-sm text-gray-500">
            What do you want to learn today?
          </h4>
        </div>
      )}

      <div
        className={`flex items-center gap-4 ${focused ? "w-full" : "w-[80%]"}`}
      >
        <div className={`relative flex-grow ${focused ? "w-full" : "w-auto"}`}>
          <SearchIcon
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
              focused ? "hidden" : "block"
            }`}
          />
          <input
            type="text"
            className={`pl-10 pr-10 py-2 rounded-full w-full shadow-md border ${
              focused
                ? "border-green-500 text-black font-semibold"
                : "border-gray-200 text-gray-500"
            } dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none`}
            placeholder="Search anything"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <GreenSearch
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              focused ? "text-green-500" : "text-gray-400"
            } cursor-pointer`}
          />
        </div>

        {!focused && (
          <>
            <BellIcon className="text-gray-500 hover:text-blackColor dark:text-gray-300 dark:hover:text-white cursor-pointer" />
            <SettingIcon className="text-gray-500 hover:text-blackColor dark:text-gray-300 dark:hover:text-white cursor-pointer" />
            <Link href="/dashboards/student-profile">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden cursor-pointer">
                {/* Placeholder for user's profile image */}
                <img
                  src="https://via.placeholder.com/32"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HeadingDashboard;
