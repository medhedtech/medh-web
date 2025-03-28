"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, BookOpen, GraduationCap } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import { toast } from "react-toastify";
import Image from "next/image";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import Preloader from "@/components/shared/others/Preloader";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
      setIsInitialLoad(false);
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
            toast.error("Failed to fetch upcoming classes");
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
      toast.info(
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
        toast.warning("This class has already ended. You cannot join.");
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

  // Show loading state only during initial load or when fetching data
  if (loading) {
    return (
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Skeleton */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center space-x-1 mb-4">
              <div className="h-px w-8 bg-primary-500/50"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-px w-8 bg-primary-500/50"></div>
            </div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6">
            {[1, 2].map((index) => (
              <div 
                key={index}
                className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Skeleton */}
                  <div className="relative h-48 md:h-auto md:w-48 lg:w-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

                  {/* Content Skeleton */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        {/* Title and Badge */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>

                        {/* Course Title */}
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>

                        {/* Time and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </div>

                      {/* Button Skeleton */}
                      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="upcoming-classes-section"
      className="py-12 md:py-16 relative overflow-hidden"
    >
      {/* Modern background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center space-x-1 mb-4">
            <span className="h-px w-8 bg-primary-500/50"></span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              Live Sessions
            </span>
            <span className="h-px w-8 bg-primary-500/50"></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Upcoming Classes
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Join your scheduled live sessions and stay engaged with your courses
          </p>
        </motion.div>

        {/* Classes Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 gap-6"
        >
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <motion.div
                key={classItem._id}
                variants={itemVariants}
                className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Course Image */}
                  <div className="relative h-48 md:h-auto md:w-48 lg:w-64">
                    <Image
                      src={classItem?.courseDetails?.course_image || AiMl}
                      alt={classItem?.meet_title || "Class"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Live indicator */}
                    {isClassOngoing(classItem) && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 mr-1"></span>
                          <span className="text-red-600 dark:text-red-400 text-xs font-medium">LIVE</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="w-5 h-5 text-primary-500" />
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            Live Class
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                          {classItem.meet_title || "Untitled Class"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {classItem.course_name || "Untitled Course"}
                        </p>

                        {/* Time and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                            <span className="text-sm">
                              {moment(classItem.date).format("DD MMM YYYY")}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <Clock className="w-5 h-5 mr-2 text-primary-500" />
                            <span className="text-sm">{classItem.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Join Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleJoinClick(classItem)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Video className="w-5 h-5" />
                        Join Class
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12 px-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-lg shadow-lg border border-gray-100 dark:border-gray-700/50"
            >
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Upcoming Classes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  You don't have any upcoming live classes scheduled. Check your enrolled courses for the next sessions.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StudentUpcomingClasses; 