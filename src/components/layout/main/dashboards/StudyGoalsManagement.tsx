"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Filter,
  Search,
  RefreshCw,
  BookOpen,
  GraduationCap,
  FileText,
  Code,
  Video,
  Users,
  TrendingUp,
  AlertCircle,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, addDays, parseISO, isAfter, isBefore } from 'date-fns';

// API imports
import { 
  apiUrls, 
  IGoal, 
  IGoalStats, 
  IGoalCreateInput, 
  IGoalUpdateInput,
  IGoalProgressUpdate,
  IGoalsResponse,
  IGoalStatsResponse,
  IGoalResponse,
  IGoalMilestone
} from '@/apis/index';
import useGetQuery from '@/hooks/getQuery.hook';
import usePostQuery from '@/hooks/postQuery.hook';
import useDeleteQuery from '@/hooks/deleteQuery.hook';

// Types and Interfaces
type TGoalCategory = 'course' | 'assignment' | 'exam' | 'project' | 'skill' | 'career' | 'personal';
type TGoalType = 'completion' | 'time' | 'grade' | 'count' | 'custom';
type TGoalPriority = 'low' | 'medium' | 'high' | 'urgent';
type TGoalStatus = 'active' | 'completed' | 'paused' | 'archived';

interface IGoalFormData {
  title: string;
  description: string;
  category: TGoalCategory;
  type: TGoalType;
  priority: TGoalPriority;
  deadline: string;
  targetValue?: number;
  unit?: string;
  courseId?: string;
  reminders: boolean;
  tags: string[];
}

interface IFilterState {
  category: string;
  status: string;
  priority: string;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
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

const StudyGoalsManagement: React.FC = () => {
  // API hooks
  const { getQuery, loading: fetchLoading } = useGetQuery<IGoalsResponse>();
  const { getQuery: getStatsQuery, loading: statsLoading } = useGetQuery<IGoalStatsResponse>();
  const { postQuery, loading: createLoading } = usePostQuery<IGoalResponse>();
  const { postQuery: updateQuery, loading: updateLoading } = usePostQuery<IGoalResponse>();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();

  // State management
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [stats, setStats] = useState<IGoalStats>({
    totalGoals: 0,
    completedGoals: 0,
    activeGoals: 0,
    overduedGoals: 0,
    completionRate: 0,
    averageProgress: 0,
    streakDays: 0,
    upcomingDeadlines: 0,
    goalsByCategory: {},
    goalsByPriority: {},
    monthlyProgress: []
  });
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<IGoal | null>(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  
  // Filter and search state
  const [filters, setFilters] = useState<IFilterState>({
    category: 'all',
    status: 'all',
    priority: 'all',
    searchTerm: '',
    sortBy: 'deadline',
    sortOrder: 'asc'
  });
  
  // UI State
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState<IGoalFormData>({
    title: '',
    description: '',
    category: 'course',
    type: 'completion',
    priority: 'medium',
    deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    targetValue: undefined,
    unit: '',
    courseId: '',
    reminders: true,
    tags: []
  });

  // Get user ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  // Utility function to assign colors to goals
  const assignGoalColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      course: 'bg-blue-500',
      assignment: 'bg-red-500',
      exam: 'bg-purple-500',
      project: 'bg-green-500',
      skill: 'bg-yellow-500',
      career: 'bg-indigo-500',
      personal: 'bg-pink-500'
    };
    return colorMap[category] || 'bg-gray-500';
  };

  // Fetch goals data
  useEffect(() => {
    if (!userId) return;

    const fetchGoals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch goals
        await getQuery({
          url: apiUrls.goals.getAllGoals(userId),
          onSuccess: (response: IGoalsResponse) => {
            // Check if response has the expected structure
            if (response && response.data && response.data.goals && Array.isArray(response.data.goals)) {
              const goalsWithColors = response.data.goals.map(goal => ({
                ...goal,
                color: assignGoalColor(goal.category)
              }));
              setGoals(goalsWithColors);
            } else {
              console.warn('Goals API returned unexpected response structure:', response);
              setGoals([]);
            }
          },
          onFail: (error) => {
            console.error('Error fetching goals:', error);
            // Check if it's a 404 (endpoint not implemented) or other API error
            if (error?.status === 404) {
              console.warn('Goals API endpoint not implemented yet. Using empty state.');
              setError('Goals feature is not available yet. Please check back later.');
            } else {
              setError('Failed to load goals. Please try again later.');
            }
            setGoals([]);
          }
        });

        // Fetch stats
        await getStatsQuery({
          url: apiUrls.goals.getGoalStats(userId),
          onSuccess: (response: IGoalStatsResponse) => {
            // Check if response has the expected structure
            if (response && response.data && response.data.stats) {
              setStats(response.data.stats);
            } else {
              console.warn('Goal stats API returned unexpected response structure:', response);
              setStats({
                totalGoals: 0,
                completedGoals: 0,
                activeGoals: 0,
                overduedGoals: 0,
                completionRate: 0,
                averageProgress: 0,
                streakDays: 0,
                upcomingDeadlines: 0,
                goalsByCategory: {},
                goalsByPriority: {},
                monthlyProgress: []
              });
            }
          },
          onFail: (error) => {
            console.error('Error fetching goal stats:', error);
            // Check if it's a 404 (endpoint not implemented)
            if (error?.status === 404) {
              console.warn('Goal stats API endpoint not implemented yet. Using default stats.');
            }
            // Set default stats if fetch fails
            setStats({
              totalGoals: 0,
              completedGoals: 0,
              activeGoals: 0,
              overduedGoals: 0,
              completionRate: 0,
              averageProgress: 0,
              streakDays: 0,
              upcomingDeadlines: 0,
              goalsByCategory: {},
              goalsByPriority: {},
              monthlyProgress: []
            });
          }
        });

      } catch (err) {
        console.error('Error in goal fetch process:', err);
        setError('Failed to load goals and statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [userId, getQuery, getStatsQuery]);

  // Filter and sort goals
  const filteredGoals = goals.filter(goal => {
    // Filter by category
    if (filters.category !== 'all' && goal.category !== filters.category) {
      return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && goal.status !== filters.status) {
      return false;
    }
    
    // Filter by priority
    if (filters.priority !== 'all' && goal.priority !== filters.priority) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        goal.title.toLowerCase().includes(searchLower) ||
        goal.description?.toLowerCase().includes(searchLower) ||
        goal.courseName?.toLowerCase().includes(searchLower) ||
        goal.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  }).sort((a, b) => {
    let aValue: any = a[filters.sortBy as keyof IGoal];
    let bValue: any = b[filters.sortBy as keyof IGoal];
    
    // Handle date sorting
    if (filters.sortBy === 'deadline') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (filters.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Get priority color
  const getPriorityColor = (priority: TGoalPriority): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400';
    }
  };

  // Get status color
  const getStatusColor = (status: TGoalStatus): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400';
      case 'archived': return 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-500';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: TGoalCategory) => {
    switch (category) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <FileText className="w-4 h-4" />;
      case 'exam': return <GraduationCap className="w-4 h-4" />;
      case 'project': return <Code className="w-4 h-4" />;
      case 'skill': return <TrendingUp className="w-4 h-4" />;
      case 'career': return <Users className="w-4 h-4" />;
      case 'personal': return <Star className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Format deadline
  const formatDeadline = (deadline: string): string => {
    const date = parseISO(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    return format(date, 'MMM dd, yyyy');
  };

  // Handle goal completion toggle
  const handleToggleCompletion = useCallback(async (goalId: string) => {
    if (!userId) return;

    try {
      await updateQuery({
        url: apiUrls.goals.toggleGoalCompletion(goalId),
        data: {},
        onSuccess: (response: IGoalResponse) => {
          if (response && response.data && response.data.goal) {
            const updatedGoal = { ...response.data.goal, color: assignGoalColor(response.data.goal.category) };
            setGoals(prev => prev.map(goal => 
              goal._id === goalId ? updatedGoal : goal
            ));
          } else {
            console.warn('Toggle completion API returned unexpected response structure:', response);
          }
        },
        onFail: (error) => {
          console.error('Error toggling goal completion:', error);
          setError('Failed to update goal completion status');
        }
      });
    } catch (error) {
      console.error('Error in goal completion toggle:', error);
    }
  }, [userId, updateQuery]);

  // Handle progress update
  const handleProgressUpdate = useCallback(async (goalId: string, newProgress: number) => {
    if (!userId) return;

    const progressData: IGoalProgressUpdate = {
      progress: Math.min(100, Math.max(0, newProgress)),
      status: newProgress >= 100 ? 'completed' : 'active'
    };

    try {
      await updateQuery({
        url: apiUrls.goals.updateGoalProgress(goalId),
        data: progressData,
        onSuccess: (response: IGoalResponse) => {
          if (response && response.data && response.data.goal) {
            const updatedGoal = { ...response.data.goal, color: assignGoalColor(response.data.goal.category) };
            setGoals(prev => prev.map(goal => 
              goal._id === goalId ? updatedGoal : goal
            ));
          } else {
            console.warn('Progress update API returned unexpected response structure:', response);
          }
        },
        onFail: (error) => {
          console.error('Error updating goal progress:', error);
          setError('Failed to update goal progress');
        }
      });
    } catch (error) {
      console.error('Error in progress update:', error);
    }
  }, [userId, updateQuery]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (userId) {
      // Re-fetch goals and stats
      const fetchData = async () => {
        setIsLoading(true);
        try {
          await getQuery({
            url: apiUrls.goals.getAllGoals(userId),
            onSuccess: (response: IGoalsResponse) => {
              if (response && response.data && response.data.goals && Array.isArray(response.data.goals)) {
                const goalsWithColors = response.data.goals.map(goal => ({
                  ...goal,
                  color: assignGoalColor(goal.category)
                }));
                setGoals(goalsWithColors);
              } else {
                console.warn('Refresh goals API returned unexpected response structure:', response);
                setGoals([]);
              }
            },
            onFail: (error) => {
              console.error('Error refreshing goals:', error);
              setError('Failed to refresh goals');
            }
          });

          await getStatsQuery({
            url: apiUrls.goals.getGoalStats(userId),
            onSuccess: (response: IGoalStatsResponse) => {
              if (response && response.data && response.data.stats) {
                setStats(response.data.stats);
              } else {
                console.warn('Refresh stats API returned unexpected response structure:', response);
              }
            },
            onFail: (error) => {
              console.error('Error refreshing stats:', error);
            }
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
         }
   }, [userId, getQuery, getStatsQuery]);

  // Handle create goal
  const handleCreateGoal = useCallback(async (goalData: IGoalCreateInput) => {
    if (!userId) return;

    try {
      await postQuery({
        url: apiUrls.goals.createGoal,
        data: { ...goalData, studentId: userId },
        onSuccess: (response: IGoalResponse) => {
          if (response && response.data && response.data.goal) {
            const newGoal = { ...response.data.goal, color: assignGoalColor(response.data.goal.category) };
            setGoals(prev => [...prev, newGoal]);
            setIsCreateModalOpen(false);
            // Refresh stats
            handleRefresh();
          } else {
            console.warn('Create goal API returned unexpected response structure:', response);
          }
        },
        onFail: (error) => {
          console.error('Error creating goal:', error);
          setError('Failed to create goal');
        }
      });
    } catch (error) {
      console.error('Error in goal creation:', error);
    }
  }, [userId, postQuery, handleRefresh]);

  // Handle delete goal
  const handleDeleteGoal = useCallback(async (goalId: string) => {
    if (!userId) return;

    try {
      await deleteQuery({
        url: apiUrls.goals.deleteGoal(goalId),
        onSuccess: () => {
          setGoals(prev => prev.filter(goal => goal._id !== goalId));
          setIsDeleteModalOpen(false);
          setSelectedGoal(null);
          // Refresh stats
          handleRefresh();
        },
        onFail: (error) => {
          console.error('Error deleting goal:', error);
          setError('Failed to delete goal');
        }
      });
    } catch (error) {
      console.error('Error in goal deletion:', error);
    }
  }, [userId, deleteQuery, handleRefresh]);

  // Handle update goal
  const handleUpdateGoal = useCallback(async (goalId: string, goalData: IGoalUpdateInput) => {
    if (!userId) return;

    try {
      await updateQuery({
        url: apiUrls.goals.updateGoal(goalId),
        data: goalData,
        onSuccess: (response: IGoalResponse) => {
          if (response && response.data && response.data.goal) {
            const updatedGoal = { ...response.data.goal, color: assignGoalColor(response.data.goal.category) };
            setGoals(prev => prev.map(goal => 
              goal._id === goalId ? updatedGoal : goal
            ));
            setIsEditModalOpen(false);
            setSelectedGoal(null);
          } else {
            console.warn('Update goal API returned unexpected response structure:', response);
          }
        },
        onFail: (error) => {
          console.error('Error updating goal:', error);
          setError('Failed to update goal');
        }
      });
    } catch (error) {
      console.error('Error in goal update:', error);
    }
  }, [userId, updateQuery]);

  // Stats cards component
  const StatsCards: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Goals</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGoals}</p>
          </div>
          <Target className="w-8 h-8 text-blue-500" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedGoals}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(stats.averageProgress)}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-500" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Soon</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.upcomingDeadlines}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-orange-500" />
        </div>
      </motion.div>
    </div>
  );

  // Tab navigation component
  const TabNavigation: React.FC = () => {
    const tabs = [
      { id: 'all', label: 'All Goals', count: stats.totalGoals },
      { id: 'active', label: 'Active', count: stats.activeGoals },
      { id: 'completed', label: 'Completed', count: stats.completedGoals },
      { id: 'overdue', label: 'Overdue', count: stats.overduedGoals }
    ];

    return (
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setFilters(prev => ({ ...prev, status: tab.id === 'all' ? 'all' : tab.id }));
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Filters and search component
  const FiltersAndSearch: React.FC = () => (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search goals..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Categories</option>
          <option value="course">Course</option>
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
          <option value="project">Project</option>
          <option value="skill">Skill</option>
          <option value="career">Career</option>
          <option value="personal">Personal</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
          <option value="progress">Sort by Progress</option>
          <option value="title">Sort by Title</option>
          <option value="createdAt">Sort by Created</option>
        </select>

        <button
          onClick={() => setFilters(prev => ({ 
            ...prev, 
            sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
          }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {filters.sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          onClick={handleRefresh}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Refresh goals"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Goal card component
  const GoalCard: React.FC<{ goal: IGoal }> = ({ goal }) => {
    const isOverdue = isAfter(new Date(), parseISO(goal.deadline)) && goal.status === 'active';
    const isExpanded = expandedGoal === goal._id;

    return (
      <motion.div
        layout
        variants={itemVariants}
        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow ${
          isOverdue ? 'border-l-red-500' : goal.color.replace('bg-', 'border-l-')
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleCompletion(goal._id)}
              className={`p-1 rounded-full transition-colors ${
                goal.status === 'completed'
                  ? 'text-green-500 bg-green-100 dark:bg-green-900/20'
                  : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10'
              }`}
            >
              {goal.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              {getCategoryIcon(goal.category)}
              <span className="text-xs uppercase font-medium">{goal.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
              {goal.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
              {goal.status}
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {goal.description}
            </p>
          )}
          {goal.courseName && (
            <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
              Course: {goal.courseName}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {goal.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${goal.color}`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          {goal.targetValue && goal.currentValue && goal.unit && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {goal.currentValue}/{goal.targetValue} {goal.unit}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className={isOverdue ? 'text-red-500' : ''}>
              {formatDeadline(goal.deadline)}
            </span>
          </div>
          
          {goal.reminders && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Reminders on</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {goal.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {goal.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                +{goal.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setExpandedGoal(isExpanded ? null : goal._id)}
              className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <span>Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 space-y-1"
                >
                  {goal.milestones.map((milestone) => (
                    <div key={milestone._id} className="flex items-center gap-2 text-sm">
                      {milestone.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={milestone.completed ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}>
                        {milestone.title}
                      </span>
                      {milestone.completed && milestone.completedAt && (
                        <span className="text-xs text-gray-400">
                          ({format(parseISO(milestone.completedAt), 'MMM dd')})
                        </span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedGoal(goal);
                setIsEditModalOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit goal"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedGoal(goal);
                setIsDeleteModalOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete goal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => {
              setSelectedGoal(goal);
              setIsDetailsModalOpen(true);
            }}
            className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            View Details
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    );
  };

  // Loading state
  if (isLoading || fetchLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading study goals...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Study Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set, track, and achieve your learning objectives
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-4 lg:mt-0"
        >
          <Plus className="w-4 h-4" />
          Create Goal
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Filters and Search */}
      <FiltersAndSearch />

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12"
        >
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No goals found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filters.searchTerm || filters.category !== 'all' || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try adjusting your filters to see more goals.'
              : 'Get started by creating your first study goal.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Goal
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} />
          ))}
        </div>
      )}

      {/* TODO: Add modals for Create, Edit, Delete, and Details */}
      {/* Create Goal Modal */}
      {/* Edit Goal Modal */}
      {/* Delete Goal Modal */}
      {/* Goal Details Modal */}
    </motion.div>
  );
};

export default StudyGoalsManagement; 