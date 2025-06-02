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
import { 
  LucideCalendar, 
  LucideBook, 
  LucideClipboardList, 
  LucideClock,
  LucideUsers,
  LucideFileText,
  LucideGraduationCap,
  LucideCheckCircle,
  LucidePlusCircle,
  LucideEye,
  LucideEdit,
  LucideSettings,
  LucideBarChart,
  LucideMessageSquare,
  LucideVideo,
  LucideTrendingUp,
  LucideAward,
  LucideDownload,
  LucideUpload,
  LucideAlertCircle,
  LucideChevronRight
} from "lucide-react";

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
  trend?: number;
  trendDirection?: 'up' | 'down';
}

interface ApiResponse {
  submittedAssignmentsCount?: number;
  meetings?: ClassItem[];
  courseCount?: number;
}

interface StudentSubmission {
  id: string;
  studentName: string;
  studentAvatar?: string;
  assignmentTitle: string;
  courseName: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'graded';
  score?: number;
  type: 'assignment' | 'quiz' | 'project';
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
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
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700 h-full flex flex-col"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
        <LucideCalendar className="w-6 h-6 text-blue-500" />
        Upcoming Classes
      </h2>
      <Link
        href="/dashboards/instructor-mainclass/all-classess"
        className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
      >
        View all
        <LucideChevronRight className="w-4 h-4" />
      </Link>
    </div>
    <div className="grid lg:grid-cols-2 gap-4 flex-1">
      {classes.length > 0 ? (
        classes.slice(0, 4).map((classItem, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-600 transition-all duration-300"
          >
            <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <Image
                src={classItem.courseDetails?.course_image || Icon1}
                width={64}
                height={64}
                alt={classItem.meet_title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-white truncate text-sm">
                {classItem?.courseDetails?.course_title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                <LucideClock className="w-3 h-3" />
                <span className="text-xs">{classItem.time}</span>
              </div>
              <p className="text-xs text-emerald-500 font-medium mt-1">
                {getTimeDifference(classItem.date, classItem.time)}
              </p>
            </div>
          </motion.div>
        ))
      ) : (
        <motion.div
          variants={itemVariants}
          className="col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full"
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

const RecentStudentSubmissions: React.FC = () => {
  // Mock data for recent student submissions
  const submissions: StudentSubmission[] = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentAvatar: 'https://i.pravatar.cc/150?img=1',
      assignmentTitle: 'Quantum Algorithm Implementation',
      courseName: 'Quantum Computing Fundamentals',
      submittedAt: moment().subtract(2, 'hours').toISOString(),
      status: 'pending',
      type: 'assignment'
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      studentAvatar: 'https://i.pravatar.cc/150?img=2',
      assignmentTitle: 'Mid-term Quiz',
      courseName: 'Advanced Physics',
      submittedAt: moment().subtract(5, 'hours').toISOString(),
      status: 'reviewed',
      score: 87,
      type: 'quiz'
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      studentAvatar: 'https://i.pravatar.cc/150?img=3',
      assignmentTitle: 'Final Project Proposal',
      courseName: 'Computer Science',
      submittedAt: moment().subtract(1, 'day').toISOString(),
      status: 'graded',
      score: 92,
      type: 'project'
    },
    {
      id: '4',
      studentName: 'David Wilson',
      studentAvatar: 'https://i.pravatar.cc/150?img=4',
      assignmentTitle: 'Lab Report #3',
      courseName: 'Chemistry Lab',
      submittedAt: moment().subtract(2, 'days').toISOString(),
      status: 'pending',
      type: 'assignment'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'graded': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <LucideFileText className="w-4 h-4" />;
      case 'quiz': return <LucideClipboardList className="w-4 h-4" />;
      case 'project': return <LucideGraduationCap className="w-4 h-4" />;
      default: return <LucideFileText className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
          <LucideClipboardList className="w-6 h-6 text-purple-500" />
          Recent Student Submissions
        </h2>
        <Link
          href="/dashboards/instructor/submissions"
          className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
        >
          View all
          <LucideChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {submissions.map((submission) => (
          <motion.div
            key={submission.id}
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={submission.studentAvatar || `https://i.pravatar.cc/150?img=${submission.id}`}
                  width={40}
                  height={40}
                  alt={submission.studentName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {getTypeIcon(submission.type)}
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {submission.assignmentTitle}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  by {submission.studentName} • {submission.courseName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {moment(submission.submittedAt).fromNow()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {submission.score && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {submission.score}%
                  </p>
                </div>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </span>
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                <LucideEye className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      title: 'Create Course',
      description: 'Start a new course or lesson',
      icon: <LucidePlusCircle className="w-6 h-6" />,
      href: '/dashboards/instructor/courses/create',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Schedule Class',
      description: 'Plan your next live session',
      icon: <LucideVideo className="w-6 h-6" />,
      href: '/dashboards/instructor/schedule',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'View Analytics',
      description: 'Check course performance',
      icon: <LucideBarChart className="w-6 h-6" />,
      href: '/dashboards/instructor/analytics',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Message Students',
      description: 'Communicate with your class',
      icon: <LucideMessageSquare className="w-6 h-6" />,
      href: '/dashboards/instructor/messages',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Grade Assignments',
      description: 'Review pending submissions',
      icon: <LucideAward className="w-6 h-6" />,
      href: '/dashboards/instructor/grading',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Settings',
      description: 'Manage your preferences',
      icon: <LucideSettings className="w-6 h-6" />,
      href: '/dashboards/instructor/settings',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
        <LucideSettings className="w-6 h-6 text-green-500" />
        Quick Access to Key Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className="block p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const CustomDatePicker: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
}> = ({ selectedDate, onChange }) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700 h-full flex flex-col">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
      Calendar
    </h2>
    <div className="flex-1 flex items-center justify-center">
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
    {
      title: "Total Students",
      value: 142,
      icon: Icon1,
      description: "Students enrolled across all courses"
    },
    {
      title: "Course Rating",
      value: 4.8,
      icon: Icon2,
      description: "Average rating from student feedback"
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      {/* Quick Stats Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border dark:border-gray-700 overflow-hidden backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 mb-6"
      >
        <h2 className="p-6 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent border-b dark:border-gray-700">
          Dashboard Overview
        </h2>
        <div className="p-6">
          <QuickStats stats={quickStats} />
        </div>
      </motion.div>

      {/* Quick Access to Key Features */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
        {/* Calendar Column */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-4 flex"
        >
          <div className="w-full">
            <CustomDatePicker
              selectedDate={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
            />
          </div>
        </motion.div>

        {/* Upcoming Classes Column */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-8 flex"
        >
          <div className="w-full">
            {error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400">
                <p className="flex items-center gap-2">
                  <LucideAlertCircle className="w-5 h-5" />
                  {error}
                </p>
              </div>
            ) : (
              <UpcomingClasses classes={filteredClasses} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Student Submissions */}
      <div className="mt-6">
        <RecentStudentSubmissions />
      </div>
    </motion.div>
  );
};

export default InstructorDashboard; 