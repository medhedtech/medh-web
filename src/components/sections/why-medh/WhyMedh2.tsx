"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import placement from "@/assets/images/iso/pllacement-logo.png";
import hire from "@/assets/images/hire/placement.png";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import Certified from "./Certified";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight } from "lucide-react";

// Define interfaces
interface IWhyMedhContent {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

// Dynamically import Swiper component to prevent SSR issues
const DynamicSwiperComponent = dynamic(
  () => import('./SwiperComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="pb-10">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm h-full border border-gray-100 dark:border-gray-700/50">
          <div className="w-8 h-8 flex items-center justify-center bg-primary-50 dark:bg-primary-900/20 rounded-full mb-3">
            <CheckCircle className="text-primary-500 dark:text-primary-400" size={16} />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }
);

const WhyMedh: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const content: IWhyMedhContent[] = [
    {
      id: 1,
      title: "Quality Content",
      desc: "We ensure up-to-date, well-structured materials that drive real learning outcomes.",
      icon: "quality",
    },
    {
      id: 2,
      title: "Learning Resources",
      desc: "Diverse, inclusive materials tailored to learners of all backgrounds and skill levels.",
      icon: "resources",
    },
    {
      id: 3,
      title: "Expert Mentorship",
      desc: "Learn from qualified instructors through practical projects and guided assignments.",
      icon: "mentorship",
    },
    {
      id: 4,
      title: "Personalized Learning",
      desc: "Customize your learning path with flexible modules to fit your unique goals.",
      icon: "personalized",
    },
  ];

  useEffect(() => {
    // Show with animation after loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleNavigateToPlacement = (): void => {
    router.push("/placement-guaranteed-courses");
  };

  return (
    <div 
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      suppressHydrationWarning={true}
    >
      {/* Job Guarantee Section - Optimized for mobile */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative flex flex-col items-center gap-6 md:gap-10">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 md:w-72 h-40 md:h-72 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-[80px] md:blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 md:w-72 h-40 md:h-72 rounded-full bg-secondary-100 dark:bg-secondary-900/20 blur-[80px] md:blur-[100px] opacity-30 translate-x-1/2 translate-y-1/2"></div>
            
            {/* Content - Optimized for mobile */}
            <div className="w-full max-w-xl text-center">
              <Image
                src={placement}
                width={260}
                height={140}
                alt="100% Job-guaranteed"
                className="mx-auto mb-4 md:mb-6 w-auto h-auto max-w-[200px] sm:max-w-[260px]"
                priority
              />
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-white leading-tight">
                100% Job-guaranteed Courses from <span className="text-medhgreen dark:text-medhgreen">Medh</span>.
              </h2>
              
              {/* todo: break after or */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-5 md:mb-6 max-w-md mx-auto">
                Our job guarantee program ensures that you'll land a job in your field within six months of course completion, or
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 md:mb-2 max-w-md mx-auto ">
                <b>We will refund your course fee. </b>
              </p>
            </div>
            
            {/* Image - Smaller on mobile */}
            <div className="w-full max-w-lg">
              <div className="relative mx-auto">
                <div className="absolute inset-0 -left-2 md:-left-3 -top-2 md:-top-3 bg-gradient-to-br from-primary-500/20 to-indigo-500/10 dark:from-primary-500/30 dark:to-indigo-500/20 rounded-xl md:rounded-2xl transform rotate-2 scale-[1.03]"></div>
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
              className="mt-1 md:mt-2 inline-flex items-center px-5 py-2.5 md:px-6 md:py-3.5 bg-primary-500 hover:bg-primary-600 text-white text-sm md:text-base font-medium rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
            >
              Explore Job Guaranteed Courses
              <ChevronRight className="ml-1.5 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Medh Section - Optimized for mobile */}
      <section className="py-10 md:py-16 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-5"
          style={{ backgroundImage: `url(${bgImg.src})` }}>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col gap-6 md:gap-10 items-center">
            {/* Section header - optimized for mobile */}
            <div className="w-full text-center max-w-md mx-auto">
              <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs md:text-sm font-medium mb-2 md:mb-3">
                Our Approach
              </span>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-white">
                Why Choose <span className="text-medhgreen dark:text-medhgreen">MEDH</span>?
              </h2>
              
              <p className="text-xs sm:text-xs text-gray-600 dark:text-gray-300">
                Empowering learners with the freedom to explore, we go beyond fundamentals, fostering critical thinking and creativity.
              </p>
            </div>
            
            {/* Mobile-only slider - optimized for mobile viewing */}
            <div className="block sm:hidden w-full">
              <DynamicSwiperComponent content={content} />
            </div>
            
            {/* Tablet and desktop grid - hidden on mobile */}
            <div className="hidden sm:block w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {content.map((item, index) => (
                  <div 
                    key={item.id}
                    className="bg-white dark:bg-gray-800/90 p-5 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700/50 flex flex-col h-full"
                    style={{ transitionDelay: `${index * 75}ms` }}
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-primary-50 dark:bg-primary-900/20 rounded-full mb-3 md:mb-4">
                      <CheckCircle className="text-primary-500 dark:text-primary-400" size={16} />
                    </div>
                    
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm flex-grow">
                      {item.desc}
                    </p>
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certified & Recognized By Section */}
      <Certified />
    </div>
  );
};

export default WhyMedh; 