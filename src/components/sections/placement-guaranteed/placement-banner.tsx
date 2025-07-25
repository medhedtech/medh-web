"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Briefcase, GraduationCap, Award, Users, Clock, Target, ChevronRight, Shield, BookOpen, Star } from "lucide-react";
import stemImg from "@/assets/images/herobanner/Background.png";
import family from "@/assets/images/placement/medh-placement-courses.jpg";
import medhLogo from "@/assets/images/logo/medh.png";
import { usePlacementForm } from "@/context/PlacementFormContext";
import PlacementFormModal from "./placement-form-modal";
import "@/styles/glassmorphism.css";

interface IStatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface IFeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const PlacementGauranteedBanner: React.FC = () => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openForm } = usePlacementForm();

  const isDark = mounted ? theme === 'dark' : true;

  useEffect(() => {
    setMounted(true);
    setIsLoaded(true);
  }, []);

  const stats: IStatItem[] = [
    {
      icon: <Users className={`w-5 h-5 ${isDark ? 'text-primary-300' : 'text-primary-600'}`} />,
      value: "100%",
      label: "Placement Rate"
    },
    {
      icon: <Clock className={`w-5 h-5 ${isDark ? 'text-secondary-300' : 'text-secondary-600'}`} />,
      value: "6-18",
      label: "Months Duration"
    },
    {
      icon: <Target className={`w-5 h-5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />,
      value: "500+",
      label: "Partner Companies"
    }
  ];

  const features: IFeatureItem[] = [
    {
      icon: <Briefcase className={`w-6 h-6 ${isDark ? 'text-primary-300' : 'text-primary-600'}`} />,
      title: "Career Placement",
      description: "Guaranteed Job Opportunities",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <GraduationCap className={`w-6 h-6 ${isDark ? 'text-secondary-300' : 'text-secondary-600'}`} />,
      title: "Skill Development",
      description: "Industry-Ready Training",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Award className={`w-6 h-6 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />,
      title: "Professional Growth",
      description: "Career Advancement Support",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
      </div>
    );
  }

  return (
    <>
      <section className="relative min-h-[80vh] overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 right-0 w-3/4 h-3/4 ${isDark ? 'bg-gradient-to-br from-primary-500/10 via-blue-500/10 to-purple-500/10' : 'bg-gradient-to-br from-primary-300/20 via-blue-300/15 to-purple-300/20'} rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4 animate-pulse`}></div>
          <div className={`absolute bottom-0 left-0 w-3/4 h-3/4 ${isDark ? 'bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-transparent' : 'bg-gradient-to-tr from-emerald-300/15 via-green-300/10 to-transparent'} rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 animate-pulse`} style={{ animationDelay: '2s' }}></div>
          <div className={`absolute top-1/4 left-1/3 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${isDark ? 'border-primary-500/20' : 'border-primary-400/30'} animate-bounce`} style={{ animationDuration: '6s' }}></div>
          <div className={`absolute bottom-1/4 right-1/3 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed ${isDark ? 'border-emerald-500/20' : 'border-emerald-400/30'} animate-pulse`} style={{ animationDuration: '4s' }}></div>
          <div className={`absolute top-3/4 left-1/2 w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 ${isDark ? 'border-blue-500/20' : 'border-blue-400/30'} transform rotate-45 animate-bounce`} style={{ animationDuration: '8s' }}></div>
          <div className={`absolute top-1/2 right-1/4 w-8 h-8 md:w-12 md:h-12 rounded-full ${isDark ? 'bg-purple-500/10' : 'bg-purple-400/20'} animate-ping`} style={{ animationDuration: '3s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
          <div className="flex flex-col items-center justify-start text-center pt-8">
            
                        {/* Hero Text Section */}
            <div className={`mb-0 md:mb-0 transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div
                className="glass-container rounded-3xl p-4 md:p-6 lg:p-8 transform scale-90 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto border border-white/10 backdrop-blur-xl shadow-md"
                style={{ background: 'rgba(255,255,255,0.03)', marginBottom: '20px' }}
              >
                {/* Certification Badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-3 sm:mb-4">
                  <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-full text-xs sm:text-sm font-medium opacity-95 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}> 
                    <Shield size={10} className="mr-1 sm:w-3 sm:h-3" />
                    ISO Certified
                  </div>
                  <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-full text-xs sm:text-sm font-medium opacity-95 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}> 
                    <Award size={10} className="mr-1 sm:w-3 sm:h-3" />
                    STEM Accredited
                  </div>
                </div>
                {/* Main Heading */}
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-center mb-2 sm:mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
                  Secure Your Career Journey
                  <span className="block mt-1 w-full text-center"> 
                    <em className="font-semibold inline-flex items-baseline mr-1" style={{ transform: 'scale(0.9) translateY(2px)' }}>with</em>
                    <Image 
                      src={medhLogo} 
                      alt="Medh Logo" 
                      width={128} 
                      height={128} 
                      unoptimized={true}
                      className="inline-block h-6 sm:h-8 md:h-9 lg:h-12 w-auto align-baseline"
                      style={{ 
                        filter: 'brightness(1.1) contrast(1.2)',
                        transform: 'translateY(2px)',
                        verticalAlign: 'baseline',
                        objectFit: 'contain',
                        imageRendering: '-webkit-optimize-contrast',
                        backfaceVisibility: 'hidden',
                        WebkitFontSmoothing: 'antialiased'
                      }}
                    />
                  </span>
                </h1>
                {/* Description */}
                <p className={`text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 md:mb-6 max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}> 
                  Transform your skills into guaranteed employment opportunities with our industry-leading placement programs and expert career guidance.
                </p>
                {/* CTA Section */}
                <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap gap-4 justify-center"> 
                  <button 
                    onClick={() => {
                      const el = document.getElementById('courses-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center justify-center px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 font-bold rounded-xl transition-all duration-300 hover:scale-105 group text-sm sm:text-base md:text-lg relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-slate-700/30 shadow-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    <span className="relative z-10 font-extrabold tracking-wide">Start Your Career</span>
                    <ChevronRight size={16} className="relative z-10 ml-3 group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                {/* Tagline */}
                <div className={`mumkinMedh text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 leading-tight pt-8 md:pt-12 ${
                  isDark 
                    ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
                    : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
                }`} style={{ transform: 'scaleX(1.1)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  Medh Hai Toh Mumkin Hai !
                </div>
              </div>
            </div>

            {/* Why Choose Medh Job Assurance Programs? */}
            <div className="mt-0 text-center pb-8">
              <div className="rounded-2xl p-6 md:p-8 max-w-5xl lg:max-w-6xl mx-auto">
                <h3 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Why Choose Medh Job Assurance Programs?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Card 1 */}
                  <div
                    className="relative overflow-hidden rounded-xl p-4 md:p-6 group transition-all duration-300 text-center border border-white/10 backdrop-blur-xl shadow-md"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h4 className={`text-base md:text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-600'}`}>100% Job Guarantee</h4>
                      <p className={`text-sm md:text-base transition-colors ${isDark ? 'text-white group-hover:text-primary-100' : 'text-gray-700 group-hover:text-primary-700'}`}>We guarantee job placement or provide a full refund</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div
                    className="relative overflow-hidden rounded-xl p-4 md:p-6 group transition-all duration-300 text-center border border-white/10 backdrop-blur-xl shadow-md"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h4 className={`text-base md:text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-600'}`}>Industry Experts</h4>
                      <p className={`text-sm md:text-base transition-colors ${isDark ? 'text-white group-hover:text-primary-100' : 'text-gray-700 group-hover:text-primary-700'}`}>Learn from professionals with 10+ years of experience</p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div
                    className="relative overflow-hidden rounded-xl p-4 md:p-6 group transition-all duration-300 text-center border border-white/10 backdrop-blur-xl shadow-md"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h4 className={`text-base md:text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-600'}`}>Corporate Internship</h4>
                      <p className={`text-sm md:text-base transition-colors ${isDark ? 'text-white group-hover:text-primary-100' : 'text-gray-700 group-hover:text-primary-700'}`}>3 months of hands-on experience with our partner companies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
      
      {/* Placement Form Modal */}
      <PlacementFormModal />
    </>
  );
};

export default PlacementGauranteedBanner;