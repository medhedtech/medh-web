"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import "@/assets/css/Calendar.css";
import Icon1 from "@/assets/images/dashbord/icon1.svg";
import Icon2 from "@/assets/images/dashbord/icon2.svg";
import Image from "next/image";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import moment from "moment";
import Preloader from "@/components/shared/others/Preloader";
import Link from "next/link";
import { LucideCalendar, LucideBook, LucideClipboardList, LucideClock } from "lucide-react";

// Types
interface ClassItem {
  date: string;
  time: string;
  meet_title: string;
  courseDetails?: {
    course_title: string;
    course_image: string;
  };
}

interface QuickStat {
  title: string;
  value: number;
  icon: string;
  description?: string;
}

interface ApiResponse {
  submittedAssignmentsCount?: number;
  meetings?: ClassItem[];
  courseCount?: number;
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

const getTimeDifference = (meetingDate: string, meetingTime: string): string => {
  const now = moment();
  const meetingMoment = moment(
    `${meetingDate} ${meetingTime}`,
    "YYYY-MM-DD HH:mm"
  );
  const diffMinutes = meetingMoment.diff(now, "minutes");

  if (diffMinutes > 1440) {
    const diffDays = Math.ceil(diffMinutes / 1440);
    return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffMinutes > 60) {
    const diffHours = Math.floor(diffMinutes / 60);
    return `Starts in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else if (diffMinutes > 0) {
    return `Starts in ${diffMinutes} minutes`;
  } else if (diffMinutes === 0) {
    return "Meeting is starting now!";
  } else {
    return "Meeting has already started.";
  }
};

const QuickStats: React.FC<{ stats: QuickStat[] }> = ({ stats }) => (
  <motion.div 
    variants={itemVariants}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {stats.map((stat, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-600"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
              {stat.title}
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
            <Image src={stat.icon} alt="icon" width={24} height={24} className="text-blue-500" />
          </div>
        </div>
        {stat.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {stat.description}
          </p>
        )}
      </motion.div>
    ))}
  </motion.div>
);

const UpcomingClasses: React.FC<{ classes: ClassItem[] }> = ({ classes }) => (
  <motion.div 
    variants={itemVariants}
    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Upcoming Classes
      </h2>
      <Link
        href="/dashboards/instructor-mainclass/all-classess"
        className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 text-sm font-medium"
      >
        View all
      </Link>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      {classes.length > 0 ? (
        classes.map((classItem, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-600 transition-all duration-300"
          >
            <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <Image
                src={classItem.courseDetails?.course_image || Icon1}
                width={300}
                height={150}
                alt={classItem.meet_title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-white truncate">
                {classItem?.courseDetails?.course_title}
              </p>
              <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
                <LucideClock className="w-4 h-4" />
                <span className="text-sm">{classItem.time}</span>
              </div>
              <p className="text-sm text-emerald-500 font-medium mt-2 flex items-center gap-2">
                <LucideCalendar className="w-4 h-4" />
                {getTimeDifference(classItem.date, classItem.time)}
              </p>
            </div>
          </motion.div>
        ))
      ) : (
        <motion.div
          variants={itemVariants}
          className="col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <LucideCalendar className="w-8 h-8 text-gray-400 dark:text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Upcoming Classes
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no classes scheduled for the selected date.
          </p>
        </motion.div>
      )}
    </div>
  </motion.div>
);

const CustomDatePicker: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
}> = ({ selectedDate, onChange }) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
      Calendar
    </h2>
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      inline
      calendarClassName="!bg-transparent"
      wrapperClassName="!bg-transparent w-full"
      dayClassName={date => 
        `!bg-transparent hover:!bg-blue-50 dark:hover:!bg-blue-900/30 
         ${date.getTime() === selectedDate.getTime() ? '!bg-blue-500 !text-white hover:!bg-blue-600' : ''}`
      }
    />
  </div>
);

const InstructorDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [instructorId, setInstructorId] = useState<string>("");
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalAssignments, setTotalAssignments] = useState<number>(0);

  const { getQuery } = useGetQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      }
    }
  }, []);

  const fetchSubmittedAssignments = async () => {
    setLoading(true);
    try {
      const res = await getQuery({
        url: `${apiUrls.onlineMeeting.getMeetingsByInstructorId}/${instructorId}/assignments/count`,
      });
      setTotalAssignments((res as ApiResponse)?.submittedAssignmentsCount || 0);
    } catch (err) {
      setError("Failed to load assignments count.");
    }
  };

  useEffect(() => {
    if (instructorId) {
      const fetchUpcomingClasses = async () => {
        setLoading(true);
        try {
          const res = await getQuery({
            url: `${apiUrls.onlineMeeting.getMeetingsByInstructorId}/${instructorId}`,
          });
          const apiResponse = res as ApiResponse;
          setUpcomingClasses(apiResponse?.meetings || []);
          setTotalCourses(apiResponse?.courseCount || 0);
        } catch (err) {
          setError("Failed to load upcoming classes.");
        } finally {
          setLoading(false);
        }
      };

      fetchUpcomingClasses();
      fetchSubmittedAssignments();
    }
  }, [instructorId]);

  if (loading) return <Preloader />;

  const filteredClasses = upcomingClasses.filter((classItem) => {
    const classDate = moment(classItem.date);
    const selectedMoment = moment(selectedDate);
    return classDate.isSame(selectedMoment, "day");
  });

  const quickStats: QuickStat[] = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: Icon1,
      description: "Active courses you're currently teaching"
    },
    {
      title: "Assignments to Review",
      value: totalAssignments,
      icon: Icon2,
      description: "Pending assignments requiring your attention"
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border dark:border-gray-700 overflow-hidden backdrop-blur-xl bg-white/50 dark:bg-gray-800/50"
      >
        <h2 className="p-6 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent border-b dark:border-gray-700">
          Quick Stats
        </h2>
        <div className="p-6">
          <QuickStats stats={quickStats} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5"
        >
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={(date: Date) => setSelectedDate(date)}
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7"
        >
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400">
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          ) : (
            <UpcomingClasses classes={filteredClasses} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstructorDashboard; 