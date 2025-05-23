"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  Filter,
  Search,
  ChevronDown,
  Zap,
  GraduationCap,
  LayoutGrid,
  List,
  Palette,
  BookOpen,
  AlertCircle,
  SearchX,
  ChevronRight,
} from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import Pagination from "@/components/shared/pagination/Pagination";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader2 from "@/components/shared/others/Preloader2";
import CategoryToggle from "@/components/shared/courses/CategoryToggle";
import { apiUrls } from "@/apis";
import Link from "next/link";
import React from "react";
import { IUpdateCourseData } from '@/types/course.types';
import { apiBaseUrl, apiUtils, ICourseFilters, ICourseSearchParams } from '@/apis/index'; // Adjust path if needed
import { getAllCoursesWithLimits } from '@/apis/course/course';
import axios from 'axios';

// Dynamically import components that might cause hydration issues
const DynamicCourseCard = dynamic(() => import("./CourseCard"), {
  ssr: true,
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96 transition-colors duration-200"></div>,
});

// Fallback categories if none provided
const fallbackCategories = {
  live: [
    "AI and Data Science",
    "Personality Development",
    "Vedic Mathematics",
    "Digital Marketing with Data Analytics",
  ],
  blended: [
    "AI For Professionals",
    "Business And Management",
    "Career Development",
    "Communication And Soft Skills",
    "Data & Analytics",
    "Environmental and Sustainability Skills",
    "Finance & Accounts",
    "Health & Wellness",
    "Industry-Specific Skills",
    "Language & Linguistic",
    "Legal & Compliance Skills",
    "Personal Well-Being",
    "Sales & Marketing",
    "Technical Skills",
  ],
  all: [
    "AI and Data Science",
    "Personality Development",
    "Vedic Mathematics",
    "Digital Marketing with Data Analytics",
    "AI For Professionals",
    "Business And Management",
    "Career Development",
    "Communication And Soft Skills",
    "Data & Analytics",
    "Environmental and Sustainability Skills",
    "Finance & Accounts",
    "Health & Wellness",
    "Industry-Specific Skills",
    "Language & Linguistic",
    "Legal & Compliance Skills",
    "Personal Well-Being",
    "Sales & Marketing",
    "Technical Skills",
    ""
  ]
};

/**
 * Simple ErrorBoundary
 */
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event) => {
      console.error("Caught error:", event);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-8 bg-red-50 rounded-lg my-8 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">
          Something went wrong
        </h2>
        <p className="mb-4 text-red-600">
          We&apos;re sorry, but there was an error loading this page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return children;
};

// Helper component for simplified pagination - renamed to avoid naming conflict
const SimplePaginationWrapper = ({ currentPage, totalPages, onPageChange, className = "", simplified = false }) => {
  if (simplified) {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3 py-1 rounded-md ${
            currentPage <= 1
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage >= totalPages
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  }

  // Original pagination implementation
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors duration-200 ${
            currentPage === i
              ? "bg-blue-600 dark:bg-blue-700 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`w-9 h-9 flex items-center justify-center rounded-md ${
          currentPage <= 1
            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-md ${
          currentPage >= totalPages
            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
    </div>
  );
};

// Memoized components for better performance
const MemoizedCourseCard = React.memo(DynamicCourseCard);

// Separate the filter dropdown into its own component for better organization
const SortDropdown = React.memo(({ sortOrder, handleSortChange, showSortDropdown, setShowSortDropdown }) => {
  const sortDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSortDropdown]);

  const getSortLabel = (value) => {
    const labels = {
      "newest-first": "Newest First",
      "oldest-first": "Oldest First",
      "A-Z": "Name (A-Z)",
      "Z-A": "Name (Z-A)",
      "price-low-high": "Price (Low->High)",
      "price-high-low": "Price (High->Low)",
    };
    return labels[value] || "Newest First";
  };

  return (
    <div className="relative" ref={sortDropdownRef}>
      <button
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className="select-modern flex items-center justify-between w-full md:w-48 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200"
        aria-expanded={showSortDropdown}
        aria-haspopup="true"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {getSortLabel(sortOrder)}
        </span>
        {/* <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 text-gray-400 dark:text-gray-500 ${showSortDropdown ? 'rotate-180' : ''}`} 
        /> */}
      </button>

      {showSortDropdown && (
        <div className="absolute right-0 mt-1 w-full md:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10" role="menu">
          <div className="py-1">
            {[
              { value: "newest-first", label: "Newest First" },
              { value: "oldest-first", label: "Oldest First" },
              { value: "A-Z", label: "Name (A-Z)" },
              { value: "Z-A", label: "Name (Z-A)" },
              { value: "price-low-high", label: "Price (Low->High)" },
              { value: "price-high-low", label: "Price (High->Low)" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`${
                  sortOrder === option.value
                    ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                } block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// Separate the search input into its own component
const SearchInput = React.memo(({ searchTerm, handleSearch, setSearchTerm }) => (
  <div className="flex-grow relative">
    <div className="relative">
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={handleSearch}
        className="input-modern w-full py-2 pl-10 pr-4"
        aria-label="Search courses"
      />

      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  </div>
));

// Add a custom hook for window resize handling
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Add debounce utility
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Add currency detection function
const getLocationCurrency = async () => {
  try {
    // Check if we've already stored the currency in localStorage
    const cachedCurrency = localStorage.getItem('userCurrency');
    const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
    
    // Use cached value if it exists and is less than 24 hours old
    if (cachedCurrency && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24 hours
        console.log(`Using cached currency: ${cachedCurrency}`);
        return cachedCurrency;
      }
    }
    
    // Make request to IP geolocation API
    const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
    
    if (response.data && response.data.currency) {
      const detectedCurrency = response.data.currency;
      console.log(`Detected currency from IP: ${detectedCurrency}`);
      
      // Store in localStorage with timestamp
      localStorage.setItem('userCurrency', detectedCurrency);
      localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
      
      return detectedCurrency;
    } else {
      console.log("Could not detect currency from IP, using default");
      return "USD"; // Default fallback
    }
  } catch (error) {
    console.error("Error detecting location:", error);
    return "USD"; // Default fallback on error
  }
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
  filterState = {},
  activeTab = "all",
  onFilterToggle = () => {},
  // New props for simplified display
  hideSearch = false,
  hideSortOptions = false,
  hideFilterBar = false,
  hideViewModeSwitch = false,
  hideHeader = false,
  hideGradeFilter = false,
  forceViewMode = null,
  gridColumns = 3,
  itemsPerPage = 8,
  simplePagination = false,
  emptyStateContent = null,
  customGridClassName = "",
  customGridStyle = {},
  renderCourse = (course) => course,
  hideCategories = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getQuery, loading } = useGetQuery();

  // Use the window size hook for responsive states
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [responsiveGridColumns, setResponsiveGridColumns] = useState(gridColumns);

  // Define all state variables at the top, before any useEffect hooks that use them
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [sortOrder, setSortOrder] = useState("newest-first");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(forceViewMode || "grid");
  
  // API data
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // UI states
  const [showingRelated, setShowingRelated] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [queryError, setQueryError] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [userCurrency, setUserCurrency] = useState("USD"); // Default currency
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Refs
  const sortDropdownRef = useRef(null);
  const didInitRef = useRef(false);
  const debounceTimer = useRef(null);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update grid columns based on screen size
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;
    
    const updateGridColumns = () => {
      if (isMobile) {
        setResponsiveGridColumns(1); // Mobile: 1 column
      } else if (isTablet) {
        setResponsiveGridColumns(Math.min(gridColumns, 2)); // Tablet: max 2 columns
      } else {
        setResponsiveGridColumns(gridColumns); // Desktop: use provided columns
      }
    };
    
    // Initial update
    updateGridColumns();
  }, [isMobile, isTablet, gridColumns]);

  // Reset page number when filters change
  useEffect(() => {
    // Skip the initial render to avoid resetting when component first mounts
    if (!didInitRef.current) return;
    
    // Reset to page 1 when any filter criteria changes
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedGrade, sortOrder]);

  // Effect to update viewMode if forceViewMode changes
  useEffect(() => {
    if (forceViewMode) {
      setViewMode(forceViewMode);
    }
  }, [forceViewMode]);

  // Initialize currency on component mount
  useEffect(() => {
    const initializeCurrency = async () => {
      setIsDetectingLocation(true);
      const currency = await getLocationCurrency();
      setUserCurrency(currency);
      setIsDetectingLocation(false);
    };

    initializeCurrency();
  }, []);

  /**
   * 1) Read URL + filterState once on mount
   */
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    // If fixedCategory is provided, override any category from URL
    if (fixedCategory) {
      setSelectedCategory([fixedCategory]);
    } else {
      const urlCategory = searchParams?.get("category");
      if (urlCategory) {
        try {
          const decoded = urlCategory
            .split(",")
            .map((cat) => decodeURIComponent(cat.trim()))
            .filter(Boolean);
          setSelectedCategory(decoded);
        } catch (error) {
          console.error("Error parsing category from URL:", error);
        }
      }
    }

    // Grade
    const urlGrade = searchParams?.get("grade");
    if (urlGrade) setSelectedGrade(urlGrade);

    // Page
    const urlPage = searchParams?.get("page");
    if (urlPage) {
      const pageVal = parseInt(urlPage, 10);
      if (!isNaN(pageVal)) setCurrentPage(pageVal);
    }

    // Search
    const urlSearch = searchParams?.get("search");
    if (urlSearch) setSearchTerm(urlSearch);

    // Sort
    const urlSort = searchParams?.get("sort");
    if (urlSort) setSortOrder(urlSort);

    // Also apply optional filterState overrides
    if (filterState.category && !fixedCategory) {
      setSelectedCategory([filterState.category]);
    }
    if (filterState.grade) setSelectedGrade(filterState.grade);
    if (filterState.search) setSearchTerm(filterState.search);
    if (filterState.sort) setSortOrder(filterState.sort);
  }, [searchParams, fixedCategory, filterState]);

  /**
   * 2) When local filters change, update the URL (debounced).
   */
  useEffect(() => {
    if (!didInitRef.current) return; // only after the first mount parse
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      // Run this code only on the client side
      if (typeof window !== 'undefined') {
        const baseUrl = window.location.pathname;
        const q = new URLSearchParams();

        // Category
        if (!fixedCategory && selectedCategory.length > 0) {
          const catParam = selectedCategory
            .map((cat) => encodeURIComponent(cat.trim()))
            .join(",");
          if (catParam) q.set("category", catParam);
        }
        // Grade
        if (selectedGrade) {
          q.set("grade", encodeURIComponent(selectedGrade));
        }
        // Search
        if (searchTerm) {
          q.set("search", encodeURIComponent(searchTerm));
        }
        // Sort
        if (sortOrder && sortOrder !== "newest-first") {
          q.set("sort", sortOrder);
        }
        // Page - only include if user explicitly changed pages through pagination
        // and not if other filters changed (since we auto-reset to page 1)
        if (currentPage > 1) {
          // Check if we're not in the middle of a filter change
          const urlParams = new URLSearchParams(window.location.search);
          const hasFilterChange = 
            (urlParams.get("category") !== (q.get("category") || null)) || 
            (urlParams.get("grade") !== (q.get("grade") || null)) || 
            (urlParams.get("search") !== (q.get("search") || null)) || 
            (urlParams.get("sort") !== (q.get("sort") || null));
          
          // Only keep page param if no filter changes occurred
          if (!hasFilterChange) {
            q.set("page", currentPage.toString());
          }
        }

        const newQuery = q.toString();
        const newUrl = newQuery ? `${baseUrl}?${newQuery}` : baseUrl;
        const currentUrl = window.location.pathname + window.location.search;
        if (newUrl !== currentUrl) {
          router.push(newUrl, { shallow: true });
        }
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [
    selectedCategory,
    selectedGrade,
    searchTerm,
    sortOrder,
    currentPage,
    router,
    fixedCategory,
  ]);

  /**
   * 3) Fetch courses from API whenever relevant states change (debounced).
   */
  const fetchCourses = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    setQueryError(null);

    try {
      // Build search parameters
      const searchParams = {
        page: currentPage,
        limit: itemsPerPage || 12,
        status: "Published",
        sort_by: "createdAt",
        sort_order: "desc",
        currency: userCurrency.toLowerCase(),
        fields: ['card']
      };

      // Add category if available
      if (fixedCategory) {
        searchParams.course_category = fixedCategory;
      } else if (selectedCategory.length > 0) {
        searchParams.course_category = selectedCategory;
      }

      // Add search term if available
      if (searchTerm?.trim()) {
        searchParams.search = searchTerm.trim();
      }

      // Add grade if selected
      if (selectedGrade) {
        searchParams.course_grade = selectedGrade;
      }

      // Add class type if specified
      if (classType) {
        searchParams.class_type = classType;
      }

      // Add sorting
      switch (sortOrder) {
        case "oldest-first":
          searchParams.sort_by = "createdAt";
          searchParams.sort_order = "asc";
          break;
        case "A-Z":
          searchParams.sort_by = "course_title";
          searchParams.sort_order = "asc";
          break;
        case "Z-A":
          searchParams.sort_by = "course_title";
          searchParams.sort_order = "desc";
          break;
        case "price-low-high":
          searchParams.sort_by = "course_fee";
          searchParams.sort_order = "asc";
          break;
        case "price-high-low":
          searchParams.sort_by = "course_fee";
          searchParams.sort_order = "desc";
          break;
        default:
          searchParams.sort_by = "createdAt";
          searchParams.sort_order = "desc";
      }

      const apiUrl = getAllCoursesWithLimits(searchParams);

      if (process.env.NODE_ENV === 'development') {
        console.debug('Fetching courses with URL:', apiUrl, 'Currency:', userCurrency);
      }

      await getQuery({
        url: apiUrl,
        skipCache: true,
        requireAuth: false,
        onSuccess: (response) => {
          // Check if we have a valid response with the new structure
          if (!response || !response.success || !response.data) {
            throw new Error('Invalid API response');
          }

          // Get the courses array from the new response structure
          const courses = response.data.courses;
          
          if (!Array.isArray(courses)) {
            throw new Error('Invalid courses data format');
          }

          // Trust the API response - no frontend conversion
          // The API should return courses with correct currency based on the currency parameter
          setAllCourses(courses);
          setFilteredCourses(courses);

          // Handle pagination from the new response structure
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 1);
            setTotalItems(response.data.pagination.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(courses.length);
          }

          // Handle facets if available
          if (response.data.facets) {
            // Store categories for filtering if needed
            if (response.data.facets.categories) {
              console.debug('Categories facets:', response.data.facets.categories);
            }
            
            // Store category types if available
            if (response.data.facets.categoryTypes) {
              console.debug('Category types facets:', response.data.facets.categoryTypes);
            }
            
            // Store class types if available
            if (response.data.facets.classTypes) {
              console.debug('Class types facets:', response.data.facets.classTypes);
            }
            
            // Store price ranges if available
            if (response.data.facets.priceRanges) {
              console.debug('Price ranges facets:', response.data.facets.priceRanges);
            }
          }

          if (scrollToTop && typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
        onFail: (err) => {
          console.error("API Error:", err);
          setQueryError(err?.message || "Failed to fetch courses. Please try again.");
          setAllCourses([]);
          setFilteredCourses([]);
          setTotalPages(1);
          setTotalItems(0);
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setQueryError(error?.message || "An unexpected error occurred. Please try again later.");
      setAllCourses([]);
      setFilteredCourses([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [
    currentPage,
    itemsPerPage,
    sortOrder,
    searchTerm,
    selectedGrade,
    selectedCategory,
    fixedCategory,
    classType,
    scrollToTop,
    getQuery,
    userCurrency
  ]);

  // Whenever relevant states change, fire the fetch (with small debounce)
  useEffect(() => {
    if (!didInitRef.current) return; // skip on first mount (we do it after initialization)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchCourses();
    }, 350);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [fetchCourses]);

  // For the very first load, do one fetch after states are set
  useEffect(() => {
    // If we just finished reading from URL/filterState,
    // give 1 tick for states to settle, then fetch.
    setTimeout(() => {
      if (didInitRef.current) {
        fetchCourses();
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handlers for filters
   */
  const handleCategoryChange = useCallback(
    (cats) => {
      if (fixedCategory) return; // don't override
      // Filter out empties
      const newCats = cats.filter(Boolean);
      setSelectedCategory(newCats);
      setCurrentPage(1);
    },
    [fixedCategory]
  );

  const handleGradeChange = useCallback((grade) => {
    setSelectedGrade(grade);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((val) => {
    setSortOrder(val);
    setShowSortDropdown(false);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollToTop]);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    if (fixedCategory) {
      setSelectedCategory([fixedCategory]);
    } else {
      setSelectedCategory([]);
    }
    setSelectedGrade("");
    setSearchTerm("");
    setSortOrder("newest-first");
    setCurrentPage(1);
    setShowingRelated(false);
  }, [fixedCategory]);

  /**
   * Remove individual filter
   */
  const removeFilter = useCallback(
    (type, val) => {
      switch (type) {
        case "category":
          if (fixedCategory === val) return;
          setSelectedCategory((prev) => prev.filter((c) => c !== val));
          break;
        case "grade":
          setSelectedGrade("");
          break;
        case "search":
          setSearchTerm("");
          break;
        case "sort":
          setSortOrder("newest-first");
          break;
        default:
          console.warn("Unknown filter type:", type);
      }
      setCurrentPage(1);
    },
    [fixedCategory]
  );

  // Show related courses
  const showRelatedCourses = useCallback(
    (course) => {
      if (!course) return;
      const related = allCourses.filter(
        (c) =>
          c._id !== course._id &&
          c.course_category === course.course_category
      );
      if (related.length > 0) {
        setFilteredCourses(related.slice(0, 4));
        setShowingRelated(true);
      }
    },
    [allCourses]
  );

  // Return to the main course list
  const clearRelated = useCallback(() => {
    setShowingRelated(false);
    setFilteredCourses(allCourses);
  }, [allCourses]);

  /**
   * Compute active filters
   */
  useEffect(() => {
    const newFilters = [];
    // search
    if (searchTerm) {
      newFilters.push({
        type: "search",
        label: `Search: ${searchTerm}`,
        value: searchTerm,
      });
    }
    // category
    if (selectedCategory.length > 0 && !hideCategoryFilter) {
      selectedCategory.forEach((cat) => {
        newFilters.push({
          type: "category",
          label: `Category: ${cat}`,
          value: cat,
        });
      });
    }
    // grade
    if (selectedGrade) {
      newFilters.push({
        type: "grade",
        label: `Grade: ${selectedGrade}`,
        value: selectedGrade,
      });
    }
    // sort
    if (sortOrder && sortOrder !== "newest-first") {
      const map = {
        "oldest-first": "Oldest First",
        "A-Z": "Name (A-Z)",
        "Z-A": "Name (Z-A)",
        "price-low-high": "Price (Low->High)",
        "price-high-low": "Price (High->Low)",
      };
      newFilters.push({
        type: "sort",
        label: `Sort: ${map[sortOrder] || sortOrder}`,
        value: sortOrder,
      });
    }
    setActiveFilters(newFilters);
  }, [searchTerm, selectedCategory, selectedGrade, sortOrder, hideCategoryFilter]);

  /**
   * No results
   */
  const renderNoResults = useCallback(() => {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
        <SearchX size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Courses Found</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          We couldn't find any courses matching your search criteria. Try adjusting your filters or search term.
        </p>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>
    );
  }, [handleClearFilters]);

  /**
   * Count text
   */
  const coursesCountText = (() => {
    if (showingRelated) return "Related Courses";
    if (totalItems === 0) return "No courses found";
    if (totalItems === 1) return "1 course found";
    return `${totalItems} courses found`;
  })();

  // Determine UI theme colors based on activeTab
  const getTabStyles = () => {
    const styles = {
      all: {
        bgColor: "bg-primary-50/80 dark:bg-primary-900/10",
        borderColor: "border-primary-100 dark:border-primary-900/20",
        textColor: "text-primary-700 dark:text-primary-300",
        buttonColor: "bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
      },
      live: {
        bgColor: "bg-rose-50/80 dark:bg-rose-900/10",
        borderColor: "border-rose-100 dark:border-rose-900/20",
        textColor: "text-rose-700 dark:text-rose-300",
        buttonColor: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
      },
      blended: {
        bgColor: "bg-indigo-50/80 dark:bg-indigo-900/10",
        borderColor: "border-indigo-100 dark:border-indigo-900/20",
        textColor: "text-indigo-700 dark:text-indigo-300",
        buttonColor: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
      }
    };
    
    return styles[activeTab] || styles.all;
  };

  // Use getTabStyles to generate dynamic styling based on activeTab
  const tabStyles = getTabStyles();

  // Determine grid column classes
  const getGridColumnClasses = () => {
    if (customGridClassName) {
      return customGridClassName;
    }
    
    // Default responsive grid
    let gridClass = "grid gap-1 pb-1";
    
    switch (responsiveGridColumns) {
      case 1:
        gridClass += " grid-cols-1";
        break;
      case 2:
        gridClass += " grid-cols-1 md:grid-cols-2";
        break;
      case 4:
        gridClass += " grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
        break;
      case 5:
        gridClass += " grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
        break;
      case 3:
      default:
        gridClass += " grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
    
    return gridClass;
  };

  // Create an SSR-safe grid style
  const safeGridStyle = {
    ...customGridStyle,
    // Only set gridTemplateColumns if actually provided
    ...(Object.keys(customGridStyle).length > 0 ? {} : {
      gridTemplateColumns: `repeat(${responsiveGridColumns}, minmax(0, 1fr))`
    })
  };

  // Memoize grid classes
  const gridClasses = useMemo(() => getGridColumnClasses(), [responsiveGridColumns, customGridClassName]);

  // Render optimized course list
  const renderCourseList = useCallback(() => {
    if (loading) {
      return (
        <div className={gridClasses}>
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div 
              key={idx} 
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96 transition-colors duration-200"
              role="presentation"
            />
          ))}
        </div>
      );
    }

    if (filteredCourses.length === 0) {
      return emptyStateContent || renderNoResults();
    }

    return (
      <div 
        className={viewMode === "grid" ? gridClasses : "space-y-4"}
        style={viewMode === "grid" && Object.keys(customGridStyle).length > 0 ? safeGridStyle : {}}
      >
        {filteredCourses.map((course) => {
          const enhancedCourse = renderCourse(course);
          // Determine if this course is in the Live Courses category
          const isInLiveCategory = enhancedCourse.course_category && 
                                  Array.isArray(fallbackCategories.live) && 
                                  fallbackCategories.live.includes(enhancedCourse.course_category);
          
          // If course is in a Live category, force live class type
          const effectiveClassType = isInLiveCategory ? 'live' : 
                                    (classType && classType.toLowerCase().includes('live')) ? 'live' : 
                                    (classType && classType.toLowerCase().includes('blend')) ? 'blended' : 
                                    classType || enhancedCourse.class_type;
          
          return (
            <ErrorBoundary key={enhancedCourse._id}>
              <MemoizedCourseCard 
                course={{
                  ...enhancedCourse,
                  // Add header content to course card props
                  headerContent: enhancedCourse.headerContent,
                  // Add custom className
                  className: enhancedCourse.className
                }}
                viewMode={viewMode}
                isCompact={isMobile}
                preserveClassType={true}
                classType={effectiveClassType}
                className={viewMode === "list" ? "border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" : ""}
              />
            </ErrorBoundary>
          );
        })}
      </div>
    );
  }, [loading, filteredCourses, viewMode, gridClasses, customGridStyle, isMobile, renderCourse]);

  // Function to render the sidebar
  const renderSidebar = () => {
    if (hideCategoryFilter) return null;
    return (
      <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-transparent dark:border-gray-700 transition-colors duration-200">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
            {/* Categories */}
            {!hideCategoryFilter && !hideCategories && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-200">
                  Categories
                </h4>
                {/* Show categories based on classType */}
                {classType === "live" ? (
                  // Live Course Categories
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-2 flex items-center">
                      <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                      Live Course Categories
                    </h5>
                    <CategoryFilter
                      categories={availableCategories?.filter(cat => fallbackCategories.live.includes(cat)) || fallbackCategories.live}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={handleCategoryChange}
                    />
                  </div>
                ) : classType === "blended" ? (
                  // Blended Course Categories
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2 flex items-center">
                      <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Blended Course Categories
                    </h5>
                    <CategoryFilter
                      categories={availableCategories?.filter(cat => fallbackCategories.blended.includes(cat)) || fallbackCategories.blended}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={handleCategoryChange}
                    />
                  </div>
                ) : (
                  // All Categories (when classType is not specified or is "all")
                  <>
                    {/* Live Categories Section */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                        Live Courses
                      </h5>
                      <CategoryFilter
                        categories={availableCategories?.filter(cat => fallbackCategories.live.includes(cat)) || fallbackCategories.live}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={handleCategoryChange}
                      />
                    </div>
                    {/* Blended Categories Section */}
                    <div className="mb-2">
                      <h5 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                        Blended Courses
                      </h5>
                      <CategoryFilter
                        categories={availableCategories?.filter(cat => fallbackCategories.blended.includes(cat)) || fallbackCategories.blended}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={handleCategoryChange}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Grade - Only show if not hidden */}
            {!hideGradeFilter && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-200">
                  Grade Level
                </h4>
                <div className="space-y-2">
                  {[
                    "Preschool",
                    "Grade 1-2",
                    "Grade 3-4",
                    "Grade 5-6",
                    "Grade 7-8",
                    "Grade 9-10",
                    "Grade 11-12",
                    "UG - Graduate - Professionals"
                  ].map((grade) => (
                    <label key={grade} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="grade"
                        value={grade}
                        checked={selectedGrade === grade}
                        onChange={() => handleGradeChange(grade)}
                        className="form-radio text-primary-600 dark:text-primary-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {grade}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            Features (static placeholders)
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                Course Features
              </h4>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                <Zap size={16} className="text-yellow-500 dark:text-yellow-400" />
                <span className="text-sm">Certification Available</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                <BookOpen size={16} className="text-blue-500 dark:text-blue-400" />
                <span className="text-sm">Includes Assignments</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                <GraduationCap size={16} className="text-green-500 dark:text-green-400" />
                <span className="text-sm">Project-Based Learning</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                <Palette size={16} className="text-purple-500 dark:text-purple-400" />
                <span className="text-sm">Interactive Quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render the main content area
  const renderMainContent = () => {
    return (
      <div className={!hideCategoryFilter ? "lg:w-3/4" : "w-full"}>
        {/* Top row for count - Only show if filters are not hidden */}
        {!hideFilterBar && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-0 flex items-center gap-3 bg-white dark:bg-gray-800/80 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {totalItems}
              </span>
              <span className="text-sm">
                {showingRelated ? 'Related Courses Found' : 
                totalItems === 1 ? 'Course Matches Your Criteria' : 
                'Courses Match Your Criteria'}
              </span>
              {showingRelated && (
                <button
                  onClick={clearRelated}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm"
                >
                  Back to All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Query Error */}
        {queryError && (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-red-200 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-900/10 text-center">
            <AlertCircle size={48} className="text-red-500 dark:text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Error Loading Courses</h3>
            <p className="text-red-600 dark:text-red-400 max-w-md mb-6">
              {queryError || "We encountered an error while loading courses. Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        )}

        {renderCourseList()}

        {/* Pagination with improved accessibility */}
        {totalPages > 1 && (
          <nav className="mt-10 flex justify-center" aria-label="Pagination">
            {simplePagination ? (
              <SimplePaginationWrapper
                key={`pagination-${searchTerm}-${selectedCategory.join(',')}-${selectedGrade}-${sortOrder}`}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                simplified={true}
              />
            ) : (
              <Pagination
                key={`pagination-${searchTerm}-${selectedCategory.join(',')}-${selectedGrade}-${sortOrder}`}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              />
            )}
          </nav>
        )}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <section className="pb-5 relative w-full" role="region" aria-label="Course Filter">
        {/* Course Header - Only render if not hidden */}
        {!hideHeader && (
          <div className={`${activeTab !== 'all' ? tabStyles.bgColor : 'bg-gray-900 dark:bg-gray-950'} py-10 md:py-16 transition-colors duration-300 border-b ${activeTab !== 'all' ? tabStyles.borderColor : 'border-gray-800 dark:border-gray-800/40'} w-full`}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${activeTab !== 'all' ? tabStyles.textColor : 'text-white dark:text-gray-50'}`}>
                  {categoryTitle || CustomText || "Explore Courses"}
                </h1>
                <p className="text-gray-300 dark:text-gray-300/90 text-lg transition-colors duration-300">
                  {description ||
                    "Discover courses to enhance your skills and advance your career."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Wrapper with improved accessibility */}
        <div className="container mx-auto px-4 -mt-3 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-4 md:p-6 mb-8 border border-transparent dark:border-gray-700 transition-colors duration-300">
            {/* Top Filters Row with improved mobile layout */}
            {!hideFilterBar && (
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {!hideSearch && <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} setSearchTerm={setSearchTerm} />}
                {!hideSortOptions && <SortDropdown sortOrder={sortOrder} handleSortChange={handleSortChange} showSortDropdown={showSortDropdown} setShowSortDropdown={setShowSortDropdown} />}
                
                {/* View Mode Switch - Only render if not hidden */}
                {!hideViewModeSwitch && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === "grid"
                          ? "bg-blue-500 dark:bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      <LayoutGrid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === "list"
                          ? "bg-blue-500 dark:bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                )}

                {/* Mobile Filters Button - Only render if filters are not hidden */}
                {!hideFilterBar && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden btn-modern btn-secondary flex items-center justify-center"
                  >
                    <Filter size={18} className="mr-2" />
                    <span>Filters</span>
                  </button>
                )}
              </div>
            )}

            {/* Active Filters - Only render if filters are not hidden */}
            {!hideFilterBar && activeFilters.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    Active Filters:
                  </span>
                  {activeFilters.map((f, idx) => (
                    <div
                      key={`${f.type}-${idx}`}
                      className="badge badge-primary"
                    >
                      {f.label}
                      <button
                        onClick={() => removeFilter(f.type, f.value)}
                        className="ml-2 hover:text-blue-600 dark:hover:text-blue-200 transition-colors duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline ml-2 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Main content with optimized rendering */}
            <div className="flex flex-col lg:flex-row gap-8">
              {renderSidebar()}
              {renderMainContent()}
            </div>
          </div>
        </div>
      </section>

      {/* Update course card styling in the component's CSS */}
      <style jsx>{`
        .course-card {
          position: relative;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 0.75rem;
          overflow: hidden;
          background: white;
          border: 1px solid rgba(209, 213, 219, 0.3);
          dark:bg-gray-800;
          dark:border-gray-700;
        }

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          dark:shadow-gray-900/30;
        }

        .live-course {
          border-left-color: #ef4444;
          dark:border-left-color: #dc2626;
        }

        .blended-course {
          border-left-color: #379392;
          dark:border-left-color: #2d7978;
        }
      `}</style>
    </ErrorBoundary>
  );
};

// Add display names for debugging
SortDropdown.displayName = 'SortDropdown';
SearchInput.displayName = 'SearchInput';
MemoizedCourseCard.displayName = 'MemoizedCourseCard';

CoursesFilter.propTypes = {
  CustomButton: PropTypes.func,
  CustomText: PropTypes.func,
  scrollToTop: PropTypes.bool,
  fixedCategory: PropTypes.string,
  hideCategoryFilter: PropTypes.bool,
  availableCategories: PropTypes.array,
  categoryTitle: PropTypes.string,
  description: PropTypes.string,
  classType: PropTypes.string,
  filterState: PropTypes.object,
  activeTab: PropTypes.string,
  onFilterToggle: PropTypes.func,
  // New props
  hideSearch: PropTypes.bool,
  hideSortOptions: PropTypes.bool,
  hideFilterBar: PropTypes.bool,
  hideViewModeSwitch: PropTypes.bool,
  hideHeader: PropTypes.bool,
  hideGradeFilter: PropTypes.bool,
  forceViewMode: PropTypes.string,
  gridColumns: PropTypes.number,
  itemsPerPage: PropTypes.number,
  simplePagination: PropTypes.bool,
  emptyStateContent: PropTypes.node,
  customGridClassName: PropTypes.string,
  customGridStyle: PropTypes.object,
  renderCourse: PropTypes.func,
  hideCategories: PropTypes.bool,
};

export default CoursesFilter;