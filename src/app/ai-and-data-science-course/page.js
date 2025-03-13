'use client';

import { Cpu, Database, Brain, Star, Users, BookOpen } from 'lucide-react';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseBanner from "@/components/shared/banners/CourseBanner";
import ThemeController from "@/components/shared/others/ThemeController";

// Section components
import CourseAiOverview from "@/components/sections/course-ai/courseai-overview";
import CourseAiCourseBanner from "@/components/sections/course-ai/courseAiCourseBanner";
import CourseAiFaq from "@/components/sections/course-ai/courseAiFaq";
import CourseAiRelatedCourses from "@/components/sections/course-ai/courseAiRelatedCourse";
import CourseOptions from "@/components/sections/course-ai/courseOptions";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import AnimatedContent from './AnimatedContent';

// Assets
import Banner from "@/assets/Header-Images/ai-and-data/ai-with-data-science.png";
import DevelopmentImg from "@/assets/Header-Images/ai-and-data/image-3rd.jpg";

function CourseAi() {
  const bannerProps = {
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
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI & Data Science
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                Course
              </span>
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow pt-16">
          <AnimatedContent 
            components={{
              CourseBanner,
              CourseAiOverview,
              CourseOptions,
              CourseAiFaq,
              CourseAiCourseBanner,
              CourseAiRelatedCourses,
              ExploreJourney,
              ThemeController
            }}
            exploreJourneyProps={{
              mainText: "Master AI & Data Science. Future-proof Your Career.",
              subText: "Enroll Now!"
            }}
            bannerProps={bannerProps}
          />
        </main>

        {/* Theme Controller - Now positioned in bottom right */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>

        {/* Bottom Gradient Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>
    </PageWrapper>
  );
}

export default CourseAi;
