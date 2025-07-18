"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
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
  Award,
  Clock,
  BookOpen,
  Layers,
  Info,
  Users,
  ArrowUpRight,
  Check,
  Grid3X3,
  List
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
import CourseCard from "@/components/sections/courses/CourseCard";
import ReactDOM from "react-dom";

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
  // Live course specific properties
  liveFeatures?: string[];
  additionalFeatures?: string[];
  isLiveCourse?: boolean;
  showFullFeatures?: boolean;
  useStandardImageRatio?: boolean;
  useStandardBadgeSize?: boolean;
  preserveLiveHoverState?: boolean;
  standardFeatures?: string[];
  duration_range?: string;
  course_duration?: string;
  no_of_Sessions?: number;
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
const DynamicFilterCourseCard = dynamic(() => import("./FilterCourseCard"), {
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
  "Foundation Certificate",
  "Advance Certificate",
  "Executive Diploma",
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
          className={`px-6 py-3 rounded-2xl transition-all duration-200 font-semibold ${
            currentPage <= 1
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95"
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>
        <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-6 py-3 rounded-2xl transition-all duration-200 font-semibold ${
            currentPage >= totalPages
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95"
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
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 font-semibold ${
            currentPage === i
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-110"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:scale-105 shadow-sm hover:shadow-md"
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
        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 font-bold text-lg ${
          currentPage <= 1
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:scale-105 shadow-sm hover:shadow-md"
        }`}
        aria-label="Previous page"
      >
        ‹
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 font-bold text-lg ${
          currentPage >= totalPages
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:scale-105 shadow-sm hover:shadow-md"
        }`}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};

// Memoized components for better performance - temporarily disabled for duration fix
const MemoizedFilterCourseCard = DynamicFilterCourseCard;

// Enhanced sort dropdown component with improved mobile UX
const SortDropdown = React.memo<ISortDropdownProps>(({ sortOrder, handleSortChange, showSortDropdown, setShowSortDropdown }) => {
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const overlayId = 'sort-dropdown-overlay';

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

  const getSortIcon = (value: string) => {
    switch (value) {
      case "newest-first":
        return <Sparkles className="w-4 h-4" />;
      case "oldest-first":
        return <Clock className="w-4 h-4" />;
      case "A-Z":
      case "Z-A":
        return <BookOpen className="w-4 h-4" />;
      case "price-low-high":
      case "price-high-low":
        return <Award className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="sort-dropdown-container relative" ref={sortDropdownRef}>
      <button
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className={`group flex items-center justify-between min-w-[140px] px-4 py-3 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${
          showSortDropdown 
            ? 'border-indigo-300 dark:border-indigo-600 ring-4 ring-indigo-500/20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        aria-expanded={showSortDropdown}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-lg transition-colors duration-200 ${
            showSortDropdown 
              ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
          }`}>
            {getSortIcon(sortOrder)}
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {getSortLabel(sortOrder)}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showSortDropdown ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>

      {showSortDropdown && (
        <>
          {/* Enhanced mobile backdrop with smooth animation */}
          <div 
            className="sort-dropdown-backdrop mobile-backdrop-fix enhanced-backdrop animate-in fade-in duration-200 lg:hidden" 
            onClick={() => setShowSortDropdown(false)}
          />
          {/* Enhanced sort dropdown content with modern design and iPad support */}
          <div 
            className="sort-dropdown-content mobile-dropdown-fix fixed top-[25vh] left-1/2 transform -translate-x-1/2 w-[85vw] max-w-xs bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-top-4 duration-300 z-transition sm:w-[70vw] sm:max-w-sm lg:absolute lg:right-0 lg:top-full lg:left-auto lg:transform-none lg:translate-x-0 lg:translate-y-0 lg:mt-3 lg:w-52 lg:animate-in lg:slide-in-from-top-2"
            style={{ zIndex: 'var(--z-sort-dropdown)' }}
            role="menu"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Sort Options</h3>
              </div>
            </div>
            
            {/* Options */}
            <div className="py-2">
              {[
                { value: "newest-first", label: "Newest First", icon: <Sparkles className="w-4 h-4" />, desc: "Latest courses" },
                { value: "oldest-first", label: "Oldest First", icon: <Clock className="w-4 h-4" />, desc: "Established courses" },
                { value: "A-Z", label: "Name (A-Z)", icon: <BookOpen className="w-4 h-4" />, desc: "Alphabetical order" },
                { value: "Z-A", label: "Name (Z-A)", icon: <BookOpen className="w-4 h-4" />, desc: "Reverse alphabetical" },
                { value: "price-low-high", label: "Price (Low to High)", icon: <Award className="w-4 h-4" />, desc: "Budget friendly first" },
                { value: "price-high-low", label: "Price (High to Low)", icon: <Award className="w-4 h-4" />, desc: "Premium courses first" },
              ].map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center space-x-3 group ${
                    sortOrder === option.value
                      ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  role="menuitem"
                >
                  <div className={`transition-colors ${
                    sortOrder === option.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.desc}</div>
                  </div>
                  {sortOrder === option.value && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

// Enhanced search input component with advanced features
const SearchInput = React.memo<ISearchInputProps>(({ searchTerm, handleSearch, setSearchTerm }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Enhanced search suggestions based on available courses
  const popularSearchTerms = [
    "AI and Data Science",
    "Digital Marketing",
    "Personality Development", 
    "Vedic Mathematics",
    "Business Management",
    "Communication Skills",
    "Data Analytics",
    "Python",
    "Machine Learning",
    "Excel",
    "Finance",
    "Leadership",
    "Project Management",
    "Web Development"
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('medh-recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5)); // Keep only last 5
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
    }
  }, []);

  // Generate search suggestions based on input
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = popularSearchTerms.filter(term =>
        term.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Handle search selection
  const handleSearchSelect = useCallback((selectedTerm: string) => {
    setSearchTerm(selectedTerm);
    setShowSuggestions(false);
    
    // Save to recent searches
    const updatedRecent = [selectedTerm, ...recentSearches.filter(term => term !== selectedTerm)].slice(0, 5);
    setRecentSearches(updatedRecent);
    
    try {
      localStorage.setItem('medh-recent-searches', JSON.stringify(updatedRecent));
    } catch (error) {
      console.warn('Failed to save recent search:', error);
    }

    // Trigger search
    const syntheticEvent = {
      target: { value: selectedTerm }
    } as React.ChangeEvent<HTMLInputElement>;
    handleSearch(syntheticEvent);
  }, [recentSearches, setSearchTerm, handleSearch]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    } else if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearchSelect(searchTerm.trim());
    }
  };

  return (
    <div className="relative group">
      <div className="relative">
        {/* Search Icon */}
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
          isSearchFocused ? 'text-indigo-500 scale-110' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
        }`}>
          <Search className="w-5 h-5" />
        </div>
        
        {/* Search Input */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search courses by title, category, or topic (most relevant first)..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => {
            setIsSearchFocused(true);
            if (searchTerm.length >= 2 || recentSearches.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className={`w-full h-12 pl-12 pr-16 text-base border-2 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg ${
            isSearchFocused 
              ? 'border-indigo-500 dark:border-indigo-400 ring-4 ring-indigo-500/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          aria-label="Search courses"
          autoComplete="off"
        />
        
        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchTerm && (
            <>
              {/* Search Button */}
              <button
                onClick={() => handleSearchSelect(searchTerm.trim())}
                className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                aria-label="Search"
              >
                <ArrowUpRight className="w-3 h-3" />
              </button>
              
              {/* Clear Button */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSuggestions(false);
                  searchInputRef.current?.focus();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Search Enhancement Features */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transition-opacity duration-300 pointer-events-none ${
        isSearchFocused ? 'opacity-100' : 'opacity-0'
      }`}></div>
      
      {/* Search Suggestions Dropdown */}
      {showSuggestions && (isSearchFocused || searchTerm.length >= 2) && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-sm"
        >
          {/* Recent Searches */}
          {searchTerm.length < 2 && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(term)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-150 flex items-center space-x-2"
                  >
                    <Search className="w-3 h-3 text-gray-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && (
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Suggested Searches</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">Relevance sorted</span>
              </div>
              <div className="space-y-1">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-150 flex items-center space-x-2 group"
                  >
                    <div className="p-1 bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800 rounded-lg transition-colors">
                      <Search className="w-3 h-3 text-gray-500 group-hover:text-indigo-500" />
                    </div>
                    <span className="flex-1">{suggestion}</span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* No suggestions message */}
          {searchTerm.length >= 2 && searchSuggestions.length === 0 && (
            <div className="p-6 text-center">
              <SearchX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No suggestions found</p>
              <button
                onClick={() => handleSearchSelect(searchTerm.trim())}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                Search for "{searchTerm.trim()}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

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

// Z-Index management hook for proper overlay stacking
const useZIndexManager = () => {
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set());
  
  const registerOverlay = useCallback((overlayId: string) => {
    setActiveOverlays(prev => new Set([...prev, overlayId]));
  }, []);
  
  const unregisterOverlay = useCallback((overlayId: string) => {
    setActiveOverlays(prev => {
      const newSet = new Set(prev);
      newSet.delete(overlayId);
      return newSet;
    });
  }, []);
  
  const getOverlayZIndex = useCallback((overlayId: string) => {
    const overlayArray = Array.from(activeOverlays);
    const index = overlayArray.indexOf(overlayId);
    
    // Base z-index values from CSS variables
    const baseZIndex = {
      'sort-dropdown': 60,
      'filter-dropdown': 50,
      'mobile-categories': 100,
      'course-card': 10
    };
    
    const overlayType = overlayId.split('-')[0] as keyof typeof baseZIndex;
    const base = baseZIndex[overlayType] || 50;
    
    return base + (index * 10);
  }, [activeOverlays]);
  
  const hasActiveOverlays = activeOverlays.size > 0;
  
  return {
    registerOverlay,
    unregisterOverlay,
    getOverlayZIndex,
    hasActiveOverlays,
    activeOverlays
  };
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

// Minimal CSS for z-index management - everything else converted to Tailwind
const addFilterGlassmorphicStyles = () => {
  const style = document.createElement('style');
  style.id = 'filter-glassmorphic-styles';
  style.textContent = `
    /* Z-Index Layer System - CSS Variables for Tailwind */
    :root {
      --z-base: 1;
      --z-course-card: 10;
      --z-course-card-hover: 15;
      --z-filter-dropdown: 100;
      --z-sort-dropdown: 150;
      --z-mobile-categories: 200;
      --z-mobile-backdrop: 999;
      --z-mobile-dropdown: 1000;
    }
  `;
  document.head.appendChild(style);
};

const Filter = dynamic(() => import('lucide-react').then(mod => mod.Filter), { ssr: false });

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
  itemsPerPage = 12,
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
  const [selectedFreeCourses, setSelectedFreeCourses] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest-first");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode] = useState<string>("grid");
  
  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResultsTotal, setSearchResultsTotal] = useState<number>(0);

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
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState<boolean>(false);
  const [isLiveCoursesDropdownOpen, setIsLiveCoursesDropdownOpen] = useState<boolean>(false);
  const [isBlendedLearningDropdownOpen, setIsBlendedLearningDropdownOpen] = useState<boolean>(false);
  const [isFreeCoursesDropdownOpen, setIsFreeCoursesDropdownOpen] = useState<boolean>(false);

  // Add these handler functions near the dropdown state declarations:
  const handleOpenGradeDropdown = () => {
    setIsGradeDropdownOpen((open) => {
      if (!open) {
        setIsLiveCoursesDropdownOpen(false);
        setIsBlendedLearningDropdownOpen(false);
        setIsFreeCoursesDropdownOpen(false);
      }
      return !open;
    });
  };
  const handleOpenLiveCoursesDropdown = () => {
    setIsLiveCoursesDropdownOpen((open) => {
      if (!open) {
        setIsGradeDropdownOpen(false);
        setIsBlendedLearningDropdownOpen(false);
        setIsFreeCoursesDropdownOpen(false);
      }
      return !open;
    });
  };
  const handleOpenBlendedLearningDropdown = () => {
    setIsBlendedLearningDropdownOpen((open) => {
      if (!open) {
        setIsGradeDropdownOpen(false);
        setIsLiveCoursesDropdownOpen(false);
        setIsFreeCoursesDropdownOpen(false);
      }
      return !open;
    });
  };
  const handleOpenFreeCoursesDropdown = () => {
    setIsFreeCoursesDropdownOpen((open) => {
      if (!open) {
        setIsGradeDropdownOpen(false);
        setIsLiveCoursesDropdownOpen(false);
        setIsBlendedLearningDropdownOpen(false);
      }
      return !open;
    });
  };

  // Automatically close nested dropdowns whenever the mobile categories panel is closed
  useEffect(() => {
    if (!isMobileCategoriesOpen) {
      setIsLiveCoursesDropdownOpen(false);
      setIsBlendedLearningDropdownOpen(false);
      setIsFreeCoursesDropdownOpen(false);
      setIsGradeDropdownOpen(false);
    }
  }, [isMobileCategoriesOpen]);
  
  // Refs
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const didInitRef = useRef<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef<number>(0);
  const performanceStartTime = useRef<number>(0);

  // Other hooks
  // Enhanced debounced search with improved performance and search analytics
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Increased delay for better performance

  // Enhanced search state management
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Search analytics and tracking
  const searchAnalytics = useRef({
    searchCount: 0,
    lastSearchTime: 0,
    popularTerms: new Map<string, number>()
  });

  // Track search usage for analytics
  const trackSearch = useCallback((term: string) => {
    if (term.trim().length >= 2) {
      const analytics = searchAnalytics.current;
      analytics.searchCount++;
      analytics.lastSearchTime = Date.now();
      
      // Track popular search terms
      const trimmedTerm = term.trim().toLowerCase();
      analytics.popularTerms.set(trimmedTerm, (analytics.popularTerms.get(trimmedTerm) || 0) + 1);
      
      // Log search analytics in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Search Analytics:', {
          term: trimmedTerm,
          searchCount: analytics.searchCount,
          termFrequency: analytics.popularTerms.get(trimmedTerm)
        });
      }
    }
  }, []);
  const isTablet = width >= 768 && width < 1024;
  const [responsiveGridColumns, setResponsiveGridColumns] = useState<number>(gridColumns);
  const zIndexManager = useZIndexManager();

  // Performance monitoring and add glassmorphic styles
  useEffect(() => {
    performanceStartTime.current = performance.now();
    
    // Add filter glassmorphic styles
    if (typeof window !== 'undefined') {
      const existingStyle = document.querySelector('#filter-glassmorphic-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      addFilterGlassmorphicStyles();
    }
  }, []);
  
  useEffect(() => {
    if (!loading && filteredCourses.length > 0) {
      const loadTime = performance.now() - performanceStartTime.current;
      if (process.env.NODE_ENV === 'development' && loadTime > 100) {
        console.log(`Course loading completed in ${loadTime.toFixed(2)}ms for ${filteredCourses.length} courses`);
      }
    }
  }, [loading, filteredCourses.length]);

  // Update grid columns based on screen size only - keep consistent card sizing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateGridColumns = (): void => {
      // Set consistent grid columns based on screen size only, not course count
      if (isMobile) {
        setResponsiveGridColumns(1);
      } else if (isTablet) {
        setResponsiveGridColumns(2);
      } else {
        // Always use 4 columns on desktop for consistent card sizing
        setResponsiveGridColumns(4);
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
    debouncedSearchTerm,
    sortOrder,
    currentPage,
    router,
    fixedCategory,
  ]);

  // Add a search relevance scoring function after the usePerformanceMonitor hook (around line 850)
  const calculateSearchRelevance = useCallback((course: ICourse, searchTerm: string): number => {
    if (!searchTerm.trim()) return 0;
    
    const term = searchTerm.toLowerCase().trim();
    const title = course.course_title?.toLowerCase() || '';
    const category = course.course_category?.toLowerCase() || '';
    const grade = course.course_grade?.toLowerCase() || '';
    
    let score = 0;
    
    // Exact title match gets highest priority
    if (title === term) {
      score += 100;
    }
    // Title starts with search term
    else if (title.startsWith(term)) {
      score += 80;
    }
    // Title contains search term as whole word
    else if (title.includes(` ${term} `) || title.includes(`${term} `) || title.includes(` ${term}`)) {
      score += 60;
    }
    // Title contains search term anywhere
    else if (title.includes(term)) {
      score += 40;
    }
    
    // Category relevance
    if (category === term) {
      score += 50;
    } else if (category.includes(term)) {
      score += 30;
    }
    
    // Grade relevance
    if (grade === term) {
      score += 30;
    } else if (grade.includes(term)) {
      score += 20;
    }
    
    // Bonus for newer courses (slight preference)
    if (course.createdAt) {
      const courseDate = new Date(course.createdAt);
      const now = new Date();
      const daysDiff = (now.getTime() - courseDate.getTime()) / (1000 * 3600 * 24);
      if (daysDiff < 30) {
        score += 5; // Small bonus for courses created in last 30 days
      }
    }
    
    // Bonus for published status
    if (course.status === 'Published') {
      score += 2;
    }
    
    return score;
  }, []);

  // Add a function to sort courses by search relevance
  const sortCoursesByRelevance = useCallback((courses: ICourse[], searchTerm: string): ICourse[] => {
    if (!searchTerm.trim()) return courses;
    
    const coursesWithScores = courses.map(course => ({
      course,
      relevanceScore: calculateSearchRelevance(course, searchTerm)
    }));
    
    // Sort by relevance score (descending), then by creation date (descending) as tiebreaker
    coursesWithScores.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Tiebreaker: newer courses first
      const dateA = new Date(a.course.createdAt || 0);
      const dateB = new Date(b.course.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return coursesWithScores.map(item => item.course);
  }, [calculateSearchRelevance]);

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

      // Enhanced search parameter handling - use debounced term for API calls
      if (debouncedSearchTerm?.trim()) {
        searchParams.search = debouncedSearchTerm.trim();
        // Request server-side search relevance if available
        searchParams.search_mode = 'server';
        searchParams.relevance_scoring = true;
      }

      // Add grade if selected
      if (selectedGrade.length > 0) {
        searchParams.course_grade = selectedGrade.join(",");
      }

      // Add class type if specified
      if (classType) {
        searchParams.class_type = classType;
      }

      // Enhanced sorting logic for both search and non-search scenarios
      if (debouncedSearchTerm?.trim()) {
        // For search queries, prefer relevance-based sorting
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
            // Default to relevance for search queries
            searchParams.sort_by = "relevance";
            searchParams.sort_order = "desc";
        }
      } else {
        // For non-search queries, use standard sorting
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
          console.log('CoursesFilter API Response:', response);
          
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

          // Enhanced pagination handling - consistent server-side approach
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
            
            // Store search results total for better UX
            if (debouncedSearchTerm?.trim()) {
              setSearchResultsTotal(paginationData.total || 0);
            }
          } else {
            // Fallback for responses without pagination data
            setTotalPages(1);
            setTotalItems(courses.length);
            
            if (debouncedSearchTerm?.trim()) {
              setSearchResultsTotal(courses.length);
            }
          }
          
          // Client-side relevance sorting fallback (only if server doesn't support relevance sorting)
          if (debouncedSearchTerm?.trim() && courses.length > 0 && 
              (sortOrder === 'newest-first' || !paginationData)) {
            const sortedCourses = sortCoursesByRelevance(courses, debouncedSearchTerm);
            setFilteredCourses(sortedCourses);
            
            if (process.env.NODE_ENV === 'development') {
              const topResults = sortedCourses.slice(0, 3).map(course => ({
                title: course.course_title,
                category: course.course_category,
                relevanceScore: calculateSearchRelevance(course, debouncedSearchTerm)
              }));
              console.log(`Client-side relevance sorting applied for search: "${debouncedSearchTerm}"`);
              console.log('Top 3 results:', topResults);
            }
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

          // Auto-scroll to top removed as requested
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
    debouncedSearchTerm,
    selectedGrade,
    selectedCategory,
    fixedCategory,
    classType,
    scrollToTop,
    getQuery,
    userCurrency,
    selectedLiveCourses,
    selectedBlendedLearning,
    selectedFreeCourses,
    sortCoursesByRelevance
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

  // Enhanced search handler with analytics and better UX
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    
    // Track search for analytics and reset search results total
    if (value.trim()) {
      trackSearch(value);
    } else {
      setSearchResultsTotal(0);
    }
  }, [trackSearch]);

  const handleSortChange = useCallback((val: string) => {
    setSortOrder(val);
    setShowSortDropdown(false);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Auto-scroll removed as requested
  }, []);

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
  }, [searchTerm, selectedCategory, selectedGrade, selectedLiveCourses, selectedBlendedLearning, selectedFreeCourses, selectedLevel, selectedDuration, selectedPriceRange, selectedFormat, selectedLanguage, selectedFeatures, selectedRating, selectedInstructor, sortOrder, hideCategoryFilter]);

  /**
   * No results
   */
  const renderNoResults = useCallback(() => {
    const isSearchActive = searchTerm.trim().length > 0;
    
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 filter-glassmorphic rounded-full flex items-center justify-center mb-6">
          <SearchX size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {isSearchActive ? `No courses found for "${searchTerm}"` : "No courses found"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
          {isSearchActive 
            ? "We couldn't find any courses matching your search. Try different keywords, check spelling, or adjust your filters."
            : "We couldn't find any courses matching your criteria. Try adjusting your filters or search terms."
          }
        </p>
        {isSearchActive && (
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Search suggestions:</p>
            <ul className="space-y-1">
              <li>• Try broader terms like "data science" instead of "machine learning algorithms"</li>
              <li>• Check category and grade filters on the left</li>
              <li>• Use different keywords related to your topic</li>
            </ul>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          {isSearchActive && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors duration-200 font-medium"
            >
              Clear Search
            </button>
          )}
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors duration-200 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }, [handleClearFilters, searchTerm, setSearchTerm]);

  /**
   * Count text - Memoized for performance
   */
  const coursesCountText = useMemo(() => {
    if (showingRelated) return "Related Courses";
    if (totalItems === 0) return "No courses found";
    if (totalItems === 1) {
      return searchTerm.trim() ? "1 course found (relevance sorted)" : "1 course found";
    }
    return searchTerm.trim() 
      ? `${totalItems.toLocaleString()} courses found (relevance sorted)` 
      : `${totalItems.toLocaleString()} courses found`;
  }, [showingRelated, totalItems, searchTerm]);

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

  // Determine grid column classes - consistent sizing regardless of course count
  const getGridColumnClasses = (): string => {
    if (customGridClassName) {
      return customGridClassName;
    }
    
    // Use consistent grid layout regardless of course count
    let gridClass = "grid pb-0";
    
    // Use consistent gaps for all course counts with improved spacing
    gridClass += " gap-3 md:gap-4 lg:gap-5 xl:gap-6";
    
    // Consistent responsive grid based on screen size only
    switch (responsiveGridColumns) {
      case 1:
        gridClass += " grid-cols-1";
        break;
      case 2:
        gridClass += " grid-cols-1 md:grid-cols-2";
        break;
      case 3:
        gridClass += " grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
        break;
      case 4:
      default:
        gridClass += " grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
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
        <div className="px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div 
              key={idx} 
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-96 transition-colors duration-200 flex flex-col"
              role="presentation"
            >
              {/* Skeleton Image */}
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-2xl mb-3"></div>
              {/* Skeleton Content */}
              <div className="px-3 pb-3 flex-1 space-y-2">
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
        </div>
      );
    }

    if (filteredCourses.length === 0) {
      return emptyStateContent || renderNoResults();
    }

    return (
              <div className="course-grid-container relative px-6 md:px-8 lg:px-10 xl:px-12 pt-4 pb-0">
        {/* Enhanced search feedback and results information */}
        {debouncedSearchTerm.trim() && (
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  Search results for "{debouncedSearchTerm}"
                </span>
                {filteredCourses.length > 0 && (
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full">
                    Most relevant first
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400">
                {isSearching ? (
                  <div className="flex items-center space-x-1">
                    <div className="animate-spin w-3 h-3 border border-indigo-400 border-t-transparent rounded-full"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <span>
                    {searchResultsTotal > 0 ? (
                      <>
                        {searchResultsTotal.toLocaleString()} 
                        {searchResultsTotal === 1 ? ' result' : ' results'}
                        {totalPages > 1 && (
                          <span className="ml-1">
                            (page {currentPage} of {totalPages})
                          </span>
                        )}
                      </>
                    ) : filteredCourses.length > 0 ? (
                      `${filteredCourses.length} ${filteredCourses.length === 1 ? 'result' : 'results'}`
                    ) : (
                      'No results found'
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Course Cards Grid - Responsive for all screen sizes */}
        <div className={`${getGridColumnClasses()} auto-rows-fr`}>
            {filteredCourses.map((course, index) => {
              if (!course || !course._id) {
                console.warn('Invalid course data:', course);
                return null;
              }
              
              // Check if this is a live course
              const isLiveCourse = liveCoursesOptions.includes(course.course_category) || 
                                 course.class_type === 'live' ||
                                 course.class_type === 'Live';
              
              // Enhance live courses with additional features
              let enhancedCourse = renderCourse ? renderCourse(course) : course;
              
              if (isLiveCourse) {
                enhancedCourse = {
                  ...enhancedCourse,
                  // Add live course specific features
                  liveFeatures: [
                    'Projects & Assignments',
                    'Corporate Internship',
                    'Job Guarantee',
                    '(18 Month Course Only)'
                  ],
                  additionalFeatures: [
                    'Projects',
                    'Assignments'
                  ],
                  isLiveCourse: true,
                  // Ensure live courses show full feature set like blended courses
                  showFullFeatures: true,
                  // Design improvements to match blended/self-paced courses
                  useStandardImageRatio: true,
                  useStandardBadgeSize: true,
                  preserveLiveHoverState: true,
                  // Add standard course features that live courses should display
                  standardFeatures: [
                    'Live Interactive Sessions',
                    'Expert Mentorship',
                    'Real-world Projects',
                    'Industry-relevant Curriculum',
                    'Career Support',
                    'Certificate of Completion'
                  ]
                } as ICourse;
              }
              
              return (
                <ErrorBoundary key={`course-${enhancedCourse._id}-${index}`}>
                  <div
                    className="course-card course-card-base h-full opacity-0 z-transition"
                    style={{
                      animationDelay: `${Math.min(index * 100, 1000)}ms`, // Cap delay at 1 second
                      animation: 'fadeInUp 0.6s ease-out forwards',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.classList.add('course-card-hover');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.classList.remove('course-card-hover');
                    }}
                  >
                    <MemoizedFilterCourseCard
                      course={enhancedCourse}
                      viewMode="grid"
                      isCompact={isMobile}
                      coursesPageCompact={true}
                      preserveClassType={true}
                      classType={classType || enhancedCourse.class_type}
                    />
                  </div>
                </ErrorBoundary>
              );
            })}
        </div>

        {/* Enhanced Custom CSS converted to Tailwind - keeping only essential animations and browser-specific styling */}
        <style jsx>{`
          /* Essential keyframe animations that can't be replicated with Tailwind utilities */
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

          @keyframes loading {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          /* Animation utility classes */
          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }

          .animate-loading {
            animation: loading 1.5s infinite;
          }

          /* Browser-specific scrollbar styling that can't be replicated with Tailwind */
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

          /* Global webkit scrollbar styling */
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

          /* Responsive grid improvements - Consistent sizing for all course counts */
          @media (max-width: 640px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
          
          @media (min-width: 641px) and (max-width: 767px) {
            .grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 768px) and (max-width: 1023px) {
            .grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          
          @media (min-width: 1280px) {
            .grid {
              gap: 1.5rem;
            }
          }

          /* Course card container optimizations */
          .course-card-container {
            min-height: 400px;
            display: flex;
            flex-direction: column;
          }

          /* Dynamic z-index management */
          .overlay-active {
            z-index: var(--z-mobile-dropdown);
          }

          .overlay-backdrop-active {
            z-index: var(--z-mobile-backdrop);
          }

          /* Prevent z-index conflicts during animations */
          .course-card.animating {
            z-index: var(--z-course-card);
          }

          .course-card:hover:not(.animating) {
            z-index: var(--z-course-card-hover);
          }

          /* Ensure dropdowns always appear above course cards */
          .dropdown-active {
            z-index: calc(var(--z-course-card-hover) + 10);
          }

          /* Force sort dropdown above everything */
          .sort-dropdown-content {
            z-index: 150 !important;
          }

          /* Force mobile categories above everything except backdrops */
          .mobile-categories-dropdown {
            z-index: 200 !important;
          }

          /* Ensure course cards stay below dropdowns */
          .course-grid-container .course-card {
            z-index: 10;
            max-z-index: 15;
          }

          /* Enhanced backdrop for better visual separation */
          .enhanced-backdrop {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            background: rgba(0, 0, 0, 0.4);
            transition: opacity 200ms ease-out, backdrop-filter 200ms ease-out;
          }

          .dark .enhanced-backdrop {
            background: rgba(0, 0, 0, 0.6);
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

          /* Mobile touch improvements */
          @media (max-width: 768px) {
            input[type="checkbox"] {
              min-width: 20px;
              min-height: 20px;
              transform: scale(1.2);
            }
            
            label {
              min-height: 48px;
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
              tap-highlight-color: rgba(0, 0, 0, 0.1);
            }
            
            button {
              min-height: 44px;
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
              tap-highlight-color: rgba(0, 0, 0, 0.1);
            }
          }

          /* Improve touch targets for all interactive elements */
          .mobile-touch-target {
            min-height: 44px;
            min-width: 44px;
            position: relative;
          }

          /* Ensure proper touch behavior */
          .touch-manipulation {
            touch-action: manipulation;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
        `}</style>
      </div>
    );
  }, [loading, filteredCourses, isMobile, renderCourse, classType, itemsPerPage, emptyStateContent, renderNoResults]);

  // Modern sidebar renderer - Simplified Category Filter
  const renderSidebar = (): React.ReactNode => {
    // Hide sidebar completely if grade filter is disabled
    if (hideGradeFilter) return null;
    
    // Show sidebar if grade filter is enabled, even with fixed category
    if (hideCategoryFilter && hideGradeFilter) return null;
    if (fixedCategory && hideGradeFilter) return null;
    
    // Show sidebar based on grade filter availability only
    const shouldHideSidebar = false; // Always show sidebar if grade filter is enabled
    
    return (
      <div className={`hidden xl:block xl:w-[20%] flex-shrink-0 ${shouldHideSidebar ? 'xl:hidden' : ''}`}>
        <div className="bg-white dark:bg-gray-800 py-4 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto custom-scrollbar">
          <div className="px-4 md:px-6">
                      <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
          </div>

          {/* Grade Filter Section */}
          {!hideGradeFilter && (
            <div className="mb-4">
              <div className="filter-glassmorphic rounded-xl border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                {/* Grade Filter Header - clickable to toggle open/close */}
                <div
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300"
                  onClick={handleOpenGradeDropdown}
                  data-testid="grade-filter-dropdown"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 filter-glassmorphic rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-indigo-900 dark:text-indigo-100 filter-glassmorphic">Grade Level</h5>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">Educational level</p>
                    </div>
                  </div>
                  {selectedGrade.length > 0 && (
                    <span className="ml-auto text-xs bg-indigo-500 text-white px-2 py-1 rounded-full font-medium">
                      {selectedGrade.length}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 transition-all duration-300 ml-2 ${isGradeDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                {/* Grade Level Options - only visible when open */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isGradeDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-800">
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
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {grade}
                          </span>
                        </div>
                        {selectedGrade.includes(grade) && (
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-full animate-pulse">
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
                          className="w-full text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
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
          
          {/* Categories Section - Only show if no fixed category */}
          {!hideCategoryFilter && !hideCategories && !fixedCategory && (
            <div className="space-y-2">
              
              {/* Live Courses */}
              <div className="filter-glassmorphic rounded-xl border border-red-100 dark:border-red-900/30 overflow-hidden" data-live-courses-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 ease-in-out" 
                  onClick={handleOpenLiveCoursesDropdown}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 filter-glassmorphic rounded-lg flex items-center justify-center transition-all duration-300">
                      <Zap className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-red-900 dark:text-red-100 filter-glassmorphic">Live Courses</h5>
                      <p className="text-xs text-red-600 dark:text-red-400">Live sessions</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-red-600 dark:text-red-400 transition-all duration-300 ease-in-out ${isLiveCoursesDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Live Courses Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isLiveCoursesDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-red-100 dark:border-red-900/30 filter-glassmorphic">
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
              <div className="filter-glassmorphic rounded-xl border border-blue-100 dark:border-blue-900/30 overflow-hidden" data-blended-learning-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 ease-in-out" 
                  onClick={handleOpenBlendedLearningDropdown}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 filter-glassmorphic rounded-lg flex items-center justify-center transition-all duration-300">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 filter-glassmorphic">Blended Learning</h5>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Live Q&A + self-paced</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-in-out ${isBlendedLearningDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Blended Learning Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isBlendedLearningDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-blue-100 dark:border-blue-900/30 filter-glassmorphic">
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

              {/* Free Courses */}
              <div className="filter-glassmorphic rounded-xl border border-green-100 dark:border-green-900/30 overflow-hidden" data-free-courses-dropdown>
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 ease-in-out" 
                  onClick={handleOpenFreeCoursesDropdown}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 filter-glassmorphic rounded-lg flex items-center justify-center transition-all duration-300">
                      <span className="text-green-600 dark:text-green-400 font-bold text-sm">$</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-green-900 dark:text-green-100 filter-glassmorphic">Free Courses</h5>
                      <p className="text-xs text-green-600 dark:text-green-400">Get started free</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-green-600 dark:text-green-400 transition-all duration-300 ease-in-out ${isFreeCoursesDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
                </div>
                
                {/* Free Courses Dropdown Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFreeCoursesDropdownOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-green-100 dark:border-green-900/30 filter-glassmorphic">
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


              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main content renderer with course list and pagination
  const renderMainContent = (): React.ReactNode => {
    // Adjust width based on sidebar visibility - show sidebar if grade filter is enabled
    const shouldHideSidebar = (fixedCategory && hideGradeFilter);
    const mainContentWidth = shouldHideSidebar ? 'w-full' : 'xl:w-[80%]';
    
    return (
      <div className={`flex-1 ${mainContentWidth} flex flex-col`}>
        <div className="bg-white dark:bg-gray-900 flex-1 overflow-hidden">
          {/* Scrollable Course List Container */}
          <div className="h-full overflow-y-auto custom-scrollbar">
            {/* Course List */}
            {renderCourseList()}
            
            {/* Pagination */}
            {!loading && filteredCourses.length > 0 && totalPages > 1 && (
              <div className="px-6 md:px-8 lg:px-10 xl:px-12 py-2 border-t border-gray-100 dark:border-gray-800">
                <SimplePaginationWrapper
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  simplified={simplePagination}
                  className="flex justify-center"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Simplified Mobile Categories dropdown component - fixed stuck issue
  const MobileCategoriesDropdown = React.memo(() => {
    // Don't render if grade filter is hidden
    if (hideGradeFilter) return null;
    // Don't render if there's a fixed category AND no grade filter
    if (fixedCategory && hideGradeFilter) return null;
    const mobileCategoriesRef = useRef<HTMLDivElement>(null);
    const [selectedCount, setSelectedCount] = useState(0);

    // Calculate total selected filters for badge
    useEffect(() => {
      const total = selectedLiveCourses.length + selectedBlendedLearning.length + selectedFreeCourses.length + selectedGrade.length;
      setSelectedCount(total);
    }, [selectedLiveCourses, selectedBlendedLearning, selectedFreeCourses, selectedGrade]);

    // Handle click outside to close dropdown - but not when clicking inside modal content
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        
        // Don't close if clicking inside the modal content
        const modalContent = document.querySelector('[data-modal-content="true"]');
        if (modalContent && modalContent.contains(target)) {
          return;
        }
        
        // Don't close if clicking on the filter button itself
        if (mobileCategoriesRef.current && mobileCategoriesRef.current.contains(target)) {
          return;
        }
        
        // Only close if clicking on backdrop or outside
        const backdrop = document.querySelector('[data-modal-backdrop="true"]');
        if (backdrop && backdrop.contains(target) && !modalContent?.contains(target)) {
          setIsMobileCategoriesOpen(false);
        }
      };

      if (isMobileCategoriesOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('touchstart', handleClickOutside);
        };
      }
    }, [isMobileCategoriesOpen]);

    const modalContent = isMobileCategoriesOpen ? (
      <>
        {/* Enhanced mobile backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] animate-in fade-in duration-300" 
          onClick={() => setIsMobileCategoriesOpen(false)}
          onTouchEnd={() => setIsMobileCategoriesOpen(false)}
          style={{ touchAction: 'none' }}
          data-modal-backdrop="true"
        />
        {/* Comprehensive Filters Modal */}
        <div 
          className="fixed top-[4vh] bottom-[4vh] left-1/2 transform -translate-x-1/2 w-[95vw] max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[1001] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          style={{ touchAction: 'auto' }}
          data-modal-content="true"
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                  <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Filters</h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Discover your perfect course</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileCategoriesOpen(false);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ touchAction: 'manipulation' }}
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div 
            className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
            style={{ touchAction: 'pan-y' }}
          >
            
            {/* Grade Level Section - Only show if grade filter is not hidden */}
            {!hideGradeFilter && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">Grade Level</h4>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Educational level</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {gradeOptions.map((grade, index) => (
                    <label
                      key={grade}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 border border-transparent hover:border-purple-200/20 dark:hover:border-purple-800/20 active:bg-gray-100 dark:active:bg-gray-600 ${isGradeDropdownOpen ? 'animate-slideIn' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
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
                        className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 font-medium select-none">
                        {grade}
                      </span>
                      {selectedGrade.includes(grade) && (
                        <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-full animate-pulse">
                          ✓
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                {/* Clear Grade Filters */}
                {selectedGrade.length > 0 && (
                  <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                    <button
                      onClick={() => setSelectedGrade([])}
                      className="w-full text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Clear Grade Filters ({selectedGrade.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Live Courses Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">Live Courses</h4>
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">Live sessions</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {liveCoursesOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 border border-transparent hover:border-red-200/20 dark:hover:border-red-800/20 active:bg-gray-100 dark:active:bg-gray-600"
                    style={{ touchAction: 'manipulation' }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLiveCourses.includes(option)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedLiveCourses(prev => [...prev, option]);
                        } else {
                          setSelectedLiveCourses(prev => prev.filter(o => o !== option));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                      style={{ touchAction: 'manipulation' }}
                    />
                    <span 
                      className="ml-3 text-sm text-gray-700 dark:text-gray-300 font-medium select-none"
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Blended Learning Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">Blended Learning</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Live Q&A + self-paced</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {blendedLearningOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200/20 dark:hover:border-blue-800/20 active:bg-gray-100 dark:active:bg-gray-600"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBlendedLearning.includes(option)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedBlendedLearning(prev => [...prev, option]);
                        } else {
                          setSelectedBlendedLearning(prev => prev.filter(o => o !== option));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                      style={{ touchAction: 'manipulation' }}
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 font-medium select-none">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Free Courses Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">$</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">Free Courses</h4>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Get started free</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {freeCoursesOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 border border-transparent hover:border-green-200/20 dark:hover:border-green-800/20 active:bg-gray-100 dark:active:bg-gray-600"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFreeCourses.includes(option)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedFreeCourses(prev => [...prev, option]);
                        } else {
                          setSelectedFreeCourses(prev => prev.filter(o => o !== option));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                      style={{ touchAction: 'manipulation' }}
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 font-medium select-none">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="flex-shrink-0 px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-b-2xl backdrop-blur-sm">
            {selectedCount > 0 && (
              <div className="flex items-center justify-center mb-4 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="font-medium">
                  {selectedCount} filter{selectedCount !== 1 ? 's' : ''} selected
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGrade([]);
                  setSelectedLiveCourses([]);
                  setSelectedBlendedLearning([]);
                  setSelectedFreeCourses([]);
                }}
                className="flex-1 px-5 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedCount === 0}
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileCategoriesOpen(false);
                }}
                className="flex-1 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                style={{ touchAction: 'manipulation' }}
              >
                <Filter className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>
      </>
    ) : null;

    return (
      <div className="mobile-categories-container xl:hidden relative" ref={mobileCategoriesRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
          }}
          className={`group flex items-center justify-center px-4 py-3 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 min-w-[140px] ${
            isMobileCategoriesOpen || selectedCount > 0
              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-400 ring-4 ring-indigo-500/20'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <div className={`p-1 rounded-lg transition-colors duration-200 mr-2 ${
            isMobileCategoriesOpen || selectedCount > 0 
              ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
          }`}>
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">Filters</span>
          {selectedCount > 0 && (
            <div className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center shadow-sm">
              {selectedCount}
            </div>
          )}
          <ChevronDown className={`ml-2 w-4 h-4 transition-transform duration-300 ${
            isMobileCategoriesOpen ? 'rotate-180 text-indigo-500' : 'text-gray-500'
          }`} />
        </button>

        {/* Render modal content using ReactDOM.createPortal */}
        {typeof window !== 'undefined' && modalContent && ReactDOM.createPortal(modalContent, document.body)}
      </div>
    );
  });

  // Add display name for debugging
  MobileCategoriesDropdown.displayName = 'MobileCategoriesDropdown';

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

    // Note: Individual category dropdowns (Live Courses, Blended Learning, etc.) 
    // within the mobile categories dropdown don't auto-close to prevent interrupting user selection

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
          className={`flex items-center justify-between w-full md:w-32 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 border shadow-sm ${
            isFilterDropdownOpen 
              ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Filters
            </span>
            {getTotalActiveFilters() > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                {getTotalActiveFilters()}
              </span>
            )}
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 text-gray-400 dark:text-gray-500 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isFilterDropdownOpen && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
              onClick={() => {
                setIsFilterDropdownOpen(false);
                onFilterDropdownToggle?.(false);
              }}
              onTouchMove={(e) => e.preventDefault()}
              style={{ touchAction: 'none' }}
            />
            <div 
              className="fixed inset-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-sm filter-glassmorphic rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden md:absolute md:top-full md:right-0 md:left-auto md:transform-none md:translate-x-0 md:translate-y-0 md:inset-auto md:mt-2 md:w-96"
              onClick={(e) => e.stopPropagation()}
              style={{ touchAction: 'auto' }}
            >
            {/* Filter Sections - Single scroll for entire content */}
            <div 
              ref={filterScrollRef}
              onScroll={handleDropdownScroll}
              className="overflow-y-auto max-h-80 p-2 md:p-3 space-y-2 md:space-y-3"
            >
              {/* Clear All Button - moved to top */}
              <div className="flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileCategoriesOpen(false)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  });

  // FilterDropdown component end

  return (
    <ErrorBoundary>
      <section className="w-full" role="region" aria-label="Course Filter">
        {/* Modern header with improved design */}
        {!hideHeader && (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
            
            <div className="relative px-6 md:px-8 lg:px-10 xl:px-12 py-12 md:py-16 text-center">
              <div className="max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Discover Your Perfect Course
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  Find Your Perfect Course
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Discover courses tailored to your goals and skill level
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main container with improved background */}
        <div className="w-full bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-900/80 dark:to-gray-900 min-h-screen flex flex-col">
          {/* Compact search and filters bar */}
          {!hideFilterBar && (
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm flex-shrink-0">
              <div className="px-6 md:px-8 lg:px-10 xl:px-12 py-2 md:py-3">
                {/* Compact Filter Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                      <Filter className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Find Your Course</h2>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Use filters to discover the perfect learning path</p>
                    </div>
                  </div>
                </div>

                {/* Compact Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  {/* Filter Controls - Top on iPad */}
                  <div className="flex flex-wrap gap-3 md:gap-4 items-center justify-center md:justify-start order-1 md:order-2">
                    {!hideSortOptions && (
                      <SortDropdown 
                        sortOrder={sortOrder} 
                        handleSortChange={handleSortChange} 
                        showSortDropdown={showSortDropdown} 
                        setShowSortDropdown={setShowSortDropdown} 
                      />
                    )}
                    
                    {/* Mobile Categories Dropdown */}
                    <MobileCategoriesDropdown />
                  </div>
                  
                  {/* Search Section - Below filters on iPad */}
                  {!hideSearch && (
                    <div className="flex-1 lg:max-w-2xl order-2 md:order-1">
                      <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} setSearchTerm={setSearchTerm} />
          </div>
        )}
                    </div>
                    </div>
                  </div>
          )}

          {/* Main content area with dynamic layout - Edge to edge */}
          <div className="flex flex-col lg:flex-row relative flex-1 overflow-hidden">
            {renderSidebar()}
            {renderMainContent()}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export { useWindowSize };
export default CoursesFilter;
