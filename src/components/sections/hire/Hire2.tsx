"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, useContext } from "react";
import hire from "@/assets/images/hire/Hire.png";
import Traning from "@/assets/images/hire/Traning.png";
import { useRouter } from "next/navigation";
import { Briefcase, Users, ArrowUpRight, Sparkles, LucideTarget, Award, Zap, Trophy, Target, Clock, Globe, BookOpen, BarChart, TrendingUp, ArrowRight, Building } from "lucide-react";
import { VideoBackgroundContext } from "@/components/layout/main/Home2";
import { useTheme } from "next-themes";

// Define interfaces
interface IHireFeature {
  icon: React.ReactNode;
  text: string;
}

interface IHireProps {
  hireImage?: string;
  hireTitle?: string;
  hireText?: string;
  hireButtonText?: string;
  trainingImage?: string;
  trainingTitle?: string;
  trainingText?: string;
  trainingButtonText?: string;
}

const Hire: React.FC<IHireProps> = ({
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
  const { theme } = useTheme();
  const videoContext = useContext(VideoBackgroundContext);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const hireRef = useRef<HTMLDivElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const isDark = mounted ? theme === 'dark' : true;
  
  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    const handleScroll = (): void => {
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
  
  const hireFeatures: IHireFeature[] = [
    { icon: <Trophy size={16} className="text-purple-500 dark:text-purple-400" />, text: "Pre-screened talent pool" },
    { icon: <LucideTarget size={16} className="text-purple-500 dark:text-purple-400" />, text: "Targeted skill matching" },
    { icon: <Zap size={16} className="text-purple-500 dark:text-purple-400" />, text: "Streamlined hiring process" },
    { icon: <Award size={16} className="text-purple-500 dark:text-purple-400" />, text: "Quality assured candidates" }
  ];
  
  const trainingFeatures: IHireFeature[] = [
    { icon: <Zap size={16} className="text-green-500 dark:text-green-400" />, text: "Customized training modules" },
    { icon: <Award size={16} className="text-green-500 dark:text-green-400" />, text: "Industry expert trainers" },
    { icon: <Trophy size={16} className="text-green-500 dark:text-green-400" />, text: "Hands-on practical sessions" },
    { icon: <LucideTarget size={16} className="text-green-500 dark:text-green-400" />, text: "Skill-gap analysis included" }
  ];

  const handleHireNavigate = (): void => {
    router.push("/hire-from-medh");
  };

  const handleTrainingNavigate = (): void => {
    router.push("/corporate-training-courses");
  };

  if (!mounted) {
    return (
      <div className="py-4 opacity-0">
        <div className="mb-10 text-center max-w-md mx-auto">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sectionRef}
      className={`w-full transition-all duration-1000 opacity-0 translate-y-8 ${isVisible ? 'opacity-100 translate-y-0' : ''} py-6 relative overflow-hidden ${
        !isDark ? 'bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/40' : ''
      }`}
    >
      {/* Video Background - Use shared video if available */}
      {mounted && videoContext?.videoRef?.current && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className={`absolute inset-0 w-full h-full object-cover scale-105 ${
              isDark ? 'opacity-20' : 'opacity-15'
            }`}
            style={{ 
              filter: isDark 
                ? 'brightness(0.4) contrast(1.1) saturate(0.9) hue-rotate(5deg)' 
                : 'brightness(1.2) contrast(0.8) saturate(0.7) hue-rotate(-10deg) blur(0.5px)',
              background: `url(${videoContext.videoRef.current.currentSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {/* Enhanced overlay for better content readability */}
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-b from-black/5 via-black/2 to-black/5' 
              : 'bg-gradient-to-b from-white/15 via-white/8 to-white/12'
          }`}></div>
          <div className={`absolute inset-0 ${
            isDark ? 'backdrop-blur-[0.5px]' : 'backdrop-blur-[1px]'
          }`}></div>
        </div>
      )}
      
      {/* Fallback subtle pattern for light theme when no video */}
      {mounted && !isDark && !videoContext?.videoRef?.current && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 w-full h-full opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(55, 147, 146, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(55, 147, 146, 0.08) 0%, transparent 50%),
                linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(55, 147, 146, 0.05) 100%)
              `,
              backgroundSize: '400px 400px, 300px 300px, 100% 100%'
            }}
          />
        </div>
      )}

      <section className="w-full py-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-0 w-72 h-72 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-30 -translate-x-1/2"></div>
            <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl opacity-30 translate-x-1/2"></div>
          </div>

          {/* Header */}
          <div className="text-center mb-16 md:mb-20 lg:mb-24 relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 md:mb-8">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Hiring Solutions
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
              Hire Top <span className="text-blue-600 dark:text-blue-400">Talent</span> from Medh
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Connect with skilled professionals and get customized training solutions for your organization's growth.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
            {/* Hire from Medh Card */}
            <div 
              className="group relative h-full transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: '200ms' }}
            >
              <div className="relative h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Hire from Medh
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Access skilled professionals
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Target, text: "Pre-screened candidates with verified skills" },
                    { icon: Clock, text: "Faster hiring process with reduced time-to-hire" },
                    { icon: Award, text: "Industry-certified professionals ready to contribute" },
                    { icon: TrendingUp, text: "Access to diverse talent pool across domains" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleHireNavigate}
                  className="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10">Hire from Medh</span>
                  <ArrowRight className="ml-2 w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </button>

                {/* Card decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Corporate Training Card */}
            <div 
              className="group relative h-full transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: '400ms' }}
            >
              <div className="relative h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Corporate Training
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Upskill your workforce
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Zap, text: "Customized training programs for your team" },
                    { icon: Globe, text: "Flexible delivery modes: online, offline, hybrid" },
                    { icon: BookOpen, text: "Industry-relevant curriculum and certifications" },
                    { icon: BarChart, text: "Measurable outcomes and progress tracking" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleTrainingNavigate}
                  className="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10">Get Corporate Training</span>
                  <ArrowRight className="ml-2 w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </button>

                {/* Card decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16 md:mt-20 lg:mt-24 relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 md:mb-8">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Ready to transform your business?
              </span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto">
              Whether you need skilled professionals or want to upskill your existing team, we have the right solution for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleHireNavigate}
                className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-300 border border-blue-200 dark:border-blue-800"
              >
                <Users className="mr-2 w-4 h-4" />
                Hire Talent
              </button>
              <button
                onClick={handleTrainingNavigate}
                className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-300 border border-purple-200 dark:border-purple-800"
              >
                <Building className="mr-2 w-4 h-4" />
                Corporate Training
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animation styles */}
      <style jsx>{`
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default Hire; 