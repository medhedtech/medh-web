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
  LucideCalendar
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
interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: string; // pdf, video, link, etc.
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
}

interface ApiResponse {
  resources: Resource[];
}

interface FilterState {
  type: string;
  category: string;
  searchTerm: string;
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
  
  // Filter and search state
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    category: "all",
    searchTerm: ""
  });
  
  // Resource type and categories for filter options
  const resourceTypes = ["all", "pdf", "video", "link", "code", "assignment"];
  const [categories, setCategories] = useState<string[]>([]);
  
  // Fetch user ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);
  
  // Fetch resources data
  useEffect(() => {
    if (!userId) return;
    
    const fetchResources = async () => {
      try {
        // Mock data for development - replace with actual API call when available
        // This simulates the API response structure
        
        const mockData = {
          resources: [
            {
              _id: "1",
              title: "React Fundamentals PDF Guide",
              description: "A comprehensive guide to React fundamentals including hooks, state management, and component lifecycle.",
              type: "pdf",
              url: "https://example.com/resources/react-fundamentals.pdf",
              thumbnail: "/images/resources/react-guide.jpg",
              course: {
                _id: "course1",
                title: "React from Zero to Hero"
              },
              category: "Web Development",
              tags: ["react", "frontend", "javascript"],
              dateAdded: "2023-07-15T10:30:00Z",
              fileSize: "2.5 MB",
              author: "John Doe",
              isBookmarked: true
            },
            {
              _id: "2",
              title: "JavaScript ES6 Features Tutorial",
              description: "Video tutorial covering all the essential ES6 features for modern JavaScript development.",
              type: "video",
              url: "https://example.com/resources/es6-tutorial.mp4",
              thumbnail: "/images/resources/js-tutorial.jpg",
              course: {
                _id: "course2",
                title: "Advanced JavaScript"
              },
              category: "Programming",
              tags: ["javascript", "es6", "tutorial"],
              dateAdded: "2023-08-02T14:20:00Z",
              duration: "45 minutes",
              author: "Jane Smith",
              isBookmarked: false
            },
            {
              _id: "3",
              title: "UI/UX Design Principles Cheatsheet",
              description: "A single-page cheatsheet with essential UI/UX design principles and best practices.",
              type: "pdf",
              url: "https://example.com/resources/uiux-cheatsheet.pdf",
              course: {
                _id: "course3",
                title: "UI/UX Design Fundamentals"
              },
              category: "Design",
              tags: ["design", "ui", "ux", "cheatsheet"],
              dateAdded: "2023-06-10T09:15:00Z",
              fileSize: "1.2 MB",
              author: "Alex Johnson",
              isBookmarked: true
            },
            {
              _id: "4",
              title: "Node.js API Development Guide",
              description: "Learn how to build robust and scalable APIs with Node.js and Express.",
              type: "link",
              url: "https://example.com/guides/nodejs-api",
              thumbnail: "/images/resources/nodejs-api.jpg",
              course: {
                _id: "course4",
                title: "Node.js Backend Development"
              },
              category: "Web Development",
              tags: ["nodejs", "api", "backend"],
              dateAdded: "2023-08-13T16:45:00Z",
              author: "Mike Williams",
              isBookmarked: false
            },
            {
              _id: "5",
              title: "Python Data Science Cookbook",
              description: "A collection of Python code snippets and recipes for common data science tasks.",
              type: "code",
              url: "https://example.com/resources/python-data-science-code.zip",
              course: {
                _id: "course5",
                title: "Python Data Science"
              },
              category: "Data Science",
              tags: ["python", "data science", "code"],
              dateAdded: "2023-08-16T11:30:00Z",
              fileSize: "3.8 MB",
              author: "Sarah Miller",
              isBookmarked: false
            },
            {
              _id: "6",
              title: "Machine Learning Algorithms Assignment",
              description: "Practice implementing common machine learning algorithms from scratch.",
              type: "assignment",
              url: "https://example.com/assignments/ml-algorithms",
              course: {
                _id: "course5",
                title: "Python Data Science"
              },
              category: "Data Science",
              tags: ["machine learning", "algorithms", "assignment"],
              dateAdded: "2023-08-18T13:20:00Z",
              author: "Sarah Miller",
              isBookmarked: false
            }
          ]
        };
        
        // In real implementation, this would be replaced with:
        // getQuery({
        //   url: `${apiUrls?.resources?.getStudentResources(userId)}`,
        //   onSuccess: (res: ApiResponse) => {
        //     setResources(res.resources || []);
        //     setErrorMessage("");
        //   },
        //   onFail: (err) => {
        //     console.error("Error fetching resources:", err);
        //     setErrorMessage("Failed to load resources. Please try again later.");
        //   }
        // });
        
        // Using mock data
        setResources(mockData.resources);
        
        // Extract unique categories for filters
        const uniqueCategories = [...new Set(mockData.resources.map(resource => resource.category || "Uncategorized"))];
        setCategories(["all", ...uniqueCategories]);
        
        setErrorMessage("");
      } catch (error) {
        console.error("Error in resources fetch:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    };
    
    fetchResources();
  }, [userId]);
  
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
        return "Visit Resource";
      case 'code':
        return "View Code";
      case 'assignment':
        return "Start Assignment";
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
  const handleAccessResource = (url: string) => {
    window.open(url, "_blank");
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
  const handleToggleBookmark = (resourceId: string) => {
    // In a real implementation, you would make an API call here
    setResources(resources.map(resource => 
      resource._id === resourceId 
        ? { ...resource, isBookmarked: !resource.isBookmarked } 
        : resource
    ));
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
            
            {resource.fileSize && (
              <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md mt-1 mr-2">
                <LucideFile className="w-3 h-3 mr-1" />
                {resource.fileSize}
              </div>
            )}
            
            {resource.duration && (
              <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md mt-1">
                <LucideVideo className="w-3 h-3 mr-1" />
                {resource.duration}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleViewDetails(resource)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              View Details
            </button>
            
            <button
              onClick={() => handleAccessResource(resource.url)}
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Access all your learning materials, ebooks, videos, and more in one place.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <TabNavigation
          tabs={[
            { id: "all", label: "All Resources" },
            { id: "pdf", label: "PDF Documents" },
            { id: "video", label: "Videos" },
            { id: "link", label: "Web Resources" },
            { id: "code", label: "Code Samples" }
          ]}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search resources..."
            value={filters.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("searchTerm", e.target.value)}
            onClear={() => handleFilterChange("searchTerm", "")}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            label="Category"
            options={categories.map(cat => ({ value: cat, label: cat === "all" ? "All Categories" : cat }))}
            value={filters.category}
            onChange={(value: string) => handleFilterChange("category", value)}
            className="w-full sm:w-40"
          />
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
      {loading ? (
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
          title="No resources found"
          description={activeTab === "all" ? "There are no resources available." : `No ${activeTab} resources available.`}
          action={{
            label: "Clear filters",
            onClick: () => {
              setActiveTab("all");
              setFilters({
                type: "all",
                category: "all",
                searchTerm: ""
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
              
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleAccessResource(selectedResource.url)}
                  leftIcon={<LucideExternalLink size={18} />}
                >
                  {getActionText(selectedResource.type)}
                </Button>
                
                {selectedResource.type === "pdf" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    leftIcon={<LucideDownload size={18} />}
                    onClick={() => handleAccessResource(selectedResource.url)}
                  >
                    Download PDF
                  </Button>
                )}
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningResources; 