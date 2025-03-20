"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import moment from "moment";
import { toast } from "react-toastify";
import Image from "next/image";
import { Calendar, Clock, Video, ChevronLeft, BookOpen, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import Preloader from "@/components/shared/others/Preloader";

const StudentUpcomigClasses = () => {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery, loading } = useGetQuery();

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
          onSuccess: (res) => {
            setClasses(res || []);
          },
          onFail: (err) => {
            console.error("Error fetching upcoming classes:", err);
          },
        });
      };

      fetchUpcomingClasses();
    }
  }, [studentId]);

  const handleJoinClick = (classItem) => {
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
  const isClassOngoing = (classItem) => {
    const classDateTime = moment(
      `${classItem.date} ${classItem.time}`,
      "YYYY-MM-DD HH:mm"
    );
    const classEndTime = classDateTime.add(1, "hour");
    const currentTime = moment();

    // Check if the class is in the "live" period (from 10 minutes before to 5 minutes after)
    const startLiveTime = classDateTime.subtract(10, "minutes"); // 10 minutes before class start
    const endLiveTime = classEndTime.add(5, "minutes"); // 5 minutes after class ends

    return currentTime.isBetween(startLiveTime, endLiveTime);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
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

  if (loading) {
    return <Preloader />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-6 md:px-10 pb-12"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboards/student-dashboard")}
            className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <Video size={14} className="mr-1" />
            Live Sessions
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Upcoming Classes
        </h2>
      </div>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {classes.length > 0 ? (
          classes.map((classItem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700/50 flex flex-col"
            >
              {/* Live indicator */}
              {isClassOngoing(classItem) && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 mr-1"></span>
                    <span className="text-red-600 dark:text-red-400 text-xs font-medium">LIVE</span>
                  </span>
                </div>
              )}

              {/* Course Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={classItem?.courseDetails?.course_image || AiMl}
                  alt={classItem?.title || "Class"}
                  fill
                  className="object-cover rounded-l-xl transition-transform transform hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                {/* Title and Course Name */}
                <div className="flex-grow">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                    {classItem.meet_title || "Untitled Class"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-1">
                    {classItem.course_name || "Untitled Course"}
                  </p>

                  {/* Time and Date */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      <span className="text-sm">
                        {moment(classItem.date).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock size={16} className="mr-2" />
                      <span className="text-sm">{classItem.time}</span>
                    </div>
                  </div>
                </div>

                {/* Join Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => handleJoinClick(classItem)}
                >
                  <Video size={18} />
                  Join Class
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            variants={itemVariants}
            className="col-span-full bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg p-10 text-center border border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <GraduationCap size={40} className="text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                No upcoming classes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                You don't have any upcoming classes scheduled. Enroll in a course to start your learning journey.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/courses")}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-full transition-all duration-300 flex items-center gap-2"
              >
                <BookOpen size={18} />
                Browse Courses
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudentUpcomigClasses;
