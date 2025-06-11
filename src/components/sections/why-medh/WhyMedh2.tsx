"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Target, 
  Zap, 
  Star, 
  ArrowUpRight,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Trophy,
  Shield
} from "lucide-react";
import { VideoBackgroundContext } from "@/components/layout/main/Home2";
import { useTheme } from "next-themes";
import placement from "@/assets/images/iso/pllacement-logo.png";
import hire from "@/assets/images/hire/placement.png";

// Define interfaces
interface IWhyMedhFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface IWhyMedhProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const WhyMedh: React.FC<IWhyMedhProps> = ({
  title = "Why Choose MEDH?",
  subtitle = "Our Approach",
  description = "Empowering learners with the freedom to explore, we go beyond fundamentals, fostering critical thinking and creativity."
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const videoContext = useContext(VideoBackgroundContext);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const isDark = mounted ? theme === 'dark' : true;
  
  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    const handleScroll = (): void => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          sectionRef.current.classList.add('section-visible');
          void sectionRef.current.offsetHeight;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.classList.add('section-visible');
        void sectionRef.current.offsetHeight;
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const features: IWhyMedhFeature[] = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Quality Content",
      description: "We ensure up-to-date, well-structured materials that drive real learning outcomes.",
      color: "blue"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Learning Resources",
      description: "Diverse, inclusive materials tailored to learners of all backgrounds and skill levels.",
      color: "green"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Expert Mentorship",
      description: "Learn from qualified instructors through practical projects and guided assignments.",
      color: "purple"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Learning",
      description: "Customize your learning path with flexible modules to fit your unique goals.",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "text-white dark:text-blue-400 bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/30 shadow-lg shadow-blue-500/20 dark:shadow-none",
      green: "text-white dark:text-green-400 bg-gradient-to-br from-green-500/90 to-green-600/90 dark:bg-green-900/20 border-green-200/50 dark:border-green-800/30 shadow-lg shadow-green-500/20 dark:shadow-none",
      purple: "text-white dark:text-purple-400 bg-gradient-to-br from-purple-500/90 to-purple-600/90 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-800/30 shadow-lg shadow-purple-500/20 dark:shadow-none",
      orange: "text-white dark:text-orange-400 bg-gradient-to-br from-orange-500/90 to-orange-600/90 dark:bg-orange-900/20 border-orange-200/50 dark:border-orange-800/30 shadow-lg shadow-orange-500/20 dark:shadow-none"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getCardClasses = (color: string) => {
    const cardColorMap = {
      blue: "hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20",
      green: "hover:shadow-green-500/10 dark:hover:shadow-green-500/20",
      purple: "hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20",
      orange: "hover:shadow-orange-500/10 dark:hover:shadow-orange-500/20"
    };
    return cardColorMap[color as keyof typeof cardColorMap] || cardColorMap.blue;
  };

  const handleNavigateToPlacement = (): void => {
    router.push("/placement-guaranteed-courses");
  };

  const handleGetStarted = (): void => {
    router.push("/signup");
  };

  const handleLearnMore = (): void => {
    router.push("/about-us");
  };

  if (!mounted) {
    return (
      <div className="py-4 opacity-0">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sectionRef}
      className={`w-full transition-all duration-1000 opacity-0 translate-y-8 ${isVisible ? 'opacity-100 translate-y-0' : ''} py-8 relative overflow-hidden ${
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

      {/* Job Guarantee Section */}
      <section className="w-full py-6 md:py-8 lg:py-10 xl:py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col items-center gap-8 md:gap-12 lg:gap-16">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 md:w-72 h-40 md:h-72 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-[80px] md:blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 md:w-72 h-40 md:h-72 rounded-full bg-green-100 dark:bg-green-900/20 blur-[80px] md:blur-[100px] opacity-30 translate-x-1/2 translate-y-1/2"></div>
            
            {/* Content */}
            <div className="w-full max-w-2xl text-center relative z-10">
                          <div className="inline-flex items-center gap-2 mb-6 md:mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Shield className="w-4 h-4 text-white drop-shadow-sm" />
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
                className="mx-auto mb-6 md:mb-8 w-auto h-auto max-w-[200px] sm:max-w-[260px]"
                priority
              />
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white leading-tight">
                100% Job-guaranteed Courses from <span className="text-green-600 dark:text-green-400">Medh</span>.
              </h2>
              
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2 max-w-md mx-auto">
                Our job guarantee program ensures that you'll land a job in your field within six months of course completion, or
              </p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-8 md:mb-10 max-w-md mx-auto">
                <b>We will refund your course fee.</b>
              </p>
            </div>
            
            {/* Image */}
            <div className="w-full max-w-lg relative z-10">
              <div className="relative mx-auto">
                <div className="absolute inset-0 -left-2 md:-left-3 -top-2 md:-top-3 bg-gradient-to-br from-green-500/20 to-primary-500/10 dark:from-green-500/30 dark:to-primary-500/20 rounded-xl md:rounded-2xl transform rotate-2 scale-[1.03]"></div>
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md md:shadow-xl">
                  <Image
                    src={hire}
                    width={600}
                    height={400}
                    alt="Hiring"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleNavigateToPlacement}
              className="mt-4 md:mt-6 inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-sm md:text-base font-medium rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group relative z-10"
            >
              Explore Job Guaranteed Courses
              <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose MEDH Section */}
      <section className="w-full py-6 md:py-8 lg:py-10 xl:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 lg:mb-24">
            <div className="inline-flex items-center gap-2 mb-6 md:mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
              Why Choose <span className="text-green-600 dark:text-green-400">MEDH</span>?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20 lg:mb-24">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative h-full transition-all duration-500 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className={`relative h-full rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800/50 overflow-hidden shadow-md hover:shadow-xl ${getCardClasses(feature.color)} transition-all duration-300 hover:-translate-y-1 p-6`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 hover:shadow-xl`}>
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
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
          <div className="text-center mb-16 md:mb-20 lg:mb-24">
            <div className="inline-flex items-center gap-2 mb-8 md:mb-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                <Trophy className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Our Certifications! 🏆
              </h3>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 md:mb-12">
              Swipe to explore our achievements ✨
            </p>
            
            {/* Certification highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { title: "ISO Certified", description: "Quality Management System" },
                { title: "Industry Partners", description: "Leading tech companies" },
                { title: "Expert Faculty", description: "Industry professionals" },
                { title: "Global Recognition", description: "Worldwide acceptance" }
              ].map((cert, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 hover:scale-110 transition-all duration-300">
                    <Award className="w-6 h-6 text-white drop-shadow-sm" />
                  </div>
                  <div className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {cert.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {cert.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
              >
                <span className="relative z-10">Get Started Today</span>
                <ArrowUpRight size={18} className="ml-2 relative z-10 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
              
              <button
                onClick={handleLearnMore}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="relative z-10">Learn More</span>
                <Star size={18} className="ml-2 relative z-10 transform group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>
            
            <p className="mt-8 md:mt-10 text-sm text-gray-500 dark:text-gray-400">
              Join thousands of successful graduates who've transformed their careers with Medh
            </p>
          </div>
        </div>
      </section>

      {/* Animation styles */}
      <style jsx>{`
        .section-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default WhyMedh; 