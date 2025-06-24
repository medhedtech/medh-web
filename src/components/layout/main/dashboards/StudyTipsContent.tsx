"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Lightbulb,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Star,
  BookOpen,
  ArrowLeft,
  Grid3X3,
  List,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  Bookmark,
  Share2,
  Brain,
  Target,
  Zap,
  Award,
  CheckCircle,
  Timer,
  Coffee,
  Moon,
  Sun,
  Headphones,
  PenTool,
  Book,
  Laptop,
  Heart,
  TrendingDown,
  AlertCircle,
  Info,
  ChevronRight,
  Play,
  Download,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { buildAdvancedComponent, getResponsive, typography, layoutPatterns } from "@/utils/designSystem";

// Types
interface StudyTip {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  views: number;
  likes: number;
  bookmarks: number;
  rating: number;
  author: string;
  publishedDate: string;
  lastUpdated: string;
  tags: string[];
  thumbnail?: string;
  isPopular: boolean;
  isTrending: boolean;
  isBookmarked?: boolean;
  isLiked?: boolean;
  relatedTips: string[];
  tipType: 'Quick Tip' | 'Deep Dive' | 'Strategy' | 'Technique' | 'Mindset' | 'Tools';
  effectiveness: number; // 1-5 scale
  applicableFor: string[];
  prerequisites: string[];
}

interface FilterOptions {
  search: string;
  category: string;
  difficulty: string;
  tipType: string;
  timeToRead: string;
  effectiveness: string;
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

// Study tips data will be fetched from API
const studyTips: StudyTip[] = [];

const categories = ["All", "Time Management", "Memory Techniques", "Note Taking", "Exam Preparation", "Focus & Concentration", "Study Environment", "Motivation", "Technology"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
const tipTypes = ["All", "Quick Tip", "Deep Dive", "Strategy", "Technique", "Mindset", "Tools"];
const timeRanges = ["All", "1-2 min", "3-5 min", "5-10 min", "10+ min"];
const effectivenessLevels = ["All", "Highly Effective (4-5★)", "Moderately Effective (3-4★)", "Basic (2-3★)"];

const StudyTipsContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'All',
    difficulty: 'All',
    tipType: 'All',
    timeToRead: 'All',
    effectiveness: 'All'
  });
  const [filteredTips, setFilteredTips] = useState<StudyTip[]>(studyTips);

  // Filter tips based on current filters
  useEffect(() => {
    let filtered = studyTips.filter(tip => {
      const matchesSearch = tip.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           tip.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           tip.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesCategory = filters.category === 'All' || tip.category === filters.category;
      const matchesDifficulty = filters.difficulty === 'All' || tip.difficulty === filters.difficulty;
      const matchesTipType = filters.tipType === 'All' || tip.tipType === filters.tipType;
      
      let matchesTimeRange = true;
      if (filters.timeToRead !== 'All') {
        const readTime = parseInt(tip.readTime);
        if (filters.timeToRead === '1-2 min') matchesTimeRange = readTime <= 2;
        else if (filters.timeToRead === '3-5 min') matchesTimeRange = readTime >= 3 && readTime <= 5;
        else if (filters.timeToRead === '5-10 min') matchesTimeRange = readTime >= 5 && readTime <= 10;
        else if (filters.timeToRead === '10+ min') matchesTimeRange = readTime > 10;
      }

      let matchesEffectiveness = true;
      if (filters.effectiveness !== 'All') {
        if (filters.effectiveness === 'Highly Effective (4-5★)') matchesEffectiveness = tip.effectiveness >= 4;
        else if (filters.effectiveness === 'Moderately Effective (3-4★)') matchesEffectiveness = tip.effectiveness >= 3 && tip.effectiveness < 4;
        else if (filters.effectiveness === 'Basic (2-3★)') matchesEffectiveness = tip.effectiveness >= 2 && tip.effectiveness < 3;
      }
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesTipType && matchesTimeRange && matchesEffectiveness;
    });

    setFilteredTips(filtered);
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

  const getTipTypeColor = (tipType: string) => {
    switch (tipType) {
      case 'Quick Tip': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Deep Dive': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Strategy': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Technique': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400';
      case 'Mindset': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400';
      case 'Tools': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTipTypeIcon = (tipType: string) => {
    switch (tipType) {
      case 'Quick Tip': return <Zap className="w-4 h-4" />;
      case 'Deep Dive': return <Brain className="w-4 h-4" />;
      case 'Strategy': return <Target className="w-4 h-4" />;
      case 'Technique': return <PenTool className="w-4 h-4" />;
      case 'Mindset': return <Heart className="w-4 h-4" />;
      case 'Tools': return <Laptop className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getEffectivenessStars = (effectiveness: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < effectiveness ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
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

  const TipCard: React.FC<{ tip: StudyTip }> = ({ tip }) => (
    <motion.div
      variants={itemVariants}
      className={buildAdvancedComponent.glassCard({ variant: 'primary', hover: true, padding: 'mobile' })}
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTipTypeColor(tip.tipType)}`}>
            {getTipTypeIcon(tip.tipType)}
            {tip.tipType}
          </span>
          {tip.isPopular && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded-full text-xs font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Popular
            </span>
          )}
          {tip.isTrending && (
            <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {getEffectivenessStars(tip.effectiveness)}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {tip.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {tip.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {tip.readTime} read
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {tip.category}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tip.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {tip.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
              +{tip.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(tip.views)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {formatNumber(tip.likes)}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              {formatNumber(tip.bookmarks)}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
            {tip.difficulty}
          </span>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {tip.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(tip.publishedDate).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Book className="w-4 h-4" />
            Read Tip
          </button>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const TipListItem: React.FC<{ tip: StudyTip }> = ({ tip }) => (
    <motion.div
      variants={itemVariants}
      className={`${buildAdvancedComponent.glassCard({ variant: 'primary', hover: true, padding: 'mobile' })} flex gap-4`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
        <Lightbulb className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                {tip.title}
              </h3>
              <div className="flex items-center gap-1">
                {getEffectivenessStars(tip.effectiveness)}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {tip.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {tip.readTime}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {tip.category}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {tip.author}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTipTypeColor(tip.tipType)}`}>
                {getTipTypeIcon(tip.tipType)}
                {tip.tipType}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                {tip.difficulty}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatNumber(tip.views)} views
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              <Book className="w-4 h-4" />
              Read
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
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <Lightbulb className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className={typography.h1}>Study Tips</h1>
              <p className={typography.body}>
                Expert advice and proven strategies to enhance your learning experience
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quick Tips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Deep Dives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bookmarked</div>
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
                  placeholder="Search study tips..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={filters.tipType}
                  onChange={(e) => handleFilterChange('tipType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  {tipTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Read Time
                </label>
                <select
                  value={filters.timeToRead}
                  onChange={(e) => handleFilterChange('timeToRead', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  {timeRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
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
              Study Tips ({filteredTips.length})
            </h2>
          </div>

          <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop' }) + " text-center py-12"}>
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Study Tips Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Study tips and learning strategies will appear here once they are published. Check back later or contact support for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/dashboards/student/resources"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
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

export default StudyTipsContent; 