"use client";
import React, { useEffect, useState, useRef } from "react";
import CourseCard from "../courses/CourseCard";
import { apiUrls, apiBaseUrl } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import axios from "axios";
import { 
  BookOpen, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CourseRelated({ categoryName, courseId, relatedCourses, courseTitle }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [fetchMethod, setFetchMethod] = useState('direct'); // 'direct', 'ids', 'category', 'title', or 'all'
  const [currentCourseDetails, setCurrentCourseDetails] = useState(null);
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("Recommended For You");
  
  // Check if we can scroll
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 10);
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Fetch the current course details if we have the ID
  const fetchCurrentCourseDetails = () => {
    if (!courseId) return;
    
    console.log("Fetching details for current course:", courseId);
    
    // Fix: Use a proper URL path for getCourse from apiUrls
    const courseDetailsUrl = `${apiBaseUrl}/courses/${courseId}`;
    
    getQuery({
      url: courseDetailsUrl,
      onSuccess: (res) => {
        console.log("Current course details:", res);
        if (res && res.course) {
          setCurrentCourseDetails(res.course);
        }
      },
      onFail: (err) => {
        console.error("Error fetching current course details:", err);
        // Continue with the process even if this fails
        // We can still find related courses through other methods
      }
    });
  };

  // Direct API call to fetch related courses for a specific course
  const fetchRelatedCoursesDirect = async () => {
    if (!courseId) {
      console.log("No course ID available, falling back to other methods");
      if (relatedCourses && Array.isArray(relatedCourses) && relatedCourses.length > 0) {
        setFetchMethod('ids');
        fetchCoursesByIds();
      } else {
        setFetchMethod('category');
        fetchCoursesByCategory();
      }
      return;
    }

    setLoading(true);
    setError(null);
    setSectionTitle("Recommended For You");
    console.log("Directly fetching related courses for course ID:", courseId);

    try {
      // Use the getAllRelatedCourses endpoint with proper params
      const relatedCoursesEndpoint = `${apiUrls.courses.getAllRelatedCourses}?courseId=${courseId}&limit=15`;
      console.log("Trying API endpoint:", relatedCoursesEndpoint);
      
      try {
        // Use getQuery hook instead of axios directly for consistent error handling
        getQuery({
          url: relatedCoursesEndpoint,
          onSuccess: (data) => {
            console.log("Direct API response for related courses:", data);
            
            if (data && data.courses && data.courses.length > 0) {
              setCourses(data.courses);
              setLoading(false);
              setError(null);
              setTimeout(checkScrollPosition, 100);
            } else {
              // Try fallback if no courses returned
              tryFallbackEndpoint();
            }
          },
          onFail: (err) => {
            console.log("First endpoint failed, trying fallback endpoint:", err);
            tryFallbackEndpoint();
          }
        });
      } catch (firstErr) {
        console.log("Error with primary endpoint:", firstErr);
        tryFallbackEndpoint();
      }
    } catch (err) {
      console.error("Error in fetchRelatedCoursesDirect:", err);
      // Fall back to other methods
      fallbackToOtherMethods();
    }
  };

  // Helper function for fallback endpoint
  const tryFallbackEndpoint = () => {
    try {
      // Use the getAllCoursesWithLimits with proper params for related courses
      const fallbackEndpoint = apiUrls.courses.getAllCoursesWithLimits(
        1,                 // page
        15,                // limit
        "",                // course_title 
        "",                // course_tag
        categoryName,      // course_category - use the same category for related courses
        "Published",       // status
        "",                // search
        "",                // course_grade
        [],                // category
        { exclude: courseId } // exclude current course
      );
      
      console.log("Trying fallback API endpoint:", fallbackEndpoint);
      
      getQuery({
        url: fallbackEndpoint,
        onSuccess: (data) => {
          console.log("Fallback API response:", data);
          
          if (data && data.courses && data.courses.length > 0) {
            setCourses(data.courses);
            setLoading(false);
            setError(null);
            setTimeout(checkScrollPosition, 100);
          } else {
            // If still no courses, try other methods
            fallbackToOtherMethods();
          }
        },
        onFail: (err) => {
          console.error("Fallback API failed:", err);
          fallbackToOtherMethods();
        }
      });
    } catch (err) {
      console.error("Error in fallback endpoint:", err);
      fallbackToOtherMethods();
    }
  };

  // Helper to fall back to other methods
  const fallbackToOtherMethods = () => {
    console.log("No courses returned from direct APIs, trying next method");
    if (relatedCourses && Array.isArray(relatedCourses) && relatedCourses.length > 0) {
      console.log("Trying related IDs");
      setFetchMethod('ids');
      fetchCoursesByIds();
    } else {
      console.log("Trying category");
      setFetchMethod('category');
      fetchCoursesByCategory();
    }
  };

  // Fetch courses by specific IDs
  const fetchCoursesByIds = () => {
    setLoading(true);
    setError(null);
    
    // Make sure IDs are valid
    if (!relatedCourses || !Array.isArray(relatedCourses) || relatedCourses.length === 0) {
      console.log("No valid related course IDs, falling back to category");
      setFetchMethod('category');
      fetchCoursesByCategory();
      return;
    }
    
    console.log("Fetching courses by IDs:", relatedCourses);
    setSectionTitle("Courses You May Like");
    
    postQuery({
      url: apiUrls?.courses?.getAllRelatedCources,
      postData: {
        course_ids: relatedCourses,
      },
      onSuccess: (res) => {
        console.log("Related courses by ID response:", res);
        const receivedCourses = res?.courses || [];
        
        // Only proceed if we actually got courses
        if (receivedCourses.length > 0) {
          setCourses(receivedCourses);
          setLoading(false);
          setError(null);
          setTimeout(checkScrollPosition, 100);
        } else {
          console.log("No courses found by IDs, falling back to category");
          setFetchMethod('category');
          fetchCoursesByCategory();
        }
      },
      onFail: (err) => {
        console.error("Error fetching related courses by IDs:", err);
        setFetchMethod('category');
        fetchCoursesByCategory();
      },
    });
  };
  
  // Fetch courses by category
  const fetchCoursesByCategory = () => {
    setLoading(true);
    setError(null);
    
    if (!categoryName) {
      console.log("No category name available, falling back to title");
      setFetchMethod('title');
      fetchCoursesByTitle();
      return;
    }
    
    setSectionTitle(`More ${categoryName} Courses`);
    console.log("Fetching courses by category:", categoryName);
    
    getQuery({
      url: apiUrls.courses.getAllCoursesWithLimits(
        1,                    // page
        15,                   // limit
        "",                   // course_title
        "",                   // course_tag
        categoryName,         // course_category
        "Published",          // status
        "",                   // search
        "",                   // course_grade
        [],                   // category
        courseId ? { exclude: courseId } : {} // filters
      ),
      onSuccess: (res) => {
        console.log("Related courses by category response:", res);
        const receivedCourses = res?.courses || [];
        
        if (receivedCourses.length > 0) {
          // Sort the courses by relevance if we have course details
          if (courseId && courseTitle) {
            const sortedCourses = sortCoursesByRelevance(receivedCourses);
            setCourses(sortedCourses);
          } else {
            setCourses(receivedCourses);
          }
          setLoading(false);
          setError(null);
          setTimeout(checkScrollPosition, 100);
        } else {
          console.log("No courses found by category, falling back to title");
          setFetchMethod('title');
          fetchCoursesByTitle();
        }
      },
      onFail: (err) => {
        console.error("Error fetching courses by category:", err);
        setFetchMethod('title');
        fetchCoursesByTitle();
      },
    });
  };
  
  // Enhanced logic for finding similar courses, inspired by CoursesFilter.js
  const sortCoursesByRelevance = (coursesToSort) => {
    if (!coursesToSort || coursesToSort.length === 0) {
      return coursesToSort;
    }
    
    // Use current course details if available, or create a minimal version
    const currentCourse = currentCourseDetails || {
      _id: courseId,
      course_title: courseTitle,
      category: categoryName,
    };
    
    if (!currentCourse.course_title && !currentCourse.category) {
      return coursesToSort; // No useful data for comparison
    }
    
    // Score each course based on similarity
    const scoredCourses = coursesToSort.map(course => {
      let score = 0;
      
      // Category match check
      if (currentCourse.category && 
          course.category && 
          course.category.toLowerCase() === currentCourse.category.toLowerCase()) {
        score += 5;
      }
      
      // Check for instructor match if available
      if (currentCourse.instructor_name && 
          course.instructor_name && 
          course.instructor_name.toLowerCase() === currentCourse.instructor_name.toLowerCase()) {
        score += 2;
      }
      
      // Check for grade level match if available
      if (currentCourse.course_grade && 
          course.course_grade && 
          course.course_grade.toLowerCase() === currentCourse.course_grade.toLowerCase()) {
        score += 2;
      }
      
      // Check for title word overlap
      if (currentCourse.course_title && course.course_title) {
        const courseTitleWords = currentCourse.course_title.toLowerCase()
          .split(/\s+/)
          .filter(word => word.length > 3);
        
        const otherTitle = course.course_title.toLowerCase();
        const otherTitleWords = otherTitle
          .split(/\s+/)
          .filter(word => word.length > 3);
        
        const titleWordMatch = courseTitleWords.filter(word => 
          otherTitleWords.some(otherWord => 
            word.includes(otherWord) || otherWord.includes(word)
          )
        ).length;
        
        if (titleWordMatch > 0) {
          score += titleWordMatch * 1;
        }
      }
      
      return { course, score };
    });
    
    // Sort by score (highest first) and return the courses
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .map(item => item.course);
  };
  
  // Fetch courses by similar title keywords
  const fetchCoursesByTitle = () => {
    setLoading(true);
    setError(null);
    
    if (!courseTitle) {
      console.log("No course title available, falling back to all courses");
      setFetchMethod('all');
      fetchAllCourses();
      return;
    }
    
    setSectionTitle("You Might Also Like");
    
    // Extract more meaningful keywords from title
    const keywords = courseTitle
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'your', 'about'].includes(word)) 
      .slice(0, 4) // Use up to 4 keywords for better matching
      .join(',');
    
    console.log("Fetching courses by title keywords:", keywords);
    
    getQuery({
      url: apiUrls.courses.getAllCoursesWithLimits(
        1,                    // page
        15,                   // limit
        "",                   // course_title
        "",                   // course_tag
        "",                   // course_category
        "Published",          // status
        keywords,             // search - use keywords as search term
        "",                   // course_grade
        [],                   // category
        courseId ? { exclude: courseId } : {} // filters
      ),
      onSuccess: (res) => {
        console.log("Related courses by title response:", res);
        const receivedCourses = res?.courses || [];
        
        if (receivedCourses.length > 0) {
          // Apply the same relevance sorting here
          const sortedCourses = sortCoursesByRelevance(receivedCourses);
          setCourses(sortedCourses);
          setLoading(false);
          setError(null);
          setTimeout(checkScrollPosition, 100);
        } else {
          console.log("No courses found by title, falling back to all courses");
          setFetchMethod('all');
          fetchAllCourses();
        }
      },
      onFail: (err) => {
        console.error("Error fetching courses by title:", err);
        setFetchMethod('all');
        fetchAllCourses();
      },
    });
  };

  // Fetch any popular courses as a last resort
  const fetchAllCourses = () => {
    setLoading(true);
    setError(null);
    setSectionTitle("Explore Popular Courses");
    console.log("Fetching popular courses as last resort");
    
    // Use the proper API endpoint from index.js with search parameters
    getQuery({
      url: apiUrls.courses.getAllCoursesWithLimits(
        1,                 // page
        15,                // limit
        "",                // course_title 
        "",                // course_tag
        "",                // course_category
        "Published",       // status
        "",                // search
        "",                // course_grade
        [],                // category
        courseId ? { exclude: courseId } : {} // filters
      ),
      onSuccess: (res) => {
        console.log("Popular courses response:", res);
        const receivedCourses = res?.courses || [];
        
        if (receivedCourses && receivedCourses.length > 0) {
          // Apply relevance sorting if possible, otherwise use as-is
          if (courseTitle) {
            const sortedCourses = sortCoursesByRelevance(receivedCourses);
            setCourses(sortedCourses);
          } else {
            setCourses(receivedCourses);
          }
          setLoading(false);
          setError(null);
          setTimeout(checkScrollPosition, 100);
        } else {
          console.log("No popular courses found, showing error");
          setLoading(false);
          setCourses([]);  // Ensure courses is an empty array, not undefined
          setError("No related courses available");
        }
      },
      onFail: (err) => {
        console.error("Error fetching popular courses:", err);
        setLoading(false);
        setCourses([]);  // Ensure courses is an empty array, not undefined
        setError("Failed to load related courses");
      },
    });
  };

  // Component for displaying the no courses found message
  const NoCourseMessage = () => (
    <div className="flex flex-col items-center justify-center w-full py-10 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
      <div className="text-center">
        <RefreshCw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Related Courses</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn't find any related courses that match your interests. Explore our course catalog to discover more learning opportunities.
        </p>
      </div>
    </div>
  );

  useEffect(() => {
    console.log("CourseRelated component - initial props:", { 
      relatedCourses, 
      categoryName, 
      courseId, 
      courseTitle 
    });
    
    // Try to fetch details about the current course if we have its ID
    if (courseId) {
      fetchCurrentCourseDetails();
    }
    
    // Start with direct API call for related courses
    setFetchMethod('direct');
    fetchRelatedCoursesDirect();
    
    // Add scroll listener
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [courseId, courseTitle, categoryName, relatedCourses]); // Update dependencies to re-fetch when these values change

  // Update scroll buttons when window resizes
  useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get badge text based on fetch method
  const getBadgeText = () => {
    switch (fetchMethod) {
      case 'direct':
        return 'Recommended For You';
      case 'ids':
        return 'Personalized Recommendations';
      case 'category':
        return `${categoryName} Courses`;
      case 'title':
        return 'Similar Content';
      case 'all':
        return 'Popular Courses';
      default:
        return 'Related Courses';
    }
  };

  // Get footer text based on fetch method
  const getFooterText = () => {
    switch (fetchMethod) {
      case 'direct':
        return 'Recommendations tailored to your learning journey';
      case 'ids':
        return 'Recommendations based on your selected course';
      case 'category':
        return `More courses in the ${categoryName} category`;
      case 'title':
        return `Courses similar to "${courseTitle ? (courseTitle.length > 30 ? courseTitle.substring(0, 27) + '...' : courseTitle) : 'this course'}"`;
      case 'all':
        return 'Popular courses you might enjoy';
      default:
        return 'Explore more courses to enhance your learning';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-4 border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center"
            >
              <div className="w-1.5 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-sm mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 flex items-center">
                {sectionTitle}
                <Layers className="ml-2 text-primary-500 w-5 h-5" />
              </h2>
            </motion.div>
            
            {courses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                <Tag size={14} className="text-primary-500 mr-1" />
                <span>{getBadgeText()}</span>
              </motion.div>
            )}
          </div>
          
          {/* Courses Section */}
          <div className="relative">
          
            {/* Loading State */}
            <AnimatePresence>
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl"
                >
                  <div className="flex flex-col items-center">
                    <RefreshCw size={30} className="text-primary-500 animate-spin mb-2" />
                    <p className="text-gray-600 dark:text-gray-300">Finding courses for you...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Error State */}
            {error && !loading && courses.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NoCourseMessage />
              </motion.div>
            )}
            
            {/* Empty State - No courses found but no error */}
            {!error && !loading && courses.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NoCourseMessage />
              </motion.div>
            )}
            
            {/* Netflix-style Horizontal Scroll */}
            {courses.length > 0 && !loading && (
              <>
                <div className="relative -mx-4 px-4">
                  {/* Left scroll button */}
                  <AnimatePresence>
                    {showLeftScroll && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 z-10 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm h-12 w-12 rounded-full shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <ChevronLeft className="text-gray-700 dark:text-gray-300" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  
                  {/* Right scroll button */}
                  <AnimatePresence>
                    {showRightScroll && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 z-10 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm h-12 w-12 rounded-full shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <ChevronRight className="text-gray-700 dark:text-gray-300" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  
                  {/* Scrolling container */}
                  <div 
                    ref={scrollContainerRef} 
                    className="overflow-x-auto pb-4 pt-1 hide-scrollbar"
                    onScroll={checkScrollPosition}
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, staggerChildren: 0.1 }}
                      className="flex space-x-5"
                      style={{ minWidth: 'max-content' }}
                    >
                      {courses.map((course, index) => (
                        <motion.div
                          key={course._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`transition-all duration-300 flex-shrink-0 ${
                            hoveredCourse === course._id ? 'w-[330px]' : 'w-[290px]'
                          }`}
                          onMouseEnter={() => setHoveredCourse(course._id)}
                          onMouseLeave={() => setHoveredCourse(null)}
                        >
                          <div 
                            className={`transition-all duration-300 h-full ${
                              hoveredCourse === course._id 
                                ? 'transform scale-105 shadow-xl z-10' 
                                : 'transform scale-100 shadow-md'
                            }`}
                          >
                            <CourseCard course={course} />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
                
                {/* Footer hint */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400"
                >
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 mr-2"></div>
                    {getFooterText()}
                  </span>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Add custom styles for Netflix-style UI */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </motion.div>
  );
}

export default CourseRelated;
