"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, FileText, Video, Image, File, Download, Eye, Calendar, Clock, Star, X } from "lucide-react";
import { toast } from "react-toastify";

interface CourseMaterial {
  id: string;
  title: string;
  course?: string;
  type?: 'video' | 'document' | 'image' | 'assignment';
  duration?: string;
  size?: string;
  uploadDate?: string;
  downloads?: number;
  rating?: number;
  description?: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Updated TabButton with blog-style filter button styling
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
        : 'glass-stats text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 animate-gradient-x"></div>
    )}
    
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
  </motion.button>
);

// Material Card Component - matching demo classes style
const MaterialCard = ({ material, onViewDetails }: { material: CourseMaterial; onViewDetails: (material: CourseMaterial) => void }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not uploaded";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "document":
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "image":
        return <Image className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "assignment":
        return <File className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "video":
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case "document":
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case "image":
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case "assignment":
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
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
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          {getTypeIcon(material?.type)}
        </div>
        </div>
      
      {/* Type and Size */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {material?.type && (
            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(material.type)}`}>
              {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
            </span>
          )}
          {material?.size && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
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
            {material?.rating || "4.5"}
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
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </button>
        <button
          className="flex-1 flex items-center justify-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

const LessonCourseMaterialsMain: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allMaterials, setAllMaterials] = useState<CourseMaterial[]>([]);
  const [documents, setDocuments] = useState<CourseMaterial[]>([]);
  const [videos, setVideos] = useState<CourseMaterial[]>([]);
  const [assignments, setAssignments] = useState<CourseMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API calls
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - will be replaced with real API data
        setAllMaterials([]);
        setDocuments([]);
        setVideos([]);
        setAssignments([]);
        
      } catch (err) {
        console.error("Error fetching course materials:", err);
        setError("Failed to load course materials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseMaterials();
  }, []);

  const tabs = [
    { name: "All Materials", content: allMaterials },
    { name: "Documents", content: documents },
    { name: "Videos", content: videos },
    { name: "Assignments", content: assignments },
  ];

  const handleViewDetails = (material: CourseMaterial) => {
    setSelectedMaterial(material);
  };

  const handleCloseModal = () => {
    setSelectedMaterial(null);
  };

  const filteredContent = tabs[currentTab].content.filter(material => 
    material?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <BookOpen className="w-8 h-8 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400 text-lg">Loading your course materials...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <BookOpen className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Error Loading Course Materials</h3>
          <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 lg:p-12 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
      <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm mr-3">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Lesson Course Materials
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            Access and download course materials, resources, and study guides for your enrolled courses
          </p>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-md mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
              <input
                type="text"
              placeholder="Search course materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              />
          </motion.div>
            </div>
            
        {/* Tabs - in a box container */}
        <div className="flex justify-center">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                  <span className="relative z-10 font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
                className="col-span-full flex flex-col items-center justify-center text-center py-12"
              >
                <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? "No course materials found" : "No course materials available"}
              </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? "Try adjusting your search term to find what you're looking for."
                    : "Course materials will appear here when available."}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Details Modal */}
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
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Material Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedMaterial?.title}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Course</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMaterial?.course}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Upload Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedMaterial?.uploadDate ? new Date(selectedMaterial.uploadDate).toLocaleDateString() : "Not uploaded"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedMaterial?.duration || "Duration TBD"}
                      </p>
                    </div>
                  </div>

                  {selectedMaterial?.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 mt-0.5" />
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
        </motion.div>
      </motion.div>
          )}
        </AnimatePresence>
    </div>
    </motion.div>
  );
};

export default LessonCourseMaterialsMain; 