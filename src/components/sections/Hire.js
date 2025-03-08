"use client"
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import hire from "@/assets/images/hire/Hire.png";
import Traning from "@/assets/images/hire/Traning.png";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  ArrowRight, 
  Users, 
  ChevronRight, 
  Target, 
  Award, 
  Sparkles, 
  Zap 
} from "lucide-react";

// Hire component with customizable content and styles
const Hire = ({
  hireImage = hire,
  hireTitle = "Hire from Medh",
  hireText = "Recruit industry-trained, job-ready top talents to meet your business needs through our placement services.",
  hireButtonText = "Recruit@Medh",
  hireButtonColor = "#7ECA9D",
  hireButtonTextColor = "white",
  trainingImage = Traning,
  trainingTitle = "Corporate Training",
  trainingText = "Enhance your employees' skills, motivation, and engagement with our dynamic Training Courses.",
  trainingButtonText = "Empower Your Team",
  trainingButtonColor = "white",
  trainingButtonTextColor = "black",
  trainingBackgroundColor = "#7ECA9D",
  trainingTextColor = "white",
  hireBackground = "#EDE6FF",
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveredHire, setIsHoveredHire] = useState(false);
  const [isHoveredTraining, setIsHoveredTraining] = useState(false);
  
  const hireRef = useRef(null);
  const trainingRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    const observerOptions = {
      threshold: 0.2,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, observerOptions);
    
    const elements = [hireRef.current, trainingRef.current];
    elements.forEach(el => el && observer.observe(el));
    
    return () => {
      clearTimeout(timer);
      elements.forEach(el => el && observer.unobserve(el));
    };
  }, []);

  return (
    <div className="py-4 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 -translate-x-1/3"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-100/40 dark:bg-green-900/10 rounded-full blur-3xl opacity-60 translate-y-1/2 translate-x-1/3"></div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 transition-all duration-1000 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Hire Card */}
        <div 
          ref={hireRef}
          className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
          onMouseEnter={() => setIsHoveredHire(true)}
          onMouseLeave={() => setIsHoveredHire(false)}
        >
          {/* Background image/gradient overlay with animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-violet-600/90 dark:from-purple-800/90 dark:to-violet-900/90 z-10 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <Image 
              src={hireImage} 
              alt="Hire background" 
              width={600} 
              height={400}
              className="w-full h-full object-cover object-center transition-all duration-700 scale-100 group-hover:scale-110"
            />
          </div>
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-800/90 via-purple-700/70 to-transparent z-[1]"></div>
          
          {/* Content container */}
          <div className="relative z-20 p-8 h-full flex flex-col transition-all duration-500">
            <div className="flex items-center gap-4 mb-6 transition-all duration-500 transform group-hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Briefcase className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <span className="bg-white/20 text-white text-xs font-medium rounded-full px-3 py-1 backdrop-blur-sm">For Recruiters</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-2">
                  {hireTitle}
                </h3>
              </div>
            </div>
            
            <div className="mb-6 flex-grow opacity-90 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                {hireText}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 opacity-80 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-full bg-white/20 text-white mt-0.5">
                  <Target size={14} />
                </div>
                <p className="text-white/90 text-sm">Top talent pool</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-full bg-white/20 text-white mt-0.5">
                  <Award size={14} />
                </div>
                <p className="text-white/90 text-sm">Industry-ready skills</p>
              </div>
            </div>
            
            <button
              onClick={() => router.push("/hire-from-medh")}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-purple-700 bg-white hover:bg-gray-100 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform group-hover:translate-y-0 translate-y-0 group-hover:scale-[1.02]"
            >
              <span>{hireButtonText}</span>
              <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Training Card */}
        <div 
          ref={trainingRef}
          className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
          onMouseEnter={() => setIsHoveredTraining(true)}
          onMouseLeave={() => setIsHoveredTraining(false)}
        >
          {/* Background image/gradient overlay with animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-teal-600/90 dark:from-green-800/90 dark:to-teal-900/90 z-10 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <Image 
              src={trainingImage} 
              alt="Training background" 
              width={600} 
              height={400}
              className="w-full h-full object-cover object-center transition-all duration-700 scale-100 group-hover:scale-110"
            />
          </div>
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-800/90 via-green-700/70 to-transparent z-[1]"></div>
          
          {/* Content container */}
          <div className="relative z-20 p-8 h-full flex flex-col transition-all duration-500">
            <div className="flex items-center gap-4 mb-6 transition-all duration-500 transform group-hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <span className="bg-white/20 text-white text-xs font-medium rounded-full px-3 py-1 backdrop-blur-sm">For Organizations</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-2">
                  {trainingTitle}
                </h3>
              </div>
            </div>
            
            <div className="mb-6 flex-grow opacity-90 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                {trainingText}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 opacity-80 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-full bg-white/20 text-white mt-0.5">
                  <Sparkles size={14} />
                </div>
                <p className="text-white/90 text-sm">Enhanced engagement</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-full bg-white/20 text-white mt-0.5">
                  <Zap size={14} />
                </div>
                <p className="text-white/90 text-sm">Boosted productivity</p>
              </div>
            </div>
            
            <button
              onClick={() => router.push("/corporate-training-courses")}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-green-700 bg-white hover:bg-gray-100 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform group-hover:translate-y-0 translate-y-0 group-hover:scale-[1.02]"
            >
              <span>{trainingButtonText}</span>
              <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hire; 