"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StudentDashboardMain: React.FC = () => {
  const [greeting, setGreeting] = useState<string>("Good day");
  const [userName, setUserName] = useState<string>("");
  // Add state for most recent course - in a real app, would be fetched from API
  const [recentCourse, setRecentCourse] = useState<{id: string, title: string, progress: number} | null>(null);

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

  // Activity Chart component
  const WeeklyActivityChart = () => {
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
      <motion.div
        variants={itemVariants}
        className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-primary-500" />
              Weekly Activity
            </h2>
            <Link href="/dashboards/student/progress" className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Chart */}
          <div className="mb-4">
            <div className="space-y-3">
              {activityData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-9 text-sm text-gray-500 dark:text-gray-400">{item.day}</span>
                  <div className="flex-1 ml-2">
                    <div className="h-8 flex items-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                      <div 
                        className="h-full bg-primary-100 dark:bg-primary-900/30 flex items-center"
                        style={{ width: `${Math.min(100, item.hours * 20)}%` }}
                      >
                        <div 
                          className="h-full bg-primary-500 dark:bg-primary-600"
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
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-500 dark:bg-primary-600 rounded-sm mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">Completed Activities</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-100 dark:bg-primary-900/30 rounded-sm mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">Study Hours</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Quick action component
  const QuickActionCard = () => (
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
  );

  // Define course cards for the banner
  // In a real app, this would be fetched from an API
  const [courseCards, setCourseCards] = useState([
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
  ]);

  // State for banner sliding
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

  // Function to handle course navigation
  const navigateToCourse = (index: number) => {
    setActiveCourseIndex(index);
  };

  // Auto-slide effect for courses only if we have more than one card
  useEffect(() => {
    if (courseCards.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveCourseIndex((prevIndex) => 
        prevIndex === courseCards.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [courseCards.length]);
  
  // Pause auto-slide when user is hovering over the carousel
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const pauseAutoSlide = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.setAttribute('data-paused', 'true');
    }
  }, []);
  
  const resumeAutoSlide = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.setAttribute('data-paused', 'false');
    }
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
            data-paused="false"
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
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 text-white mt-2 md:mt-0 min-w-[270px] w-[270px]">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary-200" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-primary-100">Today's Date</p>
                          <p className="text-sm sm:text-base font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
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
                    className={`relative w-full flex-shrink-0 bg-gradient-to-br ${course.color} overflow-hidden`}
                  >
                    {/* Course background image with overlay */}
                    <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
                    <div className="absolute inset-0">
                      {/* The Image component would be better here, but using a div with background for simplicity */}
                      <div 
                        className="w-full h-full bg-center bg-cover bg-no-repeat opacity-30"
                        style={{ 
                          backgroundImage: `url('${course.image || '/backgrounds/course-placeholder.jpg'}')`,
                        }}
                      ></div>
                      <div className="w-full h-full bg-[url('/backgrounds/grid-pattern.svg')] opacity-10 absolute inset-0"></div>
                    </div>
                    
                    <div className="relative z-10 w-full px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
                      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                        {/* Course information */}
                        <div className="max-w-2xl">
                          <div className="flex items-center mb-2">
                            <span className="text-xs sm:text-sm bg-white/20 text-white px-3 py-1 rounded-full">
                              {course.instructor}
                            </span>
                            <div className="w-1 h-1 bg-white rounded-full mx-2"></div>
                            <span className="text-xs sm:text-sm text-white/80">
                              {greeting}, {userName}
                            </span>
                          </div>
                        
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                            {course.title}
                          </h1>
                          
                          <div className="flex items-center mb-3">
                            <div className="w-full max-w-xs bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-3 text-white text-sm font-medium">
                              {course.progress}% complete
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Link 
                              href={`/course/${course.id}`} 
                              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg mr-4 flex items-center transition-colors"
                            >
                              <PlayCircle className="mr-2 h-5 w-5" />
                              Continue Learning
                            </Link>
                            
                            <div className="text-white/80 text-sm">
                              Next lesson: <span className="font-medium text-white">{course.nextLesson}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Today's date info */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 text-white mt-4 md:mt-0 min-w-[270px] w-[270px] self-end md:self-auto">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-white/80" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-white/80">Today's Date</p>
                              <p className="text-sm sm:text-base font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                {/* Navigation arrows */}
                <button 
                  onClick={() => navigateToCourse(activeCourseIndex === 0 ? courseCards.length - 1 : activeCourseIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Previous course"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => navigateToCourse(activeCourseIndex === courseCards.length - 1 ? 0 : activeCourseIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Next course"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Navigation dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {courseCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToCourse(index)}
                      className={`w-2.5 h-2.5 rounded-full ${
                        activeCourseIndex === index ? 'bg-white' : 'bg-white/40'
                      } transition-colors focus:outline-none`}
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
            <QuickActionCard />
            
            {/* Counter Stats Section */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 overflow-hidden"
            >
              <CounterStudent />
            </motion.section>
            
            {/* Progress Overview */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <ProgressOverview />
            </motion.section>
          
            {/* Live Sessions Section */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <StudentUpcomingClasses />
            </motion.section>
          </div>
          
          {/* Right column - 4/12 width on desktop */}
          <div className="lg:col-span-4 grid grid-cols-1 gap-6 sm:gap-8">
            {/* Recent Announcements Section */}
            <motion.section variants={itemVariants}>
              <RecentAnnouncements 
                limit={5} 
                showViewAll={true}
                onViewAllClick={() => console.log("Navigate to all announcements page")}
              />
            </motion.section>
            
            {/* Weekly Activity Chart */}
            <WeeklyActivityChart />
            
            {/* Free Courses Section */}
            <motion.section 
              variants={itemVariants}
              className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              <FreeClasses />
            </motion.section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboardMain; 