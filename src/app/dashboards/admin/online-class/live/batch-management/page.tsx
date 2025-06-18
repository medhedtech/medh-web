"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  User,
  BookOpen,
  Settings,
  Eye,
  MoreVertical,
  Download,
  Upload,
  BarChart3,
  UserPlus,
  UserCheck,
  RefreshCw,
  CheckCircle,
  X,
  EyeIcon,
  UsersIcon,
  Edit,
  Settings2,
  UserCog,
  PlayCircle,
  StopCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { motion, AnimatePresence } from 'framer-motion';
import UnifiedBatchModal from '@/components/shared/modals/UnifiedBatchModal';
import BatchStudentEnrollment from '@/components/Dashboard/admin/BatchStudentEnrollment';
import BatchAnalytics from '@/components/Dashboard/admin/BatchAnalytics';
import StudentAnalytics from '@/components/Dashboard/admin/StudentAnalytics';
import { 
  batchAPI, 
  batchUtils,
  type IBatchWithDetails,
  type IBatchQueryParams,
  type TBatchStatus,
  type TBatchType,
  type IIndividualBatchCreateInput
} from '@/apis/batch';
import { courseAPI, courseTypesAPI } from '@/apis/courses';
import type { ILiveCourse } from '@/apis/courses';
import { individualAssignmentAPI } from '@/apis/instructor-assignments';
import { apiClient } from '@/apis/apiClient';
import { apiUrls, apiBaseUrl } from '@/apis/index';
import InstructorAssignmentModal from '@/components/shared/modals/InstructorAssignmentModal';

// Updated interface to match live course structure
interface ICourse {
  _id: string;
  course_title: string;
  course_category: string;
  course_image?: string;
  course_type?: 'live';
  class_type?: string;
}

interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
}

// Updated interface to match API response
interface IBatchResponse {
  success: boolean;
  count: number;
  totalBatches: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: IBatchFromAPI[];
}

// Updated interface to handle instructor object
interface IBatchFromAPI {
  _id: string;
  batch_name: string;
  batch_code?: string;
  course: {
    _id: string;
    course_category: string;
    course_title: string;
    course_image?: string;
  };
  status: TBatchStatus;
  batch_type?: TBatchType;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled_students: number;
  assigned_instructor: {
    _id: string;
    full_name: string;
    email: string;
    phone_numbers?: Array<{
      country: string;
      number: string;
    }>;
  } | string | null;
  schedule: Array<{
    date: string;
    start_time: string;
    end_time: string;
    title?: string;
    description?: string;
    _id: string;
  }>;
  batch_notes?: string;
  student_id?: string;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  enrolled_students_details?: any[];
}

// Add payment plan type
type TPaymentPlan = 'full_payment' | 'installment';

const BatchManagementPage: React.FC = () => {
  // State Management
  const [batches, setBatches] = useState<IBatchFromAPI[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TBatchStatus | ''>('');
  const [batchTypeFilter, setBatchTypeFilter] = useState<TBatchType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBatchDetails, setShowBatchDetails] = useState(false);
  const [showStudentManagement, setShowStudentManagement] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState<'batches' | 'analytics'>('batches');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Enhanced student management state
  const [studentManagementTab, setStudentManagementTab] = useState<'management' | 'analytics'>('management');
  
  // Instructor Assignment Modal State
  const [showInstructorAssignment, setShowInstructorAssignment] = useState(false);
  const [instructorAssignmentType, setInstructorAssignmentType] = useState<'student' | 'course'>('course');
  const [instructorAssignmentTarget, setInstructorAssignmentTarget] = useState<any>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  
  // Add unified modal state
  const [showUnifiedBatchModal, setShowUnifiedBatchModal] = useState<false | 'group' | 'individual'>(false);
  const [unifiedModalInitialData, setUnifiedModalInitialData] = useState<any>(null);

  // Add back selectedBatch and setSelectedBatch state
  const [selectedBatch, setSelectedBatch] = useState<IBatchFromAPI | null>(null);

  // Enhanced refresh system state
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Status color mapping
  const statusColors: Record<TBatchStatus, string> = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Completed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  // Fetch initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (courses.length > 0) {
      fetchBatches();
    }
  }, [selectedCourse, statusFilter, searchQuery, currentPage, batchTypeFilter]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  // Debug courses state changes
  useEffect(() => {
    console.log('📊 Courses state updated:', {
      courseCount: courses.length,
      courses: courses.slice(0, 3).map(c => ({ id: c._id, title: c.course_title }))
    });
  }, [courses]);

  // Dropdown management functions
  const toggleDropdown = (batchId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === batchId ? null : batchId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const loadInitialBatches = async () => {
    try {
      const params: IBatchQueryParams = {
        page: 1,
        limit: 10,
        sort_by: 'start_date',
        sort_order: 'desc'
      };

      // Get all batches initially
      const apiResponse = await batchAPI.getAllBatches(params);
      
      let batchesData: IBatchFromAPI[] = [];
      let totalPagesCount = 1;
      
      // Handle the API response structure - check if it's in the expected format
      if (apiResponse?.data) {
        // Check if it's a wrapped response format
        if ((apiResponse.data as any)?.success && (apiResponse.data as any)?.data) {
          // Wrapped response format
          const wrappedResponse = (apiResponse.data as unknown) as IBatchResponse;
          batchesData = wrappedResponse.data;
          totalPagesCount = wrappedResponse.totalPages || 1;
        } else if (Array.isArray(apiResponse.data)) {
          // Convert IBatchWithDetails[] to IBatchFromAPI[] format
          const batchList = apiResponse.data as unknown as IBatchWithDetails[];
          batchesData = batchList.map(batch => ({
            _id: batch._id || '',
            batch_name: batch.batch_name,
            batch_code: batch.batch_code,
            course: batch.course_details ? {
              _id: batch.course_details._id,
              course_category: batch.course_details.course_category,
              course_title: batch.course_details.course_title,
              course_image: batch.course_details.course_image
            } : {
              _id: typeof batch.course === 'string' ? batch.course : '',
              course_category: 'Unknown',
              course_title: 'Unknown Course',
              course_image: ''
            },
            status: batch.status,
            start_date: typeof batch.start_date === 'string' ? batch.start_date : batch.start_date.toISOString(),
            end_date: typeof batch.end_date === 'string' ? batch.end_date : batch.end_date.toISOString(),
            capacity: batch.capacity,
            enrolled_students: batch.enrolled_students,
            assigned_instructor: batch.assigned_instructor || null,
            schedule: batch.schedule?.map((s, index) => ({
              date: s.date || new Date().toISOString().split('T')[0], // Provide default date if missing
              start_time: s.start_time,
              end_time: s.end_time,
              title: s.title,
              description: s.description,
              _id: `schedule_${index}`
            })) || [],
            batch_notes: batch.batch_notes,
            created_by: batch.created_by,
            createdAt: batch.createdAt || new Date().toISOString(),
            updatedAt: batch.updatedAt || new Date().toISOString()
          }));
        }
      }

      // Update state with the real API response
      setBatches(batchesData);
      setTotalPages(totalPagesCount);
      
    } catch (error) {
      console.error('Error loading initial batches:', error);
      
      // Fallback to mock data for development
      setBatches([
        {
          _id: '6836a82a46d3493bc170d011',
          batch_name: 'Digital Marketing - Morning Batch',
          batch_code: 'DMWDA-458682',
          course: {
            _id: '67c194158a56e7688ddcf320',
            course_category: 'Digital Marketing with Data Analytics',
            course_title: 'Digital Marketing with Data Analytics',
            course_image: 'https://medhdocuments.s3.ap-south-1.amazonaws.com/images-paper/1740738436760.jpeg'
          },
          status: 'Upcoming',
          start_date: '2025-05-13T00:00:00.000Z',
          end_date: '2025-12-14T00:00:00.000Z',
          capacity: 10,
          enrolled_students: 0,
          assigned_instructor: null,
          schedule: [
            {
              date: new Date().toISOString().split('T')[0], // Provide default date if missing
              start_time: '09:00',
              end_time: '11:00',
              title: 'Monday',
              description: 'Comprehensive digital marketing course',
              _id: '6836a82a46d3493bc170d012'
            }
          ],
          batch_notes: 'Comprehensive digital marketing course',
          created_by: '680092818c413e0442bf10dd',
          createdAt: '2025-05-28T06:07:38.694Z',
          updatedAt: '2025-05-28T06:07:38.694Z'
        }
      ]);
    }
  };

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load courses using the proper course API
      try {
        console.log('🔄 Starting course fetch...');
        const coursesResponse = await courseAPI.getAllCourses();
        console.log('📡 Raw API response:', coursesResponse);
        
        // Cast to any to handle the actual response structure that doesn't match the interface
        const response = coursesResponse as any;
        console.log('🔍 Response structure check:', {
          hasData: !!response?.data,
          hasSuccess: !!response?.data?.success,
          hasDataArray: !!response?.data?.data && Array.isArray(response.data.data),
          hasCourses: !!response?.data?.courses && Array.isArray(response.data.courses),
          responseType: typeof response,
          dataType: typeof response?.data
        });
        
        // Check the actual response structure based on your API response
        if (response?.data?.success && response.data.data && Array.isArray(response.data.data)) {
          console.log('✅ Using success + data structure, course count:', response.data.data.length);
          // Transform the courses data to match our interface
          const transformedCourses: ICourse[] = response.data.data.map((course: any) => ({
            _id: course._id,
            course_title: course.course_title,
            course_category: course.course_category,
            course_image: course.course_image,
            course_type: course.course_type || 'live',
            class_type: course.class_type
          }));
          setCourses(transformedCourses);
          console.log('✅ Courses loaded successfully:', transformedCourses.length);
          console.log('📋 Sample course:', transformedCourses[0]);
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          console.log('✅ Using data structure (no success field), course count:', response.data.data.length);
          // Handle case where success field might not be present
          const transformedCourses: ICourse[] = response.data.data.map((course: any) => ({
            _id: course._id,
            course_title: course.course_title,
            course_category: course.course_category,
            course_image: course.course_image,
            course_type: course.course_type || 'live',
            class_type: course.class_type
          }));
          setCourses(transformedCourses);
          console.log('✅ Courses loaded successfully (no success field):', transformedCourses.length);
          console.log('📋 Sample course:', transformedCourses[0]);
        } else if (coursesResponse?.data?.courses && Array.isArray(coursesResponse.data.courses)) {
          console.log('✅ Using legacy courses structure, course count:', coursesResponse.data.courses.length);
          // Fallback to the old expected structure
          const transformedCourses: ICourse[] = coursesResponse.data.courses.map((course: any) => ({
            _id: course._id || course.id,
            course_title: course.title || course.course_title || '',
            course_category: course.course_category || course.category || '',
            course_image: course.course_image || course.image,
            course_type: course.course_type || 'live',
            class_type: course.class_type
          }));
          setCourses(transformedCourses);
          console.log('✅ Courses loaded successfully (legacy structure):', transformedCourses.length);
          console.log('📋 Sample course:', transformedCourses[0]);
        } else {
          console.warn('⚠️ Unexpected courses response structure:', response);
          console.log('🔍 Detailed response structure:', JSON.stringify(response, null, 2));
          // Fallback to mock data
          setCourses([
            { _id: '67c194158a56e7688ddcf320', course_title: 'Digital Marketing with Data Analytics', course_category: 'Digital Marketing' },
            { _id: '2', course_title: 'AI and Data Science Fundamentals', course_category: 'Technology' },
            { _id: '3', course_title: 'Vedic Mathematics', course_category: 'Education' },
            { _id: '4', course_title: 'Personality Development', course_category: 'Personal Growth' }
          ]);
          console.log('📋 Using fallback courses');
        }
      } catch (courseError) {
        console.error('Course API failed:', courseError);
        setCourses([
          { _id: '67c194158a56e7688ddcf320', course_title: 'Digital Marketing with Data Analytics', course_category: 'Digital Marketing' },
          { _id: '2', course_title: 'AI and Data Science Fundamentals', course_category: 'Technology' },
          { _id: '3', course_title: 'Vedic Mathematics', course_category: 'Education' },
          { _id: '4', course_title: 'Personality Development', course_category: 'Personal Growth' }
        ]);
      }
      
      // Load instructors using the proper instructor API
      try {
        const instructorsResponse = await individualAssignmentAPI.getAllStudentsWithInstructors();
        
        if (instructorsResponse?.data?.data && Array.isArray(instructorsResponse.data.data)) {
          // Extract unique instructors from the response
          const instructorSet = new Set();
          const uniqueInstructors: IInstructor[] = [];
          
          instructorsResponse.data.data.forEach((student: any) => {
            if (student.instructor_details && student.instructor_details._id && !instructorSet.has(student.instructor_details._id)) {
              instructorSet.add(student.instructor_details._id);
              uniqueInstructors.push({
                _id: student.instructor_details._id,
                full_name: student.instructor_details.full_name,
                email: student.instructor_details.email,
                phone_number: student.instructor_details.phone_number
              });
            }
          });
          
          if (uniqueInstructors.length > 0) {
            setInstructors(uniqueInstructors);
          } else {
            throw new Error('No instructors found in response');
          }
        } else {
          throw new Error('Invalid instructor response format');
        }
      } catch (instructorError) {
        console.warn('Instructor API failed, using fallback data:', instructorError);
        // Fallback to mock data
        setInstructors([
          { _id: '1', full_name: 'Dr. Sarah Johnson', email: 'sarah.johnson@medh.com' },
          { _id: '2', full_name: 'Prof. Michael Chen', email: 'michael.chen@medh.com' },
          { _id: '3', full_name: 'Dr. Priya Sharma', email: 'priya.sharma@medh.com' },
          { _id: '4', full_name: 'Mr. Alex Rodriguez', email: 'alex.rodriguez@medh.com' }
        ]);
      }
      
      // Load initial batches (all batches) after courses and instructors are loaded
      await loadInitialBatches();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      
      // Complete fallback to mock data
      setCourses([
        { _id: '67c194158a56e7688ddcf320', course_title: 'Digital Marketing with Data Analytics', course_category: 'Digital Marketing' },
        { _id: '2', course_title: 'AI and Data Science Fundamentals', course_category: 'Technology' },
        { _id: '3', course_title: 'Vedic Mathematics', course_category: 'Education' },
        { _id: '4', course_title: 'Personality Development', course_category: 'Personal Growth' }
      ]);
      setInstructors([
        { _id: '1', full_name: 'Dr. Sarah Johnson', email: 'sarah.johnson@medh.com' },
        { _id: '2', full_name: 'Prof. Michael Chen', email: 'michael.chen@medh.com' },
        { _id: '3', full_name: 'Dr. Priya Sharma', email: 'priya.sharma@medh.com' },
        { _id: '4', full_name: 'Mr. Alex Rodriguez', email: 'alex.rodriguez@medh.com' }
      ]);
      
      // Load initial batches even on error
      await loadInitialBatches();
    } finally {
      setLoading(false);
      console.log('🏁 loadInitialData completed. Final state:', {
        coursesCount: courses.length,
        instructorsCount: instructors.length,
        loading: false
      });
    }
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const params: IBatchQueryParams = {
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(batchTypeFilter && { batch_type: batchTypeFilter }), // Add batch_type filter
        ...(searchQuery && { search: searchQuery }),
        sort_by: 'start_date',
        sort_order: 'desc'
      };

      let batchesData: IBatchFromAPI[] = [];
      let totalPagesCount = 1;
      
      if (selectedCourse) {
        // Get batches for specific course
        const apiResponse = await batchAPI.getBatchesByCourse(selectedCourse, params);
        
        // Handle the API response structure - check if it's in the expected format
        if (apiResponse?.data) {
          // Check if it's a wrapped response format
          if ((apiResponse.data as any)?.success && (apiResponse.data as any)?.data) {
            // Wrapped response format
            const wrappedResponse = (apiResponse.data as unknown) as IBatchResponse;
            batchesData = wrappedResponse.data;
            totalPagesCount = wrappedResponse.totalPages || 1;
          } else if (Array.isArray(apiResponse.data)) {
            // Convert IBatchWithDetails[] to IBatchFromAPI[] format
            const batchList = apiResponse.data as unknown as IBatchWithDetails[];
            batchesData = batchList.map(batch => ({
              _id: batch._id || '',
              batch_name: batch.batch_name,
              batch_code: batch.batch_code,
              course: batch.course_details ? {
                _id: batch.course_details._id,
                course_category: batch.course_details.course_category,
                course_title: batch.course_details.course_title,
                course_image: batch.course_details.course_image
              } : {
                _id: typeof batch.course === 'string' ? batch.course : '',
                course_category: 'Unknown',
                course_title: 'Unknown Course',
                course_image: ''
              },
              status: batch.status,
              batch_type: batch.batch_type, // Include batch_type in mapping
              start_date: typeof batch.start_date === 'string' ? batch.start_date : batch.start_date.toISOString(),
              end_date: typeof batch.end_date === 'string' ? batch.end_date : batch.end_date.toISOString(),
              capacity: batch.capacity,
              enrolled_students: batch.enrolled_students,
              assigned_instructor: batch.assigned_instructor || null,
              schedule: batch.schedule?.map((s, index) => ({
                date: s.date || new Date().toISOString().split('T')[0], // Provide default date if missing
                start_time: s.start_time,
                end_time: s.end_time,
                title: s.title,
                description: s.description,
                _id: `schedule_${index}`
              })) || [],
              batch_notes: batch.batch_notes,
              created_by: batch.created_by,
              createdAt: batch.createdAt || new Date().toISOString(),
              updatedAt: batch.updatedAt || new Date().toISOString()
            }));
          }
        }
      } else {
        // Get all batches
        const apiResponse = await batchAPI.getAllBatches(params);
        
        // Handle the API response structure - check if it's in the expected format
        if (apiResponse?.data) {
          // Check if it's a wrapped response format
          if ((apiResponse.data as any)?.success && (apiResponse.data as any)?.data) {
            // Wrapped response format
            const wrappedResponse = (apiResponse.data as unknown) as IBatchResponse;
            batchesData = wrappedResponse.data;
            totalPagesCount = wrappedResponse.totalPages || 1;
          } else if (Array.isArray(apiResponse.data)) {
            // Convert IBatchWithDetails[] to IBatchFromAPI[] format
            const batchList = apiResponse.data as unknown as IBatchWithDetails[];
            batchesData = batchList.map(batch => ({
              _id: batch._id || '',
              batch_name: batch.batch_name,
              batch_code: batch.batch_code,
              course: batch.course_details ? {
                _id: batch.course_details._id,
                course_category: batch.course_details.course_category,
                course_title: batch.course_details.course_title,
                course_image: batch.course_details.course_image
              } : {
                _id: typeof batch.course === 'string' ? batch.course : '',
                course_category: 'Unknown',
                course_title: 'Unknown Course',
                course_image: ''
              },
              status: batch.status,
              batch_type: batch.batch_type, // Include batch_type in mapping
              start_date: typeof batch.start_date === 'string' ? batch.start_date : batch.start_date.toISOString(),
              end_date: typeof batch.end_date === 'string' ? batch.end_date : batch.end_date.toISOString(),
              capacity: batch.capacity,
              enrolled_students: batch.enrolled_students,
              assigned_instructor: batch.assigned_instructor || null,
              schedule: batch.schedule?.map((s, index) => ({
                date: s.date || new Date().toISOString().split('T')[0], // Provide default date if missing
                start_time: s.start_time,
                end_time: s.end_time,
                title: s.title,
                description: s.description,
                _id: `schedule_${index}`
              })) || [],
              batch_notes: batch.batch_notes,
              created_by: batch.created_by,
              createdAt: batch.createdAt || new Date().toISOString(),
              updatedAt: batch.updatedAt || new Date().toISOString()
            }));
          }
        }
      }

      // Apply client-side filtering if API doesn't support batch_type parameter
      if (batchTypeFilter && !params.batch_type) {
        batchesData = batchesData.filter(batch => {
          if (batchTypeFilter === 'individual') {
            return batch.batch_type === 'individual' || batch.capacity === 1;
          } else if (batchTypeFilter === 'group') {
            return batch.batch_type === 'group' || (batch.capacity > 1 && batch.batch_type !== 'individual');
          }
          return true;
        });
      }

      // Update state with the real API response
      setBatches(batchesData);
      setTotalPages(totalPagesCount);
      
    } catch (error) {
      console.error('Error fetching batches:', error);
      
      showToast.error('Failed to load batches. Using fallback data for development.');
      
      // Fallback to mock data for development
      if (selectedCourse === '67c194158a56e7688ddcf320') {
        setBatches([
          {
            _id: '6836a82a46d3493bc170d011',
            batch_name: 'Digital Marketing - Morning Batch',
            batch_code: 'DMWDA-458682',
            course: {
              _id: '67c194158a56e7688ddcf320',
              course_category: 'Digital Marketing with Data Analytics',
              course_title: 'Digital Marketing with Data Analytics',
              course_image: 'https://medhdocuments.s3.ap-south-1.amazonaws.com/images-paper/1740738436760.jpeg'
            },
            status: 'Upcoming',
            batch_type: 'group', // Add batch_type to mock data
            start_date: '2025-05-13T00:00:00.000Z',
            end_date: '2025-12-14T00:00:00.000Z',
            capacity: 10,
            enrolled_students: 0,
            assigned_instructor: null,
            schedule: [
              {
                date: new Date().toISOString().split('T')[0], // Provide default date if missing
                start_time: '09:00',
                end_time: '11:00',
                title: 'Monday',
                description: 'Comprehensive digital marketing course',
                _id: '6836a82a46d3493bc170d012'
              }
            ],
            batch_notes: 'Comprehensive digital marketing course',
            created_by: '680092818c413e0442bf10dd',
            createdAt: '2025-05-28T06:07:38.694Z',
            updatedAt: '2025-05-28T06:07:38.694Z'
          }
        ]);
      } else {
        setBatches([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter batches based on type (client-side filtering)
  const getFilteredBatches = () => {
    if (!batchTypeFilter) return batches;
    
    return batches.filter(batch => {
      if (batchTypeFilter === 'individual') {
        return batch.batch_type === 'individual' || batch.capacity === 1;
      } else if (batchTypeFilter === 'group') {
        return batch.batch_type === 'group' || (batch.capacity > 1 && batch.batch_type !== 'individual');
      }
      return true;
    });
  };

  const handleCreateBatch = () => {
    setUnifiedModalInitialData({ course: selectedCourse });
    setShowUnifiedBatchModal('group');
  };

  const handleCreateIndividualBatch = () => {
    setUnifiedModalInitialData({ course: selectedCourse });
    setShowUnifiedBatchModal('individual');
  };

  const handleDeleteBatch = async (batchId: string, batchName: string) => {
    if (!confirm(`Are you sure you want to delete "${batchName}"? This action cannot be undone.`)) {
      return;
    }

    // Optimistic update
    const originalBatches = [...batches];
    setBatches(prev => prev.filter(b => b._id !== batchId));

    try {
      const response = await batchAPI.deleteBatch(batchId);
      
      if (response?.data?.success) {
        showToast.success('Batch deleted successfully');
        // Refresh data to ensure consistency
        await refreshData({ source: 'delete_batch' });
      } else {
        throw new Error('Failed to delete batch');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      // Rollback optimistic update
      setBatches(originalBatches);
      showToast.error('Failed to delete batch');
    }
  };

  const handleViewBatchDetails = (batch: IBatchFromAPI) => {
    setSelectedBatch(batch);
    setShowBatchDetails(true);
  };

  const handleManageStudents = (batch: IBatchFromAPI) => {
    setSelectedBatch(batch);
    setShowStudentManagement(true);
  };

  const handleAssignInstructorToCourse = (course: ICourse) => {
    setInstructorAssignmentType('course');
    setInstructorAssignmentTarget(course);
    setShowInstructorAssignment(true);
  };

  const handleAssignInstructorToStudent = (student: any) => {
    setInstructorAssignmentType('student');
    setInstructorAssignmentTarget(student);
    setShowInstructorAssignment(true);
  };

  const onModalSuccess = async () => {
    await refreshData({ showLoading: true, source: 'modal_success' });
  };

  const onInstructorAssignmentSuccess = async () => {
    setShowInstructorAssignment(false);
    setInstructorAssignmentTarget(null);
    await refreshData({ showLoading: true, source: 'instructor_assignment' });
    showToast.success('Instructor assignment completed successfully!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusTransitions = (currentStatus: TBatchStatus): TBatchStatus[] => {
    switch (currentStatus) {
      case 'Active':
        return ['Completed', 'Cancelled'];
      case 'Upcoming':
        return ['Active'];
      case 'Completed':
        return ['Active'];
      case 'Cancelled':
        return ['Active'];
      default:
        return [];
    }
  };

  const getStatusIcon = (status: TBatchStatus) => {
    const icons = {
      'Upcoming': <Clock className="h-4 w-4" />,
      'Active': <PlayCircle className="h-4 w-4" />,
      'Completed': <CheckCircle2 className="h-4 w-4" />,
      'Cancelled': <XCircle className="h-4 w-4" />
    };
    return icons[status];
  };

  const handleStatusUpdate = async (batchId: string, newStatus: TBatchStatus) => {
    // Optimistic update
    const originalBatches = [...batches];
    setBatches(prev => prev.map(batch =>
      batch._id === batchId ? { ...batch, status: newStatus } : batch
    ));

    try {
      setStatusUpdateLoading(batchId);
      const response = await batchAPI.updateBatchStatus(batchId, newStatus);
      
      if ((response as any)?.data) {
        showToast.success('Batch status updated successfully');
        closeDropdown();
        // Refresh data to ensure consistency
        await refreshData({ source: 'status_update' });
      } else {
        throw new Error('Failed to update batch status');
      }
    } catch (error) {
      console.error('Error updating batch status:', error);
      // Rollback optimistic update
      setBatches(originalBatches);
      showToast.error('Failed to update batch status');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Helper function to get instructor name
  const getInstructorName = (assignedInstructor: typeof batches[0]['assigned_instructor']): string | null => {
    if (!assignedInstructor) return null;
    
    // If it's an object with instructor details
    if (typeof assignedInstructor === 'object' && assignedInstructor.full_name) {
      return assignedInstructor.full_name;
    }
    
    // If it's a string ID, find in instructors array
    if (typeof assignedInstructor === 'string') {
      return instructors.find(i => i._id === assignedInstructor)?.full_name || null;
    }
    
    return null;
  };

  // Helper function to get instructor email
  const getInstructorEmail = (assignedInstructor: typeof batches[0]['assigned_instructor']): string | null => {
    if (!assignedInstructor) return null;
    
    // If it's an object with instructor details
    if (typeof assignedInstructor === 'object' && assignedInstructor.email) {
      return assignedInstructor.email;
    }
    
    // If it's a string ID, find in instructors array
    if (typeof assignedInstructor === 'string') {
      return instructors.find(i => i._id === assignedInstructor)?.email || null;
    }
    
    return null;
  };

  // Helper function to get instructor ID
  const getInstructorId = (assignedInstructor: typeof batches[0]['assigned_instructor']): string | null => {
    if (!assignedInstructor) return null;
    
    // If it's an object with instructor details
    if (typeof assignedInstructor === 'object' && assignedInstructor._id) {
      return assignedInstructor._id;
    }
    
    // If it's a string ID
    if (typeof assignedInstructor === 'string') {
      return assignedInstructor;
    }
    
    return null;
  };

  // Type guard to check if instructor is an object with details
  const isInstructorObject = (instructor: typeof batches[0]['assigned_instructor']): instructor is {
    _id: string;
    full_name: string;
    email: string;
    phone_numbers?: Array<{
      country: string;
      number: string;
    }>;
  } => {
    return instructor !== null && typeof instructor === 'object' && 'full_name' in instructor;
  };

  // Helper function to handle individual batch creation
  const handleCreateIndividualBatchSubmit = async (formData: any) => {
    try {
      setLoading(true);
      
      // Validate individual batch requirements
      if (formData.capacity && formData.capacity !== 1) {
        showToast.error('Individual batch type can only have capacity of 1');
        return;
      }
      
      const individualBatchData: IIndividualBatchCreateInput = {
        student_id: formData.student_id, // Optional - if provided, student will be auto-enrolled
        instructor_id: formData.instructor_id,
        course_id: formData.course_id,
        batch_name: formData.batch_name,
        batch_type: 'individual', // Enforce individual type
        capacity: 1, // Enforce capacity of 1
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        schedule: formData.schedule,
        batch_notes: formData.batch_notes
      };

      const response = await batchAPI.createIndividualBatch(individualBatchData);
      
      // Handle the enhanced response format with both batch and enrollment data
      if (response?.data?.success) {
        const { batch, enrollment } = response.data.data;
        
        let successMessage = 'Individual batch created successfully!';
        if (enrollment) {
          successMessage = 'Individual batch created and student enrolled successfully!';
        }
        
        showToast.success(successMessage);
        setShowUnifiedBatchModal(false);
        fetchBatches(); // Refresh the batch list
        
        // Log the enrollment details for debugging
        if (enrollment) {
          console.log('Student enrollment details:', {
            student_id: enrollment.student,
            batch_id: enrollment.batch,
            enrollment_type: enrollment.enrollment_type,
            pricing_type: enrollment.pricing_snapshot.pricing_type
          });
        }
      } else {
        throw new Error(response?.data?.message || 'Failed to create individual batch');
      }
    } catch (error: any) {
      console.error('Error creating individual batch:', error);
      
      // Handle specific error messages from the API
      if (error.message.includes('capacity')) {
        showToast.error('Individual batch type can only have capacity of 1');
      } else if (error.message.includes('batch_type')) {
        showToast.error('Invalid batch_type. Must be "individual" for individual batches');
      } else if (error.message.includes('Course ID')) {
        showToast.error('Course selection is required for individual batch creation');
      } else if (error.message.includes('student_id') || error.message.includes('student')) {
        showToast.error('Student selection is required for individual batch with auto-enrollment');
      } else {
        showToast.error(error.message || 'Failed to create individual batch');
      }
    } finally {
      setLoading(false);
    }
  };

  // Individual Batch Creation Modal Component
  const IndividualBatchModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
  }> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      course: '',
      instructor: '',
      student: '',
      batch_name: '',
      start_date: '',
      end_date: '',
      schedule: [{ 
        date: '', 
        start_time: '09:00', 
        end_time: '11:00',
        title: '',
        description: ''
      }],
      notes: '',
      batch_type: 'individual' as const,
      capacity: 1,
      session_duration_minutes: 60,
      total_sessions: 10
    });

    // Local state for modal data loading
    const [modalLoading, setModalLoading] = useState(false);
    const [modalInstructors, setModalInstructors] = useState<IInstructor[]>([]);
    const [modalCourses, setModalCourses] = useState<ICourse[]>([]);
    const [modalStudents, setModalStudents] = useState<any[]>([]);

    // Fetch instructors from API without fallback
    const fetchModalInstructors = async () => {
      try {
        setModalLoading(true);
        
        const response = await apiClient.get(`${apiBaseUrl}${apiUrls.Instructor.getAllInstructors}`);
        
        if (response?.data) {
          let instructorsList: IInstructor[] = [];
          
          if (response.data.success && response.data.data) {
            instructorsList = Array.isArray(response.data.data) ? response.data.data : [];
          } else if (response.data.instructors) {
            instructorsList = Array.isArray(response.data.instructors) ? response.data.instructors : [];
          } else if (Array.isArray(response.data)) {
            instructorsList = response.data;
          } else if (response.data.users) {
            instructorsList = Array.isArray(response.data.users) ? response.data.users : [];
          }
          
          // Transform and filter data to match our interface
          const transformedInstructors = instructorsList
            .filter((instructor: any) => {
              const roles = instructor.role || instructor.roles || [];
              const hasInstructorRole = Array.isArray(roles) 
                ? roles.some((role: string) => role.toLowerCase().includes('instructor'))
                : typeof roles === 'string' && roles.toLowerCase().includes('instructor');
              return hasInstructorRole || instructor.admin_role === 'instructor';
            })
            .map((instructor: any) => ({
              _id: instructor._id || instructor.id,
              full_name: instructor.full_name || instructor.name || `${instructor.first_name || ''} ${instructor.last_name || ''}`.trim(),
              email: instructor.email,
              phone_number: instructor.phone_number || instructor.phone
            }));
          
          setModalInstructors(transformedInstructors);
          
          if (transformedInstructors.length === 0) {
            showToast.warning('No instructors available. Please assign instructor roles first.');
          }
        } else {
          setModalInstructors([]);
          showToast.error('Failed to load instructors from server');
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        showToast.error(`Failed to load instructors: ${error instanceof Error ? error.message : 'Please try again'}`);
        setModalInstructors([]);
      } finally {
        setModalLoading(false);
      }
    };

    // Fetch live courses from API without fallback
    const fetchModalCourses = async () => {
      try {
        setModalLoading(true);
        
        // Use the real courseTypesAPI to fetch live courses
        const response = await courseTypesAPI.getCoursesByType<ILiveCourse>('live');
        
        let coursesList: ICourse[] = [];
        
        if (response?.data && (response.data as any)?.success && (response.data as any)?.data) {
          // Handle the API response structure
          const apiData = (response.data as any).data;
          coursesList = Array.isArray(apiData) ? apiData.map((liveCourse: ILiveCourse) => ({
            _id: liveCourse._id || '',
            course_title: liveCourse.course_title,
            course_category: liveCourse.course_category,
            course_image: liveCourse.course_image,
            course_type: 'live' as const,
            class_type: liveCourse.class_type
          })) : [];
        } else if (response?.data && Array.isArray(response.data)) {
          // Direct array response
          coursesList = response.data.map((liveCourse: ILiveCourse) => ({
            _id: liveCourse._id || '',
            course_title: liveCourse.course_title,
            course_category: liveCourse.course_category,
            course_image: liveCourse.course_image,
            course_type: 'live' as const,
            class_type: liveCourse.class_type
          }));
        }
        
        setModalCourses(coursesList);
      } catch (error) {
        console.error('Error fetching modal courses:', error);
        setModalCourses([]);
        showToast.error('Failed to load courses');
      } finally {
        setModalLoading(false);
      }
    };

    // Fetch students from API without fallback
    const fetchModalStudents = async () => {
      try {
        setModalLoading(true);
        
        const response = await apiClient.get(`${apiBaseUrl}${apiUrls.user.getAllStudents}`);
        
        if (response?.data) {
          let studentsList: any[] = [];
          
          if (response.data.success && response.data.data) {
            studentsList = Array.isArray(response.data.data) ? response.data.data : [];
          } else if (response.data.students) {
            studentsList = Array.isArray(response.data.students) ? response.data.students : [];
          } else if (Array.isArray(response.data)) {
            studentsList = response.data;
          }
          
          // Transform data
          const transformedStudents = studentsList.map((student: any) => ({
            _id: student._id || student.id,
            full_name: student.full_name || student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim(),
            email: student.email,
            phone_number: student.phone_number || student.phone
          }));
          
          setModalStudents(transformedStudents);
          
          if (transformedStudents.length === 0) {
            showToast.warning('No students available');
          }
        } else {
          setModalStudents([]);
          showToast.error('Failed to load students from server');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        showToast.error(`Failed to load students: ${error instanceof Error ? error.message : 'Please try again'}`);
        setModalStudents([]);
      } finally {
        setModalLoading(false);
      }
    };

    // Load all required data when modal opens
    useEffect(() => {
      if (isOpen) {
        Promise.all([
          fetchModalInstructors(),
          fetchModalCourses(),
          fetchModalStudents()
        ]);
      }
    }, [isOpen]);

    const handleScheduleChange = (index: number, field: string, value: string) => {
      const newSchedule = [...formData.schedule];
      newSchedule[index] = { ...newSchedule[index], [field]: value };
      setFormData({ ...formData, schedule: newSchedule });
    };

    const addScheduleSlot = () => {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, { day: 'Monday', start_time: '09:00', end_time: '10:00' }]
      });
    };

    const removeScheduleSlot = (index: number) => {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData({ ...formData, schedule: newSchedule });
    };

    const generateBatchName = () => {
      const selectedCourseObj = modalCourses.find(c => c._id === formData.course);
      const selectedStudentObj = modalStudents.find(s => s._id === formData.student);
      
      if (selectedCourseObj && selectedStudentObj) {
        const courseName = selectedCourseObj.course_title;
        const studentName = selectedStudentObj.full_name;
        const timestamp = Date.now().toString().slice(-6);
        const batchName = `${courseName} - ${studentName} - ${timestamp}`;
        setFormData(prev => ({ ...prev, batch_name: batchName }));
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.course || !formData.instructor || !formData.batch_name) {
        showToast.error('Please fill in all required fields');
        return;
      }

      // Create the individual batch data
      const individualBatchData: IIndividualBatchCreateInput = {
        course_id: formData.course,
        instructor_id: formData.instructor,
        student_id: formData.student || undefined,
        batch_name: formData.batch_name,
        batch_type: 'individual',
        capacity: 1,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        schedule: formData.schedule,
        batch_notes: formData.notes
      };

      onSubmit(individualBatchData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create Individual 1:1 Batch
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Create a personalized one-on-one learning session
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Batch Type Indicator */}
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white">
                  <UserPlus className="h-3 w-3 mr-1" />
                  1:1 Individual Session
                </span>
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  Capacity is automatically set to 1 student
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student (Optional)
                </label>
                <select
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Student (Optional)</option>
                  {modalStudents.map((student: any) => (
                    <option key={student._id} value={student._id}>
                      {student.full_name} ({student.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  If selected, student will be automatically enrolled in the batch upon creation
                </p>
              </div>

              {/* Instructor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructor *
                </label>
                <select
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Instructor</option>
                  {modalInstructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.full_name} ({instructor.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course *
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Course</option>
                  {modalCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.course_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Capacity (Disabled for Individual) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capacity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={1}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Fixed for 1:1</span>
                  </div>
                </div>
              </div>

              {/* Batch Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Batch Name *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.batch_name}
                    onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter a descriptive name for this 1:1 batch"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateBatchName}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors whitespace-nowrap"
                    title="Auto-generate batch name based on selections"
                  >
                    Auto-Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Provide a meaningful name or use auto-generate based on your selections
                </p>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            {/* Schedule Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Schedule *
                </h3>
                <button
                  type="button"
                  onClick={addScheduleSlot}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time Slot
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.schedule.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <select
                      value={slot.day}
                      onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    
                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                    
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    
                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                    
                    {formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScheduleSlot(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Batch Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Additional notes about this individual batch..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Individual Batch
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Helper functions for batch type display
  const getBatchTypeDisplay = (batch: IBatchFromAPI): string => {
    if (batch.batch_type === 'individual' || batch.capacity === 1) {
      return '1:1';
    }
    return 'Group';
  };

  const getBatchTypeBadgeColor = (batch: IBatchFromAPI): string => {
    if (batch.batch_type === 'individual' || batch.capacity === 1) {
      return 'bg-purple-500/90 text-white'; // Purple for individual
    }
    return 'bg-blue-500/90 text-white'; // Blue for group
  };

  const getBatchTypeIcon = (batch: IBatchFromAPI) => {
    if (batch.batch_type === 'individual' || batch.capacity === 1) {
      return <UserPlus className="h-3 w-3 mr-1" />;
    }
    return <Users className="h-3 w-3 mr-1" />;
  };

  // Enhanced capacity display function
  const getCapacityDisplay = (batch: IBatchFromAPI): string => {
    if (batch.batch_type === 'individual' || batch.capacity === 1) {
      return '1:1 Session';
    }
    return `${batch.enrolled_students}/${batch.capacity} enrolled`;
  };

  // Enhanced refresh system
  const refreshData = async (options: {
    showLoading?: boolean;
    force?: boolean;
    source?: string;
  } = {}) => {
    const { showLoading = false, force = false, source = 'manual' } = options;
    
    try {
      if (showLoading) {
        setRefreshing(true);
      }

      console.log(`🔄 Refreshing data from source: ${source}`);

      // Refresh batches data
      await fetchBatches();
      
      // Update selected batch if it exists
      if (selectedBatch) {
        try {
          const updatedBatchResponse = await batchAPI.getBatchById(selectedBatch._id);
          if (updatedBatchResponse?.data) {
            // Handle different response structures
            let batchData: IBatchFromAPI;
            
            if ((updatedBatchResponse.data as any).success && (updatedBatchResponse.data as any).data) {
              // Wrapped response format
              batchData = (updatedBatchResponse.data as any).data;
            } else {
              // Direct batch data
              batchData = updatedBatchResponse.data as unknown as IBatchFromAPI;
            }
            
            setSelectedBatch(batchData);
          }
        } catch (error) {
          console.warn('Failed to refresh selected batch:', error);
        }
      }

      setLastRefresh(new Date());
      
      if (source !== 'auto') {
        showToast.success('Data refreshed successfully');
      }
      
      console.log(`✅ Data refresh completed from source: ${source}`);
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (source !== 'auto') {
        showToast.error('Failed to refresh data');
      }
    } finally {
      if (showLoading) {
        setRefreshing(false);
      }
    }
  };

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefreshEnabled && courses.length > 0) {
      const interval = setInterval(() => {
        refreshData({ source: 'auto' });
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefreshEnabled, courses.length, selectedCourse, statusFilter, batchTypeFilter]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Enhanced student management update handler
  const handleStudentManagementUpdate = async () => {
    await refreshData({ showLoading: true, source: 'student_management' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboards/admin/online-class/live"
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Categories
              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Batch Management
                </h1>
                {lastRefresh && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Auto-refresh toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefreshEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  title={`Auto-refresh: ${autoRefreshEnabled ? 'ON' : 'OFF'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">Auto-refresh</span>
              </div>

              {/* Manual refresh button */}
              <button
                onClick={() => refreshData({ showLoading: true, source: 'manual' })}
                disabled={refreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>

              <button
                onClick={() => setActiveTab(activeTab === 'batches' ? 'analytics' : 'batches')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {activeTab === 'batches' ? 'View Analytics' : 'View Batches'}
              </button>
              <button
                onClick={handleCreateIndividualBatch}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                title="Create 1:1 Individual Batch"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create 1:1 Batch
              </button>
              <button
                onClick={handleCreateBatch}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.course_title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Batches
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TBatchStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Batch Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Batch Type
              </label>
              <select
                value={batchTypeFilter}
                onChange={(e) => setBatchTypeFilter(e.target.value as TBatchType | '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="group">Group Batches</option>
                <option value="individual">Individual (1:1)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end space-x-2">
              {selectedCourse && (
                <button
                  onClick={() => {
                    const course = courses.find(c => c._id === selectedCourse);
                    if (course) handleAssignInstructorToCourse(course);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Assign instructor to selected course"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign Instructor
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCourse('');
                  setSearchQuery('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' ? (
          <BatchAnalytics 
            courseId={selectedCourse}
          />
        ) : (
          <>
            {/* Batches List */}
            {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading batches...</span>
            </div>
          </div>
        ) : getFilteredBatches().length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {selectedCourse 
                ? (batchTypeFilter 
                    ? `No ${batchTypeFilter === 'individual' ? 'individual (1:1)' : 'group'} batches found`
                    : 'No batches found'
                  )
                : (batchTypeFilter
                    ? `Select a course to view ${batchTypeFilter === 'individual' ? 'individual (1:1)' : 'group'} batches`
                    : 'Select a course to view batches'
                  )
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedCourse 
                ? (batchTypeFilter 
                    ? `There are no ${batchTypeFilter === 'individual' ? 'individual (1:1)' : 'group'} batches for the selected course and filters.`
                    : 'There are no batches for the selected course and filters.'
                  )
                : (batchTypeFilter
                    ? `Choose a course from the dropdown above to see available ${batchTypeFilter === 'individual' ? 'individual (1:1)' : 'group'} batches.`
                    : 'Choose a course from the dropdown above to see available batches.'
                  )
              }
            </p>
            {selectedCourse && (
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={handleCreateBatch}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group Batch
                </button>
                <button
                  onClick={handleCreateIndividualBatch}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create 1:1 Batch
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {getFilteredBatches().map((batch) => {
                const utilization = batchUtils.calculateBatchUtilization(
                  batch.enrolled_students, 
                  batch.capacity
                );
                
                return (
                  <motion.div
                    key={batch._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group ${
                      openDropdown === batch._id ? '' : 'overflow-hidden'
                    }`}
                  >
                    {/* Card Header with Course Image */}
                    <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                      {batch.course.course_image ? (
                        <img 
                          src={batch.course.course_image} 
                          alt={batch.course.course_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white opacity-80" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${statusColors[batch.status]} border border-white/20`}>
                          {getStatusIcon(batch.status)}
                          <span className="ml-1">{batch.status}</span>
                        </span>
                      </div>

                      {/* Batch Type Badge */}
                      <div className="absolute top-3 right-14">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20 ${getBatchTypeBadgeColor(batch)}`}>
                          {getBatchTypeIcon(batch)}
                          {getBatchTypeDisplay(batch)}
                        </span>
                      </div>

                      {/* Status Change Dropdown */}
                      {getStatusTransitions(batch.status).length > 0 && (
                        <div className="absolute top-3 right-3 dropdown-container">
                          <div className="relative">
                            <button 
                              className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              onClick={(e) => toggleDropdown(batch._id, e)}
                              title="Change Status"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {/* Enhanced Dropdown Menu */}
                            {openDropdown === batch._id && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-[9999] animate-in slide-in-from-top-2 duration-200">
                                <div className="p-2">
                                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                                    Change Status
                                  </div>
                                  {getStatusTransitions(batch.status).map((newStatus) => (
                                    <button
                                      key={newStatus}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusUpdate(batch._id, newStatus);
                                      }}
                                      disabled={statusUpdateLoading === batch._id}
                                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                        newStatus === 'Active'
                                          ? 'text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                                          : newStatus === 'Completed'
                                            ? 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                            : newStatus === 'Cancelled'
                                              ? 'text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                                              : 'text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                      {statusUpdateLoading === batch._id ? (
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <>
                                          {getStatusIcon(newStatus)}
                                          <span className="ml-2">Mark as {newStatus}</span>
                                        </>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Title and Course Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {batch.batch_name}
                        </h3>
                        {batch.batch_code && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                            {batch.batch_code}
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                            {batch.course.course_title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {batch.course.course_category}
                        </p>
                      </div>

                      {/* Key Metrics */}
                      <div className="space-y-3 mb-4">
                        {/* Student Enrollment */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {batch.batch_type === 'individual' || batch.capacity === 1 ? 'Session Type' : 'Students'}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">
                                {getCapacityDisplay(batch)}
                              </div>
                              {batch.batch_type !== 'individual' && batch.capacity > 1 && (
                                <div className={`text-xs font-medium ${getUtilizationColor(utilization)}`}>
                                  {utilization}% filled
                                </div>
                              )}
                            </div>
                          </div>
                          {batch.batch_type !== 'individual' && batch.capacity > 1 && (
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  utilization >= 90 ? 'bg-red-500' : utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructor</span>
                          </div>
                          <div className="text-right">
                            {batch.assigned_instructor ? (
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {getInstructorName(batch.assigned_instructor)}
                                </div>
                                {isInstructorObject(batch.assigned_instructor) && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {batch.assigned_instructor.email}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="text-sm text-red-500 dark:text-red-400 font-medium">Unassigned</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  No instructor assigned
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {Math.ceil((new Date(batch.end_date).getTime() - new Date(batch.start_date).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {batch.schedule?.length || 0} sessions/week
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Timeline */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Timeline</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-800 dark:text-blue-200 font-medium">Start</span>
                            <span className="text-blue-700 dark:text-blue-300">{formatDate(batch.start_date)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-800 dark:text-blue-200 font-medium">End</span>
                            <span className="text-blue-700 dark:text-blue-300">{formatDate(batch.end_date)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewBatchDetails(batch)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Details
                          </button>
                          <button
                            onClick={() => handleManageStudents(batch)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 rounded-lg transition-all duration-200"
                            title="Manage Students"
                          >
                            <UserCog className="h-3.5 w-3.5 mr-1" />
                            Students
                          </button>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleDeleteBatch(batch._id!, batch.batch_name)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            title="Delete Batch"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Replace Create/Edit Batch Modal and Individual Batch Modal with UnifiedBatchModal */}
      {showUnifiedBatchModal && (
        <UnifiedBatchModal
          isOpen={!!showUnifiedBatchModal}
          onClose={() => setShowUnifiedBatchModal(false)}
          onSuccess={onModalSuccess}
          batchType={showUnifiedBatchModal}
          title={showUnifiedBatchModal === 'group' ? 'Create Group Batch' : 'Create Individual 1:1 Batch'}
          course={selectedCourse ? courses.find(c => c._id === selectedCourse) : undefined}
          initialData={unifiedModalInitialData}
        />
      )}

      {/* Batch Details Modal */}
      {showBatchDetails && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Batch Details
              </h2>
              <button
                onClick={() => setShowBatchDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Batch Name
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBatch.batch_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Batch Code
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBatch.batch_code || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Course
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBatch.course.course_title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedBatch.status]}`}>
                        {selectedBatch.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructor Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Instructor Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {selectedBatch.assigned_instructor ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {getInstructorName(selectedBatch.assigned_instructor)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {getInstructorEmail(selectedBatch.assigned_instructor)}
                            </p>
                          </div>
                        </div>
                        {/* Display phone numbers if available for object format */}
                        {(() => {
                          const instructor = selectedBatch.assigned_instructor;
                          return isInstructorObject(instructor) && 
                                 instructor.phone_numbers && 
                                 instructor.phone_numbers.length > 0 ? (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Phone:</span>{' '}
                                {instructor.phone_numbers.map((phone, index) => (
                                  <span key={index}>
                                    {phone.number}
                                    {index < instructor.phone_numbers!.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                        <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">No instructor assigned</p>
                          <p className="text-sm">This batch needs an instructor to be assigned.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule */}
                {selectedBatch.schedule && selectedBatch.schedule.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Schedule
                    </h3>
                    <div className="space-y-2">
                      {selectedBatch.schedule.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {session.day}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {session.start_time} - {session.end_time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedBatch.batch_notes && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Notes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {selectedBatch.batch_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Management Modal */}
      {showStudentManagement && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Student Management - {selectedBatch.batch_name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive student management and analytics for this batch
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Tab Navigation */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setStudentManagementTab('management')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      studentManagementTab === 'management'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Users className="h-4 w-4 mr-2 inline" />
                    Management
                  </button>
                  <button
                    onClick={() => setStudentManagementTab('analytics')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      studentManagementTab === 'analytics'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 mr-2 inline" />
                    Analytics
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setShowStudentManagement(false);
                    setSelectedBatch(null);
                    setStudentManagementTab('management');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {studentManagementTab === 'management' ? (
                <BatchStudentEnrollment
                  batch={{
                    ...selectedBatch,
                    available_spots: selectedBatch.capacity - selectedBatch.enrolled_students,
                    course: typeof selectedBatch.course === 'string' ? selectedBatch.course : selectedBatch.course._id,
                    course_details: {
                      _id: selectedBatch.course._id,
                      course_title: selectedBatch.course.course_title,
                      course_category: selectedBatch.course.course_category
                    },
                    start_date: new Date(selectedBatch.start_date),
                    end_date: new Date(selectedBatch.end_date),
                    assigned_instructor: getInstructorId(selectedBatch.assigned_instructor) || undefined,
                    enrolled_students_details: selectedBatch.enrolled_students_details
                  }}
                  onUpdate={handleStudentManagementUpdate}
                />
              ) : (
                <StudentAnalytics
                  batchId={selectedBatch._id}
                  enrolledStudents={
                    selectedBatch.enrolled_students_details?.map(enrollment => ({
                      _id: enrollment.student._id,
                      full_name: enrollment.student.full_name,
                      email: enrollment.student.email,
                      enrollment_date: enrollment.enrollment_date,
                      enrollment_status: enrollment.enrollment_status,
                      progress: enrollment.progress,
                      payment_plan: enrollment.payment_plan,
                      phone_numbers: enrollment.student.phone_numbers
                    })) || []
                  }
                  onRefresh={handleStudentManagementUpdate}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructor Assignment Modal */}
      {showInstructorAssignment && instructorAssignmentTarget && (
        <InstructorAssignmentModal
          isOpen={showInstructorAssignment}
          onClose={() => {
            setShowInstructorAssignment(false);
            setInstructorAssignmentTarget(null);
          }}
          onSuccess={onInstructorAssignmentSuccess}
          type={instructorAssignmentType}
          targetData={instructorAssignmentTarget}
          title={`Assign Instructor to ${instructorAssignmentType === 'course' ? 'Course' : 'Student'}`}
        />
      )}
    </div>
  );
};

export default BatchManagementPage; 