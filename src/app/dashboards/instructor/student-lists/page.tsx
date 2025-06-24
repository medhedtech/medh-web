"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageCircle,
  BookOpen,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  GraduationCap,
  BarChart3,
  Download,
  Send
} from "lucide-react";
import Image from "next/image";

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  enrolledDate: string;
  courses: EnrolledCourse[];
  totalProgress: number;
  attendanceRate: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'completed' | 'paused';
  totalAssignments: number;
  completedAssignments: number;
  certificates: number;
}

interface EnrolledCourse {
  id: string;
  title: string;
  image: string;
  progress: number;
  enrolledDate: string;
  status: 'in-progress' | 'completed' | 'not-started';
  lastAccessed: string;
  assignments: number;
  completedAssignments: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const StudentListsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock data - replace with API call
  useEffect(() => {
    const mockData: Student[] = [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "+1 234 567 8901",
        avatar: "https://i.pravatar.cc/150?img=1",
        enrolledDate: "2024-01-15",
        totalProgress: 85,
        attendanceRate: 92,
        lastActive: "2024-01-24T14:30:00Z",
        status: "active",
        totalAssignments: 12,
        completedAssignments: 10,
        certificates: 2,
        courses: [
          {
            id: "1",
            title: "AI & Data Science Fundamentals",
            image: "/images/courses/ai-data-science.jpg",
            progress: 85,
            enrolledDate: "2024-01-15",
            status: "in-progress",
            lastAccessed: "2024-01-24T14:30:00Z",
            assignments: 8,
            completedAssignments: 7
          },
          {
            id: "2",
            title: "Python for Beginners",
            image: "/images/courses/python.jpg",
            progress: 100,
            enrolledDate: "2024-01-10",
            status: "completed",
            lastAccessed: "2024-01-20T10:15:00Z",
            assignments: 4,
            completedAssignments: 4
          }
        ]
      },
      {
        id: "2",
        name: "Bob Smith",
        email: "bob.smith@example.com",
        phone: "+1 234 567 8902",
        avatar: "https://i.pravatar.cc/150?img=2",
        enrolledDate: "2024-01-10",
        totalProgress: 65,
        attendanceRate: 78,
        lastActive: "2024-01-23T09:45:00Z",
        status: "active",
        totalAssignments: 15,
        completedAssignments: 9,
        certificates: 1,
        courses: [
          {
            id: "3",
            title: "Digital Marketing Mastery",
            image: "/images/courses/digital-marketing.jpg",
            progress: 65,
            enrolledDate: "2024-01-10",
            status: "in-progress",
            lastAccessed: "2024-01-23T09:45:00Z",
            assignments: 10,
            completedAssignments: 6
          }
        ]
      },
      {
        id: "3",
        name: "Carol Davis",
        email: "carol.davis@example.com",
        phone: "+1 234 567 8903",
        avatar: "https://i.pravatar.cc/150?img=3",
        enrolledDate: "2024-01-20",
        totalProgress: 30,
        attendanceRate: 95,
        lastActive: "2024-01-24T16:20:00Z",
        status: "active",
        totalAssignments: 8,
        completedAssignments: 2,
        certificates: 0,
        courses: [
          {
            id: "4",
            title: "Full Stack Development",
            image: "/images/courses/full-stack.jpg",
            progress: 30,
            enrolledDate: "2024-01-20",
            status: "in-progress",
            lastAccessed: "2024-01-24T16:20:00Z",
            assignments: 8,
            completedAssignments: 2
          }
        ]
      }
    ];
    setStudents(mockData);
  }, []);

  // Filter and sort functions
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesCourse = courseFilter === "all" || 
                         student.courses.some(course => course.id === courseFilter);
    
    return matchesSearch && matchesStatus && matchesCourse;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name": return a.name.localeCompare(b.name);
      case "progress": return b.totalProgress - a.totalProgress;
      case "attendance": return b.attendanceRate - a.attendanceRate;
      case "enrolled": return new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime();
      default: return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastActive = (date: string) => {
    const now = new Date();
    const lastActive = new Date(date);
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const uniqueCourses = Array.from(
    new Set(students.flatMap(student => student.courses.map(course => course.id)))
  ).map(courseId => {
    const course = students.flatMap(s => s.courses).find(c => c.id === courseId);
    return { id: courseId, title: course?.title || 'Unknown Course' };
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage all enrolled students across your courses
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total: {filteredStudents.length} students
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          { title: "Total Students", value: students.length, icon: Users, color: "blue" },
          { title: "Active Students", value: students.filter(s => s.status === 'active').length, icon: CheckCircle, color: "green" },
          { title: "Avg Progress", value: `${Math.round(students.reduce((acc, s) => acc + s.totalProgress, 0) / students.length)}%`, icon: TrendingUp, color: "purple" },
          { title: "Avg Attendance", value: `${Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length)}%`, icon: Calendar, color: "orange" }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="attendance">Sort by Attendance</option>
            <option value="enrolled">Sort by Enrolled Date</option>
          </select>

          {/* Filter Button */}
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>
      </motion.div>

      {/* Students Grid */}
      <motion.div variants={itemVariants}>
        <AnimatePresence>
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Student Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={student.avatar || `https://i.pravatar.cc/150?img=${student.id}`}
                            width={48}
                            height={48}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {student.name}
                          </h3>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(student.status)}`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Overview */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{student.totalProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.totalProgress)}`}
                          style={{ width: `${student.totalProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{student.attendanceRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Assignments</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.completedAssignments}/{student.totalAssignments}
                        </p>
                      </div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Enrolled Courses ({student.courses.length})</p>
                      <div className="space-y-2">
                        {student.courses.slice(0, 2).map((course) => (
                          <div key={course.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-8 h-8 rounded overflow-hidden">
                              <Image
                                src={course.image || "/images/placeholder.jpg"}
                                width={32}
                                height={32}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {course.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {course.progress}% complete
                              </p>
                            </div>
                          </div>
                        ))}
                        {student.courses.length > 2 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{student.courses.length - 2} more courses
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Last Active */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      Last active: {formatLastActive(student.lastActive)}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl border-t border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        Message
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700"
            >
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Students Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== "all" || courseFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You don't have any students enrolled yet."}
              </p>
              {(searchTerm || statusFilter !== "all" || courseFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCourseFilter("all");
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default StudentListsPage; 