'use client'
import React from 'react';
import { Users, Star, BookOpen, Calculator, Brain, Gauge } from 'lucide-react';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CourseBanner from "@/components/shared/banners/CourseBanner";

// Section components
import VedicOverview from "@/components/sections/vedic-mathematics/vedicOverview";
import VedicCource from '@/components/sections/vedic-mathematics/vedicCource';
import VedicFaq from "@/components/sections/vedic-mathematics/vedicFaq";
import AnimatedContent from './AnimatedContent';

// Assets
import Banner from '@/assets/Header-Images/Vedic-Maths/vedic-maths.png';
import StudentImage from '@/assets/Header-Images/Vedic-Maths/vedic-banner.jpeg';
import VedicBanner from '@/components/sections/vedic-mathematics/vedicBanner';

function VedicMathematics() {
  const bannerProps = {
    badge: "All Ages Welcome",
    title: "Comprehensive Course in",
    titleHighlight: "Vedic Mathematics",
    description: "Ancient Wisdom, Modern Techniques. Eliminate Math Phobia and Transform It into a Joyful and Engaging Experience.",
    enrollmentPath: "/enrollment/vedic-mathematics",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-amber-700" />,
        value: "2000+",
        label: "Students Learning"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        value: "4.9/5",
        label: "Course Rating"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-amber-700" />,
        value: "20+",
        label: "Modules"
      }
    ],
    features: [
      {
        icon: <Calculator className="w-6 h-6 text-amber-700" />,
        title: "Mental Calculation",
        description: "Faster calculation techniques"
      },
      {
        icon: <Brain className="w-6 h-6 text-amber-700" />,
        title: "Cognitive Development",
        description: "Enhance memory and focus"
      },
      {
        icon: <Gauge className="w-6 h-6 text-amber-700" />,
        title: "Speed Mathematics",
        description: "Solve complex problems quickly"
      }
    ],
    mainImage: Banner,
    studentImage: StudentImage,
    themeClasses: {
      badge: "bg-amber-700",
      badgeContainer: "bg-amber-700/10",
      title: "text-amber-700",
      button: "bg-amber-700 hover:bg-amber-800 shadow-amber-700/25",
      secondaryButton: "text-amber-700 border-amber-700 hover:bg-amber-50",
      gradientFrom: "from-amber-500/20",
      gradientVia: "via-orange-500/10",
      gradientTo: "to-transparent",
      backgroundPrimary: "bg-amber-500/10",
      backgroundSecondary: "bg-orange-500/10"
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
                Vedic Mathematics
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full">
                Course
              </span>
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow">
          <AnimatedContent 
            components={{
              VedicBanner,
              VedicOverview,
              VedicCource,
              VedicFaq,
              ThemeController
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

export default VedicMathematics;
