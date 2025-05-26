"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  Sparkles,
  Target,
  Globe,
  Award
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
import { apiBaseUrl, apiUtils, ICourseFilters, ICourseSearchParams } from '@/apis/index';
import { getAllCoursesWithLimits } from '@/apis/course/course';
import axios from 'axios';

// TypeScript Interfaces
interface ICourse {
  _id: string;
  course_title: string;
  course_image?: string;
  course_category: string;
  course_fee: number;
  course_grade?: string;
  class_type?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IPagination {
  totalPages: number;
  total: number;
  currentPage: number;
  limit: number;
}

interface IApiResponse {
  success: boolean;
  data: {
    courses: ICourse[];
    pagination: IPagination;
    facets?: {
      categories?: string[];
      categoryTypes?: string[];
      classTypes?: string[];
      priceRanges?: Array<{ min: number; max: number; count: number }>;
    };
  };
}

interface IActiveFilter {
  type: string;
  label: string;
  value: string;
}

interface ITabStyles {
  bgColor: string;
  borderColor: string;
  textColor: string;
  buttonColor: string;
}

interface ICoursesFilterProps {
  CustomButton?: React.ComponentType<any>;
  CustomText?: React.ComponentType<any> | string;
  scrollToTop?: boolean;
  fixedCategory?: string;
  hideCategoryFilter?: boolean;
  availableCategories?: string[];
  categoryTitle?: string;
  description?: string;
  classType?: string;
  filterState?: {
    category?: string;
    grade?: string;
    search?: string;
    sort?: string;
  };
  activeTab?: string;
  onFilterToggle?: () => void;
  hideSearch?: boolean;
  hideSortOptions?: boolean;
  hideFilterBar?: boolean;
  hideViewModeSwitch?: boolean;
  hideHeader?: boolean;
  hideGradeFilter?: boolean;
  forceViewMode?: string | null;
  gridColumns?: number;
  itemsPerPage?: number;
  simplePagination?: boolean;
  emptyStateContent?: React.ReactNode;
  customGridClassName?: string;
  customGridStyle?: React.CSSProperties;
  renderCourse?: (course: ICourse) => ICourse;
  hideCategories?: boolean;
}

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

interface ISimplePaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  simplified?: boolean;
}

interface ISortDropdownProps {
  sortOrder: string;
  handleSortChange: (value: string) => void;
  showSortDropdown: boolean;
  setShowSortDropdown: (show: boolean) => void;
}

interface ISearchInputProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSearchTerm: (term: string) => void;
}

interface IWindowSize {
  width: number;
  height: number;
}

// Dynamically import components that might cause hydration issues
const DynamicCourseCard = dynamic(() => import("./CourseCard"), {
  ssr: true,
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 transition-colors duration-200"></div>,
});

// Fallback categories if none provided
const fallbackCategories: Record<string, string[]> = {
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
const ErrorBoundary: React.FC<IErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught error:", event);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-2xl my-8 text-center border border-red-200 dark:border-red-900/30">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
          Something went wrong
        </h2>
        <p className="mb-4 text-red-600 dark:text-red-400">
          We&apos;re sorry, but there was an error loading this page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

// Modern pagination component
const SimplePaginationWrapper: React.FC<ISimplePaginationWrapperProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "", 
  simplified = false 
}) => {
  if (simplified) {
    return (
      <div className={`flex items-center justify-center space-x-4 ${className}`}>
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-4 py-2 rounded-xl transition-all ${
            currentPage <= 1
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 rounded-xl transition-all ${
            currentPage >= totalPages
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
          }`}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  }

  // Original pagination implementation with modern styling
  const renderPageNumbers = (): React.ReactNode[] => {
    const pages: React.ReactNode[] = [];
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
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
            currentPage === i
              ? "bg-purple-500 text-white shadow-lg"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
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
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
          currentPage <= 1
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        }`}
        aria-label="Previous page"
      >
        ‹
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
          currentPage >= totalPages
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        }`}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};

// Memoized components for better performance
const MemoizedCourseCard = React.memo(DynamicCourseCard);

// Modern sort dropdown component
const SortDropdown = React.memo<ISortDropdownProps>(({ sortOrder, handleSortChange, showSortDropdown, setShowSortDropdown }) => {
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSortDropdown]);

  const getSortLabel = (value: string): string => {
    const labels: Record<string, string> = {
      "newest-first": "Newest",
      "oldest-first": "Oldest",
      "A-Z": "A-Z",
      "Z-A": "Z-A",
      "price-low-high": "Price ↑",
      "price-high-low": "Price ↓",
    };
    return labels[value] || "Newest";
  };

  return (
    <div className="relative" ref={sortDropdownRef}>
      <button
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className="flex items-center justify-between w-full md:w-32 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-sm"
        aria-expanded={showSortDropdown}
        aria-haspopup="true"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {getSortLabel(sortOrder)}
        </span>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 text-gray-400 dark:text-gray-500 ${showSortDropdown ? 'rotate-180' : ''}`} 
        />
      </button>

      {showSortDropdown && (
        <div className="absolute right-0 mt-2 w-full md:w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden" role="menu">
          <div className="py-2">
            {[
              { value: "newest-first", label: "Newest First" },
              { value: "oldest-first", label: "Oldest First" },
              { value: "A-Z", label: "Name (A-Z)" },
              { value: "Z-A", label: "Name (Z-A)" },
              { value: "price-low-high", label: "Price (Low→High)" },
              { value: "price-high-low", label: "Price (High→Low)" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`${
                  sortOrder === option.value
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } block w-full text-left px-4 py-3 text-sm transition-colors duration-200`}
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

// Modern search input component
const SearchInput = React.memo<ISearchInputProps>(({ searchTerm, handleSearch, setSearchTerm }) => (
  <div className="flex-grow relative">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full py-3 pl-12 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        aria-label="Search courses"
      />

      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  </div>
));

// Add a custom hook for window resize handling
const useWindowSize = (): IWindowSize => {
  const [windowSize, setWindowSize] = useState<IWindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Add debounce utility
const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

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
const getLocationCurrency = async (): Promise<string> => {
  try {
    const cachedCurrency = localStorage.getItem('userCurrency');
    const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
    
    if (cachedCurrency && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        console.log(`Using cached currency: ${cachedCurrency}`);
        return cachedCurrency;
      }
    }
    
    const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
    
    if (response.data && response.data.currency) {
      const detectedCurrency = response.data.currency;
      console.log(`Detected currency from IP: ${detectedCurrency}`);
      
      localStorage.setItem('userCurrency', detectedCurrency);
      localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
      
      return detectedCurrency;
    } else {
      console.log("Could not detect currency from IP, using default");
      return "USD";
    }
  } catch (error) {
    console.error("Error detecting location:", error);
    return "USD";
  }
};

const CoursesFilter: React.FC<ICoursesFilterProps> = ({
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
  renderCourse = (course: ICourse) => course,
  hideCategories = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getQuery, loading } = useGetQuery();

  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [responsiveGridColumns, setResponsiveGridColumns] = useState<number>(gridColumns);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest-first");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<string>(forceViewMode || "grid");
  
  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [showingRelated, setShowingRelated] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<IActiveFilter[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const didInitRef = useRef<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update grid columns based on screen size
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateGridColumns = (): void => {
      if (isMobile) {
        setResponsiveGridColumns(1);
      } else if (isTablet) {
        setResponsiveGridColumns(Math.min(gridColumns, 2));
      } else {
        setResponsiveGridColumns(gridColumns);
      }
    };
    
    updateGridColumns();
  }, [isMobile, isTablet, gridColumns]);

  // Reset page number when filters change
  useEffect(() => {
    if (!didInitRef.current) return;
    
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
    const initializeCurrency = async (): Promise<void> => {
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
    if (!didInitRef.current) return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
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
          const urlParams = new URLSearchParams(window.location.search);
          const hasFilterChange = 
            (urlParams.get("category") !== (q.get("category") || null)) || 
            (urlParams.get("grade") !== (q.get("grade") || null)) || 
            (urlParams.get("search") !== (q.get("search") || null)) || 
            (urlParams.get("sort") !== (q.get("sort") || null));
          
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
  const fetchCourses = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    
    setQueryError(null);

    try {
      // Build search parameters
      const searchParams: any = {
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
        onSuccess: (response: IApiResponse) => {
          if (!response || !response.success || !response.data) {
            throw new Error('Invalid API response');
          }

          const courses = response.data.courses;
          
          if (!Array.isArray(courses)) {
            throw new Error('Invalid courses data format');
          }

          setAllCourses(courses);
          setFilteredCourses(courses);

          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 1);
            setTotalItems(response.data.pagination.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(courses.length);
          }

          if (response.data.facets) {
            if (response.data.facets.categories) {
              console.debug('Categories facets:', response.data.facets.categories);
            }
            
            if (response.data.facets.categoryTypes) {
              console.debug('Category types facets:', response.data.facets.categoryTypes);
            }
            
            if (response.data.facets.classTypes) {
              console.debug('Class types facets:', response.data.facets.classTypes);
            }
            
            if (response.data.facets.priceRanges) {
              console.debug('Price ranges facets:', response.data.facets.priceRanges);
            }
          }

          if (scrollToTop && typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
        onFail: (err: any) => {
          console.error("API Error:", err);
          setQueryError(err?.message || "Failed to fetch courses. Please try again.");
          setAllCourses([]);
          setFilteredCourses([]);
          setTotalPages(1);
          setTotalItems(0);
        },
      });
    } catch (error: any) {
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
    if (!didInitRef.current) return;
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
    setTimeout(() => {
      if (didInitRef.current) {
        fetchCourses();
      }
    }, 0);
  }, []);

  /**
   * Handlers for filters
   */
  const handleCategoryChange = useCallback(
    (cats: string[]) => {
      if (fixedCategory) return;
      const newCats = cats.filter(Boolean);
      setSelectedCategory(newCats);
      setCurrentPage(1);
    },
    [fixedCategory]
  );

  const handleGradeChange = useCallback((grade: string) => {
    setSelectedGrade(grade);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((val: string) => {
    setSortOrder(val);
    setShowSortDropdown(false);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
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
    (type: string, val: string) => {
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
    (course: ICourse) => {
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
    const newFilters: IActiveFilter[] = [];
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
      const map: Record<string, string> = {
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
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <SearchX size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No courses found</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
          We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button
          onClick={handleClearFilters}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors duration-200 font-medium"
        >
          Clear Filters
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
  const getTabStyles = (): ITabStyles => {
    const styles: Record<string, ITabStyles> = {
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
  const getGridColumnClasses = (): string => {
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
  const safeGridStyle: React.CSSProperties = {
    ...customGridStyle,
    // Only set gridTemplateColumns if actually provided
    ...(Object.keys(customGridStyle).length > 0 ? {} : {
      gridTemplateColumns: `repeat(${responsiveGridColumns}, minmax(0, 1fr))`
    })
  };

  // Memoize grid classes
  const gridClasses = useMemo(() => getGridColumnClasses(), [responsiveGridColumns, customGridClassName]);

  // Modern course list renderer
  const renderCourseList = useCallback(() => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div 
              key={idx} 
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 transition-colors duration-200"
              role="presentation"
            />
          ))}
        </div>
      );
    }

    if (filteredCourses.length === 0) {
      return emptyStateContent || renderNoResults();
    }

    const gridClasses = viewMode === "grid" 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "space-y-4";

    return (
      <div className={gridClasses}>
        {filteredCourses.map((course) => {
          const enhancedCourse = renderCourse(course);
          
          return (
            <ErrorBoundary key={enhancedCourse._id}>
              <MemoizedCourseCard 
                course={enhancedCourse}
                viewMode={viewMode}
                isCompact={isMobile}
                preserveClassType={true}
                classType={classType || enhancedCourse.class_type}
                className={viewMode === "list" ? "border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200" : ""}
              />
            </ErrorBoundary>
          );
        })}
      </div>
    );
  }, [loading, filteredCourses, viewMode, isMobile, renderCourse, classType, itemsPerPage, emptyStateContent, renderNoResults]);

  // Modern sidebar renderer
  const renderSidebar = (): React.ReactNode => {
    if (hideCategoryFilter) return null;
    
    return (
      <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          {/* Categories */}
          {!hideCategoryFilter && !hideCategories && (
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Categories</h4>
              <CategoryFilter
                categories={availableCategories || fallbackCategories[classType] || fallbackCategories.all}
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategoryChange}
              />
            </div>
          )}
          
          {/* Grade Filter */}
          {!hideGradeFilter && (
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Grade Level</h4>
              <div className="space-y-3">
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
                  <label key={grade} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="grade"
                      value={grade}
                      checked={selectedGrade === grade}
                      onChange={() => handleGradeChange(grade)}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {grade}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Features */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Features</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Award size={16} className="text-purple-500" />
                <span className="text-sm">Certification</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Target size={16} className="text-blue-500" />
                <span className="text-sm">Assignments</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Globe size={16} className="text-green-500" />
                <span className="text-sm">Global Access</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Sparkles size={16} className="text-yellow-500" />
                <span className="text-sm">Interactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modern main content renderer
  const renderMainContent = (): React.ReactNode => {
    return (
      <div className={!hideCategoryFilter ? "lg:w-3/4" : "w-full"}>
        {/* Results count */}
        {!hideFilterBar && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalItems}
              </span>
              <span className="ml-2 text-lg">
                {totalItems === 1 ? 'course found' : 'courses found'}
              </span>
              {showingRelated && (
                <button
                  onClick={clearRelated}
                  className="ml-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline"
                >
                  Back to All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error state */}
        {queryError && (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50 dark:bg-red-900/10 text-center mb-8">
            <AlertCircle size={48} className="text-red-500 dark:text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Error Loading Courses</h3>
            <p className="text-red-600 dark:text-red-400 max-w-md mb-6">
              {queryError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}

        {renderCourseList()}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex justify-center" aria-label="Pagination">
            {simplePagination ? (
              <SimplePaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                simplified={true}
              />
            ) : (
              <SimplePaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                simplified={false}
              />
            )}
          </nav>
        )}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <section className="py-8" role="region" aria-label="Course Filter">
        {/* Modern header */}
        {!hideHeader && (
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {typeof CustomText === 'string' ? CustomText : "Explore Courses"}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {description || "Discover courses to enhance your skills and advance your career."}
            </p>
          </div>
        )}

        {/* Main container */}
        <div className="max-w-7xl mx-auto px-4">
          {/* Search and filters bar */}
          {!hideFilterBar && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {!hideSearch && <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} setSearchTerm={setSearchTerm} />}
                {!hideSortOptions && <SortDropdown sortOrder={sortOrder} handleSortChange={handleSortChange} showSortDropdown={showSortDropdown} setShowSortDropdown={setShowSortDropdown} />}
                
                {/* View mode toggle */}
                {!hideViewModeSwitch && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <LayoutGrid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                )}

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Filter size={18} className="mr-2" />
                  Filters
                </button>
              </div>

              {/* Active filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active:
                  </span>
                  {activeFilters.map((f, idx) => (
                    <div
                      key={`${f.type}-${idx}`}
                      className="flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm"
                    >
                      {f.label}
                      <button
                        onClick={() => removeFilter(f.type, f.value)}
                        className="ml-2 hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Main content area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {renderSidebar()}
            {renderMainContent()}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

// Add display names for debugging
SortDropdown.displayName = 'SortDropdown';
SearchInput.displayName = 'SearchInput';
MemoizedCourseCard.displayName = 'MemoizedCourseCard';

export default CoursesFilter; 