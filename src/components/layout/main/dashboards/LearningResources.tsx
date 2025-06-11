"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  LucideBookOpen,
  LucideFileText,
  LucideVideo,
  LucideFile,
  LucideLink,
  LucideDownload,
  LucideBookmark,
  LucideChevronRight,
  LucideInfo,
  LucideSearch,
  LucideExternalLink,
  LucideFilter,
  LucideCode,
  LucideCalendar,
  LucideRefreshCw
} from "lucide-react";

// Component imports
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import EmptyState from "@/components/shared/others/EmptyState";
import TabNavigation from "@/components/shared/navigation/TabNavigation";
import SearchBar from "@/components/shared/inputs/SearchBar";
import Badge from "@/components/shared/elements/Badge";
import Button from "@/components/shared/buttons/Button";
import Select from "@/components/shared/inputs/Select";
import Card from "@/components/shared/containers/Card";
import Modal from "@/components/shared/modals/Modal";

// Default image for resources without images
import DefaultResourceImage from "@/assets/images/courses/image1.png";

// Types
interface Course {
  _id: string;
  course_title: string;
  course_image?: string;
  course_description?: string;
  sections?: Section[];
}

interface Section {
  _id: string;
  title: string;
  lessons?: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  type: string;
  video_url?: string;
  content_url?: string;
  duration?: string;
  resources?: LessonResource[];
}

interface LessonResource {
  _id: string;
  title: string;
  type: string;
  url: string;
}

interface Certificate {
  _id: string;
  course_title: string;
  certificate_url: string;
  issued_date: string;
  student_name: string;
}

interface Brochure {
  _id: string;
  title: string;
  description?: string;
  course_id: string;
  brochure_url: string;
  download_count: number;
  created_at: string;
}

interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'link' | 'code' | 'assignment' | 'certificate' | 'brochure';
  url: string;
  thumbnail?: string;
  course?: {
    _id: string;
    title: string;
  };
  category?: string;
  tags?: string[];
  dateAdded: string;
  fileSize?: string;
  duration?: string;
  author?: string;
  isBookmarked?: boolean;
  source: 'course' | 'certificate' | 'brochure' | 'assignment';
}

interface FilterState {
  type: string;
  category: string;
  searchTerm: string;
  source: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

/**
 * LearningResources - Component for displaying and accessing learning materials
 */
const LearningResources: React.FC = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  
  // State management
  const [resources, setResources] = useState<Resource[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Filter and search state
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    category: "all",
    searchTerm: "",
    source: "all"
  });
  
  // Resource type and categories for filter options
  const resourceTypes = ["all", "pdf", "video", "link", "code", "assignment", "certificate", "brochure"];
  const resourceSources = ["all", "course", "certificate", "brochure", "assignment"];
  const [categories, setCategories] = useState<string[]>(["all"]);
  
  // Fetch user ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);
  
  // API Functions
  const fetchEnrolledCoursesResources = async (studentId: string): Promise<Resource[]> => {
    try {
      const response = await getQuery({
        url: apiUrls.enrolledCourses.getEnrollmentsByStudent(studentId),
        showLoader: false
      });

      if (response?.data) {
        const courseResources: Resource[] = [];
        
        response.data.forEach((enrollment: any) => {
          const course = enrollment.course || enrollment;
          
          if (course.sections) {
            course.sections.forEach((section: Section) => {
              if (section.lessons) {
                section.lessons.forEach((lesson: Lesson) => {
                  // Add lesson as video resource
                  if (lesson.video_url) {
                    courseResources.push({
                      _id: `lesson_${lesson._id}`,
                      title: lesson.title,
                      description: `Lesson from ${course.course_title}`,
                      type: 'video',
                      url: lesson.video_url,
              course: {
                        _id: course._id,
                        title: course.course_title
                      },
                      category: 'Course Content',
                      tags: ['lesson', 'video'],
                      dateAdded: enrollment.enrolledAt || new Date().toISOString(),
                      duration: lesson.duration,
                      author: course.assigned_instructor || 'Instructor',
                      isBookmarked: false,
                      source: 'course'
                    });
                  }

                  // Add lesson resources
                  if (lesson.resources) {
                    lesson.resources.forEach((resource: LessonResource) => {
                      courseResources.push({
                        _id: `resource_${resource._id}`,
                        title: resource.title,
                        description: `Resource from ${lesson.title}`,
                        type: resource.type as any,
                        url: resource.url,
              course: {
                          _id: course._id,
                          title: course.course_title
                        },
                        category: 'Course Resources',
                        tags: ['resource', resource.type],
                        dateAdded: enrollment.enrolledAt || new Date().toISOString(),
                        author: course.assigned_instructor || 'Instructor',
                        isBookmarked: false,
                        source: 'course'
                      });
                    });
                  }
                });
              }
            });
          }
        });

        return courseResources;
      }
      return [];
    } catch (error) {
      console.error("Error fetching enrolled courses resources:", error);
      return [];
    }
  };

  const fetchCertificates = async (studentId: string): Promise<Resource[]> => {
    try {
      const response = await getQuery({
        url: `${apiUrls.certificate.getCertificatesByStudentId}?studentId=${studentId}`,
        showLoader: false
      });

      if (response?.certificates) {
        return response.certificates.map((cert: Certificate) => ({
          _id: `cert_${cert._id}`,
          title: `${cert.course_title} Certificate`,
          description: `Certificate for completing ${cert.course_title}`,
          type: 'certificate' as const,
          url: cert.certificate_url,
          category: 'Certificates',
          tags: ['certificate', 'achievement'],
          dateAdded: cert.issued_date,
          author: 'Medh Platform',
          isBookmarked: false,
          source: 'certificate' as const
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return [];
    }
  };

  const fetchBrochures = async (): Promise<Resource[]> => {
    try {
      const response = await getQuery({
        url: apiUrls.brouchers.getAllBrouchers(),
        showLoader: false
      });

      if (response?.brochures) {
        return response.brochures.map((brochure: Brochure) => ({
          _id: `brochure_${brochure._id}`,
          title: brochure.title,
          description: brochure.description || 'Course brochure with detailed information',
          type: 'brochure' as const,
          url: brochure.brochure_url,
          category: 'Brochures',
          tags: ['brochure', 'course-info'],
          dateAdded: brochure.created_at,
          author: 'Medh Platform',
          isBookmarked: false,
          source: 'brochure' as const
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching brochures:", error);
      return [];
    }
  };

  const fetchSavedCourses = async (studentId: string): Promise<Resource[]> => {
    try {
      const response = await getQuery({
        url: `${apiUrls.enrolledCourses.getSavedCourses}?studentId=${studentId}`,
        showLoader: false
      });

      if (response?.savedCourses) {
        return response.savedCourses.map((savedCourse: any) => ({
          _id: `saved_${savedCourse._id}`,
          title: `${savedCourse.course_title} (Saved)`,
          description: savedCourse.course_description || 'Saved course for future reference',
          type: 'link' as const,
          url: `/courses/${savedCourse._id}`,
          thumbnail: savedCourse.course_image,
          category: 'Saved Courses',
          tags: ['saved', 'course'],
          dateAdded: savedCourse.savedAt || new Date().toISOString(),
          author: savedCourse.assigned_instructor || 'Instructor',
          isBookmarked: true,
          source: 'course' as const
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching saved courses:", error);
      return [];
    }
  };

  // Fetch all resources data
  const fetchAllResources = async (studentId: string) => {
    setIsRefreshing(true);
    setErrorMessage("");
    
    try {
      const [
        courseResources,
        certificates,
        brochures,
        savedCourses
      ] = await Promise.all([
        fetchEnrolledCoursesResources(studentId),
        fetchCertificates(studentId),
        fetchBrochures(),
        fetchSavedCourses(studentId)
      ]);

      const allResources = [
        ...courseResources,
        ...certificates,
        ...brochures,
        ...savedCourses
      ];

      setResources(allResources);
        
        // Extract unique categories for filters
      const uniqueCategories = [...new Set(allResources.map(resource => resource.category || "Uncategorized"))];
        setCategories(["all", ...uniqueCategories]);
        
      } catch (error) {
      console.error("Error fetching resources:", error);
      setErrorMessage("Failed to load resources. Please try again later.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch resources data when userId is available
  useEffect(() => {
    if (userId) {
      fetchAllResources(userId);
    }
  }, [userId]);

  // Handle refresh
  const handleRefresh = () => {
    if (userId) {
      fetchAllResources(userId);
    }
  };
  
  // Format date with user-friendly formatting
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM do, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <LucideFileText className="w-6 h-6" />;
      case 'video':
        return <LucideVideo className="w-6 h-6" />;
      case 'link':
        return <LucideLink className="w-6 h-6" />;
      case 'code':
        return <LucideCode className="w-6 h-6" />;
      case 'assignment':
        return <LucideBookOpen className="w-6 h-6" />;
      case 'certificate':
        return <LucideFileText className="w-6 h-6" />;
      case 'brochure':
        return <LucideFile className="w-6 h-6" />;
      default:
        return <LucideFile className="w-6 h-6" />;
    }
  };
  
  // Get color based on resource type
  const getResourceColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case 'video':
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case 'link':
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case 'code':
        return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
      case 'assignment':
        return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case 'certificate':
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case 'brochure':
        return "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-700";
    }
  };
  
  // Get button text based on resource type
  const getActionText = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return "Download PDF";
      case 'video':
        return "Watch Video";
      case 'link':
        return "View Course";
      case 'code':
        return "View Code";
      case 'assignment':
        return "Start Assignment";
      case 'certificate':
        return "Download Certificate";
      case 'brochure':
        return "Download Brochure";
      default:
        return "Access Resource";
    }
  };
  
  // Apply filters to the resources
  const filteredResources = resources.filter((resource) => {
    // Apply type filter
    if (filters.type !== "all" && resource.type !== filters.type) {
      return false;
    }
    
    // Apply category filter
    if (filters.category !== "all" && resource.category !== filters.category) {
      return false;
    }

    // Apply source filter
    if (filters.source !== "all" && resource.source !== filters.source) {
      return false;
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        (resource.description || "").toLowerCase().includes(searchLower) ||
        (resource.author || "").toLowerCase().includes(searchLower) ||
        (resource.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Handle opening the resource details modal
  const handleViewDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDetailsModalOpen(true);
  };
  
  // Handle resource access
  const handleAccessResource = (resource: Resource) => {
    if (resource.type === 'link' && resource.url.startsWith('/')) {
      // Internal link - use router
      router.push(resource.url);
    } else {
      // External link or file - open in new tab
      window.open(resource.url, "_blank");
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "all") {
      handleFilterChange("type", tab);
    } else {
      handleFilterChange("type", "all");
    }
  };
  
  // Toggle bookmark
  const handleToggleBookmark = async (resourceId: string) => {
    try {
      // Update local state optimistically
      setResources(resources.map(resource => 
        resource._id === resourceId 
          ? { ...resource, isBookmarked: !resource.isBookmarked } 
          : resource
      ));

      // In real implementation, make API call to save bookmark preference
      // await getQuery({
      //   url: apiUrls.bookmarks.toggle,
      //   method: 'POST',
      //   data: { resourceId, userId }
      // });
      
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // Revert the optimistic update on error
    setResources(resources.map(resource => 
      resource._id === resourceId 
        ? { ...resource, isBookmarked: !resource.isBookmarked } 
        : resource
    ));
    }
  };
  
  // Render a resource card
  const renderResourceCard = (resource: Resource) => {
    const iconColor = getResourceColor(resource.type);
    
    return (
      <motion.div
        key={resource._id}
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="relative p-5">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${iconColor}`}>
              {getResourceIcon(resource.type)}
            </div>
            
            <button
              onClick={() => handleToggleBookmark(resource._id)}
              className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors"
              aria-label={resource.isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <LucideBookmark 
                className="w-5 h-5" 
                fill={resource.isBookmarked ? "currentColor" : "none"} 
              />
            </button>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
            {resource.title}
          </h3>
          
          {resource.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {resource.description}
            </p>
          )}
          
          <div className="space-y-2 mb-4">
            {resource.course && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LucideBookOpen className="w-4 h-4 mr-2 text-primary-500" />
                <span className="truncate">{resource.course.title}</span>
              </div>
            )}
            
            {resource.author && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LucideInfo className="w-4 h-4 mr-2 text-primary-500" />
                <span>By {resource.author}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideCalendar className="w-4 h-4 mr-2 text-primary-500" />
              <span>Added on {formatDate(resource.dateAdded)}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
            {resource.fileSize && (
                <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md">
                <LucideFile className="w-3 h-3 mr-1" />
                {resource.fileSize}
              </div>
            )}
            
            {resource.duration && (
                <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md">
                <LucideVideo className="w-3 h-3 mr-1" />
                {resource.duration}
              </div>
            )}

              <div className="inline-flex items-center text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-md">
                {resource.source}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleViewDetails(resource)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              View Details
            </button>
            
            <button
              onClick={() => handleAccessResource(resource)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {getActionText(resource.type)}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
            Access all your learning materials, certificates, courses, and more in one place.
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
        >
          <LucideRefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {/* Tabs and Filter Labels Row */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-2">
        <div className="flex-1">
        <TabNavigation
          tabs={[
            { id: "all", label: "All Resources" },
            { id: "video", label: "Videos" },
              { id: "pdf", label: "Documents" },
              { id: "certificate", label: "Certificates" },
              { id: "brochure", label: "Brochures" },
              { id: "link", label: "Courses" }
          ]}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="min-w-0 flex-shrink-0 lg:w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
          </div>
          
          <div className="min-w-0 flex-shrink-0 lg:w-40">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source
            </label>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Dropdowns Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search resources..."
            value={filters.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("searchTerm", e.target.value)}
            onClear={() => handleFilterChange("searchTerm", "")}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="min-w-0 flex-shrink-0">
          <Select
              label=""
            options={categories.map(cat => ({ value: cat, label: cat === "all" ? "All Categories" : cat }))}
            value={filters.category}
            onChange={(value: string) => handleFilterChange("category", value)}
              className="w-full sm:w-48"
            />
          </div>
          
          <div className="min-w-0 flex-shrink-0">
            <Select
              label=""
              options={resourceSources.map(source => ({ value: source, label: source === "all" ? "All Sources" : source.charAt(0).toUpperCase() + source.slice(1) }))}
              value={filters.source}
              onChange={(value: string) => handleFilterChange("source", value)}
            className="w-full sm:w-40"
          />
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <p className="flex items-center">
            <LucideInfo className="w-5 h-5 mr-2" />
            {errorMessage}
          </p>
        </div>
      )}
      
      {/* Resources Grid */}
      {loading || isRefreshing ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingIndicator type="spinner" size="lg" color="primary" text="Loading resources..." />
        </div>
      ) : filteredResources.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredResources.map(renderResourceCard)}
        </motion.div>
      ) : (
        <EmptyState
          icon={<LucideSearch size={48} />}
          title={errorMessage ? "Failed to load resources" : "No resources found"}
          description={
            errorMessage 
              ? "Please try refreshing the page or check your internet connection."
              : activeTab === "all" 
                ? "No learning resources are available yet. Start by enrolling in a course!"
                : `No ${activeTab} resources available.`
          }
          action={{
            label: errorMessage ? "Try Again" : "Clear filters",
            onClick: errorMessage ? handleRefresh : () => {
              setActiveTab("all");
              setFilters({
                type: "all",
                category: "all",
                searchTerm: "",
                source: "all"
              });
            }
          }}
        />
      )}
      
      {/* Resource Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedResource && (
          <Modal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title="Resource Details"
            size="lg"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-lg ${getResourceColor(selectedResource.type)}`}>
                  {getResourceIcon(selectedResource.type)}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {selectedResource.title}
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="uppercase font-medium mr-2 px-2.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                      {selectedResource.type}
                    </span>
                    {selectedResource.category && (
                      <span className="ml-2">{selectedResource.category}</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggleBookmark(selectedResource._id)}
                  className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors p-2"
                  aria-label={selectedResource.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <LucideBookmark 
                    className="w-6 h-6" 
                    fill={selectedResource.isBookmarked ? "currentColor" : "none"} 
                  />
                </button>
              </div>
              
              {selectedResource.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedResource.description}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                {selectedResource.course && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideBookOpen className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Course: {selectedResource.course.title}</span>
                  </div>
                )}
                
                {selectedResource.author && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideInfo className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Author: {selectedResource.author}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <LucideCalendar className="w-5 h-5 mr-3 text-primary-500" />
                  <span>Added: {formatDate(selectedResource.dateAdded)}</span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <LucideInfo className="w-5 h-5 mr-3 text-primary-500" />
                  <span>Source: <span className="capitalize">{selectedResource.source}</span></span>
                </div>
                
                {selectedResource.fileSize && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideFile className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Size: {selectedResource.fileSize}</span>
                  </div>
                )}
                
                {selectedResource.duration && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideVideo className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Duration: {selectedResource.duration}</span>
                  </div>
                )}
              </div>
              
              {selectedResource.tags && selectedResource.tags.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-primary-50 text-primary-700 dark:bg-primary-900/10 dark:text-primary-300 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="secondary"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleAccessResource(selectedResource)}
                >
                  {getActionText(selectedResource.type)}
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningResources; 