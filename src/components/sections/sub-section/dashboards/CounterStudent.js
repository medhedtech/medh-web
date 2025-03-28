"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import counter1 from "@/assets/images/counter/books.png";
import counter2 from "@/assets/images/counter/Live.png";
import counter3 from "@/assets/images/counter/Student.png";
import CounterStudentdashboard from "@/components/shared/dashboards/CounterStudentdashboard";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Image from "next/image";

const CounterStudent = () => {
  const { getQuery } = useGetQuery();
  const [counts, setCounts] = useState({
    totalCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    liveCourses: 0,
    blendedCourses: 0,
    selfPacedCourses: 0
  });
  const [studentId, setStudentId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Retrieve student ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const student_id = localStorage.getItem("userId");
      if (student_id) {
        setStudentId(student_id);
      } else {
        console.log("Student ID not found in localStorage");
      }
    }
  }, []);

  // Fetch counts data once studentId is available
  useEffect(() => {
    if (studentId) {
      const fetchCounts = async () => {
        try {
          console.log("Fetching counts for student ID:", studentId);
          const enrollmentCountsUrl = `/enrolled/getCount/${studentId}`;
          
          await getQuery({
            url: enrollmentCountsUrl,
            onSuccess: (response) => {
              if (response?.data) {
                const { counts, progress } = response.data;
                
                setCounts({
                  totalCourses: counts.total || 0,
                  activeCourses: counts.active || 0,
                  completedCourses: counts.completed || 0,
                  averageProgress: progress.averageProgress || 0,
                  liveCourses: counts.byCourseType.live || 0,
                  blendedCourses: counts.byCourseType.blended || 0,
                  selfPacedCourses: counts.byCourseType.selfPaced || 0
                });
              }
            },
            onFail: (error) => {
              console.error("Failed to fetch enrollment counts:", error);
              setCounts({
                totalCourses: 0,
                activeCourses: 0,
                completedCourses: 0,
                averageProgress: 0,
                liveCourses: 0,
                blendedCourses: 0,
                selfPacedCourses: 0
              });
            }
          });
        } catch (error) {
          console.error("Failed to fetch counts:", error);
          setCounts({
            totalCourses: 0,
            activeCourses: 0,
            completedCourses: 0,
            averageProgress: 0,
            liveCourses: 0,
            blendedCourses: 0,
            selfPacedCourses: 0
          });
        }
      };

      fetchCounts();
    }
  }, [studentId, getQuery]);

  // Updated dashboard metrics with modern design
  const dashboardMetrics = [
    {
      name: "Total Courses",
      value: counts.totalCourses,
      description: "Total enrolled courses",
      icon: counter1,
      gradient: "from-violet-500 to-purple-500",
      shadowColor: "shadow-violet-500/20",
      iconBg: "bg-violet-500/10",
      textColor: "text-violet-500",
      progressColor: "bg-violet-500"
    },
    {
      name: "Live Classes",
      value: counts.liveCourses,
      description: "Interactive live sessions",
      icon: counter2,
      gradient: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/20",
      iconBg: "bg-blue-500/10",
      textColor: "text-blue-500",
      progressColor: "bg-blue-500"
    },
    {
      name: "Blended Learning",
      value: counts.blendedCourses,
      description: "Hybrid learning courses",
      icon: counter2,
      gradient: "from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
      iconBg: "bg-emerald-500/10",
      textColor: "text-emerald-500",
      progressColor: "bg-emerald-500"
    },
    {
      name: "Course Progress",
      value: `${counts.averageProgress}%`,
      description: "Overall completion",
      icon: counter3,
      gradient: "from-rose-500 to-pink-500",
      shadowColor: "shadow-rose-500/20",
      iconBg: "bg-rose-500/10",
      textColor: "text-rose-500",
      progressColor: "bg-rose-500",
      isProgress: true
    }
  ];

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

    const element = document.getElementById('counter-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section 
      id="counter-section"
      className="py-12 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
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
          className="max-w-2xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center space-x-1 mb-4">
            <span className="h-px w-8 bg-primary-500/50"></span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              Dashboard Overview
            </span>
            <span className="h-px w-8 bg-primary-500/50"></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Your Learning Progress
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Track your educational journey and monitor your achievements across all courses
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {dashboardMetrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 lg:p-8 ${metric.shadowColor} shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700/50`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${metric.gradient}`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`${metric.iconBg} rounded-xl p-3 w-12 h-12 mb-6 transition-transform duration-300 hover:scale-110`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={metric.icon}
                      alt={metric.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Value */}
                <h3 className={`text-3xl lg:text-4xl font-bold ${metric.textColor} mb-3`}>
                  {metric.value}
                </h3>

                {/* Title and Description */}
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold mb-2">
                    {metric.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {metric.description}
                  </p>
                </div>

                {/* Progress bar for progress metric */}
                {metric.isProgress && (
                  <div className="mt-6 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${metric.progressColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${counts.averageProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className={`absolute bottom-0 right-0 w-32 h-32 ${metric.gradient} opacity-10 rounded-full -mr-16 -mb-16 blur-2xl`}></div>
              <div className={`absolute top-0 left-0 w-24 h-24 ${metric.gradient} opacity-10 rounded-full -ml-12 -mt-12 blur-xl`}></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CounterStudent;