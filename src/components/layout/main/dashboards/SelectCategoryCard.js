import React, { useEffect, useState } from "react";
import { Users, Clock, FileText, ChevronDown, ChevronUp, Loader2, AlertCircle, BookOpen } from "lucide-react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import Image from "next/image";
import SelectCourseCard from './SelectCourseCard'
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryCard({ category, isSelected, onClick }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { getQuery } = useGetQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isDown, setIsDown] = useState(false);

  const imgSrc = category?.category_image || AiMl;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (res) => {
            const coursesData = Array.isArray(res) ? res : [];
            setCourses(coursesData);
            console.log("Fetched courses:", coursesData);
          },
          onFail: (err) => {
            console.error("Error fetching courses:", err);
            setError("Failed to load courses. Please try again later.");
            setCourses([]);
          },
        });
      } catch (err) {
        console.error("Error in fetchCourses:", err);
        setError("Failed to load courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (isPreviewOpen) {
      fetchCourses();
    }
  }, [isPreviewOpen]);

  const filteredCourses = Array.isArray(courses) 
    ? courses.filter((course) => course?.category === category?.category_name)
    : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={onClick}
      className={`group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl transition-all duration-300 overflow-hidden ${
        isSelected
          ? "ring-2 ring-primary-500 shadow-lg shadow-primary-500/10"
          : "border border-gray-200 dark:border-gray-700/50 hover:border-primary-500/50 hover:shadow-xl"
      }`}
    >
      <div className="p-6">
        <div className="flex gap-6">
          {/* Image Container */}
          <motion.div 
            className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={imgSrc}
              alt={category?.category_name || "Category"}
              className="w-full h-full object-cover"
              width={128}
              height={128}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
              isSelected ? "opacity-70" : "opacity-0 group-hover:opacity-50"
            }`} />
          </motion.div>

          {/* Content Container */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                {category?.category_name || "Untitled Category"}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20">
                  <BookOpen className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {filteredCourses?.length || 0} courses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-500 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            setIsPreviewOpen(!isPreviewOpen);
            setIsDown((prev) => !prev);
          }}
        >
          {!isDown ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Preview Section */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                    <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Loading courses...
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {error}
                    </span>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    Courses in {category?.category_name || "this category"}
                  </h4>
                  
                  {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {filteredCourses.map((course) => (
                        <motion.div
                          key={course._id}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
                        >
                          <SelectCourseCard course={course} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        No courses available in this category yet.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
