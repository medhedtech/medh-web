"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import CategoryFilter from "./CategoryFilter";
import CourseCard from "./CourseCard";
import Pagination from "@/components/shared/pagination/Pagination";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useRouter } from "next/navigation";
import { X, Filter, Search, ChevronDown, Zap, GraduationCap } from "lucide-react";
import Preloader2 from "@/components/shared/others/Preloader2";
import CategoryToggle from "@/components/shared/courses/CategoryToggle";
import GradeFilter from "@/components/shared/courses/GradeFilter";

const categories = [
  "AI and Data Science",
  "AI For Professionals",
  "Business And Management",
  "Career Development",
  "Communication And Soft Skills",
  "Data And Analytics",
  "Digital Marketing with Data Analytics",
  "Environmental and Sustainability Skills",
  "Finance And Accounts",
  "Health And Wellness",
  "Industry-Specific Skills",
  "Language And Linguistic",
  "Legal And Compliance Skills",
  "Personal Well-Being",
  "Personality Development",
  "Sales And Marketing",
  "Technical Skills",
  "Vedic Mathematics",
];

const grades = [
  "Preschool",
  "Grade 1-2",
  "Grade 3-4",
  "Grade 5-6",
  "Grade 7-8",
  "Grade 9-10",
  "Grade 11-12",
  "UG - Graduate - Professionals",
];

const extractWeeks = (duration) => {
  if (!duration) return 0;
  const matches = duration.match(/\d+/);
  if (!matches) return 0;

  const value = parseInt(matches[0], 10);
  if (duration.toLowerCase().includes("month")) {
    return value * 4;
  }
  return value;
};

const CoursesFilter = ({ 
  CustomButton, 
  CustomText, 
  scrollToTop,
  fixedCategory,
  hideCategoryFilter,
  hideGradeFilter = false,
  availableCategories,
  categoryTitle,
  description,
  gradeTitle = "Grade Levels",
  availableGrades = grades,
  autoRefreshInterval = 30000, // 30 seconds default refresh interval
  enableAutoRefresh = true,
}) => {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest-first");
  const { getQuery, error } = useGetQuery();
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [categorySliderOpen, setCategorySliderOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [queryError, setQueryError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef(null);
  
  const contentRef = useRef(null);

  // Add default props to ensure consistent initial state
  const defaultProps = {
    CustomButton: null,
    CustomText: "Skill Development Courses",
    scrollToTop: () => {},
    fixedCategory: null,
    hideCategoryFilter: false,
    hideGradeFilter: false,
    availableCategories: categories,
    availableGrades: grades,
    categoryTitle: "Categories",
    gradeTitle: "Grade Levels",
    description: null
  };

  // Memoize expensive computations and event handlers
  const memoizedHandleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const memoizedHandleSortChange = useCallback((e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  }, []);

  const memoizedHandlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Ensure initial state is consistent between server and client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && scrollToTop) {
      scrollToTop();
    }
  }, []); 

  const fetchCourses = async () => {
    const categoryQuery = selectedCategory ? selectedCategory : [];
    const gradeQuery = selectedGrade || "";

    try {
      const apiUrl = apiUrls?.courses?.getAllCoursesWithLimits(
        currentPage,
        8,
        "",
        "",
        "",
        "Published",
        searchTerm,
        gradeQuery,
        categoryQuery
      );

      if (!apiUrl) {
        console.error('Invalid API URL configuration');
        setQueryError('System configuration error. Please try again later.');
        return;
      }

      const response = await getQuery({
        url: apiUrl,
        onSuccess: (data) => {
          if (data?.courses && Array.isArray(data.courses)) {
            if (data.courses.length === 0) {
              setAllCourses([]);
              setFilteredCourses([]);
              setTotalPages(1);
              setQueryError("No courses available for the selected filters");
            } else {
              setAllCourses(data.courses);
              setTotalPages(data.totalPages || 1);
              setQueryError(null);
              applyFilters(data.courses);
            }
          } else {
            setAllCourses([]);
            setFilteredCourses([]);
            setTotalPages(1);
            setQueryError("Unexpected data format received");
          }
        },
        onFail: (error) => {
          console.error("API Error:", error);
          setQueryError(error.message || "Failed to fetch courses. Please try again.");
          setAllCourses([]);
          setFilteredCourses([]);
          setTotalPages(1);
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching courses:", error);
      setQueryError("Failed to fetch courses. Please try again.");
      setAllCourses([]);
      setFilteredCourses([]);
      setTotalPages(1);
    }
  };

  const applyFilters = (coursesToFilter = allCourses) => {
    console.debug('Applying Filters with Courses:', coursesToFilter);
    
    let filtered = [...coursesToFilter];

    // Search Term Filter - More flexible matching
    if (searchTerm) {
      const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
      filtered = filtered.filter(course => {
        const searchableFields = [
          course.course_title,
          course.course_category,
          course.course_duration,
          course.course_description,
          course.course_grade,
          course.category,
          course.instructor_name
        ].filter(Boolean).map(field => field.toLowerCase());
        
        return searchTerms.every(term => 
          searchableFields.some(field => field.includes(term))
        );
      });
    }

    // Category Filter - Case insensitive and more flexible
    if (selectedCategory && selectedCategory.length) {
      filtered = filtered.filter((course) => {
        const courseCategories = [
          course.category,
          course.course_category,
          ...(course.additional_categories || [])
        ].filter(Boolean).map(cat => cat.toLowerCase());

        const selectedCats = selectedCategory.map(c => c.toLowerCase());
        
        // Match if any of the course categories matches any selected category
        return selectedCats.some(selected => 
          courseCategories.some(courseCategory => 
            courseCategory.includes(selected) || selected.includes(courseCategory)
          )
        );
      });
    }

    // Grade Filter - More flexible matching
    if (selectedGrade) {
      filtered = filtered.filter(course => {
        const courseGrade = course.course_grade || course.grade || '';
        return courseGrade.toLowerCase() === selectedGrade.toLowerCase() ||
               courseGrade.toLowerCase().includes(selectedGrade.toLowerCase()) ||
               selectedGrade.toLowerCase().includes(courseGrade.toLowerCase());
      });
    }

    // Sorting Logic - More robust with error handling
    try {
      if (sortOrder === "A-Z") {
        filtered.sort((a, b) => 
          (a.course_title || '').toLowerCase().localeCompare((b.course_title || '').toLowerCase())
        );
      } else if (sortOrder === "Z-A") {
        filtered.sort((a, b) => 
          (b.course_title || '').toLowerCase().localeCompare((a.course_title || '').toLowerCase())
        );
      } else if (sortOrder === "newest-first") {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      } else if (sortOrder === "oldest-first") {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA - dateB;
        });
      } else if (sortOrder === "duration-asc") {
        filtered.sort((a, b) => {
          const durationA = extractWeeks(a.course_duration);
          const durationB = extractWeeks(b.course_duration);
          return durationA - durationB;
        });
      } else if (sortOrder === "duration-desc") {
        filtered.sort((a, b) => {
          const durationA = extractWeeks(a.course_duration);
          const durationB = extractWeeks(b.course_duration);
          return durationB - durationA;
        });
      }
    } catch (error) {
      console.error('Error during sorting:', error);
    }

    console.debug('Filtered Courses:', {
      total: filtered.length,
      searchTerm: searchTerm || 'none',
      categories: selectedCategory,
      grade: selectedGrade || 'none',
      sortOrder
    });

    setFilteredCourses(filtered);
  };

  // Update active filters
  useEffect(() => {
    const filters = [];
    
    if (searchTerm) {
      filters.push({ type: 'search', value: searchTerm });
    }
    
    if (selectedGrade) {
      filters.push({ type: 'grade', value: selectedGrade });
    }
    
    if (sortOrder !== "newest-first") {
      let sortLabel = "";
      switch(sortOrder) {
        case "A-Z": sortLabel = "A to Z"; break;
        case "Z-A": sortLabel = "Z to A"; break;
        case "oldest-first": sortLabel = "Oldest First"; break;
        case "duration-asc": sortLabel = "Duration (Short to Long)"; break;
        case "duration-desc": sortLabel = "Duration (Long to Short)"; break;
        default: sortLabel = sortOrder;
      }
      filters.push({ type: 'sort', value: sortLabel });
    }

    if (!hideCategoryFilter) {
      selectedCategory.forEach(cat => {
        filters.push({ type: 'category', value: cat });
      });
    }
    
    setActiveFilters(filters);
  }, [searchTerm, selectedCategory, sortOrder, selectedGrade, hideCategoryFilter]);

  useEffect(() => {
    if (fixedCategory) {
      setSelectedCategory([fixedCategory]);
    } else {
      setSelectedCategory([]);
    }
  }, [fixedCategory]);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedCategory, sortOrder, selectedGrade]);

  useEffect(() => {
    if (allCourses.length > 0) {
      applyFilters(allCourses);
    }
  }, [allCourses, searchTerm, selectedCategory, selectedGrade, sortOrder]);

  // Simplify page change handler to just update state without scrolling
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    // Reset to page 1 when changing sort order
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory([]);
    setSearchTerm("");
    setSortOrder("newest-first");
    setSelectedGrade(null);
    setCurrentPage(1);
  };

  const removeFilter = (filterType, value) => {
    if (filterType === 'search') {
      setSearchTerm('');
    } else if (filterType === 'grade') {
      setSelectedGrade(null);
    } else if (filterType === 'sort') {
      setSortOrder('newest-first');
    } else if (filterType === 'category') {
      setSelectedCategory(prev => prev.filter(cat => cat !== value));
    }
    // Reset to page 1 when removing a filter
    setCurrentPage(1);
  };

  // Prevent unnecessary re-renders
  const memoizedFilteredAndSortedCourses = useMemo(() => {
    return filteredCourses;
  }, [filteredCourses]);

  // Function to handle refresh
  const handleRefresh = async (showLoading = true) => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      if (showLoading) setIsLoading(true);
      
      await fetchCourses();
      setLastRefreshTime(new Date());
      
      // Show a subtle notification that data was refreshed
      const event = new CustomEvent('courseDataRefreshed', { 
        detail: { timestamp: new Date() } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error refreshing courses:', error);
      setQueryError('Failed to refresh courses. Will try again.');
    } finally {
      setIsRefreshing(false);
      if (showLoading) setIsLoading(false);
    }
  };

  // Initial load and auto-refresh setup
  useEffect(() => {
    // Initial load
    handleRefresh(true);

    // Setup auto-refresh if enabled
    if (enableAutoRefresh) {
      const setupAutoRefresh = () => {
        refreshTimeoutRef.current = setTimeout(() => {
          handleRefresh(false); // Don't show loading state for auto-refresh
          setupAutoRefresh(); // Setup next refresh
        }, autoRefreshInterval);
      };

      setupAutoRefresh();

      // Cleanup
      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
      };
    }
  }, [enableAutoRefresh, autoRefreshInterval]);

  // Reset refresh timer when filters change
  useEffect(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    if (enableAutoRefresh) {
      refreshTimeoutRef.current = setTimeout(() => {
        handleRefresh(false);
      }, autoRefreshInterval);
    }
  }, [searchTerm, selectedCategory, sortOrder, selectedGrade, currentPage]);

  // Add visibility change handler to refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enableAutoRefresh) {
        handleRefresh(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Render only on client to prevent hydration mismatches
  if (!isClient) {
    return null;
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-[2100px] mx-auto w-full px-4 md:px-6 lg:px-8 py-8">
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-2">
                  {CustomText || "Skill Development Courses"}
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    Discover courses tailored to your learning journey
                  </p>
                  {lastRefreshTime && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • Last updated {new Date(lastRefreshTime).toLocaleTimeString()}
                    </span>
                  )}
                  <button
                    onClick={() => handleRefresh(true)}
                    disabled={isRefreshing}
                    className={`p-1.5 rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 ${isRefreshing ? 'animate-spin' : ''}`}
                    title="Refresh courses"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 md:mt-0">{CustomButton}</div>
            </div>

            {/* Search and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
              {/* Search Field */}
              <div className="md:col-span-5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, category, instructor, or description..."
                  value={searchTerm}
                  onChange={memoizedHandleSearch}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }
                  }}
                  suppressHydrationWarning={true}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Grade Filter */}
              <div className="md:col-span-3 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <select
                  value={selectedGrade || ""}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    setCurrentPage(1);
                  }}
                  suppressHydrationWarning={true}
                  className="w-full pl-10 pr-10 py-3 rounded-xl appearance-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                >
                  <option value="">All Grade Levels</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </div>

              {/* Sort Order */}
              <div className="md:col-span-4 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <select
                  value={sortOrder}
                  onChange={memoizedHandleSortChange}
                  suppressHydrationWarning={true}
                  className="w-full pl-10 pr-10 py-3 rounded-xl appearance-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                >
                  <option value="newest-first">Newest First</option>
                  <option value="oldest-first">Oldest First</option>
                  <option value="A-Z">Title (A-Z)</option>
                  <option value="Z-A">Title (Z-A)</option>
                  <option value="duration-asc">Duration (Short to Long)</option>
                  <option value="duration-desc">Duration (Long to Short)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.map((filter, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full pl-3 pr-2 py-1.5 text-sm"
                  >
                    <span className="mr-1 capitalize">{filter.type === 'category' ? '' : `${filter.type}:`}</span>
                    <span className="font-medium truncate max-w-[200px]">{filter.value}</span>
                    <button 
                      onClick={() => removeFilter(filter.type, filter.value)}
                      className="ml-1 p-1 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={handleClearFilters}
                  className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium pl-2 pr-3 py-1.5 border border-primary-200 dark:border-primary-800/30 rounded-full transition-colors"
                >
                  <X size={14} className="mr-1" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2100px] mx-auto w-full px-4 md:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-1000 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-4xl">{description}</p>
          )}
          
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Desktop Filters */}
            {(!hideCategoryFilter || !hideGradeFilter) && (
              <div className="hidden md:block w-full md:w-1/5 lg:w-[18%] max-w-[280px]">
                <div className="sticky top-24 space-y-6">
                  {/* Categories Filter */}
                  {!hideCategoryFilter && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {categoryTitle || "Categories"}
                      </h3>
                      <CategoryFilter
                        categories={availableCategories || categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={(categories) => {
                          setSelectedCategory(categories);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  )}

                  {/* Grade Filter */}
                  {!hideGradeFilter && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {gradeTitle}
                      </h3>
                      <GradeFilter
                        grades={availableGrades}
                        selectedGrade={selectedGrade}
                        setSelectedGrade={(grade) => {
                          setSelectedGrade(grade);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Course Grid */}
            <div className="flex-1 w-full min-w-0">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[50vh] w-full">
                  <Preloader2 />
                </div>
              ) : filteredCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
                    {filteredCourses.map((course, index) => (
                      <div 
                        key={course._id || index}
                        className="transition-all duration-500 h-full"
                        style={{ 
                          transitionDelay: `${index * 50}ms`,
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                        }}
                      >
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="mt-16">
                      <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={memoizedHandlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                    <Search size={24} className="text-primary-500 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {queryError || "No courses found"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    {isLoading ? "Loading courses..." : 
                     error ? "There was an error loading the courses. Please try again." :
                     "We couldn't find any courses matching your criteria. Try adjusting your filters or search terms."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => fetchCourses()}
                      className="px-6 py-2.5 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors"
                    >
                      Retry Loading
                    </button>
                  </div>
                  {process.env.NODE_ENV === 'development' && queryError && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left w-full">
                      <p className="text-red-600 dark:text-red-400 text-sm font-mono break-all">
                        Error: {queryError}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Category Slider */}
      {(!hideCategoryFilter || !hideGradeFilter) && categorySliderOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCategorySliderOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                <button 
                  onClick={() => setCategorySliderOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Mobile Category Filter */}
                {!hideCategoryFilter && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      {categoryTitle || "Categories"}
                    </h4>
                    <CategoryFilter
                      categories={availableCategories || categories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={(categories) => {
                        setSelectedCategory(categories);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                )}

                {/* Mobile Grade Filter */}
                {!hideGradeFilter && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      {gradeTitle}
                    </h4>
                    <GradeFilter
                      grades={availableGrades}
                      selectedGrade={selectedGrade}
                      setSelectedGrade={(grade) => {
                        setSelectedGrade(grade);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Clear filters button */}
              {(selectedCategory.length > 0 || selectedGrade || searchTerm) && (
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center justify-center w-full px-4 py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30 font-medium rounded-lg transition-colors"
                  >
                    <X size={18} className="mr-2" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {queryError && (
        <div className="text-red-500 p-4 text-center">
          {queryError}
        </div>
      )}
    </section>
  );
};

CoursesFilter.propTypes = {
  CustomButton: PropTypes.node,
  CustomText: PropTypes.string,
  scrollToTop: PropTypes.func,
  fixedCategory: PropTypes.string,
  hideCategoryFilter: PropTypes.bool,
  hideGradeFilter: PropTypes.bool,
  availableCategories: PropTypes.arrayOf(PropTypes.string),
  availableGrades: PropTypes.arrayOf(PropTypes.string),
  categoryTitle: PropTypes.string,
  gradeTitle: PropTypes.string,
  description: PropTypes.string,
  autoRefreshInterval: PropTypes.number,
  enableAutoRefresh: PropTypes.bool,
};

export default CoursesFilter;
