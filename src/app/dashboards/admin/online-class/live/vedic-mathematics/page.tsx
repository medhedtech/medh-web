"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaArrowLeft, FaCalculator, FaChevronDown, FaUsers, FaUser, FaCalendarAlt, FaVideo, FaCopy, FaShare } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-hot-toast";

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
  sessionType: 'batch' | 'individual';
  date: string;
  time: string;
  duration: string;
  students: number;
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export default function ManageVedicMathematicsPage() {
  const { getQuery, loading } = useGetQuery();
  
  // State management
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [selectedSessionType, setSelectedSessionType] = useState<string>("");
  const [showInstructorDropdown, setShowInstructorDropdown] = useState<boolean>(false);
  const [showSessionTypeDropdown, setShowSessionTypeDropdown] = useState<boolean>(false);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  
  // Refs for dropdown management
  const instructorDropdownRef = useRef<HTMLDivElement>(null);
  const sessionTypeDropdownRef = useRef<HTMLDivElement>(null);

  // Session type options
  const sessionTypes = [
    { id: 'batch', label: 'Batch Classes', icon: FaUsers, description: 'Group sessions with multiple students' },
    { id: 'individual', label: 'Individual Classes', icon: FaUser, description: 'One-on-one personalized sessions' }
  ];

  // Mock sessions data (replace with actual API call)
  const mockSessions: ISession[] = [
    {
      _id: '1',
      title: 'Speed Calculation Techniques',
      instructor: 'Prof. Rajesh Kumar',
      sessionType: 'batch',
      date: '2024-01-15',
      time: '4:00 PM',
      duration: '1.5 hours',
      students: 30,
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled'
    },
    {
      _id: '2',
      title: 'Advanced Multiplication Methods',
      instructor: 'Dr. Priya Sharma',
      sessionType: 'individual',
      date: '2024-01-16',
      time: '5:00 PM',
      duration: '1 hour',
      students: 1,
      meetingLink: 'https://zoom.us/j/987654321',
      status: 'ongoing'
    },
    {
      _id: '3',
      title: 'Mental Math for Competitive Exams',
      instructor: 'Mr. Anil Gupta',
      sessionType: 'batch',
      date: '2024-01-17',
      time: '6:00 PM',
      duration: '2 hours',
      students: 25,
      meetingLink: 'https://zoom.us/j/456789123',
      status: 'completed'
    }
  ];

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors();
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
          toast.error('Failed to load instructors');
          setInstructors([]);
        }
      });
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    }
  };

  // Filter sessions based on selected instructor and session type
  const filteredSessions = mockSessions.filter(session => {
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-0.5">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <FaCalculator className="text-2xl text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Manage Vedic Mathematics Classes
                  </h1>
                  <span className="text-2xl">🧮</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  manage instructors and class types for vedic mathematics
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instructor Dropdown */}
            <div className="relative" ref={instructorDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Instructor
              </label>
              <button
                onClick={() => setShowInstructorDropdown(!showInstructorDropdown)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left flex items-center justify-between hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left flex items-center justify-between hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
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
                            <IconComponent className="text-orange-500" />
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
              Scheduled Classes ({filteredSessions.length})
            </h2>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105">
              + New Class
            </button>
          </div>

          {filteredSessions.length === 0 ? (
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
          ) : (
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
                          <FaUser className="text-orange-500" />
                          <span>{session.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.sessionType === 'batch' ? <FaUsers className="text-blue-500" /> : <FaUser className="text-green-500" />}
                          <span>{session.sessionType === 'batch' ? `Batch (${session.students} students)` : 'Individual'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-orange-500" />
                          <span>{session.date} at {session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaVideo className="text-red-500" />
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {session.meetingLink && (
                        <>
                          <button
                            onClick={() => copyMeetingLink(session.meetingLink!)}
                            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                            title="Copy meeting link"
                          >
                            <FaCopy className="text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => shareMeetingLink(session.meetingLink!)}
                            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                            title="Share meeting link"
                          >
                            <FaShare className="text-gray-600 dark:text-gray-400" />
                          </button>
                        </>
                      )}
                      <button className="px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30 rounded-lg transition-colors duration-200">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 