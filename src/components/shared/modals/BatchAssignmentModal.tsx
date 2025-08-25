"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Clock, Plus, Trash2, Edit3, UserCheck, GraduationCap, Search, ChevronDown, CheckCircle, RefreshCw, BookOpen } from 'lucide-react';
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

interface BatchAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create_batch' | 'assign_to_batch' | 'individual_assignment' | 'batch_enrollment';
  course?: ICourse;
  batch?: IBatchWithDetails;
  student?: IStudent;
  instructor?: IInstructor;
  title?: string;
  courses?: ICourse[];
  instructors?: IInstructor[];
  onOpenInstructorAssignment?: (course: ICourse) => void;
}

/**
 * Assignment Type Configuration
 */
const assignmentTypes: { value: TAssignmentType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'mentor',
    label: 'Mentor',
    description: 'General guidance and career advice',
    icon: <UserCheck className="h-4 w-4" />
  },
  {
    value: 'tutor',
    label: 'Tutor',
    description: 'Subject-specific teaching support',
    icon: <GraduationCap className="h-4 w-4" />
  },
  {
    value: 'advisor',
    label: 'Academic Advisor',
    description: 'Academic and course planning guidance',
    icon: <Users className="h-4 w-4" />
  },
  {
    value: 'supervisor',
    label: 'Project Supervisor',
    description: 'Project and assignment oversight',
    icon: <Edit3 className="h-4 w-4" />
  }
];

const BatchAssignmentModal: React.FC<BatchAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  course,
  batch,
  student,
  instructor,
  title,
  courses,
  instructors: passedInstructors,
  onOpenInstructorAssignment
}) => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [batches, setBatches] = useState<IBatchWithDetails[]>([]);
  const [liveCourses, setLiveCourses] = useState<ICourse[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  // Course Selector State
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');
  const [isCourseSelectorOpen, setIsCourseSelectorOpen] = useState<boolean>(false);
  
  // Batch Creation Form State
  const [batchForm, setBatchForm] = useState<{
    batch_name: string;
    batch_code?: string;
    course: string;
    status?: TBatchStatus;
    start_date: string;  // Keep as string for HTML input
    end_date: string;    // Keep as string for HTML input
    capacity: number;
    assigned_instructor?: string;
    schedule?: IBatchSchedule[];
    batch_notes?: string;
  }>({
    batch_name: '',
    course: '',
    start_date: '',
    end_date: '',
    capacity: 10,
    assigned_instructor: '',
    status: 'Upcoming',
    batch_notes: '',
    schedule: []
  });

  // Individual Assignment Form State
  const [assignmentForm, setAssignmentForm] = useState<IIndividualAssignmentInput>({
    instructor_id: instructor?._id || '',
    student_id: student?._id || '',
    assignment_type: 'mentor',
    notes: ''
  });

  // Schedule Management State
  const [scheduleEntries, setScheduleEntries] = useState<IBatchSchedule[]>([
    { day: 'Monday', start_time: '09:00', end_time: '11:00' }
  ]);

  // Search functionality state
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // Modal Title Determination
  const getModalTitle = () => {
    if (title) return title;
    
    switch (mode) {
      case 'create_batch':
        return `Create New Batch - ${course?.course_title || 'Course'}`;
      case 'assign_to_batch':
        return `Assign Instructor - ${batch?.batch_name || 'Batch'}`;
      case 'individual_assignment':
        return 'Assign Individual Instructor';
      case 'batch_enrollment':
        return `Enroll Students - ${batch?.batch_name || 'Batch'}`;
      default:
        return 'Assignment Modal';
    }
  };

  // Filtered students based on search term
  const filteredStudents = students.filter(student => 
    student.full_name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Fetch Data Functions
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.get(`${apiBaseUrl}${apiUrls.Instructor.getAllInstructors}`);
      
      if (response?.data) {
        // Handle different response structures
        let instructorsList: IInstructor[] = [];
        
        if (response.data.success && response.data.data) {
          // If response has success flag and data property
          instructorsList = Array.isArray(response.data.data) ? response.data.data : [];
        } else if (response.data.instructors) {
          // If response has instructors property
          instructorsList = Array.isArray(response.data.instructors) ? response.data.instructors : [];
        } else if (Array.isArray(response.data)) {
          // If response data is directly an array
          instructorsList = response.data;
        } else if (response.data.users) {
          // Handle case where instructors are in users array
          instructorsList = Array.isArray(response.data.users) ? response.data.users : [];
        }
        
        // Transform data to match our interface if needed
        const transformedInstructors = instructorsList
          .filter((instructor: any) => {
            // Filter only instructor roles
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
            meta: instructor.meta || {
              category: instructor.category,
              expertise: instructor.expertise || [],
              admin_role: instructor.admin_role
            }
          }));
        
        setInstructors(transformedInstructors);
        
        if (transformedInstructors.length === 0) {
          showToast.warning('No instructors found. You may need to assign instructor roles first.');
        }
      } else {
        setInstructors([]);
        showToast.warning('No instructor data received from server');
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(`Failed to load instructors: ${error.message}`);
      } else {
        showToast.error('Failed to load instructors. Please check your connection and try again.');
      }
      
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Fetching students from:', `${apiBaseUrl}${apiUrls.Students.getAllStudents}`);
      
      // Use Student collection endpoint with pagination to get all students
      const response = await apiClient.get(`${apiBaseUrl}${apiUrls.Students.getAllStudents}?limit=1000&page=1`);
      
      console.log('📡 Raw API Response:', response);
      
      if (response?.data) {
        // Handle different response structures
        let studentsList: IStudent[] = [];
        
        if (response.data.success && response.data.data) {
          // If response has success flag and data property with items
          if (response.data.data.items) {
            studentsList = Array.isArray(response.data.data.items) ? response.data.data.items : [];
          } else {
            studentsList = Array.isArray(response.data.data) ? response.data.data : [];
          }
        } else if (response.data.students) {
          // If response has students property
          studentsList = Array.isArray(response.data.students) ? response.data.students : [];
        } else if (Array.isArray(response.data)) {
          // If response data is directly an array
          studentsList = response.data;
        }
        
        console.log('📋 Extracted students list:', studentsList);
        
        // Transform data to match our interface if needed
        const transformedStudents = studentsList.map((student: any) => ({
          _id: student._id || student.id,
          full_name: student.full_name || student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim(),
          email: student.email,
          role: Array.isArray(student.role) ? student.role : (student.role ? [student.role] : ['student']),
          assigned_instructor: student.assigned_instructor
        }));
        
        console.log('🔄 Transformed students:', transformedStudents);
        
        setStudents(transformedStudents);
        
        if (transformedStudents.length === 0) {
          showToast.info('No students found in Student collection');
        } else {
          console.log(`✅ Loaded ${transformedStudents.length} students from Student collection`);
        }
      } else {
        setStudents([]);
        showToast.warning('No student data received from server');
      }
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      if (error instanceof Error) {
        showToast.error(`Failed to load students: ${error.message}`);
      } else {
        showToast.error('Failed to load students. Please check your connection and try again.');
      }
      
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    if (!course?._id) return;
    
    try {
      setLoading(true);
      const response = await batchAPI.getBatchesByCourse(course._id);
      if (response?.data) {
        // Handle both wrapped and direct array responses
        if (Array.isArray(response.data)) {
          setBatches(response.data);
        } else if ((response.data as any)?.success && (response.data as any)?.data) {
          setBatches((response.data as any).data);
        }
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      showToast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveCourses = async () => {
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
  };

  // Form Handlers
  const handleCreateBatch = async () => {
    // Get the course ID
    const courseId = course?._id || selectedCourse;
    
    if (!courseId) {
      showToast.error('Course selection is required');
      return;
    }

    if (!batchForm.batch_name || !batchForm.start_date || !batchForm.end_date) {
      showToast.error('Please fill in all required fields');
      return;
    }

    if (!batchForm.assigned_instructor || batchForm.assigned_instructor === '') {
      showToast.error('Please assign an instructor to the batch');
      return;
    }

    // Validate schedule
    const validation = batchUtils.validateBatchSchedule(scheduleEntries);
    if (!validation.isValid) {
      showToast.error(validation.errors[0]);
      return;
    }

    try {
      setLoading(true);
      
      const batchData: IBatchCreateInput = {
        batch_name: batchForm.batch_name,
        batch_code: batchForm.batch_code,
        course: courseId,
        status: batchForm.status || 'Upcoming',
        start_date: new Date(batchForm.start_date), // Convert string to Date
        end_date: new Date(batchForm.end_date),     // Convert string to Date
        capacity: batchForm.capacity,
        assigned_instructor: batchForm.assigned_instructor,
        schedule: scheduleEntries,
        batch_notes: batchForm.batch_notes
      };

      const response = await batchAPI.createBatch(batchData);
      
      if (response?.data) {
        showToast.success('Batch created successfully');
        onSuccess();
        onClose();
      } else {
        throw new Error('Failed to create batch');
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToBatch = async () => {
    if (!batch?._id || !selectedInstructor) {
      showToast.error('Batch and instructor selection required');
      return;
    }

    try {
      setLoading(true);
      const response = await batchAPI.updateBatch(batch._id, {
        assigned_instructor: selectedInstructor
      });
      
      if (response?.data) {
        showToast.success('Instructor assigned to batch successfully');
        onSuccess();
        onClose();
      } else {
        throw new Error('Failed to assign instructor');
      }
    } catch (error) {
      console.error('Error assigning instructor to batch:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to assign instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleIndividualAssignment = async () => {
    if (!assignmentForm.instructor_id || !assignmentForm.student_id) {
      showToast.error('Both instructor and student selection required');
      return;
    }

    try {
      setLoading(true);
      const response = await individualAssignmentAPI.assignInstructorToStudent(assignmentForm);
      
      if (response.data?.success) {
        showToast.success('Individual assignment created successfully');
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to create assignment');
      }
    } catch (error) {
      console.error('Error creating individual assignment:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchEnrollment = async () => {
    if (!selectedBatch || selectedStudents.length === 0) {
      showToast.error('Please select a batch and at least one student');
      return;
    }

    console.log('🚀 Starting batch enrollment process...');
    console.log('📋 Selected students:', selectedStudents);
    console.log('📚 Course:', course?._id);
    console.log('👥 Batch:', selectedBatch);

    try {
      setLoading(true);
      
      // Enroll each student one by one
      const enrollmentResults = [];
      
      for (const studentId of selectedStudents) {
        try {
          console.log(`📝 Enrolling student ${studentId}...`);
          
          const response = await enrollmentAPI.enrollStudent(studentId, {
            courseId: course!._id,
            batchId: selectedBatch,
            enrollment_type: 'batch',
            enrollment_source: 'direct'
          });
          
          console.log(`✅ Successfully enrolled student ${studentId}:`, response);
          
          enrollmentResults.push({
            studentId,
            success: true,
            data: response.data
          });
          
        } catch (error) {
          console.error(`❌ Failed to enroll student ${studentId}:`, error);
          
          // Provide specific error messages
          let errorMessage = 'Failed to enroll student';
          if (error.response?.status === 404) {
            errorMessage = 'Student, course, or batch not found';
          } else if (error.response?.status === 400) {
            errorMessage = error.response?.data?.message || 'Invalid enrollment data';
          } else if (error.response?.status === 500) {
            errorMessage = 'Server error - please try again';
          } else if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Cannot connect to server - please check if backend is running';
          }
          
          enrollmentResults.push({
            studentId,
            success: false,
            error: { ...error, userMessage: errorMessage }
          });
        }
      }

      // Process results
      const successfulEnrollments = enrollmentResults.filter(result => result.success);
      const failedEnrollments = enrollmentResults.filter(result => !result.success);

      console.log(`📊 Enrollment results: ${successfulEnrollments.length} success, ${failedEnrollments.length} failed`);

      // Show success message
      if (successfulEnrollments.length > 0) {
        showToast.success(`${successfulEnrollments.length} student(s) enrolled successfully`);
        
        // Update the batch data with new enrollment count
        if (batch && successfulEnrollments.length > 0) {
          const updatedBatch = {
            ...batch,
            enrolled_students: (batch.enrolled_students || 0) + successfulEnrollments.length
          };
          
          // Call onSuccess to refresh the parent component
          onSuccess();
        }
      }

      // Show error messages for failed enrollments
      if (failedEnrollments.length > 0) {
        failedEnrollments.forEach(result => {
          const errorMessage = result.error?.userMessage || 'Enrollment failed';
          showToast.error(errorMessage);
        });
      }

      // Close modal if at least one enrollment was successful
      if (successfulEnrollments.length > 0) {
        onClose();
      }

    } catch (error) {
      console.error('❌ Error in batch enrollment process:', error);
      showToast.error('Failed to process enrollment requests');
    } finally {
      setLoading(false);
    }
  };

  // Schedule Management
  const addScheduleEntry = () => {
    setScheduleEntries([
      ...scheduleEntries,
      { day: 'Monday', start_time: '09:00', end_time: '11:00' }
    ]);
  };

  const removeScheduleEntry = (index: number) => {
    setScheduleEntries(scheduleEntries.filter((_, i) => i !== index));
  };

  const updateScheduleEntry = (index: number, field: keyof IBatchSchedule, value: string) => {
    const updated = [...scheduleEntries];
    updated[index] = { ...updated[index], [field]: value };
    setScheduleEntries(updated);
  };

  // Effect Hooks
  useEffect(() => {
    if (isOpen) {
      // Always fetch instructors from API for these modes
      if (mode === 'create_batch' || mode === 'assign_to_batch' || mode === 'individual_assignment') {
        fetchInstructors();
      }
      
      // Always fetch live courses when creating a new batch and no course is pre-selected
      if (mode === 'create_batch' && !course) {
        fetchLiveCourses();
      }
      
      if (mode === 'individual_assignment' && !student) {
        fetchStudents();
      }
      if (mode === 'batch_enrollment') {
        fetchStudents();
        if (!batch) fetchBatches();
      }
    }
  }, [isOpen, mode, course, courses]);

  useEffect(() => {
    if (instructor?._id) {
      setSelectedInstructor(instructor._id);
      setAssignmentForm(prev => ({ ...prev, instructor_id: instructor._id }));
    }
  }, [instructor]);

  useEffect(() => {
    if (student?._id) {
      setAssignmentForm(prev => ({ ...prev, student_id: student._id }));
    }
  }, [student]);

  useEffect(() => {
    if (batch?._id) {
      setSelectedBatch(batch._id);
    }
  }, [batch]);

  // Initialize course selection when modal opens
  useEffect(() => {
    if (isOpen) {
      if (course?._id) {
        setSelectedCourse(course._id);
      } else {
        setSelectedCourse('');
      }
    }
  }, [isOpen, course]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCourseSelectorOpen && !(event.target as Element).closest('.course-selector')) {
        setIsCourseSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCourseSelectorOpen]);

  // Helper Functions for Course Selection
  const getAllAvailableCourses = () => {
    const allCourses = [...(courses || []), ...liveCourses];
    return allCourses;
  };

  const getFilteredCourses = () => {
    const allCourses = getAllAvailableCourses();
    if (!courseSearchQuery) return allCourses;
    
    return allCourses.filter(course =>
      course.course_title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
      course.course_category.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
      (course.course_subcategory && course.course_subcategory.toLowerCase().includes(courseSearchQuery.toLowerCase())) ||
      (course.course_level && course.course_level.toLowerCase().includes(courseSearchQuery.toLowerCase())) ||
      (course.course_grade && course.course_grade.toLowerCase().includes(courseSearchQuery.toLowerCase()))
    );
  };

  const getSelectedCourseInfo = () => {
    const allCourses = getAllAvailableCourses();
    return allCourses.find(course => course._id === selectedCourse);
  };

  const formatPrice = (price: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      INR: '₹',
      GBP: '£',
      AED: 'د.إ',
    };
    return `${currencySymbols[currency] || currency} ${price.toLocaleString()}`;
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    setIsCourseSelectorOpen(false);
    setCourseSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getModalTitle()}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Create Batch Form */}
            {mode === 'create_batch' && (
              <div className="space-y-6">
                {/* Enhanced Course Selection (if not pre-selected) */}
                {!course && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Course *
                      </label>
                      <button
                        type="button"
                        onClick={fetchLiveCourses}
                        disabled={loading}
                        className="flex items-center text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline disabled:opacity-50"
                        title="Refresh live courses list"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </button>
                    </div>

                    <CourseGradeSelector
                      courses={getAllAvailableCourses()}
                      selectedCourse={selectedCourse}
                      onCourseSelect={setSelectedCourse}
                      loading={loading}
                      placeholder="Select a course to create batch"
                      showSearch={true}
                      showGradeFilter={true}
                      disabled={false}
                    />

                    {/* Status Messages - Only show when API has loaded */}
                    {!loading && getAllAvailableCourses().length === 0 && (
                      <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                          <strong>No live courses available.</strong> Please create live courses first.
                        </p>
                      </div>
                    )}

                    {!loading && getAllAvailableCourses().length > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ✓ {getAllAvailableCourses().length} course{getAllAvailableCourses().length !== 1 ? 's' : ''} available
                      </p>
                    )}
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Batch Name *
                    </label>
                    <input
                      type="text"
                      value={batchForm.batch_name}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, batch_name: e.target.value }))}
                      placeholder="e.g., Morning Batch - January 2025"
                      title="Enter batch name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      value={batchForm.capacity}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 10 }))}
                      min="1"
                      max="50"
                      placeholder="Enter batch capacity"
                      title="Enter batch capacity (1-50)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={batchForm.start_date}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={batchForm.end_date}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Instructor Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assigned Instructor *
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={fetchInstructors}
                        disabled={loading}
                        className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline disabled:opacity-50"
                        title="Refresh instructors list"
                      >
                        🔄 Refresh
                      </button>
                      {onOpenInstructorAssignment && selectedCourse && courses && (
                        <button
                          type="button"
                          onClick={() => {
                            const course = courses.find(c => c._id === selectedCourse);
                            if (course) onOpenInstructorAssignment(course);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        >
                          Need to assign instructor to course first?
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">Loading instructors...</span>
                    </div>
                  ) : (
                    <select
                      value={batchForm.assigned_instructor}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, assigned_instructor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={instructors.length === 0}
                    >
                      <option value="">
                        {instructors.length === 0 ? 'No instructors available' : 'Select an instructor'}
                      </option>
                      {instructors.map((inst) => (
                        <option key={inst._id} value={inst._id}>
                          {inst.full_name} - {inst.email}
                          {inst.meta?.category && ` (${inst.meta.category})`}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {!loading && instructors.length === 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>No instructors available.</strong> This could be because:
                      </p>
                      <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 ml-4 list-disc">
                        <li>No users have instructor roles assigned</li>
                        <li>Instructors haven't been created yet</li>
                        <li>There's a connection issue with the server</li>
                      </ul>
                      {onOpenInstructorAssignment && selectedCourse && courses && (
                        <button
                          type="button"
                          onClick={() => {
                            const course = courses.find(c => c._id === selectedCourse);
                            if (course) onOpenInstructorAssignment(course);
                          }}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        >
                          → Set up instructor assignments
                        </button>
                      )}
                    </div>
                  )}
                  
                  {!loading && instructors.length > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ {instructors.length} instructor{instructors.length !== 1 ? 's' : ''} loaded successfully
                    </p>
                  )}
                </div>

                {/* Schedule Management */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Schedule *
                    </label>
                    <button
                      type="button"
                      onClick={addScheduleEntry}
                      className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </button>
                  </div>

                  {scheduleEntries.map((entry, index) => (
                    <div key={index} className="flex items-center gap-4 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <select
                        value={entry.day}
                        onChange={(e) => updateScheduleEntry(index, 'day', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>

                      <input
                        type="time"
                        value={entry.start_time}
                        onChange={(e) => updateScheduleEntry(index, 'start_time', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />

                      <span className="text-gray-500">to</span>

                      <input
                        type="time"
                        value={entry.end_time}
                        onChange={(e) => updateScheduleEntry(index, 'end_time', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />

                      <button
                        type="button"
                        onClick={() => removeScheduleEntry(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        disabled={scheduleEntries.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={batchForm.batch_notes}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, batch_notes: e.target.value }))}
                    rows={3}
                    placeholder="Any additional notes about the batch..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Assign to Batch Form */}
            {mode === 'assign_to_batch' && (
              <div className="space-y-6">
                {batch && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Batch Details</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>Name: {batch.batch_name}</div>
                      <div>Capacity: {batch.enrolled_students} / {batch.capacity}</div>
                      <div>Status: {batch.status}</div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Instructor *
                  </label>
                  <select
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select an instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst._id} value={inst._id}>
                        {inst.full_name} - {inst.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Individual Assignment Form */}
            {mode === 'individual_assignment' && (
              <div className="space-y-6">
                {!instructor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Instructor *
                    </label>
                    <select
                      value={assignmentForm.instructor_id}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, instructor_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select an instructor</option>
                      {instructors.map((inst) => (
                        <option key={inst._id} value={inst._id}>
                          {inst.full_name} - {inst.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!student && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Student *
                    </label>
                    <select
                      value={assignmentForm.student_id}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, student_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a student</option>
                      {students.map((stud) => (
                        <option key={stud._id} value={stud._id}>
                          {stud.full_name} - {stud.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assignment Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {assignmentTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setAssignmentForm(prev => ({ ...prev, assignment_type: type.value }))}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          assignmentForm.assignment_type === type.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {type.icon}
                          <span className="font-medium text-gray-900 dark:text-white">{type.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assignment Notes
                  </label>
                  <textarea
                    value={assignmentForm.notes}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Any specific instructions or focus areas for this assignment..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Batch Enrollment Form */}
            {mode === 'batch_enrollment' && (
              <div className="space-y-6">
                {!batch && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Batch *
                    </label>
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a batch</option>
                      {batches.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.batch_name} ({b.enrolled_students}/{b.capacity}) - {b.status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Students *
                  </label>
                  
                  {/* Search Input */}
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search students by name or email..."
                      title="Search students by name or email"
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      onFocus={() => setShowStudentDropdown(true)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      aria-label="Search students by name or email"
                    />
                  </div>

                  {/* Student Selection Dropdown */}
                  <div className="relative">
                    <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((stud) => (
                          <label key={stud._id} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(stud._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudents([...selectedStudents, stud._id]);
                                } else {
                                  setSelectedStudents(selectedStudents.filter(id => id !== stud._id));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label={`Select ${stud.full_name}`}
                            />
                            <div className="ml-3 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{stud.full_name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{stud.email}</div>
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No students found</p>
                          <p className="text-xs">Try adjusting your search</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {selectedStudents.length} student(s) selected
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                switch (mode) {
                  case 'create_batch':
                    handleCreateBatch();
                    break;
                  case 'assign_to_batch':
                    handleAssignToBatch();
                    break;
                  case 'individual_assignment':
                    handleIndividualAssignment();
                    break;
                  case 'batch_enrollment':
                    handleBatchEnrollment();
                    break;
                }
              }}
              disabled={loading || (mode === 'create_batch' && (
                !batchForm.assigned_instructor || 
                instructors.length === 0 || 
                (!selectedCourse && !course?._id) ||
                (!course && (courses?.length || 0) === 0 && liveCourses.length === 0)
              ))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </div>
              ) : (
                <>
                  {mode === 'create_batch' && 'Create Batch'}
                  {mode === 'assign_to_batch' && 'Assign Instructor'}
                  {mode === 'individual_assignment' && 'Create Assignment'}
                  {mode === 'batch_enrollment' && 'Enroll Students'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BatchAssignmentModal; 