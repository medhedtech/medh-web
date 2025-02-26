import React from "react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import progress1 from "@/assets/images/dashbord/progress1.png";
import progress2 from "@/assets/images/dashbord/progress2.png";
import { ChevronRight, Zap } from "lucide-react";

const ProgressOverview = () => {
  const courses = [
    {
      id: 1,
      title: "Web Development",
      instructor: "John Doe",
      progress: 40,
      image: progress1,
      lastAccessed: "2 days ago",
      nextMilestone: "Complete JavaScript Basics",
    },
    {
      id: 2,
      title: "Java Full Stack",
      instructor: "John Doe",
      progress: 70,
      image: progress2,
      lastAccessed: "1 day ago",
      nextMilestone: "Spring Boot Project",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-8 px-6 md:px-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">
            <Zap size={14} className="mr-1" />
            Course Progress
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Progress Overview
          </h2>
        </div>
        
        <motion.a
          href="/dashboards/student-progress-overview"
          className="group inline-flex items-center px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All
          <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.a>
      </div>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {courses.map((course) => (
          <motion.div
            key={course.id}
            variants={itemVariants}
            className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700/50"
          >
            {/* Progress indicator background */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-primary-200 dark:bg-primary-800/30 w-full"
            >
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 transition-all duration-700"
                style={{ width: `${course.progress}%` }}
              />
            </div>

            <div className="p-6 relative">
              {/* Course content */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={course.image.src} 
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Instructor: {course.instructor}
                  </p>
                  
                  {/* Progress details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {course.progress}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last accessed:</span>
                      <span className="text-gray-700 dark:text-gray-300">{course.lastAccessed}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Next milestone:
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                          {course.nextMilestone}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ProgressOverview;
