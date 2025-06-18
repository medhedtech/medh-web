"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import RecordedCard from "@/components/shared/dashboards/RecordedCourses";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { 
  Video, Search, AlertCircle, Filter, Calendar, Clock, ChevronDown, 
  Layers, BookOpen, SortAsc, SortDesc, RefreshCw, Check, X
} from "lucide-react";

const StudentRecordedSessions = () => {
  const router = useRouter();
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { getQuery } = useGetQuery();
  
  // New state variables for enhanced filtering
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest", "oldest", "a-z", "z-a"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Format date for displaying
  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchRecordedSessions = async () => {
      setIsLoading(true);
      setError(null);
      
      if (typeof window !== "undefined") {
        const storedUserId = localStorage.getItem("userId");
        const token = getAuthToken();
        
        if (!storedUserId || !token) {
          setError("Please log in to view your recorded sessions.");
          setIsLoading(false);
          return;
        }
        
        setStudentId(storedUserId);
        
        try {
          const headers = {
            'x-access-token': token,
            'Content-Type': 'application/json'
          };
          
          // Use the correct API endpoint to fetch recorded videos
          await getQuery({
            url: apiUrls?.courses?.getRecordedVideosForUser(storedUserId),
            headers,
            requireAuth: true,
            onSuccess: (response) => {
              const recordedData = response?.courses || response?.data?.courses || response;
              
              if (Array.isArray(recordedData)) {
                // Add date property if missing
                const processedData = recordedData.map(session => ({
                  ...session,
                  date: session.date || session.created_at || new Date().toISOString(),
                  category: session.category || session.course_tag || "General"
                }));
                
                setRecordedSessions(processedData);
                setFilteredSessions(processedData);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(processedData.map(session => 
                  session.category || session.course_tag || "General"
                ))];
                setCategories(["all", ...uniqueCategories]);
              } else {
                console.warn("Unexpected response format:", response);
                setRecordedSessions([]);
                setFilteredSessions([]);
              }
              
              setIsLoading(false);
            },
            onFail: (error) => {
              console.error("Error fetching recorded sessions:", error);
              
              if (error?.response?.status === 401) {
                setError("Your session has expired. Please log in again.");
                showToast.error("Your session has expired. Please log in again.");
              } else if (error?.response?.status === 404) {
                setRecordedSessions([]);
                setFilteredSessions([]);
              } else {
                setError("Failed to load recorded sessions. Please try again later.");
                showToast.error("Failed to load recorded sessions. Please try again later.");
              }
              
              setIsLoading(false);
            }
          });
        } catch (error) {
          console.error("Error in fetchRecordedSessions:", error);
          setError("An unexpected error occurred. Please try again later.");
          showToast.error("An unexpected error occurred. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchRecordedSessions();
  }, []);

  // Apply filtering and sorting whenever relevant state changes
  useEffect(() => {
    if (recordedSessions.length === 0) return;
    
    let filtered = [...recordedSessions];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course?.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(course => 
        (course.category || course.course_tag) === categoryFilter
      );
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "a-z":
        filtered.sort((a, b) => a.course_title.localeCompare(b.course_title));
        break;
      case "z-a":
        filtered.sort((a, b) => b.course_title.localeCompare(a.course_title));
        break;
      default:
        break;
    }
    
    setFilteredSessions(filtered);
  }, [recordedSessions, searchTerm, categoryFilter, sortOrder]);

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Wait for animation
    setTimeout(async () => {
      const storedUserId = localStorage.getItem("userId");
      const token = getAuthToken();
      
      if (!storedUserId || !token) {
        showToast.error("Authentication required. Please log in again.");
        setIsRefreshing(false);
        return;
      }
      
      try {
        await getQuery({
          url: apiUrls?.courses?.getRecordedVideosForUser(storedUserId),
          requireAuth: true,
          onSuccess: (response) => {
            const recordedData = response?.courses || response?.data?.courses || response;
            
            if (Array.isArray(recordedData)) {
              // Add date property if missing
              const processedData = recordedData.map(session => ({
                ...session,
                date: session.date || session.created_at || new Date().toISOString(),
                category: session.category || session.course_tag || "General"
              }));
              
              setRecordedSessions(processedData);
              
              showToast.success("Recorded sessions refreshed successfully");
            } else {
              showToast.warning("No recorded sessions found");
            }
          },
          onFail: (error) => {
            showToast.error("Failed to refresh sessions. Please try again.");
          }
        });
      } catch (error) {
        showToast.error("An error occurred. Please try again.");
      } finally {
        setIsRefreshing(false);
      }
    }, 600);
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="container mx-auto p-8 mt-[-40px]">
      {/* Header row with title and back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div
          onClick={() => {
            router.push("/dashboards/student");
          }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <FaArrowLeft
            className="text-gray-700 dark:text-white"
            size={20}
          />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <Video className="w-5 h-5 text-primary-500 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Recorded Sessions
            </h2>
          </div>
        </div>
        
        {/* Action buttons and search */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${
              isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Filter and sorting options */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="mb-6 overflow-hidden"
      >
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Category filter */}
            <div className="w-full md:w-auto">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-500" />
                <span>Category</span>
              </div>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full md:w-48 appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== "all").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Sort by */}
            <div className="w-full md:w-auto">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-primary-500" />
                <span>Sort By</span>
              </div>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full md:w-48 appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                >
                  <option value="newest">Date (Newest First)</option>
                  <option value="oldest">Date (Oldest First)</option>
                  <option value="a-z">Title (A-Z)</option>
                  <option value="z-a">Title (Z-A)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Reset filters button */}
            <div className="flex-grow flex justify-end items-end h-full mt-4 md:mt-6">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setSortOrder("newest");
                }}
                className="px-4 py-2 text-sm border border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Results summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredSessions.length > 0 ? (
            <>
              Showing <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredSessions.length}</span> {filteredSessions.length === 1 ? 'session' : 'sessions'}
              {categoryFilter !== 'all' && <> in <span className="font-semibold text-primary-600 dark:text-primary-400">{categoryFilter}</span></>}
              {searchTerm && <> matching "<span className="font-semibold text-primary-600 dark:text-primary-400">{searchTerm}</span>"</>}
            </>
          ) : (
            <>No sessions found</>
          )}
        </div>
      </div>
      
      {error ? (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load your recorded sessions. Please try refreshing the page or logging in again.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : filteredSessions.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredSessions.map((course, index) => (
            <motion.div
              key={course?._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <RecordedCard
                course_title={course?.course_title}
                course_tag={course?.category || course?.course_tag || "Recorded Session"}
                rating={course?.rating}
                course_image={course?.course_image}
                onClick={() => handleCardClick(course?._id)}
                duration={course?.duration || "2h 30m"}
                students={course?.students || "1.2k"}
                description={course?.description || "Watch this recorded session to enhance your learning experience."}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <Video className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || categoryFilter !== 'all' 
              ? "No matching sessions found" 
              : "No recorded sessions available"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || categoryFilter !== 'all'
              ? "Try adjusting your filters to find what you're looking for." 
              : "You don't have any recorded sessions from your enrolled courses yet."}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Browse Courses
            </button>
            {(searchTerm || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRecordedSessions;
