"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Users,
  CalendarClock,
  Play,
  Eye,
  BookOpen,
  Search,
  Filter,
  Timer,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';

// TypeScript interfaces
interface IUpcomingClass {
  id: number;
  title: string;
  course: string;
  instructor: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: "upcoming" | "live" | "ended" | "cancelled";
  meetLink: string;
  description: string;
  participants: number;
  maxParticipants: number;
  courseImage: string;
  type: "Live Session" | "Workshop" | "Webinar" | "Lab Session";
}

interface IClassStats {
  total: number;
  today: number;
  thisWeek: number;
  live: number;
  upcoming: number;
}

/**
 * UpcomingClassesMain - Component that displays the upcoming classes content
 * within the student dashboard layout
 */
const UpcomingClassesMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "today" | "upcoming" | "live" | "ended">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Mock upcoming classes data
  const upcomingClasses = useMemo<IUpcomingClass[]>(() => [
    {
      id: 1,
      title: "Advanced React Patterns",
      course: "Full Stack Development",
      instructor: "Dr. Sarah Johnson",
      date: "2024-04-15",
      time: "14:00",
      duration: 90,
      status: "upcoming",
      meetLink: "https://meet.google.com/abc-def-ghi",
      description: "Deep dive into advanced React patterns including render props, HOCs, and hooks",
      participants: 24,
      maxParticipants: 30,
      courseImage: "/images/courses/react.jpg",
      type: "Live Session"
    },
    {
      id: 2,
      title: "Machine Learning Workshop",
      course: "Data Science with Python",
      instructor: "Prof. Michael Chen",
      date: "2024-04-15",
      time: "16:30",
      duration: 120,
      status: "live",
      meetLink: "https://meet.google.com/xyz-abc-def",
      description: "Hands-on workshop on building ML models with scikit-learn",
      participants: 18,
      maxParticipants: 25,
      courseImage: "/images/courses/ml.jpg",
      type: "Workshop"
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      course: "UI/UX Design Fundamentals",
      instructor: "Emily Rodriguez",
      date: "2024-04-16",
      time: "10:00",
      duration: 60,
      status: "upcoming",
      meetLink: "https://meet.google.com/def-ghi-jkl",
      description: "Learn the fundamental principles of user interface and user experience design",
      participants: 32,
      maxParticipants: 35,
      courseImage: "/images/courses/ux.jpg",
      type: "Webinar"
    },
    {
      id: 4,
      title: "Database Design Lab",
      course: "Database Management Systems",
      instructor: "Dr. James Wilson",
      date: "2024-04-14",
      time: "13:00",
      duration: 75,
      status: "ended",
      meetLink: "https://meet.google.com/ghi-jkl-mno",
      description: "Practical session on designing efficient database schemas",
      participants: 22,
      maxParticipants: 25,
      courseImage: "/images/courses/database.jpg",
      type: "Lab Session"
    },
    {
      id: 5,
      title: "Digital Marketing Strategies",
      course: "Digital Marketing Fundamentals",
      instructor: "Lisa Thompson",
      date: "2024-04-17",
      time: "15:00",
      duration: 90,
      status: "upcoming",
      meetLink: "https://meet.google.com/jkl-mno-pqr",
      description: "Explore modern digital marketing strategies and tools",
      participants: 28,
      maxParticipants: 40,
      courseImage: "/images/courses/marketing.jpg",
      type: "Live Session"
    },
    {
      id: 6,
      title: "Python Fundamentals",
      course: "Programming Basics",
      instructor: "Alex Kumar",
      date: "2024-04-15",
      time: "11:00",
      duration: 60,
      status: "upcoming",
      meetLink: "https://meet.google.com/mno-pqr-stu",
      description: "Introduction to Python programming language basics",
      participants: 35,
      maxParticipants: 40,
      courseImage: "/images/courses/python.jpg",
      type: "Live Session"
    }
  ], []);

  // Class stats
  const classStats = useMemo<IClassStats>(() => {
    const total = upcomingClasses.length;
    const today = upcomingClasses.filter(c => moment(c.date).isSame(moment(), 'day')).length;
    const thisWeek = upcomingClasses.filter(c => moment(c.date).isSame(moment(), 'week')).length;
    const live = upcomingClasses.filter(c => c.status === "live").length;
    const upcoming = upcomingClasses.filter(c => c.status === "upcoming").length;

    return {
      total,
      today,
      thisWeek,
      live,
      upcoming
    };
  }, [upcomingClasses]);

  // Filter classes based on status and search
  const filteredClasses = useMemo(() => {
    let filtered = upcomingClasses;
    
    if (selectedStatus !== "all") {
      if (selectedStatus === "today") {
        filtered = filtered.filter(classItem => moment(classItem.date).isSame(moment(), 'day'));
      } else {
        filtered = filtered.filter(classItem => classItem.status === selectedStatus);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(classItem => 
        classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [upcomingClasses, selectedStatus, searchTerm]);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Clock className="w-4 h-4" />,
          label: "Upcoming"
        };
      case "live":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <Play className="w-4 h-4" />,
          label: "Live"
        };
      case "ended":
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Ended"
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="w-4 h-4" />,
          label: "Cancelled"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <Calendar className="w-4 h-4" />,
          label: "Unknown"
        };
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Live Session":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Workshop":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Webinar":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Lab Session":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Get time until class or status
  const getTimeInfo = (classItem: IUpcomingClass) => {
    const classDateTime = moment(`${classItem.date} ${classItem.time}`, "YYYY-MM-DD HH:mm");
    const now = moment();
    
    if (classItem.status === "live") {
      return { text: "Live Now", color: "text-red-600 dark:text-red-400" };
    }
    
    if (classItem.status === "ended") {
      return { text: "Ended", color: "text-gray-500 dark:text-gray-500" };
    }
    
    const diffMinutes = classDateTime.diff(now, "minutes");
    
    if (diffMinutes < 0) {
      return { text: "Started", color: "text-gray-500 dark:text-gray-500" };
    }
    
    if (diffMinutes < 60) {
      return { text: `Starts in ${diffMinutes}m`, color: "text-amber-600 dark:text-amber-400" };
    }
    
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    
    if (diffHours < 24) {
      return { text: `Starts in ${diffHours}h ${remainingMinutes}m`, color: "text-blue-600 dark:text-blue-400" };
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return { text: `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: "text-gray-600 dark:text-gray-400" };
  };

  // Class Stats Component
  const ClassStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex flex-nowrap items-center justify-between gap-4 sm:gap-6 overflow-x-auto">
        {/* Total Classes */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.total}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">Total Classes</div>
        </div>

        {/* Today */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.today}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Today</div>
        </div>

        {/* Live */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-3xl sm:text-4xl font-bold mb-1 text-red-200">{classStats.live}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium uppercase tracking-wide">Live Now</div>
        </div>

        {/* This Week */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.thisWeek}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">This Week</div>
        </div>

        {/* Upcoming */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{classStats.upcoming}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Upcoming</div>
        </div>
      </div>
    </div>
  );

  // Class Card Component
  const ClassCard = ({ classItem }: { classItem: IUpcomingClass }) => {
    const statusInfo = getStatusInfo(classItem.status);
    const timeInfo = getTimeInfo(classItem);
    const isLive = classItem.status === "live";
    const isUpcoming = classItem.status === "upcoming";

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${isLive ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'} hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
                {isLive && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(classItem.type)}`}>
                {classItem.type}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {classItem.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {classItem.course} • {classItem.instructor}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
              {classItem.description}
            </p>
          </div>
        </div>

        {/* Class Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {moment(classItem.date).format("MMM D, YYYY")}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {classItem.time}
          </div>
          <div className="flex items-center">
            <Timer className="w-3 h-3 mr-1" />
            {classItem.duration} minutes
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {classItem.participants}/{classItem.maxParticipants}
          </div>
        </div>

        {/* Time Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <div className="flex items-center">
            <CalendarClock className="w-4 h-4 text-gray-400 mr-2" />
            <span className={`text-sm font-medium ${timeInfo.color}`}>
              {timeInfo.text}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {moment(classItem.date).format("ddd")}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          {isLive && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              <Video className="w-4 h-4 mr-2" />
              Join Live
            </button>
          )}
          {isUpcoming && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
              <Video className="w-4 h-4 mr-2" />
              Join Class
            </button>
          )}
          {classItem.status === "ended" && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Recording
            </button>
          )}
        </div>
      </div>
    );
  };

  // Class Preloader
  const ClassPreloader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!isClient) {
  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <ClassPreloader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Upcoming Classes
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Join your scheduled live sessions and stay engaged with your learning journey
          </p>
        </motion.div>



        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: "All", icon: Calendar },
                { key: "today", label: "Today", icon: CalendarClock },
                { key: "live", label: "Live", icon: Play },
                { key: "upcoming", label: "Upcoming", icon: Clock },
                { key: "ended", label: "Ended", icon: CheckCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key as any)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStatus === key
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No classes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UpcomingClassesMain; 