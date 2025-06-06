"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import {
  BookOpen,
  Download,
  FileText,
  Video,
  Image,
  File,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Star,
  Folder,
  PlayCircle,
  FileText as FileIcon,
  ExternalLink
} from 'lucide-react';

/**
 * LessonCourseMaterialsMain - Component that displays the lesson course materials content
 * within the student dashboard layout
 */
const LessonCourseMaterialsMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "videos" | "documents" | "images" | "assignments">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Mock course materials data
  const courseMaterials = useMemo(() => [
    {
      id: 2,
      title: "SEO Best Practices Guide",
      type: "document",
      course: "Digital Marketing Fundamentals",
      duration: "15 min read",
      size: "2.5 MB",
      uploadDate: "2024-01-16",
      downloads: 890,
      rating: 4.9,
      thumbnail: "/images/materials/doc-thumb-1.jpg",
      description: "Comprehensive guide to search engine optimization techniques"
    },
    {
      id: 4,
      title: "UI Design Principles Infographic",
      type: "image",
      course: "UI/UX Design Principles",
      duration: "Quick view",
      size: "1.2 MB",
      uploadDate: "2024-02-10",
      downloads: 650,
      rating: 4.6,
      thumbnail: "/images/materials/img-thumb-1.jpg",
      description: "Visual guide to essential UI design principles and best practices"
    },
    {
      id: 5,
      title: "Project Management Assignment",
      type: "assignment",
      course: "Project Management Essentials",
      duration: "2 weeks",
      size: "500 KB",
      uploadDate: "2024-03-01",
      downloads: 320,
      rating: 4.5,
      thumbnail: "/images/materials/assignment-thumb-1.jpg",
      description: "Practical assignment on project planning and execution"
    },
    {
      id: 6,
      title: "Machine Learning Algorithms Cheat Sheet",
      type: "document",
      course: "Data Science with Python",
      duration: "10 min read",
      size: "1.8 MB",
      uploadDate: "2024-02-25",
      downloads: 1500,
      rating: 4.9,
      thumbnail: "/images/materials/doc-thumb-2.jpg",
      description: "Quick reference guide for common machine learning algorithms"
    }
  ], []);

  // Material stats
  const materialStats = useMemo(() => ({
    totalMaterials: courseMaterials.length,
    totalDownloads: courseMaterials.reduce((sum, material) => sum + material.downloads, 0),
    averageRating: (courseMaterials.reduce((sum, material) => sum + material.rating, 0) / courseMaterials.length).toFixed(1),
    totalSize: "1.2 GB"
  }), [courseMaterials]);

  // Filter materials based on category and search
  const filteredMaterials = useMemo(() => {
    let filtered = courseMaterials;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(material => material.type === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [courseMaterials, selectedCategory, searchTerm]);

  // Get icon for material type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "assignment":
        return <File className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "document":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "image":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "assignment":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Material Stats Component
  const MaterialStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{materialStats.totalMaterials}</div>
          <div className="text-primary-100 text-sm font-medium">Total Materials</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{materialStats.totalDownloads.toLocaleString()}</div>
          <div className="text-primary-100 text-sm font-medium">Total Downloads</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{materialStats.averageRating}</div>
          <div className="text-primary-100 text-sm font-medium">Avg. Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{materialStats.totalSize}</div>
          <div className="text-primary-100 text-sm font-medium">Total Size</div>
        </div>
      </div>
    </div>
  );

  // Material Card Component
  const MaterialCard = ({ material }: { material: any }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
              {getTypeIcon(material.type)}
              <span className="ml-1 capitalize">{material.type}</span>
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {material.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {material.course}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {material.description}
          </p>
        </div>
      </div>

      {/* Material Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {material.duration}
        </div>
        <div className="flex items-center">
          <Download className="w-3 h-3 mr-1" />
          {material.downloads} downloads
        </div>
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(material.uploadDate).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <File className="w-3 h-3 mr-1" />
          {material.size}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {material.rating}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </button>
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );

  // Material Preloader
  const MaterialPreloader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <MaterialPreloader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Lesson Course Materials
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Access and download course materials, resources, and study guides for your enrolled courses
          </p>
        </motion.div>



        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: "All", icon: Folder },
                { key: "documents", label: "Documents", icon: FileText },
                { key: "images", label: "Images", icon: Image },
                { key: "assignments", label: "Assignments", icon: File }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as any)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Materials Grid */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No materials found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LessonCourseMaterialsMain; 