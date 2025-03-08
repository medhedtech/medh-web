"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import CategoryFilter from "./CategoryFilter";
import CourseCard from "./CourseCard";
import Pagination from "@/components/shared/pagination/Pagination";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls, apiBaseUrl } from "@/apis";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  X, Filter, Search, ChevronDown, Zap, GraduationCap, 
  LayoutGrid, List, Palette, BookOpen
} from "lucide-react";
import Preloader2 from "@/components/shared/others/Preloader2";
import CategoryToggle from "@/components/shared/courses/CategoryToggle";
import axios from "axios";

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
  availableCategories,
  categoryTitle,
  description,
  classType = "",
  filterState = {}
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest-first");
  const { getQuery, loading, error } = useGetQuery();
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [categorySliderOpen, setCategorySliderOpen] = useState(false); 
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [queryError, setQueryError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // Changed default to netflix view
  const [relatedCourses, setRelatedCourses] = useState({});
  const [showingRelated, setShowingRelated] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState(false); // New state for filter drawer
  const [hoveredCourse, setHoveredCourse] = useState(null); // Track hovered course for expanded view
  
  const contentRef = useRef(null);
  const filterDrawerRef = useRef(null);

  // Add default props to ensure consistent initial state
  const defaultProps = {
    CustomButton: null,
    CustomText: "Skill Development Courses",
    scrollToTop: () => {},
    fixedCategory: null,
    hideCategoryFilter: false,
    availableCategories: categories,
    categoryTitle: "Categories",
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
    
    // Instead of setting a default category, we'll ensure it works with empty category
    // This ensures all courses are loaded on initial render
    if (fixedCategory) {
      // If there's a fixed category, use it
      setSelectedCategory([fixedCategory]);
    } else {
      // Get category from URL if present
      const urlCategory = searchParams?.get('category');
      if (urlCategory) {
        // Split by comma if there are multiple categories
        const categories = urlCategory.includes(',') 
          ? urlCategory.split(',') 
          : [urlCategory];
        setSelectedCategory(categories);
      } else {
        // Otherwise, leave it empty to fetch all courses
        setSelectedCategory([]);
      }
    }
  }, [fixedCategory, searchParams, availableCategories]);

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

  // Calculate similar categories for a given category
  const findSimilarCourses = (course, allCoursesData) => {
    if (!course || !allCoursesData || allCoursesData.length === 0) {
      return [];
    }
    
    // Don't include the source course in results
    const otherCourses = allCoursesData.filter(c => c._id !== course._id);
    
    // Extract key information from the source course
    const courseCategories = [
      course.category,
      course.course_category,
      course.category_type,
      ...(course.additional_categories || [])
    ].filter(Boolean).map(cat => typeof cat === 'string' ? cat.toLowerCase().trim() : '');
    
    const courseInstructor = course.instructor_name?.toLowerCase() || '';
    const courseGrade = course.course_grade?.toLowerCase() || '';
    const courseTitle = course.course_title?.toLowerCase() || '';
    const courseTitleWords = courseTitle.split(/\s+/).filter(w => w.length > 2);
    
    // Score each course based on similarity
    const scoredCourses = otherCourses.map(otherCourse => {
      let score = 0;
      
      // Check category match - highest priority
      const otherCourseCategories = [
        otherCourse.category,
        otherCourse.course_category,
        otherCourse.category_type,
        ...(otherCourse.additional_categories || [])
      ].filter(Boolean).map(cat => typeof cat === 'string' ? cat.toLowerCase().trim() : '');
      
      // Direct category match gives highest score boost
      if (courseCategories.some(cat => otherCourseCategories.includes(cat))) {
        score += 5;
      }
      
      // Word-by-word category match
      const categoryOverlap = courseCategories.some(cat => 
        otherCourseCategories.some(otherCat => 
          cat.includes(otherCat) || otherCat.includes(cat)
        )
      );
      if (categoryOverlap) score += 3;
      
      // Same instructor
      const otherInstructor = otherCourse.instructor_name?.toLowerCase() || '';
      if (courseInstructor && otherInstructor && courseInstructor === otherInstructor) {
        score += 2;
      }
      
      // Same grade level
      const otherGrade = otherCourse.course_grade?.toLowerCase() || '';
      if (courseGrade && otherGrade && courseGrade === otherGrade) {
        score += 2;
      }
      
      // Title word overlap
      const otherTitle = otherCourse.course_title?.toLowerCase() || '';
      const otherTitleWords = otherTitle.split(/\s+/).filter(w => w.length > 2);
      
      const titleWordMatch = courseTitleWords.filter(word => 
        otherTitleWords.some(otherWord => 
          word.includes(otherWord) || otherWord.includes(word)
        )
      ).length;
      
      if (titleWordMatch > 0) {
        score += titleWordMatch * 1; 
      }
      
      return { course: otherCourse, score };
    });
    
    // Sort by score and take top matches
    return scoredCourses
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.course);
  };

  // Find related courses for each course
  const calculateRelatedCourses = useCallback(() => {
    if (!allCourses || allCourses.length === 0) return {};
    
    const relatedCoursesMap = {};
    
    // For each course, find related courses
    allCourses.forEach(course => {
      if (course._id) {
        relatedCoursesMap[course._id] = findSimilarCourses(course, allCourses);
      }
    });
    
    setRelatedCourses(relatedCoursesMap);
  }, [allCourses]);

  // Calculate related courses when all courses are loaded
  useEffect(() => {
    if (allCourses.length > 0) {
      calculateRelatedCourses();
    }
  }, [allCourses, calculateRelatedCourses]);

  // Apply filterState if provided
  useEffect(() => {
    if (Object.keys(filterState).length > 0 && filteredCourses.length > 0) {
      let filtered = [...allCourses];
      
      // For live courses
      if (classType === "live") {
        if (filterState.upcoming) {
          // Filter for courses starting in the future
          const today = new Date();
          filtered = filtered.filter(course => {
            const startDate = new Date(course.startDate);
            return startDate > today;
          });
        }
        
        if (filterState.popular) {
          // Sort by popularity (using enrollmentCount or similar)
          filtered = filtered.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
        }
        
        if (filterState.latest) {
          // Sort by creation date
          filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
      }
      
      // For blended courses
      if (classType === "blended") {
        if (filterState.popular) {
          // Sort by popularity (using enrollmentCount or similar)
          filtered = filtered.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
        }
        
        if (filterState.latest) {
          // Sort by creation date
          filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        if (filterState.beginner) {
          // Filter for beginner-friendly courses
          filtered = filtered.filter(course => 
            course.level?.toLowerCase() === 'beginner' || 
            course.difficulty?.toLowerCase() === 'easy' ||
            course.tags?.some(tag => tag.toLowerCase().includes('beginner'))
          );
        }
      }
      
      setFilteredCourses(filtered);
    }
  }, [filterState, allCourses, classType]);

  const fetchCourses = async () => {
    // Use the fixed category if provided, otherwise use the selected category
    const categoryQuery = fixedCategory ? [fixedCategory] : selectedCategory;
    const gradeQuery = selectedGrade || "";

    // Clear any previous errors
    setQueryError(null);

    console.debug('Fetching courses with:', {
      categoryQuery,
      fixedCategory,
      selectedCategory,
      currentPage,
      gradeQuery,
      classType
    });

    // Default case: No category selected or empty array - fetch all courses
    if (!categoryQuery || categoryQuery.length === 0) {
      console.debug('Fetching all courses - default behavior');
      
      try {
        const apiUrl = apiUrls?.courses?.getAllCoursesWithLimits(
          currentPage,
          8,
          "",
          "",
          "",  // Empty category to fetch all
          "Published",
          searchTerm,
          gradeQuery,
          "",
          {},
          classType
        );
        
        console.debug('API URL for all courses:', apiUrl);
        
        getQuery({
          url: apiUrl,
          onSuccess: (data) => {
            if (data) {
              console.debug(`Fetched ${data.courses?.length || 0} courses successfully`);
              setAllCourses(data.courses || []);
              setFilteredCourses(data.courses || []);
              setTotalPages(data.totalPages || 1);
              setTotalItems(data.totalItems || 0);
            } else {
              console.warn('Data response empty or invalid');
              setAllCourses([]);
              setFilteredCourses([]);
            }
          },
          onFail: (err) => {
            console.error('Error fetching all courses:', err);
            setQueryError('Failed to fetch courses. Please try again later.');
          }
        });
        
        return;
      } catch (error) {
        console.error('Error in fetching all courses:', error);
        setQueryError('Failed to fetch all courses. Please try again later.');
        return;
      }
    }

    // Case: Multiple categories selected
    if (categoryQuery.length > 1) {
      console.debug('Fetching courses for multiple categories:', categoryQuery);
      
      try {
        // Make separate API calls for each category
        const apiPromises = categoryQuery.map(category => {
          const apiUrl = apiUrls?.courses?.getAllCoursesWithLimits(
            currentPage,
            8,
            "",
            "",
            category, // Use each category individually
            "Published",
            searchTerm,
            gradeQuery,
            "",
            {},
            classType // Pass classType parameter
          );
          
          return axios.get(apiUrl).then(res => res.data);
        });
        
        // Combine results
        const allResults = await Promise.all(apiPromises);
        let combinedCourses = [];
        let maxPages = 1;
        let totalItems = 0;
        
        // Merge course lists and find max page count
        allResults.forEach(result => {
          if (result && result.courses) {
            combinedCourses = [...combinedCourses, ...result.courses];
            maxPages = Math.max(maxPages, result.totalPages || 1);
            totalItems += result.totalItems || 0;
          }
        });
        
        // Remove duplicates (in case a course belongs to multiple categories)
        const uniqueCourses = Array.from(new Map(combinedCourses.map(course => 
          [course._id, course]
        )).values());
        
        setAllCourses(uniqueCourses);
        setFilteredCourses(uniqueCourses);
        setTotalPages(maxPages);
        setTotalItems(totalItems);
        
        return;
      } catch (error) {
        console.error('Error fetching multiple categories:', error);
        setQueryError('Failed to fetch courses. Please try again later.');
        return;
      }
    }
    
    // Case: Single category selected
    console.debug('Fetching courses for single category:', categoryQuery[0]);
    
    try {
      const apiUrl = apiUrls?.courses?.getAllCoursesWithLimits(
        currentPage,
        8,
        "",
        "",
        categoryQuery[0], // Single category
        "Published",
        searchTerm,
        gradeQuery,
        "",
        {},
        classType // Pass classType parameter
      );
      
      console.debug('API URL for single category:', apiUrl);
      
      getQuery({
        url: apiUrl,
        onSuccess: (data) => {
          if (data) {
            console.debug(`Fetched ${data.courses?.length || 0} courses for category ${categoryQuery[0]}`);
            setAllCourses(data.courses || []);
            setFilteredCourses(data.courses || []);
            setTotalPages(data.totalPages || 1);
            setTotalItems(data.totalItems || 0);
          } else {
            console.warn('Data response empty or invalid');
            setAllCourses([]);
            setFilteredCourses([]);
          }
        },
        onFail: (err) => {
          console.error('Error fetching category courses:', err);
          setQueryError('Failed to fetch courses. Please try again later.');
        }
      });
      
      return;
    } catch (error) {
      console.error('Error fetching category courses:', error);
      setQueryError('Failed to fetch category courses. Please try again later.');
    }
  };

  const applyFilters = (coursesToFilter = allCourses) => {
    console.debug('Applying Filters with Courses:', coursesToFilter);
    
    // Guard against undefined or empty coursesToFilter
    if (!coursesToFilter || !Array.isArray(coursesToFilter) || coursesToFilter.length === 0) {
      console.debug('No courses to filter, returning empty array');
      setFilteredCourses([]);
      setShowingRelated(false);
      return;
    }
    
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

    // Category Filter - Support multiple categories (OR logic between categories)
    if (selectedCategory && selectedCategory.length) {
      filtered = filtered.filter((course) => {
        // Get all possible category values from the course
        const courseCategories = [
          course.category,
          course.course_category,
          course.category_type,
          ...(course.additional_categories || [])
        ].filter(Boolean).map(cat => typeof cat === 'string' ? cat.toLowerCase().trim() : '');

        const selectedCats = selectedCategory.map(c => c.toLowerCase().trim());
        
        // Enhanced matching logic with multiple strategies
        return selectedCats.some(selected => {
          // Strategy 1: Direct match
          if (courseCategories.includes(selected)) return true;
          
          // Strategy 2: Contains match (course category contains selected or vice versa)
          if (courseCategories.some(cat => cat.includes(selected) || selected.includes(cat))) return true;
          
          // Strategy 3: Word-by-word matching (handle multi-word categories)
          const selectedWords = selected.split(/\s+/).filter(word => word.length > 2);
          if (selectedWords.length > 1) {
            // If the selected category has multiple words, check if most words are found in the course categories
            const matchCount = selectedWords.filter(word => 
              courseCategories.some(cat => cat.includes(word))
            ).length;
            
            // Match if at least 70% of words match
            if (matchCount / selectedWords.length >= 0.7) return true;
          }
          
          return false;
        });
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
    setShowingRelated(false); // Reset when filters change
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

  // Update the useEffect that calls fetchCourses
  useEffect(() => {
    // Only fetch courses when the client is ready and component is initialized
    if (isClient) {
      console.debug('Fetching courses after state change:', {
        currentPage,
        searchTerm,
        selectedCategory,
        selectedGrade
      });
      fetchCourses();
    }
  }, [currentPage, searchTerm, selectedCategory, selectedGrade, isClient]);

  // Handle fixed category changes
  useEffect(() => {
    if (fixedCategory && isClient) {
      setSelectedCategory(fixedCategory ? [fixedCategory] : []);
      setCurrentPage(1);
    }
  }, [fixedCategory, isClient]);

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
    if (fixedCategory) {
      // Only clear non-fixed filters
      const updatedFilters = activeFilters.filter(
        filter => filter.type === 'category' && filter.value === fixedCategory
      );
      setActiveFilters(updatedFilters);
    } else {
      setActiveFilters([]);
    }
    
    setSelectedCategory(fixedCategory ? [fixedCategory] : []);
    setSelectedGrade(null);
    setSearchTerm("");
    setSortOrder("newest-first");
    setCurrentPage(1);
    
    // Fix router issue - use a different approach to update URL that works with Next.js 14
    try {
      // For Next.js 14, just build the URL directly instead of using router.pathname
      const baseUrl = window.location.pathname;
      const newUrl = fixedCategory 
        ? `${baseUrl}?category=${encodeURIComponent(fixedCategory)}` 
        : baseUrl;
      
      router.push(newUrl);
    } catch (error) {
      console.error("Error updating URL:", error);
      // Fallback: continue without URL update if router fails
    }
  };

  const removeFilter = (filterType, value) => {
    // Update activeFilters
    setActiveFilters(prev => prev.filter(f => !(f.type === filterType && f.value === value)));
    
    // Update specific state variables based on filter type
    if (filterType === 'search') {
      setSearchTerm('');
    } else if (filterType === 'category') {
      setSelectedCategory(prev => prev.filter(cat => cat !== value));
    } else if (filterType === 'grade') {
      setSelectedGrade(null);
    } else if (filterType === 'sort') {
      setSortOrder('newest-first');
    }
    
    setCurrentPage(1);
    
    // Update URL with the new state - compatible with Next.js 14
    try {
      const baseUrl = window.location.pathname;
      const updatedCategories = selectedCategory.filter(cat => cat !== value);
      
      // Build URL query parameters
      const queryParams = new URLSearchParams();
      if (fixedCategory) {
        queryParams.set('category', fixedCategory);
      } else if (updatedCategories.length > 0) {
        queryParams.set('category', updatedCategories.join(','));
      }
      
      if (filterType !== 'grade' && selectedGrade) {
        queryParams.set('grade', selectedGrade);
      }
      
      // Navigate to the new URL
      const queryString = queryParams.toString();
      const newUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
      router.push(newUrl);
    } catch (error) {
      console.error("Error updating URL:", error);
      // Continue without URL update if router fails
    }
  };

  // Prevent unnecessary re-renders
  const memoizedFilteredAndSortedCourses = useMemo(() => {
    return filteredCourses;
  }, [filteredCourses]);

  // Toggle view between standard grid and Netflix-like view
  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "netflix" : "grid");
  };

  
  // Close filters when clicking outside
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
  }, [filterDrawerRef]);

  // Add this function to properly initialize the active filters based on URL params and fixed category
  useEffect(() => {
    const initialFilters = [];
    if (fixedCategory) {
      initialFilters.push({ type: 'category', value: fixedCategory });
    }
    
    // Only initialize with URL params if they were explicitly set
    if (searchParams) {
      const categoryParam = searchParams.get('category');
      if (categoryParam && !fixedCategory) {
        // Split by comma if there are multiple categories
        const categories = categoryParam.includes(',') 
          ? categoryParam.split(',') 
          : [categoryParam];
        
        categories.forEach(category => {
          if (category) {
            initialFilters.push({ type: 'category', value: category });
          }
        });
      }
      
      const gradeParam = searchParams.get('grade');
      if (gradeParam) {
        initialFilters.push({ type: 'grade', value: gradeParam });
      }
    }
    
    setActiveFilters(initialFilters);
  }, [fixedCategory, searchParams]);

  // Render only on client to prevent hydration mismatches
  if (!isClient) {
    return null;
  }

  return (
    <div className="container max-w-[1440px] mx-auto px-4 pt-6 pb-16">
      {queryError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
          <p>{queryError}</p>
        </div>
      )}
      
      {!error ? (
        <div ref={contentRef}>
          {description && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm">
              <p className="text-lg text-gray-700 dark:text-gray-300">{description}</p>
            </div>
          )}
          
          {/* Hero Header with Netflix-style treatment */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-2">
                  {CustomText || "Skill Development Courses"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover courses tailored to your learning journey
                </p>
              </div>
              <div className="mt-4 md:mt-0">{CustomButton}</div>
            </div>
          </div>
          
          {/* Sticky Navbar with Search and Filter Toggle - Netflix Style */}
          <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-4 mb-6 rounded-b-xl shadow-md px-4 -mx-4 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Field - Simplified */}
              <div className="w-full md:w-1/3 relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={memoizedHandleSearch}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }
                  }}
                  suppressHydrationWarning={true}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full font-medium transition-colors"
              >
                <Filter size={18} />
                <span>Filters{activeFilters.length > 0 && activeFilters.some(f => !(f.type === 'category' && f.value === fixedCategory)) ? ` (${activeFilters.filter(f => !(f.type === 'category' && f.value === fixedCategory)).length})` : ''}</span>
              </button>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <button 
                  onClick={toggleViewMode}
                  className={`p-2 rounded-full ${viewMode === 'grid' 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={toggleViewMode}
                  className={`p-2 rounded-full ${viewMode === 'netflix' 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                  aria-label="Netflix view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
            
            {/* Active Filters - Only show when there are explicitly applied filters (not just fixed category) */}
            {activeFilters.length > 0 && activeFilters.some(f => !(f.type === 'category' && f.value === fixedCategory)) && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                {activeFilters
                  .filter(filter => !(filter.type === 'category' && filter.value === fixedCategory))
                  .map((filter, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                    >
                      {filter.type}: {filter.value}
                      <button
                        onClick={() => removeFilter(filter.type, filter.value)}
                        className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                {/* Only show clear all if there are filters that can be cleared */}
                {activeFilters.some(f => !(f.type === 'category' && f.value === fixedCategory)) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline ml-auto"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Advanced Filters Drawer - Netflix Style */}
          <div 
            ref={filterDrawerRef}
            className={`fixed inset-y-0 right-0 z-40 w-full sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              filtersVisible ? 'translate-x-0' : 'translate-x-full'
            } overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
                <button 
                  onClick={() => setFiltersVisible(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Category Filter */}
              {!hideCategoryFilter && !fixedCategory && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
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
              
              {/* Grade Level Filter */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Grade Level
                </h4>
                <div className="space-y-2">
                  {grades.map((grade) => (
                    <label key={grade} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="grade"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedGrade === grade}
                        onChange={() => {
                          setSelectedGrade(selectedGrade === grade ? null : grade);
                          setCurrentPage(1);
                        }}
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Sort Order */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Sort By
                </h4>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                >
                  <option value="newest-first">Newest First</option>
                  <option value="oldest-first">Oldest First</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="duration-short-long">Duration: Short to Long</option>
                  <option value="duration-long-short">Duration: Long to Short</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handleClearFilters} 
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setFiltersVisible(false)} 
                  className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Backdrop for filter drawer */}
          {filtersVisible && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setFiltersVisible(false)}
            />
          )}

          {/* Main Content with Sidebar (conditionally rendered) */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - Only show on standard view, not on Netflix view */}
            {!hideCategoryFilter && !fixedCategory && viewMode !== "netflix" && (
              <div className="hidden md:block w-full md:w-1/5 lg:w-[18%] max-w-[280px]">
                <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
              </div>
            )}

            {/* Course Display Area */}
            <div className="flex-1 w-full min-w-0">
              {loading ? (
                <div className="flex justify-center items-center min-h-[50vh] w-full">
                  <Preloader2 />
                </div>
              ) : filteredCourses.length > 0 ? (
                <>
                  {/* Standard Grid View */}
                  {viewMode === "grid" && (
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
                  )}
                  
                  {/* Netflix-like View */}
                  {viewMode === "netflix" && (
                    <div className="space-y-14">
                      {/* Main featured courses section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">

                          {showingRelated && (
                            <button 
                              onClick={() => setShowingRelated(false)}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                            >
                              Back to all courses
                            </button>
                          )}
                        </div>
                        
                        {/* Netflix horizontal scrollable row with hover expand effect */}
                        <div className="relative -mx-4 px-4">
                          <div className="overflow-x-auto pb-4 pt-1 hide-scrollbar">
                            <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
                              {(showingRelated ? 
                                relatedCourses[showingRelated] || [] : 
                                filteredCourses.slice(0, Math.min(12, filteredCourses.length))
                              ).map((course, index) => (
                                <div 
                                  key={course._id || index}
                                  className={`transition-all duration-300 flex-shrink-0 ${
                                    hoveredCourse === course._id ? 'w-[340px]' : 'w-[260px]'
                                  }`}
                                  onMouseEnter={() => setHoveredCourse(course._id)}
                                  onMouseLeave={() => setHoveredCourse(null)}
                                >
                                  <div 
                                    className={`transition-all duration-300 ${
                                      hoveredCourse === course._id ? 'transform scale-105 shadow-xl' : 'transform scale-100 shadow-md'
                                    }`}
                                  >
                                    <CourseCard 
                                      course={course}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional course categories sections - Only show if we have enough courses and not showing related */}
                      {!showingRelated && selectedCategory.length <= 1 && filteredCourses.length > 12 && (
                        <>
                          {/* Trending Courses Row */}
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                              Trending Courses
                            </h2>
                            <div className="relative -mx-4 px-4">
                              <div className="overflow-x-auto pb-4 pt-1 hide-scrollbar">
                                <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
                                  {filteredCourses
                                    .filter(course => course.is_popular)
                                    .slice(0, Math.min(10, filteredCourses.length))
                                    .map((course, index) => (
                                      <div 
                                        key={course._id || index}
                                        className={`transition-all duration-300 flex-shrink-0 ${
                                          hoveredCourse === course._id ? 'w-[340px]' : 'w-[260px]'
                                        }`}
                                        onMouseEnter={() => setHoveredCourse(course._id)}
                                        onMouseLeave={() => setHoveredCourse(null)}
                                      >
                                        <div 
                                          className={`transition-all duration-300 ${
                                            hoveredCourse === course._id ? 'transform scale-105 shadow-xl' : 'transform scale-100 shadow-md'
                                          }`}
                                        >
                                          <CourseCard course={course} />
                                        </div>
                                      </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Recently Added Courses Row */}
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                              Recently Added
                            </h2>
                            <div className="relative -mx-4 px-4">
                              <div className="overflow-x-auto pb-4 pt-1 hide-scrollbar">
                                <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
                                  {filteredCourses
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .slice(0, Math.min(10, filteredCourses.length))
                                    .map((course, index) => (
                                      <div 
                                        key={course._id || index}
                                        className={`transition-all duration-300 flex-shrink-0 ${
                                          hoveredCourse === course._id ? 'w-[340px]' : 'w-[260px]'
                                        }`}
                                        onMouseEnter={() => setHoveredCourse(course._id)}
                                        onMouseLeave={() => setHoveredCourse(null)}
                                      >
                                        <div 
                                          className={`transition-all duration-300 ${
                                            hoveredCourse === course._id ? 'transform scale-105 shadow-xl' : 'transform scale-100 shadow-md'
                                          }`}
                                        >
                                          <CourseCard course={course} />
                                        </div>
                                      </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* All courses grid - If there are more courses */}
                      {!showingRelated && filteredCourses.length > 12 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                              All Courses
                            </h2>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {filteredCourses
                              .slice((currentPage - 1) * 12, currentPage * 12)
                              .map((course, index) => (
                                <div 
                                  key={course._id || index}
                                  className="transition-all duration-500"
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
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pagination - More visually appealing and smooth */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-2 inline-flex">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={(page) => {
                            handlePageChange(page);
                            scrollToTop();
                          }}
                          className="pagination-netflix" // Custom class for Netflix-style pagination
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="w-20 h-20 mb-6 text-gray-300 dark:text-gray-600">
                    <BookOpen size={80} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                    We couldn't find any courses matching your criteria. Try adjusting your filters or check back later.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full shadow-sm transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-20 h-20 mb-6 text-red-500">
            <X size={80} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
            There was a problem loading the courses. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full shadow-sm transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )}
      
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
        
        /* Custom pagination styling */
        .pagination-netflix button {
          transition: all 0.3s ease;
        }
        
        .pagination-netflix button:hover:not([disabled]) {
          transform: translateY(-2px);
        }
        
        /* Smooth page transitions */
        .page-transition {
          transition: all 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

CoursesFilter.propTypes = {
  CustomButton: PropTypes.node,
  CustomText: PropTypes.string,
  scrollToTop: PropTypes.func,
  fixedCategory: PropTypes.string,
  hideCategoryFilter: PropTypes.bool,
  availableCategories: PropTypes.arrayOf(PropTypes.string),
  categoryTitle: PropTypes.string,
  description: PropTypes.string,
  classType: PropTypes.string,
  filterState: PropTypes.object
};

export default CoursesFilter;
