"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Clock, BookOpen, UserCheck, ChevronRight, Star, Filter, Loader } from "lucide-react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const IntegratedLessonsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { getQuery } = useGetQuery();
  
  // Helper function to get the auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Get student ID from local storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const token = getAuthToken();
      
      if (!storedUserId || !token) {
        setError("Please log in to view your courses.");
        return;
      }
      
      setStudentId(storedUserId);
    }
  }, []);
  
  // Fetch enrolled courses when student ID is available
  useEffect(() => {
    if (studentId) {
      fetchEnrolledCourses(studentId);
      fetchAvailableCourses();
    }
  }, [studentId]);
  
  // Function to fetch enrolled courses
  const fetchEnrolledCourses = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      
      const paymentApiUrl = apiUrls.payment.getStudentPayments(id, { 
        page: 1, 
        limit: 10
      });
      
      await getQuery({
        url: paymentApiUrl,
        headers,
        onSuccess: (response) => {
          let courses = [];
          
          if (response?.success && response?.data?.enrollments) {
            const enrollments = response.data.enrollments || [];
            
            courses = enrollments
              .map((enrollment) => {
                const course = enrollment.course_id;
                if (!course) return null;
                
                return {
                  ...course,
                  id: course._id || enrollment.course_id?._id,
                  title: course.course_title,
                  description: course.course_description,
                  thumbnail: course.course_image,
                  instructor: course.instructor_name || "Instructor",
                  instructorAvatar: "/images/instructor-avatar.jpg",
                  rating: course.rating || 4.5,
                  reviewCount: course.review_count || 0,
                  studentsCount: course.students_count || 0,
                  lessonsCount: course.lessons_count || 0,
                  duration: course.course_duration || "0 hours",
                  category: course.course_category || "General",
                  level: course.skill_level || "Beginner",
                  progress: enrollment.course_progress || 0,
                  last_accessed: enrollment.last_accessed_at || enrollment.updatedAt || null,
                  completion_status: enrollment.is_completed ? "completed" : "in_progress",
                  enrollment_id: enrollment._id
                };
              })
              .filter(Boolean);
          }
          
          setEnrolledCourses(courses);
          setError(null);
          setLoading(false);
        },
        onError: (error) => {
          if (error?.response?.status === 401) {
            setError("Your session has expired. Please log in again.");
          } else if (error?.response?.status === 404) {
            setEnrolledCourses([]);
            setError(null);
          } else {
            setError("Failed to load enrolled courses. Please try again later.");
          }
          
          setLoading(false);
        },
      });
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };
  
  // Function to fetch available courses
  const fetchAvailableCourses = async () => {
    try {
      setLoading(true);
      
      await getQuery({
        url: apiUrls.courses.getAllCoursesWithLimits(
          1,
          8,
          "",
          "",
          "",
          "Published"
        ),
        onSuccess: (response) => {
          if (response?.success && response?.courses) {
            const mappedCourses = response.courses.map(course => ({
              id: course._id,
              title: course.course_title,
              description: course.course_description,
              thumbnail: course.course_image || "/images/course-thumbnail.jpg",
              instructor: course.instructor_name || "Instructor",
              instructorAvatar: "/images/instructor-avatar.jpg",
              rating: course.rating || 4.5,
              reviewCount: course.reviews_count || 0,
              studentsCount: course.students_count || 0,
              lessonsCount: course.lessons_count || 0,
              duration: course.course_duration || "0 hours",
              category: course.course_category || "General",
              level: course.skill_level || "Beginner",
              progress: 0,
              featured: course.is_featured || false
            }));
            
            setAvailableCourses(mappedCourses);
          } else {
            setAvailableCourses([]);
          }
          setLoading(false);
        },
        onError: (error) => {
          console.error("Error fetching available courses:", error);
          setError("Failed to load available courses.");
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error in fetchAvailableCourses:", error);
      setLoading(false);
    }
  };
  
  // List of categories
  const [categories, setCategories] = useState(["All"]);
  
  // Fetch categories
  useEffect(() => {
    // This would ideally fetch from an API endpoint, but we're creating a mixed list for now
    // from the available courses
    const extractedCategories = [...new Set(availableCourses.map(course => course.category))];
    setCategories(["All", ...extractedCategories]);
  }, [availableCourses]);
  
  // Filter courses based on search query and category
  const filteredEnrolledCourses = enrolledCourses?.filter(course => {
    if (!course) return false;
    
    const matchesSearch = (course.title?.toLowerCase() || '').includes(searchQuery?.toLowerCase() || '') || 
                         (course.description?.toLowerCase() || '').includes(searchQuery?.toLowerCase() || '');
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];
  
  const filteredAvailableCourses = availableCourses?.filter(course => {
    if (!course) return false;
    
    const matchesSearch = (course.title?.toLowerCase() || '').includes(searchQuery?.toLowerCase() || '') || 
                         (course.description?.toLowerCase() || '').includes(searchQuery?.toLowerCase() || '');
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];
  
  return (
    <PageWrapper>
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Learning Journey
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Continue your education with our comprehensive courses. Track your progress and access all learning materials in one place.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryColor"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <div className="flex items-center text-gray-500 dark:text-gray-400 mr-2">
                <Filter className="w-4 h-4 mr-1" />
                <span className="text-sm">Filter:</span>
              </div>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primaryColor text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div className="min-h-[300px] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-3"
              >
                <Loader className="w-6 h-6 text-primaryColor" />
                <span className="text-gray-600 dark:text-gray-400">Loading courses...</span>
              </motion.div>
            </div>
          )}
          
          {/* In Progress Section */}
          {!loading && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  In Progress
                </h2>
                <Link 
                  href="/dashboards/enrolled-courses" 
                  className="text-sm font-medium text-primaryColor hover:text-primaryColor/90 flex items-center"
                >
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrolledCourses
                  .filter(course => course.progress > 0 && course.progress < 100)
                  .map((course, index) => (
                    <motion.div
                      key={course.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <Link href={`/integrated-lessons/${course.id}`} className="block h-full">
                        <div className="relative">
                          <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 relative">
                            <Image
                              src={course.thumbnail || "/images/course-thumbnail.jpg"}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600">
                            <div 
                              className="h-full bg-primaryColor"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {course.level}
                            </span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="ml-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                                {course.rating}
                              </span>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                            {course.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {course.description || "No description available."}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                                <Image
                                  src={course.instructorAvatar}
                                  alt={course.instructor}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs text-gray-700 dark:text-gray-300">
                                {course.instructor}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{course.progress}% complete</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {filteredEnrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length === 0 && (
                    <div className="col-span-full py-10 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? "No courses in progress match your search criteria." : "You don't have any courses in progress yet."}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
          
          {/* Available Courses Section */}
          {!loading && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Available Courses
                </h2>
                <Link 
                  href="/courses" 
                  className="text-sm font-medium text-primaryColor hover:text-primaryColor/90 flex items-center"
                >
                  Browse catalog
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAvailableCourses
                  .filter(course => !enrolledCourses.some(enrolled => enrolled.id === course.id))
                  .map((course, index) => (
                    <motion.div
                      key={course.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <Link href={`/integrated-lessons/${course.id}`} className="block h-full">
                        <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 relative">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                          {course.featured && (
                            <div className="absolute top-2 left-2 bg-primaryColor text-white text-xs font-medium px-2 py-1 rounded">
                              Featured
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              {course.category}
                            </span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="ml-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                                {course.rating}
                              </span>
                            </div>
                          </div>
                          
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                            {course.title}
                          </h3>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {course.description || "No description available."}
                          </p>
                          
                          <div className="flex flex-wrap gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center mr-4">
                              <BookOpen className="w-3 h-3 mr-1" />
                              <span>{course.lessonsCount || 0} lessons</span>
                            </div>
                            <div className="flex items-center mr-4">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{course.duration || "0h"}</span>
                            </div>
                            <div className="flex items-center">
                              <UserCheck className="w-3 h-3 mr-1" />
                              <span>{(course.studentsCount || 0).toLocaleString()} students</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {filteredAvailableCourses.filter(course => !enrolledCourses.some(enrolled => enrolled.id === course.id)).length === 0 && (
                    <div className="col-span-full py-10 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? "No available courses match your search criteria." : "No available courses found. Check back later!"}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
};

export default IntegratedLessonsPage;