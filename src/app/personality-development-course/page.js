'use client';

import PersonalityFaq from "@/components/sections/personality-development/personalityFaq";
import PersonalityOvereveiw from "@/components/sections/personality-development/personality-overview";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PersonalityCourse from "@/components/sections/personality-development/personalityCourse";
import PersonalityRelatedCourse from "@/components/sections/personality-development/relatedCourses";
import PersonalityCourseBanner from "@/components/sections/personality-development/personalityCourseBanner";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import CourseBanner from "@/components/shared/banners/CourseBanner";
import ThemeController from "@/components/shared/others/ThemeController";
import { UserPlus, Target, Sparkles, Star, Users, Award, Presentation } from "lucide-react";
import Banner from "@/assets/Header-Images/Personality-Development/personality-development-course-age-18-plus-years.png";
import DevelopmentImg from "@/assets/Header-Images/Personality-Development/multiracial-teenage-high-school-students-looking-a-2023-11-27-05-15-38-utc.jpg";
import AnimatedContent from './AnimatedContent';

function PersonalityDevelopment() {
  const bannerProps = {
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
                Personality Development
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
              CourseBanner: () => <CourseBanner {...bannerProps} />,
              PersonalityOvereveiw,
              PersonalityCourse,
              PersonalityFaq,
              PersonalityCourseBanner,
              PersonalityRelatedCourse,
              ExploreJourney,
              ThemeController
            }}
            exploreJourneyProps={{
              mainText: "Discover Your Potential. Empower Yourself. Elevate Your Self-Image.",
              subText: "Enroll Today!"
            }}
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
}

export default PersonalityDevelopment;
