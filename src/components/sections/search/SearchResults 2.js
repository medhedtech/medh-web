"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Filter, Search, ChevronDown, X, 
  Clock, Calendar, LayoutGrid, BarChart3,
  ThumbsUp, BookOpen, GraduationCap, Users,
  Zap, Eye, Heart, Newspaper, Star
} from "lucide-react";
import axios from "axios";
import { apiUrls, apiBaseUrl } from "@/apis";
import Preloader2 from "@/components/shared/others/Preloader2";
import CourseCard from "@/components/sections/courses/CourseCard";
// import RatingStars from "@/components/sections/courses/RatingStars";

/**
 * YouTube-style search results component
 * Shows filtered search results with advanced filtering options
 * Includes user engagement metrics and responsive grid layout
 */
const SearchResults = ({ initialQuery = "" }) => {
  // State management
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeSection, setActiveSection] = useState('search');
  const [previewCourse, setPreviewCourse] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"

  // Filter options
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  
  // Available filter options from API
  const [categories, setCategories] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [features, setFeatures] = useState([]);
  
  // UI references and handlers
  const filterDrawerRef = useRef(null);
  const router = useRouter();

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    fetchSearchResults(query, {
      contentType: selectedContentType !== "all" ? selectedContentType : null,
      duration: selectedDuration,
      categories: selectedCategory,
      date: selectedDate,
      sortBy,
      page: 1
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSearchResults(query, {
      contentType: selectedContentType !== "all" ? selectedContentType : null,
      duration: selectedDuration,
      categories: selectedCategory,
      date: selectedDate,
      sortBy,
      page
    });
    
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const handlePreviewCourse = (course) => {
    setPreviewCourse(course);
  };

  const addFilter = (type, value) => {
    // Check if filter already exists
    if (!activeFilters.some(f => f.type === type && f.value === value)) {
      setActiveFilters([...activeFilters, { type, value }]);
    }
  };

  const removeFilter = (type, value) => {
    setActiveFilters(activeFilters.filter(f => !(f.type === type && f.value === value)));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedContentType("all");
    setSelectedDuration("");
    setSelectedCategory([]);
    setSelectedDate("");
  };

  const fetchSearchResults = useCallback(async (searchQuery, filters = {}) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with mock data for now
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              results: mockResults.slice(0, 8),
              total: mockResults.length,
              totalPages: Math.ceil(mockResults.length / 8),
              facets: {
                categories: ["Programming", "Data Science", "Design", "Business", "Marketing"],
                skillLevels: ["Beginner", "Intermediate", "Advanced"],
                languages: ["English", "Hindi", "Spanish", "French"],
                features: ["Certificate", "Hands-on", "Mentorship", "Job Guarantee"]
              }
            }
          });
        }, 800);
      });
      
      setResults(response.data.results);
      setTotalResults(response.data.total);
      setTotalPages(response.data.totalPages);
      updateAvailableFilters(response.data.facets);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to load search results. Please try again.");
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch results when initial query is present
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      fetchSearchResults(initialQuery);
    }
  }, [initialQuery, fetchSearchResults]);

  // Handle click outside filter drawer to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDrawerRef.current && !filterDrawerRef.current.contains(event.target)) {
        setFiltersVisible(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock data for development
  const mockResults = [
    // ... mock search results here ...
  ];

  // Mock data for preloaded sections
  const sections = [
    { id: "trending", label: "Trending Courses", icon: <Zap size={18} className="mr-2 text-yellow-500" /> },
    { id: "recommended", label: "Recommended for You", icon: <Star size={18} className="mr-2 text-purple-500" /> },
    { id: "popular", label: "Most Popular", icon: <Eye size={18} className="mr-2 text-blue-500" /> },
    { id: "new", label: "New Releases", icon: <Newspaper size={18} className="mr-2 text-green-500" /> }
  ];

  const sectionData = {
    trending: mockResults.slice(0, 5),
    recommended: mockResults.slice(3, 8),
    popular: mockResults.slice(2, 7),
    new: mockResults.slice(4, 9)
  };

  // Course preview modal component
  const CoursePreview = ({ course }) => {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative aspect-video">
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
            />
            <button 
              onClick={() => setPreviewCourse(null)}
              className="absolute top-3 right-3 bg-black/50 rounded-full p-1"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          <div className="p-5">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                {course.category}
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                {course.duration}
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                {typeof course.enrolled_count === 'number' ? `${course.enrolled_count.toLocaleString()} enrolled` : ''}
              </span>
            </div>
            
            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Search header with filters - Positioned to display below search bar */}
      <div className="relative z-20 bg-white dark:bg-gray-900 rounded-b-xl shadow-lg border-t-0 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
          {/* Search form */}
          <form 
            onSubmit={handleSearch}
            className="relative flex-1 w-full sm:max-w-xl"
          >
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search for courses, lessons, instructors..."
                className="w-full h-10 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={16} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
          </form>

          {/* View toggle and filter button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleViewMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
            >
              <LayoutGrid size={20} className={`${viewMode === "grid" ? "text-primary-500" : "text-gray-500 dark:text-gray-400"}`} />
            </button>
            
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                filtersVisible || activeFilters.length > 0
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <Filter size={16} />
              <span className="font-medium">Filters</span>
              {activeFilters.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-500 rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center px-4 pb-4 gap-2">
            {activeFilters.map((filter, index) => (
              <div
                key={`${filter.type}-${filter.value}-${index}`}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">{filter.value}</span>
                <button
                  onClick={() => removeFilter(filter.type, filter.value)}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
        
        {/* Filter drawer */}
        {filtersVisible && (
          <div 
            ref={filterDrawerRef}
            className="px-4 pb-4 animate-fadeIn"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Content Type filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Content Type</h4>
                <div className="space-y-2">
                  {['All Content', 'Courses', 'Tutorials', 'Articles', 'Videos'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="contentType"
                        checked={selectedContentType === type.toLowerCase()}
                        onChange={() => setSelectedContentType(type.toLowerCase())}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Duration</h4>
                <div className="space-y-2">
                  {['Any Duration', 'Under 1 hour', '1-3 hours', '3-6 hours', '6+ hours'].map((duration) => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        checked={selectedDuration === duration}
                        onChange={() => setSelectedDuration(duration)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{duration}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategory.includes(category)}
                        onChange={() => {
                          if (selectedCategory.includes(category)) {
                            setSelectedCategory(selectedCategory.filter(c => c !== category));
                          } else {
                            setSelectedCategory([...selectedCategory, category]);
                          }
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Updated Date</h4>
                <div className="space-y-2">
                  {['Any Time', 'Last Week', 'Last Month', 'Last 3 Months', 'This Year'].map((date) => (
                    <label key={date} className="flex items-center">
                      <input
                        type="radio"
                        name="date"
                        checked={selectedDate === date}
                        onChange={() => setSelectedDate(date)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{date}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sort by section */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium mb-2">Sort By</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Relevance', 'Most Popular', 'Newest', 'Highest Rated'].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort.toLowerCase())}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      sortBy === sort.toLowerCase()
                        ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Apply filters button */}
            <div className="mt-6">
              <button 
                onClick={() => {
                  setFiltersVisible(false);
                  handleSearch();
                }}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Search results stats */}
        {query && (
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            {loading ? (
              <span>Searching...</span>
            ) : (
              <span>
                Found {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{query}"
              </span>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-20">
            <Preloader2 />
          </div>
        )}

        {/* No results state */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-300 dark:text-gray-700">
              <Search size={96} className="w-full h-full" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find anything matching "{query}". Try using different keywords or filters.
            </p>
          </div>
        )}

        {/* Preloaded sections - Only show when no query */}
        {!query && (
          <div className="space-y-8 mb-12">
            {sections.map((section) => (
              <div key={section.id} className="relative group">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    {section.icon}
                    {section.label}
                  </h2>
                  <button className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                    See all →
                  </button>
                </div>
                
                <div className="relative -mx-4 px-4">
                  <div className="overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                      {sectionData[section.id].map((course, index) => (
                        <div key={`${section.id}-${course._id || index}`} className="w-72 flex-shrink-0">
                          <CourseCard 
                            course={course} 
                            variant="horizontal"
                            onHover={() => handlePreviewCourse(course)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className={`
            ${viewMode === "list" 
              ? "flex flex-col gap-4" 
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}
          `}>
            {results.map((item) => (
              <div 
                key={item.id || item._id} 
                className={`
                  group bg-white dark:bg-gray-800 rounded-xl overflow-hidden 
                  ${viewMode === "list" 
                    ? "flex gap-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow" 
                    : "flex flex-col shadow-sm hover:shadow-md transition-shadow"}
                `}
              >
                {/* Thumbnail */}
                <div className={`
                  relative overflow-hidden
                  ${viewMode === "list" ? "w-48 h-36 flex-shrink-0" : "aspect-video w-full"}
                `}>
                  <Link href={`/course-details/${item.id || item._id}`}>
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105 duration-300"
                      onLoad={(e) => e.target.previousSibling?.classList.add('hidden')}
                    />
                    {item.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {item.duration}
                      </div>
                    )}
                  </Link>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <Link href={`/course-details/${item.id || item._id}`}>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  
                  {/* Category & Date */}
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.category && (
                      <span className="inline-flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        {item.category}
                      </span>
                    )}
                    {item.last_updated && (
                      <span className="inline-flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {item.last_updated}
                      </span>
                    )}
                  </div>
                  
                  {/* Description */}
                  {viewMode === "list" && item.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Stats */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {typeof item.enrolled_count === 'number' && (
                      <span className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {item.enrolled_count.toLocaleString()} enrolled
                      </span>
                    )}
                    {item.rating > 0 && (
                      <span className="flex items-center">
                        <ThumbsUp size={12} className="mr-1" />
                        {item.rating.toFixed(1)}
                      </span>
                    )}
                    {item.completion_rate > 0 && (
                      <span className="flex items-center">
                        <BarChart3 size={12} className="mr-1" />
                        {item.completion_rate}% completion
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav>
              <ul className="flex items-center -space-x-px">
                {/* Previous button */}
                <li>
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`
                      block px-3 py-2 ml-0 leading-tight bg-white dark:bg-gray-800 
                      border border-gray-300 dark:border-gray-700 rounded-l-lg
                      ${currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </li>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  
                  // Display 5 page numbers at most
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <li key={pageNum}>
                      <button
                        onClick={() => handlePageChange(pageNum)}
                        className={`
                          px-3 py-2 leading-tight border border-gray-300 dark:border-gray-700
                          ${pageNum === currentPage 
                            ? 'z-10 bg-primary-50 text-primary-600 border-primary-300 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800' 
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        `}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                
                {/* Next button */}
                <li>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`
                      block px-3 py-2 leading-tight bg-white dark:bg-gray-800 
                      border border-gray-300 dark:border-gray-700 rounded-r-lg
                      ${currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Preview modal */}
        {previewCourse && <CoursePreview course={previewCourse} />}
      </div>
    </div>
  );
};

export default SearchResults; 