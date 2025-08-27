"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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

            {/* MEDH's Triple Advantage */}
            <div className="mt-0 text-center pb-8">
              <div className="rounded-2xl p-6 md:p-8 max-w-5xl lg:max-w-6xl mx-auto">
                {/* Header with icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-md">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                      <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z"/>
                      <path d="M5 6L5.74 8.74L8.5 9.5L5.74 10.26L5 13L4.26 10.26L1.5 9.5L4.26 8.74L5 6Z"/>
                    </svg>
                  </div>
                </div>
                
                <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-center bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent`}>
                  MEDH's Triple Advantage
                </h3>
                
                {/* Three advantages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                  {/* Expert Training */}
                  <div
                    className="relative overflow-hidden rounded-xl p-4 md:p-6 group transition-all duration-300 text-center border border-white/10 backdrop-blur-xl shadow-md"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                          <path d="M2 17L12 22L22 17"/>
                          <path d="M2 12L12 17L22 12"/>
                        </svg>
                      </div>
                      <h4 className={`text-base md:text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-600'}`}>Expert Training</h4>
                      <p className={`text-sm md:text-base transition-colors ${isDark ? 'text-white group-hover:text-primary-100' : 'text-gray-700 group-hover:text-primary-700'}`}>Industry-leading curriculum <br />  with hands-on projects</p>
                    </div>
                  </div>
                  
                  {/* Real-World Internship */}
                  <div
                    className="relative overflow-hidden rounded-xl p-4 md:p-6 group transition-all duration-300 text-center border border-white/10 backdrop-blur-xl shadow-md"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 7L10 17L5 12L6.41 10.59L10 14.17L18.59 5.58L20 7Z"/>
                        </svg>
                      </div>
                      <h4 className={`text-base md:text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-600'}`}>Industry Internship</h4>
                      <p className={`text-sm md:text-base transition-colors ${isDark ? 'text-white group-hover:text-primary-100' : 'text-gray-700 group-hover:text-primary-700'}`}>3-month mandatory internship <br /> with industry partners</p>
                    </div>
                  </div>
                  
                  {/* Job Guarantee */}
                  <div
                    className="relative overflow-hidden rounded-xl p-4 md:p-6 group transition-all duration-300 text-center border border-white/10 backdrop-blur-xl shadow-md"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z"/>
                          <path d="M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12S9.79 8 12 8 16 9.79 16 12 14.21 16 12 16Z"/>
                        </svg>
                      </div>
                      <h4 className={`text-base md:text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-600'}`}>Job Guarantee</h4>
                      <p className={`text-sm md:text-base transition-colors ${isDark ? 'text-white group-hover:text-primary-100' : 'text-gray-700 group-hover:text-primary-700'}`}>100% placement guarantee <br /> or money back</p>
                    </div>
                  </div>
                </div>
                
                {/* Main tagline */}
                <div className="space-y-3 mb-4">
                  {/* <p className={`text-base md:text-lg lg:text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Expert Training, Real-World Internship, and Job Guarantee
                  </p> */}
                  <Link href="/money-guarantee-policy/" className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <span className="text-sm md:text-base font-bold">or Get Your Money Back</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  </Link>
                </div>
                
                {/* Quote section */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 backdrop-blur-sm rounded-lg border border-blue-200/40 dark:border-blue-600/40 shadow-md">
                  
                  <p className={`text-sm md:text-base italic font-medium text-center leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    "Our commitment to your success is backed by our Money Guarantee – <br />
                    we invest in you because we believe in you."
                  </p>
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