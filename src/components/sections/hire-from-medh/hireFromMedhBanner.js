'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Target, Award, Brain, Database, ChevronRight } from 'lucide-react';
import Banner from "@/assets/Header-Images/Hire-From-Medh/medh.png";
import Cource from "@/assets/Header-Images/Hire-From-Medh/group-three-modern-architects.jpg";
import Iso from "@/assets/images/hireformmedh/iso.svg";
import CourseBanner from "@/components/shared/banners/CourseBanner";

function HireFromMedhBanner() {
  // Theme classes specific to Hire from Medh - blue-focused theme
  const themeClasses = {
    badge: "bg-blue-500",
    badgeContainer: "bg-blue-500/10",
    title: "text-blue-500",
    button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25",
    secondaryButton: "text-blue-500 border-blue-500 hover:bg-blue-50",
    gradientFrom: "from-blue-500/20",
    gradientVia: "via-indigo-500/10",
    gradientTo: "to-transparent",
    backgroundPrimary: "bg-blue-500/10",
    backgroundSecondary: "bg-indigo-500/10"
  };

  // Features with enhanced icons and animations
  const features = [
    {
      icon: <Brain className="w-7 h-7 text-blue-500 transform transition-all duration-300 group-hover:rotate-12" />,
      title: "Global Talent Pool",
      description: "Access worldwide expertise across various domains and technologies"
    },
    {
      icon: <Database className="w-7 h-7 text-blue-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "AI & Data Science",
      description: "Specialized skills in machine learning, deep learning, and analytics"
    },
    {
      icon: <Award className="w-7 h-7 text-blue-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Digital Marketing",
      description: "Analytics experts with proven track records in driving growth"
    }
  ];

  // Define the custom badge with better styling
  const badge = (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm hover:bg-blue-500/15 transition-colors duration-300 transform hover:scale-105">
      <span className="text-blue-500 font-semibold text-xs sm:text-sm">EXPLORE YOUR IDEAL TALENT MATCHES!</span>
    </div>
  );

  // Stats - now incorporated directly in the description
  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      value: "500+",
      label: "Skilled Professionals"
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      value: "98%",
      label: "Placement Rate"
    },
    {
      icon: <Award className="w-5 h-5 text-blue-500" />,
      value: "100+",
      label: "Partner Companies"
    }
  ];

  // Stats information to include in description
  const statsInfo = (
    <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6 max-w-lg mx-auto lg:mx-0">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="text-center bg-white/80 dark:bg-gray-800/80 rounded-xl p-3 shadow-md backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex justify-center mb-2">{stat.icon}</div>
          <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  // Enhanced description with better information architecture
  const enhancedDescription = (
    <>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        Recruit top IT professionals in areas including AI, Data Science, Digital Marketing, Analytics, Cybersecurity, and more. Save time and resources with our pre-vetted talent.
      </p>
      {statsInfo}
    </>
  );

  // Custom floating element for the image section
  const floatingElement = (
    <div className="absolute -top-3 -right-3 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300 z-20">
      <div className="flex items-center gap-2">
        <Award className="text-blue-500 w-5 h-5" />
        <p className="text-xs font-medium text-gray-900 dark:text-white">
          Pre-vetted IT Professionals
        </p>
      </div>
    </div>
  );

  return (
    <CourseBanner
      badge={badge}
      title="Efficient Recruitment,"
      titleHighlight="Global Talent Pool"
      description={enhancedDescription}
      features={features}
      mainImage={Banner}
      studentImage={Cource}
      enrollmentPath="/contact"
      themeClasses={themeClasses}
      floatingElement={floatingElement}
    />
  );
}

export default HireFromMedhBanner;
