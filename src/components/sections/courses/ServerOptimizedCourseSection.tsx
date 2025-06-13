'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Import our new server-side hooks
import { useServerCourses, useServerPrefetch } from '@/hooks/useServerData.hook';
import { useServerLoadingState } from '@/providers/ServerLoadingProvider';

// Import existing components
import CourseCard from '@/components/shared/cards/CourseCard';
import LoadingState from '@/components/shared/LoadingState';

// ===== TYPES =====

interface ICourse {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface IServerOptimizedCourseSectionProps {
  initialData?: {
    courses: ICourse[];
    categories: string[];
    totalCount: number;
  };
  enableServerPrefetch?: boolean;
  showFilters?: boolean;
  gridColumns?: number;
}

// ===== COMPONENT =====

const ServerOptimizedCourseSection: React.FC<IServerOptimizedCourseSectionProps> = ({
  initialData,
  enableServerPrefetch = true,
  showFilters = true,
  gridColumns = 3
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Extract URL parameters for filters
  const currentCategory = searchParams.get('category') || 'all';
  const currentLevel = searchParams.get('level') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  // Server-side hooks
  const {
    data: courseData,
    loading,
    error,
    fetchCourses
  } = useServerCourses({
    onError: (error) => {
      console.error('Failed to fetch courses:', error);
    },
    onSuccess: (data) => {
      console.log('Courses loaded successfully:', data?.courses?.length);
    }
  });

  const { prefetchCourse } = useServerPrefetch();
  const createLoadingState = useServerLoadingState();

  // Local state for UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Categories for filtering
  const categories = useMemo(() => {
    const allCategories = ['all', ...(initialData?.categories || [])];
    if (courseData?.categories) {
      return ['all', ...courseData.categories];
    }
    return allCategories;
  }, [initialData?.categories, courseData?.categories]);

  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load courses when filters change
  useEffect(() => {
    if (!mounted) return;

    const loadingState = createLoadingState(
      'data',
      'Loading courses...',
      'medium',
      `Filtering by ${currentCategory}, ${currentLevel}`
    );

    const loadCourses = async () => {
      try {
        await fetchCourses({
          category: currentCategory,
          level: currentLevel,
          search: currentSearch,
          page: currentPage,
          limit: 12,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
      } finally {
        loadingState.complete();
      }
    };

    loadCourses();
  }, [mounted, currentCategory, currentLevel, currentSearch, currentPage, fetchCourses, createLoadingState]);

  // Update URL when filters change
  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page when filters change
    if (newFilters.category || newFilters.level || newFilters.search) {
      params.delete('page');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    updateFilters({ category });
  };

  // Handle level change
  const handleLevelChange = (level: string) => {
    updateFilters({ level });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Prefetch course on hover
  const handleCourseHover = (courseId: string) => {
    if (enableServerPrefetch) {
      prefetchCourse(courseId);
    }
  };

  // Get current courses data
  const courses = courseData?.courses || initialData?.courses || [];
  const totalCount = courseData?.totalCount || initialData?.totalCount || 0;
  const totalPages = courseData?.totalPages || Math.ceil(totalCount / 12);

  // Loading state with initial data
  if (loading && !initialData && courses.length === 0) {
    return (
      <LoadingState
        message="Loading courses..."
        description="Fetching the latest course data from our servers"
      />
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load courses
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Courses
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover world-class courses designed to accelerate your learning journey
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  defaultValue={currentSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <select
                value={currentCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={currentLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? (
              <span className="flex items-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full mr-2"
                />
                Loading courses...
              </span>
            ) : (
              `Showing ${courses.length} of ${totalCount} courses`
            )}
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div className={`grid gap-6 mb-8 ${
          viewMode === 'grid' 
            ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns}` 
            : 'grid-cols-1'
        }`}>
          {courses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onHoverStart={() => handleCourseHover(course._id)}
            >
              <CourseCard
                course={course}
                viewMode={viewMode}
                enableHoverEffects={true}
              />
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => updateFilters({ category: 'all', level: 'all', search: '' })}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerOptimizedCourseSection; 