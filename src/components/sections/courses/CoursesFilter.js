"use client";
import { useEffect, useState, useRef } from "react";
import CategoryFilter from "./CategoryFilter";
import CourseCard from "./CourseCard";
import Pagination from "@/components/shared/pagination/Pagination";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useRouter } from "next/navigation";
import { X, Filter, Search, ChevronDown, Zap } from "lucide-react";
import Preloader2 from "@/components/shared/others/Preloader2";
import CategoryToggle from "@/components/shared/courses/CategoryToggle";

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

const CoursesFilter = ({ CustomButton, CustomText, scrollToTop }) => {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest-first");
  const { getQuery, loading } = useGetQuery();
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [categorySliderOpen, setCategorySliderOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Create ref for the main content area for scrolling
  const contentRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top ONLY when component initially mounts, not on filter changes
  useEffect(() => {
    // Only execute once when component first mounts
    if (typeof window !== 'undefined' && scrollToTop) {
      scrollToTop();
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Remove the scroll-to-top effect on pagination/filter changes
  // This allows the component to refresh without scrolling

  const toggleCategorySlider = () => {
    setCategorySliderOpen(!categorySliderOpen);
  };

  // Fetch courses from API
  const fetchCourses = () => {
    const categoryQuery = selectedCategory ? selectedCategory : [];
    const gradeQuery = selectedGrade || "";

    getQuery({
      url: apiUrls?.courses?.getAllCoursesWithLimits(
        currentPage,
        6,
        "",
        "",
        "",
        "Published",
        searchTerm,
        gradeQuery,
        categoryQuery
      ),
      onSuccess: (data) => {
        setAllCourses(data?.courses || []);
        setTotalPages(data?.totalPages || 1);
      },
      onFail: (error) => {
        console.error("Error fetching courses:", error);
      },
    });
  };

  const applyFilters = () => {
    let filtered = allCourses;

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          (course.course_title &&
            course.course_title
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (course.course_category &&
            course.course_category
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (course.course_duration &&
            course.course_duration
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory && selectedCategory.length) {
      filtered = filtered.filter((course) => {
        const lowercase = selectedCategory.map((c) => c.toLowerCase());

        if (course.category) {
          return lowercase.includes(course.category.toLowerCase());
        } else {
          return false;
        }
      });
    }

    // Sorting the filtered courses based on the selected sort order
    if (sortOrder === "A-Z") {
      filtered = filtered.sort((a, b) => {
        if (a.course_title.toLowerCase() < b.course_title.toLowerCase())
          return -1;
        if (a.course_title.toLowerCase() > b.course_title.toLowerCase())
          return 1;
        return 0;
      });
    } else if (sortOrder === "Z-A") {
      filtered = filtered.sort((a, b) => {
        if (a.course_title.toLowerCase() < b.course_title.toLowerCase())
          return 1;
        if (a.course_title.toLowerCase() > b.course_title.toLowerCase())
          return -1;
        return 0;
      });
    } else if (sortOrder === "newest-first") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOrder === "oldest-first") {
      filtered = filtered.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortOrder === "duration-asc") {
      filtered = filtered.sort((a, b) => {
        const durationA = extractWeeks(a.course_duration);
        const durationB = extractWeeks(b.course_duration);
        return durationA - durationB;
      });
    } else if (sortOrder === "duration-desc") {
      filtered = filtered.sort((a, b) => {
        const durationA = extractWeeks(a.course_duration);
        const durationB = extractWeeks(b.course_duration);
        return durationB - durationA;
      });
    }
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

    selectedCategory.forEach(cat => {
      filters.push({ type: 'category', value: cat });
    });
    
    setActiveFilters(filters);
  }, [searchTerm, selectedCategory, sortOrder, selectedGrade]);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedCategory, sortOrder, selectedGrade]);

  useEffect(() => {
    applyFilters();
  }, [allCourses, searchTerm, selectedCategory]);

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

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12" ref={contentRef}>
      <div className="container mx-auto px-4">
        {/* Header with animation */}
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4 md:mb-0">
              {CustomText || "Skill Development Courses"}
            </h1>
            <div>{CustomButton}</div>
          </div>
          
          {/* Search and filter controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Grade filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Zap size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <select
                id="gradeFilter"
                className="w-full pl-10 pr-10 py-3 rounded-lg appearance-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                value={selectedGrade || ""}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when changing grade
                }}
              >
                <option value="">All Grade Levels</option>
                {grades.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>

            {/* Sort order */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <select
                className="w-full pl-10 pr-10 py-3 rounded-lg appearance-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                value={sortOrder}
                onChange={handleSortChange}
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
          
          {/* Active filters display */}
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
                    aria-label={`Remove ${filter.type} filter: ${filter.value}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={handleClearFilters}
                className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium pl-2 pr-3 py-1.5 border border-primary-200 dark:border-primary-800/30 rounded-full transition-colors"
                aria-label="Clear all filters"
              >
                <X size={14} className="mr-1" />
                Clear All
              </button>
            </div>
          )}
          
          {/* Mobile category toggle */}
          <div className="block md:hidden mb-6">
            <button
              onClick={toggleCategorySlider}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow transition-all"
              aria-expanded={categorySliderOpen}
              aria-label="Toggle category filter"
            >
              <span className="flex items-center text-gray-700 dark:text-gray-200">
                <Filter size={18} className="mr-2 text-primary-500 dark:text-primary-400" />
                Categories
              </span>
              <ChevronDown 
                size={18} 
                className={`text-gray-500 transition-transform duration-300 ${categorySliderOpen ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
        </div>

        {/* Filter and content area */}
        <div className={`transition-all duration-1000 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CategoryToggle
            categorySliderOpen={categorySliderOpen}
            toggleCategorySlider={toggleCategorySlider}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={(categories) => {
              setSelectedCategory(categories);
              setCurrentPage(1); // Reset to page 1 when changing categories
            }}
            handleClearFilters={handleClearFilters}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
          />
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Categories Section */}
            <div className="hidden md:block w-1/4 transition-all">
              <div className="sticky top-24 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Categories
                </h3>
                
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(categories) => {
                    setSelectedCategory(categories);
                    setCurrentPage(1); // Reset to page 1 when changing categories
                  }}
                />
              </div>
            </div>
            
            {/* Courses grid */}
            <div className="w-full md:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                  <Preloader2 />
                </div>
              ) : filteredCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                      <div 
                        key={course._id || index}
                        className="transition-all duration-500"
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                    <Search size={24} className="text-primary-500 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No courses found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We couldn't find any courses matching your search criteria.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Backdrop for mobile category slider */}
        {categorySliderOpen && (
          <div
            className="md:hidden backdrop-blur-sm bg-black bg-opacity-50 fixed top-0 left-0 w-full h-[100vh] z-[1000001]"
            onClick={() => {
              setCategorySliderOpen(false);
            }}
            aria-hidden="true"
          ></div>
        )}
      </div>
    </section>
  );
};

export default CoursesFilter;
