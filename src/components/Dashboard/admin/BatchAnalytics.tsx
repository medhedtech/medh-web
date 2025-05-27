"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
  Clock,
  DollarSign,
  Target,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  batchAPI,
  individualAssignmentAPI,
  type IBatchStatistics,
  type IAssignmentStatistics,
  type IBatchWithDetails,
  type TBatchStatus
} from '@/apis/instructor-assignments';

interface BatchAnalyticsProps {
  courseId?: string;
  instructorId?: string;
}

interface IAnalyticsCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface IChartData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

const BatchAnalytics: React.FC<BatchAnalyticsProps> = ({
  courseId,
  instructorId
}) => {
  // State Management
  const [batchStats, setBatchStats] = useState<IBatchStatistics | null>(null);
  const [assignmentStats, setAssignmentStats] = useState<IAssignmentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data for demonstration
  const mockBatchStats: IBatchStatistics = {
    total_batches: 15,
    active_batches: 8,
    upcoming_batches: 4,
    completed_batches: 3,
    total_enrolled_students: 285,
    average_capacity_utilization: 82.5,
    instructor_workload: [
      { instructor_id: '1', instructor_name: 'Dr. Sarah Johnson', active_batches: 3, total_students: 75 },
      { instructor_id: '2', instructor_name: 'Prof. Michael Chen', active_batches: 2, total_students: 50 },
      { instructor_id: '3', instructor_name: 'Dr. Priya Sharma', active_batches: 2, total_students: 60 },
      { instructor_id: '4', instructor_name: 'Mr. Alex Rodriguez', active_batches: 1, total_students: 25 }
    ]
  };

  const mockAssignmentStats: IAssignmentStatistics = {
    total_assignments: 142,
    by_type: {
      mentor: 45,
      tutor: 38,
      advisor: 32,
      supervisor: 27
    },
    instructor_workload: [
      { instructor_id: '1', instructor_name: 'Dr. Sarah Johnson', individual_assignments: 15, batch_assignments: 3, total_students: 90 },
      { instructor_id: '2', instructor_name: 'Prof. Michael Chen', individual_assignments: 12, batch_assignments: 2, total_students: 62 }
    ],
    unassigned_students: 8
  };

  useEffect(() => {
    loadAnalytics();
  }, [courseId, instructorId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // In a real app, these would be actual API calls
      // const batchResponse = await batchAPI.getBatchStatistics(courseId);
      // const assignmentResponse = await individualAssignmentAPI.getAssignmentStatistics();
      
      setBatchStats(mockBatchStats);
      setAssignmentStats(mockAssignmentStats);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalyticsCards = (): IAnalyticsCard[] => {
    if (!batchStats || !assignmentStats) return [];

    return [
      {
        title: 'Total Batches',
        value: batchStats.total_batches,
        change: 12.5,
        changeType: 'increase',
        icon: <BookOpen className="h-6 w-6" />,
        color: 'text-blue-600',
        description: 'All batch types'
      },
      {
        title: 'Active Students',
        value: batchStats.total_enrolled_students,
        change: 8.2,
        changeType: 'increase',
        icon: <Users className="h-6 w-6" />,
        color: 'text-green-600',
        description: 'Currently enrolled'
      },
      {
        title: 'Capacity Utilization',
        value: `${batchStats.average_capacity_utilization.toFixed(1)}%`,
        change: 4.1,
        changeType: 'increase',
        icon: <Target className="h-6 w-6" />,
        color: 'text-purple-600',
        description: 'Average across all batches'
      },
      {
        title: 'Active Batches',
        value: batchStats.active_batches,
        change: 0,
        changeType: 'neutral',
        icon: <Activity className="h-6 w-6" />,
        color: 'text-orange-600',
        description: 'Currently running'
      },
      {
        title: 'Individual Assignments',
        value: assignmentStats.total_assignments,
        change: 15.3,
        changeType: 'increase',
        icon: <Award className="h-6 w-6" />,
        color: 'text-indigo-600',
        description: 'Student-instructor pairs'
      },
      {
        title: 'Unassigned Students',
        value: assignmentStats.unassigned_students,
        change: -23.1,
        changeType: 'decrease',
        icon: <Users className="h-6 w-6" />,
        color: 'text-red-600',
        description: 'Need instructor assignment'
      }
    ];
  };

  const getBatchStatusData = (): IChartData[] => {
    if (!batchStats) return [];

    return [
      { name: 'Active', value: batchStats.active_batches, color: '#10B981' },
      { name: 'Upcoming', value: batchStats.upcoming_batches, color: '#3B82F6' },
      { name: 'Completed', value: batchStats.completed_batches, color: '#6B7280' },
      { name: 'Cancelled', value: 0, color: '#EF4444' }
    ];
  };

  const getAssignmentTypeData = (): IChartData[] => {
    if (!assignmentStats) return [];

    const total = Object.values(assignmentStats.by_type).reduce((sum, count) => sum + count, 0);
    return Object.entries(assignmentStats.by_type).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      percentage: Math.round((count / total) * 100),
      color: getTypeColor(type)
    }));
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      mentor: '#10B981',
      tutor: '#3B82F6',
      advisor: '#8B5CF6',
      supervisor: '#F59E0B'
    };
    return colors[type] || '#6B7280';
  };

  const getChangeIcon = (changeType?: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = (changeType?: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading analytics...</span>
        </div>
      </div>
    );
  }

  const analyticsCards = getAnalyticsCards();
  const batchStatusData = getBatchStatusData();
  const assignmentTypeData = getAssignmentTypeData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Batch Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of batch performance and student assignments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
                {card.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {card.description}
                  </p>
                )}
                {card.change !== undefined && (
                  <div className="flex items-center mt-2">
                    {getChangeIcon(card.changeType)}
                    <span className={`text-sm font-medium ml-1 ${getChangeColor(card.changeType)}`}>
                      {Math.abs(card.change)}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      vs last period
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Batch Status Distribution
            </h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {batchStatusData.map((item, index) => {
              const total = batchStatusData.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.value}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignment Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assignment Types
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {assignmentTypeData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.value}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: item.color,
                      width: `${item.percentage}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructor Workload */}
      {batchStats?.instructor_workload && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Instructor Workload
            </h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Instructor
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Active Batches
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Total Students
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Utilization
                  </th>
                </tr>
              </thead>
              <tbody>
                {batchStats.instructor_workload.map((instructor) => {
                  const utilization = Math.round((instructor.total_students / 100) * 100); // Assuming max 100 students per instructor
                  const utilizationColor = utilization > 80 ? 'text-red-600' : utilization > 60 ? 'text-yellow-600' : 'text-green-600';
                  
                  return (
                    <tr key={instructor.instructor_id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {instructor.instructor_name}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                        {instructor.active_batches}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                        {instructor.total_students}
                      </td>
                      <td className={`text-center py-3 px-4 font-medium ${utilizationColor}`}>
                        {utilization}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchAnalytics; 