"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import counter1 from "@/assets/images/counter/books.png";
import counter2 from "@/assets/images/counter/Live.png";
import counter3 from "@/assets/images/counter/Student.png";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import { BookOpen, Clock, Award, Sparkles, TrendingUp, GraduationCap, BarChart4 } from "lucide-react";

interface CountsData {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  averageProgress: number;
  liveCourses: number;
  blendedCourses: number;
  selfPacedCourses: number;
}

interface MetricCardProps {
  name: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  secondaryColor: string;
  progressValue?: number;
}

const CounterStudent: React.FC = () => {
  const { getQuery } = useGetQuery();
  const [counts, setCounts] = useState<CountsData>({
    totalCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    liveCourses: 0,
    blendedCourses: 0,
    selfPacedCourses: 0
  });
  const [studentId, setStudentId] = useState<string | null>(null);
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

  // Metric Card Component
  const MetricCard: React.FC<MetricCardProps> = ({ 
    name, 
    value, 
    description, 
    icon, 
    accentColor, 
    secondaryColor, 
    progressValue 
  }) => {
    return (
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700/50 group"
      >
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${secondaryColor}`}></div>
        
        {/* Decorative elements */}
        <div className={`absolute -bottom-8 -right-8 w-40 h-40 rounded-full ${secondaryColor} opacity-5 blur-2xl transition-all duration-700 group-hover:scale-110`}></div>
        <div className={`absolute -top-8 -left-8 w-32 h-32 rounded-full ${secondaryColor} opacity-5 blur-xl transition-all duration-700 group-hover:scale-110`}></div>
        
        <div className="relative z-10">
          {/* Icon */}
          <div className={`${accentColor} rounded-xl p-3 w-12 h-12 mb-5 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center`}>
            {icon}
          </div>

          {/* Value */}
          <div className="flex items-end gap-2 mb-2">
            <h3 className={`text-3xl font-bold text-gray-900 dark:text-white`}>
              {value}
            </h3>
            {progressValue !== undefined && (
              <div className="flex items-center text-green-500 text-sm font-medium mb-1">
                <TrendingUp className="w-3 h-3 mr-1" /> 
                <span>+{progressValue}%</span>
              </div>
            )}
          </div>

          {/* Title and Description */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-1">
              {name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {description}
            </p>
          </div>

          {/* Progress bar for metrics with progress */}
          {progressValue !== undefined && (
            <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${accentColor}`}
              />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Define metrics with modern styling
  const metrics = [
    {
      name: "Total Enrolled Courses",
      value: counts.totalCourses,
      description: "All courses you've enrolled in",
      icon: <BookOpen className="w-6 h-6 text-white" />,
      accentColor: "bg-primary-500/90",
      secondaryColor: "from-primary-500 to-primary-600",
      progressValue: 5 // Example growth percentage
    },
    {
      name: "Average Completion",
      value: `${counts.averageProgress}%`,
      description: "Overall course progress",
      icon: <BarChart4 className="w-6 h-6 text-white" />,
      accentColor: "bg-violet-500/90",
      secondaryColor: "from-violet-500 to-purple-600",
      progressValue: counts.averageProgress
    },
    {
      name: "Live Classes",
      value: counts.liveCourses,
      description: "Interactive sessions",
      icon: <Clock className="w-6 h-6 text-white" />,
      accentColor: "bg-blue-500/90",
      secondaryColor: "from-blue-500 to-cyan-600"
    },
    {
      name: "Completed Courses",
      value: counts.completedCourses,
      description: "Finished learning paths",
      icon: <Award className="w-6 h-6 text-white" />,
      accentColor: "bg-emerald-500/90",
      secondaryColor: "from-emerald-500 to-teal-600"
    },
    {
      name: "Active Courses",
      value: counts.activeCourses,
      description: "Currently learning",
      icon: <Sparkles className="w-6 h-6 text-white" />,
      accentColor: "bg-amber-500/90",
      secondaryColor: "from-amber-500 to-yellow-600"
    },
    {
      name: "Blended Learning",
      value: counts.blendedCourses,
      description: "Hybrid course format",
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      accentColor: "bg-rose-500/90",
      secondaryColor: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <section 
      id="counter-section"
      className="relative overflow-hidden"
    >
      {/* Modern subtle pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative z-10"
      >
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          className="max-w-2xl mx-auto text-center mb-8"
        >
          <div className="inline-flex items-center justify-center space-x-1 mb-3">
            <span className="h-px w-8 bg-primary-500/50"></span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              Learning Stats
            </span>
            <span className="h-px w-8 bg-primary-500/50"></span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Your Learning Metrics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your educational journey with real-time statistics
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={index}
              name={metric.name}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              accentColor={metric.accentColor}
              secondaryColor={metric.secondaryColor}
              progressValue={metric.progressValue}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CounterStudent; 