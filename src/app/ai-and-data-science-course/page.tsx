'use client';

import React from 'react';
import { Cpu, Database, Brain, Star, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseBanner from "@/components/sections/course-ai/courseAiCourseBanner";
import ThemeController from "@/components/shared/others/ThemeController";

// Section components
import CourseAiOverview from "@/components/sections/course-ai/courseai-overview";
import CourseAiFaq from "@/components/sections/course-ai/courseAiFaq";
import CourseAiRelatedCourses from "@/components/sections/course-ai/courseAiRelatedCourse";
import CourseOptions from "@/components/sections/course-ai/courseOptions";


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

  return (
    <PageWrapper>
      {/* Course Banner Section */}
      <section className="relative w-full">
        <CourseBanner {...bannerProps} />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Course Options Section */}
      <section className="w-full py-3 md:py-3 relative z-10">
        <CourseOptions />
      </section>

      {/* Main Content */}
      <main className="relative w-full bg-gray-50 dark:bg-gray-900">
        {/* Course Overview Section */}
        <section className="w-full py-3 md:py-6 relative z-10">
          <CourseAiOverview />
        </section>

        {/* Course FAQ Section */}
        <section className="w-full py-3 md:py-6 relative z-10">
          <div className="">
            <div className="py-0">
              <CourseAiFaq />
            </div>
          </div>
        </section>

        {/* Related Courses Section */}
        <section className="w-full py-2 md:py-8 relative z-10">
          <CourseAiRelatedCourses />
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
