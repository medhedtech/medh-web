'use client'
import React from 'react';
import { Users, Star, BookOpen, Calculator, Brain, Gauge } from 'lucide-react';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CourseBanner from "@/components/shared/banners/CourseBanner";

// Section components
import VedicOverview from "@/components/sections/vedic-mathematics/vedicOverview";
import VedicCourse from '@/components/sections/vedic-mathematics/vedicCourse';
import VedicFaq from "@/components/sections/vedic-mathematics/vedicFaq";
import AnimatedContent from './AnimatedContent';

// Assets
import Banner from '@/assets/Header-Images/Vedic-Maths/vedic-maths.png';
import StudentImage from '@/assets/Header-Images/Vedic-Maths/vedic-banner.jpeg';
import { VedicMathematicsHero } from '@/components/sections/hero-banners';

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


        {/* Content */}
        <main className="flex-grow">
          <AnimatedContent 
            components={{
              VedicBanner: VedicMathematicsHero,
              VedicCourse,
              VedicOverview,
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
