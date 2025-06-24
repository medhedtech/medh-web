"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Play, 
  Search, 
  Clock, 
  CheckCircle, 
  Star,
  BookOpen,
  ArrowLeft,
  Grid3X3,
  List,
  User,
  Calendar,
  TrendingUp,
  Award,
  Brain,
  Code,
  FileText,
  Calculator,
  Lightbulb,
  Timer,
  Trophy,
  BarChart3,
  Zap,
  RefreshCw,
  Eye,
  Download,
  Share2,
  Bookmark,
  ChevronRight,
  PlayCircle,
  PenTool,
  Puzzle,
  Filter
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { buildAdvancedComponent, typography, layoutPatterns } from "@/utils/designSystem";

// Types
interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  course: string;
  category: string;
  type: 'Quiz' | 'Coding' | 'Assignment' | 'Project' | 'Problem Set' | 'Interactive';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  totalQuestions?: number;
  maxScore: number;
  attempts: number;
  bestScore?: number;
  lastAttempt?: string;
  isCompleted: boolean;
  tags: string[];
  skills: string[];
  prerequisites: string[];
  dueDate?: string;
  isTimeLimited: boolean;
  timeLimit?: string;
  instructor: string;
  createdDate: string;
  popularity: number;
  averageScore: number;
  totalAttempts: number;
  isPremium: boolean;
  hasHints: boolean;
  hasSolutions: boolean;
  isInteractive: boolean;
  thumbnail?: string;
}

interface FilterOptions {
  search: string;
  category: string;
  type: string;
  difficulty: string;
  course: string;
  status: string;
  timeRange: string;
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

// Practice exercises data will be fetched from API
const practiceExercises: PracticeExercise[] = [];

const categories = ["All", "Fundamentals", "Advanced Topics", "Real-world Projects", "Assessments", "Mock Tests"];
const types = ["All", "Quiz", "Coding", "Assignment", "Project", "Problem Set", "Interactive"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
const courses = ["All", "AI & Data Science", "Digital Marketing", "Vedic Mathematics", "Personality Development"];
const statuses = ["All", "Not Started", "In Progress", "Completed", "Overdue"];
const timeRanges = ["All", "Quick (< 30 min)", "Medium (30-60 min)", "Long (1-2 hrs)", "Extended (2+ hrs)"];

const PracticeExercisesContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'All',
    type: 'All',
    difficulty: 'All',
    course: 'All',
    status: 'All',
    timeRange: 'All'
  });
  const [filteredExercises, setFilteredExercises] = useState<PracticeExercise[]>(practiceExercises);

  // Filter exercises based on current filters
  useEffect(() => {
    let filtered = practiceExercises.filter(exercise => {
      const matchesSearch = exercise.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           exercise.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase())) ||
                           exercise.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesCategory = filters.category === 'All' || exercise.category === filters.category;
      const matchesType = filters.type === 'All' || exercise.type === filters.type;
      const matchesDifficulty = filters.difficulty === 'All' || exercise.difficulty === filters.difficulty;
      const matchesCourse = filters.course === 'All' || exercise.course === filters.course;
      
      let matchesStatus = true;
      if (filters.status === 'Not Started') matchesStatus = exercise.attempts === 0;
      else if (filters.status === 'In Progress') matchesStatus = exercise.attempts > 0 && !exercise.isCompleted;
      else if (filters.status === 'Completed') matchesStatus = exercise.isCompleted;
      else if (filters.status === 'Overdue') matchesStatus = exercise.dueDate && new Date(exercise.dueDate) < new Date() && !exercise.isCompleted;
      
      let matchesTimeRange = true;
      if (filters.timeRange !== 'All') {
        const time = parseInt(exercise.estimatedTime);
        if (filters.timeRange === 'Quick (< 30 min)') matchesTimeRange = time < 30;
        else if (filters.timeRange === 'Medium (30-60 min)') matchesTimeRange = time >= 30 && time <= 60;
        else if (filters.timeRange === 'Long (1-2 hrs)') matchesTimeRange = time > 60 && time <= 120;
        else if (filters.timeRange === 'Extended (2+ hrs)') matchesTimeRange = time > 120;
      }
      
      return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesCourse && matchesStatus && matchesTimeRange;
    });

    setFilteredExercises(filtered);
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Quiz': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Coding': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Assignment': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Project': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
      case 'Problem Set': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400';
      case 'Interactive': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Quiz': return <Brain className="w-4 h-4" />;
      case 'Coding': return <Code className="w-4 h-4" />;
      case 'Assignment': return <FileText className="w-4 h-4" />;
      case 'Project': return <Lightbulb className="w-4 h-4" />;
      case 'Problem Set': return <Calculator className="w-4 h-4" />;
      case 'Interactive': return <Puzzle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatusColor = (exercise: PracticeExercise) => {
    if (exercise.isCompleted) return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    if (exercise.attempts > 0) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    if (exercise.dueDate && new Date(exercise.dueDate) < new Date()) return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getStatusText = (exercise: PracticeExercise) => {
    if (exercise.isCompleted) return 'Completed';
    if (exercise.attempts > 0) return 'In Progress';
    if (exercise.dueDate && new Date(exercise.dueDate) < new Date()) return 'Overdue';
    return 'Not Started';
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
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className={typography.h1}>Practice Exercises</h1>
              <p className={typography.body}>
                Interactive exercises and assessments to test and improve your skills
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Exercises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
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
                  placeholder="Search practice exercises..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
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
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {types.map(type => (
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
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
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
              Practice Exercises ({filteredExercises.length})
            </h2>
          </div>

          <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop' }) + " text-center py-12"}>
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Practice Exercises Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Practice exercises will appear here once they are created by instructors. Check back later or contact support for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/dashboards/student/resources"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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

export default PracticeExercisesContent; 