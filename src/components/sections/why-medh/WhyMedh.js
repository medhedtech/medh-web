"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay } from "swiper/modules";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import InfoIcon from "@/assets/images/icon/InfoIcon";
import placement from "@/assets/images/iso/pllacement-logo.png";
import hire from "@/assets/images/hire/placement.png";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import Certified from "./Certified";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Info } from "lucide-react";

const WhyMedh = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Custom navigation refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const content = [
    {
      id: 1,
      title: "Quality of Content and Curriculum",
      desc: "We assess content quality, effectiveness, and engagement, ensuring up-to-date, well-structured materials that drive learning outcomes.",
      icon: "quality",
    },
    {
      id: 2,
      title: "Comprehensive Learning Resources",
      desc: "Our platform provides diverse, inclusive materials tailored to learners of all backgrounds and skill levels.",
      icon: "resources",
    },
    {
      id: 3,
      title: "Expert Mentorship",
      desc: "Learn from highly qualified instructors dedicated to your success through practical projects and assignments.",
      icon: "mentorship",
    },
    {
      id: 4,
      title: "Personalized Learning",
      desc: "Customize your learning path with flexible modules and tailored recommendations to fit your goals.",
      icon: "personalized",
    },
  ];

  useEffect(() => {
    // Initialize Swiper navigation
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.update();
    }
    
    // Show with animation after loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Job Guarantee Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-secondary-100 dark:bg-secondary-900/20 blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
            
            {/* Content */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="max-w-md mx-auto md:mx-0">
                <Image
                  src={placement}
                  width={300}
                  height={161}
                  alt="100% Job-guaranteed"
                  className="mx-auto md:mx-0 mb-6"
                />
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                  100% Job-guaranteed Courses from <span className="text-primary-500 dark:text-primary-400">Medh</span>.
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Our job guarantee program ensures that you'll land a job in your field within 6 months of graduation, or we'll refund your course fee.
                </p>
                
                <button
                  onClick={() => router.push("/placement-guaranteed-courses")}
                  className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <ArrowIcon className="mr-2" />
                  Explore Courses
                </button>
              </div>
            </div>
            
            {/* Image */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <div className="absolute inset-0 -left-4 -top-4 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl transform rotate-3"></div>
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={hire}
                    width={530}
                    height={454}
                    alt="Hiring"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Medh Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-25 dark:opacity-10"
          style={{ backgroundImage: `url(${bgImg.src})` }}>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Content container */}
            <div className="w-full lg:w-1/2 lg:pr-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 relative overflow-hidden">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                  Our Approach
                </span>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                  Why <span className="text-primary-500 dark:text-primary-400">MEDH</span>?
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Empowering learners with the freedom to explore, we go beyond fundamental concepts, fostering brainstorming, critical thinking, and beyond. We aim to provide learners with the canvas to visualize and pursue their aspirations.
                </p>

                {/* Carousel */}
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Autoplay]}
                    loop={true}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    onBeforeInit={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                      prevEl: prevRef.current,
                      nextEl: nextRef.current,
                    }}
                    className="px-2 py-2"
                  >
                    {content.map((item) => (
                      <SwiperSlide key={item.id}>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 cursor-grab">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <CheckCircle className="text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0" size={20} />
                            {item.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-6 pl-7">
                            {item.desc}
                          </p>
                          
                          <button
                            onClick={() => router.push("/about-us")}
                            className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors ml-7"
                          >
                            <Info size={16} className="mr-2" />
                            More Info
                          </button>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <div
                    ref={prevRef}
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
                      aria-label="Previous slide"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  </div>
                  
                  <div
                    ref={nextRef}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
                      aria-label="Next slide"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features list */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.map((item, index) => (
                  <div 
                    key={item.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                      <CheckCircle className="text-primary-500 dark:text-primary-400" size={20} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
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
