"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaBullhorn, FaChevronDown, FaUsers, FaUser, FaCalendarAlt, FaVideo, FaCopy, FaShare, FaUpload, FaDownload } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
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

interface ICourse {
  _id: string;
  course_title: string;
  course_category: string;
  assigned_instructor: string;
  class_type: string;
  status: string;
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
  batchId?: string; // Store the original batch ID
}

interface IStudent {
  _id: string;
  full_name: string;
  email?: string;
}

export default function ManageDigitalMarketingPage() {
  // Initialize router for navigation
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  const { getQuery: fetchSessions, loading: sessionsLoading } = useGetQuery();
  
  // State management
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [selectedSessionType, setSelectedSessionType] = useState<string>("");
  const [showInstructorDropdown, setShowInstructorDropdown] = useState<boolean>(false);
  const [showSessionTypeDropdown, setShowSessionTypeDropdown] = useState<boolean>(false);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [creatingZoomMeeting, setCreatingZoomMeeting] = useState<string | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [showAddSessionModal, setShowAddSessionModal] = useState<boolean>(false);
  const [sessionForm, setSessionForm] = useState<{ day: string; start_time: string; end_time: string }>({ day: '', start_time: '', end_time: '' });
  const [currentBatchIdForSession, setCurrentBatchIdForSession] = useState<string | null>(null);
  const [showAddRecordingModal, setShowAddRecordingModal] = useState<boolean>(false);
  const [recordingForm, setRecordingForm] = useState<{ title: string; url: string; recorded_date: string }>({ title: '', url: '', recorded_date: '' });
  const [currentBatchIdForRecording, setCurrentBatchIdForRecording] = useState<string | null>(null);
  const [currentSessionIdForRecording, setCurrentSessionIdForRecording] = useState<string | null>(null);
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [showStudentDropdown, setShowStudentDropdown] = useState<boolean>(false);
  const [existingRecordings, setExistingRecordings] = useState<IRecordedLesson[]>([]);
  const [useExternalUrl, setUseExternalUrl] = useState<boolean>(false);
  
  // Refs for dropdown management
  const instructorDropdownRef = useRef<HTMLDivElement>(null);
  const sessionTypeDropdownRef = useRef<HTMLDivElement>(null);
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  // Session type options
  const sessionTypes = [
    { id: 'batch', label: 'Batch Classes', icon: FaUsers, description: 'Group sessions with multiple students' },
    { id: 'individual', label: 'Individual Classes', icon: FaUser, description: 'One-on-one personalized sessions' }
  ];

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors();
    fetchStudents();
  }, []);

  // Fetch batches for this category on mount
  useEffect(() => {
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          // API may return students at top-level or nested under data
          if (Array.isArray(response.students)) {
            setStudents(response.students);
          } else if (Array.isArray(response.data?.students)) {
            setStudents(response.data.students);
          } else if (Array.isArray(response.data)) {
            setStudents(response.data);
          } else {
            setStudents([]);
          }
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
      url: `/batches/courses/category/${encodeURIComponent("Digital Marketing with Data Analytics")}/batches`,
      onSuccess: (response: any) => {
        const data = response?.data?.data || response?.data;
        const transformed: ISession[] = Array.isArray(data)
          ? data.map((batch: any) => ({
              _id: batch._id,
              batchId: batch._id, // Store the original batch ID
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
      }
    });
  };

  // Load batches by student selection
  const loadBatchesByStudent = async (studentId: string) => {
    try {
      const resp = await batchAPI.getIndividualBatchesByStudent(studentId);
      const list = resp.data?.data || resp.data;
      if (!Array.isArray(list)) {
        setSessions([]);
        return;
      }
      // Filter to this category
      const filtered = list.filter((entry: any) => entry.course?.course_title === "Digital Marketing with Data Analytics");
      const transformed: ISession[] = filtered.map((entry: any) => {
        const batch = entry.batch;
        return {
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
        };
      });
      setSessions(transformed);
    } catch (error: any) {
      console.error('Failed to load batches by student:', error);
      setSessions([]);
    }
  };

  // Update batches when student filter changes
  useEffect(() => {
    if (selectedStudent) loadBatchesByStudent(selectedStudent);
    else loadCategoryBatches();
  }, [selectedStudent]);

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

  // Share meeting link
  const shareMeetingLink = (link: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Online Class',
        text: 'Join our online class session',
        url: link,
      });
    } else {
      copyMeetingLink(link);
    }
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

  // Create Zoom meeting function (via batchAPI)
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

  // Modal open/submit handlers
  const openAddSessionModal = (batchId: string) => {
    setCurrentBatchIdForSession(batchId);
    setSessionForm({ day: '', start_time: '', end_time: '' });
    setShowAddSessionModal(true);
  };
  const submitAddSession = async () => {
    if (!currentBatchIdForSession) return;
    try {
      await batchAPI.addScheduledSession(currentBatchIdForSession, sessionForm);
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
    setRecordingForm({ title: '', url: '', recorded_date: '' });
    setShowAddRecordingModal(true);
  };
  const submitAddRecording = async () => {
    if (!currentBatchIdForRecording || !currentSessionIdForRecording) return;
    // Ensure recorded_date is a valid ISO string; default to now if empty
    const payload = {
      title: recordingForm.title,
      url: recordingForm.url,
      recorded_date: recordingForm.recorded_date || new Date().toISOString()
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

  // Handle video file upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading('Uploading video...');
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      const rawBase64 = base64String.includes(',') ? base64String.split(',')[1] : base64String;
      const response = await apiClient.post<UploadResponse>(apiUrls.upload.uploadMedia, {
        base64String: rawBase64,
        fileType: 'video'
      });
      const uploadedUrl = response.data!.data.url;
      if (uploadedUrl) {
        setRecordingForm(prev => ({ ...prev, url: uploadedUrl }));
        toast.success('Video uploaded successfully!');
      } else {
        throw new Error('No URL returned');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error('Video upload failed');
    }
  };

  // Toggle display of scheduled sessions for a session
  const toggleSessions = (sessionId: string) => {
    setOpenSessions(prev => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  // Update the session card to show schedules and zoom meeting details
  const renderSessionsList = () => {
    if (sessionsLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin mx-auto h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading classes...</p>
        </div>
      );
    }
    
    if (filteredSessions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendarAlt className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No classes found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {selectedInstructor || selectedSessionType 
              ? "No classes match your current filters" 
              : "No classes have been scheduled yet"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {session.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    <span>{session.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.sessionType === 'batch' ? <FaUsers className="text-blue-500" /> : <FaUser className="text-green-500" />}
                    <span>{session.sessionType === 'batch' ? `Batch (${session.students} students)` : 'Individual'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-orange-500" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaVideo className="text-red-500" />
                    <span>{session.schedules && session.schedules.length > 0 ? `${session.schedules.length} scheduled sessions` : 'No schedules'}</span>
                  </div>
                </div>
                
                {/* Scheduled Sessions */}
                {session.schedules && session.schedules.length > 0 && openSessions[session._id] && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Scheduled Sessions:</div>
                      <button
                        onClick={() => openAddSessionModal(session.batchId!)}
                        className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                      >
                        + Add Session
                      </button>
                    </div>
                    {session.schedules.map((schedule) => (
                      <div key={schedule._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <FaCalendarAlt className="text-sm text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{schedule.day}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{schedule.start_time} - {schedule.end_time}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          {schedule.zoom_meeting ? (
                            <>
                              <div className="bg-green-100 dark:bg-green-900/30 py-1 px-2 rounded text-xs text-green-700 dark:text-green-400 flex items-center">
                                <FaVideo className="mr-1 text-xs" /> 
                                Zoom Ready
                              </div>
                              <button
                                onClick={() => copyMeetingLink(schedule.zoom_meeting!.join_url)}
                                className="p-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
                                title="Copy Zoom link"
                              >
                                <FaCopy className="text-gray-600 dark:text-gray-300 text-xs" />
                              </button>
                              <button
                                onClick={() => openAddRecordingModal(session.batchId!, schedule._id)}
                                className="p-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-lg transition-colors duration-200"
                                title="Add Recorded Lesson"
                              >
                                <FaUpload className="text-yellow-600 dark:text-yellow-400 text-xs" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => createZoomMeeting(session.batchId!, schedule._id, session.title)}
                              disabled={creatingZoomMeeting === schedule._id}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-xs flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {creatingZoomMeeting === schedule._id ? (
                                <>
                                  <div className="animate-spin h-3 w-3 border-b-2 border-white rounded-full mr-1"></div>
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <FaVideo className="mr-1" /> 
                                  Create Zoom
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        {schedule.recorded_lessons && schedule.recorded_lessons.length > 0 && (
                          <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                  <th className="px-4 py-2">Title</th>
                                  <th className="px-4 py-2">Date</th>
                                  <th className="px-4 py-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {schedule.recorded_lessons.map((lesson) => (
                                  <tr key={lesson._id}>
                                    <td className="px-4 py-2">
                                      <a href={lesson.url} target="_blank" className="underline text-blue-600 dark:text-blue-400">
                                        {lesson.title}
                                      </a>
                                    </td>
                                    <td className="px-4 py-2">
                                      {new Date(lesson.recorded_date).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 flex space-x-4">
                                      <button onClick={() => window.open(lesson.url, '_blank')} className="text-blue-600 hover:underline">
                                        View
                                      </button>
                                      <button onClick={() => copyMeetingLink(lesson.url)} className="text-gray-600 dark:text-gray-300 hover:underline">
                                        Copy Link
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleSessions(session._id)}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboards/admin/online-class/live"
              className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center transition-colors duration-200 group"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-0.5">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <FaBullhorn className="text-2xl text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Manage Digital Marketing Classes
                  </h1>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  manage instructors and class types for digital marketing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Filter Classes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Dropdown */}
            <div className="relative" ref={studentDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Student</label>
              <button
                onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left flex items-center justify-between hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <span className={selectedStudent ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
                  {selectedStudent ? students.find(s => s._id === selectedStudent)?.full_name : "Select a student..."}
                </span>
                <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showStudentDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showStudentDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => { setSelectedStudent(""); setShowStudentDropdown(false); }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      All Students
                    </button>
                    {students.map(student => (
                      <button
                        key={student._id}
                        onClick={() => { setSelectedStudent(student._id); setShowStudentDropdown(false); }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300"
                      >
                        <div>
                          <div className="font-medium">{student.full_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                        </div>
                      </button>
                    ))}
                    {students.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                        {loading ? "Loading students..." : "No students found"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Instructor Dropdown */}
            <div className="relative" ref={instructorDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Instructor
              </label>
              <button
                onClick={() => setShowInstructorDropdown(!showInstructorDropdown)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left flex items-center justify-between hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <span className={selectedInstructor ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
                  {selectedInstructor || "Choose an instructor..."}
                </span>
                <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showInstructorDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showInstructorDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedInstructor("");
                        setShowInstructorDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      All Instructors
                    </button>
                    {instructors.map((instructor) => (
                      <button
                        key={instructor._id}
                        onClick={() => handleInstructorSelect(instructor)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300"
                      >
                        <div>
                          <div className="font-medium">{instructor.full_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{instructor.email}</div>
                        </div>
                      </button>
                    ))}
                    {instructors.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                        {loading ? "Loading instructors..." : "No instructors found"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Session Type Dropdown */}
            <div className="relative" ref={sessionTypeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class Type
              </label>
              <button
                onClick={() => setShowSessionTypeDropdown(!showSessionTypeDropdown)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left flex items-center justify-between hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <span className={selectedSessionType ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
                  {selectedSessionType ? sessionTypes.find(type => type.id === selectedSessionType)?.label : "Choose class type..."}
                </span>
                <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showSessionTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showSessionTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedSessionType("");
                        setShowSessionTypeDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      All Types
                    </button>
                    {sessionTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleSessionTypeSelect(type.id)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">{type.label}</div>
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

        {/* Sessions List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Scheduled Batches ({filteredSessions.length})
            </h2>
            <button
              onClick={() => router.push('/dashboards/admin/online-class/live/batch-management')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              + Add / Edit Batches
            </button>
          </div>

          {renderSessionsList()}
        </div>
      </div>
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Scheduled Session</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Day</label>
                <input type="text" value={sessionForm.day} onChange={e => setSessionForm(prev => ({ ...prev, day: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                <input type="time" value={sessionForm.start_time} onChange={e => setSessionForm(prev => ({ ...prev, start_time: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                <input type="time" value={sessionForm.end_time} onChange={e => setSessionForm(prev => ({ ...prev, end_time: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowAddSessionModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={submitAddSession} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Session</button>
            </div>
          </div>
        </div>
      )}
      {showAddRecordingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Recorded Lesson</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={useExternalUrl}
                    onChange={e => setUseExternalUrl(e.target.checked)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Paste video URL instead of upload</span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" value={recordingForm.title} onChange={e => setRecordingForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              {!useExternalUrl && (
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Upload Video</label>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="w-full" />
                </div>
              )}
              {recordingForm.url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview</label>
                  <video src={recordingForm.url} controls className="w-full rounded-lg" />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">URL</label>
                <input
                  type="text"
                  value={recordingForm.url}
                  onChange={e => setRecordingForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Paste video URL"
                  className="w-full px-3 py-2 border rounded-lg"
                  readOnly={useExternalUrl}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Recorded Date</label>
                <input type="datetime-local" value={recordingForm.recorded_date} onChange={e => setRecordingForm(prev => ({ ...prev, recorded_date: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowAddRecordingModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={submitAddRecording} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save Recording</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 