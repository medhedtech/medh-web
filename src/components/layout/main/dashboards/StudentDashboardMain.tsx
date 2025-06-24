"use client";
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import ProgressOverview from "./ProgressOverview";
import StudentUpcomingClasses from "./StudentUpcomingClasses";
import FreeClasses from "@/components/shared/dashboards/FreeClasses";
import RecentAnnouncements from "@/components/shared/dashboards/RecentAnnouncements";
import { apiUrls } from "@/apis";
import { 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  PlayCircle, 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  BellRing,
  BarChart2,
  LayoutDashboard,
  LineChart,
  TrendingUp,
  Bookmark,
  Youtube,
  FileQuestion,
  Lightbulb,
  Target,
  CheckSquare,
  Clock,
  Trophy,
  Video
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsClient } from "@/utils/hydration";
import { useSearchParams } from "next/navigation";

// Learning Resources component
const LearningResources: React.FC = () => {
  const resources = [
    {
      title: "Study Guides",
      description: "Access comprehensive guides for all courses",
      icon: <FileText className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300",
      link: "/dashboards/student/resources/guides"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video explanations",
      icon: <Youtube className="w-5 h-5 text-red-500" />,
      color: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300",
      link: "/dashboards/student/resources/videos"
    },
    {
      title: "Practice Questions",
      description: "Test your knowledge with practice problems",
      icon: <FileQuestion className="w-5 h-5 text-amber-500" />,
      color: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-300",
      link: "/dashboards/student/resources/practice"
    },
    {
      title: "Learning Tips",
      description: "Improve your study habits and techniques",
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      color: "bg-yellow-100 dark:bg-yellow-900/20",
      textColor: "text-yellow-700 dark:text-yellow-300",
      link: "/dashboards/student/resources/tips"
    }
  ];

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
            <Bookmark className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Resources</h2>
        </div>
          <Link href="/dashboards/student/resources" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
          View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {resources.map((resource, index) => (
          <Link key={index} href={resource.link}>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group">
              <div className={`p-2 rounded-md ${resource.color} mr-3`}>
                  {resource.icon}
                </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{resource.title}</h3>
                <p className={`text-xs ${resource.textColor}`}>{resource.description}</p>
                  </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-all transform group-hover:translate-x-1" />
              </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

// Study Goals component
const StudyGoals: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Get student ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      }
    }
  }, []);

  // Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Use the goals API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/goals/student/${studentId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let fetchedGoals = [];
        if (Array.isArray(data)) {
          fetchedGoals = data;
        } else if (data.data && Array.isArray(data.data.goals)) {
          fetchedGoals = data.data.goals;
        } else {
          fetchedGoals = [];
        }

        // Transform API data to match component structure
        const transformedGoals = fetchedGoals.slice(0, 4).map((goal: any) => ({
          id: goal._id || goal.id,
          title: goal.title,
          deadline: calculateDeadline(goal.deadline),
          progress: goal.progress || 0,
          category: goal.category || 'Goal',
          color: getCategoryColor(goal.category || goal.type)
        }));

        setGoals(transformedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        // Don't show as error, just show empty state
        setError(null);
        setGoals([]); // Clear goals on error
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [studentId]);

  // Helper function to calculate deadline display
  const calculateDeadline = (deadline: string): string => {
    if (!deadline) return 'No deadline';
    
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays < 0) return 'Overdue';
      if (diffDays < 7) return `${diffDays} days left`;
      if (diffDays < 14) return `${Math.ceil(diffDays / 7)} week left`;
      return `${Math.ceil(diffDays / 7)} weeks left`;
    } catch {
      return 'Invalid date';
    }
  };

  // Helper function to get category color
  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'course': 'bg-blue-500',
      'assignment': 'bg-amber-500',
      'exam': 'bg-purple-500',
      'quiz': 'bg-purple-500',
      'project': 'bg-green-500',
      'skill': 'bg-teal-500',
      'career': 'bg-indigo-500',
      'personal': 'bg-pink-500'
    };
    return colors[category?.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="p-5">
      <div className="mb-4">
        {/* Desktop/Tablet Layout - side by side */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Study Goals</h2>
          </div>
          <Link href="/dashboards/student/goals" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-2 whitespace-nowrap">
            <Target className="w-4 h-4" />
            <span>Manage</span>
          </Link>
        </div>

        {/* Mobile Layout - stacked */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Study Goals</h2>
          </div>
          <Link href="/dashboards/student/goals" className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            <span>Manage</span>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"></div>
                  </div>
                  <div className="ml-2 h-3 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-800 dark:text-red-200 font-medium">Unable to load goals</span>
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-800 dark:text-red-200 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        ) : goals.length > 0 ? (
          // Goals list
          goals.map((goal) => (
            <div key={goal.id} className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${goal.color} mr-2`}></div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{goal.category}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {goal.deadline}
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{goal.title}</h3>
              
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${goal.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {goal.progress}%
                </span>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-6 text-center">
            <Target className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">No goals yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Create your first study goal to start tracking your learning progress.
            </p>
            <Link 
              href="/dashboards/student/goals"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              <Trophy className="w-4 h-4" />
              Create Goal
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

// Memoize components to prevent unnecessary re-renders
const MemoizedProgressOverview = memo(ProgressOverview);
const MemoizedStudentUpcomingClasses = memo(StudentUpcomingClasses);
const MemoizedFreeClasses = memo(FreeClasses);
const MemoizedRecentAnnouncements = memo(RecentAnnouncements);
const MemoizedLearningResources = memo(LearningResources);
const MemoizedStudyGoals = memo(StudyGoals);

// Demo Booking Component
const DemoBookingCard: React.FC<{ userName: string; isHighPriority?: boolean }> = ({ userName, isHighPriority = false }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const router = useRouter();

  const timeSlots = [
    { id: 'today-6pm', label: 'Today 6:00 PM', available: true },
    { id: 'tomorrow-11am', label: 'Tomorrow 11:00 AM', available: true },
    { id: 'tomorrow-3pm', label: 'Tomorrow 3:00 PM', available: true },
    { id: 'tomorrow-6pm', label: 'Tomorrow 6:00 PM', available: false },
    { id: 'day-after-11am', label: 'Day After Tomorrow 11:00 AM', available: true },
    { id: 'day-after-3pm', label: 'Day After Tomorrow 3:00 PM', available: true },
  ];

  const handleBookDemo = async () => {
    if (!selectedTimeSlot) return;

    setIsBooking(true);
    try {
      // Comprehensive authentication check with detailed debugging
      const authData = {
        userId: localStorage.getItem('userId'),
        email: localStorage.getItem('email'),
        fullName: localStorage.getItem('fullName'),
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        // Check alternative keys that might be used
        userEmail: localStorage.getItem('userEmail'),
        userName: localStorage.getItem('userName'),
        authToken: localStorage.getItem('authToken')
      };
      
      console.log('Complete localStorage auth check:', authData);
      console.log('All localStorage keys:', Object.keys(localStorage));
      
      // Check if user is authenticated
      const userId = authData.userId;
      const email = authData.email || authData.userEmail;
      const fullName = authData.fullName || authData.userName;
      const token = authData.token || authData.authToken;
      
      console.log('Processed auth data:', {
        userId: userId ? 'present' : 'missing',
        email: email ? 'present' : 'missing',
        fullName: fullName ? 'present' : 'missing',
        token: token ? 'present' : 'missing'
      });
      
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
      
      // Create booking using the real API
      const response = await demoBookingHelpers.createBookingForCurrentUser(selectedTimeSlot);
      
      if (response.success) {
        setIsBooked(true);
        console.log('Demo booking successful:', response.data);
        
        // Show success notification for 4 seconds
        setTimeout(() => {
          setIsBooked(false);
          setSelectedTimeSlot("");
        }, 4000);
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking demo:', error);
      
      // Show more user-friendly error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('log in') || errorMessage.includes('authentication') || errorMessage.includes('token')) {
        alert('Please log in to book a demo class. You will be redirected to the login page.');
        // Redirect to login page
        router.push('/login');
      } else if (errorMessage.includes('Email')) {
        // Special handling for email-related errors
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Demo Booked Successfully!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We'll send you a confirmation email with the meeting link.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            📅 {timeSlots.find(slot => slot.id === selectedTimeSlot)?.label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isHighPriority ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
            <Video className={`w-5 h-5 ${isHighPriority ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Book Your FREE Demo</h2>
            {isHighPriority && (
              <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200 px-2 py-1 rounded-full">
                Recommended for You
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400">LIVE</span>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          👋 Welcome {userName}! Ready to experience MEDH?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Join a 45-minute live demo session with our expert instructors. Get personalized course recommendations and career guidance.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-gray-700 dark:text-gray-300">Live Expert Session</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-gray-700 dark:text-gray-300">Career Guidance</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-gray-700 dark:text-gray-300">Course Roadmap</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-gray-700 dark:text-gray-300">Q&A Session</span>
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Choose Your Time Slot:</h4>
        <div className="grid grid-cols-1 gap-2">
          {timeSlots.slice(0, 4).map((slot) => (
            <button
              key={slot.id}
              onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
              disabled={!slot.available}
              className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                selectedTimeSlot === slot.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : slot.available
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600 text-gray-700 dark:text-gray-300'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{slot.label}</span>
                {!slot.available && <span className="text-xs text-red-500">Full</span>}
                {selectedTimeSlot === slot.id && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Debug Button - Temporary */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
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
            console.log('Debug - Current localStorage auth data:', authData);
            console.log('Debug - All localStorage keys:', Object.keys(localStorage));
            alert(`Auth Status:\nUser ID: ${authData.userId ? 'Present' : 'Missing'}\nEmail: ${authData.email ? 'Present' : 'Missing'}\nName: ${authData.fullName ? 'Present' : 'Missing'}\nToken: ${authData.token ? 'Present' : 'Missing'}\n\nCheck console for full details.`);
          }}
          className="w-full py-2 px-4 mb-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
        >
          🔍 Debug Auth Data
        </button>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookDemo}
        disabled={!selectedTimeSlot || isBooking}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
          selectedTimeSlot && !isBooking
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        {isBooking ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Booking...
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4" />
            Book FREE Demo Class
          </>
        )}
      </button>

      {/* Additional Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        No credit card required • Cancel anytime • 100% Free
      </p>
    </div>
  );
};

const MemoizedDemoBookingCard = memo(DemoBookingCard);

// Animation variants (outside component to prevent recreation)
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

/**
 * StudentDashboardMain - The main dashboard component for students
 * Features: Course cards carousel, greeting, stats, announcements
 */
const StudentDashboardMain: React.FC = () => {
  const [greeting, setGreeting] = useState<string>("Good day");
  const [userName, setUserName] = useState<string>("");
  const [courseCards, setCourseCards] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showDemoBooking, setShowDemoBooking] = useState<boolean>(false);
  const [hasEnrolledCourses, setHasEnrolledCourses] = useState<boolean>(false);

  // State for banner sliding
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  // Use a ref instead of state for pausing to avoid re-renders
  const isPausedRef = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Touch gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const minSwipeDistance = 50; // Minimum distance for a swipe to register
  
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper function to extract first name from full name
  const getFirstName = (fullName: string): string => {
    if (!fullName || fullName.trim() === '') return '';
    
    // Clean the input and split by space
    const cleanName = fullName.trim();
    const nameParts = cleanName.split(/\s+/); // Split by any whitespace
    
    // Get the first part (first name)
    const firstName = nameParts[0];
    
    // Ensure we have a valid first name
    if (firstName && firstName.length > 0) {
      // Clean up the first name - remove any special characters and capitalize properly
      const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, ''); // Remove non-letters
      if (cleanFirstName.length > 0) {
        return cleanFirstName.charAt(0).toUpperCase() + cleanFirstName.slice(1).toLowerCase();
      }
    }
    
    return '';
  };

  // Set greeting based on time of day and get user data
  useEffect(() => {
    if (!isClient) return;
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Get user name from localStorage with multiple fallbacks
    try {
      const storedUserName = localStorage.getItem("userName") || "";
      const storedFullName = localStorage.getItem("fullName") || "";
      const storedName = storedUserName || storedFullName;
      
      console.log('Dashboard name retrieval:', {
        storedUserName,
        storedFullName,
        storedName,
        rawStorageCheck: {
          userName: localStorage.getItem("userName"),
          fullName: localStorage.getItem("fullName"),
          name: localStorage.getItem("name"),
          user_name: localStorage.getItem("user_name"),
          firstName: localStorage.getItem("firstName")
        }
      });
      
      if (storedName && storedName.trim() !== '') {
        const firstName = getFirstName(storedName);
        console.log('Extracted first name:', {
          input: storedName,
          output: firstName,
          isValid: firstName && firstName.length > 0
        });
        
        // Ensure we have a valid first name
        if (firstName && firstName.length > 0) {
          setUserName(firstName);
        } else {
          // Fallback: use the first word of stored name if getFirstName fails
          const fallbackFirstName = storedName.trim().split(/\s+/)[0];
          setUserName(fallbackFirstName || "Student");
        }
      } else {
        setUserName("Student");
      }
    } catch (error) {
      console.error('Error retrieving user name from localStorage:', error);
      setUserName("Student");
    }
    
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setStudentId(storedUserId);
    }

    // Check for demo booking action from URL
    const action = searchParams?.get('action');
    if (action === 'schedule-demo') {
      setShowDemoBooking(true);
      // Clear the URL parameter after detecting it
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isClient, searchParams]);

  // Set up the 3 welcome carousel slides
  useEffect(() => {
    if (!userName) return;

    // Create the 3 welcome slides with welcome messages
    const welcomeSlides = [
      {
        id: 'welcome-slide-1',
        title: `Welcome to MEDH, ${userName}!`,
        subtitle: 'Your Learning Journey Starts Here',
        message: 'Discover world-class courses designed to accelerate your career growth and unlock your potential.',
        color: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
        image: '/backgrounds/welcome-bg-1.jpg',
        isWelcome: true,
        actionText: 'Explore Courses',
        secondaryText: 'Set Learning Goals'
      },
      {
        id: 'welcome-slide-2',
        title: `${greeting}, ${userName}`,
        subtitle: 'Learn at Your Own Pace',
        message: 'Join thousands of learners who have transformed their careers with our expert-led courses and personalized learning paths.',
        color: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
        image: '/backgrounds/welcome-bg-2.jpg',
        isWelcome: true,
        actionText: 'Browse Categories',
        secondaryText: 'View Progress'
      },
      {
        id: 'welcome-slide-3',
        title: 'Ready to Excel?',
        subtitle: 'Build Skills That Matter',
        message: 'Access premium content, live sessions, and industry-recognized certifications to advance your professional journey.',
        color: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
        image: '/backgrounds/welcome-bg-3.jpg',
        isWelcome: true,
        actionText: 'Start Learning',
        secondaryText: 'View Resources'
      }
    ];

    setCourseCards(welcomeSlides);
    setIsNewUser(false);
    setCoursesLoading(false);
  }, [userName, greeting]);

  // Check for enrolled courses
  useEffect(() => {
    const checkEnrolledCourses = async () => {
      if (!studentId) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/enrollments/student/${studentId}`);
        
        if (response.ok) {
          const data = await response.json();
          const enrollments = Array.isArray(data) ? data : data.data?.enrollments || [];
          setHasEnrolledCourses(enrollments.length > 0);
          
          // Show demo booking for users with no enrolled courses or those coming from demo action
          if (enrollments.length === 0) {
            setShowDemoBooking(true);
          }
        }
      } catch (error) {
        console.error('Error checking enrolled courses:', error);
        // Show demo booking by default if we can't check enrollments
        setShowDemoBooking(true);
      }
    };

    checkEnrolledCourses();
  }, [studentId]);

  // Helper function to get course gradient colors (MEDH official theme)
  const getCourseColor = (index: number): string => {
    const colors = [
      'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',         // Indigo to pink
      'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',            // Blue to teal  
      'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500'         // Emerald to lime
    ];
    return colors[index % colors.length];
  };

  // Function to handle course navigation
  const navigateToCourse = useCallback((index: number) => {
    setActiveCourseIndex(index);
  }, []);

  // Auto-slide effect for courses only if we have more than one card
  useEffect(() => {
    if (courseCards.length <= 1) return;
    
    const interval = setInterval(() => {
      // Only advance the slide if not paused
      if (!isPausedRef.current) {
        setActiveCourseIndex((prevIndex) => 
          prevIndex === courseCards.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [courseCards.length]); // Remove isPaused from dependencies
  
  // Pause auto-slide when user is hovering over the carousel
  const pauseAutoSlide = useCallback(() => {
    isPausedRef.current = true;
  }, []);
  
  const resumeAutoSlide = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  // Touch event handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    pauseAutoSlide();
  }, [pauseAutoSlide]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      resumeAutoSlide();
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && courseCards.length > 0) {
      // Swipe left - go to next slide
      setActiveCourseIndex(prev => prev === courseCards.length - 1 ? 0 : prev + 1);
    } else if (isRightSwipe && courseCards.length > 0) {
      // Swipe right - go to previous slide
      setActiveCourseIndex(prev => prev === 0 ? courseCards.length - 1 : prev - 1);
    }
    
    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
    
    // Resume auto-slide after a delay
    setTimeout(() => {
      resumeAutoSlide();
    }, 1000);
  }, [touchStart, touchEnd, courseCards.length, minSwipeDistance, resumeAutoSlide]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Dynamic Course Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-xl"
      >
        <div className="relative w-full h-auto">
          {/* Course Cards Carousel */}
          <div 
            ref={sliderRef}
            className="relative overflow-hidden touch-pan-x"
            onMouseEnter={pauseAutoSlide}
            onMouseLeave={resumeAutoSlide}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-x' }}
          >
            {courseCards.length === 0 ? (
              // Fallback when no courses are available
              <div className="relative w-full flex-shrink-0 bg-gradient-to-br from-slate-600 via-blue-600 to-indigo-600 dark:from-slate-700 dark:via-blue-700 dark:to-indigo-700 overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[380px]">
                <div className="absolute inset-0 bg-[url('/backgrounds/grid-pattern.svg')] opacity-10"></div>
                <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-16 relative z-10 h-full flex items-center">
                  <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-4 md:gap-6 w-full max-w-[1200px] mx-auto">
                    <div className="text-center md:text-left space-y-3 sm:space-y-4">
                      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight"
                        style={{ 
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          wordWrap: 'break-word',
                          overflowWrap: 'anywhere'
                        }}>
                        {greeting}, {userName}
                      </h1>
                      <p className="text-white/95 text-xs sm:text-sm md:text-base max-w-2xl mx-auto md:mx-0 leading-relaxed"
                        style={{ 
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          wordWrap: 'break-word',
                          overflowWrap: 'anywhere'
                        }}>
                        Welcome to your learning dashboard. Track your progress, manage your courses, and stay updated.
                      </p>
                      <div className="mt-4 flex justify-center md:justify-start">
                        <Link 
                          href="/courses" 
                          className="bg-white/20 hover:bg-white/30 active:bg-white/40 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center transition-colors text-xs sm:text-sm font-medium backdrop-blur-sm shadow-sm min-h-[44px]"
                          style={{ touchAction: 'manipulation' }}
                        >
                          <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span>Browse Courses</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="flex transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${activeCourseIndex * 100}%)` }}
              >
                {courseCards.map((course, index) => (
                  <div 
                    key={course.id}
                    className={`relative w-full flex-shrink-0 ${course.color} overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[380px] transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  >
                    {/* Course background image with overlay */}
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0">
                      {/* Background */}
                      <div 
                        className="w-full h-full bg-center bg-cover bg-no-repeat opacity-30"
                        style={{ 
                          backgroundImage: `url('${course.image || '/backgrounds/course-placeholder.jpg'}')`,
                        }}
                      ></div>
                      <div className="w-full h-full bg-[url('/backgrounds/grid-pattern.svg')] opacity-10 absolute inset-0"></div>
                    </div>
                    
                    <div className="relative z-10 w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-16 h-full flex items-center transition-all duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-full w-full max-w-[1200px] mx-auto">
                        {/* Left side - Welcome information */}
                        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
                          {/* Welcome badge */}
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                              Welcome to MEDH
                            </span>
                            <span className="text-xs text-white/90">
                              Learning Platform
                            </span>
                          </div>
                        
                          {/* Main welcome title */}
                          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white transition-all duration-300 text-center sm:text-left leading-tight" 
                            style={{ 
                              wordWrap: 'break-word', 
                              overflowWrap: 'anywhere', 
                              lineHeight: '1.2',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                            {course.title}
                          </h1>

                          {/* Subtitle */}
                          {course.subtitle && (
                            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white/90 text-center sm:text-left"
                              style={{ 
                                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                              }}>
                              {course.subtitle}
                            </h2>
                          )}
                          
                          {/* Welcome message */}
                          <div className="text-white/95 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl text-center sm:text-left mx-auto sm:mx-0" 
                            style={{ 
                              wordWrap: 'break-word', 
                              overflowWrap: 'anywhere', 
                              lineHeight: '1.5',
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                            }}>
                            {course.message}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-4">
                            {/* Welcome slide buttons - customized for each slide */}
                            <Link 
                              href={course.id === 'welcome-slide-1' ? "/courses" : 
                                    course.id === 'welcome-slide-2' ? "/courses" : 
                                    "/courses"}
                              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center transition-colors font-medium text-xs sm:text-sm backdrop-blur-sm shadow-sm w-full sm:w-auto min-h-[44px]"
                            >
                              <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{course.actionText || 'Explore Courses'}</span>
                            </Link>
                            
                            <Link 
                              href={course.id === 'welcome-slide-1' ? "/dashboards/student/goals" : 
                                    course.id === 'welcome-slide-2' ? "/dashboards/student" : 
                                    "/dashboards/student/resources"}
                              className="border border-white/30 hover:bg-white/10 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center transition-colors text-xs sm:text-sm backdrop-blur-sm w-full sm:w-auto min-h-[44px]"
                            >
                              {course.id === 'welcome-slide-1' ? <Target className="mr-2 h-4 w-4 flex-shrink-0" /> : 
                               course.id === 'welcome-slide-2' ? <BarChart2 className="mr-2 h-4 w-4 flex-shrink-0" /> : 
                               <FileText className="mr-2 h-4 w-4 flex-shrink-0" />}
                              <span className="truncate">{course.secondaryText || 'Get Started'}</span>
                            </Link>
                          </div>
                        </div>
                        
                        {/* Right side - Welcome Features Card */}
                        <div className="lg:col-span-1 flex flex-col justify-center mt-4 lg:mt-0">
                          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 transition-all duration-300 shadow-lg">
                            <h3 className="text-white text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center">
                              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" /> 
                              <span className="truncate">Why Choose MEDH?</span>
                            </h3>
                            
                            <div className="space-y-2 sm:space-y-3">
                              {/* Feature highlights based on slide */}
                              <div className="space-y-1 sm:space-y-2">
                                {course.id === 'welcome-slide-1' && (
                                  <>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-green-400" /> 
                                      <span className="truncate">Expert-led courses</span>
                                    </div>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-green-400" /> 
                                      <span className="truncate">Industry certifications</span>
                                    </div>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-green-400" /> 
                                      <span className="truncate">Career growth focus</span>
                                    </div>
                                  </>
                                )}
                                
                                {course.id === 'welcome-slide-2' && (
                                  <>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-blue-400" /> 
                                      <span className="truncate">Self-paced learning</span>
                                    </div>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-blue-400" /> 
                                      <span className="truncate">24/7 access</span>
                                    </div>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-blue-400" /> 
                                      <span className="truncate">Mobile-friendly</span>
                                    </div>
                                  </>
                                )}
                                
                                {course.id === 'welcome-slide-3' && (
                                  <>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-emerald-400" /> 
                                      <span className="truncate">Live sessions available</span>
                                    </div>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-emerald-400" /> 
                                      <span className="truncate">Premium content</span>
                                    </div>
                                    <div className="flex items-center text-white/90 text-xs sm:text-sm">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 text-emerald-400" /> 
                                      <span className="truncate">Job assistance</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Navigation elements - Only show if we have courses */}
            {courseCards.length > 0 && (
              <>
                {/* Navigation arrows - Optimized for mobile touch targets */}
                <button 
                  onClick={() => navigateToCourse(activeCourseIndex === 0 ? courseCards.length - 1 : activeCourseIndex - 1)}
                  className="hidden sm:block absolute left-1 sm:left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 active:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md z-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Previous course"
                  style={{ touchAction: 'manipulation' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => navigateToCourse(activeCourseIndex === courseCards.length - 1 ? 0 : activeCourseIndex + 1)}
                  className="hidden sm:block absolute right-1 sm:right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 active:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md z-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Next course"
                  style={{ touchAction: 'manipulation' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Navigation capsules - Optimized for mobile touch */}
                <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-1">
                  {courseCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToCourse(index)}
                      className={`transition-all duration-300 rounded-full min-w-[24px] min-h-[4px] ${
                        activeCourseIndex === index 
                          ? 'w-6 h-1 bg-white scale-110' 
                          : 'w-3 h-1 bg-white/40 hover:bg-white/60 active:bg-white/80'
                      } focus:outline-none focus:ring-1 focus:ring-white/50`}
                      aria-label={`Go to slide ${index + 1}`}
                      style={{ touchAction: 'manipulation' }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Dashboard content */}
      <div className="w-full py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left column - 8/12 width on desktop */}
          <div className="lg:col-span-8 grid grid-cols-1 gap-6 sm:gap-8">
            {/* Demo Booking Section - High Priority */}
            {showDemoBooking && (
              <motion.section 
                variants={itemVariants}
                className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border-2 border-green-200 dark:border-green-800"
              >
                <MemoizedDemoBookingCard 
                  userName={userName} 
                  isHighPriority={!hasEnrolledCourses} 
                />
              </motion.section>
            )}

            {/* Quick Actions Section */}
            <QuickActionCard courseCards={courseCards} />
            
            {/* Progress Overview */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <MemoizedProgressOverview />
            </motion.section>
          
            {/* Live Sessions Section */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <MemoizedStudentUpcomingClasses />
            </motion.section>

            {/* Study Goals Section */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <MemoizedStudyGoals />
            </motion.section>
          </div>
          
          {/* Right column - 4/12 width on desktop */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Recent Announcements Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <MemoizedRecentAnnouncements 
                limit={5} 
                showViewAll={true}
                onViewAllClick={() => console.log("Navigate to all announcements page")}
              />
              </div>
            </motion.div>
            
            {/* Weekly Activity Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <WeeklyActivityChart />
            </motion.div>
            
            {/* Free Courses Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Free Courses</h2>
                  </div>
                  <Link href="/courses?category=free" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <MemoizedFreeClasses />
              </div>
            </motion.div>
            
            {/* Learning Resources Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <MemoizedLearningResources />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Activity Chart component - Memoized
const WeeklyActivityChart = memo(() => {
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weekly activity data
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setLoading(false);
          return;
        }
        
        // Get date range for current week
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);
        
        const apiUrl = apiUrls.analytics.getStudentWeeklyActivity(userId, {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        });
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let fetchedActivity = [];
        if (Array.isArray(data)) {
          fetchedActivity = data;
        } else if (data.data && Array.isArray(data.data.activity)) {
          fetchedActivity = data.data.activity;
        } else {
          fetchedActivity = [];
        }

        // Transform API data to match component structure
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const transformedData = days.map((day, index) => {
          const dayData = fetchedActivity.find((item: any) => 
            item.day === day || item.dayOfWeek === index + 1
          ) || {};
          
          return {
            day,
            hours: dayData.studyHours || dayData.hours || 0,
            complete: dayData.completedActivities || dayData.complete || 0
          };
        });

        setActivityData(transformedData);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        // Don't show as error, just show empty state
        setError(null);
        setActivityData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

    return (
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <LineChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Activity</h2>
          </div>
          <Link href="/dashboards/student/progress" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
            View Details <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Chart */}
        <div className="mb-4">
          {loading ? (
            // Loading skeleton
            <div className="space-y-2.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={index} className="flex items-center animate-pulse">
                  <span className="w-9 text-sm font-medium text-gray-500 dark:text-gray-400">{day}</span>
                  <div className="flex-1 ml-2">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  </div>
                  <div className="ml-2 w-10 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <LineChart className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-800 dark:text-red-200 font-medium">Unable to load activity data</span>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          ) : activityData.length > 0 ? (
            // Activity chart
            <div className="space-y-2.5">
              {activityData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-9 text-sm font-medium text-gray-500 dark:text-gray-400">{item.day}</span>
                  <div className="flex-1 ml-2">
                    <div className="h-7 flex items-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                      <div 
                        className="h-full bg-blue-100 dark:bg-blue-900/30 flex items-center transition-all duration-300"
                        style={{ width: `${Math.min(100, (item.hours || 0) * 20)}%` }}
                      >
                        <div 
                          className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                          style={{ width: `${Math.min(100, (item.complete || 0) * 15)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-10 text-right">
                    {(item.hours || 0).toFixed(1)}h
                  </span>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-6 text-center">
              <LineChart className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">No activities yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your learning activities will appear here once you start taking courses.
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-sm mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Completed Activities</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded-sm mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Study Hours</span>
          </div>
        </div>
      </div>
    );
});

// Quick action component - Memoized
const QuickActionCard = memo(({ courseCards }: { courseCards: any[] }) => {
  const mostRecentCourse = courseCards.length > 0 ? courseCards[0] : null;
  
  return (
    <motion.div
      variants={itemVariants}
      className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <LayoutDashboard className="w-5 h-5 mr-2 text-primary-500" />
            Quick Actions
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Continue Learning */}
          <Link href={mostRecentCourse ? `/course/${mostRecentCourse.id}` : "/courses"} passHref>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors cursor-pointer group">
              <div className="bg-primary-500 rounded-full p-2 text-white">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-primary-900 dark:text-primary-100">Continue Learning</h3>
                <p className="text-sm text-primary-700 dark:text-primary-300 line-clamp-1">
                  {mostRecentCourse?.title || "Browse courses"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-primary-500 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
          
          {/* Join Next Class */}
          <Link href="/dashboards/student/join-live" passHref>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer group">
              <div className="bg-blue-500 rounded-full p-2 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Join Next Class</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Today's sessions</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-500 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
          
          {/* View Assignments */}
          <Link href="/dashboards/student/assignments" passHref>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer group">
              <div className="bg-amber-500 rounded-full p-2 text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-900 dark:text-amber-100">Assignments</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">View pending work</p>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
          
          {/* Check Progress */}
          <Link href="/dashboards/student/progress" passHref>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer group">
              <div className="bg-green-500 rounded-full p-2 text-white">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-900 dark:text-green-100">My Progress</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Track your learning</p>
              </div>
              <ArrowRight className="w-4 h-4 text-green-500 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

export default StudentDashboardMain; 