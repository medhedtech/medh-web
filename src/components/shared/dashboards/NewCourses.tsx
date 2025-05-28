"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook"; 
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, ChevronRight, Loader2, AlertCircle, Filter } from "lucide-react";
import { toast } from "react-toastify";

interface Course {
  _id: string;
  course_title: string;
  course_description?: string;
  course_image?: string;
  course_fee: number;
  course_tag?: string;
  category?: string;
  rating?: number;
  instructor?: {
    name: string;
    image?: string;
  };
}

const NewCourses: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [limit] = useState<number>(4);
  const [minFee, setMinFee] = useState<string>("");
  const [maxFee, setMaxFee] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token && !!userId);
    
    fetchNewCourses();
  }, []);

  const fetchNewCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = localStorage.getItem("userId") || "";
      
      await getQuery({
        url: apiUrls.courses.getNewCourses({
          page: 1,
          limit: limit,
          course_tag: "Live",
          status: "Published",
          user_id: userId,
          sort_by: "createdAt",
          sort_order: "desc"
        }),
        onSuccess: (response: any) => {
          const coursesData = response?.courses || [];
          
          if (Array.isArray(coursesData) && coursesData.length > 0) {
            setCourses(coursesData);
          } else {
            setError("No new courses are available at the moment.");
            setCourses([]);
          }
          
          setLoading(false);
        },
        onError: (error: any) => {
          console.error("Error fetching new courses:", error);
          setError("Failed to load new courses. Please try again later.");
          setCourses([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Exception in fetchNewCourses:", error);
      setError("An unexpected error occurred. Please try again later.");
      setCourses([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const applyFilter = () => {
      const filtered = courses.filter((course) => {
        const coursePrice = course?.course_fee || 0;
        const isAboveMin = minFee ? coursePrice >= Number(minFee) : true;
        const isBelowMax = maxFee ? coursePrice <= Number(maxFee) : true;
        const matchesTitle = course?.course_title
          ?.toLowerCase()
          ?.includes(searchTitle.toLowerCase());
        const isValidCourseTag =
          course?.course_tag !== "Pre-Recorded" &&
          course?.course_tag !== "Free";

        return isAboveMin && isBelowMax && matchesTitle && isValidCourseTag;
      });
      setFilteredCourses(filtered);
    };
    applyFilter();
  }, [minFee, maxFee, searchTitle, courses]);

  const handleCardClick = (id: string) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  const handleFilterReset = () => {
    setMinFee("");
    setMaxFee("");
    setSearchTitle("");
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <Loader2 className="w-6 h-6 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading new courses...</span>
        </motion.div>
      </div>
    );
  }

  const displayCourses = (filteredCourses.length > 0 ? filteredCourses : courses)
    .filter((course) => course.course_fee !== 0);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-8"
    >
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-6 mb-8 px-6 pt-8">
          {/* Left side - Icon and Title */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/[0.07] dark:to-primary-600/[0.07] border border-primary-500/10 dark:border-primary-500/[0.05]">
              <BookOpen className="w-6 h-6 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                New Courses
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover the latest courses available
              </p>
            </div>
          </motion.div>

          {/* Right side - Search, Filter and View All */}
          <div className="flex items-center gap-4">
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-72 px-4 py-2.5 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </motion.button>
            
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/courses?filter=new')}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 flex items-center gap-2 whitespace-nowrap"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Filter Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum Fee
                    </label>
                    <input
                      type="number"
                      value={minFee}
                      onChange={(e) => setMinFee(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Min fee..."
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Maximum Fee
                    </label>
                    <input
                      type="number"
                      value={maxFee}
                      onChange={(e) => setMaxFee(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Max fee..."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleFilterReset}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Course Grid */}
        {displayCourses.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg"
          >
            {/* Header inside empty state */}
            <div className="flex items-center justify-between gap-6 p-6 border-b border-gray-100 dark:border-gray-700">
              {/* Left side - Icon and Title */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/[0.07] dark:to-green-600/[0.07] border border-green-500/10 dark:border-green-500/[0.05]">
                  <BookOpen className="w-6 h-6 text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    New Courses
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {searchTitle || minFee || maxFee 
                      ? "Search and discover courses that match your criteria"
                      : "No new courses are available at the moment"}
                  </p>
                </div>
              </div>

              {/* Right side - Search and View All */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="w-72 px-4 py-2.5 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                <button
                  onClick={() => router.push('/courses?filter=new')}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 flex items-center gap-2 whitespace-nowrap"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Empty state content */}
            <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
              <div className="p-4 rounded-full bg-green-50 dark:bg-green-900/20 mb-4">
                <BookOpen className="w-8 h-8 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                {searchTitle || minFee || maxFee
                  ? "No courses match your search criteria. Try adjusting your filters."
                  : "No new courses are available at the moment. Please check back later."}
              </p>
              <button
                onClick={() => router.push('/courses')}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Browse All Courses
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {displayCourses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                >
                  <CourseCard
                    key={course._id}
                    {...course}
                    onClick={() => handleCardClick(course._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NewCourses; 