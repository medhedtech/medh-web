"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Calendar, Clock, Star, Eye, Play, BookOpen, Users, User, FileText, Download, Folder, Video, Globe, Loader2, ChevronRight, Check } from "lucide-react";
import { getUserId, getAuthToken } from "@/utils/auth";
import materialsAPI, { IMaterial, IMaterialsResponse } from "@/apis/materials";
import { showToast } from "@/utils/toastManager";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import axios from "axios";

interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'assignment' | 'other';
  downloadUrl: string;
  viewUrl: string;
  course: string;
  instructor?: {
    name: string;
    rating: number;
  };
  size?: string;
  duration?: string;
  uploadDate?: string;
  downloads?: number;
  rating?: number;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

// Enhanced TabButton with count badges matching upcoming classes style
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center justify-center w-32 sm:w-40 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Enhanced Material Card Component
const MaterialCard = ({ 
  material, 
  onViewDetails 
}: { 
  material: CourseMaterial; 
  onViewDetails: (material: CourseMaterial) => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'resource':
        return <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'video':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'assignment':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'resource':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const handleDownload = async () => {
    if (!material.downloadUrl) {
      showToast('error', 'Download URL not available');
      return;
    }

    try {
      // Record the download
      await materialsAPI.recordMaterialDownload(material.id);

      // For video content, open in new tab
      if (material.type === 'video') {
        window.open(material.viewUrl || material.downloadUrl, '_blank');
        return;
      }

      // For other content, try to download
      const response = await fetch(material.downloadUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.title || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('success', 'Download started');
    } catch (error) {
      console.error('Download error:', error);
      showToast('error', 'Failed to download material');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Status stripe */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl mb-4 -mt-4 sm:-mt-5 md:-mt-6 -mx-4 sm:-mx-5 md:-mx-6"></div>
      
      <div className="flex items-start justify-between mb-4 gap-3 sm:gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
            {material?.title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {material?.course || "No course"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(material?.uploadDate)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {material?.duration || "Duration TBD"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          {getTypeIcon(material?.type)}
        </div>
      </div>
      
      {/* Type and Size */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {material?.type && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(material.type)}`}>
              {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
            </span>
          )}
          {material?.size && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
              {material.size}
            </span>
          )}
        </div>
      </div>

      {/* Rating and Downloads */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {material?.rating || material?.instructor?.rating || "4.5"}
          </span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Download className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {material?.downloads || 0} downloads
          </span>
        </div>
      </div>

      {/* Description */}
      {material?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {material.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(material)}
          className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          {material.type === 'video' ? 'Watch' : 'Download'}
        </button>
      </div>
    </div>
  );
};

const LessonCourseMaterialsMain: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allMaterials, setAllMaterials] = useState<CourseMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
  const [materialStats, setMaterialStats] = useState<IMaterialsResponse['data']['stats'] | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication first
        const token = getAuthToken();
        if (!token) {
          const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }

        try {
          // Fetch materials using the API
          const response = await materialsAPI.getEnrolledMaterials({
            type: currentTab === 0 ? undefined : 
                  currentTab === 1 ? 'document' :
                  currentTab === 2 ? 'video' :
                  currentTab === 3 ? 'assignment' : undefined,
            search: searchTerm || undefined
          });

          if (response.data?.data) {
            const { materials, stats } = response.data.data;
            
            // Transform API materials to component format
            const transformedMaterials: CourseMaterial[] = materials.map(m => ({
              id: m.id,
              title: m.title,
              description: m.description,
              type: m.type,
              downloadUrl: m.fileUrl,
              viewUrl: m.fileUrl,
              course: m.course.title,
              instructor: {
                name: m.createdBy.name,
                rating: 4.5 // Default rating if not provided
              },
              size: m.size?.toString(),
              duration: m.duration?.toString(),
              uploadDate: m.createdAt,
              downloads: m.downloadCount,
              rating: 4.5 // Default rating if not provided
            }));

            setAllMaterials(transformedMaterials);
            setMaterialStats(stats);
          } else {
            setError("No materials found in your enrolled courses.");
            setAllMaterials([]);
          }
        } catch (apiError) {
          // Handle API not available (404) by showing mock data
          if (axios.isAxiosError(apiError) && apiError.response?.status === 404) {
            console.log("Materials API not available, showing mock data");
            
            // Mock materials data for demonstration
            const mockMaterials: CourseMaterial[] = [
              {
                id: "mock-1",
                title: "Introduction to React Fundamentals",
                description: "Learn the basics of React including components, props, and state management.",
                type: "document",
                downloadUrl: "#",
                viewUrl: "#",
                course: "Web Development Bootcamp",
                instructor: {
                  name: "John Smith",
                  rating: 4.8
                },
                size: "2.5 MB",
                uploadDate: new Date().toISOString(),
                downloads: 45,
                rating: 4.7
              },
              {
                id: "mock-2",
                title: "JavaScript ES6+ Features Video Tutorial",
                description: "Comprehensive video covering modern JavaScript features and best practices.",
                type: "video",
                downloadUrl: "#",
                viewUrl: "#",
                course: "Advanced JavaScript Course",
                instructor: {
                  name: "Sarah Johnson",
                  rating: 4.9
                },
                duration: "45 minutes",
                uploadDate: new Date(Date.now() - 86400000).toISOString(),
                downloads: 123,
                rating: 4.8
              },
              {
                id: "mock-3",
                title: "React Hooks Assignment",
                description: "Practice assignment to implement various React hooks in a real project.",
                type: "assignment",
                downloadUrl: "#",
                viewUrl: "#",
                course: "React Advanced Concepts",
                instructor: {
                  name: "Mike Davis",
                  rating: 4.6
                },
                size: "1.2 MB",
                uploadDate: new Date(Date.now() - 172800000).toISOString(),
                downloads: 67,
                rating: 4.5
              }
            ];

            // Filter mock data based on current tab
            let filteredMockMaterials = mockMaterials;
            if (currentTab === 1) filteredMockMaterials = mockMaterials.filter(m => m.type === 'document');
            else if (currentTab === 2) filteredMockMaterials = mockMaterials.filter(m => m.type === 'video');
            else if (currentTab === 3) filteredMockMaterials = mockMaterials.filter(m => m.type === 'assignment');

            // Apply search filter
            if (searchTerm) {
              filteredMockMaterials = filteredMockMaterials.filter(material =>
                material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                material.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                material.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }

            setAllMaterials(filteredMockMaterials);
            setMaterialStats({
              total: mockMaterials.length,
              byType: {
                documents: mockMaterials.filter(m => m.type === 'document').length,
                videos: mockMaterials.filter(m => m.type === 'video').length,
                assignments: mockMaterials.filter(m => m.type === 'assignment').length,
                other: mockMaterials.filter(m => m.type === 'other').length
              }
            });
          } else {
            throw apiError; // Re-throw other errors
          }
        }
      } catch (err) {
        console.error("Error fetching materials:", err);
        
        // Handle authentication errors
        if (err instanceof Error) {
          if (err.message.includes('Authentication required') || 
              (axios.isAxiosError(err) && err.response?.status === 401)) {
            const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
          }
          setError(err.message);
        } else {
          setError("Failed to load materials. Please try again later.");
        }
        
        setAllMaterials([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, [currentTab, searchTerm, router, pathname, searchParams]);

  const handleViewDetails = (material: CourseMaterial) => {
    setSelectedMaterial(material);
  };

  const handleCloseModal = () => {
    setSelectedMaterial(null);
  };

  const getFilteredMaterials = () => {
    return allMaterials;
  };

  const filteredContent = getFilteredMaterials();

  // Use material stats from API response
  const tabCounts = {
    all: materialStats?.total || 0,
    documents: materialStats?.byType.documents || 0,
    videos: materialStats?.byType.videos || 0,
    assignments: materialStats?.byType.assignments || 0
  };

  const tabs = [
    { name: "All Materials", icon: BookOpen, count: tabCounts.all },
    { name: "Documents", icon: FileText, count: tabCounts.documents },
    { name: "Videos", icon: Video, count: tabCounts.videos },
    { name: "Assignments", icon: Folder, count: tabCounts.assignments }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 lg:p-8 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Enhanced Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row items-center justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl backdrop-blur-sm mb-4 sm:mb-0 sm:mr-4">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Course Materials
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                Access and manage your learning resources
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-lg mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
            {tabs.map((tab, idx) => {
              const TabIcon = tab.icon;
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                  count={tab.count}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading course materials...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <X className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Materials</h3>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredContent.length > 0 ? (
                filteredContent.map((material, index) => (
                  <motion.div
                    key={material.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MaterialCard
                      material={material}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No matching materials found" : "No course materials available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "You don't have any course materials yet. Check back later or contact your instructor."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enhanced Details Modal */}
        <AnimatePresence>
          {selectedMaterial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-lg w-full relative max-h-[85vh] overflow-y-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>

                <div className="pr-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedMaterial?.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedMaterial?.course}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMaterial?.instructor?.name || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedMaterial?.duration || "Duration TBD"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Upload Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedMaterial?.uploadDate ? new Date(selectedMaterial.uploadDate).toLocaleDateString() : "Not uploaded"}
                        </p>
                      </div>
                    </div>

                    {selectedMaterial?.size && (
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">File Size</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMaterial.size}</p>
                        </div>
                      </div>
                    )}

                    {selectedMaterial?.description && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMaterial.description}</p>
                        </div>
                      </div>
                    )}

                    {(!selectedMaterial?.description) && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No additional details available for this material.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                    >
                      Download Material
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LessonCourseMaterialsMain; 