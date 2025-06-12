"use client"
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import hire from "@/assets/images/hire/Hire.png";
import Traning from "@/assets/images/hire/Traning.png";
import { useRouter } from "next/navigation";
import { Briefcase, Users, ArrowUpRight, Sparkles, LucideTarget, Award, Zap, Trophy } from "lucide-react";

const Hire = ({
  hireImage = hire,
  hireTitle = "Hire from Medh",
  hireText = "Recruit industry-trained, job-ready top talents to meet your business needs through our placement services.",
  hireButtonText = "Recruit@Medh",
  trainingImage = Traning,
  trainingTitle = "Corporate Training",
  trainingText = "Enhance your employees' skills, motivation, and engagement with our dynamic Training Courses.",
  trainingButtonText = "Empower Your Team",
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const hireRef = useRef(null);
  const trainingRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    const handleScroll = () => {
      if (hireRef.current && trainingRef.current) {
        const hireRect = hireRef.current.getBoundingClientRect();
        const trainingRect = trainingRef.current.getBoundingClientRect();
        
        if (hireRect.top < window.innerHeight * 0.75 && hireRect.bottom > 0) {
          hireRef.current.classList.add('card-visible');
          void hireRef.current.offsetHeight;
        }
        
        if (trainingRect.top < window.innerHeight * 0.75 && trainingRect.bottom > 0) {
          trainingRef.current.classList.add('card-visible');
          void trainingRef.current.offsetHeight;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => {
      if (hireRef.current && trainingRef.current) {
        hireRef.current.classList.add('card-visible');
        trainingRef.current.classList.add('card-visible');
        void hireRef.current.offsetHeight;
        void trainingRef.current.offsetHeight;
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const hireFeatures = [
    { icon: <Trophy size={16} className="text-purple-500 dark:text-purple-400" />, text: "Pre-screened talent pool" },
    { icon: <LucideTarget size={16} className="text-purple-500 dark:text-purple-400" />, text: "Targeted skill matching" },
    { icon: <Zap size={16} className="text-purple-500 dark:text-purple-400" />, text: "Streamlined hiring process" },
    { icon: <Award size={16} className="text-purple-500 dark:text-purple-400" />, text: "Quality assured candidates" }
  ];
  
  const trainingFeatures = [
    { icon: <Zap size={16} className="text-green-500 dark:text-green-400" />, text: "Customized training modules" },
    { icon: <Award size={16} className="text-green-500 dark:text-green-400" />, text: "Industry expert trainers" },
    { icon: <Trophy size={16} className="text-green-500 dark:text-green-400" />, text: "Hands-on practical sessions" },
    { icon: <LucideTarget size={16} className="text-green-500 dark:text-green-400" />, text: "Skill-gap analysis included" }
  ];

  return (
    <div className={`py-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-10 text-center max-w-md mx-auto">
        <h2 className="text-2xl md:text-2xl font-bold mb-3 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-primary-600 bg-clip-text text-transparent">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Partner with Medh
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Build your team or enhance your workforce with our specialized services
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Hire Card */}
        <div 
          ref={hireRef}
          className="group relative h-full opacity-0 translate-y-4 card-animation"
          onMouseEnter={() => setActiveCard('hire')}
          onMouseLeave={() => setActiveCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-violet-400/10 to-indigo-400/15 rounded-2xl rotate-1 scale-[0.98] translate-y-2 group-hover:scale-[1.01] group-hover:rotate-2 transition-transform duration-500 opacity-60 dark:opacity-20"></div>
          
          <div className="relative h-full rounded-2xl border border-purple-100 dark:border-purple-800/30 bg-white/60 backdrop-blur-sm dark:bg-gray-900/60 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
            {/* Card Content */}
            <div className="p-6 md:p-8 h-full flex flex-col relative z-10">
              {/* Icon and Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-purple-500 dark:text-purple-400" strokeWidth={1.5} />
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 font-medium">
                  For Employers
                </span>
              </div>
              
              {/* Title and Text */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                {hireTitle}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm md:text-base">
                {hireText}
              </p>
              
              {/* Image */}
              <div className="relative h-48 md:h-56 w-full mb-8 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent"></div>
                <Image
                  src={hireImage}
                  alt="Hire from Medh"
                  fill
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: '50% 30%' }}
                />
              </div>
              
              {/* Features */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Why hire from Medh?</p>
                <div className="grid grid-cols-2 gap-4">
                  {hireFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center mr-2 mt-0.5">
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
                  onClick={() => router.push("/hire-from-medh")}
                  className="relative w-full group/btn inline-flex items-center justify-center px-5 py-3.5 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                >
                  <span className="relative z-10">{hireButtonText}</span>
                  <ArrowUpRight size={18} className="ml-2 relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                  <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Training Card */}
        <div 
          ref={trainingRef}
          className="group relative h-full opacity-0 translate-y-4 card-animation delay-100"
          onMouseEnter={() => setActiveCard('training')}
          onMouseLeave={() => setActiveCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-teal-400/10 to-emerald-400/15 rounded-2xl rotate-1 scale-[0.98] translate-y-2 group-hover:scale-[1.01] group-hover:rotate-2 transition-transform duration-500 opacity-60 dark:opacity-20"></div>
          
          <div className="relative h-full rounded-2xl border border-green-100 dark:border-green-800/30 bg-white/60 backdrop-blur-sm dark:bg-gray-900/60 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
            {/* Card Content */}
            <div className="p-6 md:p-8 h-full flex flex-col relative z-10">
              {/* Icon and Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-green-500/20 to-teal-500/20 flex items-center justify-center">
                    <Users className="w-7 h-7 text-green-500 dark:text-green-400" strokeWidth={1.5} />
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 font-medium">
                  For Organizations
                </span>
              </div>
              
              {/* Title and Text */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                {trainingTitle}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm md:text-base">
                {trainingText}
              </p>
              
              {/* Image */}
              <div className="relative h-48 md:h-56 w-full mb-8 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent"></div>
                <Image
                  src={trainingImage}
                  alt="Corporate Training"
                  fill
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: '50% 30%' }}
                />
              </div>
              
              {/* Features */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Training advantages:</p>
                <div className="grid grid-cols-2 gap-4">
                  {trainingFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start p-3 rounded-lg bg-green-50 dark:bg-green-900/10">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center mr-2 mt-0.5">
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
                  onClick={() => router.push("/corporate-training-courses")}
                  className="relative w-full group/btn inline-flex items-center justify-center px-5 py-3.5 text-base font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                >
                  <span className="relative z-10">{trainingButtonText}</span>
                  <ArrowUpRight size={18} className="ml-2 relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                  <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-teal-600 to-green-600"></div>
                </button>
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

export default Hire;
