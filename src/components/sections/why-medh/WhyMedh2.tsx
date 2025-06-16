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
  Shield,
  Award
} from "lucide-react";
import { useTheme } from "next-themes";
import placement from "@/assets/images/iso/pllacement-logo.png";
import iso9001 from "@/assets/images/certifications/ISO_9001-2015_Emblem.jpg";
import iso10002 from "@/assets/images/certifications/ISO_10002-2018_Emblem.jpg";
import iso20000 from "@/assets/images/certifications/3.jpg";
import iso27001 from "@/assets/images/certifications/ISO_27001-2022_Emblem.jpg";
import iso27701 from "@/assets/images/certifications/4.jpg";
import iso22301 from "@/assets/images/certifications/ISO_22301-2019_Emblem.jpg";
import stemLogo from "@/assets/images/certifications/medh-stem-accreditation-logo (1).png";

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
      
      {/* Job Guarantee Section - Glass Morphic */}
      <section className="w-full py-8 md:py-12 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative flex flex-col items-center gap-8 md:gap-12">
            
            {/* Glass Morphic Container */}
            <div className="relative w-full max-w-4xl">
              {/* Glass morphic background with enhanced blur and gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl"></div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 dark:from-green-400/10 dark:via-transparent dark:to-blue-400/10"></div>
            
            {/* Content */}
              <div className="relative z-10 p-6 md:p-8 lg:p-10 text-center">
                {/* Job Guarantee Badge */}
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-400/20 dark:to-emerald-400/20 backdrop-blur-sm border border-green-500/30 dark:border-green-400/30 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg animate-pulse">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                  100% Job-guaranteed
                </span>
              </div>
              
                {/* Logo/Image with glass effect */}
                <div className="relative mb-6">
                  <div className="inline-block p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl">
              <Image
                src={placement}
                width={260}
                height={140}
                alt="100% Job-guaranteed"
                      className="mx-auto w-auto h-auto max-w-[200px] sm:max-w-[260px] filter drop-shadow-lg"
                priority
              />
                  </div>
                </div>
                
                {/* Main Heading */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    100% Job-guaranteed Courses from
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 dark:from-green-400 dark:via-emerald-400 dark:to-green-500 bg-clip-text text-transparent font-extrabold">
                    Medh
                  </span>
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    .
                  </span>
              </h2>
              
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Transform your career with our industry-aligned programs and guaranteed placement support.
              </p>
                
                {/* CTA Button with glass effect */}
                <div className="relative inline-block">
                  {/* Button glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 blur-xl scale-110 animate-pulse"></div>
              
              <button
                onClick={handleGetStarted}
                    className="relative inline-flex items-center px-8 py-4 font-medium text-white bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 group border border-green-400/30"
                  >
                    {/* Button inner glow */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <span className="relative z-10">Explore Job-guaranteed Courses</span>
                    <ArrowUpRight size={18} className="relative z-10 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
              </div>
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

          {/* Quality Certifications Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Our Quality Certifications!
              </h3>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
              Certified Standards That Ensure Your Success
            </p>
            
            {/* ISO Certification Logos Display */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12 max-w-6xl mx-auto">
              {/* ISO 9001:2015 - Quality Management */}
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-full h-32 mb-3">
                  <Image
                    src={iso9001}
                    alt="ISO 9001:2015 Quality Management System Certified"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Quality Management</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">ISO 9001:2015</p>
                </div>
              </div>

              {/* ISO 10002:2018 - Customer Satisfaction */}
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-full h-32 mb-3">
                  <Image
                    src={iso10002}
                    alt="ISO 10002:2018 Customer Satisfaction Management Certified"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Customer Satisfaction</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">ISO 10002:2018</p>
                </div>
              </div>

              {/* ISO 20000-1:2018 - IT Service Management */}
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-full h-32 mb-3">
                  <Image
                    src={iso20000}
                    alt="ISO 20000-1:2018 IT Service Management Certified"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">IT Service Management</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">ISO 20000-1:2018</p>
                </div>
              </div>

                             {/* ISO 27001:2022 - Information Security */}
               <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                 <div className="relative w-full h-32 mb-3">
                   <Image
                     src={iso27001}
                     alt="ISO 27001:2022 Information Security Management Certified"
                     fill
                     className="object-contain group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <div className="text-center">
                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Information Security</p>
                   <p className="text-xs text-gray-600 dark:text-gray-400">ISO 27001:2022</p>
                 </div>
               </div>

               {/* ISO 27701:2019 - Privacy Management */}
               <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                 <div className="relative w-full h-32 mb-3">
                   <Image
                     src={iso27701}
                     alt="ISO 27701:2019 Privacy Information Management Certified"
                     fill
                     className="object-contain group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <div className="text-center">
                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Privacy Management</p>
                   <p className="text-xs text-gray-600 dark:text-gray-400">ISO 27701:2019</p>
                 </div>
               </div>

                             {/* ISO 22301:2019 - Business Continuity */}
               <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                 <div className="relative w-full h-32 mb-3">
                   <Image
                     src={iso22301}
                     alt="ISO 22301:2019 Business Continuity Management Certified"
                     fill
                     className="object-contain group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <div className="text-center">
                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Business Continuity</p>
                   <p className="text-xs text-gray-600 dark:text-gray-400">ISO 22301:2019</p>
                 </div>
               </div>

                  </div>

            {/* STEM Accreditation - Centered */}
            <div className="flex justify-center mb-12">
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-xs">
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={stemLogo}
                    alt="STEM.org Accredited Educational Experience"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">STEM Accredited</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Educational Experience</p>
                </div>
              </div>
            </div>



                                     {/* Certification Descriptions - Side by Side */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">STEM Certified:</span> Recognized excellence in Science, Technology, Engineering, and Mathematics education.
                  </p>
          </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    <span className="font-semibold text-green-600 dark:text-green-400">ISO Certified:</span> Recognized international standards of quality, security, and reliability, protecting your data.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mb-8">
              <div className="flex justify-center">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Get Started Today</span>
                <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              </div>
            </div>
            
             {/* Bottom description */}
             <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg max-w-4xl mx-auto mb-8">
               <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                 These certifications ensure your learning journey is built on globally recognized standards of excellence.
               </p>
             </div>

             {/* Bottom text */}
             <div className="text-center">
               <p className="text-sm text-gray-500 dark:text-gray-400">
              Join thousands of successful graduates who've transformed their careers with Medh
            </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyMedh; 