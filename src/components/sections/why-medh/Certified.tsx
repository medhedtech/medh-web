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
  responsive: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
      centerMode: boolean;
    };
  }>;
  afterChange?: (current: number) => void;
}

const Certified: React.FC = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sliderRef = useRef<Slider>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    setIsVisible(true);

    // Add scroll listener to detect when user is scrolling
    const handleScroll = (): void => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    let scrollTimer: NodeJS.Timeout;
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Function to handle auto-scrolling to certification section when dots are clicked
  const handleDotClick = (index: number): void => {
    // First go to the slide
    if (sliderRef && sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }

    // Then smooth scroll to the certification section if not already in view
    const sectionElement = document.getElementById('certified-section');
    if (sectionElement) {
      const rect = sectionElement.getBoundingClientRect();
      const isInView = rect.top >= 0 && rect.top <= window.innerHeight * 0.3;
      
      if (!isInView) {
        sectionElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const settings: ISliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0",
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
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
    { image: iso10002.src, alt: "ISO 10002 Certification", title: "ISO 10002" },
    { image: iso27001.src, alt: "ISO 27001 Certification", title: "ISO 27001" },
    { image: iso20000.src, alt: "ISO 20000 Certification", title: "ISO 20000" },
    { image: iso22301.src, alt: "ISO 22301 Certification", title: "ISO 22301" },
    { image: iso9001.src, alt: "ISO 9001 Certification", title: "ISO 9001" },
    { image: iso270001.src, alt: "ISO 270001 Certification", title: "ISO 270001" },
    { image: isoSTEM.src, alt: "STEM Certification", title: "STEM Certified" },
    { image: isoUAEA.src, alt: "UAEA Certification", title: "UAEA Certified" },
  ];

  return (
    <div
      id="certified-section"
      className={`py-10 w-full dark:bg-screen-dark bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="text-center mb-8 space-y-1">
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            Our Certifications! 🏆
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Swipe to explore our achievements ✨
          </p>
        </div>

        <div className="relative">
          <Slider ref={sliderRef} {...updatedSettings}>
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="p-2"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div
                  className={`relative group transition-all duration-300 transform 
                    ${isHovered === index ? 'scale-105' : 'scale-100'}
                    hover:shadow-lg hover:shadow-primary-500/20 rounded-xl
                    bg-white dark:bg-gray-800 p-4 cursor-pointer`}
                >
                  <div className="relative h-[140px] w-[100px] mx-auto">
                    <Image
                      src={cert.image}
                      alt={cert.alt}
                      width={100}
                      height={140}
                      className={`w-full h-full object-contain transition-all duration-500 ${
                        isHovered === index ? 'transform rotate-[5deg]' : ''
                      }`}
                    />
                  </div>
                  <div className={`
                    absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                    bg-gradient-to-b from-primary-500/80 to-indigo-600/80
                    transition-opacity duration-300 flex items-center justify-center
                  `}>
                    <p className="text-white font-medium text-base transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {cert.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl"></div>
        </div>

        {/* Dots navigation - replacing scroll indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center justify-center space-x-2">
            {certifications.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ease-out transform ${
                  currentSlide === index 
                    ? `bg-gradient-to-r from-primary-500 to-indigo-500 w-6 ${isScrolling ? 'scale-110' : ''}`
                    : `bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 ${
                        isScrolling ? 'translate-y-0.5' : ''
                      }`
                }`}
                aria-label={`Go to certification ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certified; 