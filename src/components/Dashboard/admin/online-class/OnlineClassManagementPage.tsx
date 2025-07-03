"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaChevronDown, FaUsers, FaUser, FaCalendarAlt, FaVideo, FaCopy, FaUpload, FaArrowRight, FaChevronUp } from "react-icons/fa";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls, apiBaseUrl } from "@/apis";
import { batchAPI, IBatchSchedule, IZoomMeetingInput, IRecordedLessonInput, IRecordedLesson, IUploadRecordedLessonInput } from "@/apis/batch";
import { toast } from "react-hot-toast";
import { showToast } from "@/utils/toastManager";
import { apiClient } from "@/apis/apiClient";
import { UploadResponse } from "@/services/uploadService";
import videoUploadUtils, { 
  convertBlobToBase64, 
  validateVideoFile, 
  formatFileSize, 
  type IVideoChunkEncoding 
} from "@/utils/videoUploadUtils";
import CorsErrorHandler from '@/components/CorsErrorHandler';
import SimpleRecordedLessonUpload from './SimpleRecordedLessonUpload';

// TypeScript interfaces
interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  role: string[];
  status: string;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ISession {
  _id: string;
  title: string;
  instructor: string;
  instructorId?: string;
  sessionType: 'batch' | 'individual';
  date: string;
  time: string;
  duration: string;
  students: number;
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  schedules?: Array<{
    _id: string;
    day: string;
    start_time: string;
    end_time: string;
    zoom_meeting?: {
      meeting_id: string;
      join_url: string;
      topic: string;
      password: string;
    };
    recorded_lessons?: IRecordedLesson[];
  }>;
  batchId?: string;
}

interface IStudent {
  _id: string;
  full_name: string;
  email?: string;
}

interface IOnlineClassManagementProps {
  courseCategory: string;
  pageTitle: string;
  pageDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientColors: string;
  backUrl?: string;
}

// Combined status type for video upload and processing
type TVideoStatus = 'initialized' | 'uploading' | 'processing' | 'completed' | 'failed';

export default function OnlineClassManagementPage({
  courseCategory,
  pageTitle,
  pageDescription,
  icon: IconComponent,
  gradientColors,
  backUrl = "/dashboards/admin/online-class/live"
}: IOnlineClassManagementProps) {
  const { getQuery, loading } = useGetQuery();
  const { getQuery: fetchSessions, loading: sessionsLoading } = useGetQuery();
  const router = useRouter();
  
  // State management
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [selectedSessionType, setSelectedSessionType] = useState<string>("");
  const [showInstructorDropdown, setShowInstructorDropdown] = useState<boolean>(false);
  const [showSessionTypeDropdown, setShowSessionTypeDropdown] = useState<boolean>(false);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [creatingZoomMeeting, setCreatingZoomMeeting] = useState<string | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState<boolean>(false);
  const [sessionForm, setSessionForm] = useState<{ day: string; start_time: string; end_time: string; date: string }>({ 
    day: '', 
    start_time: '', 
    end_time: '', 
    date: '' 
  });
  const [currentBatchIdForSession, setCurrentBatchIdForSession] = useState<string | null>(null);
  const [showAddRecordingModal, setShowAddRecordingModal] = useState<boolean>(false);
  const [recordingForm, setRecordingForm] = useState<{ 
    title: string; 
    url: string; 
    recorded_date: string; 
    uploadError: string; 
    uploadSuccess: boolean; 
    fileName: string;
    videoId: string;
    uploadStatus: TVideoStatus;
    processingProgress: number;
    corsError?: {
      error: Error;
      endpoint: string;
      origin: string;
    };
  }>({ 
    title: '', 
    url: '', 
    recorded_date: '', 
    uploadError: '', 
    uploadSuccess: false, 
    fileName: '',
    videoId: '',
    uploadStatus: 'initialized' as TVideoStatus,
    processingProgress: 0
  });
  const [currentBatchIdForRecording, setCurrentBatchIdForRecording] = useState<string | null>(null);
  const [currentSessionIdForRecording, setCurrentSessionIdForRecording] = useState<string | null>(null);
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [showStudentDropdown, setShowStudentDropdown] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Refs for dropdown management
  const instructorDropdownRef = useRef<HTMLDivElement>(null);
  const sessionTypeDropdownRef = useRef<HTMLDivElement>(null);
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  // Session type options
  const sessionTypes = [
    { id: 'batch', label: 'Batch Classes', icon: FaUsers, description: 'Group sessions with multiple students' },
    { id: 'individual', label: 'Individual Classes', icon: FaUser, description: 'One-on-one personalized sessions' }
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchInstructors();
    fetchStudents();
    loadCategoryBatches();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (instructorDropdownRef.current && !instructorDropdownRef.current.contains(event.target as Node)) {
        setShowInstructorDropdown(false);
      }
      if (sessionTypeDropdownRef.current && !sessionTypeDropdownRef.current.contains(event.target as Node)) {
        setShowSessionTypeDropdown(false);
      }
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
        setShowStudentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update batches when student filter changes
  useEffect(() => {
    if (selectedStudent) loadBatchesByStudent(selectedStudent);
    else loadCategoryBatches();
  }, [selectedStudent]);

  // Fetch instructors from API
  const fetchInstructors = async () => {
    try {
      await getQuery({
        url: apiUrls.Instructor.getAllInstructors,
        onSuccess: (response: any) => {
          if (response?.data?.instructors) {
            setInstructors(response.data.instructors);
          } else if (Array.isArray(response?.data)) {
            setInstructors(response.data);
          } else {
            console.warn('Unexpected instructor data format:', response);
            setInstructors([]);
          }
        },
        onFail: (error: any) => {
          console.error('Failed to fetch instructors:', error);
          setInstructors([]);
        }
      });
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    }
  };

  // Fetch students list for filter
  const fetchStudents = async () => {
    try {
      await getQuery({
        url: apiUrls.Students.getAllStudents,
        onSuccess: (response: any) => {
          if (Array.isArray(response.students)) setStudents(response.students);
          else if (Array.isArray(response.data?.students)) setStudents(response.data.students);
          else if (Array.isArray(response.data)) setStudents(response.data);
          else setStudents([]);
        },
        onFail: (error: any) => {
          console.error('Failed to fetch students:', error);
          setStudents([]);
        }
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  // Function to load category batches
  const loadCategoryBatches = async () => {
    await fetchSessions({
      url: `/batches/courses/category/${encodeURIComponent(courseCategory)}/batches`,
      onSuccess: (response: any) => {
        const data = response?.data?.data || response?.data;
        const transformed: ISession[] = Array.isArray(data)
          ? data.map((batch: any) => ({
              _id: batch._id,
              batchId: batch._id,
              title: batch.batch_name,
              instructor: typeof batch.assigned_instructor === 'string'
                ? batch.assigned_instructor
                : batch.assigned_instructor?.full_name || '',
              instructorId: typeof batch.assigned_instructor === 'string' 
                ? batch.assigned_instructor 
                : batch.assigned_instructor?._id,
              sessionType: batch.batch_type || (batch.capacity === 1 ? 'individual' : 'batch'),
              date: batch.start_date.split('T')[0],
              time: batch.schedule?.[0]?.start_time || '',
              duration: '',
              students: batch.enrolled_students,
              meetingLink: batch.schedule?.[0]?.zoom_meeting?.join_url,
              status: (batch.status?.toLowerCase() || 'scheduled') as 'scheduled' | 'ongoing' | 'completed',
              schedules: batch.schedule?.map((s: any) => ({
                _id: s._id,
                day: s.day,
                start_time: s.start_time,
                end_time: s.end_time,
                zoom_meeting: s.zoom_meeting,
                recorded_lessons: s.recorded_lessons || []
              })) || []
            }))
          : [];
        setSessions(transformed);
      },
      onFail: (error: any) => {
        console.error('Failed to load batches by category:', error);
        showToast.error('Failed to load classes');
      }
    });
  };

  // Load batches by student selection
  const loadBatchesByStudent = async (studentId: string) => {
    try {
      const resp = await batchAPI.getIndividualBatchesByStudent(studentId);
      const list = resp.data?.data || resp.data;
      if (!Array.isArray(list)) { setSessions([]); return; }
      const filtered = list.filter((entry: any) => entry.course?.course_title === courseCategory);
      const transformed: ISession[] = filtered.map((entry: any) => {
        const batch = entry.batch;
        return {
          _id: batch._id,
          batchId: batch._id,
          title: batch.batch_name,
          instructor: typeof batch.assigned_instructor === 'string' ? batch.assigned_instructor : batch.assigned_instructor?.full_name || '',
          instructorId: typeof batch.assigned_instructor === 'string' ? batch.assigned_instructor : batch.assigned_instructor?._id,
          sessionType: batch.batch_type || (batch.capacity === 1 ? 'individual' : 'batch'),
          date: batch.start_date.split('T')[0],
          time: batch.schedule?.[0]?.start_time || '',
          duration: '',
          students: batch.enrolled_students,
          meetingLink: batch.schedule?.[0]?.zoom_meeting?.join_url,
          status: (batch.status?.toLowerCase() || 'scheduled') as 'scheduled' | 'ongoing' | 'completed',
          schedules: batch.schedule?.map((s: any) => ({ _id: s._id, day: s.day, start_time: s.start_time, end_time: s.end_time, zoom_meeting: s.zoom_meeting, recorded_lessons: s.recorded_lessons || [] })) || []
        };
      });
      setSessions(transformed);
    } catch (error: any) {
      console.error('Failed to load batches by student:', error);
      setSessions([]);
    }
  };

  // Filter sessions based on selected instructor and session type
  const filteredSessions = sessions.filter(session => {
    const instructorMatch = !selectedInstructor || session.instructor.toLowerCase().includes(selectedInstructor.toLowerCase());
    const sessionTypeMatch = !selectedSessionType || session.sessionType === selectedSessionType;
    return instructorMatch && sessionTypeMatch;
  });

  // Handle instructor selection
  const handleInstructorSelect = (instructor: IInstructor) => {
    setSelectedInstructor(instructor.full_name);
    setShowInstructorDropdown(false);
  };

  // Handle session type selection
  const handleSessionTypeSelect = (sessionType: string) => {
    setSelectedSessionType(sessionType);
    setShowSessionTypeDropdown(false);
  };

  // Copy meeting link
  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    showToast.success('Meeting link copied to clipboard!');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Create Zoom meeting function
  const createZoomMeeting = async (batchId: string, sessionId: string, title: string) => {
    setCreatingZoomMeeting(sessionId);
    try {
      const meetingData: IZoomMeetingInput = {
        topic: title,
        type: 2,
        start_time: new Date().toISOString(),
        duration: 60,
        timezone: 'Asia/Kolkata',
        agenda: `Session for ${title}`,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: 'both',
          auto_recording: 'none'
        }
      };
      const response = await batchAPI.createZoomMeetingForSession(batchId, sessionId, meetingData);
      if (response.data?.success) {
        showToast.success('Zoom meeting created successfully!');
        loadCategoryBatches();
      } else {
        throw new Error('Failed to create Zoom meeting');
      }
    } catch (error: any) {
      console.error('Error creating Zoom meeting:', error);
      showToast.error(error.message || 'Failed to create Zoom meeting');
    } finally {
      setCreatingZoomMeeting(null);
    }
  };

  // Modal handlers
  const openAddSessionModal = (batchId: string) => {
    setCurrentBatchIdForSession(batchId);
    setSessionForm({ day: '', start_time: '', end_time: '', date: '' });
    setShowAddSessionModal(true);
  };

  const submitAddSession = async () => {
    if (!currentBatchIdForSession) return;
    try {
      // Create proper IBatchSchedule object with required date field
      const scheduleData: IBatchSchedule = {
        date: sessionForm.date || new Date().toISOString().split('T')[0],
        start_time: sessionForm.start_time,
        end_time: sessionForm.end_time,
        title: sessionForm.day
      };
      
      await batchAPI.addScheduledSession(currentBatchIdForSession, scheduleData);
      showToast.success('Session added successfully!');
      loadCategoryBatches();
    } catch (error: any) {
      console.error('Error adding session:', error);
      showToast.error(error.message || 'Failed to add session');
    } finally {
      setShowAddSessionModal(false);
    }
  };

  const openAddRecordingModal = (batchId: string, sessionId: string) => {
    setCurrentBatchIdForRecording(batchId);
    setCurrentSessionIdForRecording(sessionId);
    setRecordingForm({ 
      title: '', 
      url: '', 
      recorded_date: '', 
      uploadError: '', 
      uploadSuccess: false, 
      fileName: '',
      videoId: '',
      uploadStatus: 'initialized' as TVideoStatus,
      processingProgress: 0
    });
    setUploadProgress(0);
    setShowAddRecordingModal(true);
  };

  const submitAddRecording = async () => {
    if (!currentBatchIdForRecording || !currentSessionIdForRecording) return;
    const payload: IRecordedLessonInput = {
      title: recordingForm.title,
      url: recordingForm.url,
      recorded_date: recordingForm.recorded_date || new Date().toISOString(),
    };
    try {
      await batchAPI.addRecordedLesson(
        currentBatchIdForRecording,
        currentSessionIdForRecording,
        payload
      );
      showToast.success('Recorded lesson added!');
      loadCategoryBatches();
    } catch (error: any) {
      console.error('Error adding recorded lesson:', error);
      showToast.error(error.message || 'Failed to add recorded lesson');
    } finally {
      setShowAddRecordingModal(false);
    }
  };

  // Enhanced video file upload with base64 encoding
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file using video upload utils
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setRecordingForm(prev => ({ 
        ...prev, 
        uploadError: validation.errors.join(', ')
      }));
      return;
    }
    
    // Show warnings if any
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        toast(warning, { icon: '⚠️' });
      });
    }
    
    // Reset form state
    setRecordingForm(prev => ({ 
      ...prev, 
      uploadError: '', 
      uploadSuccess: false,
      uploadStatus: 'uploading' as TVideoStatus,
      processingProgress: 0,
      fileName: file.name
    }));
    setUploadProgress(0);
    
    try {
      console.log(`Starting base64 upload for ${formatFileSize(file.size)} video file`);
      
      // Validate required IDs
      if (!currentBatchIdForRecording) {
        throw new Error('Batch ID is required for recorded lesson upload');
      }
      
      // Convert file to base64
      setRecordingForm(prev => ({ ...prev, uploadStatus: 'uploading' }));
      const encodedData = await convertBlobToBase64(file);
      
      // Simulate progress during encoding
      setUploadProgress(50);
      
      // Prepare upload payload for recorded lesson endpoint
      const uploadPayload: IUploadRecordedLessonInput = {
        base64String: `data:${file.type};base64,${encodedData.base64Data}`,
        title: recordingForm.title || `Recorded lesson for ${file.name}`,
        recorded_date: recordingForm.recorded_date || new Date().toISOString(),
        // Additional metadata for tracking
        metadata: {
          fileName: file.name,
          originalSize: encodedData.originalSize,
          encodedSize: encodedData.encodedSize,
          mimeType: file.type,
          uploadedAt: new Date().toISOString()
        }
      };
      
      console.log(`Uploading ${formatFileSize(encodedData.originalSize)} file as ${formatFileSize(encodedData.encodedSize)} base64 data`);
      
      // Upload to recorded lesson endpoint using the new API method
      setUploadProgress(75);
      
      // Validate required session ID for the specific endpoint
      if (!currentSessionIdForRecording) {
        throw new Error('Session ID is required for recorded lesson upload. Please select a valid session.');
      }
      
      console.log('Upload request details:', {
        batchId: currentBatchIdForRecording,
        sessionId: currentSessionIdForRecording,
        payloadKeys: Object.keys(uploadPayload),
        titleLength: uploadPayload.title?.length || 0,
        fileSize: encodedData.originalSize,
        encodedSize: encodedData.encodedSize
      });
      
      let response;
      try {
        // Enhanced authorization check with super admin override
        const userRole = localStorage.getItem('role') || localStorage.getItem('userRole');
        const token = localStorage.getItem('token');
        
        console.log('Auth Debug:', {
          userRole,
          hasToken: !!token,
          isSuperAdmin: userRole === 'super_admin',
          roles: userRole?.split(',') || []
        });

        // Check both array of roles and single role string for maximum compatibility
        const userRoles = userRole?.split(',').map(r => r.trim()) || [];
        const isAuthorized = 
          userRole === 'super_admin' || // Direct super_admin check
          userRoles.includes('super_admin') || // Check in array
          userRoles.some(role => ['admin', 'instructor'].includes(role));

        if (!token) {
          throw new Error('Authentication token is missing. Please log in again.');
        }

        if (!isAuthorized) {
          console.warn('Permission Check Failed:', {
            providedRole: userRole,
            parsedRoles: userRoles,
            requiredRoles: ['super_admin', 'admin', 'instructor']
          });
          throw new Error('You do not have permission to upload recorded lessons. Required roles: super_admin, admin, or instructor');
        }

        // Use the new API method for uploading recorded lessons
        response = await batchAPI.uploadAndAddRecordedLesson(
          currentBatchIdForRecording,
          currentSessionIdForRecording,
          uploadPayload
        );

        // Fix type comparison for status
        const responseStatus = Number(response.status); // Convert to number for comparison
        const dataStatus = response.data?.status;
        
        const isUploadAccepted = 
          responseStatus === 202 || 
          (typeof dataStatus === 'string' && ['uploading', 'in_progress', '202'].includes(dataStatus)) ||
          (typeof dataStatus === 'number' && dataStatus === 202) ||
          response.data?.success === true;

        if (response.data && (response.data.success || isUploadAccepted)) {
          const responseData = response.data.data;
          const uploadStatus = response.data.status;
          
          // Handle async upload response (202 Accepted)
          if (uploadStatus === 'uploading' || uploadStatus === 'in_progress' || responseData?.uploadStatus === 'in_progress') {
            console.log('Async upload started:', {
              status: uploadStatus,
              batchId: responseData?.batchId,
              sessionId: responseData?.sessionId,
              title: responseData?.title,
              videoId: responseData?.videoId,
              message: response.data.message
            });
            
            setRecordingForm(prev => ({ 
              ...prev, 
              uploadSuccess: true,
              uploadError: '',
              videoId: responseData?.videoId || `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              uploadStatus: 'processing' as TVideoStatus
            }));
            
            setUploadProgress(90);
            showToast.success('Upload started successfully! Processing in background...');
            
            // Show background processing message
            setTimeout(() => {
              setRecordingForm(prev => ({ 
                ...prev, 
                uploadStatus: 'completed' as TVideoStatus,
                url: responseData?.url || 'processing' // Placeholder URL
              }));
              setUploadProgress(100);
              showToast.success('Recorded lesson is being processed in background!');
            }, 2000);
            
          } else {
            // Handle synchronous upload response (if any)
            const uploadedFileUrl = responseData?.url;
            
            if (!uploadedFileUrl) {
              console.error('Failed to extract URL from response:', response.data);
              throw new Error('Upload succeeded but no file URL was returned');
            }
            
            const videoId = responseData?.videoId || `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            setRecordingForm(prev => ({ 
              ...prev, 
              url: uploadedFileUrl,
              uploadSuccess: true,
              uploadError: '',
              videoId: videoId,
              uploadStatus: 'completed'
            }));
            
            setUploadProgress(100);
            showToast.success('Recorded lesson uploaded successfully!');
            
            console.log('Recorded lesson upload completed:', {
              videoId,
              url: uploadedFileUrl,
              batchInfo: responseData?.batchId,
              sessionInfo: responseData?.sessionId,
              title: responseData?.title,
              originalSize: encodedData.originalSize,
              encodedSize: encodedData.encodedSize,
              fullResponse: response.data
            });
          }
          
        } else {
          throw new Error(response.data?.message || 'Upload failed - no success status returned');
        }
        
      } catch (networkError: any) {
        console.error('Network error during upload:', networkError);
        
        // Enhanced error handling with permission checks
        if (networkError.response?.status === 403) {
          const errorResponse = networkError.response?.data;
          const errorMessage = typeof errorResponse === 'string' 
            ? errorResponse 
            : errorResponse?.message || 'Insufficient permissions';
            
          const isAuthError = errorMessage.toLowerCase().includes('permission') || 
                          errorMessage.toLowerCase().includes('unauthorized') ||
                          errorMessage.toLowerCase().includes('forbidden');

          if (isAuthError) {
            const permissionError = new Error(`Permission Error: ${errorMessage}. This could be due to:
1. Your account doesn't have the required role
2. Your session has expired
3. Missing or invalid authentication token

Please try:
- Logging out and logging back in
- Contacting your administrator for role upgrade
- Checking if you're assigned to this batch/course`);

            console.error('Permission Debug Info:', {
              endpoint: `${apiBaseUrl}/batches/${currentBatchIdForRecording}/schedule/${currentSessionIdForRecording}/upload-recorded-lesson`,
              userRole: localStorage.getItem('userRole'),
              hasToken: !!localStorage.getItem('token'),
              error: networkError.message
            });

            setRecordingForm(prev => ({
              ...prev,
              uploadError: permissionError.message,
              uploadStatus: 'failed'
            }));

            throw permissionError;
          } else {
            // Handle other 403 errors (like CORS)
            const corsError = new Error(`CORS Error: The server rejected the request. This is likely due to:
1. Missing CORS configuration on the server
2. Invalid authentication
3. Server not accepting requests from ${window.location.origin}

Please check:
- Server CORS configuration
- Authentication status
- API endpoint permissions`);
            
            setRecordingForm(prev => ({
              ...prev,
              corsError: {
                error: corsError,
                endpoint: `${apiBaseUrl}/batches/${currentBatchIdForRecording}/schedule/${currentSessionIdForRecording}/upload-recorded-lesson`,
                origin: window.location.origin
              }
            }));
            
            throw corsError;
          }
        } else if (networkError.response?.status === 404) {
          throw new Error('Upload endpoint not found. Please check if the recorded lesson service is deployed.');
        } else if (networkError.response?.status === 500) {
          throw new Error(`Server error: ${networkError.response?.data?.message || 'Internal server error'}`);
        } else if (networkError.response?.data) {
          throw new Error(networkError.response.data.message || 'Upload request failed');
        } else if (networkError.message?.includes('Network Error')) {
          throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
        } else {
          throw new Error(`Upload failed: ${networkError.message || 'Unknown error occurred'}`);
        }
      }
      
    } catch (error: any) {
      console.error('Video upload failed:', error);
      
      let errorMessage = 'Upload failed. Please try again.';
      
      // Enhanced error message handling
      if (error.response?.data) {
        const responseData = error.response.data;
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.details) {
          errorMessage = responseData.details;
        }
      } else if (error.message && error.message !== '[object Object]') {
        errorMessage = error.message;
      }
      
      // Add specific error context
      if (error.response?.status === 413) {
        errorMessage = 'File too large for server. Please use a smaller file or try compressing the video.';
      } else if (error.response?.status === 415) {
        errorMessage = 'Unsupported file type. Please use MP4, MOV, WebM, AVI, or MKV format.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred during upload. Please try again later.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = `Upload timeout after 5 minutes. Large files may take longer. Please try with a smaller file or check your connection.`;
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.name === 'QuotaExceededError') {
        errorMessage = 'Not enough storage space available. Please free up space and try again.';
      }
      
      setRecordingForm(prev => ({ 
        ...prev, 
        uploadError: errorMessage,
        uploadSuccess: false,
        uploadStatus: 'failed'
      }));
      
      setUploadProgress(0);
      showToast.error(errorMessage);
    }
  };

  // Note: Base64 upload doesn't require processing monitoring
  // Videos are immediately available after upload

  const toggleSessions = (sessionId: string) => setOpenSessions(prev => ({ ...prev, [sessionId]: !prev[sessionId] }));

  // Render sessions list
  const renderSessionsList = () => {
    if (sessionsLoading) {
      return (
        <div className="text-center py-16">
          <div className="relative">
            <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            <div className="absolute inset-0 animate-ping mx-auto h-12 w-12 border-4 border-blue-300 rounded-full opacity-20"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg font-medium">Loading classes...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">Please wait while we fetch your data</p>
        </div>
      );
    }
    
    if (filteredSessions.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaCalendarAlt className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No classes found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
            {selectedInstructor || selectedSessionType 
              ? "No classes match your current filters. Try adjusting your search criteria." 
              : "No classes have been scheduled yet. Create your first batch to get started!"}
          </p>
          <button
            onClick={() => router.push('/dashboards/admin/online-class/live/batch-management')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Create First Batch
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {filteredSessions.map((session, index) => (
          <div 
            key={session._id} 
            className="group bg-gradient-to-r from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700/50 border border-gray-200/60 dark:border-gray-700/60 rounded-3xl p-8 hover:shadow-2xl hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-500 hover:scale-[1.02] animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {session.sessionType === 'batch' ? '👥' : '👤'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)} shadow-sm`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {session.sessionType === 'batch' ? 'Group Class' : 'Individual Session'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Instructor</div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{session.instructor}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/30">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      {session.sessionType === 'batch' ? <FaUsers className="text-white text-sm" /> : <FaUser className="text-white text-sm" />}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Type</div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {session.sessionType === 'batch' ? `Batch (${session.students} students)` : 'Individual'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <FaCalendarAlt className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{session.date}</div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Scheduled Sessions */}
                {session.schedules && session.schedules.length > 0 && openSessions[session._id] && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-sm font-bold">📋</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Scheduled Sessions</div>
                      </div>
                      <button
                        onClick={() => openAddSessionModal(session.batchId!)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                      >
                        <span className="text-lg">➕</span>
                        Add Session
                      </button>
                    </div>
                    
                    <div className="grid gap-4">
                      {session.schedules.map((schedule, scheduleIndex) => (
                        <div 
                          key={schedule._id} 
                          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left-2"
                          style={{ animationDelay: `${scheduleIndex * 50}ms` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <FaCalendarAlt className="text-white" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{schedule.day}</div>
                                <div className="text-gray-600 dark:text-gray-400 font-medium">{schedule.start_time} - {schedule.end_time}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {schedule.zoom_meeting ? (
                                <>
                                  <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 py-2 px-4 rounded-xl">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <FaVideo className="text-green-600 dark:text-green-400" />
                                    <span className="text-green-700 dark:text-green-400 font-semibold text-sm">Zoom Ready</span>
                                  </div>
                                  <button
                                    onClick={() => copyMeetingLink(schedule.zoom_meeting!.join_url)}
                                    className="p-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-xl transition-all duration-200 hover:scale-110 group"
                                    title="Copy Zoom link"
                                  >
                                    <FaCopy className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500" />
                                  </button>
                                  <button
                                    onClick={() => openAddRecordingModal(session.batchId!, schedule._id)}
                                    className="p-3 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-xl transition-all duration-200 hover:scale-110 group"
                                    title="Add Recorded Lesson"
                                  >
                                    <FaUpload className="text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-500" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => createZoomMeeting(session.batchId!, schedule._id, session.title)}
                                  disabled={creatingZoomMeeting === schedule._id}
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                  {creatingZoomMeeting === schedule._id ? (
                                    <>
                                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                      Creating...
                                    </>
                                  ) : (
                                    <>
                                      <FaVideo />
                                      Create Zoom
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Enhanced Recorded Lessons Table */}
                          {schedule.recorded_lessons && schedule.recorded_lessons.length > 0 && (
                            <div className="mt-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">🎥</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">Recorded Lessons</span>
                              </div>
                              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full">
                                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                    <tr>
                                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">Title</th>
                                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">Date</th>
                                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {schedule.recorded_lessons.map((lesson) => (
                                      <tr key={lesson._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                          <a 
                                            href={lesson.url} 
                                            target="_blank" 
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-200"
                                          >
                                            {lesson.title}
                                          </a>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                                          {new Date(lesson.recorded_date).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="flex gap-3">
                                            <button 
                                              onClick={() => window.open(lesson.url, '_blank')} 
                                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                            >
                                              View
                                            </button>
                                            <button 
                                              onClick={() => copyMeetingLink(lesson.url)} 
                                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                            >
                                              Copy Link
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 ml-6">
                <button
                  onClick={() => toggleSessions(session._id)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 ${
                    openSessions[session._id]
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  }`}
                >
                  {openSessions[session._id] ? (
                    <>
                      <FaChevronUp />
                      Close
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      Manage
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Enhanced Header with Glass Effect */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-8">
            <Link
              href={backUrl}
              className="group w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200" />
            </Link>
            
            <div className="flex items-center gap-6">
              <div className={`relative w-20 h-20 rounded-3xl ${gradientColors} p-1 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                  <IconComponent className="text-3xl text-gray-700 dark:text-gray-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    {pageTitle}
                  </h1>
                  <span className="text-3xl animate-bounce">📈</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {pageDescription}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live System</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Spacing */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Enhanced Filter Section */}
        <div className="relative z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-10 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔍</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Filter Classes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Enhanced Student Dropdown */}
            <div className="relative group" ref={studentDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Select Student
              </label>
              <button 
                onClick={() => setShowStudentDropdown(!showStudentDropdown)} 
                className="w-full px-5 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl text-left flex items-center justify-between hover:border-blue-500 hover:shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 group-hover:scale-[1.02]"
              >
                <span className={selectedStudent ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500 dark:text-gray-400"}>
                  {selectedStudent ? students.find(s => s._id === selectedStudent)?.full_name : "Select a student..."}
                </span>
                <FaChevronDown className={`text-gray-400 transition-all duration-300 ${showStudentDropdown ? 'rotate-180 text-blue-500' : ''}`} />
              </button>
              {showStudentDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl z-[100] max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <button 
                      onClick={() => { setSelectedStudent(""); setShowStudentDropdown(false); }} 
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 font-medium text-gray-700 dark:text-gray-300"
                    >
                      All Students
                    </button>
                    {students.map(student => (
                      <button 
                        key={student._id} 
                        onClick={() => { setSelectedStudent(student._id); setShowStudentDropdown(false); }} 
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
                      >
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{student.full_name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Instructor Dropdown */}
            <div className="relative group" ref={instructorDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Select Instructor
              </label>
              <button
                onClick={() => setShowInstructorDropdown(!showInstructorDropdown)}
                className="w-full px-5 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl text-left flex items-center justify-between hover:border-green-500 hover:shadow-lg focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 group-hover:scale-[1.02]"
              >
                <span className={selectedInstructor ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500 dark:text-gray-400"}>
                  {selectedInstructor || "Choose an instructor..."}
                </span>
                <FaChevronDown className={`text-gray-400 transition-all duration-300 ${showInstructorDropdown ? 'rotate-180 text-green-500' : ''}`} />
              </button>
              
              {showInstructorDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl z-[100] max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedInstructor("");
                        setShowInstructorDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 font-medium text-gray-700 dark:text-gray-300"
                    >
                      All Instructors
                    </button>
                    {instructors.map((instructor) => (
                      <button
                        key={instructor._id}
                        onClick={() => handleInstructorSelect(instructor)}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
                      >
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">{instructor.full_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{instructor.email}</div>
                        </div>
                      </button>
                    ))}
                    {instructors.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                        {loading ? "Loading instructors..." : "No instructors found"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Session Type Dropdown */}
            <div className="relative group" ref={sessionTypeDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Class Type
              </label>
              <button
                onClick={() => setShowSessionTypeDropdown(!showSessionTypeDropdown)}
                className="w-full px-5 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl text-left flex items-center justify-between hover:border-purple-500 hover:shadow-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 group-hover:scale-[1.02]"
              >
                <span className={selectedSessionType ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500 dark:text-gray-400"}>
                  {selectedSessionType ? sessionTypes.find(type => type.id === selectedSessionType)?.label : "Choose class type..."}
                </span>
                <FaChevronDown className={`text-gray-400 transition-all duration-300 ${showSessionTypeDropdown ? 'rotate-180 text-purple-500' : ''}`} />
              </button>
              
              {showSessionTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedSessionType("");
                        setShowSessionTypeDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 font-medium text-gray-700 dark:text-gray-300"
                    >
                      All Types
                    </button>
                    {sessionTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleSessionTypeSelect(type.id)}
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <IconComponent className="text-white text-sm" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 dark:text-gray-200">{type.label}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{type.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Sessions List */}
        <div className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">📅</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Scheduled Classes
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredSessions.length} classes found
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboards/admin/online-class/live/batch-management')}
              className="group px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">✨</span>
              Add / Edit Batches
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {renderSessionsList()}
        </div>
      </div>
      
      {/* Enhanced Add Session Modal */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4 border border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">📅</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Scheduled Session</h2>
                <p className="text-gray-600 dark:text-gray-400">Create a new session for this batch</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Session Date
                </label>
                <input 
                  type="date" 
                  value={sessionForm.date} 
                  onChange={e => setSessionForm(prev => ({ ...prev, date: e.target.value }))} 
                  className="w-full px-4 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 group-hover:border-blue-400"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Day/Title
                </label>
                <input 
                  type="text" 
                  value={sessionForm.day} 
                  onChange={e => setSessionForm(prev => ({ ...prev, day: e.target.value }))} 
                  className="w-full px-4 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 group-hover:border-green-400"
                  placeholder="e.g., Monday Session, Week 1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Start Time
                  </label>
                  <input 
                    type="time" 
                    value={sessionForm.start_time} 
                    onChange={e => setSessionForm(prev => ({ ...prev, start_time: e.target.value }))} 
                    className="w-full px-4 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-orange-400"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    End Time
                  </label>
                  <input 
                    type="time" 
                    value={sessionForm.end_time} 
                    onChange={e => setSessionForm(prev => ({ ...prev, end_time: e.target.value }))} 
                    className="w-full px-4 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 group-hover:border-purple-400"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={() => setShowAddSessionModal(false)} 
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button 
                onClick={submitAddSession} 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <span className="text-lg">💾</span>
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Simple Recording Upload Modal */}
      <SimpleRecordedLessonUpload
        batchId={currentBatchIdForRecording || ''}
        sessionId={currentSessionIdForRecording || ''}
        isOpen={showAddRecordingModal}
        onSuccess={() => {
          setShowAddRecordingModal(false);
          loadCategoryBatches();
          showToast.success('Recorded lesson added successfully!');
        }}
        onCancel={() => setShowAddRecordingModal(false)}
      />
    </div>
  );
} 