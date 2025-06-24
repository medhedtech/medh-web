"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Youtube, 
  Play, 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  Star,
  BookOpen,
  ArrowLeft,
  Grid3X3,
  List,
  Tag,
  User,
  Calendar,
  ExternalLink,
  TrendingUp,
  Award,
  CheckCircle,
  PlayCircle,
  Video,
  Monitor,
  Smartphone,
  Download,
  Share2,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Volume2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { buildAdvancedComponent, getResponsive, typography, layoutPatterns } from "@/utils/designSystem";

// Types
interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  course: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  views: number;
  likes: number;
  rating: number;
  publishedDate: string;
  instructor: string;
  tags: string[];
  thumbnail: string;
  videoUrl: string;
  isPremium: boolean;
  isWatched?: boolean;
  progress?: number; // Progress percentage for partially watched videos
  quality: 'HD' | 'FHD' | '4K';
  language: string;
  subtitles: string[];
  downloadable: boolean;
}

interface FilterOptions {
  search: string;
  category: string;
  difficulty: string;
  course: string;
  quality: string;
  language: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
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

// Video tutorials data will be fetched from API
const videoTutorials: VideoTutorial[] = [];

const categories = ["All", "Lectures", "Tutorials", "Demos", "Workshops", "Webinars"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
const courses = ["All", "AI & Data Science", "Digital Marketing", "Vedic Mathematics", "Personality Development"];
const qualities = ["All", "HD", "FHD", "4K"];
const languages = ["All", "English", "Hindi", "Multilingual"];

const VideoTutorialsContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'All',
    difficulty: 'All',
    course: 'All',
    quality: 'All',
    language: 'All'
  });
  const [filteredVideos, setFilteredVideos] = useState<VideoTutorial[]>(videoTutorials);

  // Filter videos based on current filters
  useEffect(() => {
    let filtered = videoTutorials.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           video.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesCategory = filters.category === 'All' || video.category === filters.category;
      const matchesDifficulty = filters.difficulty === 'All' || video.difficulty === filters.difficulty;
      const matchesCourse = filters.course === 'All' || video.course === filters.course;
      const matchesQuality = filters.quality === 'All' || video.quality === filters.quality;
      const matchesLanguage = filters.language === 'All' || video.language === filters.language;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesCourse && matchesQuality && matchesLanguage;
    });

    setFilteredVideos(filtered);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'HD': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'FHD': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case '4K': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const VideoCard: React.FC<{ video: VideoTutorial }> = ({ video }) => (
    <motion.div
      variants={itemVariants}
      className={buildAdvancedComponent.glassCard({ variant: 'primary', hover: true, padding: 'mobile' })}
    >
      {/* Thumbnail with Play Button Overlay */}
      <div className="relative h-40 mb-4 rounded-lg overflow-hidden group cursor-pointer">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors">
            <Play className="w-6 h-6 ml-1" />
          </div>
        </div>
        
        {/* Video Duration */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          {video.duration}
        </div>
        
        {/* Quality Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(video.quality)}`}>
            {video.quality}
          </span>
        </div>

        {/* Premium Badge */}
        {video.isPremium && (
          <div className="absolute top-2 right-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Premium
            </span>
          </div>
        )}

        {/* Progress Bar for Watched Videos */}
        {video.progress && video.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
            <div 
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${video.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {video.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {video.course}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {video.instructor}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {video.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {video.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
              +{video.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {formatNumber(video.likes)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              {video.rating}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
            {video.difficulty}
          </span>
        </div>

        {/* Language and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            {video.language}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(video.publishedDate).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Watch Now
          </button>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          {video.downloadable && (
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const VideoListItem: React.FC<{ video: VideoTutorial }> = ({ video }) => (
    <motion.div
      variants={itemVariants}
      className={`${buildAdvancedComponent.glassCard({ variant: 'primary', hover: true, padding: 'mobile' })} flex gap-4`}
    >
      {/* Thumbnail */}
      <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden group cursor-pointer">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="128px"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors">
            <Play className="w-4 h-4 ml-0.5" />
          </div>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
          {video.duration}
        </div>
        
        {/* Quality Badge */}
        <div className="absolute top-1 left-1">
          <span className={`px-1 py-0.5 rounded text-xs font-medium ${getQualityColor(video.quality)}`}>
            {video.quality}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {video.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
              {video.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {video.course}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {video.instructor}
              </span>
              <span className="flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                {video.language}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                {video.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Star className="w-3 h-3 text-yellow-500" />
                {video.rating}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatNumber(video.views)} views
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatNumber(video.likes)} likes
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              <Play className="w-4 h-4" />
              Watch
            </button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'tablet' }) + " mb-6"}>
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/dashboards/student/resources"
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
              <Youtube className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className={typography.h1}>Video Tutorials</h1>
              <p className={typography.body}>
                Comprehensive video lessons and tutorials to enhance your learning experience
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Free Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Premium Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Watched</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'mobile' }) + " mb-6"}>
          <div className="space-y-4">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search video tutorials..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course
                </label>
                <select
                  value={filters.course}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quality
                </label>
                <select
                  value={filters.quality}
                  onChange={(e) => handleFilterChange('quality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {qualities.map(quality => (
                    <option key={quality} value={quality}>{quality}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={typography.h3}>
              Video Tutorials ({filteredVideos.length})
            </h2>
          </div>

          <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop' }) + " text-center py-12"}>
            <Youtube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Video Tutorials Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Video tutorials will appear here once they are uploaded by instructors. Check back later or contact support for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/dashboards/student/resources"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Browse Other Resources
              </Link>
              <Link 
                href="/contact-us"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VideoTutorialsContent; 