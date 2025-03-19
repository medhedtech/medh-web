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
    enrolledCourses: 0,
    liveCourses: 0,
    selfPacedCourses: 0,
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
        staggerChildren: 0.2
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
          // Log the student ID being used
          console.log("Fetching counts for student ID:", studentId);
          
          // Create proper API URL for enrollment counts
          const enrollmentCountsUrl = `/enroll/getCount/${studentId}`;
          
          // Log the URL being used
          console.log("Enrollment counts URL:", enrollmentCountsUrl);

          // Fetch enrollment data using the getQuery hook
          await getQuery({
            url: enrollmentCountsUrl,
            onSuccess: (data) => {
              console.log("Enrollment counts response:", data);
              
              // Extract data from the response using correct property names
              const totalEnrollments = data?.totalEnrollments || 0;
              const liveCourses = data?.liveCoursesCount || 0;
              const selfPacedCourses = data?.selfPackedCourses || 0;
              
              // Update the counts with data from response
              console.log("Setting counts:", { 
                enrolledCourses: totalEnrollments,
                liveCourses,
                selfPacedCourses
              });
              
              setCounts({
                enrolledCourses: totalEnrollments,
                liveCourses,
                selfPacedCourses,
              });
            },
            onFail: (error) => {
              console.error("Failed to fetch enrollment counts:", error);
              
              // Set default values if the API fails
              setCounts({
                enrolledCourses: 0,
                liveCourses: 0,
                selfPacedCourses: 0,
              });
            }
          });
        } catch (error) {
          console.error("Failed to fetch counts:", error);
          // Set default values in case of error
          setCounts({
            enrolledCourses: 0,
            liveCourses: 0,
            selfPacedCourses: 0,
          });
        }
      };

      fetchCounts();
    }
  }, [studentId, getQuery]);

  // Prepare dashboard data with enhanced styling and modern gradients
  const dashboardCounts = [
    {
      name: "Enrolled Courses",
      image: counter1,
      data: counts.enrolledCourses,
      description: "Total courses you've enrolled in",
      gradient: "from-[#FF6B6B] to-[#FF8E53]",
      hoverGradient: "hover:from-[#FF8E53] hover:to-[#FF6B6B]",
      iconBg: "bg-red-50 dark:bg-red-900/20",
      numberColor: "text-[#FF6B6B] dark:text-[#FF8E53]"
    },
    {
      name: "Live Courses",
      image: counter2,
      data: counts.liveCourses,
      description: "Interactive live sessions",
      gradient: "from-[#4E65FF] to-[#92EFFD]",
      hoverGradient: "hover:from-[#92EFFD] hover:to-[#4E65FF]",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      numberColor: "text-[#4E65FF] dark:text-[#92EFFD]"
    },
    {
      name: "Self-paced Courses",
      image: counter3,
      data: counts.selfPacedCourses,
      description: "Learn at your own pace",
      gradient: "from-[#00C853] to-[#69F0AE]",
      hoverGradient: "hover:from-[#69F0AE] hover:to-[#00C853]",
      iconBg: "bg-green-50 dark:bg-green-900/20",
      numberColor: "text-[#00C853] dark:text-[#69F0AE]"
    },
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
      className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Modern background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
            Your Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent mb-4">
            Your Learning Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Track your progress and achievements across different learning paths
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {dashboardCounts.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700/50`}
            >
              <div className={`p-8 relative`}>
                {/* Gradient background with transition */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated border gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} ${item.hoverGradient} opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl`}></div>
                
                <div className="relative z-10">
                  <div className={`flex items-center justify-center mb-6 ${item.iconBg} rounded-2xl p-4 w-20 h-20 mx-auto group-hover:scale-110 transition-transform duration-500`}>
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="contain"
                        className="transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <h3 className={`text-4xl font-bold ${item.numberColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {item.data}
                  </h3>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {item.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CounterStudent;