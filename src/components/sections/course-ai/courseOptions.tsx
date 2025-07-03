"use client";
import React, { useState, useEffect } from "react";
import FilterCards from "../../shared/courses/FilterCards";
import { Zap, Sparkles, Brain, Search } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { getAllCoursesWithLimits } from "@/apis/course/course";

const CourseOptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  // Define the specializations for AI and Data Science courses
  const specializations = [
    "Machine Learning Fundamentals",
    "Deep Learning & Neural Networks", 
    "Data Analysis & Visualization",
    "Natural Language Processing",
    "Computer Vision",
    "Big Data & Analytics",
    "AI Strategy & Ethics",
    "Predictive Analytics"
  ];

  // Load courses and filter for AI and Data Science category
  useEffect(() => {
    const fetchAICourses = async () => {
      try {
        // Use the API to fetch AI and Data Science courses
        const apiUrl = getAllCoursesWithLimits({
          course_category: "AI and Data Science",
          status: "Published",
          page: 1,
          limit: 50, // Fetch more courses for better search experience
          sort_by: "createdAt",
          sort_order: "desc"
        });

        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.success && data.data && data.data.courses) {
          // Also include courses with AI/Data related keywords in title
          const allApiCourses = data.data.courses;
          const aiDataScienceCourses = allApiCourses.filter((course: any) => 
            course.course_category === "AI and Data Science" || 
            course.course_title?.toLowerCase().includes("ai") ||
            course.course_title?.toLowerCase().includes("data") ||
            course.course_title?.toLowerCase().includes("machine learning") ||
            course.course_title?.toLowerCase().includes("analytics") ||
            course.course_title?.toLowerCase().includes("artificial intelligence") ||
            course.course_tag?.toLowerCase().includes("ai") ||
            course.course_tag?.toLowerCase().includes("data science")
          );
          
          setAllCourses(aiDataScienceCourses);
          setFilteredCourses(aiDataScienceCourses);
        } else {
          console.warn("No courses found in API response");
          setAllCourses([]);
          setFilteredCourses([]);
        }
      } catch (error) {
        console.error("Error fetching AI courses:", error);
        setAllCourses([]);
        setFilteredCourses([]);
      }
    };

    fetchAICourses();
  }, []);

  // Search functionality with API integration
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim() === "") {
        setFilteredCourses(allCourses);
      } else {
        try {
          // Use API search for live results
          const apiUrl = getAllCoursesWithLimits({
            search: searchTerm,
            course_category: "AI and Data Science",
            status: "Published",
            page: 1,
            limit: 30,
            sort_by: "createdAt",
            sort_order: "desc"
          });

          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (data.success && data.data && data.data.courses) {
            // Filter API results for AI/Data Science courses
            const aiDataScienceCourses = data.data.courses.filter((course: any) => 
              course.course_category === "AI and Data Science" || 
              course.course_title?.toLowerCase().includes("ai") ||
              course.course_title?.toLowerCase().includes("data") ||
              course.course_title?.toLowerCase().includes("machine learning") ||
              course.course_title?.toLowerCase().includes("analytics")
            );
            setFilteredCourses(aiDataScienceCourses);
          } else {
            // Fallback to local filtering if API search fails
            const filtered = allCourses.filter((course: any) =>
              course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.program_overview?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.course_subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.course_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.course_tag?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCourses(filtered);
          }
        } catch (error) {
          console.error("Search API error:", error);
          // Fallback to local filtering
          const filtered = allCourses.filter((course: any) =>
            course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.program_overview?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.course_subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.course_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.course_tag?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredCourses(filtered);
        }
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, allCourses]);

  // Custom header content with edge-to-edge styling
  const customHeader = (
    <div className="relative text-center w-full">
      {/* Background decoration - Full width */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10" />
      </div>

      {/* Content with controlled inner padding */}
      <div className="relative space-y-4 md:space-y-6 py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs md:text-sm font-medium">
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            Future-Ready Skills
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Transform Tech Insights Powerfully
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900 dark:text-white">with</span>
            <span className="inline-flex items-center">
              <Image src={require('@/assets/images/logo/medh.png')} alt="Medh Logo" className="h-6 md:h-[2.25rem] w-auto object-contain inline-block align-middle" />
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Comprehensive Learning Path to Master Cutting-Edge Technology and Analytics
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Header with controlled width */}
        <div className="w-full">
          {customHeader}
        </div>

        {/* Search Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search AI & Data Science courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 md:pl-10 pr-3 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base transition-all duration-200"
            />
          </div>
        </div>
        
        {/* Course Section Header */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
            AI and Data Science Courses
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            Master artificial intelligence and data science with our comprehensive courses combining cutting-edge technology with practical applications.
          </p>
        </div>

        {/* Course grid container with consistent styling from CoursesFilter */}
        <div className="px-4 md:px-6 lg:px-8">
          {filteredCourses.length > 0 ? (
            <div className={`grid gap-1.5 lg:gap-2 auto-rows-fr ${
              filteredCourses.length === 1 
                ? 'grid-cols-1 justify-items-center max-w-md mx-auto' 
                : filteredCourses.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 justify-items-center max-w-2xl mx-auto' 
                : filteredCourses.length === 3 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-4xl mx-auto' 
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {filteredCourses.map((course, index) => (
                <div key={course._id || index} className="h-full">
                  <FilterCards 
                    type="lg"
                    courses={[course]}
                    customClassName="h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center w-full py-8">
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 w-full max-w-md mx-4">
                <div className="flex flex-col items-center justify-center min-h-[20vh] md:min-h-[30vh] text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-3 md:mb-4">
                    <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No courses found" : "Coming Soon"}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
                    {searchTerm 
                      ? `No courses match "${searchTerm}". Try different keywords or browse all available courses.`
                      : "We're currently developing cutting-edge AI and Data Science courses. Check back soon for industry-leading content!"
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Explore More Button */}
        <div className="flex justify-center w-full py-6 md:py-8">
          <Link href="/courses">
            <div className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm md:text-base font-medium rounded-lg md:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
              <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span>Explore All Courses</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CourseOptions;
