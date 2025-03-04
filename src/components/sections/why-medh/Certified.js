"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import iso27001 from "@/assets/images/iso/iso27001.png";
import iso10002 from "@/assets/images/iso/iso10002.png";
import iso20000 from "@/assets/images/iso/iso20000.png";
import iso22301 from "@/assets/images/iso/iso22301.png";
import iso9001 from "@/assets/images/iso/iso9001.png";
import iso270001 from "@/assets/images/iso/iso27001.png";
import isoSTEM from "@/assets/images/iso/iso-STEM.jpg";
import isoUAEA from "@/assets/images/iso/iso-UAEA.jpg";

const Certified = () => {
  const [isHovered, setIsHovered] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  var settings = {
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

  const certifications = [
    { image: iso10002, alt: "ISO 10002 Certification", title: "ISO 10002" },
    { image: iso27001, alt: "ISO 27001 Certification", title: "ISO 27001" },
    { image: iso20000, alt: "ISO 20000 Certification", title: "ISO 20000" },
    { image: iso22301, alt: "ISO 22301 Certification", title: "ISO 22301" },
    { image: iso9001, alt: "ISO 9001 Certification", title: "ISO 9001" },
    { image: iso270001, alt: "ISO 270001 Certification", title: "ISO 270001" },
    { image: isoSTEM, alt: "STEM Certification", title: "STEM Certified" },
    { image: isoUAEA, alt: "UAEA Certification", title: "UAEA Certified" },
  ];

  return (
    <div
      id="certified-section"
      className={`py-16 w-full dark:bg-screen-dark bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="w-[90%] max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            Our Awesome Certifications! 🏆
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Swipe to explore our achievements ✨
          </p>
        </div>

        <div className="relative">
          <Slider {...settings}>
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="p-4"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div
                  className={`relative group transition-all duration-300 transform 
                    ${isHovered === index ? 'scale-110' : 'scale-100'}
                    hover:shadow-xl hover:shadow-primary-500/20 rounded-2xl
                    bg-white dark:bg-gray-800 p-6 cursor-pointer`}
                >
                  <div className="relative h-[160px] w-[120px] mx-auto">
                    <Image
                      src={cert.image}
                      alt={cert.alt}
                      layout="fill"
                      objectFit="contain"
                      className={`transition-all duration-500 ${
                        isHovered === index ? 'transform rotate-[5deg]' : ''
                      }`}
                    />
                  </div>
                  <div className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                    bg-gradient-to-b from-primary-500/80 to-indigo-600/80
                    transition-opacity duration-300 flex items-center justify-center
                  `}>
                    <p className="text-white font-medium text-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {cert.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-xl"></div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 animate-bounce">
            <span className="text-sm">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certified;
