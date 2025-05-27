"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import {
  Trophy,
  Award,
  Calendar,
  Clock,
  Star,
  Download,
  Eye,
  BookOpen,
  CheckCircle,
  Target
} from 'lucide-react';

/**
 * CompletedCoursesMain - Component that displays the completed courses content
 * within the student dashboard layout
 */
const CompletedCoursesMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "recent" | "certificates">("all");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Mock completed courses data
  const completedCourses = useMemo(() => [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      instructor: "Sarah Johnson",
      completedDate: "2024-01-15",
      duration: "8 weeks",
      rating: 4.8,
      certificate: true,
      image: "/images/courses/digital-marketing.jpg",
      skills: ["SEO", "Social Media", "Analytics"],
      progress: 100
    },
    {
      id: 2,
      title: "Data Science with Python",
      instructor: "Dr. Michael Chen",
      completedDate: "2024-02-20",
      duration: "12 weeks",
      rating: 4.9,
      certificate: true,
      image: "/images/courses/data-science.jpg",
      skills: ["Python", "Machine Learning", "Data Analysis"],
      progress: 100
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      instructor: "Emma Rodriguez",
      completedDate: "2024-03-10",
      duration: "6 weeks",
      rating: 4.7,
      certificate: true,
      image: "/images/courses/ui-ux.jpg",
      skills: ["Figma", "User Research", "Prototyping"],
      progress: 100
    },
    {
      id: 4,
      title: "Project Management Essentials",
      instructor: "James Wilson",
      completedDate: "2024-03-25",
      duration: "10 weeks",
      rating: 4.6,
      certificate: false,
      image: "/images/courses/project-management.jpg",
      skills: ["Agile", "Scrum", "Leadership"],
      progress: 100
    }
  ], []);

  // Achievement stats
  const achievementStats = useMemo(() => ({
    totalCompleted: completedCourses.length,
    certificatesEarned: completedCourses.filter(course => course.certificate).length,
    totalHours: 240,
    averageRating: 4.75
  }), [completedCourses]);

  // Filter courses based on selected filter
  const filteredCourses = useMemo(() => {
    switch (selectedFilter) {
      case "recent":
        return completedCourses.slice(0, 2);
      case "certificates":
        return completedCourses.filter(course => course.certificate);
      default:
        return completedCourses;
    }
  }, [completedCourses, selectedFilter]);

  // Achievement Stats Component
  const AchievementStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{achievementStats.totalCompleted}</div>
          <div className="text-primary-100 text-sm font-medium">Courses Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{achievementStats.certificatesEarned}</div>
          <div className="text-primary-100 text-sm font-medium">Certificates Earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{achievementStats.totalHours}h</div>
          <div className="text-primary-100 text-sm font-medium">Learning Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl lg:text-3xl font-bold mb-2">{achievementStats.averageRating}</div>
          <div className="text-primary-100 text-sm font-medium">Avg. Rating</div>
        </div>
      </div>
    </div>
  );

  // Course Card Component
  const CourseCard = ({ course }: { course: any }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {course.instructor}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Completed {new Date(course.completedDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {course.duration}
            </div>
          </div>
        </div>
        {course.certificate && (
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {course.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {course.rating}
          </span>
        </div>
        <div className="flex items-center text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Completed</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
          <Eye className="w-4 h-4 mr-2" />
          Review
        </button>
        {course.certificate && (
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
            <Download className="w-4 h-4 mr-2" />
            Certificate
          </button>
        )}
      </div>
    </div>
  );

  // Course Preloader
  const CoursePreloader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="flex space-x-2 mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <CoursePreloader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Completed Courses
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Celebrate your achievements and access your completed courses and certificates
          </p>
        </motion.div>



        {/* Filter Tabs */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: "All Courses", icon: BookOpen },
                { key: "recent", label: "Recent", icon: Clock },
                { key: "certificates", label: "With Certificates", icon: Award }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key as any)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === key
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Complete some courses to see them here
              </p>
              <Link
                href="/dashboards/student/all-courses"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompletedCoursesMain; 