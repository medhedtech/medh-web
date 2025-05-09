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
import { motion, AnimatePresence } from "framer-motion";

const HeadingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const notificationItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

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
              // Simulate notifications
              const mockNotifications = [
                { id: 1, title: "New Course Available", message: "Check out our new React Advanced course!", time: "Just now", unread: true },
                { id: 2, title: "Assignment Due", message: "Your JavaScript assignment is due tomorrow", time: "2 hours ago", unread: true },
                { id: 3, title: "Achievement Unlocked", message: "You've completed 5 courses!", time: "Yesterday", unread: false }
              ];
              setNotifications(mockNotifications);
              setUnreadCount(mockNotifications.filter(n => n.unread).length);
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
    // Add animation before logout
    setIsDropdownOpen(false);
    setTimeout(() => {
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }, 300);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search Section */}
          <div className="flex-1 max-w-lg">
            <motion.div 
              className="relative"
              animate={{ scale: isSearchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
              ref={searchRef}
            >
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
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700"
                  >
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          No new notifications
                        </div>
                      ) : (
                        <AnimatePresence>
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              variants={notificationItemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                                notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {notification.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <motion.div 
                  className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary hover:ring-4 transition-all duration-200"
                  whileHover={{ rotate: 5 }}
                >
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <FaSpinner className="text-primary" />
                      </motion.div>
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
                </motion.div>
                <span className="hidden md:block text-sm font-medium dark:text-white">
                  {userData?.full_name?.split(' ')[0] || 'Loading...'}
                </span>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700"
                  >
                    <Link
                      href={`/dashboards/${userData?.role[0]}-profile`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <FaUserCircle className="mr-3" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <FaCog className="mr-3" />
                      Settings
                    </Link>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeadingDashboard;
