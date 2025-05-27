"use client";
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import ProgressOverview from "./ProgressOverview";
import StudentUpcomingClasses from "./StudentUpcomingClasses";
import FreeClasses from "@/components/shared/dashboards/FreeClasses";
import RecentAnnouncements from "@/components/shared/dashboards/RecentAnnouncements";
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
  // Sample goals data - in a real app, this would come from an API
  const goals = [
    {
      id: 1,
      title: "Complete Python Basics",
      deadline: "3 days left",
      progress: 75,
      category: "Course",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Submit JavaScript Assignment",
      deadline: "Tomorrow",
      progress: 90,
      category: "Assignment",
      color: "bg-amber-500"
    },
    {
      id: 3,
      title: "Prepare for Data Structures Quiz",
      deadline: "5 days left",
      progress: 30,
      category: "Exam",
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Complete React Project",
      deadline: "2 weeks left",
      progress: 15,
      category: "Project",
      color: "bg-green-500"
    }
  ];

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
          {goals.map((goal) => (
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
                      className={`${goal.color} h-2 rounded-full`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                  </div>
                </div>
                <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {goal.progress}%
                </span>
              </div>
                        </div>
                      ))}
      </div>
      
      <div className="mt-3 flex justify-center">
        <button className="flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
          <Trophy className="w-4 h-4" />
          Set New Goal
        </button>
      </div>
    </div>
  );
};

// Memoize components to prevent unnecessary re-renders
const MemoizedCounterStudent = memo(CounterStudent);
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
  // Add state for most recent course - in a real app, would be fetched from API
  const [recentCourse, setRecentCourse] = useState<{id: string, title: string, progress: number} | null>(null);

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

    // Get user name from localStorage
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName") || "";
      setUserName(storedName.split(" ")[0] || "Student"); // Use first name or default to "Student"
      
      // Simulate fetching recent course - in a real app, this would come from an API
      setRecentCourse({
        id: "course-123",
        title: "Introduction to Web Development",
        progress: 65
      });
    }
  }, []);

  // Define course cards within the carousel component to isolate state
  const courseCards = [
    {
      id: 'course-1',
      title: 'Python Programming Fundamentals',
      progress: 65,
      nextLesson: 'Functions and Modules',
      instructor: 'Dr. Alex Morgan',
      image: '/courses/python-course.jpg',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'course-2',
      title: 'Web Development Bootcamp',
      progress: 42,
      nextLesson: 'CSS Flexbox Layout',
      instructor: 'Sarah Wilson',
      image: '/courses/web-dev.jpg',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'course-3',
      title: 'Data Science Essentials',
      progress: 78,
      nextLesson: 'Statistical Analysis',
      instructor: 'Prof. Michael Chen',
      image: '/courses/data-science.jpg',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

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
              <div className="relative w-full flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/backgrounds/grid-pattern.svg')] opacity-10"></div>
                <div className="w-full px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                        {greeting}, {userName}
                      </h1>
                      <p className="text-primary-100 text-base sm:text-lg max-w-xl">
                        Welcome to your learning dashboard. Track your progress, manage your courses, and stay updated.
                      </p>
                      <div className="mt-4">
                        <Link 
                          href="/courses" 
                          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors inline-flex"
                        >
                          <BookOpen className="mr-2 h-5 w-5" />
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
                    className={`relative w-full flex-shrink-0 bg-gradient-to-br ${course.color} overflow-hidden h-[300px] md:h-[320px] transition-all duration-300`}
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
                    
                    <div className="relative z-10 w-full px-4 py-4 sm:py-6 sm:px-6 lg:px-8 h-full flex items-center transition-all duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full px-10 md:px-16 lg:px-20 w-full max-w-[1400px] mx-auto">
                        {/* Left side - Course information */}
                        <div className="md:col-span-7 flex flex-col justify-center">
                          <div className="flex flex-wrap items-center mb-2">
                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full mr-2 mb-1">
                              {course.instructor}
                            </span>
                            <span className="text-xs text-white/80 mb-1">
                              {greeting}, {userName}
                            </span>
                          </div>
                        
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 line-clamp-1 transition-all duration-300">
                            {course.title}
                          </h1>
                          
                          <div className="flex items-center mb-3 max-w-md">
                            <div className="w-full bg-white/20 rounded-full h-2.5">
                              <div 
                                className="bg-white h-2.5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-white text-xs font-medium whitespace-nowrap min-w-[70px] text-right">
                              {course.progress}% complete
                            </span>
                          </div>
                          
                          <p className="text-white/80 text-sm mb-4 max-w-xl line-clamp-2 transition-all duration-300">
                            Continue your learning journey with {course.instructor}. Your next lesson covers {course.nextLesson}.
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <Link 
                              href={`/course/${course.id}`} 
                              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors font-medium text-sm mb-1"
                            >
                              <PlayCircle className="mr-1.5 h-4 w-4" />
                              Continue Learning
                            </Link>
                            
                            <Link 
                              href={`/course/${course.id}/materials`} 
                              className="border border-white/30 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm mb-1"
                            >
                              <FileText className="mr-1.5 h-4 w-4" />
                              Course Materials
                            </Link>
                          </div>
                        </div>
                        
                        {/* Right side - Next lesson info */}
                        <div className="md:col-span-5 flex flex-col justify-center mt-4 md:mt-0">
                          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 h-full max-h-[200px] transition-all duration-300">
                            <h3 className="text-white text-base font-medium mb-2 flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5" /> Next Up
                            </h3>
                            <div className="bg-white/10 rounded-lg p-3 mb-3">
                              <p className="text-white font-medium text-sm mb-1 line-clamp-1">{course.nextLesson}</p>
                              <div className="flex items-center text-white/70 text-xs">
                                <PlayCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" /> Estimated: 25 mins
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div className="bg-white/10 rounded-lg p-2">
                                <p className="text-white/70 text-xs mb-0.5">Completed</p>
                                <p className="text-white text-sm font-medium">{Math.floor(course.progress/10)}/10</p>
                          </div>
                              <div className="bg-white/10 rounded-lg p-2">
                                <p className="text-white/70 text-xs mb-0.5">Remaining</p>
                                <p className="text-white text-sm font-medium">{10-Math.floor(course.progress/10)}/10</p>
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
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
                  {courseCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToCourse(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
            <QuickActionCard recentCourse={recentCourse} />
            
            {/* Counter Stats Section */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 overflow-hidden"
            >
                <MemoizedCounterStudent />
            </motion.section>
            
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
            
            {/* Study Goals Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <MemoizedStudyGoals />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Activity Chart component - Memoized
const WeeklyActivityChart = memo(() => {
    // Sample data - in a real app, this would come from an API
    const activityData = [
      { day: 'Mon', hours: 1.5, complete: 2 },
      { day: 'Tue', hours: 2.2, complete: 1 },
      { day: 'Wed', hours: 0.8, complete: 0 },
      { day: 'Thu', hours: 3.0, complete: 3 },
      { day: 'Fri', hours: 1.2, complete: 1 },
      { day: 'Sat', hours: 2.8, complete: 2 },
      { day: 'Sun', hours: 0.5, complete: 0 },
    ];

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
          <div className="space-y-2.5">
            {activityData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="w-9 text-sm font-medium text-gray-500 dark:text-gray-400">{item.day}</span>
                <div className="flex-1 ml-2">
                  <div className="h-7 flex items-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                    <div 
                      className="h-full bg-blue-100 dark:bg-blue-900/30 flex items-center"
                      style={{ width: `${Math.min(100, item.hours * 20)}%` }}
                    >
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-600"
                        style={{ width: `${Math.min(100, item.complete * 15)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-10 text-right">
                  {item.hours}h
                </span>
              </div>
            ))}
          </div>
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
const QuickActionCard = memo(({ recentCourse }: { recentCourse: {id: string, title: string, progress: number} | null }) => (
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
          <Link href={recentCourse ? `/course/${recentCourse.id}` : "#"} passHref>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors cursor-pointer group">
              <div className="bg-primary-500 rounded-full p-2 text-white">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-primary-900 dark:text-primary-100">Continue Learning</h3>
                <p className="text-sm text-primary-700 dark:text-primary-300 line-clamp-1">
                  {recentCourse?.title || "Start a course"}
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
));

export default StudentDashboardMain; 