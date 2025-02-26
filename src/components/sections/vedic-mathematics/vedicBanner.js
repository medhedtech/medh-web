'use client';

import React from 'react';
import CourseBanner from '@/components/shared/banners/CourseBanner';
import { Calculator, Brain, Gauge, Star, Users, BookOpen } from 'lucide-react';
import Banner from '@/assets/Header-Images/Vedic-Maths/vedic-maths.png';
import Cource from '@/assets/Header-Images/Vedic-Maths/vedic-banner.jpeg';

function VedicBanner() {
  const bannerProps = {
    badge: "All Ages Welcome",
    title: "Comprehensive Course in",
    titleHighlight: "Vedic Mathematics",
    description: "Ancient Wisdom, Modern Techniques. Eliminate Math Phobia and Transform It into a Joyful and Engaging Experience.",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-orange-500" />,
        value: "2000+",
        label: "Students Learning"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        value: "4.9/5",
        label: "Course Rating"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-orange-500" />,
        value: "16+",
        label: "Vedic Sutras"
      }
    ],
    features: [
      {
        icon: <Gauge className="w-6 h-6 text-orange-500" />,
        title: "Quick Calculations",
        description: "Master rapid mental math"
      },
      {
        icon: <Brain className="w-6 h-6 text-orange-500" />,
        title: "Vedic Techniques",
        description: "Ancient proven methods"
      },
      {
        icon: <Calculator className="w-6 h-6 text-orange-500" />,
        title: "Problem Solving",
        description: "Simplified approaches"
      }
    ],
    mainImage: Banner,
    studentImage: Cource,
    themeClasses: {
      badge: "bg-orange-500",
      badgeContainer: "bg-orange-500/10",
      title: "text-orange-500",
      button: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25",
      secondaryButton: "text-orange-500 border-orange-500 hover:bg-orange-50",
      gradientFrom: "from-orange-500/20",
      gradientVia: "via-yellow-500/10",
      gradientTo: "to-transparent",
      backgroundPrimary: "bg-orange-500/10",
      backgroundSecondary: "bg-yellow-500/10"
    }
  };

  return <CourseBanner {...bannerProps} />;
}

export default VedicBanner;
