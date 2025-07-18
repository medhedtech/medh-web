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
  AlertCircle,
  SearchX,
  ChevronRight,
  Sparkles,
  Target,
  Globe,
  Award
} from "lucide-react";
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
  hideHeader?: boolean;
  hideGradeFilter?: boolean;
  gridColumns?: number;
  itemsPerPage?: number;
  simplePagination?: boolean;
  emptyStateContent?: React.ReactNode;
  customGridClassName?: string;
  customGridStyle?: React.CSSProperties;
  renderCourse?: (course: ICourse) => ICourse;
  hideCategories?: boolean;
  onFilterDropdownToggle?: (isOpen: boolean) => void;
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
    // Removed: "AI and Data Science",
    // Removed: "Personality Development", 
    // Removed: "Vedic Mathematics",
    // Removed: "Digital Marketing with Data Analytics",
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

// Add grade options constant after the fallbackCategories (around line 170)
const gradeOptions = [
  "Preschool",
  "Grade 1-2", 
  "Grade 3-4",
  "Grade 5-6",
  "Grade 7-8", 
  "Grade 9-10",
  "Grade 11-12",
  "UG - Graduate - Professionals"
];

// Add filter options for live courses, blended learning, and free courses
const liveCoursesOptions = [
  "AI and Data Science",
  "Personality Development",
  "Vedic Mathematics",
  "Digital Marketing with Data Analytics"
];

const blendedLearningOptions = [
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
  "Legal & Compliance Skills"
];

const freeCoursesOptions = [
  "Introduction to Programming",
  "Basic Digital Literacy",
  "Communication Fundamentals",
  "Career Guidance",
  "Personal Development Basics"
];

const selfPacedLearningOptions = [
  "Programming Fundamentals",
  "Data Analytics",
  "Digital Marketing",
  "Project Management",
  "Creative Skills",
  "Business Development"
];

/**
 * Enhanced ErrorBoundary with better error handling
 */
const ErrorBoundary: React.FC<IErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("Caught error:", event);
      }
      setHasError(true);
      setErrorInfo(event.error?.message || event.message || 'Unknown error');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("Unhandled promise rejection:", event.reason);
      }
      setHasError(true);
      setErrorInfo(event.reason?.message || 'Promise rejection error');
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2 text-center">
          Oops! Something went wrong
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 text-center mb-4">
          Don&apos;t worry, this happens sometimes. Try refreshing the page or contact support if the problem persists.
        </p>
        {process.env.NODE_ENV === 'development' && errorInfo && (
          <details className="mb-4 text-xs text-red-500">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded overflow-auto">
              {errorInfo}
            </pre>
          </details>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setHasError(false);
              setErrorInfo(null);
            }}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
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
    width: typeof window !== 'undefined' ? window.innerWidth : 1024, // Default to desktop size
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
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

// Add intersection observer hook for lazy loading
const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  threshold: number = 0.1,
  rootMargin: string = '50px'
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, rootMargin]);

  return isVisible;
};

// Add currency detection function
const getLocationCurrency = async (): Promise<string> => {
  try {
    const cachedCurrency = localStorage.getItem('userCurrency');
    const cachedTimestamp = localStorage.getItem('userCurrencyTimestamp');
    
    if (cachedCurrency && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Using cached currency: ${cachedCurrency}`);
        }
        return cachedCurrency;
      }
    }
    
    const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
    
    if (response.data && response.data.currency) {
      const detectedCurrency = response.data.currency;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Detected currency from IP: ${detectedCurrency}`);
      }
      
      localStorage.setItem('userCurrency', detectedCurrency);
      localStorage.setItem('userCurrencyTimestamp', Date.now().toString());
      
      return detectedCurrency;
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log("Could not detect currency from IP, using default");
      }
      return "USD";
    }
  } catch (error) {
    console.error("Error detecting location:", error);
    return "USD";
  }
};

// Add performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  
  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTime.current;
      
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`${componentName} render time: ${renderTime.toFixed(2)}ms (>16ms threshold)`);
      }
    };
  });
  
  const measureAction = useCallback((actionName: string, action: () => void) => {
    const startTime = performance.now();
    action();
    const endTime = performance.now();
    
          if (process.env.NODE_ENV === 'development' && endTime - startTime > 16) {
        console.log(`${componentName} ${actionName}: ${(endTime - startTime).toFixed(2)}ms`);
      }
  }, [componentName]);
  
  return { measureAction };
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
  hideHeader = false,
  hideGradeFilter = false,
  gridColumns = 3,
  itemsPerPage = 9,
  simplePagination = false,
  emptyStateContent = null,
  customGridClassName = "",
  customGridStyle = {},
  renderCourse = (course: ICourse) => course,
  hideCategories = false,
  onFilterDropdownToggle = () => {},
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getQuery, loading } = useGetQuery();

  // State declarations - moved to top to prevent initialization errors
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string[]>([]);
  const [selectedLiveCourses, setSelectedLiveCourses] = useState<string[]>([]);
  const [selectedBlendedLearning, setSelectedBlendedLearning] = useState<string[]>([]);
  const [selectedSelfPaced, setSelectedSelfPaced] = useState<string[]>([]);
  const [selectedFreeCourses, setSelectedFreeCourses] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest-first");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode] = useState<string>("grid");
  
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
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string[]>([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  // Add state for grade dropdown after the existing state declarations (around line 641)
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState<boolean>(false);
  const [isLiveCoursesDropdownOpen, setIsLiveCoursesDropdownOpen] = useState<boolean>(false);
  const [isBlendedLearningDropdownOpen, setIsBlendedLearningDropdownOpen] = useState<boolean>(false);
  const [isSelfPacedDropdownOpen, setIsSelfPacedDropdownOpen] = useState<boolean>(false);
  const [isFreeCoursesDropdownOpen, setIsFreeCoursesDropdownOpen] = useState<boolean>(false);

  // Refs
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const didInitRef = useRef<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef<number>(0);
  const performanceStartTime = useRef<number>(0);

  // Other hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [responsiveGridColumns, setResponsiveGridColumns] = useState<number>(gridColumns);

  // Performance monitoring
  useEffect(() => {
    performanceStartTime.current = performance.now();
  }, []);
  
  useEffect(() => {
    if (!loading && filteredCourses.length > 0) {
      const loadTime = performance.now() - performanceStartTime.current;
      if (process.env.NODE_ENV === 'development' && loadTime > 100) {
        console.log(`Course loading completed in ${loadTime.toFixed(2)}ms for ${filteredCourses.length} courses`);
      }
    }
  }, [loading, filteredCourses.length]);

  // Update grid columns based on screen size
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateGridColumns = (): void => {
      if (isMobile) {
        setResponsiveGridColumns(1);
      } else if (isTablet) {
        setResponsiveGridColumns(2);
      } else {
        // Always use 3 columns for desktop and larger screens
        setResponsiveGridColumns(3);
      }
    };
    
    updateGridColumns();
  }, [isMobile, isTablet, gridColumns]);

  // Reset page number when filters change
  useEffect(() => {
    if (!didInitRef.current) return;
    
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedGrade, sortOrder]);

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
    if (urlGrade) setSelectedGrade(urlGrade.split(","));

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
    if (filterState.grade) setSelectedGrade(filterState.grade.split(","));
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
        if (selectedGrade.length > 0) {
          q.set("grade", selectedGrade.map(encodeURIComponent).join(","));
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
          router.push(newUrl);
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

      // Add categories from dropdown filters
      const allSelectedCategories: string[] = [];
      
      // Add regular categories
      if (!fixedCategory && selectedCategory.length > 0) {
        allSelectedCategories.push(...selectedCategory);
      }
      
      // Add Live Courses categories
      if (selectedLiveCourses.length > 0) {
        allSelectedCategories.push(...selectedLiveCourses);
      }
      
      // Add Blended Learning categories  
      if (selectedBlendedLearning.length > 0) {
        allSelectedCategories.push(...selectedBlendedLearning);
      }
      
      // Add Self-Paced categories
      if (selectedSelfPaced.length > 0) {
        allSelectedCategories.push(...selectedSelfPaced);
      }
      
      // Add Free Courses categories
      if (selectedFreeCourses.length > 0) {
        allSelectedCategories.push(...selectedFreeCourses);
      }

      // Set the combined categories for API
      if (fixedCategory) {
        searchParams.course_category = fixedCategory;
      } else if (allSelectedCategories.length > 0) {
        searchParams.course_category = allSelectedCategories;
      }

      // Add search term if available
      if (searchTerm?.trim()) {
        searchParams.search = searchTerm.trim();
      }

      // Add grade if selected
      if (selectedGrade.length > 0) {
        searchParams.course_grade = selectedGrade.join(",");
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
        onSuccess: (response: any) => {
          console.log('CoursesFilter2 API Response:', response);
          
          let courses: ICourse[] = [];
          
          // Enhanced response validation to handle different API response structures
          if (!response) {
            console.log('Response is null/undefined, setting empty courses');
            courses = [];
          } else if (Array.isArray(response)) {
            console.log('Response is direct array of courses');
            courses = response;
          } else if (response.success && response.data && Array.isArray(response.data.courses)) {
            console.log('Response has success wrapper with data.courses');
            courses = response.data.courses;
          } else if (response.data && Array.isArray(response.data)) {
            console.log('Response has data array');
            courses = response.data;
          } else if (response.courses && Array.isArray(response.courses)) {
            console.log('Response has courses array');
            courses = response.courses;
          } else if (response.success && response.data && Array.isArray(response.data)) {
            console.log('Response has success wrapper with data array');
            courses = response.data;
          } else {
            console.log('Unrecognized response structure, setting empty courses. Response type:', typeof response, 'Keys:', Object.keys(response || {}));
            courses = [];
          }

          setAllCourses(courses);
          setFilteredCourses(courses);

          // Handle pagination data from different response structures
          let paginationData = null;
          if (response && response.data && response.data.pagination) {
            paginationData = response.data.pagination;
          } else if (response && response.pagination) {
            paginationData = response.pagination;
          }
          
          if (paginationData) {
            setTotalPages(paginationData.totalPages || 1);
            setTotalItems(paginationData.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(courses.length);
          }

          // Handle facets data from different response structures
          let facetsData = null;
          if (response && response.data && response.data.facets) {
            facetsData = response.data.facets;
          } else if (response && response.facets) {
            facetsData = response.facets;
          }
          
          if (facetsData && process.env.NODE_ENV === 'development') {
            if (facetsData.categories) {
              console.debug('Categories facets:', facetsData.categories);
            }
            
            if (facetsData.categoryTypes) {
              console.debug('Category types facets:', facetsData.categoryTypes);
            }
            
            if (facetsData.classTypes) {
              console.debug('Class types facets:', facetsData.classTypes);
            }
            
            if (facetsData.priceRanges) {
              console.debug('Price ranges facets:', facetsData.priceRanges);
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
    userCurrency,
    selectedLiveCourses,
    selectedBlendedLearning,
    selectedSelfPaced,
    selectedFreeCourses
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

  const handleGradeChange = useCallback((grades: string[]) => {
    setSelectedGrade(grades);
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
    setSelectedGrade([]);
    setSelectedLiveCourses([]);
    setSelectedBlendedLearning([]);
    setSelectedSelfPaced([]);
    setSelectedFreeCourses([]);
    setSearchTerm("");
    setSortOrder("newest-first");
    setCurrentPage(1);
    setShowingRelated(false);
    // Clear new filter states
    setSelectedLevel("");
    setSelectedDuration([]);
    setSelectedPriceRange([]);
    setSelectedFeatures([]);
    setSelectedFormat([]);
    setSelectedLanguage([]);
    setSelectedRating("");
    setSelectedInstructor([]);
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
          setSelectedGrade(prev => prev.filter(g => g !== val));
          break;
        case "liveCourses":
          setSelectedLiveCourses(prev => prev.filter(item => item !== val));
          break;
        case "blendedLearning":
          setSelectedBlendedLearning(prev => prev.filter(item => item !== val));
          break;
        case "selfPaced":
          setSelectedSelfPaced(prev => prev.filter(item => item !== val));
          break;
        case "freeCourses":
          setSelectedFreeCourses(prev => prev.filter(item => item !== val));
          break;
        case "level":
          setSelectedLevel("");
          break;
        case "duration":
          setSelectedDuration(prev => prev.filter(d => d !== val));
          break;
        case "price":
          setSelectedPriceRange(prev => prev.filter(p => p !== val));
          break;
        case "format":
          setSelectedFormat(prev => prev.filter(f => f !== val));
          break;
        case "language":
          setSelectedLanguage(prev => prev.filter(l => l !== val));
          break;
        case "features":
          setSelectedFeatures(prev => prev.filter(f => f !== val));
          break;
        case "rating":
          setSelectedRating("");
          break;
        case "instructor":
          setSelectedInstructor(prev => prev.filter(i => i !== val));
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
    if (selectedGrade.length > 0) {
      selectedGrade.forEach((grade) => {
        newFilters.push({
          type: "grade",
          label: `Grade: ${grade}`,
          value: grade,
        });
      });
    }
    // live courses
    if (selectedLiveCourses.length > 0) {
      selectedLiveCourses.forEach((option) => {
        newFilters.push({
          type: "liveCourses",
          label: `Live: ${option}`,
          value: option,
        });
      });
    }
    // blended learning
    if (selectedBlendedLearning.length > 0) {
      selectedBlendedLearning.forEach((option) => {
        newFilters.push({
          type: "blendedLearning",
          label: `Blended: ${option}`,
          value: option,
        });
      });
    }
    // self-paced courses
    if (selectedSelfPaced.length > 0) {
      selectedSelfPaced.forEach((option) => {
        newFilters.push({
          type: "selfPaced",
          label: `Self-Paced: ${option}`,
          value: option,
        });
      });
    }
    // free courses
    if (selectedFreeCourses.length > 0) {
      selectedFreeCourses.forEach((option) => {
        newFilters.push({
          type: "freeCourses",
          label: `Free: ${option}`,
          value: option,
        });
      });
    }
    // skill level
    if (selectedLevel) {
      const levelLabels: Record<string, string> = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'expert': 'Expert'
      };
      newFilters.push({
        type: "level",
        label: `Level: ${levelLabels[selectedLevel] || selectedLevel}`,
        value: selectedLevel,
      });
    }
    // duration
    if (selectedDuration.length > 0) {
      const durationLabels: Record<string, string> = {
        '0-2': '0-2 weeks',
        '2-4': '2-4 weeks',
        '1-3': '1-3 months',
        '3-6': '3-6 months',
        '6+': '6+ months'
      };
      selectedDuration.forEach((duration) => {
        newFilters.push({
          type: "duration",
          label: `Duration: ${durationLabels[duration] || duration}`,
          value: duration,
        });
      });
    }
    // price range
    if (selectedPriceRange.length > 0) {
      const priceLabels: Record<string, string> = {
        'free': 'Free',
        '0-5000': '₹0 - ₹5,000',
        '5000-15000': '₹5,000 - ₹15,000',
        '15000-30000': '₹15,000 - ₹30,000',
        '30000+': '₹30,000+'
      };
      selectedPriceRange.forEach((price) => {
        newFilters.push({
          type: "price",
          label: `Price: ${priceLabels[price] || price}`,
          value: price,
        });
      });
    }
    // course format
    if (selectedFormat.length > 0) {
      const formatLabels: Record<string, string> = {
        'live': 'Live Classes',
        'recorded': 'Recorded Videos',
        'hybrid': 'Hybrid (Live + Recorded)',
        'self-paced': 'Self-Paced Learning'
      };
      selectedFormat.forEach((format) => {
        newFilters.push({
          type: "format",
          label: `Format: ${formatLabels[format] || format}`,
          value: format,
        });
      });
    }
    // language
    if (selectedLanguage.length > 0) {
      const languageLabels: Record<string, string> = {
        'english': 'English',
        'hindi': 'Hindi',
        'spanish': 'Spanish',
        'french': 'French',
        'german': 'German'
      };
      selectedLanguage.forEach((language) => {
        newFilters.push({
          type: "language",
          label: `Language: ${languageLabels[language] || language}`,
          value: language,
        });
      });
    }
    // features
    if (selectedFeatures.length > 0) {
      const featureLabels: Record<string, string> = {
        'certificate': 'Certificate Included',
        'job-guarantee': 'Job Guarantee',
        'live-sessions': 'Live Sessions',
        'hands-on-projects': 'Hands-on Projects',
        'mentor-support': 'Mentor Support',
        'lifetime-access': 'Lifetime Access'
      };
      selectedFeatures.forEach((feature) => {
        newFilters.push({
          type: "features",
          label: `${featureLabels[feature] || feature}`,
          value: feature,
        });
      });
    }
    // rating
    if (selectedRating) {
      newFilters.push({
        type: "rating",
        label: `Rating: ${selectedRating}`,
        value: selectedRating,
      });
    }
    // instructor type
    if (selectedInstructor.length > 0) {
      const instructorLabels: Record<string, string> = {
        'industry-expert': 'Industry Expert',
        'certified-trainer': 'Certified Trainer',
        'university-professor': 'University Professor',
        'freelance-professional': 'Freelance Professional'
      };
      selectedInstructor.forEach((instructor) => {
        newFilters.push({
          type: "instructor",
          label: `Instructor: ${instructorLabels[instructor] || instructor}`,
          value: instructor,
        });
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
  }, [searchTerm, selectedCategory, selectedGrade, selectedLiveCourses, selectedBlendedLearning, selectedSelfPaced, selectedFreeCourses, selectedLevel, selectedDuration, selectedPriceRange, selectedFormat, selectedLanguage, selectedFeatures, selectedRating, selectedInstructor, sortOrder, hideCategoryFilter]);

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
   * Count text - Memoized for performance
   */
  const coursesCountText = useMemo(() => {
    if (showingRelated) return "Related Courses";
    if (totalItems === 0) return "No courses found";
    if (totalItems === 1) return "1 course found";
    return `${totalItems.toLocaleString()} courses found`;
  }, [showingRelated, totalItems]);

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
    
    // Default responsive grid - maximum 3 columns
    let gridClass = "grid gap-6 pb-1";
    
    switch (responsiveGridColumns) {
      case 1:
        gridClass += " grid-cols-1";
        break;
      case 2:
        gridClass += " grid-cols-1 md:grid-cols-2";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 xl:gap-6 2xl:gap-8">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div 
              key={idx} 
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-96 transition-colors duration-200 flex flex-col"
              role="presentation"
            >
              {/* Skeleton Image */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl mb-4"></div>
              {/* Skeleton Content */}
              <div className="px-4 pb-4 flex-1 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredCourses.length === 0) {
      return emptyStateContent || renderNoResults();
    }

    return (
      <div className="relative">
        {/* Enhanced Course Cards Grid - Responsive for all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 xl:gap-6 2xl:gap-8 auto-rows-fr">
            {filteredCourses.map((course, index) => {
              if (!course || !course._id) {
                console.warn('Invalid course data:', course);
                return null;
              }
              
              const enhancedCourse = renderCourse ? renderCourse(course) : course;
              
              return (
                <ErrorBoundary key={`course-${enhancedCourse._id}-${index}`}>
                  <div
                    className="h-full opacity-0"
                    style={{
                      animationDelay: `${Math.min(index * 100, 1000)}ms`, // Cap delay at 1 second
                      animation: 'fadeInUp 0.6s ease-out forwards',
                    }}
                  >
                    <MemoizedCourseCard
                      course={enhancedCourse}
                      viewMode="grid"
                      isCompact={isMobile}
                      preserveClassType={true}
                      classType={classType || enhancedCourse.class_type}
                    />
                  </div>
                </ErrorBoundary>
              );
            })}
        </div>

        {/* Enhanced Custom CSS for animations and performance */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }

          /* Custom Scrollbar Styles */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgb(156 163 175) rgb(243 244 246);
          }

          .dark .custom-scrollbar {
            scrollbar-color: rgb(75 85 99) rgb(31 41 55);
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgb(243 244 246);
            border-radius: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgb(156 163 175);
            border-radius: 6px;
            border: 1px solid rgb(243 244 246);
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgb(107 114 128);
          }

          .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: rgb(31 41 55);
          }

          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgb(75 85 99);
            border-color: rgb(31 41 55);
          }

          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgb(107 114 128);
          }

          /* Dropdown Animation Enhancements */
          .dropdown-enter {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }

          .dropdown-enter-active {
            opacity: 1;
            max-height: 400px;
            transform: translateY(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .dropdown-exit {
            opacity: 1;
            max-height: 400px;
            transform: translateY(0);
          }

          .dropdown-exit-active {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Enhanced hover effects */
          .dropdown-item:hover {
            transform: translateX(4px);
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          }

          /* Grid optimizations */
          .grid {
            contain: layout style paint;
          }

          /* Smooth scroll behavior */
          .overflow-y-auto {
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: rgb(156 163 175) rgb(243 244 246);
          }

          .dark .overflow-y-auto {
            scrollbar-color: rgb(75 85 99) rgb(31 41 55);
          }

          /* Webkit scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgb(243 244 246);
            border-radius: 8px;
          }

          ::-webkit-scrollbar-thumb {
            background: rgb(156 163 175);
            border-radius: 8px;
            border: 2px solid rgb(243 244 246);
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgb(107 114 128);
          }

          .dark ::-webkit-scrollbar-track {
            background: rgb(31 41 55);
          }

          .dark ::-webkit-scrollbar-thumb {
            background: rgb(75 85 99);
            border-color: rgb(31 41 55);
          }

          .dark ::-webkit-scrollbar-thumb:hover {
            background: rgb(107 114 128);
          }

          /* Performance optimizations */
          .course-card {
            will-change: transform;
            transform: translateZ(0);
          }

          /* Responsive grid improvements - Optimized for all screen sizes */
          @media (max-width: 640px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
          
          @media (min-width: 1280px) {
            .grid {
              gap: 1.5rem;
            }
          }
          
          @media (min-width: 1536px) {
            .grid {
              gap: 2rem;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              max-width: none;
            }
          }
          
          @media (min-width: 1920px) {
            .grid {
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2.5rem;
            }
          }

          @media (min-width: 641px) and (max-width: 1024px) {
            .grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1025px) {
            .grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          /* Course card container optimizations */
          .course-card-container {
            min-height: 400px;
            display: flex;
            flex-direction: column;
          }

          /* Loading state improvements */
          .skeleton-loader {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }

          .dark .skeleton-loader {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200% 100%;
          }

          @keyframes loading {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          /* Improved lazy loading with reduced motion for accessibility */
          @media (prefers-reduced-motion: no-preference) {
            .course-card[data-visible="false"] {
              opacity: 0;
              transform: translateY(30px);
            }

            .course-card[data-visible="true"] {
              opacity: 1;
              transform: translateY(0);
              transition: opacity 0.4s ease, transform 0.4s ease;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .course-card[data-visible="false"] {
              opacity: 0;
            }

            .course-card[data-visible="true"] {
              opacity: 1;
              transition: opacity 0.2s ease;
            }
          }

          /* Prevent text selection on dropdown headers */
          .dropdown-header {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }

          /* Enhanced focus states */
          .dropdown-item:focus-within {
            outline: 2px solid rgb(147 51 234);
            outline-offset: 2px;
          }

          /* Backdrop blur effect for better visual separation */
          .dropdown-backdrop {
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }
        `}</style>
      </div>
    );
  }, [loading, filteredCourses, isMobile, renderCourse, classType, itemsPerPage, emptyStateContent, renderNoResults]);

  // Modern sidebar renderer - Simplified Category Filter
  const renderSidebar = (): React.ReactNode => {
    if (hideCategoryFilter) return null;
    
    return (
      <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          {/* Categories Section */}
          {!hideCategoryFilter && !hideCategories && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Categories</h4>
              
              {/* Live Courses */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 overflow-hidden" data-live-courses-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 ease-in-out" 
                  onClick={() => setIsLiveCoursesDropdownOpen(!isLiveCoursesDropdownOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center transition-all duration-300">
                      <Zap className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-red-900 dark:text-red-100">Live Courses</h5>
                      <p className="text-sm text-red-600 dark:text-red-400">Interactive live sessions with instructors</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-red-600 dark:text-red-400 transition-all duration-300 ease-in-out ${isLiveCoursesDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Live Courses Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isLiveCoursesDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-red-100 dark:border-red-900/30 bg-white dark:bg-gray-800">
                    {liveCoursesOptions.map((option, index) => (
                      <label
                        key={option}
                        className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${isLiveCoursesDropdownOpen ? 'animate-slideIn' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedLiveCourses.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLiveCourses(prev => [...prev, option]);
                              } else {
                                setSelectedLiveCourses(prev => prev.filter(item => item !== option));
                              }
                            }}
                            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {option}
                          </span>
                        </div>
                        {selectedLiveCourses.includes(option) && (
                          <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-full animate-pulse">
                            ✓
                          </span>
                        )}
                      </label>
                    ))}
                    
                    {/* Clear Live Courses Filters */}
                    {selectedLiveCourses.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setSelectedLiveCourses([])}
                          className="w-full text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Clear Live Courses ({selectedLiveCourses.length})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Blended Learning */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 overflow-hidden" data-blended-learning-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 ease-in-out" 
                  onClick={() => setIsBlendedLearningDropdownOpen(!isBlendedLearningDropdownOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center transition-all duration-300">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-900 dark:text-blue-100">Blended Learning</h5>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Combination of live and self-paced learning</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-in-out ${isBlendedLearningDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Blended Learning Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isBlendedLearningDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-blue-100 dark:border-blue-900/30 bg-white dark:bg-gray-800">
                    {blendedLearningOptions.map((option, index) => (
                      <label
                        key={option}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${isBlendedLearningDropdownOpen ? 'animate-slideIn' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedBlendedLearning.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBlendedLearning(prev => [...prev, option]);
                              } else {
                                setSelectedBlendedLearning(prev => prev.filter(item => item !== option));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {option}
                          </span>
                        </div>
                        {selectedBlendedLearning.includes(option) && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full animate-pulse">
                            ✓
                          </span>
                        )}
                      </label>
                    ))}
                    
                    {/* Clear Blended Learning Filters */}
                    {selectedBlendedLearning.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setSelectedBlendedLearning([])}
                          className="w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Clear Blended Learning ({selectedBlendedLearning.length})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Self-Paced Learning */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden" data-self-paced-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-300 ease-in-out" 
                  onClick={() => setIsSelfPacedDropdownOpen(!isSelfPacedDropdownOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center transition-all duration-300">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-emerald-900 dark:text-emerald-100">Self-Paced Learning</h5>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Self-paced with live support sessions</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-all duration-300 ease-in-out ${isSelfPacedDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Self-Paced Learning Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSelfPacedDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-gray-800">
                    {selfPacedLearningOptions.map((option, index) => (
                      <label
                        key={option}
                        className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${isSelfPacedDropdownOpen ? 'animate-slideIn' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedSelfPaced.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSelfPaced(prev => [...prev, option]);
                              } else {
                                setSelectedSelfPaced(prev => prev.filter(item => item !== option));
                              }
                            }}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {option}
                          </span>
                        </div>
                        {selectedSelfPaced.includes(option) && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-full animate-pulse">
                            ✓
                          </span>
                        )}
                      </label>
                    ))}
                    
                    {/* Clear Self-Paced Filters */}
                    {selectedSelfPaced.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setSelectedSelfPaced([])}
                          className="w-full text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Clear Self-Paced ({selectedSelfPaced.length})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Free Courses */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30 overflow-hidden" data-free-courses-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 ease-in-out" 
                  onClick={() => setIsFreeCoursesDropdownOpen(!isFreeCoursesDropdownOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center transition-all duration-300">
                      <span className="text-green-600 dark:text-green-400 font-bold text-sm">$</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-900 dark:text-green-100">Free Courses</h5>
                      <p className="text-sm text-green-600 dark:text-green-400">Free courses to get you started</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-green-600 dark:text-green-400 transition-all duration-300 ease-in-out ${isFreeCoursesDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Free Courses Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFreeCoursesDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-green-100 dark:border-green-900/30 bg-white dark:bg-gray-800">
                    {freeCoursesOptions.map((option, index) => (
                      <label
                        key={option}
                        className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${isFreeCoursesDropdownOpen ? 'animate-slideIn' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedFreeCourses.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFreeCourses(prev => [...prev, option]);
                              } else {
                                setSelectedFreeCourses(prev => prev.filter(item => item !== option));
                              }
                            }}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {option}
                          </span>
                        </div>
                        {selectedFreeCourses.includes(option) && (
                          <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full animate-pulse">
                            ✓
                          </span>
                        )}
                      </label>
                    ))}
                    
                    {/* Clear Free Courses Filters */}
                    {selectedFreeCourses.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setSelectedFreeCourses([])}
                          className="w-full text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Clear Free Courses ({selectedFreeCourses.length})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Grade Level */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30 overflow-hidden" data-grade-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 ease-in-out" 
                  onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center transition-all duration-300">
                      <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-purple-900 dark:text-purple-100">Grade Level</h5>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Filter by educational grade level</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-purple-600 dark:text-purple-400 transition-all duration-300 ease-in-out ${isGradeDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Grade Level Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isGradeDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-purple-100 dark:border-purple-900/30 bg-white dark:bg-gray-800">
                    {gradeOptions.map((grade, index) => (
                      <label
                        key={grade}
                        className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${isGradeDropdownOpen ? 'animate-slideIn' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedGrade.includes(grade)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGrade(prev => [...prev, grade]);
                              } else {
                                setSelectedGrade(prev => prev.filter(g => g !== grade));
                              }
                            }}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {grade}
                          </span>
                        </div>
                        {selectedGrade.includes(grade) && (
                          <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-full animate-pulse">
                            ✓
                          </span>
                        )}
                      </label>
                    ))}
                    
                    {/* Clear Grade Filters */}
                    {selectedGrade.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setSelectedGrade([])}
                          className="w-full text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Clear Grade Filters ({selectedGrade.length})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Filter dropdown component - memoized to prevent carousel interference
  const FilterDropdown = React.memo(() => {
    // Save and restore scroll position to prevent jumping to top
    useEffect(() => {
      if (isFilterDropdownOpen && filterScrollRef.current) {
        // Restore scroll position after re-render
        filterScrollRef.current.scrollTop = savedScrollPosition.current;
      }
    });

    // Save scroll position before potential re-renders
    const handleDropdownScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      savedScrollPosition.current = e.currentTarget.scrollTop;
    }, []);

    // Memoize filter options to prevent recreation on every render
    const filterOptions = useMemo(() => [
      {
        id: 'level',
        label: 'Skill Level',
        type: 'radio',
        options: [
          { value: 'beginner', label: 'Beginner', count: 45 },
          { value: 'intermediate', label: 'Intermediate', count: 38 },
          { value: 'advanced', label: 'Advanced', count: 25 },
          { value: 'expert', label: 'Expert', count: 12 }
        ]
      },
      {
        id: 'duration',
        label: 'Course Duration',
        type: 'checkbox',
        options: [
          { value: '0-2', label: '0-2 weeks', count: 8 },
          { value: '2-4', label: '2-4 weeks', count: 15 },
          { value: '1-3', label: '1-3 months', count: 35 },
          { value: '3-6', label: '3-6 months', count: 28 },
          { value: '6+', label: '6+ months', count: 20 }
        ]
      },
      {
        id: 'price',
        label: 'Price Range',
        type: 'checkbox',
        options: [
          { value: 'free', label: 'Free', count: 12 },
          { value: '0-5000', label: '₹0 - ₹5,000', count: 18 },
          { value: '5000-15000', label: '₹5,000 - ₹15,000', count: 25 },
          { value: '15000-30000', label: '₹15,000 - ₹30,000', count: 22 },
          { value: '30000+', label: '₹30,000+', count: 15 }
        ]
      },
      {
        id: 'format',
        label: 'Course Format',
        type: 'checkbox',
        options: [
          { value: 'live', label: 'Live Classes', count: 32 },
          { value: 'recorded', label: 'Recorded Videos', count: 58 },
          { value: 'hybrid', label: 'Hybrid (Live + Recorded)', count: 24 },
          { value: 'self-paced', label: 'Self-Paced Learning', count: 41 }
        ]
      },
      {
        id: 'language',
        label: 'Language',
        type: 'checkbox',
        options: [
          { value: 'english', label: 'English', count: 95 },
          { value: 'hindi', label: 'Hindi', count: 67 },
          { value: 'spanish', label: 'Spanish', count: 23 },
          { value: 'french', label: 'French', count: 15 },
          { value: 'german', label: 'German', count: 12 }
        ]
      },
      {
        id: 'features',
        label: 'Course Features',
        type: 'checkbox',
        options: [
          { value: 'certificate', label: 'Certificate Included', count: 85 },
          { value: 'job-guarantee', label: 'Job Guarantee', count: 25 },
          { value: 'live-sessions', label: 'Live Sessions', count: 45 },
          { value: 'hands-on-projects', label: 'Hands-on Projects', count: 60 },
          { value: 'mentor-support', label: 'Mentor Support', count: 40 },
          { value: 'lifetime-access', label: 'Lifetime Access', count: 50 }
        ]
      },
      {
        id: 'rating',
        label: 'Course Rating',
        type: 'radio',
        options: [
          { value: '4.5+', label: '4.5+ Stars', count: 42 },
          { value: '4.0+', label: '4.0+ Stars', count: 68 },
          { value: '3.5+', label: '3.5+ Stars', count: 89 },
          { value: '3.0+', label: '3.0+ Stars', count: 105 }
        ]
      },
      {
        id: 'instructor',
        label: 'Instructor Type',
        type: 'checkbox',
        options: [
          { value: 'industry-expert', label: 'Industry Expert', count: 45 },
          { value: 'certified-trainer', label: 'Certified Trainer', count: 38 },
          { value: 'university-professor', label: 'University Professor', count: 22 },
          { value: 'freelance-professional', label: 'Freelance Professional', count: 35 }
        ]
      }
    ], []);

    const handleFilterOptionChange = useCallback((filterId: string, optionValue: string, checked: boolean) => {
      // Handle category filters (removed from dropdown but keeping for sidebar)
      if (filterId === 'categories') {
        if (checked) {
          setSelectedCategory(prev => [...prev, optionValue]);
        } else {
          setSelectedCategory(prev => prev.filter(cat => cat !== optionValue));
        }
      }
      // Handle skill level (radio button - single selection)
      else if (filterId === 'level') {
        if (checked) {
          setSelectedLevel(optionValue);
        }
      }
      // Handle duration filters
      else if (filterId === 'duration') {
        if (checked) {
          setSelectedDuration(prev => [...prev, optionValue]);
        } else {
          setSelectedDuration(prev => prev.filter(duration => duration !== optionValue));
        }
      }
      // Handle price range filters
      else if (filterId === 'price') {
        if (checked) {
          setSelectedPriceRange(prev => [...prev, optionValue]);
        } else {
          setSelectedPriceRange(prev => prev.filter(price => price !== optionValue));
        }
      }
      // Handle course format filters
      else if (filterId === 'format') {
        if (checked) {
          setSelectedFormat(prev => [...prev, optionValue]);
        } else {
          setSelectedFormat(prev => prev.filter(format => format !== optionValue));
        }
      }
      // Handle language filters
      else if (filterId === 'language') {
        if (checked) {
          setSelectedLanguage(prev => [...prev, optionValue]);
        } else {
          setSelectedLanguage(prev => prev.filter(language => language !== optionValue));
        }
      }
      // Handle features filters
      else if (filterId === 'features') {
        if (checked) {
          setSelectedFeatures(prev => [...prev, optionValue]);
        } else {
          setSelectedFeatures(prev => prev.filter(feature => feature !== optionValue));
        }
      }
      // Handle rating filters (radio button - single selection)
      else if (filterId === 'rating') {
        if (checked) {
          setSelectedRating(optionValue);
        }
      }
      // Handle instructor type filters
      else if (filterId === 'instructor') {
        if (checked) {
          setSelectedInstructor(prev => [...prev, optionValue]);
        } else {
          setSelectedInstructor(prev => prev.filter(instructor => instructor !== optionValue));
        }
      }
      
      setCurrentPage(1);
    }, []);

    const getCheckedValue = useCallback((filterId: string, optionValue: string) => {
      switch (filterId) {
        case 'categories':
          return selectedCategory.includes(optionValue);
        case 'level':
          return selectedLevel === optionValue;
        case 'duration':
          return selectedDuration.includes(optionValue);
        case 'price':
          return selectedPriceRange.includes(optionValue);
        case 'format':
          return selectedFormat.includes(optionValue);
        case 'language':
          return selectedLanguage.includes(optionValue);
        case 'features':
          return selectedFeatures.includes(optionValue);
        case 'rating':
          return selectedRating === optionValue;
        case 'instructor':
          return selectedInstructor.includes(optionValue);
        default:
          return false;
      }
    }, [selectedCategory, selectedLevel, selectedDuration, selectedPriceRange, selectedFormat, selectedLanguage, selectedFeatures, selectedRating, selectedInstructor]);

    const getTotalActiveFilters = useCallback(() => {
      return selectedCategory.length + 
             (selectedLevel ? 1 : 0) + 
             selectedDuration.length + 
             selectedPriceRange.length + 
             selectedFormat.length + 
             selectedLanguage.length + 
             selectedFeatures.length + 
             (selectedRating ? 1 : 0) + 
             selectedInstructor.length;
    }, [selectedCategory, selectedLevel, selectedDuration, selectedPriceRange, selectedFormat, selectedLanguage, selectedFeatures, selectedRating, selectedInstructor]);

    const clearAllFilters = useCallback(() => {
      setSelectedCategory([]);
      setSelectedLevel("");
      setSelectedDuration([]);
      setSelectedPriceRange([]);
      setSelectedFormat([]);
      setSelectedLanguage([]);
      setSelectedFeatures([]);
      setSelectedRating("");
      setSelectedInstructor([]);
      handleClearFilters();
    }, [handleClearFilters]);

    // Close filter dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
          setIsFilterDropdownOpen(false);
          // Reset scroll position when closing
          savedScrollPosition.current = 0;
          // Notify parent component
          onFilterDropdownToggle?.(false);
        }
      };

      if (isFilterDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isFilterDropdownOpen, onFilterDropdownToggle]);

    // Close grade dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const gradeDropdown = document.querySelector('[data-grade-dropdown]');
        if (gradeDropdown && !gradeDropdown.contains(event.target as Node)) {
          setIsGradeDropdownOpen(false);
        }
      };

      if (isGradeDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isGradeDropdownOpen]);

    // Close live courses dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const liveCoursesDropdown = document.querySelector('[data-live-courses-dropdown]');
        if (liveCoursesDropdown && !liveCoursesDropdown.contains(event.target as Node)) {
          setIsLiveCoursesDropdownOpen(false);
        }
      };

      if (isLiveCoursesDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isLiveCoursesDropdownOpen]);

    // Close blended learning dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const blendedLearningDropdown = document.querySelector('[data-blended-learning-dropdown]');
        if (blendedLearningDropdown && !blendedLearningDropdown.contains(event.target as Node)) {
          setIsBlendedLearningDropdownOpen(false);
        }
      };

      if (isBlendedLearningDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isBlendedLearningDropdownOpen]);

    // Close self-paced dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const selfPacedDropdown = document.querySelector('[data-self-paced-dropdown]');
        if (selfPacedDropdown && !selfPacedDropdown.contains(event.target as Node)) {
          setIsSelfPacedDropdownOpen(false);
        }
      };

      if (isSelfPacedDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isSelfPacedDropdownOpen]);

    // Close free courses dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const freeCoursesDropdown = document.querySelector('[data-free-courses-dropdown]');
        if (freeCoursesDropdown && !freeCoursesDropdown.contains(event.target as Node)) {
          setIsFreeCoursesDropdownOpen(false);
        }
      };

      if (isFreeCoursesDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isFreeCoursesDropdownOpen]);

    return (
      <div className="relative" ref={filterDropdownRef}>
        {/* Filter Button */}
        <button
          onClick={() => {
            const newState = !isFilterDropdownOpen;
            setIsFilterDropdownOpen(newState);
            // Notify parent component
            onFilterDropdownToggle?.(newState);
          }}
          className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 border shadow-sm ${
            isFilterDropdownOpen 
              ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Filter size={18} className="mr-2" />
          Filters
          {getTotalActiveFilters() > 0 && (
            <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
              {getTotalActiveFilters()}
            </span>
          )}
          <ChevronDown 
            size={16} 
            className={`ml-2 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isFilterDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
            {/* Filter Sections - Single scroll for entire content */}
            <div 
              ref={filterScrollRef}
              onScroll={handleDropdownScroll}
              className="overflow-y-auto max-h-80 p-4 space-y-6"
            >
              {/* Clear All Button - moved to top */}
              <div className="flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Clear All
                </button>
            </div>
              
              {filterOptions.map((filterGroup) => (
                <div key={filterGroup.id} className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {filterGroup.label}
                  </h4>
                  <div className="space-y-2">
                    {filterGroup.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type={filterGroup.type}
                            name={filterGroup.id}
                            value={option.value}
                            checked={getCheckedValue(filterGroup.id, option.value)}
                            onChange={(e) => handleFilterOptionChange(
                              filterGroup.id, 
                              option.value, 
                              e.target.checked
                            )}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {option.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Filters Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsFilterDropdownOpen(false);
                    // Notify parent component
                    onFilterDropdownToggle?.(false);
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });

  // Add display name for debugging
  FilterDropdown.displayName = 'FilterDropdown';

  // Modern main content renderer
  const renderMainContent = (): React.ReactNode => {
    return (
      <div className={!hideCategoryFilter ? "lg:w-3/4" : "w-full"}>
        {/* Header Section */}
        <div className="mb-6">
          {/* Results count - Improved styling */}
          {!hideFilterBar && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {totalItems.toLocaleString()}
                  </span>
                  <span className="ml-1 text-base">
                    {totalItems === 1 ? 'course found' : 'courses found'}
                  </span>
                </div>
                {showingRelated && (
                  <button
                    onClick={clearRelated}
                    className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors duration-200"
                  >
                    ← Back to All
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error state */}
          {queryError && (
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50 dark:bg-red-900/10 text-center mb-6">
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
        </div>

        {/* Course Cards Section */}
        <div className="relative">
          {renderCourseList()}
        </div>

        {/* Pagination Section - Fixed styling */}
        {totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex justify-center" aria-label="Pagination">
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
          </div>
        )}
      </div>
    );
  };

  // Prevent body scroll when any dropdown is open (with improved cleanup)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isAnyDropdownOpen = isGradeDropdownOpen || isLiveCoursesDropdownOpen || isBlendedLearningDropdownOpen || isSelfPacedDropdownOpen || isFreeCoursesDropdownOpen || isFilterDropdownOpen;
    
    if (isAnyDropdownOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        const parsedScrollY = parseInt(scrollY.replace('-', '').replace('px', '') || '0', 10);
        if (!isNaN(parsedScrollY)) {
          window.scrollTo(0, parsedScrollY);
        }
      }
    }

    // Improved cleanup on unmount
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      }
    };
  }, [isGradeDropdownOpen, isLiveCoursesDropdownOpen, isBlendedLearningDropdownOpen, isSelfPacedDropdownOpen, isFreeCoursesDropdownOpen, isFilterDropdownOpen]);

  return (
    <ErrorBoundary>
      <section className="w-full min-h-screen relative" role="region" aria-label="Course Filter">
        {/* Enhanced Background with Glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 dark:from-gray-900/5 dark:via-transparent dark:to-gray-900/5"></div>
        
        {/* Modern header */}
        {!hideHeader && (
          <div className="relative z-10 text-center py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              {typeof CustomText === 'string' ? CustomText : "Explore Courses"}
            </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {description || "Discover courses to enhance your skills and advance your career."}
            </p>
              </div>
            </div>
          </div>
        )}

        {/* Main container - Edge to Edge */}
        <div className="relative z-10 w-full">
          {/* Search and filters bar - Enhanced Glassmorphism */}
          {!hideFilterBar && (
            <div className="w-full bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-t border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-30">
              <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {!hideSearch && (
                    <div className="flex-grow relative">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                          type="text"
                          placeholder="Search courses..."
                          value={searchTerm}
                          onChange={handleSearch}
                          className="w-full py-4 pl-12 pr-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-2xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg"
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
                  )}
                
                <div className="flex gap-4">
                    {!hideSortOptions && (
                      <div className="relative" ref={sortDropdownRef}>
                        <button
                          onClick={() => setShowSortDropdown(!showSortDropdown)}
                          className="flex items-center justify-between w-full md:w-40 px-6 py-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/30 hover:border-white/40 dark:hover:border-gray-600/40 transition-all duration-200 shadow-sm"
                          aria-expanded={showSortDropdown}
                          aria-haspopup="true"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {(() => {
                              const labels: Record<string, string> = {
                                "newest-first": "Newest",
                                "oldest-first": "Oldest",
                                "A-Z": "A-Z",
                                "Z-A": "Z-A",
                                "price-low-high": "Price ↑",
                                "price-high-low": "Price ↓",
                              };
                              return labels[sortOrder] || "Newest";
                            })()}
                          </span>
                          <ChevronDown 
                            size={16} 
                            className={`transform transition-transform duration-200 text-gray-400 dark:text-gray-500 ${showSortDropdown ? 'rotate-180' : ''}`} 
                          />
                        </button>

                        {showSortDropdown && (
                          <div className="absolute right-0 mt-2 w-full md:w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/30 z-10 overflow-hidden" role="menu">
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
                                      ? "bg-purple-50/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50"
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
                    )}

                    {/* Enhanced Filter Dropdown */}
                  <FilterDropdown />
                </div>
              </div>

                {/* Active filters - Enhanced Styling */}
              {activeFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/20 dark:border-gray-700/20">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <Filter size={16} className="mr-2" />
                      Active Filters:
                  </span>
                  {activeFilters.map((f, idx) => (
                    <div
                      key={`${f.type}-${idx}`}
                        className="flex items-center px-4 py-2 bg-purple-500/20 dark:bg-purple-900/30 backdrop-blur-sm text-purple-700 dark:text-purple-300 rounded-xl text-sm font-medium border border-purple-200/30 dark:border-purple-700/30"
                    >
                      {f.label}
                      <button
                        onClick={() => removeFilter(f.type, f.value)}
                          className="ml-3 hover:text-purple-900 dark:hover:text-purple-100 transition-colors p-1 hover:bg-purple-200/30 dark:hover:bg-purple-800/30 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleClearFilters}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-2 font-medium ml-2 px-3 py-2 hover:bg-purple-100/20 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
                  >
                    Clear All
                  </button>
                </div>
              )}
              </div>
            </div>
          )}

          {/* Main content area - Full Width */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row min-h-screen">
              {/* Enhanced Sidebar */}
              {!hideCategoryFilter && (
                <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"} lg:sticky lg:top-24 lg:h-screen lg:overflow-y-auto`}>
                  <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl m-4 lg:m-6 p-6 rounded-3xl border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                        <Filter size={20} className="mr-3" />
                        Filters
                      </h3>
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    
                                         {/* Categories Section - Enhanced with better visual hierarchy */}
                    {!hideCategoryFilter && !hideCategories && (
                      <div className="space-y-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-6 text-lg">Categories</h4>
                        
                        {/* Live Courses */}
                        <div className="bg-red-500/10 dark:bg-red-900/20 rounded-2xl border border-red-200/30 dark:border-red-900/30 overflow-hidden backdrop-blur-sm" data-live-courses-dropdown>
                          <div 
                            className="flex items-center justify-between cursor-pointer p-5 hover:bg-red-500/15 dark:hover:bg-red-900/30 transition-all duration-300 ease-in-out" 
                            onClick={() => setIsLiveCoursesDropdownOpen(!isLiveCoursesDropdownOpen)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-red-500/20 dark:bg-red-900/40 rounded-xl flex items-center justify-center transition-all duration-300">
                                <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-red-900 dark:text-red-100 text-base">Live Courses</h5>
                                <p className="text-sm text-red-600 dark:text-red-400">Interactive live sessions</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-red-600 dark:text-red-400 transition-all duration-300 ease-in-out ${isLiveCoursesDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                          </div>
                          
                          {/* Live Courses Dropdown Content */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isLiveCoursesDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-5 pb-5 space-y-3 border-t border-red-200/30 dark:border-red-900/30 bg-white/5 dark:bg-gray-800/5">
                              {liveCoursesOptions.map((option, index) => (
                                <label
                                  key={option}
                                  className={`flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/30 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] border border-transparent hover:border-red-200/20 dark:hover:border-red-800/20 ${isLiveCoursesDropdownOpen ? 'animate-slideIn' : ''}`}
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="flex items-center space-x-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedLiveCourses.includes(option)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedLiveCourses(prev => [...prev, option]);
                                        } else {
                                          setSelectedLiveCourses(prev => prev.filter(item => item !== option));
                                        }
                                      }}
                                      className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                      {option}
                                    </span>
                                  </div>
                                  {selectedLiveCourses.includes(option) && (
                                    <span className="text-xs text-red-600 dark:text-red-400 bg-red-500/20 dark:bg-red-900/40 px-3 py-1 rounded-full font-semibold">
                                      ✓
                                    </span>
                                  )}
                                </label>
                              ))}
                              
                              {/* Clear Live Courses Filters */}
                              {selectedLiveCourses.length > 0 && (
                                <div className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                                  <button
                                    onClick={() => setSelectedLiveCourses([])}
                                    className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-500/15 dark:bg-red-900/40 hover:bg-red-500/25 dark:hover:bg-red-900/60 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-medium"
                                  >
                                    Clear Live Courses ({selectedLiveCourses.length})
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Blended Learning */}
                        <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-2xl border border-blue-200/30 dark:border-blue-900/30 overflow-hidden backdrop-blur-sm" data-blended-learning-dropdown>
                          <div 
                            className="flex items-center justify-between cursor-pointer p-5 hover:bg-blue-500/15 dark:hover:bg-blue-900/30 transition-all duration-300 ease-in-out" 
                            onClick={() => setIsBlendedLearningDropdownOpen(!isBlendedLearningDropdownOpen)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-500/20 dark:bg-blue-900/40 rounded-xl flex items-center justify-center transition-all duration-300">
                                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-base">Blended Learning</h5>
                                <p className="text-sm text-blue-600 dark:text-blue-400">Live + self-paced learning</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-in-out ${isBlendedLearningDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                          </div>
                          
                          {/* Blended Learning Dropdown Content */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isBlendedLearningDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-5 pb-5 space-y-3 border-t border-blue-200/30 dark:border-blue-900/30 bg-white/5 dark:bg-gray-800/5">
                              {blendedLearningOptions.map((option, index) => (
                                <label
                                  key={option}
                                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${isBlendedLearningDropdownOpen ? 'animate-slideIn' : ''}`}
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="flex items-center space-x-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedBlendedLearning.includes(option)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedBlendedLearning(prev => [...prev, option]);
                                        } else {
                                          setSelectedBlendedLearning(prev => prev.filter(item => item !== option));
                                        }
                                      }}
                                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                      {option}
                                    </span>
                                  </div>
                                  {selectedBlendedLearning.includes(option) && (
                                    <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/20 dark:bg-blue-900/40 px-3 py-1 rounded-full font-semibold">
                                      ✓
                                    </span>
                                  )}
                                </label>
                              ))}
                              
                              {/* Clear Blended Learning Filters */}
                              {selectedBlendedLearning.length > 0 && (
                                <div className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                                  <button
                                    onClick={() => setSelectedBlendedLearning([])}
                                    className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-500/15 dark:bg-blue-900/40 hover:bg-blue-500/25 dark:hover:bg-blue-900/60 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-medium"
                                  >
                                    Clear Blended Learning ({selectedBlendedLearning.length})
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Self-Paced Learning */}
                        <div className="bg-emerald-500/10 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200/30 dark:border-emerald-900/30 overflow-hidden backdrop-blur-sm" data-self-paced-dropdown>
                          <div 
                            className="flex items-center justify-between cursor-pointer p-5 hover:bg-emerald-500/15 dark:hover:bg-emerald-900/30 transition-all duration-300 ease-in-out" 
                            onClick={() => setIsSelfPacedDropdownOpen(!isSelfPacedDropdownOpen)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-emerald-500/20 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center transition-all duration-300">
                                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-emerald-900 dark:text-emerald-100 text-base">Self-Paced Learning</h5>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">Self-paced with live support</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-all duration-300 ease-in-out ${isSelfPacedDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                          </div>
                          
                          {/* Self-Paced Learning Dropdown Content */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSelfPacedDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-5 pb-5 space-y-3 border-t border-emerald-200/30 dark:border-emerald-900/30 bg-white/5 dark:bg-gray-800/5">
                              {selfPacedLearningOptions.map((option, index) => (
                                <label
                                  key={option}
                                  className={`flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/30 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] border border-transparent hover:border-emerald-200/20 dark:hover:border-emerald-800/20 ${isSelfPacedDropdownOpen ? 'animate-slideIn' : ''}`}
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="flex items-center space-x-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedSelfPaced.includes(option)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedSelfPaced(prev => [...prev, option]);
                                        } else {
                                          setSelectedSelfPaced(prev => prev.filter(item => item !== option));
                                        }
                                      }}
                                      className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                      {option}
                                    </span>
                                  </div>
                                  {selectedSelfPaced.includes(option) && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 dark:bg-emerald-900/40 px-3 py-1 rounded-full font-semibold">
                                      ✓
                                    </span>
                                  )}
                                </label>
                              ))}
                              
                              {/* Clear Self-Paced Filters */}
                              {selectedSelfPaced.length > 0 && (
                                <div className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                                  <button
                                    onClick={() => setSelectedSelfPaced([])}
                                    className="w-full text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-900/40 hover:bg-emerald-500/25 dark:hover:bg-emerald-900/60 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-medium"
                                  >
                                    Clear Self-Paced ({selectedSelfPaced.length})
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Grade Level */}
                        <div className="bg-purple-500/10 dark:bg-purple-900/20 rounded-2xl border border-purple-200/30 dark:border-purple-900/30 overflow-hidden backdrop-blur-sm" data-grade-dropdown>
                          <div 
                            className="flex items-center justify-between cursor-pointer p-5 hover:bg-purple-500/15 dark:hover:bg-purple-900/30 transition-all duration-300 ease-in-out" 
                            onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-purple-500/20 dark:bg-purple-900/40 rounded-xl flex items-center justify-center transition-all duration-300">
                                <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-purple-900 dark:text-purple-100 text-base">Grade Level</h5>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Filter by educational level</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-all duration-300 ease-in-out ${isGradeDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                          </div>
                          
                          {/* Grade Level Dropdown Content */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isGradeDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-5 pb-5 space-y-3 border-t border-purple-200/30 dark:border-purple-900/30 bg-white/5 dark:bg-gray-800/5">
                              {gradeOptions.map((grade, index) => (
                                <label
                                  key={grade}
                                  className={`flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/30 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] border border-transparent hover:border-purple-200/20 dark:hover:border-purple-800/20 ${isGradeDropdownOpen ? 'animate-slideIn' : ''}`}
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="flex items-center space-x-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedGrade.includes(grade)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedGrade(prev => [...prev, grade]);
                                        } else {
                                          setSelectedGrade(prev => prev.filter(g => g !== grade));
                                        }
                                      }}
                                      className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                      {grade}
                                    </span>
                                  </div>
                                  {selectedGrade.includes(grade) && (
                                    <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-500/20 dark:bg-purple-900/40 px-3 py-1 rounded-full font-semibold">
                                      ✓
                                    </span>
                                  )}
                                </label>
                              ))}
                              
                              {/* Clear Grade Filters */}
                              {selectedGrade.length > 0 && (
                                <div className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                                  <button
                                    onClick={() => setSelectedGrade([])}
                                    className="w-full text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-500/15 dark:bg-purple-900/40 hover:bg-purple-500/25 dark:hover:bg-purple-900/60 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-medium"
                                  >
                                    Clear Grade Filters ({selectedGrade.length})
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Main Content Area - Enhanced Full Width */}
              <div className={!hideCategoryFilter ? "lg:w-3/4" : "w-full"}>
                {/* Results Header */}
                {!hideFilterBar && (
                  <div className="bg-white/5 dark:bg-gray-900/5 backdrop-blur-sm border-b border-white/10 dark:border-gray-700/10 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="text-gray-700 dark:text-gray-300">
                          <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {totalItems.toLocaleString()}
                          </span>
                          <span className="ml-2 text-lg">
                            {totalItems === 1 ? 'course found' : 'courses found'}
                          </span>
                        </div>
                        {showingRelated && (
                          <button
                            onClick={clearRelated}
                            className="px-4 py-2 text-sm bg-purple-500/20 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/30 dark:hover:bg-purple-900/50 rounded-xl transition-colors duration-200 backdrop-blur-sm"
                          >
                            ← Back to All
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {queryError && (
                  <div className="flex flex-col items-center justify-center py-20 px-6 m-6 border border-red-200/30 dark:border-red-800/30 rounded-3xl bg-red-500/10 dark:bg-red-900/20 text-center backdrop-blur-sm">
                    <AlertCircle size={64} className="text-red-500 dark:text-red-400 mb-6" />
                    <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">Error Loading Courses</h3>
                    <p className="text-red-600 dark:text-red-400 max-w-md mb-8 text-lg">
                      {queryError}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors text-lg font-medium"
                    >
                      Refresh Page
                    </button>
                  </div>
                )}

                {/* Course Grid - Enhanced Full Width */}
                <div className="p-6">
                  {renderCourseList()}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t border-white/10 dark:border-gray-700/10 bg-white/5 dark:bg-gray-900/5 backdrop-blur-sm">
                    <nav className="flex justify-center" aria-label="Pagination">
                      {simplePagination ? (
                        <SimplePaginationWrapper
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          simplified={true}
                          className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-4"
                        />
                      ) : (
                        <SimplePaginationWrapper
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          simplified={false}
                          className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-4"
                        />
                      )}
                    </nav>
                  </div>
                )}
              </div>
            </div>
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