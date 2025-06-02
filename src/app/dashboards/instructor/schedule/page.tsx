"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  ArrowLeft, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal,
  CalendarDays,
  MapPin,
  Link2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Filter,
  Loader2
} from 'lucide-react';
import { batchAPI, IBatchWithDetails, IBatchCreateInput, type TBatchStatus } from '@/apis/batch';

interface ScheduledClass {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  type: 'live' | 'recorded' | 'webinar';
  students: number;
  maxStudents: number;
  meetingLink?: string;
  description?: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'ongoing';
}

interface Course {
  id: string;
  name: string;
  category: string;
}

export default function SchedulePage() {
  const router = useRouter();
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showCourseDropdown, setShowCourseDropdown] = useState<boolean>(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState<boolean>(false);
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form state
  const [classForm, setClassForm] = useState({
    title: '',
    course: '',
    date: '',
    time: '',
    duration: '',
    type: 'live' as 'live' | 'recorded' | 'webinar',
      maxStudents: 30,
    description: ''
  });

  // Refs for dropdown management
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // Course options
  const courses: Course[] = [
    { id: '1', name: 'Quantum Computing', category: 'Technology' },
    { id: '2', name: 'Advanced Physics', category: 'Science' },
    { id: '3', name: 'Mathematics', category: 'Science' },
    { id: '4', name: 'Marketing', category: 'Business' },
    { id: '5', name: 'Web Development', category: 'Technology' }
  ];

  // Status options
  const statusOptions = [
    { id: 'upcoming', label: 'Upcoming', color: 'blue', icon: Clock },
    { id: 'ongoing', label: 'Ongoing', color: 'green', icon: PlayCircle },
    { id: 'completed', label: 'Completed', color: 'gray', icon: CheckCircle },
    { id: 'cancelled', label: 'Cancelled', color: 'red', icon: XCircle }
  ];

  // Type options
  const typeOptions = [
    { id: 'live', label: 'Live Session', icon: Video, description: 'Real-time interactive classes' },
    { id: 'recorded', label: 'Recorded', icon: PlayCircle, description: 'Pre-recorded video lessons' },
    { id: 'webinar', label: 'Webinar', icon: Users, description: 'Large group presentations' }
  ];

  // Filter classes based on selected filters
  const filteredClasses = classes.filter(classItem => {
    const courseMatch = !selectedCourse || classItem.course === selectedCourse;
    const statusMatch = !selectedStatus || classItem.status === selectedStatus;
    const typeMatch = !selectedType || classItem.type === selectedType;
    return courseMatch && statusMatch && typeMatch;
  });

  // Debug the current state
  console.log('DEBUG - CLASSES COUNT:', classes.length);
  console.log('DEBUG - FILTERED COUNT:', filteredClasses.length);
  console.log('DEBUG - ACTIVE FILTERS:', { selectedCourse, selectedStatus, selectedType });
  if (classes.length > 0) {
    console.log('DEBUG - SAMPLE CLASS:', classes[0]);
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target as Node)) {
        setShowCourseDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action handlers
  const handleViewDetails = (classItem: ScheduledClass) => {
    setSelectedClass(classItem);
    setShowDetailsModal(true);
  };

  const handleEditClass = (classItem: ScheduledClass) => {
    setSelectedClass(classItem);
    setClassForm({
      title: classItem.title,
      course: classItem.course,
      date: classItem.date,
      time: classItem.time,
      duration: classItem.duration,
      type: classItem.type,
      maxStudents: classItem.maxStudents,
      description: classItem.description || ''
    });
    setShowEditModal(true);
  };

  const handleCopyLink = (classItem: ScheduledClass) => {
    if (classItem.meetingLink) {
      navigator.clipboard.writeText(classItem.meetingLink).then(() => {
        // In a real app, you'd use a toast notification
        alert('Meeting link copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy link. Please copy manually: ' + classItem.meetingLink);
      });
    } else {
      alert('No meeting link available for this class.');
    }
  };

  const handleCancelClass = async (classItem: ScheduledClass) => {
    if (confirm(`Are you sure you want to cancel "${classItem.title}"?`)) {
      try {
        setActionLoading(classItem.id);
        
        const response = await batchAPI.updateBatchStatus(classItem.id, 'Cancelled');
        
        if (response.data?.batch) {
          // Update the local state
          setClasses(prevClasses => 
            prevClasses.map(c => 
              c.id === classItem.id 
                ? { ...c, status: 'cancelled' as const }
                : c
            )
          );
          alert('Class has been cancelled successfully.');
        } else {
          throw new Error('Failed to cancel class');
        }
      } catch (error: any) {
        console.error('Error cancelling class:', error);
        alert('Failed to cancel class. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const toggleSessions = (classId: string) => {
    setOpenSessions(prev => ({ ...prev, [classId]: !prev[classId] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live': return <Video className="w-4 h-4" />;
      case 'recorded': return <PlayCircle className="w-4 h-4" />;
      case 'webinar': return <Users className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCreateClass = async () => {
    try {
      setActionLoading('create');
      
      // Find the course ID from the course name
      const course = courses.find(c => c.name === classForm.course);
      if (!course) {
        alert('Please select a valid course.');
        return;
      }

      // Parse duration to get end time
      const [hours = 0, minutes = 0] = classForm.duration.match(/\d+/g)?.map(Number) || [1, 0];
      const startTime = new Date(`2000-01-01 ${classForm.time}`);
      const endTime = new Date(startTime.getTime() + (hours * 60 + minutes) * 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      const batchData: IBatchCreateInput = {
        batch_name: classForm.title,
        course: course.id,
        batch_type: 'group',
        start_date: new Date(classForm.date),
        end_date: new Date(new Date(classForm.date).getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
        capacity: classForm.maxStudents,
        status: 'Upcoming',
        schedule: [{
          date: classForm.date,
          start_time: classForm.time,
          end_time: endTimeString,
          title: classForm.title,
          description: classForm.description
        }],
        batch_notes: classForm.description
      };

      const response = await batchAPI.createBatch(batchData);
      console.log('CREATE CLASS RESPONSE:', JSON.stringify(response, null, 2));
      
      // Check for error responses first
      if (response.status === 'error' || response.error) {
        const errorMessage = response.message || response.error || 'Unknown error occurred';
        console.error('API Error:', errorMessage);
        
        if (errorMessage.includes('Insufficient permissions')) {
          alert('Error: You do not have permission to create classes. Please contact your administrator or check if you are logged in with instructor privileges.');
        } else if (errorMessage.includes('Authentication') || errorMessage.includes('token')) {
          alert('Error: Authentication required. Please log in again.');
          // Optionally redirect to login
          // router.push('/login');
        } else {
          alert(`Error creating class: ${errorMessage}`);
        }
        return;
      }
      
      // Try multiple possible response structures for successful responses
      let batchDetails = null;
      
      if (response.data?.success && response.data.data) {
        // Structure: { data: { success: true, data: batch } }
        batchDetails = response.data.data;
        console.log('USING STRUCTURE 1: data.success + data.data');
      } else if (response.data?.data) {
        // Structure: { data: { data: batch } }
        batchDetails = response.data.data;
        console.log('USING STRUCTURE 2: data.data');
      } else if (response.data && typeof response.data === 'object' && response.data._id) {
        // Structure: { data: batch } (direct batch object)
        batchDetails = response.data;
        console.log('USING STRUCTURE 3: direct data');
      } else if (response.status === 'success' && response.data) {
        // Structure: { status: 'success', data: batch }
        batchDetails = response.data;
        console.log('USING STRUCTURE 4: status success');
      } else if (response._id) {
        // Structure: direct batch object
        batchDetails = response;
        console.log('USING STRUCTURE 5: direct response');
      }
      
      if (batchDetails) {
        const newClass = transformBatchToClass(batchDetails);
        console.log('TRANSFORMED NEW CLASS:', newClass);
        console.log('CLASSES BEFORE UPDATE:', classes.length);
        
        setClasses(prev => {
          const updated = [...prev, newClass];
          console.log('CLASSES AFTER UPDATE:', updated.length);
          return updated;
        });
        
        setShowCreateModal(false);
        setClassForm({
          title: '',
          course: '',
          date: '',
          time: '',
          duration: '',
          type: 'live',
          maxStudents: 30,
          description: ''
        });
        alert('Class scheduled successfully!');
      } else {
        console.log('UNEXPECTED RESPONSE STRUCTURE:', JSON.stringify(response, null, 2));
        console.log('RESPONSE TYPE:', typeof response);
        console.log('RESPONSE KEYS:', JSON.stringify(Object.keys(response || {})));
        throw new Error('Failed to create class - could not find batch data in response');
      }
    } catch (error: any) {
      console.error('Error creating class:', error);
      alert('Failed to create class. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateClass = async () => {
    if (!selectedClass) return;
    
    try {
      setActionLoading('update');
      
      // Find the course ID from the course name
      const course = courses.find(c => c.name === classForm.course);
      if (!course) {
        alert('Please select a valid course.');
        return;
      }

      // Parse duration to get end time
      const [hours = 0, minutes = 0] = classForm.duration.match(/\d+/g)?.map(Number) || [1, 0];
      const startTime = new Date(`2000-01-01 ${classForm.time}`);
      const endTime = new Date(startTime.getTime() + (hours * 60 + minutes) * 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      const updateData = {
        batch_name: classForm.title,
        course: course.id,
        start_date: new Date(classForm.date),
        capacity: classForm.maxStudents,
        schedule: [{
          date: classForm.date,
          start_time: classForm.time,
          end_time: endTimeString,
          title: classForm.title,
          description: classForm.description
        }],
        batch_notes: classForm.description
      };

      const response = await batchAPI.updateBatch(selectedClass.id, updateData);
      
      if (response.data?.success && response.data.data) {
        const updatedClass = transformBatchToClass(response.data.data);
        setClasses(prev => prev.map(c => 
          c.id === selectedClass.id ? updatedClass : c
        ));
        setShowEditModal(false);
        setSelectedClass(null);
        alert('Class updated successfully!');
      } else {
        throw new Error('Failed to update class');
      }
    } catch (error: any) {
      console.error('Error updating class:', error);
      alert('Failed to update class. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Transform API batch data to ScheduledClass format
  const transformBatchToClass = (batch: IBatchWithDetails): ScheduledClass => {
    console.log('TRANSFORMING BATCH:', batch);
    try {
      // Get the first schedule entry for date/time
      const firstSchedule = batch.schedule?.[0];
      const startDate = new Date(batch.start_date);
      
      // Map batch status to class status
      const statusMap: Record<TBatchStatus, ScheduledClass['status']> = {
        'Active': 'ongoing',
        'Upcoming': 'upcoming',
        'Completed': 'completed',
        'Cancelled': 'cancelled'
      };

      // Safely extract course title - handle both string and object cases
      let courseTitle = 'Unknown Course';
      if (batch.course_details?.course_title) {
        courseTitle = batch.course_details.course_title;
      } else if (typeof batch.course === 'string') {
        courseTitle = batch.course;
      } else if (batch.course && typeof batch.course === 'object' && 'course_title' in batch.course) {
        courseTitle = (batch.course as any).course_title;
      }

      // Safely extract meeting link
      let meetingLink: string | undefined;
      const zoomMeeting = batch.schedule?.[0]?.zoom_meeting;
      if (zoomMeeting && typeof zoomMeeting === 'object' && 'join_url' in zoomMeeting) {
        meetingLink = zoomMeeting.join_url;
      }

      const transformedClass = {
        id: batch._id || '',
        title: batch.batch_name || 'Untitled Class',
        course: courseTitle,
        date: firstSchedule?.date || startDate.toISOString().split('T')[0],
        time: firstSchedule?.start_time || '09:00',
        duration: firstSchedule ? 
          `${calculateDuration(firstSchedule.start_time, firstSchedule.end_time)}` : 
          '1h',
        type: batch.batch_type === 'individual' ? 'live' : 'live', // Default to live for now
        students: batch.enrolled_students || 0,
        maxStudents: batch.capacity || 30,
        meetingLink: meetingLink,
        description: batch.batch_notes || '',
        status: statusMap[batch.status] || 'upcoming'
      };
      
      console.log('TRANSFORMED CLASS RESULT:', transformedClass);
      return transformedClass;
    } catch (error) {
      console.error('Error transforming batch data:', error, batch);
      // Return a safe fallback object
      const fallbackClass = {
        id: batch._id || 'unknown',
        title: 'Error Loading Class',
        course: 'Unknown Course',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: '1h',
        type: 'live' as const,
        students: 0,
        maxStudents: 30,
        description: 'Error loading class data',
        status: 'upcoming' as const
      };
      console.log('FALLBACK CLASS CREATED:', fallbackClass);
      return fallbackClass;
    }
  };

  // Calculate duration from start and end time
  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffHours}h`;
    }
    return `${diffMinutes}m`;
  };

  // Fetch instructor's batches
  const fetchInstructorBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll get all batches. In a real app, you'd get the instructor ID from auth context
      // You might need to replace this with the actual instructor ID
      const instructorId = 'current-instructor-id'; // Replace with actual instructor ID from auth
      
      const response = await batchAPI.getBatchesByInstructor(instructorId, {
        limit: 50,
        sort_by: 'start_date',
        sort_order: 'desc'
      });

      if (response.data?.success && response.data.data) {
        console.log('Instructor batches response:', response.data.data);
        const transformedClasses = response.data.data.map(transformBatchToClass);
        setClasses(transformedClasses);
      } else {
        // Fallback: get all batches if instructor-specific call fails
        console.log('Instructor-specific call failed, trying all batches...');
        const allBatchesResponse = await batchAPI.getAllBatches({
          limit: 50,
          sort_by: 'start_date',
          sort_order: 'desc'
        });
        
        if (allBatchesResponse.data?.success && allBatchesResponse.data.data) {
          console.log('All batches response:', allBatchesResponse.data.data);
          const transformedClasses = allBatchesResponse.data.data.map(transformBatchToClass);
          setClasses(transformedClasses);
        }
      }
    } catch (error: any) {
      console.error('Error fetching batches:', error);
      setError('Failed to load classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInstructorBatches();
  }, []);

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Classes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchInstructorBatches}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboards/instructor" 
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Schedule Classes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your class schedule
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={actionLoading === 'create'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {actionLoading === 'create' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
              ) : (
                <Plus className="w-4 h-4 mr-2 inline" />
              )}
              New Class
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Simple Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div className="relative" ref={courseDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course
              </label>
              <button 
                onClick={() => setShowCourseDropdown(!showCourseDropdown)} 
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-left flex items-center justify-between"
              >
                <span className={selectedCourse ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
                  {selectedCourse ? courses.find(c => c.name === selectedCourse)?.name : "All courses"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showCourseDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                  <button 
                    onClick={() => { setSelectedCourse(""); setShowCourseDropdown(false); }} 
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    All Courses
                  </button>
                  {courses.map(course => (
                    <button 
                      key={course.id} 
                      onClick={() => { setSelectedCourse(course.name); setShowCourseDropdown(false); }} 
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {course.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Status Filter */}
            <div className="relative" ref={statusDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-left flex items-center justify-between"
              >
                <span className={selectedStatus ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
                  {selectedStatus ? statusOptions.find(s => s.id === selectedStatus)?.label : "All statuses"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => { setSelectedStatus(""); setShowStatusDropdown(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    All Statuses
                  </button>
                  {statusOptions.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => { setSelectedStatus(status.id); setShowStatusDropdown(false); }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative" ref={typeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-left flex items-center justify-between"
              >
                <span className={selectedType ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
                  {selectedType ? typeOptions.find(type => type.id === selectedType)?.label : "All types"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => { setSelectedType(""); setShowTypeDropdown(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    All Types
                  </button>
                  {typeOptions.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => { setSelectedType(type.id); setShowTypeDropdown(false); }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {classes.filter(c => c.status === 'upcoming').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {classes.reduce((sum, c) => sum + c.students, 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {classes.filter(c => c.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <PlayCircle className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {classes.filter(c => c.status === 'ongoing').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Classes List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Classes ({filteredClasses.length})
            </h2>
          </div>

          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No classes found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedCourse || selectedStatus || selectedType 
                  ? "No classes match your current filters." 
                  : "No classes have been scheduled yet."}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Create First Class
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClasses.map((classItem) => (
                <div key={classItem.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {classItem.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(classItem.status)}`}>
                          {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{classItem.course}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{classItem.students}/{classItem.maxStudents} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CalendarDays className="w-4 h-4" />
                          <span>{formatDate(classItem.date)} at {classItem.time}</span>
                        </div>
                      </div>

                      {classItem.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {classItem.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      {classItem.meetingLink && (
                        <button 
                          onClick={() => handleJoinMeeting(classItem.meetingLink!)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                          title="Join Meeting"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleViewDetails(classItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClass(classItem)}
                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                        title="Edit Class"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {classItem.status !== 'cancelled' && classItem.status !== 'completed' && (
                        <button 
                          onClick={() => handleCancelClass(classItem)}
                          disabled={actionLoading === classItem.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                          title="Cancel Class"
                        >
                          {actionLoading === classItem.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simple Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create New Class</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Class Title
                  </label>
                  <input 
                    type="text" 
                    value={classForm.title} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, title: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    placeholder="Enter class title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course
                  </label>
                  <select 
                    value={classForm.course} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, course: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input 
                    type="date" 
                    value={classForm.date} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, date: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input 
                    type="time" 
                    value={classForm.time} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, time: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <input 
                    type="text" 
                    value={classForm.duration} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, duration: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    placeholder="e.g., 1h 30m"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Class Type
                  </label>
                  <select 
                    value={classForm.type} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, type: e.target.value as 'live' | 'recorded' | 'webinar' }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="live">Live Session</option>
                    <option value="recorded">Recorded</option>
                    <option value="webinar">Webinar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Students
                  </label>
                  <input 
                    type="number" 
                    value={classForm.maxStudents} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, maxStudents: Number(e.target.value) }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea 
                  value={classForm.description} 
                  onChange={(e) => setClassForm(prev => ({ ...prev, description: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 h-20 resize-none"
                  placeholder="Enter class description"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)} 
                disabled={actionLoading === 'create'}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateClass} 
                disabled={actionLoading === 'create'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
              >
                {actionLoading === 'create' ? (
                  <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2 inline" />
                )}
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Edit Class Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Class</h2>
              <button
                onClick={() => { setShowEditModal(false); setSelectedClass(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Class Title
                  </label>
                  <input 
                    type="text" 
                    value={classForm.title} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, title: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course
                  </label>
                  <select 
                    value={classForm.course} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, course: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input 
                    type="date" 
                    value={classForm.date} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, date: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input 
                    type="time" 
                    value={classForm.time} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, time: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <input 
                    type="text" 
                    value={classForm.duration} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, duration: e.target.value }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    placeholder="e.g., 1h 30m"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Class Type
                  </label>
                  <select 
                    value={classForm.type} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, type: e.target.value as 'live' | 'recorded' | 'webinar' }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="live">Live Session</option>
                    <option value="recorded">Recorded</option>
                    <option value="webinar">Webinar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Students
                  </label>
                  <input 
                    type="number" 
                    value={classForm.maxStudents} 
                    onChange={(e) => setClassForm(prev => ({ ...prev, maxStudents: Number(e.target.value) }))} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea 
                  value={classForm.description} 
                  onChange={(e) => setClassForm(prev => ({ ...prev, description: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 h-20 resize-none"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => { setShowEditModal(false); setSelectedClass(null); }} 
                disabled={actionLoading === 'update'}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateClass} 
                disabled={actionLoading === 'update'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
              >
                {actionLoading === 'update' ? (
                  <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                ) : (
                  <Edit3 className="w-4 h-4 mr-2 inline" />
                )}
                Update Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple View Details Modal */}
      {showDetailsModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Class Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{selectedClass.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedClass.status)}`}>
                    {selectedClass.status.charAt(0).toUpperCase() + selectedClass.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{selectedClass.course}</span>
                </div>
                {selectedClass.description && (
                  <p className="text-gray-700 dark:text-gray-300">{selectedClass.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Schedule</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedClass.date)} at {selectedClass.time}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration: {selectedClass.duration}</p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Enrollment</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{selectedClass.students} / {selectedClass.maxStudents} students</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(selectedClass.students / selectedClass.maxStudents) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {selectedClass.meetingLink && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Meeting Link</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={selectedClass.meetingLink} 
                      readOnly 
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm"
                    />
                    <button
                      onClick={() => handleCopyLink(selectedClass)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                Close
              </button>
              <button 
                onClick={() => { setShowDetailsModal(false); handleEditClass(selectedClass); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                <Edit3 className="w-4 h-4 mr-2 inline" />
                Edit Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 