"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaChevronDown, FaUsers, FaUser, FaCalendarAlt, FaVideo, FaCopy, FaUpload, FaArrowRight, FaChevronUp } from "react-icons/fa";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls, apiBaseUrl } from "@/apis";
import { batchAPI, IBatchSchedule, IZoomMeetingInput, IRecordedLessonInput, IRecordedLesson } from "@/apis/batch";
import { toast } from "react-hot-toast";
import { apiClient } from "@/apis/apiClient";
import { UploadResponse } from "@/services/uploadService";

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
  const [recordingForm, setRecordingForm] = useState<{ title: string; url: string; recorded_date: string; uploadError: string; uploadSuccess: boolean; fileName: string }>({ 
    title: '', 
    url: '', 
    recorded_date: '', 
    uploadError: '', 
    uploadSuccess: false, 
    fileName: '' 
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
        toast.error('Failed to load classes');
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
    toast.success('Meeting link copied to clipboard!');
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
        toast.success('Zoom meeting created successfully!');
        loadCategoryBatches();
      } else {
        throw new Error('Failed to create Zoom meeting');
      }
    } catch (error: any) {
      console.error('Error creating Zoom meeting:', error);
      toast.error(error.message || 'Failed to create Zoom meeting');
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
      toast.success('Session added successfully!');
      loadCategoryBatches();
    } catch (error: any) {
      console.error('Error adding session:', error);
      toast.error(error.message || 'Failed to add session');
    } finally {
      setShowAddSessionModal(false);
    }
  };

  const openAddRecordingModal = (batchId: string, sessionId: string) => {
    setCurrentBatchIdForRecording(batchId);
    setCurrentSessionIdForRecording(sessionId);
    setRecordingForm({ title: '', url: '', recorded_date: '', uploadError: '', uploadSuccess: false, fileName: '' });
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
      toast.success('Recorded lesson added!');
      loadCategoryBatches();
    } catch (error: any) {
      console.error('Error adding recorded lesson:', error);
      toast.error(error.message || 'Failed to add recorded lesson');
    } finally {
      setShowAddRecordingModal(false);
    }
  };

  // Handle video file upload with improved logic
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      setRecordingForm(prev => ({ ...prev, uploadError: 'Please select a valid video file (MP4, AVI, MOV)' }));
      return;
    }
    
    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      setRecordingForm(prev => ({ ...prev, uploadError: 'File size must be less than 500MB' }));
      return;
    }
    
    const fileSizeMB = file.size / (1024 * 1024);
    const isLargeFile = file.size > 50 * 1024 * 1024; // Files larger than 50MB
    
    // Reset form state
    setRecordingForm(prev => ({ ...prev, uploadError: '', uploadSuccess: false }));
    setUploadProgress(1);
    
    let progressInterval: NodeJS.Timeout;
    let controller: AbortController;
    let timeoutId: NodeJS.Timeout;
    
    try {
      // Start progress simulation
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const increment = isLargeFile ? Math.random() * 2 : Math.random() * 5;
          if (prev < 80) return prev + increment; // Stop at 80% until real response
          return prev;
        });
      }, isLargeFile ? 1500 : 500);
      
      console.log(`Starting upload for ${fileSizeMB.toFixed(1)}MB ${file.type} file`);
      
      // Convert file to base64 with progress tracking
      setUploadProgress(5);
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadProgress(15);
          resolve(reader.result as string);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = 5 + (event.loaded / event.total) * 10; // 5-15% for file reading
            setUploadProgress(progress);
          }
        };
        reader.readAsDataURL(file);
      });
      
      const rawBase64 = base64String.includes(',') ? base64String.split(',')[1] : base64String;
      setUploadProgress(20);
      
      console.log('File details:', {
        name: file.name,
        size: fileSizeMB.toFixed(1) + 'MB',
        type: file.type,
        base64Length: rawBase64.length
      });
      
      // Calculate dynamic timeout
      let baseTimeoutMinutes = 8; // Base timeout for videos
      const additionalTimeoutMinutes = Math.ceil(fileSizeMB / 50) * 3; // 3 minutes per 50MB chunk
      const totalTimeoutMinutes = baseTimeoutMinutes + additionalTimeoutMinutes;
      const timeoutDuration = totalTimeoutMinutes * 60 * 1000;
      
      console.log(`Upload timeout set to ${totalTimeoutMinutes} minutes for ${fileSizeMB.toFixed(1)}MB file`);
      
      // Prepare upload payload - try with full data URL format first
      const uploadPayload = {
        base64String: base64String, // Use full data URL format
        fileType: 'video'
      };
      
      // Setup abort controller and timeout
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        console.log('Upload timeout reached, aborting request');
        controller.abort();
      }, timeoutDuration);
      
      // Get authentication
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const uploadUrl = `${apiBaseUrl}${apiUrls.upload.uploadMedia}`;
      
      console.log('Sending upload request to:', uploadUrl);
      setUploadProgress(25);
      
      // Retry logic for upload with different payload formats
      let lastError: Error | null = null;
      let uploadData: any = null;
      const maxRetries = 2;
      
      // Try different payload formats
      const payloadFormats = [
        { base64String: base64String, fileType: 'video' }, // Full data URL
        { base64String: rawBase64, fileType: 'video' }, // Raw base64
        { base64String: base64String, fileType: 'image' }, // Try as image type
        { base64String: rawBase64, fileType: 'document' } // Try as document
      ];
      
      for (let formatIndex = 0; formatIndex < payloadFormats.length; formatIndex++) {
        const currentPayload = payloadFormats[formatIndex];
        console.log(`Trying payload format ${formatIndex + 1}:`, {
          hasDataPrefix: currentPayload.base64String.includes('data:'),
          fileType: currentPayload.fileType,
          base64Length: currentPayload.base64String.length
        });
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`Upload attempt ${attempt}/${maxRetries} with format ${formatIndex + 1}`);
            
            const response = await fetch(uploadUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 
                  'Authorization': `Bearer ${token}`, 
                  'x-access-token': token 
                })
              },
              body: JSON.stringify(currentPayload),
              signal: controller.signal,
              credentials: 'include'
            });
            
            console.log('Upload response status:', response.status, response.statusText);
            
            // Clear timeout on successful response
            clearTimeout(timeoutId);
            clearInterval(progressInterval);
            setUploadProgress(90);
            
            // Handle response
            if (!response.ok) {
              let errorData: any = {};
              const contentType = response.headers.get('content-type');
              
              try {
                if (contentType && contentType.includes('application/json')) {
                  errorData = await response.json();
                } else {
                  const textResponse = await response.text();
                  console.log('Non-JSON error response:', textResponse);
                  errorData = { message: textResponse || `HTTP ${response.status}: ${response.statusText}` };
                }
              } catch (parseError) {
                console.error('Error parsing response:', parseError);
                errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
              }
              
              const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
              
              // If it's a server error and we have more formats to try, continue to next format
              if (response.status >= 500 && formatIndex < payloadFormats.length - 1) {
                console.log('Server error, trying next payload format...');
                throw new Error(errorMessage);
              }
              
              throw new Error(errorMessage);
            }
            
            // Parse successful response
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              uploadData = await response.json();
            } else {
              const textResponse = await response.text();
              console.log('Non-JSON success response:', textResponse);
              // Try to parse as JSON in case it's malformed
              try {
                uploadData = JSON.parse(textResponse);
              } catch {
                // If it's a plain URL string
                if (textResponse.startsWith('http')) {
                  uploadData = {
                    success: true,
                    message: 'Upload successful',
                    data: { url: textResponse.trim() }
                  };
                } else {
                  throw new Error('Invalid response format from server');
                }
              }
            }
            
            console.log('Upload response data:', uploadData);
            // Success! Break out of all loops
            formatIndex = payloadFormats.length;
            break;
            
          } catch (fetchError: any) {
            console.error(`Upload attempt ${attempt} with format ${formatIndex + 1} failed:`, fetchError);
            lastError = fetchError;
            
            if (fetchError.name === 'AbortError') {
              throw new Error(`Upload timeout after ${totalTimeoutMinutes} minutes. File size: ${fileSizeMB.toFixed(1)}MB. The server may still be processing your file - please wait before trying again.`);
            }
            
            // If this is the last attempt for this format, try next format
            if (attempt === maxRetries) {
              break; // Break to try next format
            }
            
            // Wait before retry (exponential backoff)
            const retryDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
        
        // If we got uploadData, break out of format loop
        if (uploadData) break;
      }
      
      // If all formats failed, throw the last error
      if (!uploadData && lastError) {
        throw lastError;
      }
      
      setUploadProgress(95);
      
      // Validate upload response
      if (!uploadData) {
        throw new Error('No response received from upload service');
      }
      
      // Handle different response structures
      let success = false;
      let uploadedUrl = '';
      let responseMessage = '';
      
      // Check for success in various formats
      if (uploadData.success === true || uploadData.status === 'success') {
        success = true;
        responseMessage = uploadData.message || 'Upload successful';
      } else if (uploadData.success === false || uploadData.status === 'error') {
        success = false;
        responseMessage = uploadData.message || uploadData.error || 'Upload failed';
      } else if (uploadData.url) {
        // Direct URL response
        success = true;
        uploadedUrl = uploadData.url;
        responseMessage = 'Upload successful';
      } else {
        // Assume success if we have data
        success = true;
        responseMessage = 'Upload successful';
      }
      
      // Extract URL from various response structures
      if (success && !uploadedUrl) {
        uploadedUrl = uploadData.data?.url || 
                     uploadData.url || 
                     uploadData.data?.file_url || 
                     uploadData.file_url ||
                     uploadData.data?.link ||
                     uploadData.link ||
                     '';
      }
      
      if (!success) {
        throw new Error(responseMessage || 'Upload failed');
      }
      
      if (!uploadedUrl) {
        console.error('Upload response structure:', uploadData);
        throw new Error('No URL returned from upload service. Response: ' + JSON.stringify(uploadData));
      }
      
      // Clean up URL (remove quotes if present)
      uploadedUrl = uploadedUrl.replace(/['"]+/g, '').trim();
      
      console.log('Upload successful! URL:', uploadedUrl);
      setUploadProgress(100);
      
      // Update form state
      setRecordingForm(prev => ({ 
        ...prev, 
        url: uploadedUrl, 
        uploadSuccess: true,
        uploadError: '',
        fileName: file.name
      }));
      
      // Show success message
      toast.success('Video uploaded successfully!');
      
      // Reset progress after success animation
      setTimeout(() => setUploadProgress(0), 3000);
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      
      // Clean up
      if (progressInterval!) clearInterval(progressInterval);
      if (timeoutId!) clearTimeout(timeoutId);
      setUploadProgress(0);
      
      // Provide specific error messages
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.message.includes('timeout') || error.message.includes('Upload timeout')) {
        errorMessage = `Upload timeout. Large files (${fileSizeMB.toFixed(1)}MB) may take several minutes. Please try again or use a smaller file.`;
      } else if (error.message.includes('Network Error') || error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('No response received')) {
        errorMessage = 'Server did not respond. Please check your connection and try again.';
      } else if (error.message.includes('Invalid response')) {
        errorMessage = 'Server returned an invalid response. Please try again or contact support.';
      } else if (error.message.includes('413') || error.message.includes('too large')) {
        errorMessage = 'File too large for server. Please use a smaller file.';
      } else if (error.message.includes('415') || error.message.includes('Unsupported')) {
        errorMessage = 'Unsupported file type. Please use MP4, AVI, or MOV format.';
      } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
        errorMessage = 'Bad request. Please check the file and try again.';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        errorMessage = 'Server error. Please try again later or contact support.';
      } else if (error.message.includes('502') || error.message.includes('Bad Gateway')) {
        errorMessage = 'Server temporarily unavailable. Please try again in a few minutes.';
      } else if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setRecordingForm(prev => ({ 
        ...prev, 
        uploadError: errorMessage,
        uploadSuccess: false 
      }));
      
      // Show error toast
      toast.error(errorMessage);
    }
  };

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
      
      {/* Enhanced Add Recording Modal */}
      {showAddRecordingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4 border border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🎥</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Recorded Lesson</h2>
                <p className="text-gray-600 dark:text-gray-400">Upload a video recording for this session</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Lesson Title
                </label>
                <input 
                  type="text" 
                  value={recordingForm.title} 
                  onChange={e => setRecordingForm(prev => ({ ...prev, title: e.target.value }))} 
                  className="w-full px-4 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 group-hover:border-blue-400"
                  placeholder="Enter lesson title..."
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Upload Video
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleVideoUpload} 
                    disabled={uploadProgress > 0}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  <div className={`w-full px-4 py-8 bg-gradient-to-br rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 group-hover:scale-[1.02] ${
                    recordingForm.uploadSuccess 
                      ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10'
                      : recordingForm.uploadError
                      ? 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                      : uploadProgress > 0
                      ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                      : 'from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10'
                  }`}>
                    {uploadProgress > 0 && uploadProgress < 100 ? (
                      <>
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-2xl animate-pulse"></div>
                          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-700 dark:text-blue-300 font-semibold">
                            {uploadProgress < 85 ? 'Uploading video...' : 'Processing upload...'}
                          </p>
                          <p className="text-blue-600 dark:text-blue-400 text-sm">
                            {(() => {
                              const file = (document.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];
                              const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(1) : '0';
                              const isLarge = file && file.size > 50 * 1024 * 1024;
                              
                              if (isLarge && file) {
                                const baseTimeoutMinutes = file.type.startsWith('video/') ? 8 : 5;
                                const additionalTimeoutMinutes = file.type.startsWith('video/') 
                                  ? Math.ceil(parseFloat(fileSizeMB) / 50) * 2 
                                  : Math.ceil(parseFloat(fileSizeMB) / 25);
                                const totalTimeoutMinutes = baseTimeoutMinutes + additionalTimeoutMinutes;
                                return `Large video (${fileSizeMB}MB) - Up to ${totalTimeoutMinutes} minutes allowed`;
                              }
                              
                              return 'Please wait while we process your file';
                            })()}
                          </p>
                        </div>
                      </>
                    ) : recordingForm.uploadSuccess ? (
                      <>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 dark:text-green-300 font-semibold">Upload successful!</p>
                          <p className="text-green-600 dark:text-green-400 text-sm">{recordingForm.fileName}</p>
                          <p className="text-green-500 dark:text-green-500 text-xs mt-1">Ready to save recording</p>
                        </div>
                      </>
                    ) : recordingForm.uploadError ? (
                      <>
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-red-700 dark:text-red-300 font-semibold">Upload failed</p>
                          <p className="text-red-600 dark:text-red-400 text-sm">Click to try again</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">Click to upload video</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">MP4, AVI, MOV up to 500MB</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                {uploadProgress > 0 && uploadProgress <= 100 && (
                  <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {uploadProgress === 100 ? 'Processing...' : 'Uploading...'}
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ease-out ${
                          uploadProgress === 100 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${uploadProgress}%` }}
                      >
                        <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    {uploadProgress === 100 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 animate-pulse">
                        ✨ Finalizing upload...
                      </p>
                    )}
                  </div>
                )}
                
                {/* Error Message */}
                {recordingForm.uploadError && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-red-700 dark:text-red-400 font-semibold">Upload Error</p>
                        <p className="text-red-600 dark:text-red-500 text-sm mt-1">{recordingForm.uploadError}</p>
                        <button
                          onClick={() => setRecordingForm(prev => ({ ...prev, uploadError: '' }))}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium mt-2 underline"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Recorded Date
                </label>
                <input 
                  type="datetime-local" 
                  value={recordingForm.recorded_date} 
                  onChange={e => setRecordingForm(prev => ({ ...prev, recorded_date: e.target.value }))} 
                  className="w-full px-4 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-orange-400"
                />
              </div>
              
              {recordingForm.url && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Video URL
                  </label>
                  <input 
                    type="text" 
                    value={recordingForm.url} 
                    readOnly 
                    className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl text-gray-600 dark:text-gray-400 font-mono text-sm"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={() => setShowAddRecordingModal(false)} 
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button 
                onClick={submitAddRecording} 
                disabled={!recordingForm.title || !recordingForm.url || uploadProgress > 0 || !recordingForm.uploadSuccess}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="text-lg">🚀</span>
                {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Save Recording'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 