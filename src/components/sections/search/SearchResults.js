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
import { getAllCoursesWithLimits } from "@/apis/course/course";
// import RatingStars from "@/components/sections/courses/RatingStars";

// Import the pre-defined categories list
const categories = [
  // Removed: "AI and Data Science",
  "AI For Professionals",
  "Business And Management",
  "Career Development",
  "Communication And Soft Skills",
  "Data And Analytics",
  // Removed: "Digital Marketing with Data Analytics",
  "Environmental and Sustainability Skills",
  "Finance And Accounts",
  "Health And Wellness",
  "Industry-Specific Skills",
  "Language And Linguistic",
  "Legal And Compliance Skills",
  "Personal Well-Being",
  // Removed: "Personality Development",
  "Sales And Marketing",
  "Technical Skills",
  // Removed: "Vedic Mathematics",
];

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
  const [showingLatestFiltered, setShowingLatestFiltered] = useState(false);

  // Filter options
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  
  // Available filter options from API
  const [skillLevels, setSkillLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [features, setFeatures] = useState([]);
  
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
      const apiUrl = getAllCoursesWithLimits({
        page: 1,
        limit: 4,
        course_category: filter.category || '',
        status: 'Published'
      });

      const response = await axios.get(apiUrl);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Don't include fetchSectionData in dependencies

  // Then update the RatingStars component (temporary solution)
  const RatingStars = ({ rating }) => {
    // Ensure rating is a number
    const numericRating = typeof rating === 'number' ? rating : 
                         typeof rating === 'string' ? parseFloat(rating) || 0 : 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(numericRating) 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Fetch latest courses based on applied filters
  const fetchLatestFilteredCourses = useCallback(async () => {
    // Only proceed if there are active filters but no search query
    const hasActiveFilters = activeFilters.length > 0;
    
    if (!hasActiveFilters) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setShowingLatestFiltered(true);
    
    try {
      // Build filter object that translates UI selections to API parameters
      const filters = {
        skillLevel: [],
        courseType: '',
        language: '',
        features: [],
        sortBy: 'newest', // Always sort by newest for latest courses
        dateRange: {}
      };
      
      // Add content type filter
      if (selectedContentType !== 'all') {
        filters.courseType = selectedContentType;
      }
      
      // Add duration filter
      if (selectedDuration) {
        const [min, max] = {
          'short': [0, 1],
          'medium': [1, 4],
          'long': [4, 10],
          'extended': [10, 100]
        }[selectedDuration] || [0, 0];
        
        if (min > 0 || max > 0) {
          filters.durationRange = { min, max };
        }
      }
      
      // Add date filter
      if (selectedDate) {
        const now = new Date();
        switch (selectedDate) {
          case "today":
            filters.dateRange.start = new Date(now.setHours(0, 0, 0, 0)).toISOString();
            break;
          case "week":
            filters.dateRange.start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case "month":
            filters.dateRange.start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case "year":
            filters.dateRange.start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
            break;
        }
        filters.dateRange.end = now.toISOString();
      }
      
      const apiUrl = getAllCoursesWithLimits({
        page: 1,
        limit: 5,
        course_category: selectedCategory.join(','),
        status: "Published",
        filters: filters
      });
      
      console.log('Latest Filtered Courses URL:', apiUrl);
      
      const response = await axios.get(apiUrl);
      
      if (response.data) {
        // Transform and validate each course object
        const transformedResults = (response.data.courses || []).map(course => {
          if (!course) return null;
          
          try {
            // Handle course description - can be string or object
            let description = '';
            if (typeof course.course_description === 'string') {
              description = course.course_description;
            } else if (course.course_description?.program_overview) {
              description = course.course_description.program_overview;
            } else if (course.description) {
              description = course.description;
            }

            // Handle pricing - get first available price
            let price = 0;
            if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
              price = course.prices[0].individual || course.prices[0].batch || 0;
            } else if (course.price) {
              price = course.price;
            }

            return {
              ...course,
              id: course._id || course.id,
              title: course.title || course.course_title || 'Untitled Course',
              thumbnail_url: course.thumbnail_url || course.course_image || course.thumbnail || "/fallback-course-image.jpg",
              duration: formatDuration(course.course_duration),
              rating: parseFloat(course.meta?.ratings?.average || course.avg_rating || course.rating) || 0,
              enrolled_count: course.meta?.enrollments || Array.isArray(course.enrolled_students) ? course.enrolled_students.length : (course.enrolled_count || 0),
              category: course.course_category || course.category || "Uncategorized",
              completion_rate: calculateCompletionRate(course),
              skill_level: course.course_grade || course.skill_level || "All Levels",
              last_updated: formatLastUpdated(course.meta?.lastUpdated || course.updatedAt || course.updated_at || course.createdAt),
              instructor: formatInstructor(course.instructor),
              preview_available: !!course.preview_video,
              certification: course.is_Certification === "Yes" || !!course.certification,
              language: course.language || "English",
              description: description,
              price: price,
              reviews_count: course.meta?.ratings?.count || course.reviews_count || 0,
              tags: Array.isArray(course.tags) ? course.tags : [],
              status: course.status || "Published"
            };
          } catch (err) {
            console.error('Error transforming course:', err);
            return null;
          }
        }).filter(Boolean); // Remove any null results from failed transformations

        setResults(transformedResults);
        setTotalResults(transformedResults.length);
        setTotalPages(1); // Only one page for latest courses
      } else {
        setResults([]);
        setError('Received invalid response from server');
      }
    } catch (err) {
      console.error('Latest courses fetch error:', err);
      setResults([]);
      setError(`Failed to fetch latest courses: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [
    activeFilters,
    selectedContentType,
    selectedDuration,
    selectedCategory,
    selectedDate
  ]);

  // Fetch search results
  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      // If there are active filters but no search query, show latest filtered courses
      if (activeFilters.length > 0) {
        fetchLatestFilteredCourses();
        return;
      }
      
      // Otherwise, clear results
      setResults([]);
      setTotalResults(0);
      setError(null);
      setShowingLatestFiltered(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    setShowingLatestFiltered(false);
    
    try {
      // Build filter object that translates UI selections to API parameters
      const filters = {
        skillLevel: [],
        courseType: '',
        language: '',
        features: [],
        sortBy: 'relevance',
        dateRange: {}
      };
      
      // Add content type filter
      if (selectedContentType !== 'all') {
        filters.courseType = selectedContentType;
      }
      
      // Add duration filter
      if (selectedDuration) {
        const [min, max] = {
          'short': [0, 1],
          'medium': [1, 4],
          'long': [4, 10],
          'extended': [10, 100]
        }[selectedDuration] || [0, 0];
        
        if (min > 0 || max > 0) {
          filters.durationRange = { min, max };
        }
      }
      
      // Add date filter
      if (selectedDate) {
        const now = new Date();
        switch (selectedDate) {
          case "today":
            filters.dateRange.start = new Date(now.setHours(0, 0, 0, 0)).toISOString();
            break;
          case "week":
            filters.dateRange.start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case "month":
            filters.dateRange.start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case "year":
            filters.dateRange.start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
            break;
        }
        filters.dateRange.end = now.toISOString();
      }
      
      // Map sort options to API parameters
      switch (sortBy) {
        case "date":
          filters.sortBy = "newest";
          break;
        case "rating":
          filters.sortBy = "rating";
          break;
        case "popularity":
          filters.sortBy = "popular";
          break;
        default:
          filters.sortBy = "relevance";
      }
      
      const apiUrl = getAllCoursesWithLimits({
        page: currentPage,
        limit: 12,
        search: query.trim(),
        course_category: selectedCategory.join(','),
        status: "Published",
        filters: filters
      });
      
      console.log('Search URL:', apiUrl);
      console.log('Search Parameters:', {
        query: query.trim(),
        categoryFilter: selectedCategory,
        currentPage,
        selectedContentType,
        selectedDuration,
        selectedDate,
        sortBy,
        filters
      });
      
      const response = await axios.get(apiUrl);
      
      console.log('Search Response:', response.data);
      console.log('Response structure:', Object.keys(response.data));
      console.log('Response.data.data:', response.data.data);
      console.log('Response.data.courses:', response.data.courses);
      
      // The API might return data nested in a 'data' property
      const responseData = response.data.data || response.data;
      console.log('Using responseData:', responseData);
      console.log('ResponseData.courses:', responseData.courses);
      
      if (responseData) {
        // Transform and validate each course object
        const transformedResults = (responseData.courses || []).map(course => {
          if (!course) return null;
          
          try {
            // Handle course description - can be string or object
            let description = '';
            if (typeof course.course_description === 'string') {
              description = course.course_description;
            } else if (course.course_description?.program_overview) {
              description = course.course_description.program_overview;
            } else if (course.description) {
              description = course.description;
            }

            // Handle pricing - get first available price
            let price = 0;
            if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
              price = course.prices[0].individual || course.prices[0].batch || 0;
            } else if (course.price) {
              price = course.price;
            }

            return {
              ...course,
              id: course._id || course.id,
              title: course.title || course.course_title || 'Untitled Course',
              thumbnail_url: course.thumbnail_url || course.course_image || course.thumbnail || "/fallback-course-image.jpg",
              duration: formatDuration(course.course_duration),
              rating: parseFloat(course.meta?.ratings?.average || course.avg_rating || course.rating) || 0,
              enrolled_count: course.meta?.enrollments || Array.isArray(course.enrolled_students) ? course.enrolled_students.length : (course.enrolled_count || 0),
              category: course.course_category || course.category || "Uncategorized",
              completion_rate: calculateCompletionRate(course),
              skill_level: course.course_grade || course.skill_level || "All Levels",
              last_updated: formatLastUpdated(course.meta?.lastUpdated || course.updatedAt || course.updated_at || course.createdAt),
              instructor: formatInstructor(course.instructor),
              preview_available: !!course.preview_video,
              certification: course.is_Certification === "Yes" || !!course.certification,
              language: course.language || "English",
              description: description,
              price: price,
              reviews_count: course.meta?.ratings?.count || course.reviews_count || 0,
              tags: Array.isArray(course.tags) ? course.tags : [],
              status: course.status || "Published"
            };
          } catch (err) {
            console.error('Error transforming course:', err);
            return null;
          }
        }).filter(Boolean); // Remove any null results from failed transformations

        console.log('Transformed Results:', transformedResults);
        
        // Additional debug logging
        if (transformedResults.length === 0) {
          console.log('No results after transformation. Original data:', responseData.courses);
        } else {
          console.log('First result sample:', transformedResults[0]);
        }

        console.log('Setting totalResults to:', responseData.pagination?.total || responseData.total || transformedResults.length);
        console.log('Setting results array length:', transformedResults.length);

        setResults(transformedResults);
        setTotalResults(responseData.pagination?.total || responseData.total || transformedResults.length);
        setTotalPages(Math.max(1, Math.ceil((responseData.pagination?.total || responseData.total || transformedResults.length) / 12)));
        
        // Update available filters based on facets
        if (responseData.facets) {
          try {
            updateAvailableFilters(responseData.facets);
          } catch (err) {
            console.error('Error updating filters:', err);
            // Don't set an error state here as the search results are still valid
          }
        }
        
        // If no results found, set appropriate message
        if (transformedResults.length === 0) {
          setError(null); // Clear any previous errors
        }
      } else {
        setResults([]);
        setError('Received invalid response from server');
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      setError(`Failed to fetch results: ${err.response?.data?.message || err.message || 'Unknown error'}`);
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

  // Helper functions for data formatting
  const formatDuration = (duration) => {
    if (!duration) return "Duration not specified";
    
    const matches = duration.match(/^(\d+)\s*(week|month|day|hour)s?$/i);
    if (!matches) return duration;
    
    const value = parseInt(matches[1], 10);
    const unit = matches[2].toLowerCase();
    
    switch (unit) {
      case "week":
        return value === 1 ? "1 week" : `${value} weeks`;
      case "month":
        return value === 1 ? "1 month" : `${value} months`;
      case "day":
        return value === 1 ? "1 day" : `${value} days`;
      case "hour":
        return value === 1 ? "1 hour" : `${value} hours`;
      default:
        return duration;
    }
  };

  const calculateCompletionRate = (course) => {
    if (!course.enrolled_students?.length) return 0;
    const completedStudents = course.enrolled_students.filter(student => student.completed);
    return Math.round((completedStudents.length / course.enrolled_students.length) * 100);
  };

  const formatLastUpdated = (date) => {
    if (!date) return "";
    const updatedDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - updatedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)} months ago`;
    return `Updated ${Math.floor(diffDays / 365)} years ago`;
  };

  const formatInstructor = (instructor) => {
    if (!instructor) return { name: "Unknown Instructor" };
    return {
      name: instructor.name || `${instructor.first_name} ${instructor.last_name}`.trim(),
      avatar: instructor.avatar || instructor.profile_picture,
      title: instructor.title || instructor.designation,
      rating: instructor.rating || instructor.avg_rating || 0
    };
  };

  // Update available filters based on facets
  const updateAvailableFilters = (facets) => {
    if (facets) {
      // We're using predefined categories, so we don't need to update them from facets
      
      // Handle skill levels
      if (facets.skillLevels) {
        setSkillLevels(facets.skillLevels);
      }
      
      // Handle languages
      if (facets.languages) {
        setLanguages(facets.languages);
      }
      
      // Handle features
      if (facets.features) {
        setFeatures(facets.features);
      }
      
      console.log('Updated available filters:', { 
        skillLevels: facets.skillLevels,
        languages: facets.languages,
        features: facets.features
      });
    }
  };

  // Update search when query changes with debounce
  useEffect(() => {
    console.log('Query changed:', query);
    const debounceTimer = setTimeout(() => {
      if (query) {
        console.log('Triggering search for:', query);
        fetchResults();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // Remove fetchResults from dependency array to prevent infinite loop

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
      // fetchResults will be called by the currentPage useEffect
    } else {
      // Only search if we're already on page 1
      fetchResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedContentType, 
    selectedDuration, 
    selectedCategory, 
    selectedDate,
    sortBy
  ]); // Remove fetchResults from dependency array
  
  // Search when page changes
  useEffect(() => {
    fetchResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // Remove fetchResults from dependency array
  
  // Initial search on load
  useEffect(() => {
    console.log('Component mounted with initialQuery:', initialQuery);
    if (initialQuery) {
      console.log('Triggering initial search for:', initialQuery);
      fetchResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]); // Remove fetchResults from dependency array

  // Also trigger search immediately if query exists on mount
  useEffect(() => {
    if (query && !loading) {
      console.log('Component has query on mount, triggering search:', query);
      fetchResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount
  
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
    fetchResults();
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
              src={course.thumbnail_url || course.thumbnail || "/fallback-course-image.jpg"}
              alt={course.title || 'Course Preview'}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{course.title || 'Course Preview'}</h3>
            <div className="flex items-center gap-2 mb-4">
              <RatingStars rating={course.rating || 0} />
              <span>({course.reviews_count || 0} reviews)</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{typeof course.description === 'string' ? course.description : 'No description available'}</p>
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
      {/* Main Search Bar - Always visible and prominent */}
      <div className="my-8 flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Find Your Perfect Learning Experience
        </h1>
        <form 
          onSubmit={handleSearch}
          className="relative w-full max-w-2xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search for courses, lessons, instructors..."
              className="w-full h-14 pl-14 pr-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white text-lg shadow-md transition-all"
              autoFocus
            />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters Section */}
      <div className="mb-6 sticky top-16 z-30 bg-white dark:bg-gray-900 py-4 shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* View toggle and filter button */}
          <div className="flex items-center space-x-2 ml-auto">
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

      {/* Latest filtered courses heading */}
      {!query && showingLatestFiltered && !loading && results.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Courses {activeFilters.length > 0 ? 'Matching Your Filters' : ''}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Showing the 5 most recent courses based on your selected filters.
          </p>
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

      {/* Results grid - show results only when a search query exists */}
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
                      {(item.rating && !isNaN(item.rating)) ? item.rating.toFixed(1) : '0.0'}
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
  );
};

export default SearchResults; 