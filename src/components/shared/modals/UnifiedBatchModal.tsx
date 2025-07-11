"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Users, Clock, Plus, Trash2, UserCheck, GraduationCap, Search, ChevronDown, CheckCircle, RefreshCw, BookOpen, UserPlus } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { motion, AnimatePresence } from 'framer-motion';
import CourseGradeSelector from '../course/CourseGradeSelector';
import { 
  batchAPI, 
  individualAssignmentAPI, 
  enrollmentAPI,
  type IIndividualAssignmentInput,
  type TAssignmentType,
  type IStudentWithAssignment,
  type IEnrollmentWithDetails
} from '@/apis/instructor-assignments';
import { 
  batchUtils,
  type IBatchCreateInput,
  type IBatchWithDetails,
  type IBatchSchedule,
  type TBatchStatus
} from '@/apis/batch';
import { apiUrls, apiBaseUrl } from '@/apis/index';
import { apiClient } from '@/apis/apiClient';
import { courseTypesAPI, type ILiveCourse } from '@/apis/courses';

/**
 * Component Interface Definitions
 */
interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  meta?: {
    category?: string;
    expertise?: string[];
  };
}

interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  role: string[];
  assigned_instructor?: string;
}

interface ICourse {
  _id: string;
  course_title: string;
  course_category: string;
  course_subcategory?: string;
  course_level?: string;
  course_duration?: string;
  no_of_Sessions?: number;
  session_duration?: string;
  course_grade?: string;
  course_image?: string;
  status?: string;
  isFree?: boolean;
  prices?: Array<{
    currency: string;
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
    is_active: boolean;
  }>;
}

interface IIndividualBatchCreateInput {
  course_id: string;
  instructor_id: string;
  student_id?: string;
  batch_name: string;
  batch_type: 'individual';
  capacity: 1;
  start_date: Date;
  end_date: Date;
  schedule: IBatchSchedule[];
  batch_notes?: string;
}

interface UnifiedBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  batchType: 'individual' | 'group';
  title?: string;
  course?: ICourse;
  initialData?: Partial<IBatchCreateInput | IIndividualBatchCreateInput>;
}

/**
 * Unified Batch Creation Modal Component
 */
const UnifiedBatchModal: React.FC<UnifiedBatchModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  batchType,
  title,
  course,
  initialData
}) => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [liveCourses, setLiveCourses] = useState<ICourse[]>([]);
  
  // Course Selector State
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');
  const [isCourseSelectorOpen, setIsCourseSelectorOpen] = useState<boolean>(false);
  
  // Unified Form State
  const [formData, setFormData] = useState<{
    batch_name: string;
    batch_code?: string;
    course: string;
    status?: TBatchStatus;
    start_date: string;
    end_date: string;
    capacity: number;
    assigned_instructor: string;
    schedule: IBatchSchedule[];
    batch_notes: string;
    student_id?: string; // For individual batches
    session_duration_minutes: number;
    total_sessions: number;
  }>({
    batch_name: '',
    course: course?._id || '',
    start_date: '',
    end_date: '',
    capacity: batchType === 'individual' ? 1 : 10,
    assigned_instructor: '',
    status: 'Upcoming',
    batch_notes: '',
    student_id: undefined,
    session_duration_minutes: 60,
    total_sessions: 10,
    schedule: [{
      date: '',
      start_time: '09:00',
      end_time: '11:00',
      title: '',
      description: ''
    }]
  });

  // Modal Title Determination
  const getModalTitle = () => {
    if (title) return title;
    
    return batchType === 'individual' 
      ? 'Create Individual 1:1 Batch'
      : 'Create Group Batch';
  };

  /**
   * Data Fetching Functions - Standardized API calls
   */
  const fetchInstructors = useCallback(async () => {
    try {
      setLoading(true);
      
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
            phone_number: instructor.phone_number || instructor.phone,
            meta: instructor.meta || {}
          }));
        
        setInstructors(transformedInstructors);
        
        if (transformedInstructors.length === 0) {
          showToast.warning('No instructors available. Please assign instructor roles first.');
        }
      } else {
        setInstructors([]);
        showToast.error('Failed to load instructors from server');
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      showToast.error(`Failed to load instructors: ${error instanceof Error ? error.message : 'Please try again'}`);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      
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
        
        // Transform data to match our interface
        const transformedStudents = studentsList.map((student: any) => ({
          _id: student._id || student.id,
          full_name: student.full_name || student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim(),
          email: student.email,
          role: student.role || student.roles || ['student']
        }));
        
        setStudents(transformedStudents);
        
        if (transformedStudents.length === 0) {
          showToast.warning('No students available');
        }
      } else {
        setStudents([]);
        showToast.error('Failed to load students from server');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      showToast.error(`Failed to load students: ${error instanceof Error ? error.message : 'Please try again'}`);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLiveCourses = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await courseTypesAPI.getCoursesByType<ILiveCourse>('live');
      
      if (response?.data?.success && response.data.data) {
        const liveCoursesList = Array.isArray(response.data.data) ? response.data.data : [];
        
        // Transform live courses to match ICourse interface
        const transformedCourses: ICourse[] = liveCoursesList.map((liveCourse: ILiveCourse) => ({
          _id: liveCourse._id!,
          course_title: liveCourse.course_title,
          course_category: liveCourse.course_category,
          course_subcategory: liveCourse.course_subcategory,
          course_level: liveCourse.course_level,
          course_duration: liveCourse.course_duration,
          no_of_Sessions: liveCourse.no_of_Sessions,
          session_duration: liveCourse.session_duration.toString(),
          course_grade: liveCourse.class_type, // Use class_type as grade fallback
          course_image: liveCourse.course_image,
          status: liveCourse.status,
          isFree: false, // Live courses are typically paid
          prices: liveCourse.prices
        }));
        
        setLiveCourses(transformedCourses);
        
        if (transformedCourses.length === 0) {
          showToast.info('No live courses found');
        }
      } else {
        setLiveCourses([]);
        showToast.warning('No live courses available');
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(`Failed to load live courses: ${error.message}`);
      } else {
        showToast.error('Failed to load live courses. Please check your connection and try again.');
      }
      
      setLiveCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all required data when modal opens
  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetchInstructors(),
        fetchStudents(),
        fetchLiveCourses()
      ]);
    }
  }, [isOpen, fetchInstructors, fetchStudents, fetchLiveCourses]);

  // Initialize form data with any passed initial data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => {
        // Ensure start_date and end_date are always strings
        const start_date = initialData.start_date instanceof Date ? initialData.start_date.toISOString().slice(0, 10) : (initialData.start_date || prev.start_date);
        const end_date = initialData.end_date instanceof Date ? initialData.end_date.toISOString().slice(0, 10) : (initialData.end_date || prev.end_date);
        return {
          ...prev,
          ...initialData,
          start_date,
          end_date,
          capacity: batchType === 'individual' ? 1 : (initialData.capacity || 10)
        };
      });
    }
  }, [initialData, batchType]);

  /**
   * Schedule Management Functions
   */
  const addScheduleEntry = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          date: '',
          start_time: '09:00',
          end_time: '11:00',
          title: '',
          description: ''
        }
      ]
    }));
  };

  const removeScheduleEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const updateScheduleEntry = (index: number, field: keyof IBatchSchedule, value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  /**
   * Auto-generate batch name functionality
   */
  const generateBatchName = () => {
    const selectedCourseObj = liveCourses.find(c => c._id === formData.course);
    const selectedStudentObj = students.find(s => s._id === formData.student_id);
    
    if (selectedCourseObj) {
      const courseName = selectedCourseObj.course_title;
      const timestamp = Date.now().toString().slice(-6);
      
      let batchName = '';
      if (batchType === 'individual' && selectedStudentObj) {
        const studentName = selectedStudentObj.full_name;
        batchName = `${courseName} - ${studentName} - ${timestamp}`;
      } else {
        batchName = `${courseName} - Batch - ${timestamp}`;
      }
      
      setFormData(prev => ({ ...prev, batch_name: batchName }));
    }
  };

  /**
   * Form Submission Handler
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const courseId = course?._id || formData.course;
    
    if (!courseId) {
      showToast.error('Course selection is required');
      return;
    }

    if (!formData.batch_name || !formData.start_date || !formData.end_date) {
      showToast.error('Please fill in all required fields');
      return;
    }

    if (!formData.assigned_instructor) {
      showToast.error('Please assign an instructor to the batch');
      return;
    }

    // Validate schedule
    const validation = batchUtils.validateEnhancedBatchSchedule(formData.schedule);
    
    if (!validation.isValid) {
      showToast.error(validation.errors[0]);
      return;
    }

    // Use the schedule as-is since we only support date-based format now
    const processedSchedule = formData.schedule;

    try {
      setLoading(true);
      
      if (batchType === 'individual') {
        // Create individual batch
        const individualBatchData: IIndividualBatchCreateInput = {
          course_id: courseId,
          instructor_id: formData.assigned_instructor,
          student_id: formData.student_id,
          batch_name: formData.batch_name,
          batch_type: 'individual',
          capacity: 1,
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          schedule: processedSchedule,
          batch_notes: formData.batch_notes
        };
        // Call the actual API for individual batch creation
        const response = await batchAPI.createIndividualBatch(individualBatchData);
        // Check success flag
        if (response?.data?.success) {
          showToast.success('Individual batch created successfully');
        } else {
          throw new Error(response?.data?.message || 'Failed to create individual batch');
        }
      } else {
        // Create group batch
        const batchData: IBatchCreateInput = {
          batch_name: formData.batch_name,
          batch_code: formData.batch_code,
          course: courseId,
          status: formData.status || 'Upcoming',
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          capacity: formData.capacity,
          assigned_instructor: formData.assigned_instructor,
          schedule: processedSchedule,
          batch_notes: formData.batch_notes
        };

        const response = await batchAPI.createBatch(batchData);
        
        if (response?.data?.success) {
          showToast.success('Group batch created successfully');
        } else {
          throw new Error(response?.data?.message || 'Failed to create group batch');
        }
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating batch:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Course Selection Functions
   */
  const getAllAvailableCourses = () => {
    return liveCourses;
  };

  const getFilteredCourses = () => {
    if (!courseSearchQuery) return getAllAvailableCourses();
    
    return getAllAvailableCourses().filter(course =>
      course.course_title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
      course.course_category.toLowerCase().includes(courseSearchQuery.toLowerCase())
    );
  };

  const getSelectedCourseInfo = () => {
    const courseId = course?._id || formData.course;
    return getAllAvailableCourses().find(c => c._id === courseId);
  };

  const handleCourseSelect = (courseId: string) => {
    setFormData(prev => ({ ...prev, course: courseId }));
    setIsCourseSelectorOpen(false);
    setCourseSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getModalTitle()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {batchType === 'individual' 
                ? 'Create a personalized one-on-one learning session'
                : 'Create a group learning session for multiple students'
              }
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
                {batchType === 'individual' ? (
                  <>
                    <UserPlus className="h-3 w-3 mr-1" />
                    1:1 Individual Session
                  </>
                ) : (
                  <>
                    <Users className="h-3 w-3 mr-1" />
                    Group Session
                  </>
                )}
              </span>
              <span className="text-sm text-purple-700 dark:text-purple-300">
                {batchType === 'individual' 
                  ? 'Capacity is automatically set to 1 student'
                  : `Capacity can be adjusted from 2 to ${course?.prices?.[0]?.max_batch_size || 50} students`
                }
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Selection (for individual batches) */}
            {batchType === 'individual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student (Optional)
                </label>
                <select
                  value={formData.student_id || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      student_id: e.target.value || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Student (Optional)</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.full_name} ({student.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  If selected, student will be automatically enrolled in the batch upon creation
                </p>
              </div>
            )}

            {/* Instructor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructor *
              </label>
              <select
                value={formData.assigned_instructor}
                onChange={(e) => setFormData(prev => ({ ...prev, assigned_instructor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.full_name} ({instructor.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            <div className={batchType === 'individual' ? '' : 'md:col-start-1'}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course *
              </label>
              
              {course ? (
                <div className="w-full p-3 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{course.course_title}</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCourseSelectorOpen(!isCourseSelectorOpen)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between"
                  >
                    <span>
                      {getSelectedCourseInfo()?.course_title || 'Select Course'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {isCourseSelectorOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                        <input
                          type="text"
                          placeholder="Search courses..."
                          value={courseSearchQuery}
                          onChange={(e) => setCourseSearchQuery(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      {getFilteredCourses().map((course) => (
                        <button
                          key={course._id}
                          type="button"
                          onClick={() => handleCourseSelect(course._id)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                        >
                          <div className="font-medium">{course.course_title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{course.course_category}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacity
              </label>
              {batchType === 'individual' ? (
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
              ) : (
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 10 }))}
                  min={2}
                  max={course?.prices?.[0]?.max_batch_size || 50}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              )}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, batch_name: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={`Enter a descriptive name for this ${batchType} batch`}
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
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Schedule *
                </label>
              </div>
              
              <button
                type="button"
                onClick={addScheduleEntry}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Slot</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.schedule.map((entry, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    {/* Date/Day Selection */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={entry.date || ''}
                        onChange={(e) => updateScheduleEntry(index, 'date', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    {/* Start Time */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={entry.start_time}
                        onChange={(e) => updateScheduleEntry(index, 'start_time', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    {/* End Time */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={entry.end_time}
                        onChange={(e) => updateScheduleEntry(index, 'end_time', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-end">
                      {formData.schedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScheduleEntry(index)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Remove this schedule entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Title and Description (only for date format) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Session Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={entry.title || ''}
                        onChange={(e) => updateScheduleEntry(index, 'title', e.target.value)}
                        placeholder="e.g., Introduction to Module 1"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
                        maxLength={100}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={entry.description || ''}
                        onChange={(e) => updateScheduleEntry(index, 'description', e.target.value)}
                        placeholder="Brief description of session content"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
                        maxLength={500}
                      />
                    </div>
                  </div>
                  
                  {/* Duration Display */}
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Duration: {(() => {
                          const start = entry.start_time.split(':').map(Number);
                          const end = entry.end_time.split(':').map(Number);
                          const startMinutes = start[0] * 60 + start[1];
                          const endMinutes = end[0] * 60 + end[1];
                          const duration = endMinutes - startMinutes;
                          const hours = Math.floor(duration / 60);
                          const minutes = duration % 60;
                          return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                        })()}
                      </span>
                      
                      {entry.title && (
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {entry.title}
                        </span>
                      )}
                    </div>
                    
                    {entry.date && (
                      <span>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.batch_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, batch_notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Add any additional notes or requirements for this batch..."
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
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Creating...' : `Create ${batchType === 'individual' ? 'Individual' : 'Group'} Batch`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnifiedBatchModal; 