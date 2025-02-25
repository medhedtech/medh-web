"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";

export default function CourseFaq({ courseId }) {
  const [openIndex, setOpenIndex] = useState(null);
  const { getQuery, loading } = useGetQuery();
  const [courseDetails1, setCourseDetails1] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    } else {
      notFound();
    }
  }, [courseId]);

  const fetchCourseDetails = async (id) => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${id}`,
        onSuccess: (data) => {
          setCourseDetails1(data);
          
          // Check if course has FAQs and use them if available
          if (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
            setFaqs(data.faqs);
          } else {
            // Use default FAQs if none are available
            setFaqs(generateDefaultFaqs(data));
          }
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
          setFaqs(generateDefaultFaqs()); // Use default FAQs on error
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
      setFaqs(generateDefaultFaqs()); // Use default FAQs on error
    }
  };

  // Generate default FAQs based on course data or use generic ones
  const generateDefaultFaqs = (courseData = null) => {
    const courseTitle = courseData?.course_title || "this course";
    
    return [
      {
        question: `What are the key highlights of the ${courseData?.course_duration || "3 months"} ${courseData?.is_Certification === "Yes" ? "Certificate " : ""}course in ${courseTitle}?`,
        answer: `The ${courseTitle} is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises. You'll learn industry-relevant skills with hands-on projects and expert guidance.`,
      },
      {
        question: `How will this course prepare me for entry-level roles in ${courseTitle.split(" ")[0]}?`,
        answer: `This course provides comprehensive training with real-world projects, industry-standard tools, and practical assignments that simulate workplace scenarios. You'll build a portfolio of work that demonstrates your capabilities to potential employers.`,
      },
      {
        question: `Can this course serve as a stepping stone for further career development?`,
        answer: `Absolutely! This course builds a solid foundation that you can leverage for advanced learning. Many of our students use this as a launching pad for specialized roles or further education in the field.`,
      },
      {
        question: "What networking opportunities can participants expect from this program?",
        answer: "You'll join a community of like-minded learners, interact with industry professionals during guest lectures, and gain access to our alumni network. We also host regular networking events and maintain an active online community.",
      },
      {
        question: `How does the course address ethical considerations in ${courseData?.course_category || "this field"}?`,
        answer: "Ethics is integrated throughout our curriculum. We cover professional standards, responsible practices, and ethical decision-making frameworks specific to the industry, ensuring you're prepared to navigate complex situations in your career.",
      },
      {
        question: "What practical skills and applications will I develop during this course?",
        answer: `You'll gain hands-on experience with ${courseData?.is_Projects === "Yes" ? "real-world projects" : "practical exercises"}, learn to use industry-standard tools, and develop problem-solving abilities that directly translate to workplace scenarios.`,
      },
      {
        question: "Is financial assistance available for the course?",
        answer: "Yes, we offer flexible payment plans, early bird discounts, and group enrollment options. Please contact our admissions team for details about financial assistance options that might be available to you.",
      },
      {
        question: "What support will I receive during and after the course?",
        answer: "During the course, you'll have access to instructor support, teaching assistants, and our learning community. After completion, you'll join our alumni network with continued access to resources, job opportunities, and community events.",
      },
    ];
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-[#050622]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-green-500 rounded-sm mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">Frequently Asked Questions</h2>
          <HelpCircle className="ml-2 text-gray-400 w-5 h-5" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-all duration-200"
            >
              <div
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  openIndex === index 
                    ? "bg-green-50 dark:bg-green-900/20" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <h3 className={`text-base font-medium pr-8 ${
                  openIndex === index 
                    ? "text-green-700 dark:text-green-400" 
                    : "text-gray-800 dark:text-gray-200"
                }`}>
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 p-1 rounded-full ${
                  openIndex === index 
                    ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {openIndex === index ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </div>
              
              {openIndex === index && (
                <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-300 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>
              If you have any other questions or concerns not covered in the FAQs, please feel free to 
              <a href="#" className="font-medium underline ml-1 hover:text-blue-800 dark:hover:text-blue-200">
                contact our support team
              </a>, and we'll be happy to assist you!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
