"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Educator from "@/assets/images/hire/Educator.png";
import Partner from "@/assets/images/hire/Partner.png";
import EducationBg from "@/assets/images/about/joinSvg.png";
import SchoolBg from "@/assets/images/about/Image.svg";
import { useRouter } from "next/navigation";
import { GraduationCap, Users, ChevronRight, Sparkles, Building, ArrowUpRight, Trophy, Award, LucideTarget, Zap } from "lucide-react";

const JoinMedh = ({
  educatorImage = Educator,
  educatorTitle = "Join Medh as an Educator",
  educatorText = "Join Medh's pioneering learning community and contribute to shaping a transformative educational journey for learners worldwide.",
  educatorButtonText = "Get Started",
  partnerImage = Partner,
  partnerTitle = "Partner with Medh as a School / Institute",
  partnerText = "To implement customized skill development programs, empowering your students to excel in their chosen fields on a global scale.",
  partnerButtonText = "Let's Collaborate",
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const educatorRef = useRef(null);
  const partnerRef = useRef(null);
  
  // Define features lists like in Hire.js
  const educatorFeatures = [
    { icon: <Trophy size={16} className="text-primary-500 dark:text-primary-400" />, text: "Global teaching platform" },
    { icon: <LucideTarget size={16} className="text-primary-500 dark:text-primary-400" />, text: "Flexible scheduling" },
    { icon: <Zap size={16} className="text-primary-500 dark:text-primary-400" />, text: "Competitive compensation" },
    { icon: <Award size={16} className="text-primary-500 dark:text-primary-400" />, text: "Teaching resources provided" }
  ];
  
  const partnerFeatures = [
    { icon: <Zap size={16} className="text-amber-500 dark:text-amber-400" />, text: "Customized training programs" },
    { icon: <Award size={16} className="text-amber-500 dark:text-amber-400" />, text: "Industry-aligned curriculum" },
    { icon: <Trophy size={16} className="text-amber-500 dark:text-amber-400" />, text: "Cutting-edge resources" },
    { icon: <LucideTarget size={16} className="text-amber-500 dark:text-amber-400" />, text: "Enhanced employability" }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    const handleScroll = () => {
      if (educatorRef.current && partnerRef.current) {
        const educatorRect = educatorRef.current.getBoundingClientRect();
        const partnerRect = partnerRef.current.getBoundingClientRect();
        
        if (educatorRect.top < window.innerHeight * 0.75 && educatorRect.bottom > 0) {
          educatorRef.current.classList.add('card-visible');
          // Force a repaint to ensure animations apply correctly
          void educatorRef.current.offsetHeight;
        }
        
        if (partnerRect.top < window.innerHeight * 0.75 && partnerRect.bottom > 0) {
          partnerRef.current.classList.add('card-visible');
          // Force a repaint to ensure animations apply correctly
          void partnerRef.current.offsetHeight;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Check on initial load - important for cards that are already in viewport
    setTimeout(() => {
      if (educatorRef.current && partnerRef.current) {
        // Apply visibility immediately if elements exist
        educatorRef.current.classList.add('card-visible');
        partnerRef.current.classList.add('card-visible');
        // Force browser to recognize the change
        void educatorRef.current.offsetHeight;
        void partnerRef.current.offsetHeight;
      }
    }, 100);  // Small delay to ensure refs are attached
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`py-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-10 text-center max-w-md mx-auto">
        <h2 className="text-2xl md:text-2xl font-bold mb-3 inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">
          <Sparkles className="text-primary-500" />
          Join Our Educational Ecosystem
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Become part of a revolutionary platform that's transforming education
        </p>
      </div>
      
      {/* Add decorative elements like in Hire.js */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100/40 dark:bg-primary-900/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-3xl opacity-60 translate-y-1/2 translate-x-1/3"></div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
          {/* Educator Card */}
          <div 
            ref={educatorRef}
            className="group relative h-full opacity-0 translate-y-4 card-animation"
            onMouseEnter={() => setActiveCard('educator')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-indigo-400/10 to-purple-400/15 rounded-2xl rotate-1 scale-[0.98] translate-y-2 group-hover:scale-[1.01] group-hover:rotate-2 transition-transform duration-500 opacity-60 dark:opacity-20"></div>
            
            <div className="relative h-full rounded-2xl border border-primary-100 dark:border-primary-800/30 bg-white/60 backdrop-blur-sm dark:bg-gray-900/60 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
              {/* Card Content */}
              <div className="p-6 md:p-8 h-full flex flex-col relative z-10">
                {/* Icon and Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 flex items-center justify-center">
                      <GraduationCap className="w-7 h-7 text-primary-500 dark:text-primary-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300 font-medium">
                    For Educators
                  </span>
                </div>
                
                {/* Title and Text */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {educatorTitle}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm md:text-base">
                  {educatorText}
                </p>
                
                {/* Image */}
                <div className="relative h-48 md:h-56 w-full mb-8 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent"></div>
                  <Image
                    src={educatorImage}
                    alt="Join as an Educator"
                    fill
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: '50% 30%' }}
                  />
                </div>
                
                {/* Features - Updated to match Hire.js style */}
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Why join as an educator?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {educatorFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start p-3 rounded-lg bg-primary-50 dark:bg-primary-900/10">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800/30 flex items-center justify-center mr-2 mt-0.5">
                          {feature.icon}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => router.push("/join-us-as-educator")}
                    className="relative w-full group/btn inline-flex items-center justify-center px-5 py-3.5 text-base font-medium text-white bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10">{educatorButtonText}</span>
                    <ArrowUpRight size={18} className="ml-2 relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                    <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-indigo-600 to-primary-600"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Card */}
          <div 
            ref={partnerRef}
            className="group relative h-full opacity-0 translate-y-4 card-animation delay-100"
            onMouseEnter={() => setActiveCard('partner')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-yellow-400/15 rounded-2xl rotate-1 scale-[0.98] translate-y-2 group-hover:scale-[1.01] group-hover:rotate-2 transition-transform duration-500 opacity-60 dark:opacity-20"></div>
            
            <div className="relative h-full rounded-2xl border border-amber-100 dark:border-amber-800/30 bg-white/60 backdrop-blur-sm dark:bg-gray-900/60 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
              {/* Card Content */}
              <div className="p-6 md:p-8 h-full flex flex-col relative z-10">
                {/* Icon and Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <Building className="w-7 h-7 text-amber-500 dark:text-amber-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300 font-medium">
                    For Institutions
                  </span>
                </div>
                
                {/* Title and Text */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                  {partnerTitle}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm md:text-base">
                  {partnerText}
                </p>
                
                {/* Image */}
                <div className="relative h-48 md:h-56 w-full mb-8 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent"></div>
                  <Image
                    src={partnerImage}
                    alt="Partner with Medh"
                    fill
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: '50% 30%' }}
                  />
                </div>
                
                {/* Features - Updated to match Hire.js style */}
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Partnership advantages:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {partnerFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center mr-2 mt-0.5">
                          {feature.icon}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => router.push("/join-us-as-school-institute")}
                    className="relative w-full group/btn inline-flex items-center justify-center px-5 py-3.5 text-base font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10">{partnerButtonText}</span>
                    <ArrowUpRight size={18} className="ml-2 relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                    <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-orange-600 to-amber-600"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-animation {
          opacity: 0;
          transform: translateY(1rem);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
      `}</style>
    </div>
  );
};

export default JoinMedh;
