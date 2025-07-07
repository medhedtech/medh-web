import React, { useEffect, useState, useMemo } from "react";
import { X, RefreshCw, Copy, AlertTriangle, Table, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, HelpCircle, ChevronDown, ArrowUp, ArrowDown, Filter, Maximize2, Minimize2, Search, Download, BarChart3, TrendingUp, Info, PieChart, Users, UserCheck } from "lucide-react";
import { buildAdvancedComponent } from '@/utils/designSystem';

/**
 * Enhanced ApiPanel Component
 * 
 * Improvements for nested data structures:
 * - Enhanced formatValue function to handle course_description objects with program_overview, benefits, learning_objectives, course_requirements, and target_audience
 * - Improved getFilteredColumns to include course-related fields and better object filtering
 * - Enhanced search functionality to search within nested objects including curriculum, FAQs, and meta data
 * - Added proper column display names for all course fields
 * - Added CSS classes for better text truncation and line clamping
 * - Better handling of arrays like learning_objectives with bullet points
 * - Special handling for curriculum arrays with week/section/lesson counts
 * - Enhanced display for FAQs, meta data (ratings, views, enrollments), pricing, and final evaluation
 * 
 * Supports complex data structures like:
 * {
 *   "course_description": {
 *     "program_overview": "This comprehensive course...",
 *     "benefits": "Gain a solid grasp...",
 *     "learning_objectives": ["Understand quantum mechanics", "Program quantum circuits"],
 *     "course_requirements": ["Basic linear algebra", "Python programming"],
 *     "target_audience": ["Computer scientists", "Physicists"]
 *   },
 *   "curriculum": [{"weekTitle": "Week 1", "sections": [], "lessons": []}],
 *   "faqs": [{"question": "What prerequisites?", "answer": "..."}],
 *   "meta": {"ratings": {"average": 4.5, "count": 10}, "views": 1542, "enrollments": 0},
 *   "prices": [{"individual": 75, "batch": 777.06, "is_active": true}]
 * }
 */

// Add CSS for line clamping and text truncation
const styles = `
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

interface ApiPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
  method: string;
  description: string;
  fetcher: (params?: { page?: number; limit?: number }) => Promise<any>;
}

const ApiPanel: React.FC<ApiPanelProps> = ({ open, onClose, title, endpoint, method, description, fetcher }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'json' | 'dashboard'>('table');
  
  // Enhanced pagination state for courses
  const [currentPage, setCurrentPage] = useState(1);
  // Default page size for data tables
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageJumpValue, setPageJumpValue] = useState('');
  const [showPageJump, setShowPageJump] = useState(false);

  // Full page view state
  const [fullPage, setFullPage] = useState(false);
  // Global search state
  const [search, setSearch] = useState("");
  // Advanced search state
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<Array<{
    column: string;
    operator: 'contains' | 'exact' | 'starts' | 'ends' | 'gt' | 'lt' | 'gte' | 'lte';
    value: string;
    logic: 'AND' | 'OR';
  }>>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Role filtering state for users
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [roleStats, setRoleStats] = useState<{[key: string]: number}>({});

  // Flexible columns state
  const [columnSettings, setColumnSettings] = useState<{
    [key: string]: {
      visible: boolean;
      width: number;
      order: number;
      frozen: boolean;
    };
  }>({});
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);

  // Store all users for role filtering regardless of pagination
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const fetchData = async (page?: number, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = page && limit ? { page, limit } : undefined;
      const res = await fetcher(params);
      setData(res);
      
      // Extract table data to check if it's analytics data
      const extractedData = extractTableData(res);
      if (extractedData && isAnalyticsData(extractedData)) {
        setViewMode('dashboard');
      }
      
      // Only reset to page 1 if this is a fresh load (no page parameter)
      if (!page) {
        setCurrentPage(1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced course-specific data fetching with better error handling
  const fetchCourseData = async (page?: number, limit?: number) => {
    setPaginationLoading(true);
    setError(null);
    try {
      const params = page && limit ? { page, limit } : undefined;
      const res = await fetcher(params);
      
      // Validate course data structure
      if (res && res.data && Array.isArray(res.data)) {
        // Check if courses have required fields for better display
        const validatedData = res.data.map((course: any) => ({
          ...course,
          // Ensure course_description is properly structured
          course_description: course.course_description || {
            program_overview: '',
            benefits: '',
            learning_objectives: [],
            course_requirements: [],
            target_audience: []
          },
          // Ensure curriculum is an array
          curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
          // Ensure FAQs is an array
          faqs: Array.isArray(course.faqs) ? course.faqs : [],
          // Ensure meta has proper structure
          meta: course.meta || {
            ratings: { average: 0, count: 0 },
            views: 0,
            enrollments: 0
          }
        }));
        
        setData({ ...res, data: validatedData });
      } else {
        setData(res);
      }
      
      if (!page) {
        setCurrentPage(1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course data');
      setData(null);
    } finally {
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      // For courses, automatically load all courses to show the full dataset
      const isCourseEndpoint = endpoint.includes('/courses') || endpoint.includes('/tcourse');
      // For users, load all users and handle pagination client-side
      const isUsersEndpoint = endpoint.includes('/auth/users');
      // For analytics endpoints, automatically switch to dashboard view
      const isAnalyticsEndpoint = endpoint.includes('/analytics') || endpoint.includes('/dashboard');
      
      if (isCourseEndpoint) {
        setPageSize(200); // Set page size for courses
        fetchData(1, 200); // Load all courses (95) by using a large page size
      } else if (isUsersEndpoint) {
        setPageSize(10); // Set page size to 10 for users by default
        fetchData(); // Load all users, pagination will be handled client-side
      } else {
        setPageSize(10); // Default page size for other endpoints
        fetchData();
      }
      
      // Auto-switch to dashboard view for analytics endpoints
      if (isAnalyticsEndpoint) {
        setViewMode('dashboard');
      }
      
      // Force a re-render to ensure data is processed correctly
      setTimeout(() => {
        if (data) {
          console.log('Forcing data refresh for analytics...');
          setData({...data}); // Force re-render
        }
      }, 100);
    }
    // eslint-disable-next-line
  }, [open]);



  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Extract table data from different response structures
  const extractTableData = (response: any): any[] => {
    if (!response) return [];
    
    // Handle deeply nested announcements structure (data.data.announcements)
    if (response.data && response.data.data && response.data.data.announcements && Array.isArray(response.data.data.announcements)) {
      return response.data.data.announcements;
    }
    
    // Handle new dashboard stats structure with detailed changes
    if (response.data && response.data.totalStudents && response.data.totalStudents.total !== undefined) {
      const analyticsData: any[] = [];
      
      // Process each metric with detailed change tracking
      Object.entries(response.data).forEach(([key, value]: [string, any]) => {
        if (value && typeof value === 'object' && 'total' in value) {
          const metricName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          
          // Handle metrics with detailed changes (totalStudents, activeEnrollments, activeCourses, monthlyRevenue)
          if (value.changes && typeof value.changes === 'object') {
            Object.entries(value.changes).forEach(([period, periodData]: [string, any]) => {
              if (periodData && typeof periodData === 'object' && 'change' in periodData) {
                analyticsData.push({
                  Metric: metricName,
                  Value: value.total,
                  Change: periodData.change,
                  Period: period.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                  Type: 'overview',
                  Description: `${periodData.current} current vs ${periodData.previous} previous`,
                  Current: periodData.current,
                  Previous: periodData.previous,
                  PeriodType: period
                });
              }
            });
          } else {
            // Handle metrics without detailed changes (upcomingClasses, completionRate, etc.)
            analyticsData.push({
              Metric: metricName,
              Value: value.total,
              Change: 0,
              Period: 'Current',
              Type: 'overview',
              Description: `Current total: ${value.total}`,
              Current: value.total,
              Previous: 0
            });
          }
        }
      });
      
      return analyticsData;
    }
    
    // Handle analytics data structure (data.data.overview, data.data.details, etc.)
    if (response.data && response.data.data && response.data.data.overview) {
      const analyticsData: any[] = [];
      
      // Convert overview metrics to table rows
      if (response.data.data.overview) {
        Object.entries(response.data.data.overview).forEach(([key, value]: [string, any]) => {
          if (value && typeof value === 'object' && 'value' in value) {
            // Handle cases where change might be the string "undefined" or missing
            let changeValue = value.change;
            console.log(`Processing ${key}: changeValue =`, changeValue, 'type:', typeof changeValue);
            
            if (changeValue === 'undefined' || changeValue === 'null' || changeValue === undefined || changeValue === null || changeValue === '') {
              changeValue = 0; // Replace undefined with 0
              console.log(`Fixed ${key}: changeValue set to 0`);
            }
            
            // Enhanced description with breakdown data
            let description = value.description || '';
            if (value.breakdown && typeof value.breakdown === 'object') {
              const breakdownStr = Object.entries(value.breakdown)
                .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                .join(', ');
              description = description ? `${description} (${breakdownStr})` : breakdownStr;
            }
            
            // Add trend information if available
            let trend = '';
            if (value.trend) {
              trend = value.trend;
            }
            
            analyticsData.push({
              Metric: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              Value: value.value,
              Change: changeValue,
              Period: value.period || 'Last 30 days',
              Type: 'overview',
              Description: description,
              Trend: trend,
              Breakdown: value.breakdown || null
            });
            
            console.log(`Added metric: ${key} with Change: ${changeValue}`);
          }
        });
      }
      
      // Add batch status distribution data
      if (response.data.data.batch_status_distribution && Array.isArray(response.data.data.batch_status_distribution)) {
        response.data.data.batch_status_distribution.forEach((item: any) => {
          // Handle cases where percentage might be the string "undefined" or missing
          let percentageValue = item.percentage;
          if (percentageValue === 'undefined' || percentageValue === 'null' || percentageValue === undefined || percentageValue === null) {
            percentageValue = 0; // Replace undefined with 0
          }
          
          analyticsData.push({
            Metric: `${item.status} Batches`,
            Value: item.count,
            Change: percentageValue,
            Period: 'Distribution',
            Type: 'distribution',
            Description: `${percentageValue}% of total`
          });
        });
      }
      
      // Add assignment types data
      if (response.data.data.assignment_types && Array.isArray(response.data.data.assignment_types)) {
        response.data.data.assignment_types.forEach((item: any) => {
          // Handle cases where percentage might be the string "undefined" or missing
          let percentageValue = item.percentage;
          if (percentageValue === 'undefined' || percentageValue === 'null' || percentageValue === undefined || percentageValue === null) {
            percentageValue = 0; // Replace undefined with 0
          }
          
          analyticsData.push({
            Metric: `${item.type} Assignments`,
            Value: item.count,
            Change: percentageValue,
            Period: 'Distribution',
            Type: 'assignment',
            Description: `${percentageValue}% of total`
          });
        });
      }
      
      // Add instructor workload data
      if (response.data.data.instructor_workload && Array.isArray(response.data.data.instructor_workload)) {
        response.data.data.instructor_workload.forEach((instructor: any) => {
          // Handle cases where utilization might be the string "undefined" or missing
          let utilizationValue = instructor.utilization;
          if (utilizationValue === 'undefined' || utilizationValue === 'null' || utilizationValue === undefined || utilizationValue === null) {
            utilizationValue = 0; // Replace undefined with 0
          }
          
          let workloadPercentage = instructor.workload_percentage;
          if (workloadPercentage === 'undefined' || workloadPercentage === 'null' || workloadPercentage === undefined || workloadPercentage === null) {
            workloadPercentage = 0;
          }
          
          analyticsData.push({
            Metric: `${instructor.name} (${instructor.email})`,
            Value: `${instructor.total_students} students`,
            Change: utilizationValue,
            Period: 'Workload',
            Type: 'instructor',
            Description: `${workloadPercentage}% workload, ${utilizationValue}% utilization`
          });
        });
      }
      
      // Add detailed metrics if available
      if (response.data.data.detailed_metrics) {
        const detailed = response.data.data.detailed_metrics;
        
        // Batch performance metrics
        if (detailed.batch_performance) {
          Object.entries(detailed.batch_performance).forEach(([key, value]: [string, any]) => {
            analyticsData.push({
              Metric: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              Value: value,
              Change: 0,
              Period: 'Performance',
              Type: 'detailed',
              Description: 'Batch performance metric'
            });
          });
        }
        
        // Student engagement metrics
        if (detailed.student_engagement) {
          Object.entries(detailed.student_engagement).forEach(([key, value]: [string, any]) => {
            analyticsData.push({
              Metric: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              Value: value,
              Change: 0,
              Period: 'Engagement',
              Type: 'detailed',
              Description: 'Student engagement metric'
            });
          });
        }
        
        // Operational metrics
        if (detailed.operational_metrics) {
          Object.entries(detailed.operational_metrics).forEach(([key, value]: [string, any]) => {
            analyticsData.push({
              Metric: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              Value: value,
              Change: 0,
              Period: 'Operations',
              Type: 'detailed',
              Description: 'Operational metric'
            });
          });
        }
      }
      
      // Add geographic insights if available
      if (response.data.data.geographic_insights && response.data.data.geographic_insights.distribution) {
        response.data.data.geographic_insights.distribution.forEach((region: any) => {
          analyticsData.push({
            Metric: `${region.region} Students`,
            Value: region.count,
            Change: region.percentage,
            Period: 'Geographic',
            Type: 'geographic',
            Description: `${region.percentage}% of total students`
          });
        });
      }
      
      // Add course analysis if available
      if (response.data.data.course_analysis && response.data.data.course_analysis.type_distribution) {
        response.data.data.course_analysis.type_distribution.forEach((course: any) => {
          analyticsData.push({
            Metric: `${course.type} Courses`,
            Value: course.count,
            Change: course.percentage,
            Period: 'Course Type',
            Type: 'course',
            Description: `${course.percentage}% of total courses`
          });
        });
      }
      
      // Add insights and recommendations if available
      if (response.data.data.insights_and_recommendations) {
        response.data.data.insights_and_recommendations.forEach((insight: any, index: number) => {
          analyticsData.push({
            Metric: `Insight ${index + 1}`,
            Value: insight.priority,
            Change: 0,
            Period: insight.category,
            Type: 'insight',
            Description: insight.message,
            Impact: insight.impact
          });
        });
      }
      
      // Add instructor analysis summary
      if (response.data.data.instructor_analysis && typeof response.data.data.instructor_analysis === 'object') {
        const analysis = response.data.data.instructor_analysis;
        analyticsData.push({
          Metric: 'Total Instructors',
          Value: analysis.total_instructors,
          Change: 0, // Set to 0 instead of null for consistency
          Period: 'Summary',
          Type: 'analysis',
          Description: `${analysis.optimal_load !== undefined ? analysis.optimal_load : 0} optimal, ${analysis.underutilized !== undefined ? analysis.underutilized : 0} underutilized, ${analysis.overloaded !== undefined ? analysis.overloaded : 0} overloaded`
        });
      }
      
      return analyticsData;
    }
    
    // Handle nested pagination structure like the example (data.data)
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Handle different response structures
    if (Array.isArray(response)) return response;
    
    // Check for common data patterns
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.users && Array.isArray(response.users)) return response.users;
    if (response.batches && Array.isArray(response.batches)) return response.batches;
    if (response.announcements && Array.isArray(response.announcements)) return response.announcements;
    if (response.forms && Array.isArray(response.forms)) return response.forms;
    if (response.courses && Array.isArray(response.courses)) return response.courses;
    if (response.submissions && Array.isArray(response.submissions)) return response.submissions;
    if (response.locked_accounts && Array.isArray(response.locked_accounts)) return response.locked_accounts;
    
    // Handle nested data structures
    if (response.data && response.data.users && Array.isArray(response.data.users)) return response.data.users;
    if (response.data && response.data.batches && Array.isArray(response.data.batches)) return response.data.batches;
    if (response.data && response.data.announcements && Array.isArray(response.data.announcements)) return response.data.announcements;
    if (response.data && response.data.forms && Array.isArray(response.data.forms)) return response.data.forms;
    if (response.data && response.data.courses && Array.isArray(response.data.courses)) return response.data.courses;
    if (response.data && response.data.submissions && Array.isArray(response.data.submissions)) return response.data.submissions;
    if (response.data && response.data.locked_accounts && Array.isArray(response.data.locked_accounts)) return response.data.locked_accounts;
    
    // If it's an object with keys, try to find array values
    if (typeof response === 'object') {
      const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));
      if (arrayKeys.length > 0) {
        return response[arrayKeys[0]];
      }
    }
    
    return [];
  };

  // Extract pagination metadata from API response
      // Check if data is analytics data (has overview metrics)
    const isAnalyticsData = (data: any): boolean => {
      if (!data || !Array.isArray(data)) return false;
      
      // Check if data has analytics structure (Metric, Value, Change, Period, Type columns)
      const firstItem = data[0];
      if (!firstItem) return false;
      
      const hasAnalyticsStructure = 
        'Metric' in firstItem && 
        'Value' in firstItem && 
        'Change' in firstItem && 
        'Period' in firstItem && 
        'Type' in firstItem;
      
      // Also check if any item has 'overview' type
      const hasOverviewType = data.some((item: any) => 
        item.Type === 'overview' || item.type === 'overview'
      );
      
      // Check if data contains analytics-specific types
      const hasAnalyticsTypes = data.some((item: any) => 
        item.Type === 'overview' || item.Type === 'distribution' || item.Type === 'assignment' || 
        item.Type === 'instructor' || item.Type === 'analysis' || item.Type === 'detailed' ||
        item.Type === 'geographic' || item.Type === 'course' || item.Type === 'insight' ||
        item.type === 'overview' || item.type === 'distribution' || item.type === 'assignment' || 
        item.type === 'instructor' || item.type === 'analysis' || item.type === 'detailed' ||
        item.type === 'geographic' || item.type === 'course' || item.type === 'insight'
      );
      
      // Check for new dashboard stats structure with detailed changes
      const hasDetailedChanges = data.some((item: any) => 
        item.Current !== undefined && item.Previous !== undefined && item.PeriodType !== undefined
      );
      
      return hasAnalyticsStructure || hasOverviewType || hasAnalyticsTypes || hasDetailedChanges;
    };

  const extractPaginationInfo = (response: any) => {
    if (!response) return null;
    
    // Handle deeply nested announcements pagination structure
    if (response.data && response.data.data && response.data.data.pagination) {
      const pagination = response.data.data.pagination;
      return {
        total: pagination.totalCount || pagination.total,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        count: pagination.totalCount || pagination.count,
        hasServerPagination: true
      };
    }
    
    // Handle nested pagination structure
    if (response.data && response.data.total && response.data.currentPage) {
      return {
        total: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        count: response.data.count,
        hasServerPagination: true
      };
    }
    
    // Handle direct pagination structure
    if (response.total && response.currentPage) {
      return {
        total: response.total,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        count: response.count,
        hasServerPagination: true
      };
    }
    
    // Handle users endpoint specific structure
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Check if this looks like a users response (has user-specific fields)
      const firstItem = response.data[0];
      if (firstItem && (firstItem.full_name || firstItem.email || firstItem.phone_number)) {
        // For users endpoint, treat as client-side pagination since server returns all data
        return {
          total: response.data.length,
          currentPage: 1,
          totalPages: 1,
          count: response.data.length,
          hasServerPagination: false
        };
      }
    }
    
    return null;
  };

  // Enhanced formatValue for better UX with improved nested object handling
  const formatValue = (value: any, column: string): string | JSX.Element => {
    if (value === null || value === undefined) return '-';
    
    // Boolean values with status badges
    if (typeof value === 'boolean') {
      const isPositive = ['is_active', 'email_verified', 'phone_verified', 'identity_verified', 'two_factor_enabled', 'isSticky', 'isRead'].includes(column);
      const isNegative = ['is_banned', 'trial_used', 'temp_password_verified'].includes(column);
      
      if (isPositive) {
        return value ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✓ Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            ✗ No
          </span>
        );
      } else if (isNegative) {
        return value ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            ✗ Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✓ No
          </span>
        );
      }
      
      return value ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          ✓ Yes
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          ✗ No
        </span>
      );
    }
    
    // Phone number formatting
    if (column === 'phone_number' && typeof value === 'string') {
      return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }

    // Content formatting for announcements
    if (column === 'content' && typeof value === 'string') {
      const truncatedContent = value.length > 100 ? value.substring(0, 100) + '...' : value;
      return (
        <div className="text-xs max-w-xs">
          <div className="text-gray-900 dark:text-white line-clamp-3">
            {truncatedContent}
          </div>
          {value.length > 100 && (
            <div className="text-gray-500 text-xs mt-1">
              {value.length} characters
            </div>
          )}
        </div>
      );
    }

    // Title formatting for announcements
    if (column === 'title' && typeof value === 'string') {
      const truncatedTitle = value.length > 50 ? value.substring(0, 50) + '...' : value;
      return (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {truncatedTitle}
        </div>
      );
    }

    // Analytics metric formatting
    if (column === 'metric' && typeof value === 'string') {
      return (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </div>
      );
    }

    // Analytics value formatting with change indicator
    if (column === 'value' && typeof value === 'number') {
      const row = tableData?.find((item: any) => item.value === value);
      const change = row?.change;
      
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-900 dark:text-white">
            {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
          </div>
          {change !== undefined && (
            <div className={`text-xs ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
      );
    }

    // Change percentage formatting
    if (column === 'change' && typeof value === 'number') {
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value >= 0 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      );
    }

    // Period and description formatting
    if (column === 'period' && typeof value === 'string') {
      return (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {value}
        </span>
      );
    }

    if (column === 'description' && typeof value === 'string') {
      return (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {value}
        </span>
      );
    }
    
    // Profile completion with progress bar
    if (column === 'profile_completion' && typeof value === 'number') {
      return (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[3rem]">
            {value}%
          </span>
        </div>
      );
    }
    
    // Role display with badges
    if (column === 'role' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((role, index) => (
            <span 
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : role === 'student' || role.includes('student')
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : role === 'instructor'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      );
    }
    
    // Status with colored badges
    if (column === 'status') {
      const statusColors = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        'Suspended': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        'published': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      };
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[value as keyof typeof statusColors] || statusColors['Inactive']
        }`}>
          {value}
        </span>
      );
    }

    // Priority with colored badges for announcements
    if (column === 'priority') {
      const priorityColors = {
        'high': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'urgent': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      };
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          priorityColors[value as keyof typeof priorityColors] || priorityColors['medium']
        }`}>
          {value}
        </span>
      );
    }

    // Type with colored badges for announcements
    if (column === 'type') {
      const typeColors = {
        'general': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'course': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'event': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        'system': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        'feature': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
      };
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          typeColors[value as keyof typeof typeColors] || typeColors['general']
        }`}>
          {value}
        </span>
      );
    }
    
    // Account type with badges
    if (column === 'account_type') {
      const typeColors = {
        'free': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        'premium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'enterprise': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      };
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
          typeColors[value as keyof typeof typeColors] || typeColors['free']
        }`}>
          {value}
        </span>
      );
    }
    
    // Date formatting
    if (typeof value === 'string' && (value.includes('T') || value.includes('-')) && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString([], { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
    
    // Enhanced object handling with better summaries for nested structures
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return (
            <span className="text-gray-400 text-xs italic">Empty</span>
          );
        }
        
        // Handle learning objectives array specifically
        if (column === 'learning_objectives' || (Array.isArray(value) && value.every(item => typeof item === 'string'))) {
          return (
            <div className="text-xs space-y-1">
              <div className="font-medium text-blue-600 dark:text-blue-400">
                {value.length} objectives
              </div>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {value.slice(0, 3).map((item, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400 truncate">
                    • {String(item)}
                  </div>
                ))}
                {value.length > 3 && (
                  <div className="text-gray-500 dark:text-gray-500 text-xs italic">
                    +{value.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          );
        }
        
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {value.length} items
          </span>
        );
      }
      
      // Handle course_description object specifically
      if (column === 'course_description' && value.program_overview) {
        return (
          <div className="text-xs space-y-2 max-w-xs">
            {value.program_overview && (
              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">Overview</div>
                <div className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {value.program_overview}
                </div>
              </div>
            )}
            {value.benefits && (
              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">Benefits</div>
                <div className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {value.benefits}
                </div>
              </div>
            )}
            {value.learning_objectives && Array.isArray(value.learning_objectives) && (
              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {value.learning_objectives.length} Objectives
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {value.learning_objectives.slice(0, 2).map((obj: string, index: number) => (
                    <div key={index} className="truncate">• {obj}</div>
                  ))}
                  {value.learning_objectives.length > 2 && (
                    <div className="text-gray-500 dark:text-gray-500 text-xs italic">
                      +{value.learning_objectives.length - 2} more...
                    </div>
                  )}
                </div>
              </div>
            )}
            {value.course_requirements && Array.isArray(value.course_requirements) && (
              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {value.course_requirements.length} Requirements
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {value.course_requirements.slice(0, 2).map((req: string, index: number) => (
                    <div key={index} className="truncate">• {req}</div>
                  ))}
                  {value.course_requirements.length > 2 && (
                    <div className="text-gray-500 dark:text-gray-500 text-xs italic">
                      +{value.course_requirements.length - 2} more...
                    </div>
                  )}
                </div>
              </div>
            )}
            {value.target_audience && Array.isArray(value.target_audience) && (
              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {value.target_audience.length} Target Audience
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {value.target_audience.slice(0, 2).map((audience: string, index: number) => (
                    <div key={index} className="truncate">• {audience}</div>
                  ))}
                  {value.target_audience.length > 2 && (
                    <div className="text-gray-500 dark:text-gray-500 text-xs italic">
                      +{value.target_audience.length - 2} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }
      
      // Handle course object
      if (value.course_title && value.course_category) {
        return (
          <div className="text-xs">
            <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{value.course_title}</div>
            <div className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{value.course_category}</div>
          </div>
        );
      }
      
      // Handle assigned_instructor object
      if (value.full_name && value.email && column === 'assigned_instructor') {
        return (
          <div className="text-xs">
            <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{value.full_name}</div>
            <div className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{value.email}</div>
          </div>
        );
      }
      
      // Handle enrolled_students_details array
      if (column === 'enrolled_students_details' && Array.isArray(value)) {
        const activeStudents = value.filter(student => student?.enrollment_status === 'active').length;
        const totalStudents = value.length;
        return (
          <div className="text-xs">
            <div className="font-medium">{activeStudents} active</div>
            <div className="text-gray-500">of {totalStudents} total</div>
          </div>
        );
      }
      
      // Handle schedule array
      if (column === 'schedule' && Array.isArray(value)) {
        const totalSessions = value.length;
        const recordedSessions = value.filter(session => 
          session.recorded_lessons && session.recorded_lessons.length > 0
        ).length;
        return (
          <div className="text-xs">
            <div className="font-medium">{totalSessions} sessions</div>
            <div className="text-gray-500">{recordedSessions} recorded</div>
          </div>
        );
      }
      
      // Show key summary for objects
      if (value.upload_date) {
        const date = new Date(value.upload_date);
        return (
          <div className="text-xs">
            <div className="font-medium">Uploaded</div>
            <div className="text-gray-500">{date.toLocaleDateString()}</div>
          </div>
        );
      }
      if (value.id || value._id) {
        return (
          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {String(value.id || value._id).substring(0, 8)}...
          </span>
        );
      }
      if (value.email) {
        return (
          <div className="text-xs">
            <div className="font-medium">{value.email}</div>
            {value.full_name && (
              <div className="text-gray-500">{value.full_name}</div>
            )}
          </div>
        );
      }
      
      // Enhanced handling for announcement-specific fields
      if (column === 'metadata' && value.featured !== undefined) {
        return (
          <div className="text-xs space-y-1">
            <div className="flex items-center space-x-2">
              {value.featured && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Featured
                </span>
              )}
              {value.allowComments && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Comments
                </span>
              )}
            </div>
            {value.sendNotification && (
              <div className="text-gray-500">Notification enabled</div>
            )}
          </div>
        );
      }

      if (column === 'actionButton' && value.type) {
        if (value.type === 'link') {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              Link
            </span>
          );
        }
        return (
          <div className="text-xs">
            <div className="font-medium">{value.text || 'Action'}</div>
            <div className="text-gray-500">{value.type}</div>
          </div>
        );
      }

      if (column === 'author' && value.full_name) {
        return (
          <div className="text-xs">
            <div className="font-medium">{value.full_name}</div>
            <div className="text-gray-500">{value.email}</div>
            {value.role && (
              <div className="text-gray-400">
                {Array.isArray(value.role) ? value.role.join(', ') : value.role}
              </div>
            )}
          </div>
        );
      }

      if (column === 'specificStudents' && Array.isArray(value)) {
        if (value.length === 0) {
          return (
            <span className="text-gray-400 text-xs italic">All users</span>
          );
        }
        return (
          <div className="text-xs">
            <div className="font-medium">{value.length} specific users</div>
            <div className="text-gray-500 max-h-16 overflow-y-auto">
              {value.slice(0, 2).map((student: any, index: number) => (
                <div key={index} className="truncate">
                  {student.full_name || student.email}
                </div>
              ))}
              {value.length > 2 && (
                <div className="text-gray-400 text-xs italic">
                  +{value.length - 2} more...
                </div>
              )}
            </div>
          </div>
        );
      }

      if (column === 'targetAudience' && Array.isArray(value)) {
        if (value.length === 0) {
          return (
            <span className="text-gray-400 text-xs italic">All users</span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((audience: string, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {audience}
              </span>
            ))}
          </div>
        );
      }

      if (column === 'tags' && Array.isArray(value)) {
        if (value.length === 0) {
          return (
            <span className="text-gray-400 text-xs italic">No tags</span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 3).map((tag: string, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
            {value.length > 3 && (
              <span className="text-gray-400 text-xs">
                +{value.length - 3}
              </span>
            )}
          </div>
        );
      }

      if (column === 'readBy' && Array.isArray(value)) {
        return (
          <div className="text-xs">
            <div className="font-medium">{value.length} readers</div>
            {value.length > 0 && (
              <div className="text-gray-500">
                Last: {new Date(value[value.length - 1]?.readAt || '').toLocaleDateString()}
              </div>
            )}
          </div>
        );
      }

      if (column === 'attachments' && Array.isArray(value)) {
        if (value.length === 0) {
          return (
            <span className="text-gray-400 text-xs italic">No attachments</span>
          );
        }
        return (
          <div className="text-xs">
            <div className="font-medium">{value.length} files</div>
            <div className="text-gray-500">
              {value.slice(0, 2).map((attachment: any, index: number) => (
                <div key={index} className="truncate">
                  {attachment.name || attachment.filename || 'File'}
                </div>
              ))}
              {value.length > 2 && (
                <div className="text-gray-400 text-xs italic">
                  +{value.length - 2} more...
                </div>
              )}
            </div>
          </div>
        );
      }

      // Enhanced handling for course-related nested objects
      if (value.program_overview || value.benefits || value.learning_objectives) {
        return (
          <div className="text-xs space-y-1">
            {value.program_overview && (
              <div className="text-gray-600 dark:text-gray-400 line-clamp-1">
                {value.program_overview}
              </div>
            )}
            {value.benefits && (
              <div className="text-gray-500 dark:text-gray-500 line-clamp-1">
                {value.benefits}
              </div>
            )}
            {value.learning_objectives && Array.isArray(value.learning_objectives) && (
              <div className="text-blue-600 dark:text-blue-400">
                {value.learning_objectives.length} objectives
              </div>
            )}
          </div>
        );
      }
      
      // Handle curriculum array
      if (column === 'curriculum' && Array.isArray(value)) {
        const totalWeeks = value.length;
        const totalSections = value.reduce((acc: number, week: any) => 
          acc + (week.sections ? week.sections.length : 0), 0);
        const totalLessons = value.reduce((acc: number, week: any) => 
          acc + (week.lessons ? week.lessons.length : 0), 0);
        
        return (
          <div className="text-xs space-y-1">
            <div className="font-medium text-blue-600 dark:text-blue-400">
              {totalWeeks} weeks
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {totalSections} sections, {totalLessons} lessons
            </div>
            {value.length > 0 && value[0].weekTitle && (
              <div className="text-gray-500 dark:text-gray-500 truncate">
                Week 1: {value[0].weekTitle}
              </div>
            )}
          </div>
        );
      }
      
      // Handle FAQs array
      if (column === 'faqs' && Array.isArray(value)) {
        return (
          <div className="text-xs space-y-1">
            <div className="font-medium text-green-600 dark:text-green-400">
              {value.length} FAQs
            </div>
            {value.length > 0 && value[0].question && (
              <div className="text-gray-600 dark:text-gray-400 line-clamp-2">
                Q: {value[0].question}
              </div>
            )}
          </div>
        );
      }
      
      // Handle meta object with ratings and stats
      if (column === 'meta' && value.ratings) {
        return (
          <div className="text-xs space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600 dark:text-yellow-400">
                ★ {value.ratings.average || 0}
              </span>
              <span className="text-gray-500 dark:text-gray-500">
                ({value.ratings.count || 0} reviews)
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {value.views || 0} views, {value.enrollments || 0} enrollments
            </div>
          </div>
        );
      }
      
      // Handle prices array
      if (column === 'prices' && Array.isArray(value)) {
        const activePrice = value.find((price: any) => price.is_active);
        if (activePrice) {
          return (
            <div className="text-xs space-y-1">
              <div className="font-medium text-green-600 dark:text-green-400">
                ${activePrice.individual} individual
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                ${activePrice.batch} batch ({activePrice.min_batch_size}-{activePrice.max_batch_size})
              </div>
            </div>
          );
        }
        return (
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {value.length} price options
          </span>
        );
      }
      
      // Handle final_evaluation object
      if (column === 'final_evaluation') {
        const quizCount = value.final_quizzes ? value.final_quizzes.length : 0;
        const assessmentCount = value.final_assessments ? value.final_assessments.length : 0;
        const hasCertification = value.certification !== null;
        
        return (
          <div className="text-xs space-y-1">
            <div className="font-medium text-purple-600 dark:text-purple-400">
              {quizCount} quizzes, {assessmentCount} assessments
            </div>
            {hasCertification && (
              <div className="text-green-600 dark:text-green-400">
                ✓ Certification available
              </div>
            )}
          </div>
        );
      }
      
      // Show a short summary for small objects
      const keys = Object.keys(value);
      if (keys.length <= 3) {
        return (
          <span className="text-xs bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
            {keys.map(key => `${key}: ${value[key]}`).join(', ')}
          </span>
        );
      }
      
      // For larger objects, show a structured summary
      return (
        <div className="text-xs space-y-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {keys.length} properties
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {keys.slice(0, 3).map(key => (
              <div key={key} className="truncate">
                {key}: {typeof value[key] === 'string' ? value[key] : typeof value[key]}
              </div>
            ))}
            {keys.length > 3 && (
              <div className="text-gray-500 dark:text-gray-500 italic">
                +{keys.length - 3} more...
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Long string truncation
    if (typeof value === 'string' && value.length > 40) {
      return (
        <span title={value} className="cursor-help">
          {value.substring(0, 40)}...
        </span>
      );
    }
    
    return String(value);
  };

  const getColumnDisplayName = (column: string): string => {
    // Comprehensive mapping for modern, clean column headers
    const columnMappings: Record<string, string> = {
      // User identification
      '_id': 'ID',
      'id': 'ID',
      'full_name': 'Full Name',
      'email': 'Email',
      'username': 'Username',
      'phone_number': 'Phone',
      'phone_numbers': 'Phone Numbers',
      
      // User status and verification
      'status': 'Status',
      'is_active': 'Active',
      'is_banned': 'Banned',
      'email_verified': 'Email Verified',
      'phone_verified': 'Phone Verified',
      'identity_verified': 'Identity Verified',
      'temp_password_verified': 'Temp Password Verified',
      'two_factor_enabled': '2FA Enabled',
      
      // Account details
      'account_type': 'Account Type',
      'membership_type': 'Membership',
      'subscription_status': 'Subscription',
      'trial_used': 'Trial Used',
      'role': 'Role',
      'permissions': 'Permissions',
      'admin_role': 'Admin Role',
      
      // Security and login
      'failed_login_attempts': 'Failed Logins',
      'password_change_attempts': 'Password Changes',
      'api_rate_limit': 'API Rate Limit',
      'backup_codes': 'Backup Codes',
      
      // Activity and presence
      'is_online': 'Online',
      'activity_status': 'Activity Status',
      'last_seen': 'Last Seen',
      'last_login': 'Last Login',
      'last_profile_update': 'Profile Updated',
      
      // Images and media
      'user_image': 'Profile Image',
      'cover_image': 'Cover Image',
      
      // Location and time
      'timezone': 'Timezone',
      'location': 'Location',
      
      // Collections and arrays
      'webhooks': 'Webhooks',
      'devices': 'Devices',
      'sessions': 'Sessions',
      'activity_log': 'Activity Log',
      'assign_department': 'Departments',
      
      // Metadata and preferences
      'preferences': 'Preferences',
      'statistics': 'Statistics',
      'profile_summary': 'Profile Summary',
      
      // Timestamps
      'created_at': 'Created',
      'updated_at': 'Updated',
      'createdAt': 'Created',
      'updatedAt': 'Updated',
      
      // Profile completion
      'profile_completion': 'Profile %',
      
      // Corporate
      'corporate_id': 'Corporate ID',
      
      // Version and system
      '__v': 'Version',
      'v': 'Version',
      
      // Announcement-specific fields
      'title': 'Title',
      'content': 'Content',
      'type': 'Type',
      'priority': 'Priority',
      'isSticky': 'Sticky',
      'isRead': 'Read',
      'viewCount': 'Views',
      'readCount': 'Read Count',
      'publishDate': 'Published',
      'scheduledPublishDate': 'Scheduled',
      'expiryDate': 'Expires',
      'isExpired': 'Expired',
      'shouldPublish': 'Should Publish',
      'date': 'Date',
      'metadata': 'Metadata',
      'actionButton': 'Action',
      'author': 'Author',
      'specificStudents': 'Target Students',
      'targetAudience': 'Target Audience',
      'categories': 'Categories',
      'tags': 'Tags',
      'relatedCourses': 'Related Courses',
      'courseId': 'Course',
      'readBy': 'Read By',
      'attachments': 'Attachments',
      'allowComments': 'Allow Comments',
      'sendNotification': 'Send Notification',
      'notificationSent': 'Notification Sent',
      'featured': 'Featured',
      
      // Analytics-specific fields
      'metric': 'Metric',
      'value': 'Value',
      'change': 'Change',
      'period': 'Period',
      'description': 'Description',
      'rowIndex': 'Row',
      
      // Batch-specific fields
      'batch_name': 'Batch Name',
      'batch_code': 'Batch Code',
      'course': 'Course',
      'assigned_instructor': 'Instructor',
      'enrolled_students': 'Enrolled Students',
      'enrolled_students_details': 'Student Details',
      'capacity': 'Capacity',
      'start_date': 'Start Date',
      'end_date': 'End Date',
      'schedule': 'Schedule',
      'batch_notes': 'Notes',
      'created_by': 'Created By',
      
      // Course-specific fields
      'course_title': 'Course Title',
      'course_subtitle': 'Course Subtitle',
      'course_category': 'Category',
      'course_subcategory': 'Subcategory',
      'course_tag': 'Tag',
      'course_fee': 'Fee',
      'course_duration': 'Duration',
      'course_description': 'Description',
      'program_overview': 'Program Overview',
      'benefits': 'Benefits',
      'learning_objectives': 'Learning Objectives',
      'course_level': 'Level',
      'language': 'Language',
      'no_of_Sessions': 'Sessions',
      'session_duration': 'Session Duration',
      'category_type': 'Category Type',
      'isFree': 'Free Course',
      'course_image': 'Image',
      'curriculum': 'Curriculum',
      'faqs': 'FAQs',
      'final_evaluation': 'Final Evaluation',
      'class_type': 'Class Type',
      'is_Certification': 'Certification',
      'is_Assignments': 'Assignments',
      'is_Projects': 'Projects',
      'is_Quizes': 'Quizzes',
      'related_courses': 'Related Courses',
      'meta': 'Meta Data',
      'prices': 'Pricing',
      'resource_pdfs': 'Resources',
      'tools_technologies': 'Tools & Tech',
      'bonus_modules': 'Bonus Modules',
      'unique_key': 'Unique Key',
      'slug': 'Slug',
      'show_in_home': 'Show in Home',
      'course_type': 'Course Type',
      'access_type': 'Access Type',
      'access_duration': 'Access Duration',
      'delivery_format': 'Delivery Format',
      'delivery_type': 'Delivery Type'
    };
    
    // Return mapped name or format the original
    if (columnMappings[column]) {
      return columnMappings[column];
    }
    
    // Fallback formatting for unmapped columns
    return column
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bid\b/gi, 'ID')
      .replace(/\bemail\b/gi, 'Email')
      .replace(/\bname\b/gi, 'Name')
      .replace(/\bdate\b/gi, 'Date')
      .replace(/\bstatus\b/gi, 'Status')
      .replace(/\bcreated\b/gi, 'Created')
      .replace(/\bupdated\b/gi, 'Updated')
      .replace(/\bverified\b/gi, 'Verified')
      .replace(/\bactive\b/gi, 'Active')
      .replace(/\bbanned\b/gi, 'Banned')
      .replace(/\bonline\b/gi, 'Online')
      .replace(/\bsession\b/gi, 'Session')
      .replace(/\bdevice\b/gi, 'Device')
      .replace(/\bphone\b/gi, 'Phone')
      .replace(/\bimage\b/gi, 'Image')
      .replace(/\bcover\b/gi, 'Cover')
      .replace(/\btimezone\b/gi, 'Timezone')
      .replace(/\bgeolocation\b/gi, 'Location')
      .replace(/\buser_agent\b/gi, 'User Agent')
      .replace(/\bip_address\b/gi, 'IP Address')
      .replace(/\b2fa\b/gi, '2FA')
      .replace(/\btwo_factor\b/gi, '2FA');
  };

  // Enhanced column filtering for better display
  const getFilteredColumns = (firstItem: any): string[] => {
    if (!firstItem || typeof firstItem !== 'object') {
      return [];
    }
    const allColumns = Object.keys(firstItem);
    
          // Always include these important fields if present
      const alwaysInclude = [
        '_id', 'email', 'full_name', 'phone_number', 'status', 
        'batch_name', 'batch_code', 'course', 'assigned_instructor',
        'course_title', 'course_category', 'course_subcategory', 'course_subtitle',
        'course_description', 'course_tag', 'course_fee', 'course_duration',
        'course_level', 'language', 'no_of_Sessions', 'session_duration',
        'category_type', 'isFree', 'course_image', 'curriculum', 'faqs',
        'final_evaluation', 'class_type', 'is_Certification', 'is_Assignments',
        'is_Projects', 'is_Quizes', 'related_courses', 'meta', 'prices',
        'resource_pdfs', 'tools_technologies', 'bonus_modules', 'createdAt',
        'updatedAt', 'unique_key', 'slug', 'show_in_home', 'course_type',
        'access_type', 'access_duration', 'delivery_format', 'delivery_type'
      ];
    
    let filtered = allColumns.filter(col => {
      const value = firstItem[col];
      if (alwaysInclude.includes(col)) return true;
      
      // Show all primitives
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
      
      // Show objects with a key summary (e.g., upload_date, id)
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // Show arrays (will render as Array(n))
          return true;
        }
        
        // Show objects with a key summary
        const keys = Object.keys(value);
        if (keys.includes('upload_date') || keys.includes('id') || keys.includes('_id')) return true;
        
        // Show important nested objects for batch data
        if (col === 'course' || col === 'assigned_instructor' || col === 'enrolled_students_details') return true;
        
        // Show course-related nested objects
        if (col === 'course_description' || 
            keys.includes('program_overview') || 
            keys.includes('benefits') || 
            keys.includes('learning_objectives')) {
          return true;
        }
        
        // If object is small or medium-sized, show it
        if (keys.length <= 8) return true;
        
        // For larger objects, only show if they have meaningful content
        const hasStringContent = keys.some(key => 
          typeof value[key] === 'string' && value[key].length > 0
        );
        const hasArrayContent = keys.some(key => 
          Array.isArray(value[key]) && value[key].length > 0
        );
        
        if (hasStringContent || hasArrayContent) return true;
        
        // Otherwise, skip deeply nested objects
        return false;
      }
      return false;
    });
    
    // If all columns are filtered out, fall back to all columns
    if (filtered.length === 0) {
      filtered = allColumns;
    }
    
    return filtered;
  };

  // Extract table data and pagination info
  const tableData = extractTableData(data);
  const paginationInfo = extractPaginationInfo(data);

  // When data loads, if it's users data, store all users in allUsers
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const isUsersData = tableData[0]?.full_name || tableData[0]?.email || tableData[0]?.phone_number;
      if (isUsersData) {
        // If server pagination, try to merge all pages (if possible)
        // For now, just set to tableData (should be all users if API returns all)
        setAllUsers(tableData);
      }
    }
  }, [tableData]);

  // Calculate role statistics for users data using allUsers
  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      const isUsersData = allUsers[0]?.full_name || allUsers[0]?.email || allUsers[0]?.phone_number;
      if (isUsersData) {
        const stats: {[key: string]: number} = { all: allUsers.length };
        allUsers.forEach((user: any) => {
          if (user.role && Array.isArray(user.role)) {
            user.role.forEach((role: string) => {
              stats[role] = (stats[role] || 0) + 1;
            });
          } else if (user.role && typeof user.role === 'string') {
            stats[user.role] = (stats[user.role] || 0) + 1;
          } else if (user.admin_role) {
            stats[user.admin_role] = (stats[user.admin_role] || 0) + 1;
          } else {
            stats['user'] = (stats['user'] || 0) + 1;
          }
        });
        setRoleStats(stats);
      }
    }
  }, [allUsers]);

  // Initialize column settings when data loads
  useEffect(() => {
    if (tableData && tableData.length > 0 && Object.keys(columnSettings).length === 0) {
      const columns = getFilteredColumns(tableData[0]);
      initializeColumnSettings(columns);
    }
  }, [tableData, columnSettings]);

  // Optimized filtering and sorting with useMemo - only recalculates when dependencies change
  const filteredData = useMemo(() => {
    let filtered = tableData;
    const isUsersData = (allUsers && allUsers.length > 0 && (allUsers[0]?.full_name || allUsers[0]?.email || allUsers[0]?.phone_number));

    // Apply role filtering for users data (pagination-independent, always on allUsers)
    if (isUsersData) {
      if (selectedRole !== 'all') {
        filtered = allUsers.filter((user: any) => {
          if (user.role && Array.isArray(user.role)) {
            return user.role.includes(selectedRole);
          } else if (user.role && typeof user.role === 'string') {
            return user.role === selectedRole;
          } else if (user.admin_role) {
            return user.admin_role === selectedRole;
          } else {
            return selectedRole === 'user';
          }
        });
      } else {
        filtered = allUsers;
      }
    } else {
      // Not users data, fallback to tableData
      filtered = tableData;
    }

    // Apply search and filters only for client-side pagination
    if ((search || searchFilters.length > 0) && !paginationInfo?.hasServerPagination && filtered.length > 0) {
      filtered = filtered.filter((row: any) => {
        // Simple search
        if (search) {
          const searchLower = search.toLowerCase();
          const hasSimpleMatch = Object.entries(row).some(([key, val]) => {
            if (val === null || val === undefined) return false;
            
            // Handle nested objects for better search
            if (typeof val === 'object' && val !== null) {
              if (key === 'course' && (val as any).course_title) {
                return (val as any).course_title.toLowerCase().includes(searchLower) ||
                       (val as any).course_category.toLowerCase().includes(searchLower);
              }
              if (key === 'assigned_instructor' && (val as any).full_name) {
                return (val as any).full_name.toLowerCase().includes(searchLower) ||
                       (val as any).email.toLowerCase().includes(searchLower);
              }
              if (key === 'enrolled_students_details' && Array.isArray(val)) {
                return val.some(student => 
                  (student as any)?.student?.full_name?.toLowerCase().includes(searchLower) ||
                  (student as any)?.student?.email?.toLowerCase().includes(searchLower)
                );
              }
              
              // Handle course_description nested object
              if (key === 'course_description' && typeof val === 'object') {
                const desc = val as any;
                return (desc.program_overview && desc.program_overview.toLowerCase().includes(searchLower)) ||
                       (desc.benefits && desc.benefits.toLowerCase().includes(searchLower)) ||
                       (desc.learning_objectives && Array.isArray(desc.learning_objectives) && 
                        desc.learning_objectives.some((obj: string) => obj.toLowerCase().includes(searchLower))) ||
                       (desc.course_requirements && Array.isArray(desc.course_requirements) && 
                        desc.course_requirements.some((req: string) => req.toLowerCase().includes(searchLower))) ||
                       (desc.target_audience && Array.isArray(desc.target_audience) && 
                        desc.target_audience.some((audience: string) => audience.toLowerCase().includes(searchLower)));
              }
              
              // Handle curriculum array
              if (key === 'curriculum' && Array.isArray(val)) {
                return val.some((week: any) => 
                  (week.weekTitle && week.weekTitle.toLowerCase().includes(searchLower)) ||
                  (week.weekDescription && week.weekDescription.toLowerCase().includes(searchLower)) ||
                  (week.topics && Array.isArray(week.topics) && 
                   week.topics.some((topic: string) => topic.toLowerCase().includes(searchLower)))
                );
              }
              
              // Handle FAQs array
              if (key === 'faqs' && Array.isArray(val)) {
                return val.some((faq: any) => 
                  (faq.question && faq.question.toLowerCase().includes(searchLower)) ||
                  (faq.answer && faq.answer.toLowerCase().includes(searchLower))
                );
              }
              
              // Handle meta object
              if (key === 'meta' && typeof val === 'object') {
                const meta = val as any;
                return (meta.ratings && meta.ratings.average && meta.ratings.average.toString().includes(searchLower)) ||
                       (meta.views && meta.views.toString().includes(searchLower)) ||
                       (meta.enrollments && meta.enrollments.toString().includes(searchLower));
              }
              
              // Handle any object with program_overview, benefits, or learning_objectives
              if (typeof val === 'object' && val !== null) {
                const obj = val as any;
                if (obj.program_overview && obj.program_overview.toLowerCase().includes(searchLower)) return true;
                if (obj.benefits && obj.benefits.toLowerCase().includes(searchLower)) return true;
                if (obj.learning_objectives && Array.isArray(obj.learning_objectives)) {
                  return obj.learning_objectives.some((item: string) => item.toLowerCase().includes(searchLower));
                }
              }
            }
            
            const stringVal = String(val).toLowerCase();
            return stringVal.includes(searchLower);
          });
          if (!hasSimpleMatch) return false;
        }
        
        // Advanced filters
        if (searchFilters.length > 0) {
          return searchFilters.every((filter, index) => {
            const columnValue = row[filter.column];
            if (columnValue === null || columnValue === undefined) return false;
            
            const filterValue = filter.value.toLowerCase();
            const columnString = String(columnValue).toLowerCase();
            
            let matches = false;
            switch (filter.operator) {
              case 'contains':
                matches = columnString.includes(filterValue);
                break;
              case 'exact':
                matches = columnString === filterValue;
                break;
              case 'starts':
                matches = columnString.startsWith(filterValue);
                break;
              case 'ends':
                matches = columnString.endsWith(filterValue);
                break;
              case 'gt':
                matches = Number(columnValue) > Number(filter.value);
                break;
              case 'lt':
                matches = Number(columnValue) < Number(filter.value);
                break;
              case 'gte':
                matches = Number(columnValue) >= Number(filter.value);
                break;
              case 'lte':
                matches = Number(columnValue) <= Number(filter.value);
                break;
            }
            
            // Apply logic (AND/OR)
            if (index === 0) return matches;
            const prevFilter = searchFilters[index - 1];
            if (prevFilter.logic === 'AND') {
              return matches;
            } else { // OR
              return matches || true; // Simplified OR logic
            }
          });
        }
        
        return true;
      });
    }
    
    // Apply sorting - always apply sorting regardless of pagination type
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        // Handle null/undefined values
        if (aVal === null || aVal === undefined) return sortDirection === 'asc' ? -1 : 1;
        if (bVal === null || bVal === undefined) return sortDirection === 'asc' ? 1 : -1;
        
        // Handle different data types
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const aStr = aVal.toLowerCase();
          const bStr = bVal.toLowerCase();
          if (aStr === bStr) return 0;
          return sortDirection === 'asc' ? (aStr > bStr ? 1 : -1) : (aStr < bStr ? 1 : -1);
        }
        
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          return sortDirection === 'asc' ? (aVal === bVal ? 0 : aVal ? 1 : -1) : (aVal === bVal ? 0 : aVal ? -1 : 1);
        }
        
        // Handle date strings
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
        }
        
        // Fallback to string comparison
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr === bStr) return 0;
        return sortDirection === 'asc' ? (aStr > bStr ? 1 : -1) : (aStr < bStr ? 1 : -1);
      });
    }
    
    return filtered;
  }, [tableData, allUsers, search, JSON.stringify(searchFilters), sortColumn, sortDirection, paginationInfo?.hasServerPagination, selectedRole]);

  // Update total records and total pages when data or pageSize changes (client-side)
  useEffect(() => {
    if (!paginationInfo?.hasServerPagination && tableData) {
      // Use filtered data length for total records when searching
      const dataToCount = search || searchFilters.length > 0 ? filteredData : tableData;
      setTotalRecords(dataToCount.length);
      const newTotalPages = Math.max(1, Math.ceil(dataToCount.length / pageSize));
      if (currentPage > newTotalPages) {
        setCurrentPage(1);
      }
    }
  }, [tableData, pageSize, paginationInfo, currentPage, search, searchFilters, filteredData.length]);

  // Reset search when data changes (only for client-side pagination)
  useEffect(() => {
    if (data && !paginationInfo?.hasServerPagination) {
      setSearch("");
      setSearchFilters([]);
      setSelectedRole('all'); // Reset role filter too
    }
  }, [data, paginationInfo?.hasServerPagination]);

  // Special handling for analytics data to ensure proper processing
  useEffect(() => {
    if (data && isAnalyticsData(extractTableData(data))) {
      console.log('Analytics data detected, ensuring proper processing...');
      // Force re-processing of analytics data
      const processedData = extractTableData(data);
      console.log('Processed analytics data:', processedData);
    }
  }, [data]);

  // Calculate pagination indices for display
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Memoized current page data - only recalculates when necessary
  const currentPageData = useMemo(() => {
    if (paginationInfo?.hasServerPagination) {
      // For server-side pagination, apply sorting to the filtered data
      if (sortColumn) {
        return [...filteredData].sort((a, b) => {
          const aVal = a[sortColumn];
          const bVal = b[sortColumn];
          
          // Handle null/undefined values
          if (aVal === null || aVal === undefined) return sortDirection === 'asc' ? -1 : 1;
          if (bVal === null || bVal === undefined) return sortDirection === 'asc' ? 1 : -1;
          
          // Handle different data types
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
          }
          
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            const aStr = aVal.toLowerCase();
            const bStr = bVal.toLowerCase();
            if (aStr === bStr) return 0;
            return sortDirection === 'asc' ? (aStr > bStr ? 1 : -1) : (aStr < bStr ? 1 : -1);
          }
          
          if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
            return sortDirection === 'asc' ? (aVal === bVal ? 0 : aVal ? 1 : -1) : (aVal === bVal ? 0 : aVal ? -1 : 1);
          }
          
          // Handle date strings
          const aDate = new Date(aVal);
          const bDate = new Date(bVal);
          if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
            return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
          }
          
          // Fallback to string comparison
          const aStr = String(aVal).toLowerCase();
          const bStr = String(bVal).toLowerCase();
          if (aStr === bStr) return 0;
          return sortDirection === 'asc' ? (aStr > bStr ? 1 : -1) : (aStr < bStr ? 1 : -1);
        });
      }
      return filteredData; // already filtered and paginated
    }
    
    const pageData = filteredData.slice(startIndex, endIndex);
    // Debug: log currentPageData
    console.log('currentPageData:', pageData);
    return pageData;
  }, [paginationInfo?.hasServerPagination, filteredData, startIndex, endIndex, sortColumn, sortDirection]);

  // Calculate total pages based on filtered data
  const totalPages = paginationInfo?.hasServerPagination 
    ? paginationInfo.totalPages 
    : Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Calculate the actual total records for display
  const displayTotalRecords = paginationInfo?.hasServerPagination 
    ? paginationInfo.total 
    : (search || searchFilters.length > 0 ? filteredData.length : tableData.length);

  // Get columns for search interface - available even when no data
  const columns = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];
    const firstItem = tableData[0];
    return getFilteredColumns(firstItem);
  }, [tableData]);
  
  // Reset to first page when data changes (for client-side pagination)
  useEffect(() => {
    if (!paginationInfo?.hasServerPagination && tableData.length > 0) {
      setCurrentPage(1);
    }
  }, [tableData.length, paginationInfo?.hasServerPagination]);

  // Enhanced pagination controls for courses and users
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    
    // Check if this is users data and handle client-side pagination
    const isUsersData = tableData.length > 0 && (tableData[0]?.full_name || tableData[0]?.email || tableData[0]?.phone_number);
    const paginationInfo = extractPaginationInfo(data);
    
    if (isUsersData && !paginationInfo?.hasServerPagination) {
      // For users, just update the current page - no need to fetch again
      return;
    }
    
    // If server pagination is detected, make a new API call
    if (paginationInfo?.hasServerPagination) {
      // Use course-specific fetching for better data validation
      fetchCourseData(validPage, pageSize);
    }
  };

  // Enhanced page jumping for courses
  const handlePageJump = () => {
    const page = parseInt(pageJumpValue);
    if (page && page >= 1 && page <= totalPages) {
      goToPage(page);
      setPageJumpValue('');
      setShowPageJump(false);
    }
  };

  // Enhanced page size options for different data types
  const getCoursePageSizeOptions = () => {
    const isCourseData = tableData.length > 0 && tableData[0]?.course_title;
    const isUsersData = tableData.length > 0 && (tableData[0]?.full_name || tableData[0]?.email || tableData[0]?.phone_number);
    
    if (isCourseData) {
      return [10, 25, 50, 100, 200]; // Larger options for courses to show all 95 courses
    } else if (isUsersData) {
      return [100, 10, 25, 50, 200]; // 100 first for users, then other options
    }
    return [10, 25, 50, 100];
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Wrapper functions for button handlers
  const handleRefresh = () => fetchData();
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    
    // Check if this is users data and handle client-side pagination
    const isUsersData = tableData.length > 0 && (tableData[0]?.full_name || tableData[0]?.email || tableData[0]?.phone_number);
    const paginationInfo = extractPaginationInfo(data);
    
    if (isUsersData && !paginationInfo?.hasServerPagination) {
      // For users, just update the page size - no need to fetch again
      return;
    }
    
    // For other endpoints, fetch with new page size
    fetchData(1, newPageSize);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const renderPagination = () => {
    // Hide pagination for courses when showing all courses
    const isCourseData = tableData.length > 0 && tableData[0]?.course_title;
    const isUsersData = tableData.length > 0 && (tableData[0]?.full_name || tableData[0]?.email || tableData[0]?.phone_number);
    const isShowingAllCourses = isCourseData && pageSize >= displayTotalRecords;
    
    // For users, always show pagination unless we're showing all users and there's only one page
    if (totalPages <= 1 || isShowingAllCourses) return null;

    const pageSizeOptions = getCoursePageSizeOptions();

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = isCourseData ? 7 : 7; // More page numbers for courses
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {/* Enhanced Page Size Selector for Courses and Users */}
          <div className="flex items-center space-x-2">
            <label htmlFor="page-size" className="text-sm text-gray-600 dark:text-gray-400">
              {isCourseData ? 'Courses per page' : isUsersData ? 'Users per page' : 'Show'}
            </label>
            <div className="relative">
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="appearance-none pr-8 pl-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                style={{ minWidth: 56 }}
                aria-label="Items per page"
                disabled={paginationLoading}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isCourseData ? 'courses' : isUsersData ? 'users' : 'per page'}
            </span>

            {paginationLoading && (
              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Loading...</span>
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, displayTotalRecords)} of {displayTotalRecords} results
            </span>
            {/* Show total courses/users info for course/user data */}
            {isCourseData && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                {displayTotalRecords} total courses
              </span>
            )}
            {isUsersData && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                {displayTotalRecords} total users
              </span>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            {/* First Page Button */}
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="First page"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>

            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => goToPage(page as number)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last page"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (!tableData || tableData.length === 0) {
      // If server pagination and not on first page, offer to reset to page 1
      if (paginationInfo?.hasServerPagination && currentPage > 1) {
        return (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data for This Page</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              The API returned no data for page {currentPage}. This might be the last page or there might be an issue with the pagination.
            </p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => goToPage(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to First Page
              </button>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl w-full">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">API Response for debugging:</p>
              <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        );
      }
      // Otherwise, show standard no data message
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Table className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data Available</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            No data is available to display in table format. The API response might be empty or in an unexpected format.
          </p>
          {data && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl w-full">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Response structure: {Object.keys(data).join(', ')}</p>
              <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    }

    const firstItem = currentPageData[0];
    console.log('First item:', firstItem);
    console.log('First item type:', typeof firstItem);
    console.log('First item keys:', firstItem ? Object.keys(firstItem) : 'null');
    
    const columns = getFilteredColumns(firstItem);
    console.log('Filtered columns:', columns);
    
    // If no columns found, show a message with debugging info
    if (columns.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Invalid Data Structure</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            The data structure could not be parsed for table display. This might be due to unexpected data format.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl w-full space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Debug Information:</p>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>Table data length: {tableData.length}</p>
              <p>Current page data length: {currentPageData.length}</p>
              <p>First item type: {typeof firstItem}</p>
              <p>First item keys: {firstItem ? Object.keys(firstItem).join(', ') : 'null'}</p>
              <p>Filtered columns count: {columns.length}</p>
            </div>
            {firstItem && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sample first item values:</p>
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32 bg-white dark:bg-gray-900 p-2 rounded">
                  {JSON.stringify(Object.fromEntries(
                    Object.entries(firstItem).slice(0, 5).map(([key, value]) => [
                      key, 
                      typeof value === 'object' ? `[${typeof value}]` : value
                    ])
                  ), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Column Settings Panel */}
        {showColumnSettings && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Column Settings</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetColumnSettings}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowColumnSettings(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {getFilteredColumns(firstItem).map((column) => (
                <div key={column} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-700 rounded border">
                  <input
                    type="checkbox"
                    checked={columnSettings[column]?.visible !== false}
                    onChange={() => toggleColumnVisibility(column)}
                    className="rounded"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                    {getColumnDisplayName(column)}
                  </span>
                  <button
                    onClick={() => toggleColumnFreeze(column)}
                    className={`p-1 rounded text-xs ${
                      columnSettings[column]?.frozen 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={columnSettings[column]?.frozen ? 'Unfreeze column' : 'Freeze column'}
                  >
                    📌
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Header with Actions */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Table ({currentPageData.length} items)
              </h3>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                {getVisibleColumns().length} columns
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {sortColumn && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                  <span>Sorted by: {getColumnDisplayName(sortColumn)}</span>
                  <button
                    onClick={() => {
                      setSortColumn(null);
                      setSortDirection('asc');
                    }}
                    className="ml-2 p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
                    title="Clear sorting"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button 
                onClick={handleCopy}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4 inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Role Filter Navigation for Users */}
        {tableData && tableData.length > 0 && (tableData[0]?.full_name || tableData[0]?.email || tableData[0]?.phone_number) && Object.keys(roleStats).length > 1 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">Filter by Role:</span>
                <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                  {Object.entries(roleStats)
                    .sort(([a], [b]) => a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b))
                    .map(([role, count]) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2 ${
                        selectedRole === role
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="capitalize">
                        {role === 'all' ? 'All Users' : role}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedRole === role
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedRole !== 'all' && (
                <button
                  onClick={() => setSelectedRole('all')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Flexible Table */}
        <div className="flex-1 overflow-auto min-h-0">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  {getVisibleColumns().map((column, index) => (
                    <th
                      key={column}
                      className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-700 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 ${
                        columnSettings[column]?.frozen ? 'sticky left-0 bg-gray-50 dark:bg-gray-800 z-20' : ''
                      }`}
                      style={{ 
                        width: columnSettings[column]?.width || getDefaultColumnWidth(column),
                        minWidth: columnSettings[column]?.width || getDefaultColumnWidth(column)
                      }}
                      onClick={() => {
                        if (sortColumn === column) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortColumn(column);
                          setSortDirection('asc');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (sortColumn === column) {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortColumn(column);
                            setSortDirection('asc');
                          }
                        }
                      }}
                      tabIndex={0}
                      aria-sort={sortColumn === column ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                      title={`Click to sort by ${getColumnDisplayName(column)}`}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="flex items-center space-x-1">
                          {getColumnDisplayName(column)}
                          {/* Sort indicator */}
                          {sortColumn === column ? (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1" /> : 
                              <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1" />
                          ) : (
                            <div className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50 transition-opacity">
                              <ArrowUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </span>
                        {/* Column resize handle */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setResizingColumn(column);
                            const startX = e.clientX;
                            const startWidth = columnSettings[column]?.width || getDefaultColumnWidth(column);
                            
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const deltaX = moveEvent.clientX - startX;
                              const newWidth = startWidth + deltaX;
                              resizeColumn(column, newWidth);
                            };
                            
                            const handleMouseUp = () => {
                              setResizingColumn(null);
                              document.removeEventListener('mousemove', handleMouseMove);
                              document.removeEventListener('mouseup', handleMouseUp);
                            };
                            
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                          }}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                 {currentPageData.map((row: any, rowIndex: number) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {getVisibleColumns().map((column) => (
                      <td
                        key={column}
                        className={`px-6 py-3 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 ${
                          columnSettings[column]?.frozen ? 'sticky left-0 bg-white dark:bg-gray-900 z-10' : ''
                        }`}
                        style={{ 
                          width: columnSettings[column]?.width || getDefaultColumnWidth(column),
                          minWidth: columnSettings[column]?.width || getDefaultColumnWidth(column)
                        }}
                      >
                        {formatValue(row[column], column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Modern Pagination */}
        <div className="flex-shrink-0">
          {renderPagination()}
        </div>
        
        {/* Table Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Total records: {totalRecords}</span>
              <span>Columns: {columns.length}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              {paginationInfo?.hasServerPagination && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                  Server paginated
                </span>
              )}
              <span className="text-xs">
                Data: {tableData.length} items | Current page: {currentPageData.length} items
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyticsDashboard = () => {
    if (!tableData || tableData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Analytics Data</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            No analytics data is available to display in dashboard format.
          </p>
        </div>
      );
    }

    // Group data by type
    const overviewMetrics = tableData.filter((item: any) => 
      item.Type === 'overview' || item.type === 'overview'
    );
    const distributionMetrics = tableData.filter((item: any) => 
      item.Type === 'distribution' || item.type === 'distribution'
    );
    const assignmentMetrics = tableData.filter((item: any) => 
      item.Type === 'assignment' || item.type === 'assignment'
    );
    const instructorMetrics = tableData.filter((item: any) => 
      item.Type === 'instructor' || item.type === 'instructor'
    );
    const analysisMetrics = tableData.filter((item: any) => 
      item.Type === 'analysis' || item.type === 'analysis'
    );
    const detailedMetrics = tableData.filter((item: any) => 
      item.Type === 'detailed' || item.type === 'detailed'
    );
    const geographicMetrics = tableData.filter((item: any) => 
      item.Type === 'geographic' || item.type === 'geographic'
    );
    const courseMetrics = tableData.filter((item: any) => 
      item.Type === 'course' || item.type === 'course'
    );
    const insightMetrics = tableData.filter((item: any) => 
      item.Type === 'insight' || item.type === 'insight'
    );
    const otherMetrics = tableData.filter((item: any) => 
      !['overview', 'distribution', 'assignment', 'instructor', 'analysis', 'detailed', 'geographic', 'course', 'insight'].includes(item.Type || item.type)
    );

    const getMetricColor = (metricName: string, type?: string): string => {
      // Enhanced color mapping with type-based fallbacks
      const colors: { [key: string]: string } = {
        // Overview metrics
        'Total Batches': 'bg-blue-500',
        'Total Enrollments': 'bg-green-500',
        'Capacity Utilization': 'bg-purple-500',
        'Instructor Efficiency': 'bg-orange-500',
        'Financial Performance': 'bg-emerald-500',
        'Active Students': 'bg-green-500',
        'Active Batches': 'bg-orange-500',
        'Individual Assignments': 'bg-indigo-500',
        'Unassigned Students': 'bg-red-500',
        'Total Revenue': 'bg-emerald-500',
        'Average Rating': 'bg-yellow-500',
        'Completion Rate': 'bg-teal-500',
        
        // Performance metrics
        'Success Rate': 'bg-green-500',
        'Retention Rate': 'bg-blue-500',
        'Average Duration': 'bg-purple-500',
        
        // Engagement metrics
        'Average Attendance': 'bg-green-500',
        'Assignment Completion': 'bg-blue-500',
        'Satisfaction Score': 'bg-yellow-500',
        'Feedback Response Rate': 'bg-purple-500',
        
        // Operational metrics
        'Instructor Utilization': 'bg-orange-500',
        'Resource Efficiency': 'bg-teal-500',
        'Cost Per Student': 'bg-red-500',
        'Profit Margin': 'bg-emerald-500',
        
        // Geographic metrics
        'North India Students': 'bg-blue-500',
        'South India Students': 'bg-green-500',
        'East India Students': 'bg-purple-500',
        'West India Students': 'bg-orange-500',
        'International Students': 'bg-indigo-500',
        
        // Course metrics
        'Unknown Courses': 'bg-gray-500',
        'Blended Courses': 'bg-blue-500',
        'Live Courses': 'bg-green-500',
        'Self-Paced Courses': 'bg-purple-500',
        
        // Insight metrics
        'Insight 1': 'bg-red-500',
        'Insight 2': 'bg-orange-500',
        'Insight 3': 'bg-yellow-500'
      };
      
      // Type-based color fallbacks
      const typeColors: { [key: string]: string } = {
        'overview': 'bg-blue-500',
        'detailed': 'bg-purple-500',
        'geographic': 'bg-green-500',
        'course': 'bg-orange-500',
        'insight': 'bg-red-500',
        'performance': 'bg-teal-500',
        'engagement': 'bg-indigo-500',
        'operations': 'bg-emerald-500'
      };
      
      return colors[metricName] || typeColors[type || ''] || 'bg-gray-500';
    };

    const getChangeColor = (change: any): string => {
      if (change === null || change === undefined || change === 'undefined') {
        return 'text-gray-600 dark:text-gray-400'; // Neutral color for 0 values
      }
      if (typeof change === 'number') {
        return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
      }
      if (typeof change === 'string') {
        if (change === 'undefined' || change === 'null') {
          return 'text-gray-600 dark:text-gray-400'; // Neutral color for 0 values
        }
        const numChange = parseFloat(change);
        return isNaN(numChange) ? 'text-gray-600 dark:text-gray-400' : 
               numChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
      }
      return 'text-gray-600 dark:text-gray-400';
    };

    const formatMetricValue = (value: any, metricName?: string): string => {
      if (typeof value === 'number') {
        // Special case for capacity utilization - show as percentage
        if (metricName && metricName.toLowerCase().includes('capacity') && metricName.toLowerCase().includes('utilization')) {
          return `${value}%`;
        }
        // If it's a large number, format with commas
        if (value >= 1000) {
          return value.toLocaleString();
        }
        return value.toString();
      }
      if (typeof value === 'string') {
        // Try to parse as number
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (numValue >= 1000) {
            return numValue.toLocaleString();
          }
          return numValue.toString();
        }
        return value;
      }
      return String(value);
    };

    const formatChange = (change: any): string => {
      console.log('formatChange called with:', change, 'type:', typeof change);
      
      // More comprehensive undefined/null checking
      if (change === null || change === undefined || change === 'undefined' || change === 'null' || change === '') {
        console.log('formatChange: returning 0% for null/undefined value');
        return '0%'; // Return 0% instead of '-' for consistency
      }
      if (typeof change === 'number') {
        const result = change >= 0 ? `+${change}%` : `${change}%`;
        console.log('formatChange: returning', result, 'for number');
        return result;
      }
      if (typeof change === 'string') {
        // Additional string checks
        if (change === 'undefined' || change === 'null' || change === '' || change.toLowerCase() === 'undefined' || change.toLowerCase() === 'null') {
          console.log('formatChange: returning 0% for undefined/null string');
          return '0%'; // Return 0% instead of '-' for consistency
        }
        const numChange = parseFloat(change);
        if (!isNaN(numChange)) {
          const result = numChange >= 0 ? `+${numChange}%` : `${numChange}%`;
          console.log('formatChange: returning', result, 'for parsed number');
          return result;
        }
        // If it's a string that can't be parsed as number, return 0%
        console.log('formatChange: returning 0% for unparseable string');
        return '0%';
      }
      // For any other type, return 0%
      console.log('formatChange: returning 0% for other type');
      return '0%';
    };

    return (
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        {/* Overview Metrics Grid */}
        {overviewMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Overview Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overviewMetrics.map((metric: any, index: number) => (
                <div key={`overview-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-xl ${getMetricColor(metric.Metric || metric.metric, metric.Type || metric.type)} flex items-center justify-center mx-auto mb-3`}>
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-sm font-medium ${getChangeColor(metric.Change || metric.change || 0)}`}>
                      {formatChange(metric.Change || metric.change || 0)}
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                    {metric.Description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        {metric.Description}
                      </p>
                    )}
                    {/* Show current vs previous for detailed metrics */}
                    {metric.Current !== undefined && metric.Previous !== undefined && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Current:</span> {metric.Current} | <span className="font-medium">Previous:</span> {metric.Previous}
                      </div>
                    )}
                    {metric.Trend && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          metric.Trend === 'increasing' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          metric.Trend === 'decreasing' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {metric.Trend}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{metric.Period || metric.period || 'Last 30 days'}</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {metric.Type || metric.type || 'overview'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Distribution Metrics */}
        {distributionMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Batch Status Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {distributionMetrics.map((metric: any, index: number) => (
                <div key={`distribution-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mx-auto mb-2">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {formatChange(metric.Change || metric.change || 0)}
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {metric.Description || metric.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Metrics */}
        {assignmentMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Assignment Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {assignmentMetrics.map((metric: any, index: number) => (
                <div key={`assignment-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {formatChange(metric.Change || metric.change || 0)}
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {metric.Description || metric.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructor Metrics */}
        {instructorMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              Instructor Workload
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Utilization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Workload
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {instructorMetrics.map((metric: any, index: number) => (
                      <tr key={`instructor-${metric.Metric || metric.metric}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {metric.Metric || metric.metric}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getChangeColor(metric.Change || metric.change || 0)}`}>
                          {formatChange(metric.Change || metric.change || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {metric.Description || metric.description || ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Metrics */}
        {analysisMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Analysis Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisMetrics.map((metric: any, index: number) => (
                <div key={`analysis-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center mx-auto mb-2">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-teal-600 dark:text-teal-400">
                      {formatChange(metric.Change || metric.change || 0)}
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {metric.Description || metric.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Metrics */}
        {detailedMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Detailed Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detailedMetrics.map((metric: any, index: number) => (
                <div key={`detailed-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-center mb-3">
                    <div className={`w-12 h-12 rounded-lg ${getMetricColor(metric.Metric || metric.metric, metric.Type || metric.type)} flex items-center justify-center mx-auto mb-2`}>
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {formatChange(metric.Change || metric.change || 0)}
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {metric.Description || metric.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geographic Metrics */}
        {geographicMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Geographic Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {geographicMetrics.map((metric: any, index: number) => (
                <div key={`geographic-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-center mb-3">
                    <div className={`w-12 h-12 rounded-lg ${getMetricColor(metric.Metric || metric.metric, metric.Type || metric.type)} flex items-center justify-center mx-auto mb-2`}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatChange(metric.Change || metric.change || 0)}
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {metric.Description || metric.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Metrics */}
        {courseMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Course Type Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseMetrics.map((metric: any, index: number) => (
                <div key={`course-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-center mb-3">
                    <div className={`w-12 h-12 rounded-lg ${getMetricColor(metric.Metric || metric.metric, metric.Type || metric.type)} flex items-center justify-center mx-auto mb-2`}>
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {formatChange(metric.Change || metric.change || 0)}
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {metric.Description || metric.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insight Metrics */}
        {insightMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Insights & Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insightMetrics.map((metric: any, index: number) => (
                <div key={`insight-${metric.Metric || metric.metric}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-center mb-3">
                    <div className={`w-12 h-12 rounded-lg ${getMetricColor(metric.Metric || metric.metric, metric.Type || metric.type)} flex items-center justify-center mx-auto mb-2`}>
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-sm font-medium ${
                      metric.Value === 'high' ? 'text-red-600 dark:text-red-400' :
                      metric.Value === 'medium' ? 'text-orange-600 dark:text-orange-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {metric.Value} priority
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {metric.Period || metric.period}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {metric.Metric || metric.metric}
                    </p>
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {metric.Description || metric.description || ''}
                  </div>
                  {metric.Impact && (
                    <div className="mt-2 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        metric.Impact === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        metric.Impact === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {metric.Impact} impact
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Metrics */}
        {otherMetrics.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Additional Metrics
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {otherMetrics.map((metric: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {metric.Metric || metric.metric}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatMetricValue(metric.Value || metric.value, metric.Metric || metric.metric)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getChangeColor(metric.Change || metric.change)}`}>
                          {formatChange(metric.Change || metric.change)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {metric.Period || metric.period || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                            {metric.Type || metric.type || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {tableData.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {overviewMetrics.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Overview</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {distributionMetrics.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Distribution</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {assignmentMetrics.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {instructorMetrics.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {analysisMetrics.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {detailedMetrics.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Detailed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {insightMetrics.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Insights</div>
            </div>
          </div>
        </div>




      </div>
    );
  };

  const renderJson = () => {
    if (!data) return null;

    return (
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* JSON Header */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">JSON Response</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {JSON.stringify(data).length} characters
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4 inline mr-2" />
                Copy
              </button>
            </div>
          </div>
        </div>
        
        {/* JSON Content - Scrollable */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <pre className="h-full text-sm text-gray-800 dark:text-gray-200 overflow-auto bg-white dark:bg-gray-900 p-4 font-mono leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  // Generate CSV for export
  const generateCSV = (data: any[]) => {
    if (data.length === 0) return '';

    const header = Object.keys(data[0]).map(col => getColumnDisplayName(col));
    const rows = data.map(item => {
      return Object.values(item).map(val => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`; // Handle quotes and commas
        }
        return String(val);
      }).join(',');
    });

    return [header.join(','), ...rows].join('\n');
  };

  // Helper to build API params for server-side search/filter
  const buildApiParams = () => {
    const params: any = { page: currentPage, limit: pageSize };
    if (search) params.search = search;
    if (searchFilters.length > 0) {
      params.filters = searchFilters.map(f => ({
        column: f.column,
        operator: f.operator,
        value: f.value,
        logic: f.logic
      }));
    }
    return params;
  };

  // Optimized search handler - only updates data, not entire component
  const handleSearch = async () => {
    if (paginationInfo?.hasServerPagination) {
      setLoading(true);
      try {
        const res = await fetcher(buildApiParams());
        setData(res);
        setCurrentPage(1); // Reset to page 1 on new search
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    // For client-side, no API call needed - filtering happens in render
  };

  // Debounced search for better performance
  useEffect(() => {
    if (paginationInfo?.hasServerPagination) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [search, JSON.stringify(searchFilters)]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Refresh on Ctrl+R
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        handleRefresh();
      }
      
      // Copy on Ctrl+C
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      }
      
      // Toggle view mode on Ctrl+T
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        if (viewMode === 'table') {
          setViewMode('json');
        } else if (viewMode === 'json') {
          // Only switch to dashboard if analytics data is available
          if (tableData && isAnalyticsData(tableData)) {
            setViewMode('dashboard');
          } else {
            setViewMode('table');
          }
        } else {
          setViewMode('table');
        }
      }
      
      // Clear sort on Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        setSortColumn(null);
        setSortDirection('asc');
      }
      
      // Navigation shortcuts
      if (e.ctrlKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (currentPage > 1) goToPage(currentPage - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (currentPage < totalPages) goToPage(currentPage + 1);
            break;
          case 'Home':
            e.preventDefault();
            goToPage(1);
            break;
          case 'End':
            e.preventDefault();
            goToPage(totalPages);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, currentPage, totalPages, viewMode, onClose, handleRefresh, handleCopy, goToPage]);

  // Column management functions
  const initializeColumnSettings = (columns: string[]) => {
    const newSettings: { [key: string]: { visible: boolean; width: number; order: number; frozen: boolean } } = {};
    columns.forEach((column, index) => {
      newSettings[column] = {
        visible: true,
        width: getDefaultColumnWidth(column),
        order: index,
        frozen: false
      };
    });
    setColumnSettings(newSettings);
  };

  const getDefaultColumnWidth = (column: string): number => {
    // Default widths based on column type
    const widthMap: { [key: string]: number } = {
      '_id': 200,
      'course_title': 300,
      'course_subtitle': 250,
      'course_description': 400,
      'course_category': 150,
      'course_subcategory': 150,
      'course_fee': 100,
      'status': 120,
      'created_at': 150,
      'updated_at': 150,
      'instructor': 200,
      'curriculum': 200,
      'faqs': 200,
      'meta': 200,
      'pricing': 200,
      'default': 150
    };
    return widthMap[column] || widthMap['default'];
  };

  const toggleColumnVisibility = (column: string) => {
    setColumnSettings(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        visible: !prev[column]?.visible
      }
    }));
  };

  const resizeColumn = (column: string, newWidth: number) => {
    setColumnSettings(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        width: Math.max(100, Math.min(800, newWidth)) // Min 100px, Max 800px
      }
    }));
  };

  const reorderColumn = (fromIndex: number, toIndex: number) => {
    const visibleColumns = getVisibleColumns();
    const [movedColumn] = visibleColumns.splice(fromIndex, 1);
    visibleColumns.splice(toIndex, 0, movedColumn);
    
    setColumnSettings(prev => {
      const newSettings = { ...prev };
      visibleColumns.forEach((column, index) => {
        if (newSettings[column]) {
          newSettings[column].order = index;
        }
      });
      return newSettings;
    });
  };

  const toggleColumnFreeze = (column: string) => {
    setColumnSettings(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        frozen: !prev[column]?.frozen
      }
    }));
  };

  const getVisibleColumns = (): string[] => {
    if (!tableData || tableData.length === 0) return [];
    
    const allColumns = getFilteredColumns(tableData[0]);
    return allColumns
      .filter(column => columnSettings[column]?.visible !== false)
      .sort((a, b) => (columnSettings[a]?.order || 0) - (columnSettings[b]?.order || 0));
  };

  const resetColumnSettings = () => {
    if (!tableData || tableData.length === 0) return;
    const columns = getFilteredColumns(tableData[0]);
    initializeColumnSettings(columns);
  };

  if (!open) return null;

  return (
    <>
      <style>{styles}</style>
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ${fullPage ? 'p-0' : 'p-4'}`}>
      <div
        className={
          fullPage
            ? 'fixed inset-0 z-50 w-screen h-screen max-w-none max-h-none bg-white dark:bg-gray-900 flex flex-col rounded-none shadow-none border-none'
            : 'bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full h-full max-h-[95vh] flex flex-col border border-gray-200/50 dark:border-gray-700/50'
        }
        style={fullPage ? { margin: 0, padding: 0 } : {}}
      >
        {/* Modern Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md font-mono text-xs">{method}</span>
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{endpoint}</span>
            </div>
            {/* Show All Courses button in header for course endpoints */}
            {(endpoint.includes('/courses') || endpoint.includes('/tcourse')) && (
              <button
                onClick={() => {
                  const isCourseData = tableData.length > 0 && tableData[0]?.course_title;
                  if (isCourseData && displayTotalRecords > 0) {
                    handlePageSizeChange(displayTotalRecords);
                  }
                }}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                title="Show all courses"
              >
                <span>Show All Courses</span>
                {displayTotalRecords > 0 && (
                  <span className="text-xs bg-green-700 px-2 py-1 rounded">
                    {displayTotalRecords}
                  </span>
                )}
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Table className="w-4 h-4" />
                  <span>Table</span>
                </div>
              </button>
              {isAnalyticsData(tableData) && (
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'dashboard'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </button>
              )}
              <button
                onClick={() => setViewMode('json')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'json'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>JSON</span>
                </div>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search all columns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Column Settings Button */}
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
              title="Column settings"
            >
              <Filter className="w-5 h-5" />
            </button>

            <button
              onClick={() => setFullPage(f => !f)}
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
              title={fullPage ? 'Exit full page' : 'Full page view'}
            >
              {fullPage ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleRefresh} 
              disabled={loading} 
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Refresh data (Ctrl+R)"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleCopy} 
              disabled={!data} 
              className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Copy JSON (Ctrl+C)"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
              title="Keyboard shortcuts: Esc=Close, Ctrl+R=Refresh, Ctrl+C=Copy, Ctrl+T=Toggle view, Ctrl+S=Clear sort, Ctrl+←/→=Navigate"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        
        {/* Advanced Controls */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            {/* Status Indicators */}
            <div className="flex items-center space-x-4 text-sm">
              {loading && (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Loading...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              {data && !loading && !error && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Data loaded successfully</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Loading Skeleton */}
          {loading && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-md space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}



          {/* Data Content */}
          {!loading && !error && data && (
            <div className="flex-1 overflow-hidden">
              {viewMode === 'table' ? renderTable() : 
               viewMode === 'dashboard' ? renderAnalyticsDashboard() : 
               renderJson()}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !data && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">No data is available to display in table format. The API response might be empty or in an unexpected format.</p>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Response structure: status, data, message</p>
                  <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32 bg-white dark:bg-gray-900 p-2 rounded">
{`{
  "status": "success",
  "data": {
    "success": true,
    "count": 0,
    "total": 0,
    "totalPages": 0,
    "currentPage": 1,
    "data": []
  },
  "message": "Request successful"
}`}
                  </pre>
                </div>
                <button 
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Feedback */}
        {copied && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <Copy className="w-4 h-4" />
              <span>Copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ApiPanel; 