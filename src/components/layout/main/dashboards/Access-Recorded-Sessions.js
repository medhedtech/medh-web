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
import { Video, Search, AlertCircle } from "lucide-react";

const StudentRecordedSessions = () => {
  const router = useRouter();
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { getQuery } = useGetQuery();

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
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
            onSuccess: (response) => {
              const recordedData = response?.courses || response?.data?.courses || response;
              
              if (Array.isArray(recordedData)) {
                setRecordedSessions(recordedData);
              } else {
                console.warn("Unexpected response format:", response);
                setRecordedSessions([]);
              }
              
              setIsLoading(false);
            },
            onFail: (error) => {
              console.error("Error fetching recorded sessions:", error);
              
              if (error?.response?.status === 401) {
                setError("Your session has expired. Please log in again.");
                toast.error("Your session has expired. Please log in again.");
              } else if (error?.response?.status === 404) {
                setRecordedSessions([]);
              } else {
                setError("Failed to load recorded sessions. Please try again later.");
                toast.error("Failed to load recorded sessions. Please try again later.");
              }
              
              setIsLoading(false);
            }
          });
        } catch (error) {
          console.error("Error in fetchRecordedSessions:", error);
          setError("An unexpected error occurred. Please try again later.");
          toast.error("An unexpected error occurred. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchRecordedSessions();
  }, []);

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const filteredSessions = recordedSessions.filter(course =>
    course?.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="container mx-auto p-8 mt-[-40px]">
      <div className="flex justify-between items-center mb-8">
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
        
        {/* Search input */}
        <div className="relative w-64">
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
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      ) : filteredSessions.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredSessions.map((course) => (
            <motion.div
              key={course?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <RecordedCard
                course_title={course?.course_title}
                course_tag={course?.course_tag || "Recorded Session"}
                rating={course?.rating}
                course_image={course?.course_image}
                onClick={() => handleCardClick(course?._id)}
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
            {searchTerm ? "No matching sessions found" : "No recorded sessions available"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm 
              ? "Try adjusting your search term to find what you're looking for." 
              : "You don't have any recorded sessions from your enrolled courses yet."}
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentRecordedSessions;
