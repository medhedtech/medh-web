import React, { useState, useEffect } from 'react';
import CourseBanner from '@/components/shared/banners/CourseBanner';
import { Calculator, Brain, Gauge, Star, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Banner from '@/assets/Header-Images/Vedic-Maths/vedic-maths.png';
import Cource from '@/assets/Header-Images/Vedic-Maths/vedic-banner.jpeg';

function VedicBanner() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const bannerProps = {
    badge: "All Ages Welcome",
    title: "Comprehensive Course in",
    titleHighlight: "Vedic Mathematics",
    description: "Ancient Wisdom, Modern Techniques. Eliminate Math Phobia and Transform It into a Joyful and Engaging Experience.",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-amber-700 animate-pulse" />,
        value: "2000+",
        label: "Students Learning"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-600 animate-bounce" />,
        value: "4.9/5",
        label: "Course Rating"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-amber-700 animate-pulse" />,
        value: "16+",
        label: "Vedic Sutras"
      }
    ],
    features: [
      {
        icon: <Gauge className="w-6 h-6 text-amber-700 transform hover:rotate-180 transition-transform duration-500" />,
        title: "Quick Calculations",
        description: "Master rapid mental math"
      },
      {
        icon: <Brain className="w-6 h-6 text-amber-700 hover:scale-110 transition-transform duration-300" />,
        title: "Vedic Techniques",
        description: "Ancient proven methods"
      },
      {
        icon: <Calculator className="w-6 h-6 text-amber-700 hover:scale-110 transition-transform duration-300" />,
        title: "Problem Solving",
        description: "Simplified approaches"
      }
    ],
    mainImage: Banner,
    studentImage: Cource,
    themeClasses: {
      badge: "bg-amber-700",
      badgeContainer: "bg-amber-700/10 backdrop-blur-sm",
      title: "text-amber-700",
      button: "bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white shadow-amber-700/25 transform hover:-translate-y-1 transition-all duration-300",
      secondaryButton: "text-amber-700 border-amber-700 hover:bg-amber-50 transform hover:-translate-y-1 transition-all duration-300",
      gradientFrom: "from-amber-700/20",
      gradientVia: "via-amber-500/10",
      gradientTo: "to-transparent",
      backgroundPrimary: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 backdrop-blur-sm",
      backgroundSecondary: "bg-gradient-to-tr from-amber-100/20 via-orange-100/20 to-yellow-100/20 dark:from-amber-800/10 dark:via-orange-800/10 dark:to-yellow-800/10 backdrop-blur-sm"
    }
  };

  return (
      <CourseBanner {...bannerProps} />
  );
}

export default VedicBanner;
