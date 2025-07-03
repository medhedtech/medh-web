import React from 'react';
import { ICourseFormData } from '@/types/course.types';
import { 
  BookOpen, 
  GraduationCap, 
  Languages, 
  Users, 
  Clock,
  Star,
  Play,
  Award,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { buildAdvancedComponent, getResponsive } from '@/utils/designSystem';
import Image from 'next/image';

interface CourseOverviewProps {
  courseData?: Partial<ICourseFormData>;
  courseImage?: string | null;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({
  courseData,
  courseImage
}) => {
  // Mock course data for display if no data provided
  const mockCourseData = {
    course_title: "Advanced Web Development",
    course_subtitle: "Master Modern Frontend & Backend Technologies",
    course_category: "Technology",
    course_level: "Intermediate",
    class_type: "Live Courses",
    language: "English",
    assigned_instructor: "John Smith",
    course_image: courseImage || "/images/courses/web-development.jpg"
  };

  const displayData = { ...mockCourseData, ...courseData };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/30">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'tablet' })}
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Course Preview
            </div>
            <h1 className={`${getResponsive.fluidText('heading')} font-bold text-gray-900 dark:text-white`}>
              Course Overview
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Preview how your course will appear to students
            </p>
          </div>
        </motion.div>

        {/* Course Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className={buildAdvancedComponent.glassCard({ 
            variant: 'primary', 
            hover: true
          })}>
            <div className="overflow-hidden rounded-2xl">
              {/* Course Image */}
              <div className="relative h-64 md:h-80 bg-gradient-to-r from-indigo-500 to-purple-600">
                {displayData.course_image ? (
                  <Image
                    src={displayData.course_image}
                    alt={displayData.course_title || "Course"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-medium">Course Image</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Course Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium">
                    <Award className="w-4 h-4 mr-1.5" />
                    {displayData.class_type || "Live Course"}
                  </span>
            </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </motion.button>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 md:p-8">
                {/* Course Category */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
                    {displayData.course_category || "Technology"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {displayData.course_level || "Intermediate"}
                  </span>
                </div>

                {/* Course Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {displayData.course_title || "Course Title"}
                </h2>

                {/* Course Subtitle */}
                {displayData.course_subtitle && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {displayData.course_subtitle}
                  </p>
                )}

                {/* Course Meta Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {displayData.assigned_instructor || "TBA"}
                      </p>
            </div>
          </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Languages className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Language</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {displayData.language || "English"}
                      </p>
            </div>
          </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        8-12 weeks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        4.8/5
                    </p>
                    </div>
                  </div>
              </div>

                {/* Course Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Course Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    This comprehensive course covers modern web development techniques, 
                    including frontend frameworks, backend technologies, and full-stack 
                    development practices. Perfect for developers looking to advance their skills.
                  </p>
            </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Enroll Now
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseOverview; 