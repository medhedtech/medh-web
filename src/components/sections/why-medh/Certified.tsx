"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { Shield, CheckCircle } from "lucide-react";
import { buildAdvancedComponent, typography } from "@/utils/designSystem";
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
        className="relative bg-slate-50 dark:bg-slate-900 py-12 md:py-20 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/50 dark:from-indigo-950/20 dark:via-transparent dark:to-blue-950/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-0 w-32 h-32 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-0 w-40 h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* Header Section */}
          <div className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'desktop' })}>
            <div className="text-center mb-16">
              <div className="max-w-4xl mx-auto">
                {/* Section Badge */}
                <div className="inline-flex items-center bg-indigo-100 dark:bg-indigo-900/50 px-4 py-2 rounded-full mb-6">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold text-sm">Quality Assurance</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  Trusted 
                  <span className="block text-indigo-600 dark:text-indigo-400 mt-2">
                    Standards
                  </span>
                </h2>
                
                <div className="max-w-3xl mx-auto">
                  <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    Accredited excellence in education and technology services with 
                    <span className="font-semibold text-slate-800 dark:text-slate-200"> global recognition</span> and 
                    <span className="font-semibold text-slate-800 dark:text-slate-200"> industry compliance</span>
                  </p>
                  
                  {/* Quality Highlights */}
                  <div className="flex flex-wrap justify-center gap-6 text-sm sm:text-base">
                    <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-indigo-700 dark:text-indigo-300 font-medium">International Standards</span>
                    </div>
                    <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">Security Compliance</span>
                    </div>
                    <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">Quality Excellence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Certifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-12">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                  onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                  onTouchStart={() => handleTouchStart(index)}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 group-hover:scale-105">
                    {/* Certification Badge */}
                    <div className="relative h-24 w-20 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl"></div>
                      <Image
                        src={cert.image}
                        alt={cert.alt}
                        width={80}
                        height={96}
                        className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        priority={index < 8}
                      />
                    </div>
                    
                    {/* Certification Title */}
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight mb-2">
                      {cert.title}
                    </p>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Certified</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-2xl p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-6 py-3 rounded-full">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    Maintaining the highest standards in educational excellence and security
                  </span>
                </div>
              </div>
              
              {/* Compliance Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">8+</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">International Certifications</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Compliance Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">24/7</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Security Monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Certified;
