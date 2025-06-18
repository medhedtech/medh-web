"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Search, 
  Filter, 
  Clock, 
  X, 
  Trash2, 
  Book, 
  GraduationCap, 
  Tag,
  Clock3,
  Users,
  Calendar,
  Star,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { showToast } from '@/utils/toastManager';
import useGetQuery from '@/hooks/getQuery.hook';
import { apiUrls } from '@/apis';
import axios from 'axios';

const SavedCoursesPage = () => {
  const [savedCourses, setSavedCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'list' view
  
  // Use the getQuery hook for fetching saved courses
  const { getQuery, loading, data, error } = useGetQuery();

  // Fetch saved courses from API
  useEffect(() => {
    fetchSavedCourses();
  }, []);

  const fetchSavedCourses = async () => {
    try {
      const result = await getQuery({
        url: apiUrls.enrolledCourses.getSavedCourses,
        requireAuth: true,
        showToast: false,
      });
      
      if (result && result.data && Array.isArray(result.data.savedCourses)) {
        setSavedCourses(result.data.savedCourses);
        setFilteredCourses(result.data.savedCourses);
      } else {
        // If no courses or unexpected response format
        setSavedCourses([]);
        setFilteredCourses([]);
      }
    } catch (err) {
      console.error("Error fetching saved courses:", err);
      showToast.error("Failed to load your saved courses");
      setSavedCourses([]);
      setFilteredCourses([]);
    }
  };

  // Filter courses based on search query and selected filters
  useEffect(() => {
    let filtered = savedCourses;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course => 
        selectedCategories.includes(course.category)
      );
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategories, savedCourses]);

  // Remove a course from saved courses
  const handleRemoveSaved = async (courseId) => {
    try {
      // Call the API to remove the saved course
      await axios.delete(apiUrls.enrolledCourses.removeSavedCourse(courseId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'x-access-token': localStorage.getItem('token')
        }
      });
      
      // Update the UI by removing the course from the state
      setSavedCourses(savedCourses.filter(course => course._id !== courseId));
      showToast.success("Course removed from saved items");
    } catch (err) {
      console.error("Error removing saved course:", err);
      showToast.error("Failed to remove course from saved items");
    }
  };

  // Clear all saved courses
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved courses?')) {
      // Create a promise array for all removals
      const removePromises = savedCourses.map(course => 
        axios.delete(apiUrls.enrolledCourses.removeSavedCourse(course._id), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'x-access-token': localStorage.getItem('token')
          }
        })
      );
      
      // Execute all promises
      Promise.all(removePromises)
        .then(() => {
          setSavedCourses([]);
          showToast.success("All courses removed from saved items");
        })
        .catch(err => {
          console.error("Error clearing saved courses:", err);
          showToast.error("Failed to remove all saved courses");
        });
    }
  };

  const formatSavedDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Get unique categories for filters
  const categories = [...new Set(savedCourses.filter(course => course.category).map(course => course.category))];

  // Helper function to get course image
  const getCourseImage = (course) => {
    if (course.course_image) return course.course_image;
    if (course.image) return course.image;
    return fallbackCourseImg;
  };

  // Helper function to get course price
  const formatPrice = (course) => {
    if (course.isFree || (course.price === 0)) return 'Free';
    return course.price ? `$${course.price.toFixed(2)}` : 'Price unavailable';
  };

  // Helper function to get original price
  const formatOriginalPrice = (course) => {
    if (!course.originalPrice || course.originalPrice === course.price) return null;
    return `$${course.originalPrice.toFixed(2)}`;
  };

  return (
    <PageWrapper>
      <div className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 py-24 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bookmark className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Saved Courses
              </h1>
              <span className="inline-flex items-center justify-center ml-2 w-6 h-6 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                {savedCourses.length}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {view === 'grid' ? 'List View' : 'Grid View'}
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              {savedCourses.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors"
              />
            </div>

            {showFilters && categories.length > 0 && (
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategories(prev =>
                          prev.includes(category)
                            ? prev.filter(c => c !== category)
                            : [...prev, category]
                        );
                      }}
                      className={`px-3 py-1.5 text-sm rounded-full capitalize transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4">
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Loading your saved courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error loading saved courses</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                We encountered a problem while loading your saved courses. Please try again later.
              </p>
              <button 
                onClick={fetchSavedCourses}
                className="inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && savedCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-10 h-10 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved courses</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                You haven't saved any courses yet. Browse our catalog and save courses to view them here.
              </p>
              <Link href="/courses" className="inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                Browse Courses
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}

          {/* No Results State */}
          {!loading && !error && savedCourses.length > 0 && filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No matching courses</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                No courses match your current search filters. Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Course Grid */}
          {!loading && !error && filteredCourses.length > 0 && view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div 
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
                >
                  <div className="relative">
                    <Link href={`/course-details/${course._id}`}>
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={getCourseImage(course)}
                          alt={course.title || 'Course image'}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 capitalize">
                        {course.category ? course.category.replace('-', ' ') : 'Course'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveSaved(course._id)}
                      className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 rounded-full text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      aria-label="Remove from saved"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 p-5">
                    <Link href={`/course-details/${course._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {course.title || 'Untitled Course'}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center mb-3">
                      {course.rating && (
                        <div className="flex items-center mr-4">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{course.rating}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({course.reviews || 0})</span>
                        </div>
                      )}
                      
                      {course.students && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {typeof course.students === 'number' ? course.students.toLocaleString() : course.students}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {course.duration && (
                        <div className="flex items-center">
                          <Clock3 className="h-4 w-4 text-gray-400 mr-1.5" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{course.duration}</span>
                        </div>
                      )}
                      
                      {course.level && (
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 text-gray-400 mr-1.5" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{course.level}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          <span className="font-medium">Saved</span> {formatSavedDate(course.savedAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-baseline">
                        {course.originalPrice && course.originalPrice !== course.price && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-through mr-1">
                            {formatOriginalPrice(course)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(course)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Course List */}
          {!loading && !error && filteredCourses.length > 0 && view === 'list' && (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div 
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row"
                >
                  <div className="sm:w-64 md:w-72 relative">
                    <Link href={`/course-details/${course._id}`}>
                      <div className="aspect-video sm:aspect-square sm:h-full w-full relative">
                        <Image
                          src={getCourseImage(course)}
                          alt={course.title || 'Course image'}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          priority
                        />
                      </div>
                    </Link>
                  </div>
                  
                  <div className="flex-1 p-5">
                    <div className="flex justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 capitalize">
                        {course.category ? course.category.replace('-', ' ') : 'Course'}
                      </span>
                      
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                          Saved {formatSavedDate(course.savedAt)}
                        </span>
                        <button
                          onClick={() => handleRemoveSaved(course._id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                          aria-label="Remove from saved"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <Link href={`/course-details/${course._id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {course.title || 'Untitled Course'}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>
                    
                    <div className="flex flex-wrap gap-y-2 mb-3">
                      {course.rating && (
                        <div className="flex items-center mr-4">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{course.rating}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({course.reviews || 0})</span>
                        </div>
                      )}
                      
                      {course.students && (
                        <div className="flex items-center mr-4">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {typeof course.students === 'number' ? course.students.toLocaleString() : course.students} students
                          </span>
                        </div>
                      )}
                      
                      {course.duration && (
                        <div className="flex items-center mr-4">
                          <Clock3 className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{course.duration}</span>
                        </div>
                      )}
                      
                      {course.level && (
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{course.level}</span>
                        </div>
                      )}
                    </div>
                    
                    {course.instructor && (
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                        <span className="mr-1">Instructor:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {course.instructor.name || 'Unknown instructor'}
                        </span>
                      </div>
                    )}
                    
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {course.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2 sm:mt-0">
                      <div className="flex items-baseline">
                        {course.originalPrice && course.originalPrice !== course.price && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-through mr-1">
                            {formatOriginalPrice(course)}
                          </span>
                        )}
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(course)}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/course-details/${course._id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                      >
                        View Course
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination would be added here if the API supports it */}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SavedCoursesPage; 