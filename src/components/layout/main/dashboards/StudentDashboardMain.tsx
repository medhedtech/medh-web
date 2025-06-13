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
  Trophy
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Study Goals</h2>
        </div>
          <Link href="/dashboards/student/goals" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
          Manage <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
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

const StudentDashboardMain: React.FC = () => {
  const [greeting, setGreeting] = useState<string>("Good day");
  const [userName, setUserName] = useState<string>("");
  const [courseCards, setCourseCards] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  // State for banner sliding
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  // Use a ref instead of state for pausing to avoid re-renders
  const isPausedRef = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Set greeting based on time of day and get user data
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Get user name and ID from localStorage
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName") || "";
      setUserName(storedName.split(" ")[0] || "Student"); // Use first name or default to "Student"
      
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      }
    }
  }, []);

  // Set up the 3 MEDH carousel slides
  useEffect(() => {
    if (!userName) return;

    // Create the 3 official MEDH slides
    const medhSlides = [
      {
        id: 'python-fundamentals',
        title: 'Python Programming Fundamentals',
        progress: 65,
        nextLesson: 'Functions and Modules',
        instructor: 'Dr. Alex Morgan',
        image: '/courses/python-course.jpg',
        color: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
        isEnrolled: true,
        completed: 6,
        remaining: 4,
        totalLessons: 10
      },
      {
        id: 'web-development-bootcamp',
        title: 'Web Development Bootcamp', 
        progress: 42,
        nextLesson: 'CSS Flexbox Layout',
        instructor: 'Sarah Wilson',
        image: '/courses/web-dev.jpg',
        color: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
        isEnrolled: true,
        completed: 4,
        remaining: 6,
        totalLessons: 10
      },
      {
        id: 'data-science-essentials',
        title: 'Data Science Essentials',
        progress: 78,
        nextLesson: 'Statistical Analysis', 
        instructor: 'Prof. Michael Chen',
        image: '/courses/data-science.jpg',
        color: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
        isEnrolled: true,
        completed: 7,
        remaining: 3,
        totalLessons: 10
      }
    ];

    setCourseCards(medhSlides);
    setIsNewUser(false);
    setCoursesLoading(false);
  }, [userName]);

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
            className="relative overflow-hidden"
            onMouseEnter={pauseAutoSlide}
            onMouseLeave={resumeAutoSlide}
            onTouchStart={pauseAutoSlide}
            onTouchEnd={resumeAutoSlide}
          >
            {courseCards.length === 0 ? (
              // Fallback when no courses are available
              <div className="relative w-full flex-shrink-0 bg-gradient-to-br from-slate-600 via-blue-600 to-indigo-600 dark:from-slate-700 dark:via-blue-700 dark:to-indigo-700 overflow-hidden min-h-[220px] md:min-h-[260px] lg:min-h-[280px]">
                <div className="absolute inset-0 bg-[url('/backgrounds/grid-pattern.svg')] opacity-10"></div>
                <div className="w-full px-6 py-4 sm:py-6 sm:px-12 lg:px-16 relative z-10 h-full flex items-center">
                  <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-4 md:gap-6 w-full max-w-[1200px] mx-auto">
                    <div className="text-center md:text-left space-y-3">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
                        style={{ 
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          wordWrap: 'break-word',
                          overflowWrap: 'anywhere'
                        }}>
                        {greeting}, {userName}
                      </h1>
                      <p className="text-white/95 text-sm sm:text-base max-w-2xl mx-auto md:mx-0 leading-relaxed"
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
                          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors inline-flex text-sm font-medium backdrop-blur-sm shadow-sm"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Browse Courses
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
                    className={`relative w-full flex-shrink-0 ${course.color} overflow-hidden min-h-[220px] md:min-h-[260px] lg:min-h-[280px] transition-all duration-300`}
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
                    
                    <div className="relative z-10 w-full px-6 py-4 sm:py-6 sm:px-12 lg:px-16 h-full flex items-center transition-all duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full w-full max-w-[1200px] mx-auto">
                        {/* Left side - Course information */}
                        <div className="lg:col-span-2 flex flex-col justify-center space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                              {course.instructor}
                            </span>
                            <span className="text-xs text-white/90">
                              {greeting}, Student
                            </span>
                          </div>
                        
                          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white transition-all duration-300 text-center sm:text-left leading-tight" 
                            style={{ 
                              wordWrap: 'break-word', 
                              overflowWrap: 'anywhere', 
                              lineHeight: '1.2',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                            {course.title}
                          </h1>
                          
                          {/* Progress bar - always show for enrolled courses */}
                          {course.isEnrolled && (
                            <div className="flex flex-col items-center sm:items-start space-y-2">
                              <div className="flex items-center w-full max-w-md">
                                <div className="w-full bg-white/30 rounded-full h-2 backdrop-blur-sm">
                                  <div 
                                    className="bg-white h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-white/95 text-sm font-medium">
                                {course.progress}% complete
                              </span>
                            </div>
                          )}
                          
                          <div className="text-white/95 text-sm leading-relaxed max-w-2xl text-center sm:text-left mx-auto sm:mx-0" 
                            style={{ 
                              wordWrap: 'break-word', 
                              overflowWrap: 'anywhere', 
                              lineHeight: '1.5',
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                            }}>
                            Continue your learning journey with {course.instructor}. Your next lesson covers {course.nextLesson}.
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                            {course.isWelcome ? (
                              // Welcome slide buttons
                              <>
                                <Link 
                                  href="/courses" 
                                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors font-medium text-sm backdrop-blur-sm shadow-sm"
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Explore Courses
                                </Link>
                                
                                <Link 
                                  href="/dashboards/student/goals" 
                                  className="border border-white/30 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm backdrop-blur-sm"
                                >
                                  <Target className="mr-2 h-4 w-4" />
                                  Set Goals
                                </Link>
                              </>
                            ) : course.isEnrolled ? (
                              // Enrolled course buttons
                              <>
                                <Link 
                                  href={`/course/${course.id}`} 
                                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors font-medium text-sm backdrop-blur-sm shadow-sm"
                                >
                                  <PlayCircle className="mr-2 h-4 w-4" />
                                  Continue Learning
                                </Link>
                                
                                <Link 
                                  href={`/course/${course.id}/materials`} 
                                  className="border border-white/30 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm backdrop-blur-sm"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Course Materials
                                </Link>
                              </>
                            ) : (
                              // Non-enrolled course buttons
                              <>
                                <Link 
                                  href={`/course-details/${course.id}`} 
                                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors font-medium text-sm backdrop-blur-sm shadow-sm"
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  View Course
                                </Link>
                                
                                <Link 
                                  href={`/course-details/${course.id}#enroll`} 
                                  className="border border-white/30 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm backdrop-blur-sm"
                                >
                                  <GraduationCap className="mr-2 h-4 w-4" />
                                  {course.price && course.price !== 'Free' ? `Enroll - ${course.price}` : 'Enroll Now'}
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Right side - Next Up Card */}
                        <div className="lg:col-span-1 flex flex-col justify-center mt-3 lg:mt-0">
                          <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all duration-300 shadow-lg">
                            <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
                              <Calendar className="h-4 w-4 mr-2" /> 
                              Next Up
                            </h3>
                            
                            <div className="space-y-3">
                              {/* Next Lesson Info */}
                              <div>
                                <h4 className="text-white font-medium text-sm mb-2 leading-relaxed" 
                                  style={{ 
                                    wordWrap: 'break-word', 
                                    overflowWrap: 'anywhere', 
                                    lineHeight: '1.4',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                  }}>
                                  {course.nextLesson}
                                </h4>
                                <div className="flex items-center text-white/85 text-sm">
                                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" /> 
                                  Estimated: 25 mins
                                </div>
                              </div>
                              
                              {/* Progress Stats */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                  <p className="text-white/80 text-xs mb-1">Completed</p>
                                  <p className="text-white text-xl font-bold">
                                    {course.completed || Math.floor(course.progress * 10 / 100)}/10
                                  </p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                  <p className="text-white/80 text-xs mb-1">Remaining</p>
                                  <p className="text-white text-xl font-bold">
                                    {course.remaining || (10 - Math.floor(course.progress * 10 / 100))}/10
                                  </p>
                                </div>
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
                {/* Navigation arrows - Adjusted position further away from content */}
                <button 
                  onClick={() => navigateToCourse(activeCourseIndex === 0 ? courseCards.length - 1 : activeCourseIndex - 1)}
                  className="absolute left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md z-20"
                  aria-label="Previous course"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => navigateToCourse(activeCourseIndex === courseCards.length - 1 ? 0 : activeCourseIndex + 1)}
                  className="absolute right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md z-20"
                  aria-label="Next course"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Navigation dots - Made more visible */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {courseCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToCourse(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeCourseIndex === index 
                          ? 'bg-white scale-110' 
                          : 'bg-white/40 hover:bg-white/60'
                      } focus:outline-none`}
                      aria-label={`Go to slide ${index + 1}`}
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
                  <Link href="/courses/free" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
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