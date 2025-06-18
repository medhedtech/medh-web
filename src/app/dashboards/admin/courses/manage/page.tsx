"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { 
  Edit, 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  Download,
  Upload,
  MoreHorizontal,
  CheckSquare,
  Square,
  AlertCircle,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Settings,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Tag,
  User,
  X
} from "lucide-react";
import { showToast } from '@/utils/toastManager';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrls } from "@/apis";
import { useGetQuery, usePostQuery, useDeleteQuery } from "@/hooks";
import { courseTypesAPI } from "@/apis/courses";
import type { 
  ICollaborativeResponse, 
  TNewCourse, 
  ILegacyCourse,
  IAdvancedSearchParams 
} from "@/apis/courses";
import InstructorAssignmentModal from "@/components/shared/modals/InstructorAssignmentModal";

// Enhanced Course interface with comprehensive typing
interface CourseMetrics {
  enrollments: number;
  views: number;
  ratings: {
    average: number;
    count: number;
  };
  revenue?: number;
  completion_rate?: number;
  lastUpdated?: string;
}

interface CoursePrice {
  _id?: string;
  currency: string;
  individual: number;
  batch: number;
  min_batch_size?: number;
  max_batch_size?: number;
  early_bird_discount?: number;
  group_discount?: number;
  is_active?: boolean;
  valid_from?: string;
  valid_until?: string;
}

interface CourseInstructor {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
  expertise?: string[];
}

interface Course {
  _id: string;
  course_title: string;
  course_subtitle?: string;
  course_category: string;
  course_subcategory?: string;
  course_type?: string;
  course_tag?: string;
  category_type?: string;
  status?: string;
  course_image?: string;
  course_description?: {
    program_overview?: string;
    benefits?: string;
    learning_objectives?: string[];
    course_requirements?: string[];
    target_audience?: string[];
    _id?: string;
  };
  assigned_instructor?: CourseInstructor;
  course_duration?: string;
  session_duration?: string;
  no_of_Sessions?: number;
  course_fee?: number;
  prices?: CoursePrice[];
  isFree?: boolean;
  language?: string;
  course_level?: string;
  class_type?: string;
  classType?: string;
  meta?: CourseMetrics;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  curriculum?: any[];
  resource_pdfs?: any[];
  tools_technologies?: any[];
  faqs?: any[];
  related_courses?: string[];
  
  // Additional fields from actual API response
  brochures?: string[];
  course_videos?: any[];
  resource_videos?: any[];
  recorded_videos?: any[];
  show_in_home?: boolean;
  _source?: string;
  subtitle_languages?: string[];
  final_evaluation?: any;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  doubt_session_schedule?: any;
  certification?: any;
  course_modules?: any[];
  bonus_modules?: any[];
  unique_key?: string;
  slug?: string;
  __v?: number;
  
  // Free course specific fields
  lessons?: any[];
  resources?: any[];
  access_type?: string;
  estimated_duration?: string;
  prerequisites?: any[];
  target_skills?: any[];
  completion_certificate?: any;
  
  // Legacy course specific fields
  specifications?: any;
  course_grade?: string;
  efforts_per_Week?: string;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  _legacy?: boolean;
  delivery_format?: string;
  delivery_type?: string;
}

// Filter and sort options
interface FilterOptions {
  status: string;
  type: string;
  category: string;
  instructor: string;
  level: string;
  language: string;
  priceRange: string;
}

interface SortOptions {
  field: keyof Course | 'enrollments' | 'revenue' | 'rating';
  direction: 'asc' | 'desc';
}

// Loading states
interface LoadingStates {
  courses: boolean;
  deleting: string | null;
  bulkAction: boolean;
  export: boolean;
  statusUpdate: string | null;
}

const ManageCoursesPage: React.FC = () => {
  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    type: "",
    category: "",
    instructor: "",
    level: "",
    language: "",
    priceRange: ""
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'updated_at',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    courses: false,
    deleting: null,
    bulkAction: false,
    export: false,
    statusUpdate: null
  });
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<CourseInstructor[]>([]);
  
  // Instructor Assignment Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState<boolean>(false);
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState<Course | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { deleteQuery } = useDeleteQuery();

  // Fetch courses using the efficient /courses/get endpoint
  const fetchCourses = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, courses: true }));
    setError(null);
    
    try {
      console.log("🚀 Loading all courses from /courses/get endpoint...");
      
      // Import the getAllCourses function and make the API call
      const { getAllCourses } = await import("@/apis/course/course");
      const { apiClient } = await import("@/apis/apiClient");
      
      const coursesUrl = getAllCourses();
      console.log("📋 Fetching from:", coursesUrl);
      
      const response = await apiClient.get(coursesUrl);
      console.log("📊 API response:", response);

      if (response?.data?.success && response.data.data && Array.isArray(response.data.data)) {
        const coursesData = response.data.data;
        
        // The getAllCourses API returns unified course data, so we can use it directly
        const processedCourses: Course[] = coursesData.map((course: any) => {
          return {
            ...course,
            // Ensure required fields have defaults
            _id: course._id || '',
            course_title: course.course_title || 'Untitled Course',
            course_category: course.course_category || 'Uncategorized',
            status: course.status || 'Draft',
            // Normalize date fields
            createdAt: course.createdAt || course.created_at,
            updatedAt: course.updatedAt || course.updated_at,
            created_at: course.created_at || course.createdAt,
            updated_at: course.updated_at || course.updatedAt,
            // Ensure prices is always an array
            prices: Array.isArray(course.prices) ? course.prices : [],
            // Set course_fee from first price if not set
            course_fee: course.course_fee || course.prices?.[0]?.individual || 0,
            // Ensure meta exists with defaults
            meta: course.meta || {
              enrollments: 0,
              views: 0,
              ratings: { average: 0, count: 0 }
            }
          } as Course;
        });
        
        // Extract categories and instructors for filters
        const uniqueCategories = [...new Set(processedCourses.map(course => course.course_category).filter(Boolean))];
        const uniqueInstructors: CourseInstructor[] = [];
        
        setCategories(uniqueCategories);
        setInstructors(uniqueInstructors);
        setCourses(processedCourses);
        
        console.log(`✅ Loaded ${processedCourses.length} courses successfully using /courses/get endpoint`);
        
        if (processedCourses.length === 0) {
          showToast.info('No courses found. Create your first course to get started.');
        } else {
          showToast.success(`Loaded ${processedCourses.length} courses successfully`);
        }
      } else {
        throw new Error("No courses data received from /courses/get endpoint");
      }
    } catch (error) {
      console.error("❌ Error loading courses:", error);
      setError('Failed to load courses. Please check your connection.');
      
      // Fallback: Try collaborative API if the main endpoint fails
      console.log("🔄 Attempting fallback to collaborative API...");
      try {
        const response = await courseTypesAPI.fetchCollaborative({
          source: 'both',
          merge_strategy: 'unified',
          page: 1,
          limit: 100,
          deduplicate: true,
          include_metadata: true
        });
        
        if (response?.data?.success && response.data.data) {
          const coursesData = Array.isArray(response.data.data) ? response.data.data : [];
          
          const processedCourses: Course[] = coursesData.map((course: any) => {
            return {
              ...course,
              _id: course._id || '',
              course_title: course.course_title || 'Untitled Course',
              course_category: course.course_category || 'Uncategorized',
              status: course.status || 'Draft',
              createdAt: course.createdAt || course.created_at,
              updatedAt: course.updatedAt || course.updated_at,
              created_at: course.created_at || course.createdAt,
              updated_at: course.updated_at || course.updatedAt,
              prices: Array.isArray(course.prices) ? course.prices : [],
              course_fee: course.course_fee || course.prices?.[0]?.individual || 0,
              meta: course.meta || {
                enrollments: 0,
                views: 0,
                ratings: { average: 0, count: 0 }
              }
            } as Course;
          });
          
          const uniqueCategories = [...new Set(processedCourses.map(course => course.course_category).filter(Boolean))];
          const uniqueInstructors: CourseInstructor[] = [];
          
          setCategories(uniqueCategories);
          setInstructors(uniqueInstructors);
          setCourses(processedCourses);
          
          showToast.warning(`Loaded ${processedCourses.length} courses using fallback method`);
        } else {
          throw new Error("Fallback API also failed");
        }
      } catch (fallbackError) {
        console.error("❌ Fallback loading also failed:", fallbackError);
        showToast.error('Failed to load courses. Please check your connection.');
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, courses: false }));
    }
  }, []);

  // Advanced search using the efficient /courses/get endpoint
  const performAdvancedSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      fetchCourses();
      return;
    }

    setIsSearching(true);
    try {
      console.log("🔍 Searching courses using /courses/get endpoint...");
      
      // Import the getAllCourses function and make the API call
      const { getAllCourses } = await import("@/apis/course/course");
      const { apiClient } = await import("@/apis/apiClient");
      
      const coursesUrl = getAllCourses();
      const response = await apiClient.get(coursesUrl);
      
      if (response?.data?.success && response.data.data && Array.isArray(response.data.data)) {
        const searchResults = response.data.data;
        
        // Process search results similar to fetchCourses
        const processedResults: Course[] = searchResults.map((course: any) => {
          return {
            ...course,
            // Ensure required fields have defaults
            _id: course._id || '',
            course_title: course.course_title || 'Untitled Course',
            course_category: course.course_category || 'Uncategorized',
            status: course.status || 'Draft',
            // Normalize date fields
            createdAt: course.createdAt || course.created_at,
            updatedAt: course.updatedAt || course.updated_at,
            created_at: course.created_at || course.createdAt,
            updated_at: course.updated_at || course.updatedAt,
            // Ensure prices is always an array
            prices: Array.isArray(course.prices) ? course.prices : [],
            // Set course_fee from first price if not set
            course_fee: course.course_fee || course.prices?.[0]?.individual || 0,
            // Ensure meta exists with defaults
            meta: course.meta || {
              enrollments: 0,
              views: 0,
              ratings: { average: 0, count: 0 }
            }
          } as Course;
        });

        // Filter results locally based on search query
        const filteredResults = processedResults.filter((course: any) => {
          const search = searchQuery.toLowerCase();
          return (
            course.course_title?.toLowerCase().includes(search) ||
            course.course_category?.toLowerCase().includes(search) ||
            course.course_subtitle?.toLowerCase().includes(search) ||
            course.course_description?.program_overview?.toLowerCase().includes(search) ||
            course.course_tag?.toLowerCase().includes(search)
          );
        });

        setCourses(filteredResults);
        
        console.log(`✅ Search completed: Found ${filteredResults.length} courses matching "${searchQuery}"`);
        showToast.success(`Found ${filteredResults.length} courses matching "${searchQuery}"`);
      } else {
        throw new Error("No search results received from /courses/get endpoint");
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      
      // Fallback to collaborative API for search
      try {
        console.log("🔄 Attempting search fallback to collaborative API...");
        const response = await courseTypesAPI.fetchCollaborative({
          source: 'both',
          merge_strategy: 'unified',
          page: 1,
          limit: 100,
          deduplicate: true,
          include_metadata: true
        });
        
        if (response?.data?.success && response.data.data) {
          const searchResults = Array.isArray(response.data.data) ? response.data.data : [];
          
          const processedResults: Course[] = searchResults.map((course: any) => {
            return {
              ...course,
              _id: course._id || '',
              course_title: course.course_title || 'Untitled Course',
              course_category: course.course_category || 'Uncategorized',
              status: course.status || 'Draft',
              createdAt: course.createdAt || course.created_at,
              updatedAt: course.updatedAt || course.updated_at,
              created_at: course.created_at || course.createdAt,
              updated_at: course.updated_at || course.updatedAt,
              prices: Array.isArray(course.prices) ? course.prices : [],
              course_fee: course.course_fee || course.prices?.[0]?.individual || 0,
              meta: course.meta || {
                enrollments: 0,
                views: 0,
                ratings: { average: 0, count: 0 }
              }
            } as Course;
          });

          const filteredResults = processedResults.filter((course: any) => {
            const search = searchQuery.toLowerCase();
            return (
              course.course_title?.toLowerCase().includes(search) ||
              course.course_category?.toLowerCase().includes(search) ||
              course.course_subtitle?.toLowerCase().includes(search) ||
              course.course_description?.program_overview?.toLowerCase().includes(search) ||
              course.course_tag?.toLowerCase().includes(search)
            );
          });

          setCourses(filteredResults);
          showToast.warning(`Found ${filteredResults.length} courses using fallback search`);
        }
      } catch (fallbackError) {
        console.error('❌ Search fallback also failed:', fallbackError);
        showToast.error('Search failed. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  }, [fetchCourses]);

  // Enhanced filtering and sorting
  const processedCourses = useMemo(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.course_title?.toLowerCase().includes(search) ||
        course.course_category?.toLowerCase().includes(search) ||
        course.course_subtitle?.toLowerCase().includes(search) ||
        course.assigned_instructor?.name?.toLowerCase().includes(search) ||
        course.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      
      switch (key) {
        case 'status':
          filtered = filtered.filter(course => {
            const courseStatus = typeof course.status === 'string' ? course.status.trim() : 'Draft';
            return courseStatus === value;
          });
          break;
        case 'type':
          filtered = filtered.filter(course => {
            const courseType = (course.course_type || course.category_type || course.course_tag || (course.isFree ? 'free' : 'premium'));
            const normalizedType = typeof courseType === 'string' 
              ? courseType.toLowerCase().trim() 
              : 'free';
            return normalizedType === value || normalizedType.includes(value);
          });
          break;
        case 'category':
          filtered = filtered.filter(course => course.course_category === value);
          break;
        case 'instructor':
          filtered = filtered.filter(course => course.assigned_instructor?._id === value);
          break;
        case 'level':
          filtered = filtered.filter(course => course.course_level === value);
          break;
        case 'language':
          filtered = filtered.filter(course => course.language === value);
          break;
        case 'priceRange':
          filtered = filtered.filter(course => {
            if (course.isFree) {
              return value === 'free';
            }
            
            // Try to get price from prices array first, then fallback to course_fee
            let fee = 0;
            if (course.prices && course.prices.length > 0) {
              const usdPrice = course.prices.find(p => p.currency === 'USD' && p.is_active);
              const firstActivePrice = course.prices.find(p => p.is_active);
              const selectedPrice = usdPrice || firstActivePrice;
              fee = selectedPrice ? selectedPrice.individual : 0;
            } else {
              fee = course.course_fee || 0;
            }
            
            switch (value) {
              case 'free': return fee === 0;
              case 'low': return fee > 0 && fee <= 1000;
              case 'medium': return fee > 1000 && fee <= 5000;
              case 'high': return fee > 5000;
              default: return true;
            }
          });
          break;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case 'enrollments':
          aValue = a.meta?.enrollments || 0;
          bValue = b.meta?.enrollments || 0;
          break;
        case 'revenue':
          aValue = a.meta?.revenue || 0;
          bValue = b.meta?.revenue || 0;
          break;
        case 'rating':
          aValue = a.meta?.ratings?.average || 0;
          bValue = b.meta?.ratings?.average || 0;
          break;
        default:
          aValue = a[sortOptions.field as keyof Course];
          bValue = b[sortOptions.field as keyof Course];
      }
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      const modifier = sortOptions.direction === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

    return filtered;
  }, [courses, searchTerm, filters, sortOptions]);

  // Pagination
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [processedCourses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedCourses.length / itemsPerPage);

  // Enhanced delete function
  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, deleting: courseId }));
    
    try {
      await deleteQuery({
        url: apiUrls.courses.deleteCourse(courseId),
        requireAuth: true,
        onSuccess: () => {
          showToast.success(`Course "${courseTitle}" deleted successfully!`);
          setCourses(prev => prev.filter(course => course._id !== courseId));
          setSelectedCourses(prev => {
            const newSet = new Set(prev);
            newSet.delete(courseId);
            return newSet;
          });
        },
        onFail: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to delete course';
          showToast.error(errorMessage);
        },
      });
    } catch (error) {
      console.error("Delete course error:", error);
      showToast.error('Failed to delete course');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // Bulk operations
  const handleBulkAction = async (action: 'delete' | 'archive' | 'publish') => {
    if (selectedCourses.size === 0) {
      showToast.warning('Please select courses first');
      return;
    }

    const courseIds = Array.from(selectedCourses);
    const actionText = action === 'delete' ? 'delete' : action;
    
    if (!confirm(`Are you sure you want to ${actionText} ${courseIds.length} course(s)?`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, bulkAction: true }));
    
    try {
      // Implement bulk operations based on your API
      for (const courseId of courseIds) {
        if (action === 'delete') {
          await deleteQuery({
            url: apiUrls.courses.deleteCourse(courseId),
            requireAuth: true,
            onSuccess: () => {},
            onFail: (error) => {
              console.error(`Failed to delete course ${courseId}:`, error);
            },
          });
        }
        // Add other bulk actions as needed
      }
      
      showToast.success(`Successfully ${actionText}ed ${courseIds.length} course(s)`);
      setSelectedCourses(new Set());
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error("Bulk action error:", error);
      showToast.error(`Failed to ${actionText} courses`);
    } finally {
      setLoadingStates(prev => ({ ...prev, bulkAction: false }));
    }
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedCourses.size === paginatedCourses.length) {
      setSelectedCourses(new Set());
    } else {
      setSelectedCourses(new Set(paginatedCourses.map(course => course._id)));
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  // Instructor Assignment Functions
  const handleAssignInstructor = (course: Course): void => {
    setSelectedCourseForAssignment(course);
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentModalClose = (): void => {
    setIsAssignmentModalOpen(false);
    setSelectedCourseForAssignment(null);
  };

  const handleAssignmentSuccess = (): void => {
    // Refresh the course list after successful assignment
    fetchCourses();
  };

  // Enhanced badge components
  const getStatusBadge = (status: any) => {
    const statusConfig = {
      'Published': { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-400' },
      'Draft': { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'dark:bg-gray-900/30', darkText: 'dark:text-gray-400' },
      'Archived': { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
      'Active': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
      'Upcoming': { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' }
    };

    const safeStatus = typeof status === 'string' && status.trim().length > 0 ? status.trim() : 'Draft';
    const config = statusConfig[safeStatus as keyof typeof statusConfig] || statusConfig.Draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}>
        {safeStatus}
      </span>
    );
  };

  const getTypeBadge = (course: Course) => {
    const typeConfig = {
      'blended courses': { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' },
      'live courses': { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-400' },
      'live': { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-400' },
      'pre-recorded': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
      'paid': { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900/30', darkText: 'dark:text-yellow-400' },
      'free': { bg: 'bg-emerald-100', text: 'text-emerald-800', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' }
    };

    // Determine the course type from multiple possible fields
    let courseType = course.course_tag || course.category_type || course.course_type;
    
    // If no explicit type, determine based on pricing
    if (!courseType) {
      courseType = course.isFree ? 'free' : 'paid';
    }

    const safeType = typeof courseType === 'string' && courseType.trim().length > 0 
      ? courseType.toLowerCase().trim() 
      : 'free';
    
    // Clean up the display type
    let displayType = courseType || 'Free';
    if (typeof displayType === 'string') {
      displayType = displayType.charAt(0).toUpperCase() + displayType.slice(1);
    }

    const config = typeConfig[safeType as keyof typeof typeConfig] || typeConfig.free;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}>
        {displayType}
      </span>
    );
  };

  // Course statistics
  const courseStats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter(c => {
      const status = typeof c.status === 'string' ? c.status.trim() : 'Draft';
      return status === 'Published';
    }).length;
    const draft = courses.filter(c => {
      const status = typeof c.status === 'string' ? c.status.trim() : 'Draft';
      return status === 'Draft';
    }).length;
    const totalEnrollments = courses.reduce((sum, course) => sum + (course.meta?.enrollments || 0), 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.meta?.revenue || 0), 0);
    const avgRating = courses.reduce((sum, course, _, arr) => {
      const rating = course.meta?.ratings?.average || 0;
      return sum + (rating / arr.length);
    }, 0);

    return { total, published, draft, totalEnrollments, totalRevenue, avgRating };
  }, [courses]);

  // Load courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortOptions]);

  // Course card component for grid view
  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden group"
    >
      {/* Course Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {course.course_image ? (
          <img
            src={course.course_image}
            alt={course.course_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Selection checkbox */}
        <button
          onClick={() => handleSelectCourse(course._id)}
          className="absolute top-3 left-3 p-1 rounded-md bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          {selectedCourses.has(course._id) ? (
            <CheckSquare className="h-4 w-4 text-blue-600" />
          ) : (
            <Square className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(course.status)}
        </div>
      </div>

      {/* Course content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {course.course_title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {course.course_category}
            </p>
          </div>
          {getTypeBadge(course)}
        </div>

        {/* Course metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.meta?.enrollments || 0}
            </span>
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              {course.meta?.ratings?.average?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            {course.isFree ? 'Free' : (() => {
              // Find the USD price or fallback to the first active price
              const usdPrice = course.prices?.find(p => p.currency === 'USD' && p.is_active);
              const firstActivePrice = course.prices?.find(p => p.is_active);
              const fallbackPrice = usdPrice || firstActivePrice;
              
              if (fallbackPrice) {
                const symbol = fallbackPrice.currency === 'USD' ? '$' : 
                             fallbackPrice.currency === 'EUR' ? '€' : 
                             fallbackPrice.currency === 'GBP' ? '£' : 
                             fallbackPrice.currency;
                return `${symbol}${fallbackPrice.individual}`;
              }
              return `$${course.course_fee || 0}`;
            })()}
          </span>
        </div>

        {/* Instructor */}
        {course.assigned_instructor && (
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
              {course.assigned_instructor.avatar ? (
                <img
                  src={course.assigned_instructor.avatar}
                  alt={course.assigned_instructor.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {course.assigned_instructor.name}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Link
              href={`/course-details/${course._id}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Course"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              href={`/dashboards/admin/courses/edit/${course._id}`}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Edit Course"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleAssignInstructor(course)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Assign Instructor"
            >
              <User className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteCourse(course._id, course.course_title)}
              disabled={loadingStates.deleting === course._id}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Delete Course"
            >
              {loadingStates.deleting === course._id ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
          
          <span className="text-xs text-gray-400">
            {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : 'No date'}
          </span>
        </div>
      </div>
    </motion.div>
  );

  // Filter panel component
  const FilterPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="live">Live Courses</option>
                <option value="pre-recorded">Pre-Recorded</option>
                <option value="blended">Blended Courses</option>
                <option value="paid">Paid</option>
                <option value="free">Free</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="low">$1 - $1,000</option>
                <option value="medium">$1,001 - $5,000</option>
                <option value="high">$5,000+</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setFilters({
                status: "",
                type: "",
                category: "",
                instructor: "",
                level: "",
                language: "",
                priceRange: ""
              })}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loadingStates.courses && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboards/admin" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and organize all courses on your platform
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={() => fetchCourses()}
                disabled={loadingStates.courses}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingStates.courses ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/dashboards/admin/courses/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{courseStats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-green-600">{courseStats.published}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{courseStats.draft}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrollments</p>
                <p className="text-2xl font-bold text-purple-600">{courseStats.totalEnrollments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{courseStats.avgRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 ${isSearching ? 'animate-spin' : ''}`} />
              <input
                type="text"
                placeholder="Search courses using AI-powered search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Debounce search
                  const timeoutId = setTimeout(() => {
                    performAdvancedSearch(e.target.value);
                  }, 500);
                  return () => clearTimeout(timeoutId);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    performAdvancedSearch(searchTerm);
                  }
                }}
                disabled={isSearching}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchCourses();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  showFilters 
                    ? 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>

              <select
                value={`${sortOptions.field}-${sortOptions.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortOptions({ field: field as any, direction: direction as 'asc' | 'desc' });
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="updated_at-desc">Recently Updated</option>
                <option value="created_at-desc">Newest First</option>
                <option value="course_title-asc">Title A-Z</option>
                <option value="course_title-desc">Title Z-A</option>
                <option value="enrollments-desc">Most Popular</option>
                <option value="rating-desc">Highest Rated</option>
              </select>

              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  <div className="h-4 w-4 flex flex-col space-y-1">
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedCourses.size > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCourses.size} course(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  disabled={loadingStates.bulkAction}
                  className="px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg disabled:opacity-50"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  disabled={loadingStates.bulkAction}
                  className="px-3 py-1.5 text-sm text-orange-700 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40 rounded-lg disabled:opacity-50"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={loadingStates.bulkAction}
                  className="px-3 py-1.5 text-sm text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        <FilterPanel />

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Course Grid/Table */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <AnimatePresence>
              {paginatedCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          // Table view (simplified for now)
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={handleSelectAll}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {selectedCourses.size === paginatedCourses.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Enrollments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSelectCourse(course._id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {selectedCourses.has(course._id) ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {course.course_image ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={course.course_image}
                                alt={course.course_title}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.course_title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course.course_category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(course)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(course.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {course.meta?.enrollments || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{course.meta?.ratings?.average?.toFixed(1) || '0.0'}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">
                            ({course.meta?.ratings?.count || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/course-details/${course._id}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Course"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboards/admin/courses/edit/${course._id}`}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Edit Course"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleAssignInstructor(course)}
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Assign Instructor"
                          >
                            <User className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id, course.course_title)}
                            disabled={loadingStates.deleting === course._id}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            title="Delete Course"
                          >
                            {loadingStates.deleting === course._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {processedCourses.length === 0 && !loadingStates.courses && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || Object.values(filters).some(Boolean) ? 
                'Try adjusting your search or filters.' : 
                'Get started by creating your first course.'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(Boolean) && (
              <div className="mt-6">
                <Link
                  href="/dashboards/admin/courses/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-lg">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, processedCourses.length)}
                  </span>{' '}
                  of <span className="font-medium">{processedCourses.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Instructor Assignment Modal */}
        <InstructorAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={handleAssignmentModalClose}
          onSuccess={handleAssignmentSuccess}
          type="course"
          targetData={selectedCourseForAssignment}
          title="Assign Instructor to Course"
        />
      </div>
    </div>
  );
};

export default ManageCoursesPage;