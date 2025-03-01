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
import { HelpCircle, DollarSign, Award, BookOpen, Check, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, GraduationCap, Info } from "lucide-react";

function CourseEducation({ courseId }) {
  const { getQuery, loading } = useGetQuery();
  const { postQuery } = usePostQuery();
  const [courseDetails1, setCourseDetails1] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [formattedContent, setFormattedContent] = useState({ overview: '', benefits: [] });
  const [activeTab, setActiveTab] = useState(1);

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
    if (courseId) {
      fetchCourseDetails(courseId);
    } else {
      notFound();
    }
  }, []);

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
      icon: Award
    },
    { 
      label: "Hands-on assignments", 
      value: courseDetails1?.is_Assignments === "Yes",
      icon: BookOpen
    },
    { 
      label: "Real-world projects", 
      value: courseDetails1?.is_Projects === "Yes",
      icon: Zap
    },
    { 
      label: "Interactive quizzes", 
      value: courseDetails1?.is_Quizes === "Yes",
      icon: Star
    },
    { 
      label: "Flexible payment options", 
      value: true,
      icon: DollarSign
    },
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
          <p className={`text-gray-600 dark:text-gray-300 ${!showFullDescription && 'line-clamp-3'}`}>
            {formattedContent.overview}
          </p>
          {formattedContent.overview.length > 150 && (
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-green-600 dark:text-green-400 font-medium text-sm mt-1 hover:underline focus:outline-none"
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      icon: Star,
      content: (
        <div>
          <ul className="list-none space-y-2">
            {formattedContent.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="p-1 rounded-full mt-1 bg-green-100 dark:bg-green-900/50">
                  <Award size={12} className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white dark:bg-[#050622]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Course Image and Title */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-[300px] md:h-[400px] group">
              <Image
                src={courseDetails1?.course_image || Education}
                alt={courseDetails1?.course_title || "Course"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full mb-2">
                  {courseDetails1?.course_grade || "All Levels"}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                  {courseDetails1?.course_title || "Digital Marketing with Data Analytics"}
                </h1>
              </div>
            </div>
            
            <div className="p-5">
              {/* Course Description */}
              {courseDetails1?.course_description && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">About This Course</h2>
                  
                  {/* Tabs */}
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex space-x-2 mb-6" 
                    role="tablist"
                  >
                    {tabData.map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 transition rounded-md flex items-center gap-2 ${
                          activeTab === tab.id
                            ? "bg-primaryColor text-white font-semibold shadow-lg"
                            : "bg-white text-primaryColor border border-primaryColor hover:bg-primaryColor/10"
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
                      className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
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
        </div>

        {/* Pricing and Enrollment */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm sticky top-24">
            {/* Price Card */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-5 rounded-t-xl">
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
                <div className="bg-white dark:bg-gray-600 p-2 rounded-full shadow-sm">
                  <Award className="h-6 w-6 text-green-500 dark:text-green-400" />
                </div>
              </div>
              
              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium flex items-center justify-center mb-3 shadow-sm"
              >
                Enroll Now
              </button>
              
              <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-300 space-x-2">
                <span className="flex items-center">
                  <Check size={14} className="mr-1 text-green-500" />
                  Lifetime access
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Check size={14} className="mr-1 text-green-500" />
                  Money-back guarantee
                </span>
              </div>
            </div>

            {/* Course Highlights */}
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                What You'll Get
              </h3>
              <div className="space-y-3">
                {highlights
                  .filter(item => item.value)
                  .map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="p-1.5 rounded-full mr-3 bg-green-100 dark:bg-green-900/50">
                        {item.icon && <item.icon size={16} className="text-green-600 dark:text-green-400" />}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.label}
                      </span>
                    </div>
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
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                    Limited Seats
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default CourseEducation;
