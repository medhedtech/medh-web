"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Building, ArrowUpRight, Sparkles, Trophy, Award, Target, Zap, Globe, Clock, DollarSign, BookOpen, ArrowRight, TrendingUp, Users } from "lucide-react";
import { VideoBackgroundContext } from "@/components/layout/main/Home2";
import { useTheme } from "next-themes";
import Educator from "@/assets/images/hire/Educator.png";
import Partner from "@/assets/images/hire/Partner.png";

// Define interfaces
interface IFeature {
  icon: React.ReactNode;
  text: string;
}

interface IJoinMedhProps {
  title?: string;
  subtitle?: string;
  description?: string;
  educatorImage?: string;
  educatorTitle?: string;
  educatorText?: string;
  educatorButtonText?: string;
  partnerImage?: string;
  partnerTitle?: string;
  partnerText?: string;
  partnerButtonText?: string;
}

const JoinMedh: React.FC<IJoinMedhProps> = ({
  title = "Join Our Educational Ecosystem",
  subtitle = "Transform Education",
  description = "Become part of a revolutionary platform that's transforming education",
  educatorImage = Educator,
  educatorTitle = "Join Medh as an Educator",
  educatorText = "Join Medh's pioneering learning community and contribute to shaping a transformative educational journey for learners worldwide.",
  educatorButtonText = "Get Started",
  partnerImage = Partner,
  partnerTitle = "Partner with Medh as a School / Institute",
  partnerText = "To implement customized skill development programs, empowering your students to excel in their chosen fields on a global scale.",
  partnerButtonText = "Let's Collaborate"
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const videoContext = useContext(VideoBackgroundContext);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const educatorRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const isDark = mounted ? theme === 'dark' : true;
  
  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    const handleScroll = (): void => {
      if (educatorRef.current && partnerRef.current) {
        const educatorRect = educatorRef.current.getBoundingClientRect();
        const partnerRect = partnerRef.current.getBoundingClientRect();
        
        if (educatorRect.top < window.innerHeight * 0.75 && educatorRect.bottom > 0) {
          educatorRef.current.classList.add('card-visible');
          void educatorRef.current.offsetHeight;
        }
        
        if (partnerRect.top < window.innerHeight * 0.75 && partnerRect.bottom > 0) {
          partnerRef.current.classList.add('card-visible');
          void partnerRef.current.offsetHeight;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => {
      if (educatorRef.current && partnerRef.current) {
        educatorRef.current.classList.add('card-visible');
        partnerRef.current.classList.add('card-visible');
        void educatorRef.current.offsetHeight;
        void partnerRef.current.offsetHeight;
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const educatorFeatures: IFeature[] = [
    { icon: <Trophy size={16} className="text-primary-500 dark:text-primary-400" />, text: "Global teaching platform" },
    { icon: <Target size={16} className="text-primary-500 dark:text-primary-400" />, text: "Flexible scheduling" },
    { icon: <Zap size={16} className="text-primary-500 dark:text-primary-400" />, text: "Competitive compensation" },
    { icon: <Award size={16} className="text-primary-500 dark:text-primary-400" />, text: "Teaching resources provided" }
  ];
  
  const partnerFeatures: IFeature[] = [
    { icon: <Zap size={16} className="text-amber-500 dark:text-amber-400" />, text: "Customized training programs" },
    { icon: <Award size={16} className="text-amber-500 dark:text-amber-400" />, text: "Industry-aligned curriculum" },
    { icon: <Trophy size={16} className="text-amber-500 dark:text-amber-400" />, text: "Cutting-edge resources" },
    { icon: <Target size={16} className="text-amber-500 dark:text-amber-400" />, text: "Enhanced employability" }
  ];

  const handleEducatorNavigate = (): void => {
    router.push("/join-us-as-educator");
  };

  const handlePartnerNavigate = (): void => {
    router.push("/join-us-as-school-institute");
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
      className={`w-full transition-all duration-1000 opacity-0 translate-y-8 ${isVisible ? 'opacity-100 translate-y-0' : ''} py-4 relative overflow-hidden ${
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

      <section className="w-full py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-30 -translate-x-1/2"></div>
            <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-30 translate-x-1/2"></div>
          </div>

          {/* Header */}
          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Educational Ecosystem
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Join Our Educational <span className="text-primary-600 dark:text-primary-400">Ecosystem</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Be part of a thriving community that's shaping the future of education. Whether you're an educator or an institution, we have the perfect platform for you.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
            {/* Educator Card */}
            <div 
              className="group relative h-full transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: '200ms' }}
            >
              <div className="relative h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Join Medh as an Educator
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Share your expertise globally
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Globe, text: "Global teaching platform with worldwide reach" },
                    { icon: Clock, text: "Flexible scheduling that fits your lifestyle" },
                    { icon: DollarSign, text: "Competitive compensation and revenue sharing" },
                    { icon: BookOpen, text: "Access to comprehensive teaching resources" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleEducatorNavigate}
                  className="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10">Become an Educator</span>
                  <ArrowRight className="ml-2 w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </button>

                {/* Card decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-blue-500/10 rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Institution Card */}
            <div 
              className="group relative h-full transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: '400ms' }}
            >
              <div className="relative h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Partner with Medh as a School / Institute
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enhance your educational offerings
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Target, text: "Customized training programs for your students" },
                    { icon: TrendingUp, text: "Industry-aligned curriculum and certifications" },
                    { icon: Zap, text: "Access to cutting-edge educational resources" },
                    { icon: Award, text: "Enhanced student employability and outcomes" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handlePartnerNavigate}
                  className="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10">Partner with Us</span>
                  <ArrowRight className="ml-2 w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </button>

                {/* Card decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16 relative z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Ready to get started?
              </span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of educators and institutions who are already part of our growing ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleEducatorNavigate}
                className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-all duration-300 border border-primary-200 dark:border-primary-800"
              >
                <Users className="mr-2 w-4 h-4" />
                For Educators
              </button>
              <button
                onClick={handlePartnerNavigate}
                className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-300 border border-green-200 dark:border-green-800"
              >
                <Building className="mr-2 w-4 h-4" />
                For Institutions
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

export default JoinMedh; 