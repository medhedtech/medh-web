'use client';

import React from "react";
import CourseBanner from '@/components/shared/banners/CourseBanner';
import { BarChart, Globe, Target, Star, Users, BookOpen } from 'lucide-react';
import Banner from "@/assets/Header-Images/digital-marketing/digital-marketing-with-data-analytics-certificate-course.png";
import Cource from "@/assets/Header-Images/digital-marketing/freelancer-woman-comparing-graphics-from-clipboard-with-grafics-from-computer-business-office.jpg";

function DigiMarketingBanner() {
  const bannerProps = {
    badge: "Industry Ready",
    title: "Digital Marketing with",
    titleHighlight: "Data Analytics",
    description: "Master the art of digital marketing with data-driven strategies. Learn to analyze, optimize, and drive results in the digital landscape.",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-cyan-500" />,
        value: "3000+",
        label: "Successful Students"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        value: "4.8/5",
        label: "Course Rating"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-cyan-500" />,
        value: "20+",
        label: "Marketing Tools"
      }
    ],
    features: [
      {
        icon: <Globe className="w-6 h-6 text-cyan-500" />,
        title: "Digital Strategy",
        description: "Comprehensive marketing plans"
      },
      {
        icon: <BarChart className="w-6 h-6 text-cyan-500" />,
        title: "Data Analytics",
        description: "Performance tracking & insights"
      },
      {
        icon: <Target className="w-6 h-6 text-cyan-500" />,
        title: "Campaign Management",
        description: "Multi-channel optimization"
      }
    ],
    mainImage: Banner,
    studentImage: Cource,
    themeClasses: {
      badge: "bg-cyan-500",
      badgeContainer: "bg-cyan-500/10",
      title: "text-cyan-500",
      button: "bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/25",
      secondaryButton: "text-cyan-500 border-cyan-500 hover:bg-cyan-50",
      gradientFrom: "from-cyan-500/20",
      gradientVia: "via-blue-500/10",
      gradientTo: "to-transparent",
      backgroundPrimary: "bg-cyan-500/10",
      backgroundSecondary: "bg-blue-500/10"
    }
  };

  return <CourseBanner {...bannerProps} />;
}

export default DigiMarketingBanner;
