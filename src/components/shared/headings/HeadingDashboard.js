"use client";
import { BellIcon, SearchIcon } from "@/assets/images/icon/SearchIcon";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
import Link from "next/link";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { toast } from "react-toastify";
import { FaSpinner, FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";

const HeadingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          await getQuery({
            url: `${apiUrls?.user?.getDetailsbyId}/${userId}`,
            onSuccess: (data) => {
              setUserData(data?.data);
            },
            onFail: (error) => {
              console.error("Failed to fetch user details:", error);
              toast.error("Failed to load user profile");
            },
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("An error occurred while loading user data");
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Add your search logic here
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem("userId");
    // Redirect to login page or handle logout
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search Section */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className={`h-5 w-5 ${isSearchFocused ? 'text-primary' : 'text-gray-400'} transition-colors duration-200`} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-primary bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700">
                  <div className="px-4 py-2 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {/* Add notification content here */}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary hover:ring-4 transition-all duration-200">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <FaSpinner className="animate-spin text-primary" />
                    </div>
                  ) : (
                    <Image
                      src={userData?.user_image || teacherImage1}
                      alt="User Avatar"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium dark:text-white">
                  {userData?.full_name || 'Loading...'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700">
                  <Link
                    href={`/dashboards/${userData?.role[0]}-profile`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaUserCircle className="mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaCog className="mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadingDashboard;
