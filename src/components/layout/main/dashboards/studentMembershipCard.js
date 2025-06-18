"use client";
import React, { useState, useEffect } from "react";
import StudentMainMembership from "./studentMainMembership";
import Image from "next/image";
import MembershipModal from "./MembershipModal";
import SubscriptionLogo from "@/assets/images/student-dashboard/subscription.svg";
import ClockLogo from "@/assets/images/student-dashboard/clock.svg";
import VideoClass from "@/assets/images/student-dashboard/video-class.svg";
import FallBackUrl from "@/assets/images/courses/image1.png";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Search, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const StudentMembershipCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [courses, setCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();
  const [memberships, setMemberships] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [membershipDetails, setMembershipDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
      transition: {
        duration: 0.3
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
    }

    const fetchCourses = async () => {
      try {
        await getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (res) => {
            setCourses(res || []);
          },
          onFail: (err) => {
            console.error("Error fetching courses:", err);
            showToast.error("Failed to fetch courses. Please try again.");
          },
        });
      } catch (err) {
        console.error(err);
        showToast.error("An error occurred while fetching courses.");
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchMemberships = () => {
      if (hasFetched) return;
      if (!studentId || courses.length === 0) return;
      
      getQuery({
        url: `${apiUrls?.Membership?.getMembershipBbyStudentId}/${studentId}`,
        onSuccess: (res) => {
          setMemberships(res?.data || []);
          setHasFetched(true);

          const memberships = res?.data || [];
          const membershipDetails = memberships.map((membership) => {
            const categoryNames = membership.category_ids?.map(
              (category) => category.category_name
            ) || [];

            const groupedCourses = categoryNames.map((category) =>
              courses.filter((course) => course.category === category)
            );

            const enrolledCourses = groupedCourses.flat();

            return {
              ...membership,
              courses: enrolledCourses,
            };
          });

          setMembershipDetails(membershipDetails);
        },
        onFail: (err) => {
          console.error("Error fetching memberships:", err);
          showToast.error("Failed to fetch memberships. Please try again.");
        },
      });
    };

    fetchMemberships();
  }, [studentId, courses]);

  const filteredMemberships = membershipDetails.map(membership => ({
    ...membership,
    courses: membership.courses.filter(course => 
      course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(membership => membership.courses.length > 0);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <Loader2 className="w-6 h-6 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading memberships...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-10 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <Crown className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Membership
            </h2>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Bar */}
            <motion.div 
              variants={itemVariants}
              className="relative w-full sm:w-64"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
              />
            </motion.div>

            {/* Upgrade Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Image src={SubscriptionLogo} width={24} height={24} alt="Subscription" className="w-6 h-6" />
              <span className="font-semibold">Upgrade Membership</span>
            </motion.button>
          </div>
        </div>

        {/* Membership Grid */}
        <AnimatePresence mode="wait">
          {filteredMemberships.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {filteredMemberships.map((membership) =>
                membership.courses.map((course) => (
                  <motion.div
                    key={course.course_id || `${membership._id}-${course.course_title}`}
                    variants={itemVariants}
                    layout
                  >
                    <StudentMainMembership
                      courseCategory={course.category}
                      courseImage={course.course_image}
                      title={course.course_title}
                      typeLabel={course.course_category === "Live Courses" ? "Certificate" : "Diploma"}
                      sessions={course.no_of_Sessions}
                      duration={course.course_duration}
                      sessionDuration={course.session_duration}
                      membershipName={membership.plan_type.charAt(0).toUpperCase() + membership.plan_type.slice(1).toLowerCase()}
                      expiryDate={membership.expiry_date}
                      iconVideo={VideoClass}
                      iconClock={ClockLogo}
                      fallbackImage={FallBackUrl}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
            >
              <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-900/20 mb-4">
                <AlertCircle className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No courses found" : "No memberships available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search term to find what you're looking for."
                  : "Start your learning journey by upgrading to one of our membership plans."}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  View Membership Plans
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Membership Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <MembershipModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default StudentMembershipCard;
