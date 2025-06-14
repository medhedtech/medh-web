"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Target, 
  ArrowUpRight,
  CheckCircle,
  Sparkles,
  Trophy,
  Shield
} from "lucide-react";
import { useTheme } from "next-themes";
import placement from "@/assets/images/iso/pllacement-logo.png";

// Simplified interfaces
interface IWhyMedhFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

// Optimized feature data - reduced to essential items
const FEATURES: IWhyMedhFeature[] = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Quality Content",
    description: "Up-to-date, well-structured materials that drive real learning outcomes.",
    color: "blue"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Learning Resources", 
    description: "Diverse materials tailored to learners of all backgrounds and skill levels.",
    color: "green"
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Expert Mentorship",
    description: "Learn from qualified instructors through practical projects.",
    color: "purple"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Personalized Learning",
    description: "Customize your learning path with flexible modules.",
    color: "orange"
  }
];

// Simplified color mapping
const getColorClasses = (color: string): string => {
  const colors = {
    blue: "text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20",
    green: "text-white bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20", 
    purple: "text-white bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/20",
    orange: "text-white bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20"
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

// Optimized main component
const WhyMedh: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const isDark = mounted ? theme === 'dark' : true;
  
  // Single initialization effect
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Optimized navigation handlers
  const handleGetStarted = useCallback(() => {
    router.push("/placement-guaranteed-courses");
  }, [router]);

  const handleLearnMore = useCallback(() => {
    router.push("/about");
  }, [router]);

  // Loading state
  if (!mounted) {
    return (
      <div className="w-full py-8 opacity-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse w-48 mx-auto"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} py-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50`}>
      
      {/* Job Guarantee Section */}
      <section className="w-full py-8 md:py-12 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative flex flex-col items-center gap-8 md:gap-12">
            
            {/* Content */}
            <div className="w-full max-w-2xl text-center relative">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                  100% Job-guaranteed
                </span>
              </div>
              
              <Image
                src={placement}
                width={260}
                height={140}
                alt="100% Job-guaranteed"
                className="mx-auto mb-6 w-auto h-auto max-w-[200px] sm:max-w-[260px]"
                priority
              />
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                100% Job-guaranteed Courses from <span className="text-green-600 dark:text-green-400">Medh</span>.
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                Transform your career with our industry-aligned programs and guaranteed placement support.
              </p>
              
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <span>Explore Job-guaranteed Courses</span>
                <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose MEDH Section */}
      <section className="w-full py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Our Approach
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Why Choose <span className="text-green-600 dark:text-green-400">MEDH</span>?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Empowering learners with the freedom to explore, we go beyond fundamentals, fostering critical thinking and creativity.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group relative h-full transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-full rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6">
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CheckCircle className="w-5 h-5 text-primary-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Our Certifications! 🏆
              </h3>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
              Swipe to explore our achievements ✨
            </p>
            
            {/* Certification highlights - simplified */}
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              {[
                { label: "ISO Certified", value: "9001:2015" },
                { label: "STEM Certified", value: "Education" }
              ].map((item, index) => (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Get Started Today</span>
                <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
            
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Join thousands of successful graduates who've transformed their careers with Medh
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyMedh; 