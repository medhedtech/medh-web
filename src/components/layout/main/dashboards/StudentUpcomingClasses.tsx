"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Video, 
  BookOpen, 
  GraduationCap, 
  CalendarClock, 
  ExternalLink, 
  Users,
  ArrowRight
} from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import { toast } from "react-toastify";
import Image from "next/image";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";

interface ClassDetails {
  _id: string;
  meet_title: string;
  course_name: string;
  date: string;
  time: string;
  meet_link: string;
  courseDetails?: {
    course_image?: string;
  };
}

const StudentUpcomingClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const { getQuery, loading } = useGetQuery<ClassDetails[]>();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'today' | 'recent'>('upcoming');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // Fetch student ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      } else {
        console.error("No student ID found in localStorage");
      }
    }
  }, []);

  // Fetch upcoming classes
  useEffect(() => {
    if (studentId) {
      const fetchUpcomingClasses = () => {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingByStudentId}/${studentId}?show_all_upcoming=true`,
          onSuccess: (response: ClassDetails[]) => {
            setClasses(response || []);
          },
          onFail: (err) => {
            console.error("Error fetching upcoming classes:", err);
            showToast.error("Failed to fetch upcoming classes");
          },
        });
      };

      fetchUpcomingClasses();
    }
  }, [studentId, getQuery]);

  // Intersection Observer effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('upcoming-classes-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleJoinClick = (classItem: ClassDetails) => {
    const classDateTime = moment(
      `${classItem.date} ${classItem.time}`,
      "YYYY-MM-DD HH:mm"
    );
    const currentTime = moment();
    const minutesDifference = classDateTime.diff(currentTime, "minutes");

    // Check if the class is scheduled to start within the next 30 minutes
    if (minutesDifference > 30) {
      showToast.info(
        "Meeting link will be enabled 30 minutes before the class starts."
      );
    }
    // Check if the class is ongoing
    else if (minutesDifference <= 30 && minutesDifference >= 0) {
      window.open(classItem.meet_link, "_blank");
    } else {
      const classEndTime = classDateTime.add(1, "hour");
      if (currentTime.isBefore(classEndTime)) {
        window.open(classItem.meet_link, "_blank");
      } else {
        showToast.warning("This class has already ended. You cannot join.");
      }
    }
  };

  // Check if the class is ongoing (between 10 minutes before and 5 minutes after)
  const isClassOngoing = (classItem: ClassDetails) => {
    const classDateTime = moment(
      `${classItem.date} ${classItem.time}`,
      "YYYY-MM-DD HH:mm"
    );
    const classEndTime = classDateTime.clone().add(1, "hour");
    const currentTime = moment();

    // Check if the class is in the "live" period (from 10 minutes before to 5 minutes after)
    const startLiveTime = classDateTime.clone().subtract(10, "minutes");
    const endLiveTime = classEndTime.clone().add(5, "minutes");

    return currentTime.isBetween(startLiveTime, endLiveTime);
  };

  // Calculate time until class starts or if it's already over
  const getClassStatus = (classItem: ClassDetails) => {
    const classDateTime = moment(
      `${classItem.date} ${classItem.time}`,
      "YYYY-MM-DD HH:mm"
    );
    const classEndTime = classDateTime.clone().add(1, "hour");
    const currentTime = moment();

    if (currentTime.isBefore(classDateTime)) {
      const diffMinutes = classDateTime.diff(currentTime, "minutes");
      if (diffMinutes < 60) {
        return {
          status: 'soon',
          text: `Starts in ${diffMinutes} minutes`,
          color: 'text-amber-600 dark:text-amber-400'
        };
      }
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return {
        status: 'upcoming',
        text: `Starts in ${diffHours}h ${remainingMinutes}m`,
        color: 'text-gray-600 dark:text-gray-400'
      };
    } else if (currentTime.isBefore(classEndTime)) {
      return {
        status: 'ongoing',
        text: 'Class in progress',
        color: 'text-emerald-600 dark:text-emerald-400'
      };
    } else {
      return {
        status: 'ended',
        text: 'Class ended',
        color: 'text-gray-500 dark:text-gray-500'
      };
    }
  };

  // Filter classes based on the selected tab
  const getFilteredClasses = () => {
    if (!classes || !Array.isArray(classes)) {
      return [];
    }
    
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');

    switch (selectedTab) {
      case 'today':
        return classes.filter(classItem => {
          const classDate = moment(classItem.date, "YYYY-MM-DD").startOf('day');
          return classDate.isSame(today);
        });
      case 'recent':
        return classes.filter(classItem => {
          const classDateTime = moment(
            `${classItem.date} ${classItem.time}`,
            "YYYY-MM-DD HH:mm"
          );
          return classDateTime.isBefore(moment());
        }).sort((a, b) => 
          moment(`${b.date} ${b.time}`, "YYYY-MM-DD HH:mm").diff(
            moment(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm")
          )
        ).slice(0, 3);
      case 'upcoming':
      default:
        return classes.filter(classItem => {
          const classDateTime = moment(
            `${classItem.date} ${classItem.time}`,
            "YYYY-MM-DD HH:mm"
          );
          return classDateTime.isAfter(moment());
        }).sort((a, b) => 
          moment(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm").diff(
            moment(`${b.date} ${b.time}`, "YYYY-MM-DD HH:mm")
          )
        );
    }
  };

  const filteredClasses = getFilteredClasses();

  // Loading skeleton component
  const ClassSkeleton = () => (
    <div className="animate-pulse h-36 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-4 flex gap-4">
      <div className="w-1/4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="flex gap-3 mt-auto">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="upcoming-classes-section" className="p-6">
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Live Sessions</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Join your scheduled classes and stay engaged
          </p>
        </div>
        
        {/* Tab navigation */}
        <div className="flex bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
          {[
            { id: 'upcoming', label: 'Upcoming' }, 
            { id: 'today', label: 'Today' },
            { id: 'recent', label: 'Recent' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as 'upcoming' | 'today' | 'recent')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                selectedTab === tab.id 
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Classes list */}
      <motion.div 
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="space-y-4"
      >
        {loading ? (
          // Loading skeletons
          Array(3).fill(null).map((_, index) => (
            <ClassSkeleton key={index} />
          ))
        ) : filteredClasses.length > 0 ? (
          filteredClasses.map((classItem) => {
            const isOngoing = isClassOngoing(classItem);
            const classStatus = getClassStatus(classItem);
            
            return (
              <motion.div
                key={classItem._id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Course Image */}
                  <div className="relative h-32 sm:h-auto sm:w-32 flex-shrink-0">
                    <Image
                      src={classItem?.courseDetails?.course_image || AiMl}
                      alt={classItem?.meet_title || "Class"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Live indicator */}
                    {isOngoing && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium">
                          <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          LIVE
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                      <div className="flex items-center text-xs font-medium">
                        <CalendarClock className="w-3.5 h-3.5 mr-1 text-primary-500" />
                        <span className={classStatus.color}>{classStatus.text}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>{moment(classItem.date).format("ddd, MMM D")} • {classItem.time}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {classItem.meet_title || "Untitled Class"}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {classItem.course_name || "Untitled Course"}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto">
                      <button
                        onClick={() => handleJoinClick(classItem)}
                        disabled={classStatus.status === 'ended'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                          classStatus.status === 'ongoing'
                            ? 'bg-primary-500 hover:bg-primary-600 text-white'
                            : classStatus.status === 'ended'
                              ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        {classStatus.status === 'ongoing' ? 'Join Now' : 'Join Class'}
                      </button>
                      
                      {selectedTab === 'recent' && classStatus.status === 'ended' && (
                        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          View Recording
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div 
            variants={itemVariants}
            className="text-center py-8 px-6 rounded-xl bg-white/50 dark:bg-gray-800/30 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-700/30"
          >
            <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-primary-500/70" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedTab === 'today' 
                ? "No Classes Today" 
                : selectedTab === 'recent' 
                  ? "No Recent Classes" 
                  : "No Upcoming Classes"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              {selectedTab === 'today' 
                ? "You don't have any live sessions scheduled for today." 
                : selectedTab === 'recent' 
                  ? "You haven't attended any classes recently."
                  : "You don't have any upcoming live classes scheduled."}
            </p>
            <button onClick={() => selectedTab !== 'upcoming' && setSelectedTab('upcoming')} className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 font-medium rounded-lg transition-colors duration-300">
              {selectedTab === 'upcoming' ? 'Browse Courses' : 'Check Upcoming Classes'}
              <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentUpcomingClasses;