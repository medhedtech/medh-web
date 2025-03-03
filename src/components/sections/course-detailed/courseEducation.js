"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Education from "@/assets/images/course-detailed/education.svg";
import Emi from "@/assets/images/course-detailed/emi-card.svg";
import Cer from "@/assets/images/course-detailed/certificate.png";
import Efforts from "@/assets/images/course-detailed/efforts.png";
import Assignments from "@/assets/images/course-detailed/assignment.png";
import Quizzes from "@/assets/images/course-detailed/quizzes.png";
import Mode from "@/assets/images/course-detailed/mode.svg";
import Course from "@/assets/images/course-detailed/course.svg";
import Session from "@/assets/images/course-detailed/session.svg";
import Classes from "@/assets/images/course-detailed/classes.svg";
import Projects from "@/assets/images/course-detailed/project.svg";
import Couresegray from "@/assets/images/course-detailed/course-gray.svg";
import Modegray from "@/assets/images/course-detailed/mode-gray.svg";
import Sessiongray from "@/assets/images/course-detailed/session-gray.svg";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { notFound } from "next/navigation";
import Preloader from "@/components/shared/others/Preloader";
import SignInModal from "@/components/shared/signin-modal";
import usePostQuery from "@/hooks/postQuery.hook";
import { toast } from "react-toastify";
import { HelpCircle, DollarSign, Award, BookOpen, Check, Star, Zap, Calendar, Users, Clock, ArrowRight, Bookmark, Gift, Sparkles, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, GraduationCap, Info } from "lucide-react";

function CourseEducation({ courseId, courseDetails }) {
  const { getQuery, loading } = useGetQuery();
  const { postQuery } = usePostQuery();
  const [courseDetails1, setCourseDetails1] = useState(courseDetails || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [formattedContent, setFormattedContent] = useState({ overview: '', benefits: [] });
  const [activeTab, setActiveTab] = useState(1);
  const [isEnrollButtonHovered, setIsEnrollButtonHovered] = useState(false);

  const parseDescription = (description) => {
    if (!description) return { overview: '', benefits: [] };

    const parts = description.split('Benefits');
    let overview = '';
    let benefits = [];

    if (parts.length > 0) {
      const overviewPart = parts[0].replace('Program Overview', '').trim();
      overview = overviewPart;

      if (parts.length > 1) {
        benefits = parts[1]
          .split('-')
          .map(benefit => benefit.trim())
          .filter(benefit => benefit.length > 0);
      }
    }

    return { overview, benefits };
  };

  useEffect(() => {
    if (courseId && !courseDetails) {
      fetchCourseDetails(courseId);
    } else if (courseDetails) {
      setCourseDetails1(courseDetails);
    }
  }, [courseId, courseDetails]);

  useEffect(() => {
    if (courseDetails1?.course_description) {
      const parsed = parseDescription(courseDetails1.course_description);
      setFormattedContent(parsed);
    }
  }, [courseDetails1?.course_description]);

  const fetchCourseDetails = async (id) => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${id}`,
        onSuccess: (data) => {
          setCourseDetails1(data);
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
    }
  };

  // Course highlights
  const highlights = [
    { 
      label: "Industry-recognized certification", 
      value: courseDetails1?.is_Certification === "Yes",
      icon: Award,
      color: "green"
    },
    { 
      label: "Hands-on assignments", 
      value: courseDetails1?.is_Assignments === "Yes",
      icon: BookOpen,
      color: "blue"
    },
    { 
      label: "Real-world projects", 
      value: courseDetails1?.is_Projects === "Yes",
      icon: Zap,
      color: "purple"
    },
    { 
      label: "Interactive quizzes", 
      value: courseDetails1?.is_Quizes === "Yes",
      icon: Star,
      color: "amber"
    },
    { 
      label: "Flexible payment options", 
      value: true,
      icon: DollarSign,
      color: "emerald"
    },
    {
      label: "Lifetime access to content",
      value: true,
      icon: Bookmark,
      color: "pink"
    },
    {
      label: "Course completion certificate",
      value: courseDetails1?.is_Certification === "Yes",
      icon: GraduationCap,
      color: "orange"
    }
  ];

  // Course details
  const courseStats = [
    {
      label: "Duration",
      value: courseDetails1?.course_duration || "10 weeks",
      icon: Clock,
      color: "blue"
    },
    {
      label: "Course Level",
      value: courseDetails1?.course_grade || "All Levels",
      icon: Lightbulb,
      color: "amber" 
    },
    {
      label: "Enrolled Students",
      value: courseDetails1?.enrolled_students || "500+",
      icon: Users,
      color: "purple"
    },
    {
      label: "Start Date",
      value: courseDetails1?.start_date || "Flexible",
      icon: Calendar,
      color: "green"
    }
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("userId");

    if (!token || !studentId) {
      setIsModalOpen(true);
      return;
    }
    
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Please log in first.");
      return;
    }
    
    if (courseDetails1) {
      const courseFee = Number(courseDetails1?.course_fee) || 59500;
      const options = {
        key: "rzp_test_Rz8NSLJbl4LBA5",
        amount: courseFee * 100 * 84.47,
        currency: "INR",
        name: courseDetails1?.course_title,
        description: `Payment for ${courseDetails1?.course_title}`,
        image: Education,
        handler: async function (response) {
          toast.success("Payment Successful!");
          await subscribeCourse(studentId, courseId, courseFee);
        },
        prefill: {
          name: "Medh Student",
          email: "medh@student.com",
          contact: "9876543210",
        },
        theme: {
          color: "#7ECA9D",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };

  const subscribeCourse = async (studentId, courseId, amount) => {
    try {
      await postQuery({
        url: apiUrls?.Subscription?.AddSubscription,
        postData: {
          student_id: studentId,
          course_id: courseId,
          amount: amount,
          status: "success",
        },
        onSuccess: async () => {
          await enrollCourse(studentId, courseId);
        },
        onFail: (err) => {
          console.error("Subscription failed:", err);
          toast.error("Error in subscription. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error in subscribing course:", error);
      toast.error("Something went wrong! Please try again later.");
    }
  };

  const enrollCourse = async (studentId, courseId) => {
    try {
      await postQuery({
        url: apiUrls?.EnrollCourse?.enrollCourse,
        postData: {
          student_id: studentId,
          course_id: courseId,
        },
        onSuccess: () => {
          toast.success("Hurray! You are enrolled successfully.");
        },
        onFail: (err) => {
          console.error("Enrollment failed:", err);
          toast.error("Error enrolling in the course. Please try again!");
        },
      });
    } catch (error) {
      console.error("Error enrolling course:", error);
      toast.error("Something went wrong! Please try again later.");
    }
  };

  const tabData = [
    {
      id: 1,
      name: "Overview",
      icon: Info,
      content: (
        <div className="relative">
          <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${!showFullDescription && 'line-clamp-4'}`}>
            {formattedContent.overview}
          </p>
          {formattedContent.overview.length > 150 && (
            <motion.button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mt-2 hover:underline focus:outline-none flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showFullDescription ? 'Show less' : 'Read more'}
              <ArrowRight className={`w-3 h-3 ml-1 transition-transform duration-300 ${showFullDescription ? 'rotate-90' : ''}`} />
            </motion.button>
          )}
        </div>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      icon: Gift,
      content: (
        <div>
          <ul className="list-none space-y-3">
            {formattedContent.benefits.map((benefit, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm mt-0.5">
                  <Check size={14} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 3,
      name: "Stats",
      icon: Calculator,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {courseStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  <stat.icon size={14} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{stat.value}</span>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <Preloader />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, times: [0, 0.5, 1] }}
            className="absolute -top-10 -right-10"
          >
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </motion.div>
        </div>
      </div>
    );
  }

  const getColorGradient = (index) => {
    const gradients = [
      'from-emerald-500 to-green-500',
      'from-blue-500 to-indigo-500',
      'from-purple-500 to-violet-500',
      'from-amber-500 to-orange-500',
      'from-pink-500 to-rose-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-6xl mx-auto px-4 py-6 bg-white dark:bg-[#050622]"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Course Image and Title */}
        <motion.div 
          variants={fadeInUp}
          className="lg:w-2/3"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-[300px] md:h-[400px] group">
              <Image
                src={courseDetails1?.course_image || Education}
                alt={courseDetails1?.course_title || "Course"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 p-5 w-full"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-medium rounded-full">
                    {courseDetails1?.course_grade || "All Levels"}
                  </span>
                  {courseDetails1?.is_Popular === "Yes" && (
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1 text-amber-500" />
                      Popular
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                  {courseDetails1?.course_title || "Digital Marketing with Data Analytics"}
                </h1>
                <div className="flex flex-wrap gap-3 mt-3">
                  {courseDetails1?.course_duration && (
                    <div className="flex items-center bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {courseDetails1.course_duration}
                    </div>
                  )}
                  {courseDetails1?.students_count && (
                    <div className="flex items-center bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      <Users className="w-3 h-3 mr-1" />
                      {courseDetails1.students_count} students
                    </div>
                  )}
                  {courseDetails1?.class_type && (
                    <div className="flex items-center bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {courseDetails1.class_type}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            
            <div className="p-5">
              {/* Course Description */}
              {courseDetails1?.course_description && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                    <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                      About This Course
                    </span>
                    <div className="ml-2 h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                  </h2>
                  
                  {/* Tabs */}
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-2 mb-6" 
                    role="tablist"
                  >
                    {tabData.map((tab, index) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2.5 transition rounded-lg flex items-center gap-2 ${
                          activeTab === tab.id
                            ? `bg-gradient-to-r ${getColorGradient(index)} text-white font-semibold shadow-lg`
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                      >
                        {<tab.icon className="w-4 h-4" />}
                        {tab.name}
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      transition={{ duration: 0.5 }}
                      className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-5 border border-gray-200 dark:border-gray-700 rounded-lg"
                      role="tabpanel"
                      id={`panel-${activeTab}`}
                      aria-labelledby={`tab-${activeTab}`}
                    >
                      {tabData.find(tab => tab.id === activeTab)?.content}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pricing and Enrollment */}
        <motion.div 
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="lg:w-1/3"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 sticky top-24">
            {/* Price Card */}
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-blue-50 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700 p-6 rounded-t-xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-500/10 backdrop-blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-green-500/10 backdrop-blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Course Fee</p>
                    <div className="flex items-center">
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-50">
                        ${courseDetails1?.course_fee || "595"}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">USD</span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white dark:bg-gray-600 p-2.5 rounded-full shadow-md"
                  >
                    <GraduationCap className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
                  </motion.div>
                </div>
                
                <motion.button
                  onMouseEnter={() => setIsEnrollButtonHovered(true)}
                  onMouseLeave={() => setIsEnrollButtonHovered(false)}
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-lg font-medium flex items-center justify-center mb-4 shadow-md overflow-hidden group"
                >
                  <AnimatePresence>
                    {isEnrollButtonHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700"
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10 flex items-center">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
                
                <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 space-x-3 font-medium">
                  <span className="flex items-center">
                    <Check size={14} className="mr-1 text-emerald-500" />
                    Lifetime access
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span className="flex items-center">
                    <Check size={14} className="mr-1 text-emerald-500" />
                    Money-back guarantee
                  </span>
                </div>
              </div>
            </div>

            {/* Course Highlights */}
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                <span>What You'll Get</span>
                <div className="ml-2 h-px flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent"></div>
              </h3>
              <div className="space-y-4">
                {highlights
                  .filter(item => item.value)
                  .map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`p-2 rounded-full mr-3 bg-${item.color}-100 dark:bg-${item.color}-900/50 shadow-sm`}>
                        {item.icon && <item.icon size={16} className={`text-${item.color}-600 dark:text-${item.color}-400`} />}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {courseDetails1?.class_type || "Live Online Classes"}
                    </span>
                  </div>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Limited Seats
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
}

export default CourseEducation;
