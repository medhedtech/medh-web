"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

// Dynamically import components that might cause hydration issues
const DynamicCourseCard = dynamic(() => import("./CourseCard"), {
  ssr: true,
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96 transition-colors duration-200"></div>,
});

// Fallback categories if none provided
const fallbackCategories = [
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
];

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
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getQuery, loading } = useGetQuery();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [sortOrder, setSortOrder] = useState("newest-first");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

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

  // Refs
  const sortDropdownRef = useRef(null);
  const didInitRef = useRef(false);
  const debounceTimer = useRef(null);

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
      // Page
      if (currentPage > 1) {
        q.set("page", currentPage.toString());
      }

      const newQuery = q.toString();
      const newUrl = newQuery ? `${baseUrl}?${newQuery}` : baseUrl;
      const currentUrl = window.location.pathname + window.location.search;
      if (newUrl !== currentUrl) {
        router.push(newUrl, { shallow: true });
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
    setQueryError(null);

    // Make sure categories are in sync (fixed or chosen)
    const catList = fixedCategory
      ? [fixedCategory]
      : selectedCategory.map((c) => c.trim()).filter(Boolean);

    // Simple single encoding for categories
    const encodedCategory = catList.length > 0
      ? catList.map(cat => encodeURIComponent(cat)).join(",")
      : "";

    // Build sort parameters
    let sortBy, sortDir;
    switch (sortOrder) {
      case "oldest-first":
        sortBy = "createdAt";
        sortDir = "asc";
        break;
      case "A-Z":
        sortBy = "course_title";
        sortDir = "asc";
        break;
      case "Z-A":
        sortBy = "course_title";
        sortDir = "desc";
        break;
      case "price-low-high":
        sortBy = "course_fee";
        sortDir = "asc";
        break;
      case "price-high-low":
        sortBy = "course_fee";
        sortDir = "desc";
        break;
      case "newest-first":
      default:
        sortBy = "createdAt";
        sortDir = "desc";
    }

    // Safely encode search term and grade
    const encodedSearch = searchTerm ? encodeURIComponent(decodeURIComponent(searchTerm.trim())) : "";
    const encodedGrade = selectedGrade ? encodeURIComponent(decodeURIComponent(selectedGrade.trim())) : "";

    try {
      const apiUrl = apiUrls.courses.getAllCoursesWithLimits(
        currentPage,
        8, // items per page
        "", // course_title
        "", // course_tag
        encodedCategory,
        "Published",
        encodedSearch,
        encodedGrade,
        [], // category array (deprecated)
        {
          certification: false,
          hasAssignments: false,
          hasProjects: false,
          hasQuizzes: false,
          sortBy,
          sortOrder: sortDir
        },
        classType
      );

      // Log the final URL for debugging
      console.debug('Fetching courses with URL:', apiUrl);

      await getQuery({
        url: apiUrl,
        onSuccess: (data) => {
          if (data && Array.isArray(data.courses)) {
            setAllCourses(data.courses);
            setFilteredCourses(data.courses);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalItems(data.pagination?.totalCourses || 0);

            if (scrollToTop) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            console.warn('Invalid or empty response data:', data);
            setAllCourses([]);
            setFilteredCourses([]);
            setTotalPages(1);
            setTotalItems(0);
          }
        },
        onFail: (err) => {
          console.error("API Error:", err);
          setQueryError(err?.message || "Failed to fetch courses. Please try again.");
          setAllCourses([]);
          setFilteredCourses([]);
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setQueryError("An unexpected error occurred. Please try again later.");
      setAllCourses([]);
      setFilteredCourses([]);
    }
  }, [
    currentPage,
    sortOrder,
    searchTerm,
    selectedGrade,
    selectedCategory,
    fixedCategory,
    classType,
    scrollToTop,
    getQuery
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

  return (
    <>
      <ErrorBoundary>
        <section className="pb-20 relative w-full">
          {/* Course Header */}
          <div className="bg-gray-900 dark:bg-gray-950 py-10 md:py-16 transition-colors duration-300 border-b border-gray-800 dark:border-gray-800/40 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-gray-50">
                  {categoryTitle || "Explore Courses"}
                </h1>
                <p className="text-gray-300 dark:text-gray-300/90 text-lg transition-colors duration-300">
                  {description ||
                    "Discover courses to enhance your skills and advance your career."}
                </p>
              </div>
            </div>
          </div>

          {/* Main Wrapper */}
          <div className="container mx-auto px-4 -mt-8 w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-4 md:p-6 mb-8 border border-transparent dark:border-gray-700 transition-colors duration-300">
              {/* Top Filters Row */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="flex-grow relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sort */}
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center justify-between w-full md:w-48 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">
                      {
                        {
                          "newest-first": "Newest First",
                          "oldest-first": "Oldest First",
                          "A-Z": "Name (A-Z)",
                          "Z-A": "Name (Z-A)",
                          "price-low-high": "Price (Low->High)",
                          "price-high-low": "Price (High->Low)",
                        }[sortOrder] || "Newest First"
                      }
                    </span>
                    <ChevronDown size={16} />
                  </button>

                  {showSortDropdown && (
                    <div className="absolute right-0 mt-1 w-full md:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 transition-colors duration-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleSortChange("newest-first")}
                          className={`${
                            sortOrder === "newest-first"
                              ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                          } block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                        >
                          Newest First
                        </button>
                        <button
                          onClick={() => handleSortChange("oldest-first")}
                          className={`${
                            sortOrder === "oldest-first"
                              ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                          } block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                        >
                          Oldest First
                        </button>
                        <button
                          onClick={() => handleSortChange("A-Z")}
                          className={`${
                            sortOrder === "A-Z"
                              ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                          } block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                        >
                          Name (A-Z)
                        </button>
                        <button
                          onClick={() => handleSortChange("Z-A")}
                          className={`${
                            sortOrder === "Z-A"
                              ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                          } block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                        >
                          Name (Z-A)
                        </button>
                        <button
                          onClick={() => handleSortChange("price-low-high")}
                          className={`${
                            sortOrder === "price-low-high"
                              ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                          } block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                        >
                          Price (Low-&gt;High)
                        </button>
                        <button
                          onClick={() => handleSortChange("price-high-low")}
                          className={`${
                            sortOrder === "price-high-low"
                              ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                          } block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                        >
                          Price (High-&gt;Low)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* View Mode */}
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

                {/* Mobile Filters */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                >
                  <Filter size={18} className="mr-2" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      Active Filters:
                    </span>
                    {activeFilters.map((f, idx) => (
                      <div
                        key={`${f.type}-${idx}`}
                        className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200"
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

              {/* Main Content */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
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
                      {!hideCategoryFilter && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-200">
                            Categories
                          </h4>
                          <CategoryFilter
                            categories={availableCategories || fallbackCategories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={handleCategoryChange}
                          />
                        </div>
                      )}
                      {/* Grade */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-200">
                          Grade Level
                        </h4>
                        <select
                          value={selectedGrade}
                          onChange={(e) => handleGradeChange(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                        >
                          <option value="">All Grades</option>
                          <option value="Elementary">Elementary</option>
                          <option value="Middle School">Middle School</option>
                          <option value="High School">High School</option>
                          <option value="College">College</option>
                          <option value="Professional">Professional</option>
                        </select>
                      </div>

                      {/* Features (static placeholders) */}
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

                {/* Content Area */}
                <div className="lg:w-3/4">
                  {/* Top row for count */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">
                      {coursesCountText}
                      {showingRelated && (
                        <button
                          onClick={clearRelated}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                        >
                          Back to All Courses
                        </button>
                      )}
                    </div>

                    {!hideCategoryFilter && (
                      <CategoryToggle
                        categories={(availableCategories || fallbackCategories).slice(
                          0,
                          6
                        )}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={handleCategoryChange}
                      />
                    )}
                  </div>

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

                  {/* Loading */}
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96 transition-colors duration-200"></div>
                      ))}
                    </div>
                  ) : filteredCourses.length > 0 ? (
                    // Show courses
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" : "space-y-4"}>
                      {filteredCourses.map((course) => (
                        <ErrorBoundary key={course._id || course.id}>
                          <DynamicCourseCard 
                            course={course} 
                            viewMode={viewMode}
                            isCompact={false}
                            preserveClassType={true}
                            className={viewMode === "list" ? "border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" : ""}
                          />
                        </ErrorBoundary>
                      ))}
                    </div>
                  ) : (
                    // No results
                    renderNoResults()
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}

                  {/* Bottom Action */}
                  <div className="mt-12 text-center">
                    {CustomButton ? (
                      <div className="inline-block">{CustomButton}</div>
                    ) : (
                      <Link
                        href="/courses"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <span>View All Courses</span>
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ErrorBoundary>
    </>
  );
};

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
};

export default CoursesFilter;