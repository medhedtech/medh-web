"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  CalendarDays,
  MapPin,
  BookOpen,
  Plus,
  CalendarPlus,
  UserPlus,
  Target,
  BookOpenCheck
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Types
interface DemoClass {
  id: string;
  courseTitle: string;
  courseImage: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'in-progress';
  platform: 'zoom' | 'meet' | 'teams';
  topics: string[];
  meetingLink?: string;
  studentInterests?: string[];
  experience?: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
}

// Demo Booking Component for Instructors
const InstructorDemoBookingCard: React.FC<{ instructorName: string; onBookingSuccess?: () => void }> = ({ 
  instructorName, 
  onBookingSuccess 
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const router = useRouter();

  const timeSlots = [
    { id: 'today-10am', label: 'Today 10:00 AM', available: true },
    { id: 'today-2pm', label: 'Today 2:00 PM', available: true },
    { id: 'tomorrow-9am', label: 'Tomorrow 9:00 AM', available: true },
    { id: 'tomorrow-11am', label: 'Tomorrow 11:00 AM', available: false },
    { id: 'tomorrow-3pm', label: 'Tomorrow 3:00 PM', available: true },
    { id: 'day-after-10am', label: 'Day After Tomorrow 10:00 AM', available: true },
  ];

  const handleBookDemo = async () => {
    if (!selectedTimeSlot) return;

    setIsBooking(true);
    try {
      // Comprehensive authentication check
      const authData = {
        userId: localStorage.getItem('userId'),
        email: localStorage.getItem('email'),
        fullName: localStorage.getItem('fullName'),
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        userEmail: localStorage.getItem('userEmail'),
        userName: localStorage.getItem('userName'),
        authToken: localStorage.getItem('authToken')
      };
      
      console.log('Instructor demo booking auth check:', authData);
      
      // Check if user is authenticated
      const userId = authData.userId;
      const email = authData.email || authData.userEmail;
      const fullName = authData.fullName || authData.userName;
      const token = authData.token || authData.authToken;
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      
      if (!email) {
        throw new Error('Email not found. Please log in again.');
      }
      
      if (!fullName) {
        throw new Error('Name not found. Please log in again.');
      }
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Import the API helper dynamically to avoid SSR issues
      const { demoBookingHelpers } = await import('@/apis');
      
      // Create instructor demo booking
      const response = await demoBookingHelpers.createBookingForCurrentUser(selectedTimeSlot, {
        courseInterest: 'Instructor Demo Session',
        demoType: 'instructor_demo',
        experienceLevel: 'advanced',
        requirements: 'Instructor-led demo session for new students',
        source: 'instructor_dashboard',
        timezone: 'UTC',
        autoGenerateZoomMeeting: true,
        zoomMeetingSettings: {
          duration: 45,
          auto_recording: 'cloud',
          waiting_room: true,
          host_video: true,
          participant_video: true,
          mute_upon_entry: false,
          join_before_host: true,
          meeting_authentication: false,
          registrants_confirmation_email: true,
          registrants_email_notification: true
        }
      });
      
      if (response.success) {
        setBookingResult(response.data);
        setIsBooked(true);
        console.log('Instructor demo booking successful:', response.data);
        
        // Refresh data immediately after successful booking
        if (onBookingSuccess) {
          onBookingSuccess();
        }
        
        // Show success notification for 6 seconds
        setTimeout(() => {
          setIsBooked(false);
          setSelectedTimeSlot("");
          setBookingResult(null);
        }, 6000);
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking instructor demo:', error);
      
      // Show more user-friendly error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('log in') || errorMessage.includes('authentication') || errorMessage.includes('token')) {
        alert('Please log in to book a demo session. You will be redirected to the login page.');
        router.push('/login');
      } else if (errorMessage.includes('Email')) {
        const userConfirm = confirm(
          'Your email information is missing. This might happen if you logged in through a different method.\n\n' +
          'Would you like to:\n' +
          '• Click OK to go to login page and log in again\n' +
          '• Click Cancel to try refreshing the page'
        );
        
        if (userConfirm) {
          router.push('/login');
        } else {
          window.location.reload();
        }
      } else {
        alert(`Booking failed: ${errorMessage}`);
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (isBooked) {
    return (
      <div className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Demo Session Scheduled Successfully!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Your demo session has been created. Students can now book this slot through the platform.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            📅 {timeSlots.find(slot => slot.id === selectedTimeSlot)?.label}
          </p>
          {bookingResult?.booking?.meetingLink && (
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              📹 Meeting link: {bookingResult.booking.meetingLink}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <CalendarPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Schedule Demo Session</h2>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 px-2 py-1 rounded-full">
              Instructor Portal
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <span className="ml-2 text-xs font-medium text-blue-600 dark:text-blue-400">INSTRUCTOR</span>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          👨‍🏫 Welcome {instructorName}! Create a Demo Session
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Schedule a demo session slot that students can book. Set up interactive sessions to showcase your course content and engage with prospective students.
        </p>
      </div>

      {/* Benefits for Instructors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700 dark:text-gray-300">Lead Generation</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700 dark:text-gray-300">Course Showcase</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700 dark:text-gray-300">Student Interaction</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700 dark:text-gray-300">Auto Zoom Setup</span>
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Choose Available Time Slot:</h4>
        <div className="grid grid-cols-1 gap-2">
          {timeSlots.slice(0, 4).map((slot) => (
            <button
              key={slot.id}
              onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
              disabled={!slot.available}
              className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                selectedTimeSlot === slot.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : slot.available
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{slot.label}</span>
                {!slot.available && <span className="text-xs text-red-500">Booked</span>}
                {selectedTimeSlot === slot.id && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Create Session Button */}
      <button
        onClick={handleBookDemo}
        disabled={!selectedTimeSlot || isBooking}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
          selectedTimeSlot && !isBooking
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        {isBooking ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating Session...
          </>
        ) : (
          <>
            <CalendarPlus className="w-4 h-4" />
            Create Demo Session
          </>
        )}
      </button>

      {/* Additional Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        Session will be visible to students • Auto Zoom meeting creation • 45 min duration
      </p>
    </div>
  );
};

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

const DemoClassesPage: React.FC = () => {
  const [demoClasses, setDemoClasses] = useState<DemoClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showBookingCard, setShowBookingCard] = useState<boolean>(false);
  const [instructorName, setInstructorName] = useState<string>("Instructor");

  // Get instructor name from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName") || localStorage.getItem("fullName") || "";
      if (storedUserName) {
        const firstName = storedUserName.split(' ')[0];
        setInstructorName(firstName || "Instructor");
      }
    }
  }, []);

  // Mock data - replace with API call
  useEffect(() => {
    const mockData: DemoClass[] = [
      {
        id: "1",
        courseTitle: "AI & Data Science Fundamentals",
        courseImage: "/images/courses/ai-data-science.jpg",
        studentName: "Alice Johnson",
        studentEmail: "alice@example.com",
        studentPhone: "+1 234 567 8901",
        scheduledDate: "2024-01-25",
        scheduledTime: "14:00",
        duration: 45,
        status: "upcoming",
        platform: "zoom",
        topics: ["Introduction to AI", "Python Basics", "Career Opportunities"],
        meetingLink: "https://zoom.us/j/123456789",
        studentInterests: ["Machine Learning", "Career Change"],
        experience: "beginner",
        notes: "Student is looking for career transition from marketing to tech"
      },
      {
        id: "2",
        courseTitle: "Digital Marketing Mastery",
        courseImage: "/images/courses/digital-marketing.jpg",
        studentName: "Bob Smith",
        studentEmail: "bob@example.com",
        studentPhone: "+1 234 567 8902",
        scheduledDate: "2024-01-24",
        scheduledTime: "16:30",
        duration: 45,
        status: "completed",
        platform: "meet",
        topics: ["SEO Fundamentals", "Social Media Marketing", "Analytics"],
        studentInterests: ["SEO", "Content Marketing"],
        experience: "intermediate",
        notes: "Already has some experience with basic SEO"
      },
      {
        id: "3",
        courseTitle: "Full Stack Development",
        courseImage: "/images/courses/full-stack.jpg",
        studentName: "Carol Davis",
        studentEmail: "carol@example.com",
        studentPhone: "+1 234 567 8903",
        scheduledDate: "2024-01-26",
        scheduledTime: "10:00",
        duration: 60,
        status: "upcoming",
        platform: "teams",
        topics: ["Web Development Overview", "Frontend vs Backend", "Project Showcase"],
        meetingLink: "https://teams.microsoft.com/l/meetup-join/123",
        studentInterests: ["React", "Node.js", "Full Stack"],
        experience: "beginner",
        notes: "CS graduate looking to start web development career"
      }
    ];
    setDemoClasses(mockData);
  }, []);

  // Callback for when booking is successful
  const handleBookingSuccess = useCallback(() => {
    console.log('Demo session created successfully');
    // Here you would typically refresh the demo classes list
    // fetchDemoClasses();
  }, []);

  // Filter functions
  const filteredClasses = demoClasses.filter((demoClass) => {
    const matchesSearch = demoClass.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demoClass.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || demoClass.status === statusFilter;
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "today" && new Date(demoClass.scheduledDate).toDateString() === new Date().toDateString()) ||
                       (dateFilter === "week" && isWithinWeek(demoClass.scheduledDate));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const isWithinWeek = (date: string) => {
    const now = new Date();
    const classDate = new Date(date);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return classDate >= now && classDate <= weekFromNow;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'zoom': return 'bg-blue-500';
      case 'meet': return 'bg-green-500';
      case 'teams': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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
              My Demo Classes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and view your assigned demo class sessions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookingCard(!showBookingCard)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              {showBookingCard ? 'Hide Booking' : 'Schedule Demo'}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total: {filteredClasses.length} classes
            </span>
          </div>
        </div>
      </motion.div>

      {/* Demo Booking Card */}
      <AnimatePresence>
        {showBookingCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <InstructorDemoBookingCard 
                instructorName={instructorName} 
                onBookingSuccess={handleBookingSuccess}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search classes or students..."
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
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>

          {/* Filter Button */}
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Advanced Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Demo Classes Grid */}
      <motion.div variants={itemVariants}>
        <AnimatePresence>
          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClasses.map((demoClass) => (
                <motion.div
                  key={demoClass.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={demoClass.courseImage || "/images/placeholder.jpg"}
                            width={48}
                            height={48}
                            alt={demoClass.courseTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                            {demoClass.courseTitle}
                          </h3>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(demoClass.status)}`}>
                            {getStatusIcon(demoClass.status)}
                            {demoClass.status.charAt(0).toUpperCase() + demoClass.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {demoClass.studentName}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(demoClass.scheduledDate)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatTime(demoClass.scheduledTime)} ({demoClass.duration} min)
                      </div>
                    </div>

                    {/* Platform */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-3 h-3 rounded-full ${getPlatformColor(demoClass.platform)}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {demoClass.platform}
                      </span>
                    </div>

                    {/* Topics */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {demoClass.topics.slice(0, 2).map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md"
                          >
                            {topic}
                          </span>
                        ))}
                        {demoClass.topics.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                            +{demoClass.topics.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl border-t border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {demoClass.status === 'upcoming' && demoClass.meetingLink && (
                        <button 
                          onClick={() => window.open(demoClass.meetingLink, '_blank')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          Join
                        </button>
                      )}
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
              <CalendarDays className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Demo Classes Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You don't have any demo classes assigned yet."}
              </p>
              {(searchTerm || statusFilter !== "all" || dateFilter !== "all") ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setShowBookingCard(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Your First Demo
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DemoClassesPage; 