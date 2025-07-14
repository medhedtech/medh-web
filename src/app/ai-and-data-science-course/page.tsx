'use client';

import React, { useState } from 'react';
import { Cpu, Database, Brain, Star, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseBanner from "@/components/sections/course-ai/courseAiCourseBanner";
import ThemeController from "@/components/shared/others/ThemeController";

// Section components
import CourseAiOverview from "@/components/sections/course-ai/courseai-overview";
import CourseAiRelatedCourses from "@/components/sections/course-ai/courseAiRelatedCourse";
import CourseOptions from "@/components/sections/course-ai/courseOptions";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";


// Assets
import Banner from "@/assets/Header-Images/ai-and-data/ai-with-data-science.png";
import DevelopmentImg from "@/assets/Header-Images/ai-and-data/image-3rd.jpg";

/**
 * Interface for banner configuration props
 */
interface IBannerProps {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  enrollmentPath: string;
  stats: Array<{
    icon: React.ReactNode;
    value: string;
    label: string;
  }>;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  mainImage: any;
  studentImage: any;
  themeClasses: {
    badge: string;
    badgeContainer: string;
    title: string;
    button: string;
    secondaryButton: string;
    gradientFrom: string;
    gradientVia: string;
    gradientTo: string;
    backgroundPrimary: string;
    backgroundSecondary: string;
  };
}

/**
 * AI and Data Science Course Page Component
 * 
 * This page displays comprehensive information about the AI and Data Science course,
 * including course overview, options, FAQ, and related courses.
 * 
 * @returns React element containing the complete course page
 */
function CourseAi(): React.ReactElement {
  const bannerProps: IBannerProps = {
    badge: "New Course",
    title: "Artificial Intelligence &",
    titleHighlight: "Data Science",
    description: "Gain in-depth knowledge and hands-on experience to excel in the dynamic world of technology and analytics.",
    enrollmentPath: "/enrollment/ai-and-data-science",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-primary-500" />,
        value: "1000+",
        label: "Students Enrolled"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        value: "4.8/5",
        label: "Course Rating"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-primary-500" />,
        value: "24+",
        label: "Modules"
      }
    ],
    features: [
      {
        icon: <Cpu className="w-6 h-6 text-primary-500" />,
        title: "Machine Learning",
        description: "Advanced algorithms and models"
      },
      {
        icon: <Database className="w-6 h-6 text-primary-500" />,
        title: "Data Science",
        description: "Data analysis and visualization"
      },
      {
        icon: <Brain className="w-6 h-6 text-primary-500" />,
        title: "Neural Networks",
        description: "Deep learning architectures"
      }
    ],
    mainImage: Banner,
    studentImage: DevelopmentImg,
    themeClasses: {
      badge: "bg-primary-500",
      badgeContainer: "bg-primary-500/10",
      title: "text-primary-500",
      button: "bg-primary-500 hover:bg-primary-600 shadow-primary-500/25",
      secondaryButton: "text-primary-500 border-primary-500 hover:bg-primary-50",
      gradientFrom: "from-primary-500/20",
      gradientVia: "via-indigo-500/10",
      gradientTo: "to-transparent",
      backgroundPrimary: "bg-primary-500/10",
      backgroundSecondary: "bg-indigo-500/10"
    }
  };

  // AI/Data Science FAQ content
  const faqs: IFAQ[] = [
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "Who is this AI and Data Science course designed for?",
      answer: `This course is designed for individuals interested in Artificial Intelligence and Data Science. It is suitable for beginners (no prior AI or programming experience needed) and professionals seeking to enhance their skills and knowledge in AI and Data Science.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "What is Data Science?",
      answer: `Data science is a cross-disciplinary field focused on extracting useful knowledge from data. It combines statistics, machine learning, computational techniques, and is applied in areas like biology, healthcare, business, finance, and more.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "What is Artificial Intelligence (AI)?",
      answer: `AI involves building intelligent systems that can perform complex tasks without explicit programming. Key areas include machine translation, computer vision, game playing, self-driving vehicles, and more.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "Why combine AI and Data Science in one course?",
      answer: `Combining AI and Data Science provides a comprehensive skill set that integrates analysis and AI model building, enhances understanding of real-world data problems, and prepares students for roles requiring both AI and Data Science expertise.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "What programming language is used in the course?",
      answer: `The course primarily uses Python for implementing AI and Data Science concepts. Python is widely used in the industry due to its extensive libraries and ease of use, making it ideal for AI and Data Science applications.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "Are there any prerequisites for enrolling in this course?",
      answer: `There are no strict prerequisites, but a basic understanding of programming concepts and familiarity with mathematics (algebra, calculus, and probability) will be beneficial. Basic programming knowledge, preferably in Python, is recommended but not mandatory.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "How is the course structured?",
      answer: `The course spans 16 to 48 weeks, with 3-4 hours of content per week. It includes online classes, video lectures, hands-on exercises, quizzes, and a capstone project in the final week.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "Are there any real-world projects included in the course?",
      answer: `Yes, the course includes capstone projects and practical experience to apply knowledge to hands-on AI and Data Science projects.`,
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />, 
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      question: "What makes MEDH's AI and Data Science course unique?",
      answer: `MEDH's course stands out for its comprehensive curriculum, expert instructors, hands-on projects, flexible learning, and career support beyond course completion.`,
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PageWrapper>
      {/* Course Banner Section */}
      <section className="relative w-full">
        <CourseBanner {...bannerProps} />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Course Options Section */}
      <section className="w-full pb-3 md:pb-3 relative z-10">
        <CourseOptions />
      </section>

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900">
        {/* Course Overview Section */}
        <section className="w-full relative z-10">
          <CourseAiOverview />
        </section>

        {/* Course FAQ Section (custom minimal accordion) */}
        <section className="bg-slate-50 dark:bg-slate-900 min-h-screen px-4 sm:px-[50px]">
          <div className="p-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg rounded-none sm:rounded-2xl px-4 sm:px-[45px] py-[28px]">
            <h2 className="text-center font-semibold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 mt-2 sm:mt-4 text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {faqs.map((faq, idx) => (
                <li key={idx} className="">
                  <button
                    className={
                      "w-full flex items-start gap-3 py-4 focus:outline-none transition-colors min-h-[44px] " +
                      (openIndex === idx
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60")
                    }
                    aria-expanded={openIndex === idx}
                    aria-controls={`faq-panel-${idx}`}
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <span className="flex-shrink-0 mt-1">
                      {faq.icon}
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block font-medium text-sm sm:text-base md:text-lg text-slate-900 dark:text-slate-100">
                        {faq.question}
                      </span>
                    </span>
                    <svg
                      className={
                        "w-5 h-5 ml-2 transition-transform duration-200 " +
                        (openIndex === idx ? "rotate-180" : "rotate-0")
                      }
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    id={`faq-panel-${idx}`}
                    className={
                      "overflow-hidden transition-all duration-300 " +
                      (openIndex === idx ? "max-h-96 py-2" : "max-h-0 py-0")
                    }
                    aria-hidden={openIndex !== idx}
                  >
                    <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Contact Section (unchanged) */}
            <div className="mt-6 sm:mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 pb-4 text-center">
              <span className="block text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium">
                Have more questions about the AI & Data Science course? Contact our team at <a href="mailto:care@medh.co" className="text-[#3bac63] underline font-semibold">care@medh.co</a>
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Theme Controller - Positioned in bottom right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeController />
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </PageWrapper>
  );
}

export default CourseAi;
