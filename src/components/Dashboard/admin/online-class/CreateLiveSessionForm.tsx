"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTimes, 
  FaSearch, 
  FaUser, 
  FaGraduationCap, 
  FaShieldAlt, 
  FaCalendarAlt, 
  FaStickyNote, 
  FaFileAlt,
  FaTrash,
  FaGripVertical,
  FaCheck,
  FaSpinner,
  FaClock,
  FaBook,
  FaVideo,
  FaUpload,
  FaPlay,
  FaFileVideo,
  FaSync,
  FaHashtag,
  FaComment,
  FaUserTie
} from "react-icons/fa";
import { liveClassesAPI, IStudent, IInstructor, IGrade, IDashboard, IBatch, ISummaryItem } from "@/apis/liveClassesAPI";
import { batchAPI } from "@/apis/batch";
import { apiBaseUrl } from "@/apis/config";
import { showToast } from "@/utils/toastManager";

// Helper function to get the correct API URL based on environment
const getApiUrl = (endpoint: string): string => {
  const baseUrl = apiBaseUrl;
  console.log('🌐 API Base URL:', baseUrl);
  console.log('🔧 Environment:', process.env.NODE_ENV);
  console.log('🌍 Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');
  return `${baseUrl}${endpoint}`;
};

interface ICreateLiveSessionFormProps {
  courseCategory: string;
  backUrl: string;
  editSessionId?: string | null;
}

export default function CreateLiveSessionForm({ courseCategory, backUrl, editSessionId }: ICreateLiveSessionFormProps) {
  const router = useRouter();
  const isEditMode = !!editSessionId;
  
  // Form state
  const [formData, setFormData] = useState({
    sessionTitle: "",
    sessionNo: "",
    students: [] as string[],
    grades: [] as string[],
    dashboard: "",
    instructorId: [] as string[], // Changed to array for multiple selection
    batchId: "", // Add batch ID field
    date: "",
    remarks: "",
    summary: {
      title: "",
      description: "",
      items: [] as ISummaryItem[]
    }
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false); // Add batch dropdown state
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeSearchQuery, setGradeSearchQuery] = useState("");
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState("");
  const [batchSearchQuery, setBatchSearchQuery] = useState(""); // Add batch search query
  const [instructorSearchQuery, setInstructorSearchQuery] = useState("");
  
  // Video upload state
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Data state
  const [students, setStudents] = useState<IStudent[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [batches, setBatches] = useState<IBatch[]>([]); // Add batches state
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [instructors, setInstructors] = useState<IInstructor[]>([]); // Add instructors state
  const [selectedStudentLatestSession, setSelectedStudentLatestSession] = useState<any>(null); // Latest session for selected student
  const [loadingLatestSession, setLoadingLatestSession] = useState(false); // Loading state for latest session

  // Refs
  const studentDropdownRef = useRef<HTMLDivElement>(null);
  const gradeDropdownRef = useRef<HTMLDivElement>(null);
  const dashboardDropdownRef = useRef<HTMLDivElement>(null);
  const batchDropdownRef = useRef<HTMLDivElement>(null); // Add batch dropdown ref
  const videoInputRef = useRef<HTMLInputElement>(null);
  const instructorDropdownRef = useRef<HTMLDivElement>(null);

  // Reset form function
  const resetForm = () => {
    setFormData({
      sessionTitle: "",
      sessionNo: "",
      students: [],
      grades: [],
      dashboard: "",
      instructorId: [] as string[], // Changed to array for multiple selection
      batchId: "", // Reset batch ID
      date: "",
      remarks: "",
      summary: {
        title: "",
        description: "",
        items: []
      }
    });
    setErrors({});
    setSearchQuery("");
    setInstructorSearchQuery("");
    setGradeSearchQuery("");
    setDashboardSearchQuery("");
    setBatchSearchQuery(""); // Reset batch search query
    setShowStudentDropdown(false);
    setShowGradeDropdown(false);
    setShowDashboardDropdown(false);
    setShowBatchDropdown(false); // Reset batch dropdown
    setSelectedVideos([]);
    setUploadedVideos([]);
    setUploadProgress({});
  };

  // Video upload functions - NO SIZE LIMITS OR RESTRICTIONS
  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const videoFiles = files.filter(file => file && file.type && file.type.startsWith('video/'));
    
    if (videoFiles.length !== files.length) {
      showToast.error('Some files were skipped. Only video files are allowed.');
    }
    
    // Filter out any null or undefined files
    const validVideoFiles = videoFiles.filter(file => file !== null && file !== undefined);
    
    setSelectedVideos(prev => [...prev, ...validVideoFiles]);
    
    // Show confirmation of selected videos with count
    if (validVideoFiles.length > 0) {
      const totalSize = validVideoFiles.reduce((sum, file) => sum + (file.size || 0), 0);
      const totalSelected = selectedVideos.length + validVideoFiles.length;
      
      showToast.success(
        `📁 ${validVideoFiles.length} new video(s) selected (${formatFileSize(totalSize)})\n📊 Total videos ready: ${totalSelected}`,
        {
          duration: 4000,
          style: {
            background: '#059669',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            padding: '14px',
            borderRadius: '8px',
            whiteSpace: 'pre-line'
          }
        }
      );
    }
  };

  const removeSelectedVideo = (index: number) => {
    setSelectedVideos(prev => prev.filter((video, i) => i !== index && video !== null && video !== undefined));
  };

  const uploadVideos = async () => {
    console.log('🔍 DEBUG - Upload Videos button clicked!');
    console.log('🔍 selectedVideos.length:', selectedVideos.length);
    
    if (selectedVideos.length === 0) {
      showToast.error('Please select videos to upload');
      return;
    }

    // Validate required fields for S3 path construction
    if (!formData.students || formData.students.length === 0) {
      showToast.error('Please select at least one student before uploading videos');
      return;
    }

    if (!formData.batchId) {
      showToast.error('Please select a batch before uploading videos');
      return;
    }

    if (!formData.sessionNo || !formData.sessionNo.trim()) {
      showToast.error('Please enter session number before uploading videos');
      return;
    }

    // Validate that batch and students exist in our data
    const selectedBatch = batches.find(batch => batch._id === formData.batchId);
    const selectedStudents = students.filter(student => formData.students.includes(student._id));
    
    if (!selectedBatch) {
      showToast.error('Selected batch not found. Please refresh and try again.');
      return;
    }
    
    if (selectedStudents.length !== formData.students.length) {
      showToast.error('Some selected students not found. Please refresh and try again.');
      return;
    }

    // Show immediate feedback that upload is starting
    showToast.info(
      `🚀 Starting upload of ${selectedVideos.length} video(s) to S3 bucket...`,
      {
        duration: 2000,
        style: {
          background: '#6366F1',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          padding: '12px',
          borderRadius: '6px'
        }
      }
    );

    setUploadingVideos(true);
    setUploadProgress({});

    // Show loading toast for video upload
    const uploadLoadingToast = showToast.loading(
      `🔄 Uploading ${selectedVideos.length} video(s) to S3... Please wait.`,
      {
        duration: 0, // Don't auto-dismiss
        style: {
          background: '#3B82F6',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          padding: '14px',
          borderRadius: '8px'
        }
      }
    );

    try {
      const uploadFormData = new FormData();
      selectedVideos.forEach(video => {
        uploadFormData.append('videos', video);
      });

      // Get batch and student details for S3 path construction
      const selectedBatch = batches.find(batch => batch._id === formData.batchId);
      const selectedStudents = students.filter(student => formData.students.includes(student._id));
      
      // Construct S3 path structure: /medh-files/videos/batch_object_id/student_object_id(student_name)/session_number/
      const s3PathStructure = {
        basePath: 'medh-files/videos',
        batchId: formData.batchId,
        batchName: selectedBatch?.batch_name || 'unknown-batch',
        sessionNumber: formData.sessionNo.trim(),
        students: selectedStudents.map(student => ({
          id: student._id,
          name: student.full_name,
          path: `${student._id}(${student.full_name})`
        }))
      };

      // Add required data to the form data
      uploadFormData.append('studentIds', JSON.stringify(formData.students));
      uploadFormData.append('batchId', formData.batchId);
        uploadFormData.append('sessionNo', formData.sessionNo.trim());
      uploadFormData.append('s3PathStructure', JSON.stringify(s3PathStructure));

      // Debug: Log what's being sent
      console.log('📤 Uploading videos with data:');
      console.log('   - Videos count:', selectedVideos.length);
      console.log('   - Students:', formData.students);
      console.log('   - Batch ID:', formData.batchId);
      console.log('   - Session No:', formData.sessionNo);
      console.log('   - S3 Path Structure:', s3PathStructure);
      console.log('   - Expected S3 paths:');
      s3PathStructure.students.forEach(student => {
        console.log(`     📁 /${s3PathStructure.basePath}/${s3PathStructure.batchId}/${student.path}/${s3PathStructure.sessionNumber}/`);
      });

      console.log('📤 Sending request to backend...');
      
      // Calculate total size for progress tracking
      const totalSizeBytes = selectedVideos.reduce((sum, file) => sum + file.size, 0);
      const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
      const startTime = Date.now();
      
      // Use XMLHttpRequest for progress tracking
      const response = await new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        let progressToastId: string | null = null;
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const uploadedBytes = event.loaded;
            const uploadedMB = (uploadedBytes / (1024 * 1024)).toFixed(2);
            const progressPercent = Math.round((uploadedBytes / event.total) * 100);
            const elapsedTime = Math.round((Date.now() - startTime) / 1000);
            const uploadSpeed = uploadedBytes / (1024 * 1024) / (elapsedTime || 1); // MB/s
            const remainingBytes = event.total - uploadedBytes;
            const remainingMB = (remainingBytes / (1024 * 1024)).toFixed(2);
            const estimatedTimeLeft = uploadSpeed > 0 ? Math.round(remainingBytes / (1024 * 1024) / uploadSpeed) : 0;
            
            const progressMessage = `📤 Video Upload Progress\n\n` +
              `📊 Progress: ${progressPercent}%\n` +
              `📁 Uploaded: ${uploadedMB} MB / ${totalSizeMB} MB\n` +
              `📉 Remaining: ${remainingMB} MB\n` +
              `⏱️ Time Elapsed: ${elapsedTime}s\n` +
              `⏳ Est. Time Left: ${estimatedTimeLeft}s\n` +
              `🚀 Speed: ${uploadSpeed.toFixed(2)} MB/s\n` +
              `📹 Files: ${selectedVideos.length} video(s)\n` +
              `${'█'.repeat(Math.floor(progressPercent/5))}${'░'.repeat(20-Math.floor(progressPercent/5))} ${progressPercent}%`;
            
            // Dismiss previous progress toast and create new one
            if (progressToastId) {
              showToast.dismiss(progressToastId);
            }
            showToast.dismiss(uploadLoadingToast);
            
            progressToastId = showToast.loading(progressMessage, { duration: 0 });
            
            // Store the latest toast ID for cleanup
            (window as any).currentUploadToast = progressToastId;
            
            console.log(`📊 Upload Progress: ${progressPercent}% (${uploadedMB}/${totalSizeMB} MB) - Speed: ${uploadSpeed.toFixed(2)} MB/s - ETA: ${estimatedTimeLeft}s`);
          }
        });
        
        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Create a Response-like object
            const response = new Response(xhr.responseText, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: new Headers()
            });
            resolve(response);
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        });
        
        // Handle errors
        xhr.addEventListener('error', (event) => {
          console.error('❌ XMLHttpRequest error event:', event);
          console.error('❌ XHR status:', xhr.status);
          console.error('❌ XHR ready state:', xhr.readyState);
          console.error('❌ XHR response:', xhr.responseText);
          
          let errorMessage = 'Network error occurred';
          if (xhr.status === 0) {
            errorMessage = 'Cannot connect to server. Please check:\n• Backend server is running on port 8080\n• No firewall blocking the connection\n• CORS is properly configured';
          } else if (xhr.status >= 400) {
            errorMessage = `Server error: ${xhr.status} ${xhr.statusText}`;
          }
          
          reject(new Error(errorMessage));
        });
        
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was aborted'));
        });
        
        // Handle timeout
        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timed out. The file might be too large or connection is slow.'));
        });
        
        // Setup and send request
        console.log('🌐 Setting up XMLHttpRequest...');
        const uploadUrl = getApiUrl('/live-classes/upload-videos');
        console.log('📡 Target URL:', uploadUrl);
        console.log('🔑 Auth token exists:', !!localStorage.getItem('token'));
        console.log('📦 FormData entries:', Array.from(uploadFormData.entries()).map(([key, value]) => ({
          key,
          type: typeof value,
          size: value instanceof File ? value.size : 'N/A',
          name: value instanceof File ? value.name : 'N/A'
        })));
        
        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);
        
        console.log('🚀 Sending XMLHttpRequest...');
        xhr.send(uploadFormData);
      });

      console.log('📋 Response received - Status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Handle different response statuses
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        
        // Try to get error details from response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('❌ Error response data:', errorData);
          throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
        } else {
          const textResponse = await response.text();
          console.error('❌ Non-JSON error response:', textResponse.substring(0, 500));
          throw new Error(`Server error: ${response.status} ${response.statusText}. Response: ${textResponse.substring(0, 200)}`);
        }
      }
      
      // Try to parse response as JSON regardless of content-type
      let result;
      try {
        const responseText = await response.text();
        console.log('📋 Raw response text:', responseText.substring(0, 200));
        
        // Try to parse as JSON
        result = JSON.parse(responseText);
        console.log('✅ Successfully parsed JSON response');
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON response. Status: ${response.status}. Please check backend logs.`);
      }
      
      console.log('✅ Success response data:', result);
        
        // Dismiss progress toast
        if ((window as any).currentUploadToast) {
          showToast.dismiss((window as any).currentUploadToast);
        }
        showToast.dismiss(uploadLoadingToast);
        
      if (result.status === 'success' && result.data && result.data.videos) {
        const validVideos = result.data.videos.filter((video: any) => video && video.fileId);
        
              // DEBUG: Log video upload success
      console.log('🔍 DEBUG - Video upload successful');
      console.log('🔍 validVideos count:', validVideos.length);
      console.log('🔍 About to update uploadedVideos state');
      
      // Update uploaded videos state
      setUploadedVideos(prev => {
        const newState = [...prev, ...validVideos];
        console.log('🔍 DEBUG - Updated uploadedVideos count:', newState.length);
        return newState;
      });
        
        // Clear selected videos
        setSelectedVideos([]);
        
        // Show success message
        const studentCount = formData.students.length;
        const folderStructure = result.data.folderStructure;
        
        // Create detailed S3 path information for success message
        const s3PathsInfo = s3PathStructure.students.map(student => 
          `📁 /${s3PathStructure.basePath}/${s3PathStructure.batchId}/${student.path}/${s3PathStructure.sessionNumber}/`
        ).join('\n');
        
        // Show SUCCESS POPUP for S3 upload completion
        showToast.success(
          `🎉 VIDEO UPLOAD SUCCESSFUL! 🎉\n\n📹 ${validVideos.length} video(s) uploaded to S3 bucket\n👥 Organized for ${studentCount} student(s)\n📚 Batch: ${s3PathStructure.batchName}\n🔢 Session: ${s3PathStructure.sessionNumber}\n\n📂 S3 Paths Created:\n${s3PathsInfo}\n\n✅ All videos are now safely stored in cloud storage`,
          {
            duration: 10000,
            style: {
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              padding: '20px',
              borderRadius: '12px',
              whiteSpace: 'pre-line',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
              border: '2px solid #10B981',
              maxWidth: '600px'
            }
          }
        );
      } else {
        showToast.error(result.message || 'Failed to upload videos');
      }
    } catch (error: any) {
      console.error('❌ Error uploading videos:', error);
      
      // Dismiss progress toast
      if ((window as any).currentUploadToast) {
        showToast.dismiss((window as any).currentUploadToast);
      }
      showToast.dismiss(uploadLoadingToast);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to upload videos';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Upload timed out. Please check your connection and try again.';
      } else if (error.message.includes('non-JSON response')) {
        errorMessage = 'Backend server is not responding correctly. Please ensure the server is running on port 8080.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the server is running on port 8080.';
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
      
      showToast.error(errorMessage);
    } finally {
      setUploadingVideos(false);
      setUploadProgress({});
    }
  };

  const removeUploadedVideo = (fileId: string) => {
    setUploadedVideos(prev => prev.filter(video => video && video.fileId !== fileId && video !== null && video !== undefined));
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };





  // Load initial data
  useEffect(() => {
    console.log('🚀 Component mounted, loading initial data...');
    loadInitialData();
  }, [courseCategory]); // Add courseCategory as dependency

  // Load session data for editing
  useEffect(() => {
    if (isEditMode && editSessionId) {
      loadSessionForEdit(editSessionId);
    }
  }, [isEditMode, editSessionId]);

  const loadSessionForEdit = async (sessionId: string) => {
    try {
      console.log('🔄 Loading session for edit:', sessionId);
      const response = await liveClassesAPI.getSession(sessionId);
      const sessionData = response.data || response;
      
      console.log('📝 Session data loaded:', sessionData);
      
      // Populate form with session data
      setFormData({
        sessionTitle: sessionData.sessionTitle || "",
        sessionNo: sessionData.sessionNo || "",
        students: Array.isArray(sessionData.students) ? sessionData.students.map(s => s._id || s) : [],
        grades: Array.isArray(sessionData.grades) ? sessionData.grades.map(g => g._id || g) : [],
        dashboard: sessionData.dashboard?._id || sessionData.dashboard || "",
        instructorId: Array.isArray(sessionData.instructorId) ? sessionData.instructorId.map(i => i._id || i) : [sessionData.instructorId?._id || sessionData.instructorId || ""],
        batchId: sessionData.batchId?._id || sessionData.batchId || "",
        date: sessionData.date ? new Date(sessionData.date).toISOString().split('T')[0] : "",
        remarks: sessionData.remarks || "",
        summary: {
          title: sessionData.summary?.title || "",
          description: sessionData.summary?.description || "",
          items: sessionData.summary?.items || []
        }
      });
      
      showToast.info(
        `Editing session: ${sessionData.sessionTitle}`,
        { duration: 3000 }
      );
      
    } catch (error) {
      console.error('❌ Error loading session for edit:', error);
      showToast.error(
        'Failed to load session data for editing',
        { duration: 5000 }
      );
    }
  };

  // Monitor state changes
  useEffect(() => {
    console.log('📊 State updated:', {
      studentsCount: students.length,
      studentsSample: Array.isArray(students) ? students.slice(0, 2) : 'Not array',
      gradesCount: grades.length,
      dashboardsCount: dashboards.length,
      usingFallbackData
    });
  }, [students, grades, dashboards, usingFallbackData]);



  // Clean up null values from video arrays
  useEffect(() => {
    setSelectedVideos(prev => prev.filter(video => video !== null && video !== undefined));
    setUploadedVideos(prev => prev.filter(video => video !== null && video !== undefined));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (instructorDropdownRef.current && !instructorDropdownRef.current.contains(event.target as Node)) {
        setShowInstructorDropdown(false);
      }
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
        setShowStudentDropdown(false);
      }
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(event.target as Node)) {
        setShowGradeDropdown(false);
      }
      if (dashboardDropdownRef.current && !dashboardDropdownRef.current.contains(event.target as Node)) {
        setShowDashboardDropdown(false);
      }
      if (batchDropdownRef.current && !batchDropdownRef.current.contains(event.target as Node)) {
        setShowBatchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('🔄 Loading initial data...');
      console.log('📡 Making API calls to fetch real data from database...');
      
      // Load data from API with better error handling
      const [studentsRes, gradesRes, dashboardsRes, instructorsRes, batchesRes] = await Promise.allSettled([
        liveClassesAPI.getStudents(),
        liveClassesAPI.getGrades(),
        liveClassesAPI.getDashboards(),
        liveClassesAPI.getInstructors(),
        liveClassesAPI.getAllBatches()
      ]);

      console.log('API Responses:', {
        students: studentsRes,
        grades: gradesRes,
        dashboards: dashboardsRes,
        instructors: instructorsRes,
        batches: batchesRes
      });

      // Handle different response structures more robustly
      let finalStudents: any[] = [];
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data) {
        const extractedStudents = studentsRes.value.data?.data?.items || 
                                 studentsRes.value.data?.items || 
                                 studentsRes.value.data || [];
        finalStudents = Array.isArray(extractedStudents) ? extractedStudents : [];
      }

      let finalGrades: any[] = [];
      if (gradesRes.status === 'fulfilled' && gradesRes.value.data) {
        const extractedGrades = gradesRes.value.data?.data || gradesRes.value.data || [];
        finalGrades = Array.isArray(extractedGrades) ? extractedGrades : [];
      }

      let finalDashboards: any[] = [];
      if (dashboardsRes.status === 'fulfilled' && dashboardsRes.value.data) {
        const extractedDashboards = dashboardsRes.value.data?.data || dashboardsRes.value.data || [];
        finalDashboards = Array.isArray(extractedDashboards) ? extractedDashboards : [];
      }

      let finalBatches: any[] = [];
      if (batchesRes.status === 'fulfilled' && batchesRes.value.data) {
        const extractedBatches = batchesRes.value.data?.data || batchesRes.value.data || [];
        finalBatches = Array.isArray(extractedBatches) ? extractedBatches : [];
      }

      let finalInstructors: IInstructor[] = [];
      if (instructorsRes.status === 'fulfilled' && instructorsRes.value.data) {
        const extracted = instructorsRes.value.data?.data?.items || instructorsRes.value.data?.items || instructorsRes.value.data || [];
        finalInstructors = Array.isArray(extracted) ? extracted : [];
      }


      
      console.log('🔧 FORCED DATA EXTRACTION:', {
        studentsResStatus: studentsRes.status,
        studentsResData: studentsRes.status === 'fulfilled' ? studentsRes.value.data : 'rejected',
        finalStudentsLength: finalStudents.length,
        finalStudentsSample: Array.isArray(finalStudents) ? finalStudents.slice(0, 2) : 'Not array'
      });

      console.log('🔍 Raw API Response Details:', {
        studentsRes: studentsRes.status === 'fulfilled' ? {
          status: studentsRes.value.status,
          data: studentsRes.value.data,
          hasItems: !!studentsRes.value.data?.data?.items,
          itemsCount: studentsRes.value.data?.data?.items?.length || 0
        } : studentsRes.reason
      });

      console.log('Raw API Responses:', {
        studentsRes: studentsRes.status === 'fulfilled' ? studentsRes.value : studentsRes.reason,
        gradesRes: gradesRes.status === 'fulfilled' ? gradesRes.value : gradesRes.reason,
        dashboardsRes: dashboardsRes.status === 'fulfilled' ? dashboardsRes.value : dashboardsRes.reason
      });

      console.log('Processed Data:', {
        students: finalStudents,
        grades: finalGrades,
        dashboards: finalDashboards,
        batches: finalBatches
      });



      // Use the forced extraction results
      const hasRealStudents = Array.isArray(finalStudents) && finalStudents.length > 0;
      const hasRealGrades = Array.isArray(finalGrades) && finalGrades.length > 0;
      const hasRealDashboards = Array.isArray(finalDashboards) && finalDashboards.length > 0;
      const hasRealBatches = Array.isArray(finalBatches) && finalBatches.length > 0;
      const hasRealInstructors = Array.isArray(finalInstructors) && finalInstructors.length > 0;
      
      console.log('🎯 FINAL Data Availability Check:', {
        hasRealStudents,
        hasRealGrades,
        hasRealDashboards,
        hasRealBatches,
        hasRealInstructors,
        finalStudentsLength: finalStudents.length,
        finalGradesLength: finalGrades.length,
        finalBatchesLength: finalBatches.length
      });
      
      // Use fallback data if no real data is available
      if (!hasRealGrades) {
        finalGrades = [];
      }
      if (!hasRealDashboards) {
        finalDashboards = [];
      }
      
      // Deduplicate grades by _id to prevent duplicate key errors
      if (hasRealGrades && Array.isArray(finalGrades)) {
        const uniqueGrades = finalGrades.filter((grade, index, self) => 
          index === self.findIndex(g => g._id === grade._id)
        );
        if (uniqueGrades.length !== finalGrades.length) {
          console.log('🔧 Removed duplicate grades:', finalGrades.length - uniqueGrades.length);
        }
        finalGrades = uniqueGrades;
      }
      
      // Deduplicate dashboards by _id to prevent duplicate key errors
      if (hasRealDashboards && Array.isArray(finalDashboards)) {
        const uniqueDashboards = finalDashboards.filter((dashboard, index, self) => 
          index === self.findIndex(d => d._id === dashboard._id)
        );
        if (uniqueDashboards.length !== finalDashboards.length) {
          console.log('🔧 Removed duplicate dashboards:', finalDashboards.length - uniqueDashboards.length);
        }
        finalDashboards = uniqueDashboards;
      }
      
      // Use real data from database, with fallbacks for students and instructors
      if (!hasRealStudents) {
        console.log('❌ NO REAL STUDENTS DATA - Using fallback data');
        // Add fallback student data from the database test
        finalStudents = [
          { _id: '689ba08c5eba793ac7f42a4e', full_name: 'Alice Johnson', email: 'alice.johnson@example.com' },
          { _id: '689ba08c5eba793ac7f42a51', full_name: 'Bob Smith', email: 'bob.smith@example.com' },
          { _id: '689ba08c5eba793ac7f42a54', full_name: 'Carol Davis', email: 'carol.davis@example.com' },
          { _id: '689ba08c5eba793ac7f42a58', full_name: 'David Wilson', email: 'david.wilson@example.com' },
          { _id: '689ba08c5eba793ac7f42a5b', full_name: 'Eva Brown', email: 'eva.brown@example.com' }
        ];
      } else {
        console.log('✅ REAL STUDENTS LOADED:', finalStudents.length, 'students');
        // Deduplicate students by _id to prevent duplicate key errors
        const uniqueStudents = finalStudents.filter((student, index, self) => 
          index === self.findIndex(s => s._id === student._id)
        );
        if (uniqueStudents.length !== finalStudents.length) {
          console.log('🔧 Removed duplicate students:', finalStudents.length - uniqueStudents.length);
        }
        finalStudents = uniqueStudents;
      }
      
      // Instructors fallback/dedupe
      if (!hasRealInstructors) {
        console.log('❌ NO REAL INSTRUCTORS DATA - Using fallback data');
        finalInstructors = [
          { _id: 'instructor-1', full_name: 'Prof. Alice', email: 'alice@example.com' } as IInstructor,
          { _id: 'instructor-2', full_name: 'Dr. Robert', email: 'robert@example.com' } as IInstructor
        ];
      } else {
        const uniqueInstructors = finalInstructors.filter((i, idx, self) => idx === self.findIndex(x => x._id === i._id));
        if (uniqueInstructors.length !== finalInstructors.length) {
          console.log('🔧 Removed duplicate instructors:', finalInstructors.length - uniqueInstructors.length);
        }
        finalInstructors = uniqueInstructors;
      }
      
      console.log('🎯 Setting final data:', {
        students: { count: finalStudents.length, sample: finalStudents[0] },
        grades: { count: finalGrades.length, sample: finalGrades[0] },
        dashboards: { count: finalDashboards.length, sample: finalDashboards[0] },
        instructors: { count: finalInstructors.length, sample: finalInstructors[0] }
      });
      
      console.log('🎯 About to set state with:', {
        finalStudentsLength: finalStudents.length,
        finalStudentsSample: Array.isArray(finalStudents) ? finalStudents.slice(0, 2) : 'Not array'
      });
      
      // Check if we got any real data
      const hasRealData = finalStudents.length > 0 || finalDashboards.length > 0 || finalGrades.length > 0 || finalBatches.length > 0 || finalInstructors.length > 0;
      
      if (hasRealData) {
        // Set the real data to state
      setStudents(finalStudents);
      setGrades(finalGrades);
      setDashboards(finalDashboards);
      setInstructors(finalInstructors);
      setBatches(finalBatches);
      setUsingFallbackData(false);
        console.log('🎉 Using real data from database');
      } else {
        console.log('⚠️ No real data received, using fallback data');
        // Create fallback data for testing
        const fallbackStudents = [
          { _id: 'student-1', full_name: 'John Doe', email: 'john@example.com' },
          { _id: 'student-2', full_name: 'Jane Smith', email: 'jane@example.com' },
          { _id: 'student-3', full_name: 'Bob Johnson', email: 'bob@example.com' }
        ];
        const fallbackBatches = [
          { _id: 'batch-1', batch_name: 'AI & Data Science - Batch A', batch_type: 'regular', status: 'Active', enrolled_student_ids: ['student-1', 'student-2'] },
          { _id: 'batch-2', batch_name: 'Digital Marketing - Batch B', batch_type: 'advanced', status: 'Active', enrolled_student_ids: ['student-2', 'student-3'] },
          { _id: 'batch-3', batch_name: 'Personality Development - Batch C', batch_type: 'regular', status: 'Active', enrolled_student_ids: ['student-1', 'student-3'] },
          { _id: 'batch-4', batch_name: 'Vedic Mathematics - Batch D', batch_type: 'beginner', status: 'Active', enrolled_student_ids: ['student-1', 'student-2', 'student-3'] },
          { _id: 'batch-5', batch_name: 'Public Speaking - Batch E', batch_type: 'intermediate', status: 'Active', enrolled_student_ids: ['student-2'] },
          { _id: 'batch-6', batch_name: 'Web Development - Batch F', batch_type: 'advanced', status: 'Active', enrolled_student_ids: ['student-1'] }
        ];
        const fallbackGrades = [
          { _id: 'grade-1', name: 'Grade 1', level: 1 },
          { _id: 'grade-2', name: 'Grade 2', level: 2 },
          { _id: 'grade-3', name: 'Grade 3', level: 3 }
        ];
        const fallbackDashboards = [
          { _id: 'admin-dashboard', name: 'Admin Dashboard', type: 'admin' },
          { _id: 'instructor-dashboard', name: 'Instructor Dashboard', type: 'instructor' }
        ];
        
        setStudents(fallbackStudents);
        setBatches(fallbackBatches);
        setGrades(fallbackGrades);
        setDashboards(fallbackDashboards);
        setPreviousSession(null);
        setUsingFallbackData(true);
      }
      
      console.log('🎯 FINAL RESULT - DATA LOADED:', {
        students: `${finalStudents.length} students ${hasRealStudents ? '(real)' : '(fallback)'}`,
        grades: hasRealGrades ? `${finalGrades.length} grades` : '❌ NO GRADES',
        dashboards: hasRealDashboards ? `${finalDashboards.length} dashboards` : '❌ NO DASHBOARDS',
        batches: hasRealBatches ? `${finalBatches.length} batches` : '❌ NO BATCHES',
        instructors: hasRealInstructors ? `${finalInstructors.length} instructors` : '❌ NO INSTRUCTORS'
      });
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      console.log('🔄 Loading fallback data due to API error...');
      
      // Provide fallback data when API fails
      const fallbackStudents = [
        { _id: 'student-1', full_name: 'John Doe', email: 'john@example.com' },
        { _id: 'student-2', full_name: 'Jane Smith', email: 'jane@example.com' },
        { _id: 'student-3', full_name: 'Bob Johnson', email: 'bob@example.com' }
      ];
      const fallbackBatches = [
        { _id: 'batch-1', batch_name: 'AI & Data Science - Batch A', batch_type: 'regular', status: 'Active', enrolled_student_ids: ['student-1', 'student-2'] },
        { _id: 'batch-2', batch_name: 'Digital Marketing - Batch B', batch_type: 'advanced', status: 'Active', enrolled_student_ids: ['student-2', 'student-3'] },
        { _id: 'batch-3', batch_name: 'Personality Development - Batch C', batch_type: 'regular', status: 'Active', enrolled_student_ids: ['student-1', 'student-3'] },
        { _id: 'batch-4', batch_name: 'Vedic Mathematics - Batch D', batch_type: 'beginner', status: 'Active', enrolled_student_ids: ['student-1', 'student-2', 'student-3'] },
        { _id: 'batch-5', batch_name: 'Public Speaking - Batch E', batch_type: 'intermediate', status: 'Active', enrolled_student_ids: ['student-2'] },
        { _id: 'batch-6', batch_name: 'Web Development - Batch F', batch_type: 'advanced', status: 'Active', enrolled_student_ids: ['student-1'] }
      ];
      const fallbackGrades = [
        { _id: 'grade-1', name: 'Grade 1', level: 1 },
        { _id: 'grade-2', name: 'Grade 2', level: 2 },
        { _id: 'grade-3', name: 'Grade 3', level: 3 },
        { _id: 'grade-4', name: 'Grade 4', level: 4 },
        { _id: 'grade-5', name: 'Grade 5', level: 5 }
      ];
      const fallbackDashboards = [
        { _id: 'admin-dashboard', name: 'Admin Dashboard', type: 'admin' },
        { _id: 'instructor-dashboard', name: 'Instructor Dashboard', type: 'instructor' },
        { _id: 'student-dashboard', name: 'Student Dashboard', type: 'student' }
      ];
      
      setStudents(fallbackStudents);
      setBatches(fallbackBatches);
      setGrades(fallbackGrades);
      setDashboards(fallbackDashboards);
      setPreviousSession(null);
      setUsingFallbackData(true);
      
      console.log('✅ Fallback data loaded successfully');
    }
  };

  // Filter functions
  const filteredStudents = (Array.isArray(students) ? students : []).filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter batches based on selected students - only show batches that contain at least one selected student
  const getFilteredBatches = () => {
    if (formData.students.length === 0) {
      // If no students selected, show all batches
      return batches.filter(batch => 
        (batch.name || batch.batch_name || '').toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
        (batch.code || batch.batch_code || '').toLowerCase().includes(batchSearchQuery.toLowerCase())
      );
    }
    
    // Filter batches with robust fallback logic
    return batches.filter(batch => {
      // Strategy 1: Use enrolled_student_ids if available and not empty
      const enrolledStudentIds = batch.enrolled_student_ids || [];
      
      if (Array.isArray(enrolledStudentIds) && enrolledStudentIds.length > 0) {
        const hasSelectedStudent = formData.students.some(studentId => 
          enrolledStudentIds.includes(studentId)
        );
        
        const matchesSearch = (batch.name || batch.batch_name || '').toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
          (batch.code || batch.batch_code || '').toLowerCase().includes(batchSearchQuery.toLowerCase());
        
        return hasSelectedStudent && matchesSearch;
      }
      
      // Strategy 2: Fallback - if enrolled_student_ids is missing/empty but enrolledStudents > 0
      // Show the batch (let user decide) with a warning indicator
      if ((batch.enrolledStudents || batch.enrolled_students || 0) > 0) {
        console.log(`⚠️ Batch "${batch.batch_name || batch.name}" missing enrolled_student_ids, showing as available`);
        
        const matchesSearch = (batch.name || batch.batch_name || '').toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
          (batch.code || batch.batch_code || '').toLowerCase().includes(batchSearchQuery.toLowerCase());
        
        return matchesSearch; // Show if it matches search, regardless of student selection
      }
      
      // Strategy 3: If no student data at all, don't show this batch
      return false;
    });
  };

  // Debug students state
  console.log('🔍 Students State Debug:', {
    studentsIsArray: Array.isArray(students),
    studentsLength: students.length,
    studentsSample: Array.isArray(students) ? students.slice(0, 2) : 'Not array',
    searchQuery,
    filteredStudentsLength: filteredStudents.length
  });

  const filteredGrades = (Array.isArray(grades) ? grades : []).filter(grade =>
    grade.name.toLowerCase().includes(gradeSearchQuery.toLowerCase())
  );

  const filteredDashboards = (Array.isArray(dashboards) ? dashboards : []).filter(dashboard =>
    dashboard.name.toLowerCase().includes(dashboardSearchQuery.toLowerCase())
  );

  // Handler functions
  const handleStudentSelect = async (studentId: string) => {
    console.log('👆 Student selected:', studentId);
    
    // Check current state before updating
    const isCurrentlySelected = formData.students.includes(studentId);
    console.log('📋 Is currently selected:', isCurrentlySelected);
    
    setFormData(prev => {
      const isSelected = prev.students.includes(studentId);
      const newStudents = isSelected
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId];
      
      console.log('📝 Updated students list:', newStudents);
      
      // Check if current batch is still valid for the new student selection
      let newBatchId = prev.batchId;
      if (newStudents.length > 0 && prev.batchId) {
        const currentBatch = batches.find(batch => batch._id === prev.batchId);
        if (currentBatch) {
          const batchStudentIds = currentBatch.enrolled_student_ids || currentBatch.enrolledStudentIds || currentBatch.students || [];
          const isValidBatch = newStudents.some(studentId => batchStudentIds.includes(studentId));
          
          if (!isValidBatch) {
            console.log('🔄 Clearing batch selection - not valid for selected students');
            newBatchId = '';
            setBatchSearchQuery('');
          }
        }
      }
      
      return {
        ...prev,
        students: newStudents,
        batchId: newBatchId
      };
    });
    
    // Fetch latest session when a student is selected (not deselected)
    if (!isCurrentlySelected) {
      console.log('🎯 Fetching latest session for newly selected student:', studentId);
      await handleStudentClick(studentId);
    } else {
      console.log('❌ Student deselected, clearing session data');
      setSelectedStudentLatestSession(null);
    }
  };

  const handleStudentRemove = (studentId: string) => {
    setFormData(prev => {
      const newStudents = prev.students.filter(id => id !== studentId);
      
      return {
      ...prev,
        students: newStudents
      };
    });
  };

  const handleGradeSelect = (gradeId: string) => {
    setFormData(prev => ({
      ...prev,
      grades: [gradeId]
    }));
    setErrors(prev => ({ ...prev, grades: '' }));
    setShowGradeDropdown(false);
    setGradeSearchQuery(getGradeName(gradeId));
  };

  const handleGradeRemove = (gradeId: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.filter(id => id !== gradeId)
    }));
  };

  // Handle student click to fetch latest session
  const handleStudentClick = async (studentId: string) => {
    console.log('🔍 Student clicked:', studentId);
    console.log('📋 Current selected students:', formData.students);
    
    // Clear previous session data first
    setSelectedStudentLatestSession(null);
    setLoadingLatestSession(true);
    
    try {
      console.log('🚀 Fetching latest session for student:', studentId);
      const response = await liveClassesAPI.getStudentLatestSession(studentId);
      console.log('📥 API Response:', response);
      
      if (response.data && response.data.data) {
        const sessionData = response.data.data;
        console.log('✅ Setting latest session data:', sessionData);
        console.log('🎯 Session belongs to student:', sessionData.student?.full_name);
        console.log('🆔 Student ID in session:', sessionData.student?._id);
        console.log('🆔 Requested student ID:', studentId);
        
        // Verify that the session data belongs to the correct student
        if (sessionData.student?._id === studentId) {
          setSelectedStudentLatestSession(sessionData);
        } else {
          console.warn('⚠️ Session data student ID mismatch!');
          setSelectedStudentLatestSession(null);
        }
      } else {
        console.log('❌ No session data found');
        setSelectedStudentLatestSession(null);
      }
    } catch (error) {
      console.error('❌ Error fetching student latest session:', error);
      setSelectedStudentLatestSession(null);
    } finally {
      setLoadingLatestSession(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation for all required fields
    const newErrors: Record<string, string> = {};
    
    // Validate session title
    if (!formData.sessionTitle.trim()) {
      newErrors.sessionTitle = 'Session title is required';
    }
    
    // Validate session number
    if (!formData.sessionNo.trim()) {
      newErrors.sessionNo = 'Session number is required';
    } else if (!/^\d+$/.test(formData.sessionNo.trim())) {
      newErrors.sessionNo = 'Session number must contain only numbers';
    }
    
    // Validate students
    if (!formData.students.length) {
      newErrors.students = 'At least one student is required';
    }
    
    // Validate batch
    if (!formData.batchId) {
      newErrors.batchId = 'Batch selection is required';
    }
    
    // Validate grades
    if (!formData.grades.length) {
      newErrors.grades = 'At least one grade is required';
    }
    
    // Validate dashboard
    if (!formData.dashboard) {
      newErrors.dashboard = 'Dashboard assignment is required';
    }
    
    // Validate date
    if (!formData.date) {
      newErrors.date = 'Session date is required';
    }
    
    // Validate summary title
    if (!formData.summary.title.trim()) {
      newErrors.summaryTitle = 'Summary title is required';
    }
    
    // Validate summary description
    if (!formData.summary.description.trim()) {
      newErrors.summaryDescription = 'Summary description is required';
    }
    
    // Validate summary items
    if (!formData.summary.items.length) {
      newErrors.summaryItems = 'At least one summary item is required';
    }
    
    // Validate instructors (required)
    if (!formData.instructorId || formData.instructorId.length === 0) {
      newErrors.instructorId = 'At least one instructor is required';
    }
    
    // Check if there are any validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast.error('❌ Please fill in all required fields (including instructor)');
      return;
    }
    
    // DEBUG: Log uploadedVideos state before form submission
    console.log('🔍 DEBUG - Before form submission:');
    console.log('🔍 uploadedVideos state:', uploadedVideos);
    console.log('🔍 uploadedVideos.length:', uploadedVideos.length);
    
    setLoading(true);
    
    // Show loading notification
    const loadingToast = showToast.loading('🔄 Uploading Live Session Recording...', {
      duration: 0 // Don't auto-dismiss
    });
    
    try {
      // Create session with videos if uploaded
      const validUploadedVideos = uploadedVideos.filter(video => video !== null && video !== undefined);
      
      // DEBUG: Log current state
      console.log('🔍 DEBUG - Form submission started');
      console.log('🔍 uploadedVideos count:', uploadedVideos.length);
      console.log('🔍 validUploadedVideos count:', validUploadedVideos.length);
      
      // Prepare video data for database
      let videoData = {
        fileId: 'no-video',
        name: 'No video uploaded',
        size: 0,
        url: '#'
      };
      
      // If videos are uploaded, use the first video's data
      if (validUploadedVideos.length > 0) {
        const firstVideo = validUploadedVideos[0];
        console.log('🔍 DEBUG - First video found');
        
        videoData = {
          fileId: firstVideo.fileId || firstVideo.s3Path || 'no-video',
          name: firstVideo.name || 'Uploaded video',
          size: firstVideo.size || 0,
          url: firstVideo.url || '#'
        };
        
        console.log('📹 Using video data for database - File size:', videoData.size, 'bytes');
      } else {
        console.log('⚠️ WARNING - No uploaded videos found, using default video data');
        console.log('⚠️ This means either:');
        console.log('   1. No videos were uploaded');
        console.log('   2. Video upload failed');
        console.log('   3. uploadedVideos state is not properly set');
      }
      
      const sessionData = {
        ...formData,
        video: videoData,
        videos: validUploadedVideos // Include all uploaded videos for reference
      };
      
      console.log('📝 Creating session with data:', {
        sessionTitle: sessionData.sessionTitle,
        sessionNo: sessionData.sessionNo,
        studentsCount: sessionData.students.length,
        gradesCount: sessionData.grades.length,
        hasVideo: !!sessionData.video && sessionData.video.fileId !== 'no-video',
        uploadedVideosCount: validUploadedVideos.length
      });
      
      console.log('🔍 Session data prepared for submission');
      console.log('🔍 Session number length:', sessionData.sessionNo?.length);
      
      // Additional logging for video data
      if (validUploadedVideos.length > 0) {
        console.log('📹 Video data being saved to database');
        console.log('   - File size:', videoData.size, 'bytes');
        console.log('   - Total uploaded videos:', validUploadedVideos.length);
      } else {
        console.log('📹 No videos uploaded - using default video data');
      }
      
      const response = isEditMode 
        ? await liveClassesAPI.updateSession(editSessionId!, sessionData)
        : await liveClassesAPI.createLiveSession(sessionData);
      
      console.log('📋 Session creation response:', response);
      console.log('📋 Response type:', typeof response);
      console.log('📋 Response keys:', Object.keys(response || {}));
      console.log('📋 Response data:', response?.data);
      console.log('📋 Response status:', response?.status);
      console.log('📋 Response statusText:', response?.statusText);
      
      // Log video data from response
      if (response?.data?.data?.video) {
        console.log('📹 Video data received from server');
        console.log('📹 Has video:', response.data.data.hasVideo);
      }
      
      if (response.data?.data?.success || response.data?.success) {
        // Dismiss loading toast
        showToast.dismiss(loadingToast);
        
        // IMMEDIATELY reset the form first
        resetForm();
        
        // Show form reset confirmation
        setTimeout(() => {
          showToast.success(
            '🔄 Form has been reset and is ready for the next session!',
            {
              duration: 3000,
              style: {
                background: '#8B5CF6',
                color: 'white',
                fontSize: '13px',
                fontWeight: '500',
                padding: '12px',
                borderRadius: '6px'
              }
            }
          );
        }, 1000);
        
        // IMMEDIATELY show success popup
        const videoCount = validUploadedVideos.length;
        const videoText = videoCount > 0 ? ` with ${videoCount} video(s)` : '';
        
        // Show FORM SAVE SUCCESS POPUP with video details
        const videoDetailsText = validUploadedVideos.length > 0 
          ? `\n📹 Video Details:\n   • File: ${videoData.name}\n   • Size: ${formatFileSize(videoData.size)}\n   • S3 Path: ${videoData.fileId}\n   • URL: ${videoData.url !== '#' ? 'Generated' : 'Not available'}`
          : '\n📹 No videos uploaded';
          
        showToast.success(
          `🎉 FORM SAVED SUCCESSFULLY! 🎉\n\n📝 Live session "${sessionData.sessionTitle}" ${isEditMode ? 'updated' : 'created'}\n💾 Session saved to database\n📹 ${videoCount} video(s) included${videoDetailsText}`,
          {
            duration: 10000,
            style: {
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              padding: '20px',
              borderRadius: '12px',
              whiteSpace: 'pre-line',
              boxShadow: '0 10px 25px rgba(5, 150, 105, 0.3)',
              border: '2px solid #059669',
              maxWidth: '500px'
            }
          }
        );
        
        // Refresh the latest session data to show the newly created session
        setRefreshingPreviousSession(true);
        try {
          // Small delay to ensure the backend has saved the new session
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Fetch the latest session without course category filter to get the newly created session
          const updatedPreviousSessionRes = await liveClassesAPI.getPreviousSession();
          const newSessionData = (updatedPreviousSessionRes as any)?.data?.data || updatedPreviousSessionRes;
          setPreviousSession(newSessionData);
          setForceUpdate(prev => prev + 1); // Force re-render
          console.log('🔄 SETTING NEW SESSION DATA:', {
            newSessionData,
            sessionTitle: newSessionData?.sessionTitle,
            sessionNo: newSessionData?.sessionNo,
            student: newSessionData?.students?.[0]?.full_name,
            grade: newSessionData?.grades?.[0],
            status: newSessionData?.status
          });
          console.log('✅ Latest session data refreshed:', updatedPreviousSessionRes.data);
          console.log('🔍 New session details:', {
            sessionTitle: updatedPreviousSessionRes.data?.data?.sessionTitle || updatedPreviousSessionRes.data?.sessionTitle,
            sessionNo: updatedPreviousSessionRes.data?.data?.sessionNo || updatedPreviousSessionRes.data?.sessionNo,
            student: updatedPreviousSessionRes.data?.data?.students?.[0]?.full_name || updatedPreviousSessionRes.data?.students?.[0]?.full_name,
            grade: updatedPreviousSessionRes.data?.data?.grades?.[0] || updatedPreviousSessionRes.data?.grades?.[0],
            status: updatedPreviousSessionRes.data?.data?.status || updatedPreviousSessionRes.data?.status
          });
          
          // Set session updated flag for visual feedback
          setSessionUpdated(true);
          setTimeout(() => setSessionUpdated(false), 5000); // Clear after 5 seconds
        } catch (error) {
          console.error('Error refreshing latest session data:', error);
        } finally {
          setRefreshingPreviousSession(false);
        }
        
        // Show additional notification that latest session was updated
        setTimeout(() => {
          showToast.success('📋 Latest session details updated!', {
            duration: 3000
          });
        }, 1000);
      } else {
        // Dismiss loading toast
        showToast.dismiss(loadingToast);
        
        // Handle errors with more specific messages
        console.error('❌ Session creation failed - Full response:', response);
        console.error('❌ Response status:', response.status);
        console.error('❌ Response data:', response.data);
        console.error('❌ Response error:', response.error);
        console.error('❌ Response message:', response.message);
        
        const errorMessage = (response as any)?.error || (response as any)?.message || (response as any)?.data?.error || (response as any)?.data?.message || 'Failed to upload live session recording';
        setErrors({ submit: errorMessage });
        showToast.error(`❌ Failed to upload live session recording: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('❌ Error uploading live session recording - Full error:', error);
      console.error('❌ Error name:', error?.name);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error stack:', error?.stack);
      
      const errorMessage = error?.message || 'An error occurred while creating the session';
      setErrors({ submit: errorMessage });
      showToast.dismiss(loadingToast);
      showToast.error(`❌ An error occurred while uploading the live session recording: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s._id === studentId)?.full_name || '';
  };

  const getGradeName = (gradeId: string) => {
    return grades.find(g => g._id === gradeId)?.name || '';
  };

  const generateS3Path = (batchId: string, studentId: string, studentName: string, sessionNumber: string) => {
    return `medh-files/videos/${batchId}/${studentId}(${studentName})/${sessionNumber}/`;
  };

  const filteredInstructors = (Array.isArray(instructors) ? instructors : []).filter(instructor =>
    (instructor.full_name || '').toLowerCase().includes(instructorSearchQuery.toLowerCase()) ||
    (instructor.email || '').toLowerCase().includes(instructorSearchQuery.toLowerCase())
  );

  const getInstructorName = (instructorId: string) => {
    return instructors.find(i => i._id === instructorId)?.full_name || '';
  };

  const handleInstructorRemove = (instructorId: string) => {
    setFormData(prev => ({
      ...prev,
      instructorId: prev.instructorId.filter(id => id !== instructorId)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Clean Header - Fully Responsive */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Link
              href={backUrl}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-300 w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaVideo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white truncate">
                    {isEditMode ? 'Edit Live Session Recording' : 'Upload Live Session Recording'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    {isEditMode ? 'Update session details and recordings' : 'Upload and manage session recordings for students'}
                  </p>
                </div>
              </div>
              {usingFallbackData && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
                    <span className="text-yellow-600">⚠️</span>
                    Using demo data - Backend connection may be unavailable
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      

      {/* Main Content - Fully Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Main Form - Full Width */}
        <div className="w-full">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaBook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Session Configuration
              </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Configure your session details and upload recordings
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                
                  {/* Student Name */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Student Name */}
                    <div className="relative group" ref={studentDropdownRef}>
                      <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-violet-900/30 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-700">
                          <FaUser className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                        </div>
                        Select Students *
                      </label>
                      <div className="flex gap-3 items-center">
                        <div className="relative flex-1 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-900/20 dark:via-violet-900/20 dark:to-purple-900/20 p-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowStudentDropdown(true)}
                             className={`w-full h-11 px-4 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors ${
                          errors.students 
                               ? 'border-red-300 dark:border-red-600' 
                                 : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Select students..."
                      />
                    </div>
                    
                        {/* Selected Students Pills - Side by side */}
                    {formData.students.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 min-w-0">
                        {formData.students.map(studentId => (
                          <span
                            key={studentId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs whitespace-nowrap"
                          >
                            {getStudentName(studentId)}
                            <button
                              type="button"
                              onClick={() => handleStudentRemove(studentId)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              aria-label={`Remove ${getStudentName(studentId)}`}
                            >
                                  <FaTimes className="w-2 h-2" />
                            </button>
                    </span>
                        ))}
                      </div>
                    )}
                  </div>
                      {errors.students && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.students}</p>
                    )}

                                         {/* Student Dropdown */}
                     {showStudentDropdown && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                         <div className="p-2">
                           {/* Search Bar */}
                           <div className="mb-3">
                             <div className="relative">
                                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
                               <input
                                 type="text"
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 placeholder="Search students..."
                                 className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               />
                             </div>
                           </div>
                           
                           {/* Select All Option */}
                           <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer border-b border-gray-200 dark:border-gray-600">
                             <input
                               type="checkbox"
                               checked={formData.students.length === students.length}
                               onChange={(e) => {
                                 if (e.target.checked) {
                                   setFormData(prev => ({
                                     ...prev,
                                     students: students.map(s => s._id)
                                   }));
                                 } else {
                                   setFormData(prev => ({ ...prev, students: [] }));
                                 }
                               }}
                               className="rounded"
                             />
                             <span className="font-medium text-gray-700 dark:text-gray-300">Select All</span>
                           </label>
                           
                           {/* Students List */}
                           <div className="max-h-48 overflow-y-auto">
                             {filteredStudents.length > 0 ? (
                               filteredStudents.map(student => (
                                 <label
                                   key={student._id}
                                   className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer"
                                 >
                                   <input
                                     type="checkbox"
                                     checked={formData.students.includes(student._id)}
                                     onChange={() => handleStudentSelect(student._id)}
                                     className="rounded"
                                   />
                                   <div 
                                     className="flex-1 min-w-0"
                                     onClick={() => handleStudentClick(student._id)}
                                   >
                                     <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                       {student.full_name}
                                     </div>
                                     <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                       {student.email}
                                     </div>
                                   </div>
                                 </label>
                               ))
                             ) : (
                               <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                                 <FaSearch className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                 <p className="text-sm">No students found</p>
                                 <p className="text-xs">Try adjusting your search</p>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     )}
                  </div>

                  {/* Latest Session Display */}
                  {(selectedStudentLatestSession || loadingLatestSession) && (
                    <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FaClock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                      <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Latest Session</h3>
                            {selectedStudentLatestSession && (
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                for {selectedStudentLatestSession.student?.full_name}
                              </p>
                            )}
                      </div>
                        </div>
                        {selectedStudentLatestSession && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {selectedStudentLatestSession.student?._id}
                          </div>
                        )}
                    </div>
                    
                      {loadingLatestSession ? (
                        <div className="flex items-center justify-center py-8">
                          <FaSpinner className="w-6 h-6 text-blue-600 animate-spin mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Loading latest session details...</span>
                        </div>
                      ) : selectedStudentLatestSession ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Latest session details</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedStudentLatestSession.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : selectedStudentLatestSession.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              ✓ {selectedStudentLatestSession.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Session Title */}
                            <div className="flex items-center gap-2">
                              <FaFileAlt className="w-4 h-4 text-gray-400" />
                        <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Session Title</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {selectedStudentLatestSession.sessionTitle || 'aaa'}
                          </p>
                        </div>
                      </div>
                      
                            {/* Student */}
                            <div className="flex items-center gap-2">
                              <FaUser className="w-4 h-4 text-gray-400" />
                        <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {selectedStudentLatestSession.student?.full_name || 'Harsh Patel'}
                          </p>
                        </div>
                            </div>
                            
                            {/* Session Number */}
                            <div className="flex items-center gap-2">
                              <FaHashtag className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Session</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {selectedStudentLatestSession.sessionNo || '1'}
                                </p>
                      </div>
                    </div>
                    
                            {/* Grade & Instructor */}
                            <div className="flex items-center gap-2 md:col-span-2">
                              <FaGraduationCap className="w-4 h-4 text-gray-400" />
                      <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Grade & Instructor</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {selectedStudentLatestSession.grade?.name || 'N/A'} • {selectedStudentLatestSession.instructor?.full_name || 'Addya'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <FaClock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No previous sessions found for this student</p>
                </div>
              )}
            </div>
                  )}
                
                {/* Session Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-purple-900/30 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-700 flex-shrink-0">
                      <FaBook className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm sm:text-base">Session Title *</span>
                  </label>
                  <div className="relative rounded-xl border border-indigo-200 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-900/20 dark:via-violet-900/20 dark:to-purple-900/20 p-1">
                  <input
                    type="text"
                    value={formData.sessionTitle}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, sessionTitle: e.target.value }));
                      if (errors.sessionTitle) {
                        setErrors(prev => ({ ...prev, sessionTitle: '' }));
                      }
                    }}
                     className={`w-full h-10 sm:h-11 px-3 sm:px-4 text-sm sm:text-base bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-indigo-500/40 transition-colors ${
                      errors.sessionTitle 
                         ? 'border-red-300 dark:border-red-600' 
                         : 'border-indigo-300 dark:border-indigo-600'
                    }`}
                    placeholder="e.g., Advanced Quadratic Functions"
                  />
                  </div>
                  <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">Clear, concise title helps identify the session later.</p>
                  {errors.sessionTitle && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.sessionTitle}
                    </p>
                  )}
                </div>

                                 {/* Session No */}
                 <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-sky-100 via-cyan-100 to-teal-100 dark:from-sky-900/30 dark:via-cyan-900/30 dark:to-teal-900/30 rounded-lg shadow-sm border border-sky-200 dark:border-sky-700 flex-shrink-0">
                      <FaClock className="w-3 h-3 sm:w-4 sm:h-4 text-sky-600 dark:text-sky-400" />
                    </div>
                    <span className="text-sm sm:text-base">Session No *</span>
                   </label>
                  <div className="relative rounded-xl border border-sky-200 dark:border-sky-700 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 dark:from-sky-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 p-1">
                   <input
                     type="number"
                     value={formData.sessionNo}
                     onChange={(e) => {
                       const value = e.target.value;
                       // Only allow positive integers
                       if (value === '' || /^\d+$/.test(value)) {
                         setFormData(prev => ({ ...prev, sessionNo: value }));
                         if (errors.sessionNo) {
                           setErrors(prev => ({ ...prev, sessionNo: '' }));
                         }
                       }
                     }}
                     onKeyPress={(e) => {
                       // Prevent non-numeric characters
                       if (!/[0-9]/.test(e.key)) {
                         e.preventDefault();
                       }
                     }}
                     className={`w-full h-11 px-4 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500/40 transition-colors ${
                       errors.sessionNo 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-sky-300 dark:border-sky-600'
                     }`}
                     placeholder="e.g., 16"
                     min="1"
                     step="1"
                   />
                  </div>
                  <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">Use a positive number. This appears in the S3 path as session-N.</p>
                   {errors.sessionNo && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.sessionNo}
                    </p>
                   )}
                 </div>

                

                {/* Dashboard Assigned To */}
                <div>
                  <div className="relative" ref={dashboardDropdownRef}>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 via-indigo-100 to-sky-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-sky-900/30 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 flex-shrink-0">
                        <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="tracking-wide text-blue-800 dark:text-blue-300 text-sm sm:text-base">Dashboard Assigned To *</span>
                      <span className="text-[10px] sm:text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/70">Required</span>
                    </label>
                    <div className="relative rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-sky-900/20 p-1 ring-4 ring-blue-200 dark:ring-blue-800 shadow-md shadow-blue-100/60 focus-within:ring-blue-300 focus-within:shadow-blue-200/70">
                       <input
                         type="text"
                         value={dashboardSearchQuery}
                         onChange={(e) => setDashboardSearchQuery(e.target.value)}
                         onFocus={() => setShowDashboardDropdown(true)}
                         className={`w-full h-10 sm:h-11 px-3 sm:px-4 text-sm sm:text-base bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500/40 transition-colors ${
                           errors.dashboard 
                             ? 'border-red-300 dark:border-red-600' 
                             : 'border-blue-300 dark:border-blue-600'
                         }`}
                         placeholder="Select dashboard access"
                         readOnly
                       />
                       <FaShieldAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 drop-shadow-sm" />
                     </div>
                    {errors.dashboard && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.dashboard}</p>
                    )}

                    {/* Dashboard Dropdown */}
                    {showDashboardDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl shadow-xl z-50 max-h-48 sm:max-h-64 overflow-y-auto">
                        <div className="p-2 sm:p-3">
                          {/* Search Bar */}
                          <div className="mb-3">
                    <div className="relative">
                              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
                              <input
                                type="text"
                                value={dashboardSearchQuery}
                                onChange={(e) => setDashboardSearchQuery(e.target.value)}
                                placeholder="Search dashboards..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          {/* Dashboards List */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredDashboards.length > 0 ? (
                              filteredDashboards.map(dashboard => (
                                <div
                                  key={dashboard._id}
                                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, dashboard: dashboard._id }));
                                    setDashboardSearchQuery(dashboard.name);
                                    setShowDashboardDropdown(false);
                                  }}
                                >
                                  <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {dashboard.name}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                                <FaSearch className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No dashboards found</p>
                                <p className="text-xs">Try adjusting your search</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                 

                                     {/* Batch and Grade Row */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Select Batch */}
                    <div className="relative" ref={batchDropdownRef}>
                      <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/30 dark:via-cyan-900/30 dark:to-blue-900/30 rounded-lg shadow-sm border border-teal-200 dark:border-teal-700">
                          <FaBook className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
                        </div>
                        Select Batch *
                    </label>
                      <div className="relative rounded-xl border border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 p-1">
                        <input
                          type="text"
                          value={batchSearchQuery}
                          onChange={(e) => setBatchSearchQuery(e.target.value)}
                          onFocus={() => setShowBatchDropdown(true)}
                          className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                            errors.batchId 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-teal-300 dark:border-teal-600 focus:border-teal-500 hover:border-teal-400'
                          }`}
                          placeholder="Select batch..."
                          readOnly
                        />
                        <FaBook className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                      </div>
                      {errors.batchId && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.batchId}</p>
                      )}
                      
                      {/* Selected Batch Chip */}
                      {formData.batchId && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span
                            className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-sm"
                          >
                                                      {batches.find(batch => batch._id === formData.batchId)?.batch_name || 'Selected Batch'}
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, batchId: '' }))}
                              className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                              aria-label="Remove selected batch"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </span>
                        </div>
                      )}

                      {/* Batch Dropdown */}
                      {showBatchDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                          <div className="p-0">
                            {/* Header Section */}
                            <div className="bg-gray-100 dark:bg-gray-600 px-4 py-3 border-b border-gray-200 dark:border-gray-500">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FaBook className="text-gray-600 dark:text-gray-400 w-5 h-5" />
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Batch Selection</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {formData.students.length > 0 
                                        ? `Batches for ${formData.students.length} selected student${formData.students.length > 1 ? 's' : ''} (with fallback)` 
                                        : "Available batches"
                                      }
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setShowBatchDropdown(false)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                  title="Close batch dropdown"
                                  aria-label="Close batch dropdown"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-500">
                    <div className="relative">
                              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-4 h-4" />
                              <input
                                type="text"
                                value={batchSearchQuery}
                                onChange={(e) => setBatchSearchQuery(e.target.value)}
                                placeholder="Search batches..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          {/* Batches List */}
                          <div className="max-h-64 overflow-y-auto">
                            {(() => {
                              const filteredBatches = getFilteredBatches();
                              return filteredBatches.length > 0 ? (
                                filteredBatches.map(batch => (
                                  <label
                                    key={batch._id}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                  >
                                    <input
                                      type="radio"
                                      name="batch-single-select"
                                      checked={formData.batchId === batch._id}
                                      onChange={() => {
                                        setFormData(prev => ({ ...prev, batchId: batch._id }));
                                        setShowBatchDropdown(false);
                                        setBatchSearchQuery(batch.name || batch.batch_name || '');
                                        if (errors.batchId) {
                                          setErrors(prev => ({ ...prev, batchId: '' }));
                                        }
                                      }}
                                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                          {batch.name || batch.batch_name}
                                        </span>
                                        {/* Warning indicator for missing enrolled_student_ids */}
                                        {(!batch.enrolled_student_ids || batch.enrolled_student_ids.length === 0) && 
                                         (batch.enrolledStudents || batch.enrolled_students || 0) > 0 && (
                                          <span 
                                            className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full flex items-center gap-1"
                                            title="Student enrollment data incomplete - may need database update"
                                          >
                                            ⚠️ Data Missing
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {batch.code || batch.batch_code} • {new Date(batch.startDate || batch.start_date).toLocaleDateString()} - {new Date(batch.endDate || batch.end_date).toLocaleDateString()} • {batch.enrolledStudents || batch.enrolled_students || 0} students
                                      </div>
                                    </div>
                                  </label>
                                ))
                            ) : (
                              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                <FaBook className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                  <p className="text-sm font-medium">
                                    {formData.students.length > 0 
                                      ? "No batches found for selected students" 
                                      : "No batches found"
                                    }
                                  </p>
                                  <p className="text-xs">
                                    {formData.students.length > 0 
                                      ? "Selected students are not enrolled in any batches" 
                                      : "Try adjusting your search"
                                    }
                                  </p>
                              </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Select Grade */}
                  <div className="relative" ref={gradeDropdownRef}>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-700">
                        <FaGraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" style={{ animationDuration: '2s' }} />
                      </div>
                      Select Grade *
                    </label>
                    <div className="relative rounded-xl border border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 p-1">
                      <input
                        type="text"
                        value={gradeSearchQuery}
                        onChange={(e) => setGradeSearchQuery(e.target.value)}
                        onFocus={() => setShowGradeDropdown(true)}
                         className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 ${
                          errors.grades 
                            ? 'border-red-500 focus:border-red-500' 
                             : 'border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 hover:border-emerald-400'
                        }`}
                        placeholder="Select grade levels..."
                      />
                    </div>
                    {errors.grades && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.grades}</p>
                    )}
                    
                    {/* Selected Grade Chip (single) */}
                    {formData.grades.length === 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                        >
                          {getGradeName(formData.grades[0])}
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, grades: [] }))}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            aria-label={`Remove ${getGradeName(formData.grades[0])}`}
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      </div>
                    )}

                                                                                   {/* Grade Dropdown */}
                      {showGradeDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                          <div className="p-0">
                            {/* Header Section */}
                            <div className="bg-gray-100 dark:bg-gray-600 px-4 py-3 border-b border-gray-200 dark:border-gray-500">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FaGraduationCap className="text-gray-600 dark:text-gray-400 w-5 h-5" />
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Grade Level</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Educational level</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setShowGradeDropdown(false)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                  title="Close grade dropdown"
                                  aria-label="Close grade dropdown"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-500">
                              <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-4 h-4" />
                                <input
                                  type="text"
                                  value={gradeSearchQuery}
                                  onChange={(e) => setGradeSearchQuery(e.target.value)}
                                  placeholder="Search grade levels..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            
                            {/* Single select mode - remove Select All */}
                            
                            {/* Grades List */}
                            <div className="max-h-64 overflow-y-auto">
                              {filteredGrades.length > 0 ? (
                                filteredGrades.map(grade => (
                                  <label
                                    key={grade._id}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                  >
                                    <input
                                      type="radio"
                                      name="grade-single-select"
                                      checked={formData.grades.includes(grade._id)}
                                    onChange={() => {
                                      setFormData(prev => ({ ...prev, grades: [grade._id] }));
                                      setShowGradeDropdown(false);
                                      if (errors.grades) {
                                        setErrors(prev => ({ ...prev, grades: '' }));
                                      }
                                    }}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                      {grade.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                      Grade level {grade.name}
                                </div>
                                    </div>
                                  </label>
                                ))
                              ) : (
                                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                <FaGraduationCap className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                <p className="text-sm font-medium">No grades found</p>
                                 <p className="text-xs">Try adjusting your search</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                </div>

                 {/* Select Course Coordinator (Not Applicable) */}
                 <div className="relative mt-6">
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-lime-100 via-green-100 to-emerald-100 dark:from-lime-900/30 dark:via-green-900/30 dark:to-emerald-900/30 rounded-lg shadow-sm border border-lime-200 dark:border-lime-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-lime-600 dark:fill-lime-400"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 1.79-8 4v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.21-3.58-4-8-4Z"/></svg>
                      </div>
                      Select Course Coordinator *
                    </label>
                    <div className="relative rounded-xl border border-lime-200 dark:border-lime-700 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 dark:from-lime-900/20 dark:via-green-900/20 dark:to-emerald-900/20 p-1">
                      <input
                        type="text"
                      value="Not Applicable"
                        readOnly
                      className="w-full h-11 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 cursor-not-allowed"
                      placeholder="Course Coordinator"
                      />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-lime-500"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 1.79-8 4v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.21-3.58-4-8-4Z"/></svg>
                    </span>
                    </div>
                  <p className="mt-2 text-sm text-lime-600 dark:text-lime-400 flex items-center gap-2">
                    <span className="text-lime-500">ℹ️</span>
                    Course coordinator is not applicable for this session
                  </p>
                           </div>
                           
                {/* Select Instructors (Multi-select) */}
                <div className="relative mt-6" ref={instructorDropdownRef}>
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-red-100 via-pink-100 to-rose-100 dark:from-red-900/30 dark:via-pink-900/30 dark:to-rose-900/30 rounded-lg shadow-sm border border-red-200 dark:border-red-700 flex-shrink-0">
                      <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm sm:text-base">Select Instructors *</span>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200/70">Required</span>
                  </label>
                  <div className="relative rounded-xl border border-red-200 dark:border-red-700 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-rose-900/20 p-1">
                    <div 
                      className={`w-full h-11 px-4 bg-white dark:bg-gray-700 border rounded-xl focus-within:ring-4 focus-within:ring-red-500/20 transition-all duration-300 flex items-center cursor-pointer ${
                        'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                      onClick={() => setShowInstructorDropdown(true)}
                    >
                      {formData.instructorId.length > 0 ? (
                        <div className="flex flex-wrap gap-1 flex-1">
                          {formData.instructorId.map(instructorId => (
                            <span key={instructorId} className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-xs">
                              {getInstructorName(instructorId)}
                              <button type="button" onClick={() => handleInstructorRemove(instructorId)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label={`Remove ${getInstructorName(instructorId)}`}>
                                <FaTimes className="w-2 h-2" />
                              </button>
                            </span>
                          ))}
                                   </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Select instructors...</span>
                             )}
                           </div>
                    <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                         </div>
                     {showInstructorDropdown && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                         <div className="p-2">
                        {/* Search */}
                           <div className="mb-3">
                             <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                               <input
                                 type="text"
                                 value={instructorSearchQuery}
                                 onChange={(e) => setInstructorSearchQuery(e.target.value)}
                                 placeholder="Search instructors..."
                              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                               />
                             </div>
                           </div>
                        {/* List */}
                           <div className="max-h-48 overflow-y-auto">
                             {filteredInstructors.length > 0 ? (
                               filteredInstructors.map(instructor => (
                              <label key={instructor._id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.instructorId.includes(instructor._id)}
                                  onChange={() => {
                                    if (formData.instructorId.includes(instructor._id)) {
                                      setFormData(prev => ({ ...prev, instructorId: prev.instructorId.filter(id => id !== instructor._id) }));
                                    } else {
                                      setFormData(prev => ({ ...prev, instructorId: [...prev.instructorId, instructor._id] }));
                                    }
                                  }}
                                  className="rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{instructor.full_name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{instructor.email}</div>
                                   </div>
                              </label>
                               ))
                             ) : (
                               <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                                 <FaSearch className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                 <p className="text-sm">No instructors found</p>
                                 <p className="text-xs">Try adjusting your search</p>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     )}
                     
                  {/* Instructor Error Display */}
                  {errors.instructorId && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      {errors.instructorId}
                    </p>
                  )}
                </div>

                  {/* Video Upload Section */}
                <div className="block w-full md:col-span-2 xl:col-span-2 mt-6 border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-blue-50 dark:bg-blue-900/20 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FaVideo className="text-blue-600 dark:text-blue-400" />
                      Session Videos
                  </h3>
                    
                    {/* Video Upload Area */}
                    <div className="space-y-4">
                      {/* File Input */}
                      <div className="relative">
                        <input
                          ref={videoInputRef}
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={handleVideoSelect}
                          className="hidden"
                          title="Select video files"
                          aria-label="Select video files for upload"
                        />
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="w-full h-11 px-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                          <FaUpload className="w-5 h-5" />
                          <span>Select Video Files</span>
                        </button>
                      </div>

                      {/* Upload Progress Display */}
                      {uploadingVideos && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <FaSpinner className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                              <div>
                                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                                  Uploading Videos to S3 Bucket
                                </h4>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                  {selectedVideos.length} video(s) being uploaded...
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                                {Object.keys(uploadProgress).length}/{selectedVideos.length}
                              </div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                Videos Processed
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300 ease-out"
                              style={{ 
                                width: `${Object.keys(uploadProgress).length > 0 ? (Object.keys(uploadProgress).length / selectedVideos.length) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          
                          {/* Progress Details */}
                          <div className="mt-3 text-xs text-blue-700 dark:text-blue-300">
                            <div className="flex justify-between">
                              <span>📁 Uploading to S3...</span>
                              <span>{Math.round((Object.keys(uploadProgress).length / selectedVideos.length) * 100)}% Complete</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* S3 Path Preview */}
                      {selectedVideos.length > 0 && formData.batchId && formData.students.length > 0 && formData.sessionNo && (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-xl">
                          <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                            <FaBook className="w-4 h-4" />
                            S3 Storage Path Preview
                          </h4>
                          <div className="space-y-2">
                            {formData.students.map(studentId => {
                              const student = students.find(s => s._id === studentId);
                              const batch = batches.find(b => b._id === formData.batchId);
                              if (!student || !batch) return null;
                              
                              const s3Path = generateS3Path(batch._id, student._id, student.full_name, formData.sessionNo);
                              return (
                                <div key={studentId} className="text-xs text-purple-700 dark:text-purple-300 font-mono bg-white/50 dark:bg-gray-800/50 p-2 rounded border">
                                  📁 /{s3Path}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                            Videos will be organized in these S3 paths for each student
                          </p>
                        </div>
                      )}

                      {/* Selected Videos Preview */}
                      {selectedVideos.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Selected Videos ({selectedVideos.length})
                            </h4>
                            <button
                              type="button"
                              onClick={uploadVideos}
                              disabled={uploadingVideos}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {uploadingVideos ? (
                                <>
                                  <FaSpinner className="w-4 h-4 animate-spin" />
                                  Uploading {selectedVideos.length} Videos...
                                </>
                              ) : (
                                <>
                                  <FaUpload className="w-4 h-4" />
                                  Upload {selectedVideos.length} Videos
                                </>
                              )}
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {selectedVideos.map((video, index) => {
                              // Skip rendering if video is null or undefined
                              if (!video) return null;
                              
                              return (
                                <div key={`selected-${video.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <FaFileVideo className="w-5 h-5 text-blue-500" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {video.name || 'Unknown File'}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(video.size || 0)}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeSelectedVideo(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                    title="Remove video"
                                    aria-label={`Remove ${video.name || 'video'}`}
                                  >
                                    <FaTimes className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Uploaded Videos */}
                      {uploadedVideos.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Uploaded Videos ({uploadedVideos.length})
                          </h4>
                          
                          <div className="space-y-2">
                            {uploadedVideos.map((video, index) => {
                              // Skip rendering if video is null or undefined
                              if (!video) return null;
                              
                                                             return (
                                 <div key={video.fileId || index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                                   <div className="flex items-center gap-3">
                                     <FaVideo className="w-5 h-5 text-green-500" />
                                     <div>
                                       <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                         {video.name || 'Unknown File'}
                                       </p>
                                       <p className="text-xs text-gray-500 dark:text-gray-400">
                                         {formatFileSize(video.size || 0)} • Uploaded
                                       </p>
                                       {video.studentId && (
                                         <p className="text-xs text-blue-600 dark:text-blue-400">
                                        👤 Student: {video.studentName || video.studentId}
                                        {video.batchId && ` • 📚 Batch: ${video.batchId}`}
                                         </p>
                                       )}
                                       {video.s3Path && (
                                         <p className="text-xs text-purple-600 dark:text-purple-400">
                                           📁 Path: {video.s3Path}
                                         </p>
                                       )}
                                     </div>
                                   </div>
                                  <div className="flex items-center gap-2">
                                    {video.url && (
                                      <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                        title="View video"
                                      >
                                        <FaPlay className="w-4 h-4" />
                                      </a>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => removeUploadedVideo(video.fileId || '')}
                                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                      title="Remove video"
                                    >
                                      <FaTrash className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                {/* Remarks Section */}
                <div className="w-full mt-6">
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 rounded-lg shadow-sm border border-amber-200 dark:border-amber-700">
                      <FaComment className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                    </div>
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Any additional notes or comments..."
                  />
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.remarks.length}/500
                  </div>
                </div>

                {/* Date Section */}
                <div className="group w-full mt-6">
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 dark:from-pink-900/30 dark:via-rose-900/30 dark:to-fuchsia-900/30 rounded-lg shadow-sm border border-pink-200 dark:border-pink-700">
                      <FaCalendarAlt className="w-4 h-4 text-pink-600 dark:text-pink-400 animate-pulse" />
                    </div>
                      Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, date: e.target.value }));
                          if (errors.date) {
                            setErrors(prev => ({ ...prev, date: '' }));
                          }
                        }}

                      className={`w-full px-6 py-3 bg-white dark:bg-gray-700 border-2 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 shadow-sm group-hover:shadow-md ${
                          errors.date 
                            ? 'border-red-500 focus:border-red-500' 
                          : 'border-pink-300 dark:border-pink-600 focus:border-pink-500 hover:border-pink-400'
                        }`}
                        placeholder="dd-mm-yyyy"
                      />
                    </div>
                    {errors.date && (
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      {errors.date}
                    </p>
                    )}
                </div>

                {/* Summary Section - Full Width Enhanced */}
                <div className="col-span-full w-full max-w-none border border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 border-b border-purple-200 dark:border-purple-700 pb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-indigo-900/30 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
                      <FaFileAlt className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-bounce" />
                    </div>
                    <span className="text-xl">Session Summary *</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent dark:from-purple-700"></div>
                  </h3>

                  {/* Summary Items */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Summary Items
                      </label>
                    </div>

                    {/* Items List */}
                    {formData.summary.items.length > 0 ? (
                      <div className="space-y-4">
                        {formData.summary.items.map((item, index) => (
                          <div key={item.id} className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-600 rounded-xl p-4 sm:p-6 w-full max-w-none shadow-md hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Item {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  summary: {
                                    ...prev.summary,
                                    items: prev.summary.items.filter((_, i) => i !== index)
                                  }
                                }))}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                title="Remove item"
                                aria-label="Remove item"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                            
                                                                                      <div className="space-y-4">
                               {/* Summary Title */}
                               <div>
                                 <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                   Summary Title *
                                 </label>
                                 <input
                                   type="text"
                                   value={formData.summary.title}
                                   onChange={(e) => {
                                     setFormData(prev => ({ 
                                       ...prev, 
                                       summary: { ...prev.summary, title: e.target.value }
                                     }));
                                     if (errors.summaryTitle) {
                                       setErrors(prev => ({ ...prev, summaryTitle: '' }));
                                     }
                                   }}
                                   className={`w-full min-w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base ${
                                     errors.summaryTitle 
                                       ? 'border-red-500 focus:border-red-500' 
                                       : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                                   }`}
                                   placeholder="Enter summary title"
                                   maxLength={120}
                                 />
                                 <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                                   {formData.summary.title.length}/120
                                 </div>
                                 {errors.summaryTitle && (
                                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.summaryTitle}</p>
                                 )}
                               </div>

                               {/* Summary Description */}
                               <div>
                                 <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                   Summary Description
                                 </label>
                                 <textarea
                                   value={formData.summary.description}
                                   onChange={(e) => setFormData(prev => ({ 
                                     ...prev, 
                                     summary: { ...prev.summary, description: e.target.value }
                                   }))}
                                   rows={6}
                                   className="w-full min-w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-y"
                                   placeholder="Enter detailed summary description..."
                                 />
                               </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Add Item Button */}
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          summary: {
                            ...prev.summary,
                            items: [...prev.summary.items, { 
                              id: Date.now().toString(), 
                              type: 'Topic', 
                              title: '',
                              description: ''
                            }]
                          }
                        }))}
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-200"
                      >
                        <FaPlus className="w-6 h-6" />
                        <span className="text-lg font-medium">ADD ITEM</span>
                      </button>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Responsive */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="hidden sm:inline">Uploading Live Session Recording...</span>
                        <span className="sm:hidden">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">{isEditMode ? 'Update Live Session Recording' : 'Upload Live Session Recording'}</span>
                        <span className="sm:hidden">{isEditMode ? 'Update Session' : 'Upload Session'}</span>
                      </>
                    )}
                  </button>
                </div>
                </div>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
