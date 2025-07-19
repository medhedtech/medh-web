'use client';

import React, { useState } from "react";
import { NextPage } from "next";
import PersonalityFaq from "@/components/sections/personality-development/personalityFaq";
import PersonalityOvereveiw from "@/components/sections/personality-development/personality-overview";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PersonalityCourse from "@/components/sections/personality-development/personalityCourse";
import PersonalityRelatedCourse from "@/components/sections/personality-development/relatedCourses";
import { PersonalityDevelopmentHero } from "@/components/sections/hero-banners";
import Banner from "@/assets/Header-Images/Personality-Development/personality-development-course-age-18-plus-years.png";
import DevelopmentImg from "@/assets/Header-Images/Personality-Development/personality-development-course-age-18-plus-years.png";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import ThemeController from "@/components/shared/others/ThemeController";
import { UserPlus, Target, Sparkles, Star, Users, Award, Presentation } from "lucide-react";

import AnimatedContent from './AnimatedContent';
import { BookOpen } from "lucide-react";

interface IStat {
  icon: React.ReactElement;
  value: string;
  label: string;
}

interface IFeature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

interface IThemeClasses {
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
}

interface IBannerProps {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  enrollmentPath: string;
  stats: IStat[];
  features: IFeature[];
  themeClasses: IThemeClasses;
  onEnrollClick?: () => void;
  mainImage: any;
  studentImage: any;
}

interface IExploreJourneyProps {
  mainText: string;
  subText: string;
}

const PersonalityDevelopment: NextPage = () => {
  const bannerProps: IBannerProps = {
    badge: "All Ages Welcome",
    title: "Comprehensive",
    titleHighlight: "Personality Development",
    description: "Uncover Your Untapped Potential. Perfect for Students, Professionals, and Homemakers. Unleash Your Best Self.",
    enrollmentPath: "/enrollment/personality-development",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-primary-500" />,
        value: "5000+",
        label: "Transformed Lives"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        value: "4.9/5",
        label: "Student Rating"
      },
      {
        icon: <Award className="w-5 h-5 text-primary-500" />,
        value: "12+",
        label: "Years Experience"
      }
    ],
    features: [
      {
        icon: <UserPlus className="w-6 h-6 text-primary-500" />,
        title: "Self Development",
        description: "Build confidence & charisma"
      },
      {
        icon: <Target className="w-6 h-6 text-primary-500" />,
        title: "Goal Setting",
        description: "Achieve personal milestones"
      },
      {
        icon: <Presentation className="w-6 h-6 text-primary-500" />,
        title: "Communication",
        description: "Master public speaking"
      }
    ],
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
    },
    mainImage: Banner,
    studentImage: DevelopmentImg
  };

  const exploreJourneyProps: IExploreJourneyProps = {
    mainText: "Discover Your Potential. Empower Yourself. Elevate Your Self-Image.",
    subText: "Enroll Today!"
  };

  // FAQ content for Personality Development
  const faqs = [
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "What is the Personality Development Course?",
      answer: "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "What is the duration of the Personality Development Course?",
      answer: "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Is the Personality Development Course suitable for all age groups?",
      answer: "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "What are the key topics covered in the course?",
      answer: "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Will the course help in career advancement?",
      answer: "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Is this Personality Development Course from Medh is suitable for homemakers / housewives?",
      answer: "Certainly! Our Personality Development Course is well-suited for homemakers and housewives, equipping them with essential life skills, confidence, and interpersonal abilities. It fosters personal growth, enhances communication and leadership skills, and provides valuable tools for managing stress, time, and relationships. Our program aims to boost confidence, improve family life, and empower women in their roles as homemakers, offering practical guidance and support to help them effectively manage their responsibilities and find fulfillment in their daily lives.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Are there any prerequisites for enrolling in the course?",
      answer: "There are no specific prerequisites for enrolling in the course. It is open to individuals from all backgrounds and professions. The only requirement is the willingness to learn and grow personally and professionally.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "How long is the course, and can I study at my own pace?",
      answer: "The course duration can vary based on the specific curriculum, but it is generally structured for completion within a range of 3 to 9 months (12-36 weeks). This encompasses a weekly commitment of 2-3 hours only, providing the flexibility to align the course pace with your other commitments and schedules.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Will I receive a certificate upon completing the course?",
      answer: "Yes, upon successful completion of the AI with Data Analytics course, you will receive a certificate of completion issued by MEDH. This esteemed certificate can be included in your portfolio. Additionally, you can showcase your newly acquired skills by sharing the certificate on professional networking platforms.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Will I have access to course materials after completing the course?",
      answer: "Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "How do I enroll in the course, and what are the payment options?",
      answer: "To enroll in the course, simply visit our website and find the Personality Development Course page. From there, you can follow the instructions to sign up and make the payment using the available payment options, such as credit/debit cards, online banking, or other supported methods.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Can I interact with other students during the course?",
      answer: "Yes, our platform fosters an engaging and collaborative learning environment. You can connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "What if I have questions or need additional support during the course?",
      answer: "Yes, you will have access to: Dedicated Support Forum to Interact with instructors and teaching assistants. Doubts Clarification: Throughout the course. Guidance and Mentorship: Even post completion of the course.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Is there any technical support available if I encounter issues during the course?",
      answer: "Absolutely! Our technical support team is available to assist you throughout your learning journey. If you encounter any technical difficulties or have questions related to the course platform, you can reach out to our support team, and they will be happy to help you resolve any issues.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Is the course delivered entirely online?",
      answer: "Yes, the course is delivered through a comprehensive online platform, featuring live sessions as well as recordings for convenient access. The online format enables flexibility and accessibility for individuals with diverse schedules and commitments.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      question: "Is financial assistance available for the course?",
      answer: "Yes, we strive to make our courses accessible to everyone. Financial assistance and/or scholarships may be available based on eligibility. Please reach out to our support team for more information on financial assistance option.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PageWrapper>
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personality Development
              </h1>
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow">
          <AnimatedContent
            components={{
              CourseBanner: () => <PersonalityDevelopmentHero />,
              PersonalityOvereveiw: PersonalityOvereveiw,
              PersonalityCourse: PersonalityCourse,
              PersonalityFaq: () => (
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
                        Have more questions about the Personality Development course? Contact our team at <a href="mailto:care@medh.co" className="text-[#3bac63] underline font-semibold">care@medh.co</a>
                      </span>
                    </div>
                  </div>
                </section>
              ),
              PersonalityRelatedCourse: PersonalityRelatedCourse,
              ThemeController: ThemeController,
              ExploreJourney: ExploreJourney
            }}
            exploreJourneyProps={exploreJourneyProps}
            bannerProps={bannerProps}
          />
        </main>

        {/* Theme Controller - Fixed Position */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>

        {/* Bottom Gradient Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>
    </PageWrapper>
  );
};

export default PersonalityDevelopment; 