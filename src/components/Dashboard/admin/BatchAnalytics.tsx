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
  Minus,
  AlertCircle,
  Trophy,
  Power,
  PlayCircle,
  StopCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  batchAPI,
  type IBatchAnalyticsDashboard,
  type IBatchStatusDistribution,
  type IInstructorWorkloadAnalytics,
  type ICapacityAnalytics,
  type TBatchStatus
} from '@/apis/batch';

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

interface IBatchQuickAction {
  _id: string;
  batch_name: string;
  course_title: string;
  current_status: TBatchStatus;
  instructor_name?: string;
  enrolled_students: number;
  capacity: number;
  start_date: string;
  end_date: string;
}

const BatchAnalytics: React.FC<BatchAnalyticsProps> = ({
  courseId,
  instructorId
}) => {
  // State Management
  const [dashboardData, setDashboardData] = useState<IBatchAnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showStatusManager, setShowStatusManager] = useState(false);
  const [recentBatches, setRecentBatches] = useState<IBatchQuickAction[]>([]);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [courseId, instructorId, timeRange]);

  useEffect(() => {
    if (showStatusManager) {
      loadRecentBatches();
    }
  }, [showStatusManager, courseId, instructorId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare parameters for API calls
      const params = {
        ...(courseId && { courseId }),
        ...(instructorId && { instructorId }),
        timeframe: timeRange
      };

      // Load analytics data from the dashboard endpoint only
      const dashboardResponse = await batchAPI.getBatchAnalyticsDashboard(params);

      // Handle dashboard data
      if (dashboardResponse?.data?.success) {
        setDashboardData(dashboardResponse.data.data);
      } else {
        console.warn('Dashboard analytics failed:', 'No data received');
        setError('Failed to load analytics data. Please try again later.');
        toast.error('Failed to load analytics data');
      }

    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('An unexpected error occurred while loading analytics.');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentBatches = async () => {
    try {
      const params = {
        limit: 10,
        sort_by: 'start_date',
        sort_order: 'desc' as const,
        ...(courseId && { course_id: courseId }),
        ...(instructorId && { instructor_id: instructorId })
      };

      const response = await batchAPI.getAllBatches(params);
      
      if (response?.data?.data) {
        // Transform the response to match our interface
        const responseData = response.data as any;
        const batches = Array.isArray(responseData.data) 
          ? responseData.data 
          : responseData.data?.data || [];
        
        const transformedBatches: IBatchQuickAction[] = batches.map((batch: any) => ({
          _id: batch._id,
          batch_name: batch.batch_name,
          course_title: batch.course_details?.course_title || batch.course_name || 'Unknown Course',
          current_status: batch.status,
          instructor_name: batch.instructor_details?.full_name || batch.instructor_name || 'Unassigned',
          enrolled_students: batch.enrolled_students || 0,
          capacity: batch.capacity || 0,
          start_date: batch.start_date,
          end_date: batch.end_date
        }));

        setRecentBatches(transformedBatches);
      }
    } catch (error) {
      console.error('Error loading recent batches:', error);
      toast.error('Failed to load recent batches');
    }
  };

  const handleStatusUpdate = async (batchId: string, newStatus: TBatchStatus) => {
    try {
      setStatusUpdateLoading(batchId);
      
      const response = await batchAPI.updateBatchStatus(batchId, newStatus);
      
      if ((response as any)?.data) {
        toast.success(`Batch status updated to ${newStatus} successfully`);
        
        // Update the batch in local state
        setRecentBatches(prev => prev.map(batch => 
          batch._id === batchId 
            ? { ...batch, current_status: newStatus }
            : batch
        ));
        
        // Refresh analytics data
        loadAnalytics();
      } else {
        throw new Error('Failed to update batch status');
      }
    } catch (error) {
      console.error('Error updating batch status:', error);
      toast.error('Failed to update batch status');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const getStatusTransitions = (currentStatus: TBatchStatus): TBatchStatus[] => {
    const transitions: Record<TBatchStatus, TBatchStatus[]> = {
      'Upcoming': ['Active', 'Cancelled'],
      'Active': ['Completed', 'Cancelled'],
      'Completed': [], // No transitions from completed
      'Cancelled': ['Upcoming'] // Can reactivate cancelled batches
    };
    return transitions[currentStatus] || [];
  };

  const getStatusIcon = (status: TBatchStatus) => {
    const icons = {
      'Upcoming': <Clock className="h-4 w-4" />,
      'Active': <PlayCircle className="h-4 w-4" />,
      'Completed': <CheckCircle className="h-4 w-4" />,
      'Cancelled': <XCircle className="h-4 w-4" />
    };
    return icons[status];
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'Active': '#10B981',
      'Upcoming': '#3B82F6',
      'Completed': '#6B7280',
      'Cancelled': '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const getAnalyticsCards = (): IAnalyticsCard[] => {
    if (!dashboardData) return [];

    // Cast to any since the actual API response structure doesn't match the TypeScript interfaces
    const overview = (dashboardData as any).overview;
    
    // Extract values from the nested objects in the API response
    const totalBatches = overview?.total_batches?.value ?? 0;
    const totalEnrolled = overview?.active_students?.value ?? 0; // Note: API uses 'active_students'
    const overallUtilization = overview?.capacity_utilization?.value ?? 0; // Note: API uses 'capacity_utilization'
    const activeBatches = overview?.active_batches?.value ?? 0;
    const individualAssignments = overview?.individual_assignments?.value ?? 0;
    const unassignedStudents = overview?.unassigned_students?.value ?? 0;
    
    // Extract change percentages from the API response
    const totalBatchesChange = overview?.total_batches?.change ?? 0;
    const activeStudentsChange = overview?.active_students?.change ?? 0;
    const capacityUtilizationChange = overview?.capacity_utilization?.change ?? 0;
    const activeBatchesChange = overview?.active_batches?.change ?? 0;
    const individualAssignmentsChange = overview?.individual_assignments?.change ?? 0;
    const unassignedStudentsChange = overview?.unassigned_students?.change ?? 0;
    
    return [
      {
        title: 'Total Batches',
        value: totalBatches,
        change: totalBatchesChange,
        changeType: totalBatchesChange > 0 ? 'increase' : totalBatchesChange < 0 ? 'decrease' : 'neutral',
        icon: <BookOpen className="h-6 w-6" />,
        color: 'text-blue-600',
        description: overview?.total_batches?.period || 'All batch types'
      },
      {
        title: 'Active Students',
        value: totalEnrolled,
        change: activeStudentsChange,
        changeType: activeStudentsChange > 0 ? 'increase' : activeStudentsChange < 0 ? 'decrease' : 'neutral',
        icon: <Users className="h-6 w-6" />,
        color: 'text-green-600',
        description: overview?.active_students?.description || 'Currently enrolled'
      },
      {
        title: 'Capacity Utilization',
        value: `${overallUtilization.toFixed(1)}%`,
        change: capacityUtilizationChange,
        changeType: overallUtilization > 80 ? 'increase' : 'neutral',
        icon: <Target className="h-6 w-6" />,
        color: 'text-purple-600',
        description: overview?.capacity_utilization?.description || 'Average across all batches'
      },
      {
        title: 'Active Batches',
        value: activeBatches,
        change: activeBatchesChange,
        changeType: activeBatchesChange > 0 ? 'increase' : activeBatchesChange < 0 ? 'decrease' : 'neutral',
        icon: <Activity className="h-6 w-6" />,
        color: 'text-orange-600',
        description: overview?.active_batches?.description || 'Currently running'
      },
      {
        title: 'Individual Assignments',
        value: individualAssignments,
        change: individualAssignmentsChange,
        changeType: individualAssignmentsChange > 0 ? 'increase' : individualAssignmentsChange < 0 ? 'decrease' : 'neutral',
        icon: <Award className="h-6 w-6" />,
        color: 'text-indigo-600',
        description: overview?.individual_assignments?.description || 'Student-instructor pairs'
      },
      {
        title: 'Unassigned Students',
        value: unassignedStudents,
        change: unassignedStudentsChange,
        changeType: unassignedStudentsChange > 0 ? 'decrease' : unassignedStudentsChange < 0 ? 'increase' : 'neutral', // Note: increase in unassigned is bad
        icon: <Calendar className="h-6 w-6" />,
        color: 'text-yellow-600',
        description: overview?.unassigned_students?.description || 'Need instructor assignment'
      }
    ];
  };

  const getBatchStatusData = (): IChartData[] => {
    const apiData = dashboardData as any;
    if (!apiData?.batch_status_distribution) return [];

    return apiData.batch_status_distribution.map((item: any) => ({
      name: item.status || 'Unknown',
      value: item.count || 0,
      percentage: item.percentage || 0,
      color: getStatusColor(item.status || 'Unknown')
    }));
  };

  const getAssignmentTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'Mentor': '#10B981',
      'Tutor': '#3B82F6',
      'Advisor': '#8B5CF6',
      'Supervisor': '#F59E0B'
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

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to Load Analytics
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const analyticsCards = getAnalyticsCards();
  const batchStatusData = getBatchStatusData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Batch Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into batch performance and capacity utilization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStatusManager(!showStatusManager)}
            className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
              showStatusManager 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Power className="h-4 w-4 mr-2" />
            Status Manager
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Status Manager Section */}
      {showStatusManager && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Batch Status Management
            </h3>
            <button
              onClick={loadRecentBatches}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Refresh batches"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {recentBatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 mb-2">No batches found</div>
              <button
                onClick={loadRecentBatches}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Load batches
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBatches.map((batch) => {
                const availableTransitions = getStatusTransitions(batch.current_status);
                const isUpdating = statusUpdateLoading === batch._id;
                
                return (
                  <div key={batch._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(batch.current_status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {batch.batch_name}
                          </h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {batch.course_title} • {batch.instructor_name}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {batch.enrolled_students}/{batch.capacity} students • 
                            {new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          batch.current_status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : batch.current_status === 'Upcoming'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : batch.current_status === 'Completed'
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {batch.current_status}
                      </span>
                      
                      {availableTransitions.length > 0 && (
                        <div className="flex space-x-2">
                          {availableTransitions.map((newStatus) => (
                            <button
                              key={newStatus}
                              onClick={() => handleStatusUpdate(batch._id, newStatus)}
                              disabled={isUpdating}
                              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                newStatus === 'Active'
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : newStatus === 'Completed'
                                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                    : newStatus === 'Cancelled'
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              title={`Change status to ${newStatus}`}
                            >
                              {isUpdating ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  {getStatusIcon(newStatus)}
                                  <span className="ml-1">{newStatus}</span>
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Analytics Cards */}
      {dashboardData && (
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
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Status Distribution */}
        {dashboardData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Batch Status Distribution
              </h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {batchStatusData.map((item) => (
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
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Types Distribution */}
        {(dashboardData as any)?.assignment_types && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assignment Types
              </h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {(dashboardData as any).assignment_types.map((item: any) => {
                const color = getAssignmentTypeColor(item.type);
                return (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.type}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.count} assignments
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
                          backgroundColor: color,
                          width: `${item.percentage}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Instructor Workload */}
      {(dashboardData as any)?.instructor_workload && (dashboardData as any).instructor_workload.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Instructor Workload Analysis
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
                    Total Batches
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Utilization
                  </th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData as any).instructor_workload.map((instructor: any) => {
                  const utilization = instructor?.utilization ?? 0;
                  const utilizationColor = utilization > 80 ? 'text-red-600' : utilization > 60 ? 'text-yellow-600' : 'text-green-600';
                  
                  return (
                    <tr key={instructor._id || 'unknown'} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {instructor?.name || 'Unknown Instructor'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {instructor?.email || 'No email'}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                        {instructor?.active_batches ?? 0}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                        {instructor?.total_students ?? 0}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                        {instructor?.total_batches ?? 0}
                      </td>
                      <td className={`text-center py-3 px-4 font-medium ${utilizationColor}`}>
                        {utilization.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Workload Summary - Calculate from the data */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(dashboardData as any).instructor_workload.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Instructors
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(dashboardData as any).instructor_workload.filter((i: any) => i.utilization >= 60 && i.utilization <= 80).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Optimal Load
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {(dashboardData as any).instructor_workload.filter((i: any) => i.utilization < 60).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Underutilized
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {(dashboardData as any).instructor_workload.filter((i: any) => i.utilization > 80).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Overloaded
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchAnalytics;