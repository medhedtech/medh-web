"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Clock, BookOpen, UserCheck, ChevronRight, Star, Filter, Loader, BookOpenCheck, Calendar, Play, FileText } from "lucide-react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { getAllCoursesWithLimits } from "@/apis/course/course";

// Define TypeScript interfaces for our data structures
interface Resource {
  id?: string;
  title: string;
  url?: string;
  fileUrl?: string;
  type: string;
  description: string;
  _id?: { $oid: string };
}

interface Meta {
  presenter?: string | null;
  transcript?: string | null;
  time_limit?: number | null;
  passing_score?: number | null;
  due_date?: string | null;
  max_score?: number | null;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  lessonType: string;
  isPreview: boolean;
  meta: Meta;
  resources: Resource[];
  video_url?: string;
  _id?: { $oid: string };
  createdAt?: { $date: string };
  updatedAt?: { $date: string };
}

interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  resources: Resource[];
  _id?: { $oid: string };
  createdAt?: { $date: string };
  updatedAt?: { $date: string };
}

interface Week {
  id: string;
  weekTitle: string;
  weekDescription: string;
  topics: string[];
  sections: Section[];
  lessons: Lesson[];
  liveClasses: any[];
  _id?: { $oid: string };
  createdAt?: { $date: string };
  updatedAt?: { $date: string };
}

interface CourseDescription {
  program_overview: string;
  benefits: string;
  learning_objectives: string[];
  course_requirements: string[];
  target_audience: string[];
  _id?: { $oid: string };
}

interface Curriculum {
  weeks: Week[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  rating: number;
  reviewCount: number;
  studentsCount: number;
  lessonsCount: number;
  duration: string;
  category: string;
  level: string;
  progress: number;
  featured?: boolean;
  last_accessed?: string | null;
  completion_status?: string;
  enrollment_id?: string;
  course_description?: CourseDescription;
  curriculum?: Week[];
}

interface ApiResponse {
  success: boolean;
  data?: {
    enrollments?: any[];
  };
  courses?: any[];
}

const IntegratedLessonsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Week[] | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  const { getQuery } = useGetQuery();
  
  // Helper function to get the auth token
  const getAuthToken = (): string | null => {
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
  const fetchEnrolledCourses = async (id: string): Promise<void> => {
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
        onSuccess: (response: ApiResponse) => {
          let courses: Course[] = [];
          
          if (response?.success && response?.data?.enrollments) {
            const enrollments = response.data.enrollments || [];
            
            courses = enrollments
              .map((enrollment: any) => {
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
                  enrollment_id: enrollment._id,
                  curriculum: course.curriculum || []
                };
              })
              .filter(Boolean) as Course[];
          }
          
          setEnrolledCourses(courses);
          setError(null);
          setLoading(false);
        },
        onError: (error: any) => {
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
  const fetchAvailableCourses = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await getQuery({
        url: getAllCoursesWithLimits(
          1,
          8,
          "",
          "",
          "",
          "Published"
        ),
        onSuccess: (response: ApiResponse) => {
          if (response?.success && response?.courses) {
            const mappedCourses: Course[] = response.courses.map((course: any) => ({
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
              featured: course.is_featured || false,
              curriculum: course.curriculum || []
            }));
            
            setAvailableCourses(mappedCourses);
          } else {
            setAvailableCourses([]);
          }
          setLoading(false);
        },
        onError: (error: any) => {
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

  // Function to view course curriculum
  const viewCurriculum = (courseId: string): void => {
    const course = [...enrolledCourses, ...availableCourses].find(c => c.id === courseId);
    if (course && course.curriculum) {
      setSelectedCurriculum(course.curriculum);
      setSelectedCourseId(courseId);
    }
  };

  // Function to go back to course listing
  const goBackToCourses = (): void => {
    setSelectedCurriculum(null);
    setSelectedCourseId(null);
  };
  
  // Render the curriculum view
  const renderCurriculum = (): JSX.Element => {
    if (!selectedCurriculum || !selectedCourseId) {
      return <div>No curriculum data available</div>;
    }

    const course = [...enrolledCourses, ...availableCourses].find(c => c.id === selectedCourseId);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={goBackToCourses}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
          >
            <ChevronRight className="w-5 h-5 transform rotate-180" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {course?.title} - Curriculum
          </h2>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BookOpen className="w-5 h-5 text-primaryColor mr-2" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Level:</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">{course?.level}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-primaryColor mr-2" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Duration:</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">{course?.duration}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <UserCheck className="w-5 h-5 text-primaryColor mr-2" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Enrolled:</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">{course?.studentsCount} students</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {selectedCurriculum.map((week, weekIndex) => (
            <div key={week.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {week.weekTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {week.weekDescription}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Week {weekIndex + 1}
                </span>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {week.sections.map((section) => (
                  <div key={section.id} className="p-4">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {section.description}
                    </p>
                    
                    <div className="space-y-3 mt-4">
                      {section.lessons.map((lesson) => (
                        <div 
                          key={lesson.id} 
                          className="flex items-start p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {lesson.lessonType === 'video' ? (
                              <Play className="w-5 h-5 text-primaryColor" />
                            ) : (
                              <FileText className="w-5 h-5 text-primaryColor" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {lesson.title}
                              </h5>
                              {lesson.isPreview && (
                                <span className="text-xs font-medium text-primaryColor bg-primaryColor/10 px-2 py-1 rounded-full">
                                  Preview
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {lesson.description}
                            </p>
                            
                            {lesson.resources && lesson.resources.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Resources:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {lesson.resources.map((resource, index) => (
                                    <a
                                      key={resource.id || index}
                                      href={resource.url || resource.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primaryColor hover:text-primaryColor/80 flex items-center"
                                    >
                                      <FileText className="w-3 h-3 mr-1" />
                                      {resource.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <PageWrapper>
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {selectedCurriculum ? (
            // Show curriculum view when a course curriculum is selected
            renderCurriculum()
          ) : (
            // Show courses list view
            <>
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

                            <div className="mt-4 flex justify-between">
                              <Link 
                                href={`/integrated-lessons/${course.id}`}
                                className="text-sm px-3 py-1.5 bg-primaryColor text-white rounded-md flex items-center hover:bg-primaryColor/90 transition-colors"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Continue
                              </Link>
                              <button
                                onClick={() => viewCurriculum(course.id)}
                                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md flex items-center hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                <BookOpenCheck className="w-3 h-3 mr-1" />
                                Curriculum
                              </button>
                            </div>
                          </div>
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

                            <div className="mt-4 flex justify-between">
                              <Link 
                                href={`/integrated-lessons/${course.id}`}
                                className="text-sm px-3 py-1.5 bg-primaryColor text-white rounded-md flex items-center hover:bg-primaryColor/90 transition-colors"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Explore
                              </Link>
                              <button
                                onClick={() => viewCurriculum(course.id)}
                                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md flex items-center hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                <BookOpenCheck className="w-3 h-3 mr-1" />
                                Curriculum
                              </button>
                            </div>
                          </div>
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
            </>
          )}
        </div>
      </main>
    </PageWrapper>
  );
};

export default IntegratedLessonsPage;