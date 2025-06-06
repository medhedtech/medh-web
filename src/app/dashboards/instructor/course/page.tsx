"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Users,
  Calendar,
  Clock,
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  BookOpen,
  Video,
  MapPin,
  User,
  ChevronRight,
  Eye,
  Edit,
  BarChart3,
  PlayCircle,
  Download,
  Star,
  TrendingUp,
  Award,
  Target,
  UserCheck,
  AlertCircle,
  CheckCircle,
  X,
  Menu
} from "lucide-react";
import SidebarDashboard from "@/components/sections/sub-section/dashboards/SidebarDashboard";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import useScreenSize from "@/hooks/useScreenSize";
import { apiUrls, apiBaseUrl } from "@/apis/index";

// Types
interface ICourse {
  _id: string;
  course_title: string;
  course_code: string;
  course_image?: string;
  instructor_name?: string;
  instructor_id: string;
  course_type: 'live' | 'blended' | 'selfPaced';
  batch_info: {
    batch_id: string;
    batch_name: string;
    batch_code: string;
    start_date: string;
    end_date: string;
    total_students: number;
    enrolled_students: number;
    max_capacity: number;
  };
  schedule: {
    days: string[];
    time_slot: string;
    duration: string;
    timezone: string;
  };
  progress: {
    total_lessons: number;
    completed_lessons: number;
    completion_percentage: number;
    total_assignments: number;
    graded_assignments: number;
  };
  status: 'active' | 'completed' | 'upcoming' | 'suspended';
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  reviews_count: number;
  last_activity: string;
}

interface IFilterState {
  searchTerm: string;
  courseType: string;
  status: string;
  category: string;
  batchStatus: string;
}

interface IUserData {
  userRole: string;
  fullName: string;
  userEmail: string;
  userImage: string;
  userNotifications: number;
  userSettings: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

// Constants
const COURSE_TYPES = ['all', 'live', 'blended', 'selfPaced'] as const;
const COURSE_STATUSES = ['all', 'active', 'completed', 'upcoming', 'suspended'] as const;

// Animation variants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }
};

// Mock data - extracted for better organization
const MOCK_COURSES: ICourse[] = [
  {
    course_id: "CS101",
    course_title: "Introduction to Computer Science",
    course_code: "CS-101-F24",
    course_image: "/course-images/cs101.jpg",
    instructor_name: "Dr. Sarah Johnson",
    instructor_id: "inst_001",
    course_type: "live",
    batch_info: {
      batch_id: "B001",
      batch_name: "Fall 2024 - Morning Batch",
      batch_code: "CS101-F24-M",
      start_date: "2024-09-01",
      end_date: "2024-12-15",
      total_students: 45,
      enrolled_students: 42,
      max_capacity: 50
    },
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time_slot: "09:00 AM - 10:30 AM",
      duration: "1.5 hours",
      timezone: "EST"
    },
    progress: {
      total_lessons: 24,
      completed_lessons: 18,
      completion_percentage: 75,
      total_assignments: 8,
      graded_assignments: 6
    },
    status: "active",
    category: "Computer Science",
    difficulty_level: "beginner",
    rating: 4.8,
    reviews_count: 156,
    last_activity: "2024-01-15"
  },
  {
    course_id: "WD201",
    course_title: "Advanced Web Development",
    course_code: "WD-201-F24",
    course_image: "/course-images/wd201.jpg",
    instructor_name: "Dr. Sarah Johnson",
    instructor_id: "inst_001",
    course_type: "blended",
    batch_info: {
      batch_id: "B002",
      batch_name: "Fall 2024 - Evening Batch",
      batch_code: "WD201-F24-E",
      start_date: "2024-09-15",
      end_date: "2024-01-30",
      total_students: 28,
      enrolled_students: 28,
      max_capacity: 30
    },
    schedule: {
      days: ["Tuesday", "Thursday"],
      time_slot: "06:00 PM - 08:00 PM",
      duration: "2 hours",
      timezone: "EST"
    },
    progress: {
      total_lessons: 32,
      completed_lessons: 20,
      completion_percentage: 62,
      total_assignments: 12,
      graded_assignments: 8
    },
    status: "active",
    category: "Web Development",
    difficulty_level: "advanced",
    rating: 4.9,
    reviews_count: 89,
    last_activity: "2024-01-14"
  },
  {
    course_id: "DS301",
    course_title: "Data Structures and Algorithms",
    course_code: "DS-301-S24",
    course_image: "/course-images/ds301.jpg",
    instructor_name: "Dr. Sarah Johnson",
    instructor_id: "inst_001",
    course_type: "live",
    batch_info: {
      batch_id: "B003",
      batch_name: "Spring 2024 - Completed",
      batch_code: "DS301-S24-M",
      start_date: "2024-01-15",
      end_date: "2024-05-15",
      total_students: 35,
      enrolled_students: 35,
      max_capacity: 40
    },
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time_slot: "02:00 PM - 03:30 PM",
      duration: "1.5 hours",
      timezone: "EST"
    },
    progress: {
      total_lessons: 28,
      completed_lessons: 28,
      completion_percentage: 100,
      total_assignments: 10,
      graded_assignments: 10
    },
    status: "completed",
    category: "Computer Science",
    difficulty_level: "intermediate",
    rating: 4.7,
    reviews_count: 124,
    last_activity: "2024-05-15"
  },
  {
    course_id: "AI401",
    course_title: "Introduction to Artificial Intelligence",
    course_code: "AI-401-W25",
    course_image: "/course-images/ai401.jpg",
    instructor_name: "Dr. Sarah Johnson",
    instructor_id: "inst_001",
    course_type: "live",
    batch_info: {
      batch_id: "B004",
      batch_name: "Winter 2025 - Upcoming",
      batch_code: "AI401-W25-M",
      start_date: "2025-01-20",
      end_date: "2025-05-20",
      total_students: 0,
      enrolled_students: 0,
      max_capacity: 25
    },
    schedule: {
      days: ["Tuesday", "Thursday"],
      time_slot: "10:00 AM - 12:00 PM",
      duration: "2 hours",
      timezone: "EST"
    },
    progress: {
      total_lessons: 30,
      completed_lessons: 0,
      completion_percentage: 0,
      total_assignments: 15,
      graded_assignments: 0
    },
    status: "upcoming",
    category: "Artificial Intelligence",
    difficulty_level: "advanced",
    rating: 0,
    reviews_count: 0,
    last_activity: "2025-01-20"
  }
];

// Utility functions
const getStatusColor = (status: string): string => {
  const statusColors = {
    active: 'text-green-600 bg-green-50 border-green-200',
    completed: 'text-blue-600 bg-blue-50 border-blue-200',
    upcoming: 'text-orange-600 bg-orange-50 border-orange-200',
    suspended: 'text-red-600 bg-red-50 border-red-200'
  };
  return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getCourseTypeColor = (type: string): string => {
  const typeColors = {
    live: 'text-purple-600 bg-purple-50 border-purple-200',
    blended: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    selfPaced: 'text-teal-600 bg-teal-50 border-teal-200'
  };
  return typeColors[type as keyof typeof typeColors] || 'text-gray-600 bg-gray-50 border-gray-200';
};

// API fetching functions with better error handling for real data
const fetchInstructorCourses = async (instructorId: string): Promise<any[]> => {
  console.log('🔍 Fetching instructor courses for ID:', instructorId);
  
  try {
    const url = `${apiBaseUrl}${apiUrls.Instructor.getInstructorCourses(instructorId)}`;
    console.log('📡 API URL:', url);
    
    const token = localStorage.getItem('token');
    console.log('🔑 Token exists:', !!token);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data.courses || data.data || data || [];
    }
    
    // For 404, try alternative approach
    if (response.status === 404) {
      console.warn('⚠️ Primary endpoint not found (404), trying alternative...');
      return await fetchInstructorCoursesAlternative(instructorId);
    }
    
    // For other errors, try to read the error message
    const errorText = await response.text();
    console.error('❌ API Error:', response.status, errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  } catch (error) {
    console.error('💥 Fetch error:', error);
    
    // Try alternative method if network or parsing error
    if (error.message.includes('404') || error.message.includes('fetch') || error.message.includes('JSON')) {
      console.warn('🔄 Trying alternative API approach...');
      try {
        return await fetchInstructorCoursesAlternative(instructorId);
      } catch (altError) {
        console.error('💥 Alternative method failed:', altError);
        // Only throw if we really can't get data
        throw new Error(`All API methods failed. Primary: ${error.message}, Alternative: ${altError.message}`);
      }
    }
    
    throw error;
  }
};

// Enhanced alternative method
const fetchInstructorCoursesAlternative = async (instructorId: string): Promise<any[]> => {
  console.log('🔄 Using alternative method for instructor:', instructorId);
  
  try {
    const token = localStorage.getItem('token');
    
    // Method 1: Try instructor assignments
    const assignmentsUrl = `${apiBaseUrl}${apiUrls.Instructor.getAllInstructorAssignments}`;
    console.log('📡 Trying assignments URL:', assignmentsUrl);
    
    const assignmentsResponse = await fetch(assignmentsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (assignmentsResponse.ok) {
      const assignmentsData = await assignmentsResponse.json();
      console.log('✅ Assignments data:', assignmentsData);
      
      const assignments = assignmentsData.assignments || assignmentsData.data || assignmentsData || [];
      
      if (Array.isArray(assignments) && assignments.length > 0) {
        const instructorAssignments = assignments.filter((assignment: any) => {
          const userId = assignment.user_id?._id || assignment.user_id || assignment.instructor_id;
          return userId === instructorId;
        });

        console.log('📋 Filtered assignments for instructor:', instructorAssignments);

        if (instructorAssignments.length > 0) {
          const courses = instructorAssignments.map((assignment: any) => ({
            _id: assignment._id || assignment.course_id || `course_${Date.now()}`,
            course_title: assignment.course_title || assignment.title || 'Untitled Course',
            course_code: assignment.course_code || assignment.course_title?.replace(/\s+/g, '').substring(0, 10).toUpperCase() || 'COURSE',
            assigned_instructor: {
              _id: instructorId,
              full_name: assignment.full_name || assignment.instructor_name || 'Unknown Instructor',
              email: assignment.email || ''
            },
            class_type: assignment.class_type || 'Live Classes',
            status: assignment.status || 'Published',
            course_category: assignment.course_category || 'General',
            course_grade: assignment.course_grade || 'Intermediate',
            sections: assignment.sections || [],
            assignments: assignment.assignments || [],
            createdAt: assignment.createdAt || new Date().toISOString(),
            updatedAt: assignment.updatedAt || new Date().toISOString()
          }));
          
          console.log('✅ Transformed courses from assignments:', courses);
          return courses;
        }
      }
    }

    // Method 2: Try to get all courses and filter
    console.log('🔄 Trying to get all courses and filter...');
    const allCoursesUrl = `${apiBaseUrl}${apiUrls.courses.getAllCourses}`;
    console.log('📡 All courses URL:', allCoursesUrl);
    
    const allCoursesResponse = await fetch(allCoursesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (allCoursesResponse.ok) {
      const coursesData = await allCoursesResponse.json();
      console.log('✅ All courses data:', coursesData);
      
      const allCourses = coursesData.courses || coursesData.data || coursesData || [];
      
      if (Array.isArray(allCourses)) {
        const instructorCourses = allCourses.filter((course: any) => {
          const assignedInstructor = course.assigned_instructor?._id || course.assigned_instructor || course.instructor_id;
          return assignedInstructor === instructorId;
        });
        
        console.log('📋 Filtered courses for instructor:', instructorCourses);
        return instructorCourses;
      }
    }

    console.warn('⚠️ No valid data found in alternative methods');
    return [];
  } catch (error) {
    console.error('💥 Alternative method error:', error);
    return [];
  }
};

const fetchBatchesByInstructor = async (instructorId: string): Promise<any[]> => {
  console.log('🔍 Fetching batches for instructor:', instructorId);
  
  try {
    const url = `${apiBaseUrl}${apiUrls.batches.getBatchesByInstructor(instructorId)}`;
    console.log('📡 Batches URL:', url);
    
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Batches data:', data);
      return data.batches || data.data || data || [];
    }
    
    console.warn('⚠️ Batches endpoint returned:', response.status);
    return [];
  } catch (error) {
    console.warn('⚠️ Batches fetch error:', error);
    return [];
  }
};

const fetchEnrolledStudents = async (courseId: string): Promise<any[]> => {
  try {
    const url = `${apiBaseUrl}${apiUrls.enrolledCourses.getEnrolledStudentsByCourse(courseId)}`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.students || data.data || data || [];
    }
    
    return [];
  } catch (error) {
    console.warn('⚠️ Enrolled students fetch error:', error);
    return [];
  }
};

// Memoized Course Card Component
const CourseCard = memo<{ course: ICourse }>(({ course }) => (
  <motion.div
    variants={ANIMATION_VARIANTS.item}
    whileHover={{ y: -2 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg"
  >
    {/* Course Header */}
    <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCourseTypeColor(course.course_type)}`}>
              {course.course_type === 'live' && <Video className="w-3 h-3 mr-1" />}
              {course.course_type === 'blended' && <BookOpen className="w-3 h-3 mr-1" />}
              {course.course_type === 'selfPaced' && <Clock className="w-3 h-3 mr-1" />}
              {course.course_type.charAt(0).toUpperCase() + course.course_type.slice(1)}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
              {course.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
              {course.status === 'completed' && <Award className="w-3 h-3 mr-1" />}
              {course.status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
              {course.status === 'suspended' && <AlertCircle className="w-3 h-3 mr-1" />}
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-white/90 text-xs font-medium">{course.course_code}</div>
            {course.rating > 0 && (
              <div className="flex items-center mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-white/90 text-xs ml-1">{course.rating}</span>
                <span className="text-white/70 text-xs ml-1">({course.reviews_count})</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{course.course_title}</h3>
          <p className="text-white/80 text-xs">{course.category}</p>
        </div>
      </div>
    </div>

    {/* Course Content */}
    <div className="p-4">
      {/* Batch Information */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <Users className="w-4 h-4 mr-2 text-indigo-500" />
          Batch Information
        </h4>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Batch Name:</span>
            <span className="text-xs text-gray-900 dark:text-white">{course.batch_info.batch_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Students:</span>
            <span className="text-xs text-gray-900 dark:text-white">
              {course.batch_info.enrolled_students} / {course.batch_info.max_capacity}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Duration:</span>
            <span className="text-xs text-gray-900 dark:text-white">
              {new Date(course.batch_info.start_date).toLocaleDateString()} - {new Date(course.batch_info.end_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
          Schedule
        </h4>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Days:</span>
            <span className="text-xs text-gray-900 dark:text-white">{course.schedule.days.join(", ")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Time:</span>
            <span className="text-xs text-gray-900 dark:text-white">{course.schedule.time_slot}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Duration:</span>
            <span className="text-xs text-gray-900 dark:text-white">{course.schedule.duration}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
          Progress
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Lessons Progress</span>
              <span className="text-xs text-gray-900 dark:text-white">
                {course.progress.completed_lessons} / {course.progress.total_lessons}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${course.progress.completion_percentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
              {course.progress.completion_percentage}% Complete
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Assignments Graded:</span>
            <span className="text-xs text-gray-900 dark:text-white">
              {course.progress.graded_assignments} / {course.progress.total_assignments}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm">
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium text-sm">
          <BarChart3 className="w-4 h-4 mr-1" />
          Analytics
        </button>
      </div>
    </div>
  </motion.div>
));

CourseCard.displayName = 'CourseCard';

// Memoized Filter Dropdown Component
const FilterDropdown = memo<{
  name: string;
  value: string;
  options: readonly string[];
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}>(({ name, value, options, icon, isActive, onToggle, onChange }) => (
  <div className="relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
    >
      {icon}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {value === 'all' ? `All ${name}` : value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
      <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
    </button>
    
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-50"
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                onToggle();
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
            >
              {option === 'all' ? `All ${name}` : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

FilterDropdown.displayName = 'FilterDropdown';

// Memoized Loading Component
const LoadingScreen = memo<{ userData: IUserData; onMenuClick: (menuName: string, items: any[]) => void }>(({ userData, onMenuClick }) => (
  <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
    {/* Top Navigation - Fixed position */}
    <div className="fixed top-0 left-0 right-0 z-30">
      <DashboardNavbar 
        userRole={userData.userRole}
        userImage={userData.userImage}
        userName={userData.fullName}
        notifications={userData.userNotifications}
        onToggleSidebar={() => {}}
      />
    </div>

    {/* Main layout with sidebar and content */}
    <div className="flex mt-16 lg:mt-20">
      <div className="sticky top-16 lg:top-20 h-screen flex-shrink-0 bg-white dark:bg-gray-800 transition-all duration-300 shadow-md overflow-hidden w-[68px]">
        <SidebarDashboard
          userRole={userData.userRole}
          fullName={userData.fullName}
          userEmail={userData.userEmail}
          userImage={userData.userImage}
          userNotifications={userData.userNotifications}
          userSettings={userData.userSettings}
          onMenuClick={onMenuClick}
          isOpen={true}
          onOpenChange={() => {}}
          isExpanded={false}
          onExpandedChange={() => {}}
        />
      </div>
      
      <main className="flex-1 overflow-y-auto scroll-smooth" style={{ marginLeft: '10px' }}>
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading courses...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

// Main Component
const AssignedCoursesPage: React.FC = () => {
  const { isMobile } = useScreenSize();
  
  // State management
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<IFilterState>({
    searchTerm: '',
    courseType: 'all',
    status: 'all',
    category: 'all',
    batchStatus: 'all'
  });

  // Get instructor ID for API calls with better fallback logic
  const getInstructorId = useCallback(() => {
    if (typeof window === "undefined") return null;
    
    // Check multiple possible localStorage keys
    const possibleKeys = ['userData', 'user', 'userInfo', 'auth', 'currentUser'];
    let userData = null;
    let storageKey = '';
    
    // Try to find user data in any of the possible keys
    for (const key of possibleKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          userData = JSON.parse(data);
          storageKey = key;
          break;
        } catch (e) {
          console.warn(`Failed to parse ${key} from localStorage:`, e);
        }
      }
    }
    
    // Also check for direct ID keys
    const directIdKeys = ['userId', 'instructorId', 'user_id', 'id'];
    
    if (!userData) {
      for (const key of directIdKeys) {
        const id = localStorage.getItem(key);
        if (id) {
          console.log(`Found instructor ID directly in localStorage.${key}:`, id);
          return id;
        }
      }
    }
    
    if (userData) {
      console.log(`Found user data in localStorage.${storageKey}:`, userData);
      
      // Try different possible ID field names
      const possibleIdFields = ['_id', 'id', 'userId', 'user_id', 'instructorId', 'instructor_id'];
      
      for (const field of possibleIdFields) {
        if (userData[field]) {
          console.log(`Using instructor ID from ${field}:`, userData[field]);
          return userData[field];
        }
      }
      
      // If user has role array, check if instructor role exists
      if (userData.role && Array.isArray(userData.role) && userData.role.includes('instructor')) {
        console.log('User has instructor role, but no ID found in expected fields');
      }
    }
    
    // Log what's available in localStorage for debugging
    console.log('Available localStorage keys:', Object.keys(localStorage));
    console.log('No instructor ID found. Available user data:', userData);
    
    return null;
  }, []);

  // Enhanced user data with better error handling
  const userData = useMemo<IUserData>(() => {
    if (typeof window === "undefined") {
      return {
        userRole: "instructor",
        fullName: "Instructor",
        userEmail: "instructor@medh.edu",
        userImage: "/avatar-placeholder.png",
        userNotifications: 0,
        userSettings: { theme: "light", language: "en", notifications: true }
      };
    }
    
    // Get user data from localStorage with fallback
    const possibleKeys = ['userData', 'user', 'userInfo', 'auth', 'currentUser'];
    let parsedUser = null;
    
    for (const key of possibleKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          parsedUser = JSON.parse(data);
          break;
        } catch (e) {
          console.warn(`Failed to parse ${key}:`, e);
        }
      }
    }
    
    return {
      userRole: "instructor",
      fullName: parsedUser?.full_name || parsedUser?.fullName || parsedUser?.name || "Instructor",
      userEmail: parsedUser?.email || "instructor@medh.edu",
      userImage: parsedUser?.profile_image || parsedUser?.profileImage || parsedUser?.avatar || "/avatar-placeholder.png",
      userNotifications: parsedUser?.notifications || 0,
      userSettings: {
        theme: parsedUser?.settings?.theme || "light",
        language: parsedUser?.settings?.language || "en",
        notifications: parsedUser?.settings?.notifications ?? true
      }
    };
  }, []);

  // Add demo data as fallback - memoized to avoid dependency issues
  const getDemoData = useCallback((): ICourse[] => [
    {
      _id: "demo_1",
      course_title: "Introduction to Computer Science",
      course_code: "CS-101-F24",
      course_image: "/course-placeholder.jpg",
      instructor_name: userData.fullName,
      instructor_id: "demo_instructor",
      course_type: "live",
      batch_info: {
        batch_id: "demo_batch_1",
        batch_name: "Fall 2024 - Morning Batch",
        batch_code: "CS101-F24-M",
        start_date: "2024-09-01",
        end_date: "2024-12-15",
        total_students: 42,
        enrolled_students: 42,
        max_capacity: 50
      },
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        time_slot: "09:00 AM - 10:30 AM",
        duration: "1.5 hours",
        timezone: "EST"
      },
      progress: {
        total_lessons: 24,
        completed_lessons: 18,
        completion_percentage: 75,
        total_assignments: 8,
        graded_assignments: 6
      },
      status: "active",
      category: "Computer Science",
      difficulty_level: "beginner",
      rating: 4.8,
      reviews_count: 156,
      last_activity: "2024-01-15"
    }
  ], [userData.fullName]);

  // State to track if we're in demo mode
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Initialize data with real API calls and fallback to demo data
  useEffect(() => {
    const loadCoursesData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const instructorId = getInstructorId();
        
        if (!instructorId) {
          console.warn("⚠️ No instructor ID found in localStorage");
          console.log("Available localStorage keys:", Object.keys(localStorage));
          
          // Instead of immediately going to demo mode, show error with retry option
          setError("No instructor ID found. Please log in again or contact support.");
          setIsLoading(false);
          return;
        }

        console.log("🚀 Loading courses for instructor ID:", instructorId);
        setIsDemoMode(false);

        // Fetch instructor's assigned courses with detailed logging
        console.log("📚 Step 1: Fetching assigned courses...");
        const assignedCourses = await fetchInstructorCourses(instructorId);
        console.log("📚 Assigned courses result:", assignedCourses);
        
        // Fetch batches for the instructor
        console.log("🎯 Step 2: Fetching instructor batches...");
        const instructorBatches = await fetchBatchesByInstructor(instructorId);
        console.log("🎯 Instructor batches result:", instructorBatches);
        
        // If we have no courses, show appropriate message
        if (!assignedCourses || assignedCourses.length === 0) {
          console.log("📝 No courses found for instructor");
          setCourses([]);
          setIsLoading(false);
          return;
        }

        // Transform API data to match our interface
        console.log("🔄 Step 3: Transforming course data...");
        const transformedCourses: ICourse[] = await Promise.all(
          assignedCourses.map(async (course: any, index: number) => {
            console.log(`🔄 Processing course ${index + 1}:`, course.course_title || course.title);
            
            // Find batches for this course
            const courseBatches = instructorBatches.filter((batch: any) => 
              batch.course_id === course._id || batch.courseId === course._id
            );
            
            console.log(`🎯 Found ${courseBatches.length} batches for course:`, course.course_title);
            
            // Get the primary batch (first one or active one)
            const primaryBatch = courseBatches[0] || {
              _id: `batch_${course._id}`,
              batch_name: `${course.course_title || course.title} - Default Batch`,
              batch_code: `${course.course_code || course._id.slice(-4).toUpperCase()}-B1`,
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              max_capacity: 50,
              enrolled_students: 0,
              total_students: 0
            };

            // Get enrolled students count
            console.log(`👥 Fetching enrolled students for course:`, course._id);
            const enrolledStudents = await fetchEnrolledStudents(course._id);
            primaryBatch.enrolled_students = enrolledStudents.length;
            primaryBatch.total_students = enrolledStudents.length;

            // Transform course data
            const transformedCourse: ICourse = {
              _id: course._id,
              course_title: course.course_title || course.title || 'Untitled Course',
              course_code: course.course_code || `${course._id.slice(-6).toUpperCase()}`,
              course_image: course.course_image || "/course-placeholder.jpg",
              instructor_name: course.assigned_instructor?.full_name || userData.fullName,
              instructor_id: instructorId,
              course_type: course.class_type === 'Live Classes' ? 'live' : 
                          course.class_type === 'Blended Learning' ? 'blended' : 'selfPaced',
              batch_info: {
                batch_id: primaryBatch._id,
                batch_name: primaryBatch.batch_name,
                batch_code: primaryBatch.batch_code,
                start_date: primaryBatch.start_date,
                end_date: primaryBatch.end_date,
                total_students: primaryBatch.total_students,
                enrolled_students: primaryBatch.enrolled_students,
                max_capacity: primaryBatch.max_capacity
              },
              schedule: {
                days: primaryBatch.schedule?.days || ["Monday", "Wednesday", "Friday"],
                time_slot: primaryBatch.schedule?.time_slot || "09:00 AM - 10:30 AM",
                duration: primaryBatch.schedule?.duration || "1.5 hours",
                timezone: primaryBatch.schedule?.timezone || "EST"
              },
              progress: {
                total_lessons: course.sections?.reduce((acc: number, section: any) => 
                  acc + (section.lessons?.length || 0), 0) || 0,
                completed_lessons: 0, // This would need a separate API call to get progress
                completion_percentage: 0,
                total_assignments: course.assignments?.length || 0,
                graded_assignments: 0
              },
              status: course.status === 'Published' ? 'active' : 
                     course.status === 'Completed' ? 'completed' : 
                     course.status === 'Draft' ? 'upcoming' : 'suspended',
              category: course.course_category || "General",
              difficulty_level: course.course_grade === 'Beginner' ? 'beginner' :
                               course.course_grade === 'Intermediate' ? 'intermediate' : 'advanced',
              rating: course.average_rating || 0,
              reviews_count: course.reviews?.length || 0,
              last_activity: course.updatedAt || course.createdAt || new Date().toISOString()
            };

            console.log(`✅ Transformed course:`, transformedCourse.course_title);
            return transformedCourse;
          })
        );

        console.log("✅ All courses transformed successfully:", transformedCourses.length);
        setCourses(transformedCourses);
        
      } catch (err: any) {
        console.error("💥 Error loading courses data:", err);
        
        // Show specific error message instead of falling back to demo
        const errorMessage = err.message || "Failed to load courses";
        setError(`Failed to load instructor courses: ${errorMessage}. Please check your internet connection and try again.`);
        
        // Only use demo data as absolute last resort if user explicitly requests it
        // setIsDemoMode(true);
        // setCourses(getDemoData());
      } finally {
        setIsLoading(false);
      }
    };

    loadCoursesData();
  }, [getInstructorId, userData.fullName]);

  // Add refresh function for retrying API calls
  const refreshCourseData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const instructorId = getInstructorId();
      
      if (!instructorId) {
        console.warn("No instructor ID found during refresh, using demo mode");
        setIsDemoMode(true);
        setCourses(getDemoData());
        setIsLoading(false);
        return;
      }

      setIsDemoMode(false);
      console.log("Refreshing courses for instructor ID:", instructorId);

      // Fetch instructor's assigned courses
      const assignedCourses = await fetchInstructorCourses(instructorId);
      
      // Fetch batches for the instructor
      const instructorBatches = await fetchBatchesByInstructor(instructorId);
      
      // Transform API data to match our interface
      const transformedCourses: ICourse[] = await Promise.all(
        assignedCourses.map(async (course: any) => {
          // Find batches for this course
          const courseBatches = instructorBatches.filter((batch: any) => 
            batch.course_id === course._id
          );
          
          // Get the primary batch (first one or active one)
          const primaryBatch = courseBatches[0] || {
            _id: `batch_${course._id}`,
            batch_name: `${course.course_title} - Default Batch`,
            batch_code: `${course.course_code || course._id.slice(-4).toUpperCase()}-B1`,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            max_capacity: 50,
            enrolled_students: 0,
            total_students: 0
          };

          // Get enrolled students count
          const enrolledStudents = await fetchEnrolledStudents(course._id);
          primaryBatch.enrolled_students = enrolledStudents.length;
          primaryBatch.total_students = enrolledStudents.length;

          // Transform course data
          return {
            _id: course._id,
            course_title: course.course_title,
            course_code: course.course_code || `${course._id.slice(-6).toUpperCase()}`,
            course_image: course.course_image || "/course-placeholder.jpg",
            instructor_name: course.assigned_instructor?.full_name || userData.fullName,
            instructor_id: instructorId,
            course_type: course.class_type === 'Live Classes' ? 'live' : 
                        course.class_type === 'Blended Learning' ? 'blended' : 'selfPaced',
            batch_info: {
              batch_id: primaryBatch._id,
              batch_name: primaryBatch.batch_name,
              batch_code: primaryBatch.batch_code,
              start_date: primaryBatch.start_date,
              end_date: primaryBatch.end_date,
              total_students: primaryBatch.total_students,
              enrolled_students: primaryBatch.enrolled_students,
              max_capacity: primaryBatch.max_capacity
            },
            schedule: {
              days: primaryBatch.schedule?.days || ["Monday", "Wednesday", "Friday"],
              time_slot: primaryBatch.schedule?.time_slot || "09:00 AM - 10:30 AM",
              duration: primaryBatch.schedule?.duration || "1.5 hours",
              timezone: primaryBatch.schedule?.timezone || "EST"
            },
            progress: {
              total_lessons: course.sections?.reduce((acc: number, section: any) => 
                acc + (section.lessons?.length || 0), 0) || 0,
              completed_lessons: 0, // This would need a separate API call to get progress
              completion_percentage: 0,
              total_assignments: course.assignments?.length || 0,
              graded_assignments: 0
            },
            status: course.status === 'Published' ? 'active' : 
                   course.status === 'Completed' ? 'completed' : 
                   course.status === 'Draft' ? 'upcoming' : 'suspended',
            category: course.course_category || "General",
            difficulty_level: course.course_grade === 'Beginner' ? 'beginner' :
                             course.course_grade === 'Intermediate' ? 'intermediate' : 'advanced',
            rating: course.average_rating || 0,
            reviews_count: course.reviews?.length || 0,
            last_activity: course.updatedAt || course.createdAt || new Date().toISOString()
          };
        })
      );

      setCourses(transformedCourses);
    } catch (err: any) {
      console.error("💥 Error refreshing courses data:", err);
      
      // Show specific error message instead of falling back to demo
      const errorMessage = err.message || "Failed to refresh courses";
      setError(`Failed to refresh instructor courses: ${errorMessage}. Please check your internet connection and try again.`);
      
      // Only use demo data as absolute last resort if user explicitly requests it
      // setIsDemoMode(true);
      // setCourses(getDemoData());
    } finally {
      setIsLoading(false);
    }
  }, [getInstructorId, userData.fullName, getDemoData]);

  // Optimized filtering with useMemo
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Search filter
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.course_title.toLowerCase().includes(searchLower) ||
        course.course_code.toLowerCase().includes(searchLower) ||
        course.batch_info.batch_name.toLowerCase().includes(searchLower)
      );
    }

    // Course type filter
    if (filters.courseType !== 'all') {
      filtered = filtered.filter(course => course.course_type === filters.courseType);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(course => course.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    return filtered;
  }, [courses, filters]);

  // Memoized statistics
  const courseStats = useMemo(() => ({
    totalCourses: filteredCourses.length,
    totalStudents: filteredCourses.reduce((acc, course) => acc + course.batch_info.enrolled_students, 0)
  }), [filteredCourses]);

  // Optimized event handlers with useCallback
  const handleFilterChange = useCallback((filterType: keyof IFilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const handleDropdownToggle = useCallback((dropdownName: string) => {
    setActiveDropdown(prev => prev === dropdownName ? null : dropdownName);
  }, []);

  const handleMenuClick = useCallback((menuName: string, items: any[]) => {
    console.log("Menu clicked:", menuName, items);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarExpanded(prev => !prev);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // Close dropdowns when clicking outside - optimized
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  // Error boundary
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          
          {/* Debug Information */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Debug Information:</h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>API Base URL:</strong> {apiBaseUrl}</p>
              <p><strong>Instructor ID:</strong> {getInstructorId() || 'Not found'}</p>
              <p><strong>Token exists:</strong> {!!localStorage.getItem('token') ? 'Yes' : 'No'}</p>
              <p><strong>Primary endpoint:</strong> {apiBaseUrl}{apiUrls.Instructor.getInstructorCourses(getInstructorId() || 'demo')}</p>
              <p><strong>Fallback endpoint:</strong> {apiBaseUrl}{apiUrls.Instructor.getAllInstructorAssignments}</p>
              <p><strong>Available localStorage keys:</strong> {Object.keys(localStorage).join(', ')}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={refreshCourseData}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Retrying...
                </>
              ) : (
                'Retry API Call'
              )}
            </button>
            <button 
              onClick={() => {
                // Load demo data as fallback
                console.log("🎭 User requested demo mode");
                setIsDemoMode(true);
                setCourses(getDemoData());
                setError(null);
              }}
              className="px-6 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors duration-200"
            >
              Use Demo Data
            </button>
            <button 
              onClick={() => window.location.href = '/dashboards/instructor'}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
          
          {/* Troubleshooting Tips */}
          <div className="mt-6 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Troubleshooting Tips:</h3>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Check if the backend server is running on the correct port</li>
              <li>Verify your login session is still valid</li>
              <li>Check if your instructor account has course assignments</li>
              <li>Try refreshing the page or logging out and back in</li>
              <li>Contact your administrator if courses should be assigned but aren't showing</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen userData={userData} onMenuClick={handleMenuClick} />;
  }

  return (
    <motion.div 
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Top Navigation - Fixed position */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <DashboardNavbar 
          userRole={userData.userRole}
          userImage={userData.userImage}
          userName={userData.fullName}
          notifications={userData.userNotifications}
          onToggleSidebar={handleSidebarToggle}
        />
      </div>

      {/* Main layout with sidebar and content */}
      <div className="flex mt-16 lg:mt-20"> {/* Add margin-top to account for fixed navbar */}
        {/* Sidebar */}
        <div
          className={`${
            isMobile
              ? `fixed z-20 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : "sticky"
          } top-16 lg:top-20 h-screen flex-shrink-0 bg-white dark:bg-gray-800 transition-all duration-300 shadow-md overflow-hidden`}
          style={{ 
            width: isMobile ? (isSidebarOpen ? '280px' : '0px') : (isSidebarExpanded ? '280px' : '68px'),
            height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 80px)',
            transition: 'width 0.3s ease, transform 0.3s ease'
          }}
          onMouseEnter={() => !isMobile && setIsSidebarExpanded(true)}
          onMouseLeave={() => !isMobile && setIsSidebarExpanded(false)}
        >
          <SidebarDashboard
            userRole={userData.userRole}
            fullName={userData.fullName}
            userEmail={userData.userEmail}
            userImage={userData.userImage}
            userNotifications={userData.userNotifications}
            userSettings={userData.userSettings}
            onMenuClick={handleMenuClick}
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            isExpanded={isSidebarExpanded}
            onExpandedChange={setIsSidebarExpanded}
          />
        </div>

        {/* Mobile backdrop overlay */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-y-auto scroll-smooth transition-all duration-300"
          style={{
            marginLeft: isMobile ? '0px' : '10px',
            width: "100%",
            maxWidth: isMobile ? '100%' : (isSidebarExpanded ? 'calc(100% - 290px)' : 'calc(100% - 78px)'),
          }}
        >
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
            {/* Demo Mode Banner */}
            {isDemoMode && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold mr-3">
                      DEMO MODE
                    </div>
                    <div>
                      <p className="text-yellow-800 dark:text-yellow-300 font-medium text-sm">
                        You're viewing demo data
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-400 text-xs">
                        This is sample course data for demonstration purposes. Real instructor assignments will show here when available.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={refreshCourseData}
                    disabled={isLoading}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-xs font-medium"
                  >
                    {isLoading ? 'Loading...' : 'Try Real Data'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Filters Section */}
            <motion.div 
              variants={ANIMATION_VARIANTS.item}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border dark:border-gray-700 p-4 md:p-6 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search courses, codes, or batches..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap gap-3">
                  {/* Course Type Filter */}
                  <FilterDropdown
                    name="Types"
                    value={filters.courseType}
                    options={COURSE_TYPES}
                    icon={<Video className="w-4 h-4 mr-2 text-gray-500" />}
                    isActive={activeDropdown === 'courseType'}
                    onToggle={() => handleDropdownToggle('courseType')}
                    onChange={(value) => handleFilterChange('courseType', value)}
                  />

                  {/* Status Filter */}
                  <FilterDropdown
                    name="Status"
                    value={filters.status}
                    options={COURSE_STATUSES}
                    icon={<CheckCircle className="w-4 h-4 mr-2 text-gray-500" />}
                    isActive={activeDropdown === 'status'}
                    onToggle={() => handleDropdownToggle('status')}
                    onChange={(value) => handleFilterChange('status', value)}
                  />

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => handleViewModeChange('grid')}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange('list')}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Courses Grid */}
            <motion.div 
              variants={ANIMATION_VARIANTS.item}
              className={`grid gap-4 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
            >
              {filteredCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredCourses.length === 0 && !isLoading && (
              <motion.div 
                variants={ANIMATION_VARIANTS.item}
                className="text-center py-12"
              >
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {courses.length === 0 ? 'No Course Assignments Found' : 'No courses match your filters'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {courses.length === 0 
                    ? 'You have not been assigned to any courses yet. Contact your administrator to get course assignments.'
                    : filters.searchTerm || filters.courseType !== 'all' || filters.status !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'No courses match your current filters.'}
                </p>
                {courses.length === 0 && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={refreshCourseData}
                      disabled={isLoading}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Checking for assignments...
                        </>
                      ) : (
                        'Check for Course Assignments'
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        // Show demo data option
                        console.log("🎭 User requested demo mode from empty state");
                        setIsDemoMode(true);
                        setCourses(getDemoData());
                      }}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors duration-200"
                    >
                      View Demo Data
                    </button>
                    <button 
                      onClick={() => window.location.href = '/dashboards/instructor'}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
                
                {/* API Debug Info for Empty State */}
                {courses.length === 0 && !error && (
                  <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left max-w-md mx-auto">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">API Information:</h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <p><strong>Instructor ID:</strong> {getInstructorId() || 'Not found'}</p>
                      <p><strong>API responded:</strong> Successfully (no assignments found)</p>
                      <p><strong>Endpoint checked:</strong> {apiUrls.Instructor.getInstructorCourses(getInstructorId() || 'demo')}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      {isMobile && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSidebarToggle}
          className="fixed z-50 bottom-6 right-6 p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      )}
    </motion.div>
  );
};

export default AssignedCoursesPage; 