"use client";
import { BellIcon, SearchIcon } from "@/assets/images/icon/SearchIcon";
import Image from "next/image";
import { useEffect, useState } from "react";
import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
import Link from "next/link";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

interface UserData {
  user_image?: string;
  full_name?: string;
  role?: string[];
}

const HeadingDashboardOnly: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const { getQuery, loading } = useGetQuery();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getQuery({
        url: `${apiUrls?.user?.getDetailsbyId}/${userId}`,
        onSuccess: (data) => {
          setUserData(data?.data);
        },
        onFail: (error) => {
          console.error("Failed to fetch user details:", error);
        },
      });
    }
  }, [userId, getQuery]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const formatRole = (role: string) => {
    return role.replace("-", " ").split(" ").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <div className="sticky top-0 z-50">
      <div
        className="flex my-4 justify-between items-center p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-gray-700 backdrop-blur-sm bg-opacity-90"
        style={{
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Search Bar with Animation */}
        <div className="relative flex-grow max-w-[60%] group">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white transition-all duration-300 group-hover:text-primaryColor" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 py-3.5 text-sm rounded-xl border border-transparent focus:outline-none bg-[#F7F7F7] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-primaryColor hover:bg-[#F0F0F0] dark:hover:bg-gray-600 transition-all duration-300"
            aria-label="Search"
          />
        </div>

        {/* Notification and User Section */}
        <div className="flex items-center gap-6">
          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Notifications"
            >
              <BellIcon className="w-6 h-6 text-gray-500 hover:text-primaryColor dark:text-gray-300 transition-all duration-300" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="border-l-2 border-gray-200 dark:border-gray-600 h-8" />

          {/* User Profile Section */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-2 transition-all duration-300"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="relative">
                <Image
                  src={userData?.user_image || teacherImage1}
                  alt={userData?.full_name || "User Avatar"}
                  width={45}
                  height={45}
                  className="rounded-full object-cover ring-2 ring-primaryColor transition-all duration-300 hover:ring-4"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"></span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold dark:text-white">
                  {userData?.full_name || "Loading..."}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userData?.role?.[0] ? formatRole(userData.role[0]) : "User"}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-100 dark:border-gray-700">
                <Link
                  href={`/dashboards/${
                    userData?.role?.[0] === "coorporate-student"
                      ? "coorporate-employee-profile"
                      : `${userData?.role?.[0]}-profile`
                  }`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Your Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {/* Add logout logic */}}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadingDashboardOnly; 