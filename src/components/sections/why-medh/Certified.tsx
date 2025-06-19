"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import iso27001 from "@/assets/images/iso/iso27001.png";
import iso10002 from "@/assets/images/iso/iso10002.png";
import iso20000 from "@/assets/images/iso/iso20000.png";
import iso22301 from "@/assets/images/iso/iso22301.png";
import iso9001 from "@/assets/images/iso/iso9001.png";
import iso270001 from "@/assets/images/iso/iso27001.png";
import isoSTEM from "@/assets/images/iso/iso-STEM.jpg";
import isoUAEA from "@/assets/images/iso/iso-UAEA.jpg";

interface ICertification {
  image: string;
  alt: string;
  title: string;
  description: string;
}

interface ISliderSettings {
  dots: boolean;
  infinite: boolean;
  speed: number;
  arrows: boolean;
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
  pauseOnHover: boolean;
  centerMode: boolean;
  centerPadding: string;
  cssEase: string;
  swipeToSlide?: boolean;
  touchThreshold?: number;
  responsive: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
      centerMode: boolean;
      autoplay?: boolean;
      centerPadding?: string;
    };
  }>;
  afterChange?: (current: number) => void;
}

const Certified: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [touchedIndex, setTouchedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to handle dot navigation
  const handleDotClick = (index: number): void => {
    if (sliderRef && sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  // Handle touch interactions for mobile
  const handleTouchStart = (index: number): void => {
    if (isMobile) {
      setTouchedIndex(index);
    }
  };

  const handleTouchEnd = (): void => {
    if (isMobile) {
      setTimeout(() => setTouchedIndex(null), 2000); // Auto-hide after 2 seconds
    }
  };

  const settings: ISliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: !isMobile, // Disable autoplay on mobile for better control
    autoplaySpeed: 4000,
    pauseOnHover: !isMobile,
    centerMode: false,
    centerPadding: "0",
    cssEase: "ease-in-out",
    swipeToSlide: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          autoplay: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
          autoplay: false,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
          autoplay: false,
        },
      },
    ],
  };
  
  // Updated settings with afterChange handler to track current slide
  const updatedSettings: ISliderSettings = {
    ...settings,
    afterChange: (current: number) => setCurrentSlide(current % certifications.length),
  };

  const certifications: ICertification[] = [
    { 
      image: iso10002.src, 
      alt: "ISO 10002 Certification", 
      title: "ISO 10002:2018",
      description: "Transforming your feedback into actionable improvements with systematic customer satisfaction."
    },
    { 
      image: iso27001.src, 
      alt: "ISO 27001 Certification", 
      title: "ISO/IEC 27001:2022",
      description: "Protecting your personal and educational data with global information security standards."
    },
    { 
      image: iso20000.src, 
      alt: "ISO 20000 Certification", 
      title: "ISO/IEC 20000-1:2018",
      description: "Delivering reliable, efficient technology services to enhance your learning journey."
    },
    { 
      image: iso22301.src, 
      alt: "ISO 22301 Certification", 
      title: "ISO 22301:2019",
      description: "Guaranteeing uninterrupted educational access even during unexpected disruptions or emergencies."
    },
    { 
      image: iso9001.src, 
      alt: "ISO 9001 Certification", 
      title: "ISO 9001:2015",
      description: "Ensuring consistently exceptional learning experiences through quality management processes."
    },
    { 
      image: iso270001.src, 
      alt: "ISO 27701 Certification", 
      title: "ISO 27701:2019",
      description: "Safeguarding your privacy with advanced data protection that exceeds regulatory requirements."
    },
    { 
      image: isoSTEM.src, 
      alt: "STEM Certification", 
      title: "STEM Certified",
      description: "Recognized excellence in Science, Technology, Engineering, and Mathematics education."
    },
    { 
      image: isoUAEA.src, 
      alt: "UAEA Certification", 
      title: "UAEA Certified",
      description: "Accredited by the UAE Education Authority for educational excellence and institutional quality."
    },
  ];

  return (
    <>
      {/* Enhanced Mobile-Friendly Tooltip Portal */}
      {((hoveredIndex !== null && !isMobile) || (touchedIndex !== null && isMobile)) && 
       certifications[hoveredIndex || touchedIndex || 0] && (
        <div 
          className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center p-4"
          style={{ zIndex: 999999 }}
        >
          <div className="bg-slate-900/95 dark:bg-slate-700/95 text-white text-sm sm:text-base rounded-xl px-4 sm:px-6 py-4 sm:py-5 shadow-2xl border border-slate-600 backdrop-blur-sm max-w-xs sm:max-w-md mx-auto">
            <div className="font-semibold mb-2 text-blue-200 text-center text-base sm:text-lg">
              {certifications[hoveredIndex || touchedIndex || 0].title}
            </div>
            <div className="text-slate-100 leading-relaxed text-center text-sm sm:text-base">
              {certifications[hoveredIndex || touchedIndex || 0].description}
            </div>
            <div className="text-xs text-slate-400 mt-3 text-center italic">
              {isMobile ? 'Tap another item or wait to close' : 'Move mouse away to close'}
            </div>
          </div>
        </div>
      )}

      <section
        id="certified-section"
        className="relative bg-slate-50 dark:bg-slate-900 py-6 sm:py-8 md:py-12 overflow-hidden w-full"
      >
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20"></div>
        
        {/* Mobile-Optimized Floating Elements */}
        <div className="absolute top-6 sm:top-10 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob"></div>
        <div className="absolute top-20 sm:top-32 right-0 w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-12 sm:bottom-16 left-1/4 sm:left-1/3 w-20 h-20 sm:w-22 sm:h-22 md:w-30 md:h-30 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-8">
          {/* Enhanced Mobile-First Header */}
          <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-6 sm:mb-8 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight">
              Our Certifications
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2">
              Recognized standards of excellence in education and technology
            </p>
          </div>

          {/* Enhanced Mobile-First Certifications Carousel */}
          <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 overflow-visible">
            <div className="relative overflow-visible" style={{ paddingTop: isMobile ? '60px' : '80px', marginBottom: isMobile ? '30px' : '40px' }}>
              <Slider ref={sliderRef} {...updatedSettings}>
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="p-1 sm:p-2 md:p-3"
                    onMouseEnter={() => {
                      if (!isMobile) {
                        console.log('Hovering over certification:', index, cert.title);
                        setHoveredIndex(index);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isMobile) {
                        console.log('Leaving certification hover');
                        setHoveredIndex(null);
                      }
                    }}
                    onTouchStart={() => handleTouchStart(index)}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className={`relative group transition-all duration-200 transform 
                        ${(hoveredIndex === index && !isMobile) || (touchedIndex === index && isMobile) ? 'scale-105' : 'scale-100'}
                        hover:shadow-lg active:scale-95 rounded-lg bg-slate-50 dark:bg-slate-700 p-3 sm:p-3 md:p-4 cursor-pointer border border-slate-200 dark:border-slate-600 overflow-visible min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex flex-col justify-center touch-manipulation`}
                    >
                      <div className="relative h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] w-[50px] sm:w-[60px] md:w-[70px] lg:w-[90px] mx-auto">
                        <Image
                          src={cert.image}
                          alt={cert.alt}
                          width={90}
                          height={120}
                          className="w-full h-full object-contain transition-all duration-300"
                          priority={index < 4} // Prioritize first 4 images for faster loading
                        />
                      </div>
                      <div className="mt-2 sm:mt-3 text-center">
                        <p className="text-xs sm:text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                          {cert.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Enhanced Mobile-First Navigation Dots */}
            <div className="mt-4 sm:mt-6 text-center">
              <div className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2">
                {certifications.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`rounded-full transition-all duration-200 touch-manipulation ${
                      currentSlide === index 
                        ? 'bg-blue-600 dark:bg-blue-500 w-6 h-2 sm:w-8 sm:h-2.5'
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 w-2 h-2 sm:w-2.5 sm:h-2.5'
                    }`}
                    style={{ minWidth: currentSlide === index ? (isMobile ? '24px' : '32px') : (isMobile ? '8px' : '10px') }}
                    aria-label={`Go to certification ${index + 1}`}
                  />
                ))}
              </div>
              {isMobile && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Swipe or tap dots to navigate
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Certified; 