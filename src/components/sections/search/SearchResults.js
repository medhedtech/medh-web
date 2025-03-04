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

  // Filter options
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  
  // UI state
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const filterDrawerRef = useRef(null);
  const router = useRouter();
  
  // Content type options (similar to YouTube's filters)
  const contentTypes = [
    { id: "all", label: "All", icon: <LayoutGrid size={16} /> },
    { id: "course", label: "Courses", icon: <BookOpen size={16} /> },
    { id: "lesson", label: "Lessons", icon: <GraduationCap size={16} /> },
    { id: "live", label: "Live Sessions", icon: <Users size={16} /> }
  ];
  
  // Duration filters (similar to YouTube)
  const durationFilters = [
    { id: "", label: "Any duration" },
    { id: "short", label: "Under 1 week" },
    { id: "medium", label: "1-4 weeks" },
    { id: "long", label: "4+ weeks" }
  ];
  
  // Upload date filters (similar to YouTube)
  const dateFilters = [
    { id: "", label: "Any time" },
    { id: "hour", label: "Last hour" },
    { id: "today", label: "Today" },
    { id: "week", label: "This week" },
    { id: "month", label: "This month" },
    { id: "year", label: "This year" }
  ];
  
  // Categories (reusing from CoursesFilter)
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
  
  // Sort options (similar to YouTube)
  const sortOptions = [
    { id: "relevance", label: "Relevance" },
    { id: "date", label: "Upload date" },
    { id: "rating", label: "Rating" },
    { id: "popularity", label: "Popularity" }
  ];

  // Preloaded sections data
  const sections = [
    {
      id: 'trending',
      label: 'Trending Now',
      icon: <Zap size={16} className="mr-2 text-red-500" />,
      filter: { sort: 'popularity', duration: 'short' }
    },
    {
      id: 'most_viewed',
      label: 'Most Viewed',
      icon: <Eye size={16} className="mr-2 text-blue-500" />,
      filter: { sort: 'views', duration: 'all' }
    },
    {
      id: 'recommended',
      label: 'Recommended for You',
      icon: <Heart size={16} className="mr-2 text-pink-500" />,
      filter: { sort: 'relevance', category: 'user-interest' }
    },
    {
      id: 'new_courses',
      label: 'New Releases',
      icon: <Newspaper size={16} className="mr-2 text-green-500" />,
      filter: { sort: 'date', duration: 'month' }
    }
  ];

  // State for section data
  const [sectionData, setSectionData] = useState({
    trending: [],
    most_viewed: [],
    recommended: [],
    new_courses: []
  });

  // Fetch section data
  const fetchSectionData = useCallback(async (sectionId, filter) => {
    try {
      const apiUrl = apiUrls.courses.getAllCoursesWithLimits(
        1, // page
        4, // limit to 4 courses per section
        '', // course_title
        '', // course_tag
        filter.category || '', // course_category
        'Published', // status
        '', // search
        '', // course_grade
        '', // category
        '' // courseId
      );

      const response = await axios.get(`${apiBaseUrl}${apiUrl}`);
      if (response.data && response.data.courses) {
        setSectionData(prev => ({
          ...prev,
          [sectionId]: response.data.courses
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${sectionId} courses:`, error);
    }
  }, []);

  // Fetch data for all sections on mount
  useEffect(() => {
    sections.forEach(section => {
      fetchSectionData(section.id, section.filter);
    });
  }, [fetchSectionData]);

  // Then update the RatingStars component (temporary solution)
  const RatingStars = ({ rating }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < Math.floor(rating) 
              ? "text-yellow-400 fill-yellow-400" 
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  // Search function
  const performSearch = useCallback(async () => {
    if (!query) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Transform filters for API
      const contentTypeFilter = selectedContentType !== "all" ? selectedContentType : "";
      
      // Handle multiple categories
      const categoryFilter = selectedCategory.length > 0 ? selectedCategory.join(",") : "";
      
      // Convert duration filter to weeks
      let durationFilter = "";
      if (selectedDuration === "short") durationFilter = "0-1";
      else if (selectedDuration === "medium") durationFilter = "1-4";
      else if (selectedDuration === "long") durationFilter = "4+";
      
      // Convert date filter to timestamp
      let dateFilter = "";
      const now = new Date();
      if (selectedDate === "hour") {
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        dateFilter = hourAgo.toISOString();
      } else if (selectedDate === "today") {
        const today = new Date(now.setHours(0, 0, 0, 0));
        dateFilter = today.toISOString();
      } else if (selectedDate === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = weekAgo.toISOString();
      } else if (selectedDate === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = monthAgo.toISOString();
      } else if (selectedDate === "year") {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = yearAgo.toISOString();
      }

      // Map sort options to API parameters
      let sortParam = "";
      switch (sortBy) {
        case "date":
          sortParam = "newest";
          break;
        case "rating":
          sortParam = "rating";
          break;
        case "popularity":
          sortParam = "popular";
          break;
        default:
          sortParam = "relevance";
      }

      // Call search API with improved parameters
      const apiUrl = apiUrls?.courses?.getAllCoursesWithLimits(
        currentPage,
        12, // items per page
        sortParam, // Use mapped sort parameter
        contentTypeFilter, // course type
        categoryFilter, // categories
        "Published", // status
        query.trim(), // search term (trimmed)
        "", // grade (not used in search)
        dateFilter, // upload date filter
        durationFilter // duration filter
      );
      
      const response = await axios.get(`${apiBaseUrl}${apiUrl}`);
      
      if (response.data) {
        // Transform response data to match expected format
        const transformedResults = response.data.courses.map(course => ({
          ...course,
          id: course._id, // Ensure id is available for key prop
          thumbnail_url: course.thumbnail_url || course.thumbnail || "/assets/images/placeholder-course.jpg",
          duration: course.course_duration || "Duration not specified",
          rating: course.avg_rating || 0,
          enrolled_count: course.enrolled_students?.length || 0,
          category: course.course_category || course.category || "Uncategorized"
        }));

        setResults(transformedResults);
        setTotalResults(response.data.totalItems || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setResults([]);
        setTotalResults(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to load search results. Please try again.");
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [
    query, 
    currentPage, 
    selectedContentType, 
    selectedDuration, 
    selectedCategory, 
    selectedDate,
    sortBy
  ]);

  // Update search when query changes with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  // Search when filters change
  useEffect(() => {
    // Build active filters list based on selections
    const newActiveFilters = [];
    
    if (selectedContentType !== "all") {
      const contentType = contentTypes.find(c => c.id === selectedContentType);
      newActiveFilters.push({
        type: 'contentType',
        value: contentType?.label || selectedContentType
      });
    }
    
    if (selectedDuration) {
      const duration = durationFilters.find(d => d.id === selectedDuration);
      newActiveFilters.push({
        type: 'duration',
        value: duration?.label || selectedDuration
      });
    }
    
    if (selectedDate) {
      const date = dateFilters.find(d => d.id === selectedDate);
      newActiveFilters.push({
        type: 'date',
        value: date?.label || selectedDate
      });
    }
    
    selectedCategory.forEach(category => {
      newActiveFilters.push({
        type: 'category',
        value: category
      });
    });
    
    setActiveFilters(newActiveFilters);
    
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // Only search if we're already on page 1
      performSearch();
    }
  }, [
    selectedContentType, 
    selectedDuration, 
    selectedCategory, 
    selectedDate,
    sortBy,
    performSearch
  ]);
  
  // Search when page changes
  useEffect(() => {
    performSearch();
  }, [currentPage, performSearch]);
  
  // Initial search on load
  useEffect(() => {
    if (initialQuery) {
      performSearch();
    }
  }, [initialQuery, performSearch]);
  
  // Update URL when query changes
  useEffect(() => {
    if (query) {
      // Update URL without full page reload
      const url = `/search?q=${encodeURIComponent(query)}`;
      window.history.replaceState({ path: url }, '', url);
    }
  }, [query, router]);
  
  // Close filter drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDrawerRef.current && !filterDrawerRef.current.contains(event.target)) {
        setFiltersVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handler functions
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };
  
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Update URL without full page reload
    const url = new URL(window.location);
    if (newQuery) {
      url.searchParams.set('q', newQuery);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === "list" ? "grid" : "list");
  };
  
  const handleSortChange = (id) => {
    setSortBy(id);
  };
  
  const handleContentTypeChange = (id) => {
    setSelectedContentType(id);
  };
  
  const handleDurationChange = (id) => {
    setSelectedDuration(prev => prev === id ? "" : id);
  };
  
  const handleDateChange = (id) => {
    setSelectedDate(prev => prev === id ? "" : id);
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const clearAllFilters = () => {
    setSelectedContentType("all");
    setSelectedDuration("");
    setSelectedCategory([]);
    setSelectedDate("");
    setSortBy("relevance");
    setActiveFilters([]);
  };
  
  const removeFilter = (type, value) => {
    if (type === 'contentType') {
      setSelectedContentType("all");
    } else if (type === 'duration') {
      setSelectedDuration("");
    } else if (type === 'date') {
      setSelectedDate("");
    } else if (type === 'category') {
      setSelectedCategory(prev => prev.filter(c => c !== value));
    }
  };
  
  // Format duration (weeks/months) for display
  const formatDuration = (duration) => {
    if (!duration) return "Duration not specified";
    
    const matches = duration.match(/^(\d+)\s*(week|month)s?$/i);
    if (!matches) return duration;
    
    const value = parseInt(matches[1], 10);
    const unit = matches[2].toLowerCase();
    
    if (unit === "week") {
      return value === 1 ? "1 week" : `${value} weeks`;
    } else if (unit === "month") {
      return value === 1 ? "1 month" : `${value} months`;
    }
    
    return duration;
  };

  // Add preview handler
  const handlePreviewCourse = (course) => {
    setPreviewCourse(course);
    // Add logic to fetch detailed preview data
  };

  // Add preview modal component
  const CoursePreview = ({ course }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="relative aspect-video">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{course.title}</h3>
            <div className="flex items-center gap-2 mb-4">
              <RatingStars rating={course.rating} />
              <span>({course.reviews} reviews)</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search header with filters */}
      <div className="mb-6 sticky top-16 z-30 bg-white dark:bg-gray-900 py-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
          <div className="flex flex-wrap items-center mt-3 gap-2">
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
            className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fadeIn"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Content Type filter */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Content Type</h3>
                <div className="space-y-2">
                  {contentTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handleContentTypeChange(type.id)}
                      className={`flex items-center w-full gap-2 px-3 py-2 rounded-lg text-left ${
                        selectedContentType === type.id
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                          : "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {type.icon}
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Duration filter */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Duration</h3>
                <div className="space-y-2">
                  {durationFilters.map(duration => (
                    <button
                      key={duration.id}
                      onClick={() => handleDurationChange(duration.id)}
                      className={`flex items-center w-full gap-2 px-3 py-2 rounded-lg text-left ${
                        selectedDuration === duration.id
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                          : "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <Clock size={16} className="opacity-70" />
                      <span>{duration.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Upload date filter */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Date</h3>
                <div className="space-y-2">
                  {dateFilters.map(date => (
                    <button
                      key={date.id}
                      onClick={() => handleDateChange(date.id)}
                      className={`flex items-center w-full gap-2 px-3 py-2 rounded-lg text-left ${
                        selectedDate === date.id
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                          : "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <Calendar size={16} className="opacity-70" />
                      <span>{date.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Category filter */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Categories</h3>
                <div className="max-h-60 overflow-y-auto pr-2 space-y-1.5">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategory.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sort by section */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sort by</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === option.id
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* EdTech Specific filters */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">EdTech Specific</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Skill Level</h4>
                  <div className="space-y-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Features</h4>
                  <div className="space-y-2">
                    {['Certification', 'Hands-on', 'Mentorship', 'Placement'].map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Language</h4>
                  <select className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-sm">
                    {['English', 'Hindi', 'Tamil', 'Spanish', 'French'].map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Course Type</h4>
                  <div className="space-y-2">
                    {['Self-paced', 'Live', 'Hybrid', 'Corporate'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
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

      {/* Preloaded sections */}
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
                  {sectionData[section.id].map((course) => (
                    <div key={course._id} className="w-72 flex-shrink-0">
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

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className={`
          ${viewMode === "list" 
            ? "flex flex-col gap-4" 
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}
        `}>
          {results.map((item) => (
            <div 
              key={item.id} 
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
                <Link href={`/course-details/${item.id}`}>
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <Image
                    src={item.thumbnail_url || "/assets/images/placeholder-course.jpg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                    onLoad={(e) => e.target.previousSibling?.classList.add('hidden')}
                  />
                  {item.course_duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {formatDuration(item.course_duration)}
                    </div>
                  )}
                </Link>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                <Link href={`/course-details/${item.id}`}>
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
                  {item.created_at && (
                    <span className="inline-flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {/* Description */}
                {viewMode === "list" && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {item.description || "No description available."}
                  </p>
                )}
                
                {/* Stats like views, ratings */}
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {item.enrolled_count && (
                    <span className="flex items-center">
                      <Users size={12} className="mr-1" />
                      {item.enrolled_count.toLocaleString()} enrolled
                    </span>
                  )}
                  {item.avg_rating && (
                    <span className="flex items-center">
                      <ThumbsUp size={12} className="mr-1" />
                      {parseFloat(item.avg_rating).toFixed(1)}
                    </span>
                  )}
                  {item.completion_rate && (
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
  );
};

export default SearchResults; 