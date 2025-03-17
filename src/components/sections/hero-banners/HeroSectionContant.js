"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Iso from "@/assets/images/courseai/iso.png";
import heroBg from "@/assets/Header-Images/About/About.png";
import AboutUs from "@/assets/Header-Images/About/medium-shot-woman-holding-laptop.jpg";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";
import AboutBanner from "@/components/course-banner/aboutBanner";
import { ArrowRight, ChevronDown } from "lucide-react";

// Animation variants for mobile elements
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

function CourseAiBanner() {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Mobile Hero Section
  if (isMobile) {
    return (
      <div className="relative min-h-[100vh] bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Hero Background"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-800/90" />
        </div>

        {/* Content Container - Improved padding */}
        <div className="relative z-10 px-5 sm:px-6 pt-8 pb-8 flex flex-col min-h-[100vh] justify-between">
          {/* Top Section with ISO Badge */}
          <div className="space-y-8">
            {/* ISO Badge - Adjusted spacing */}
            <motion.div 
              className="flex items-center justify-center mt-4"
              {...fadeInUp}
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 space-x-2.5">
                <Image
                  src={Iso}
                  alt="ISO Certification"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="text-white/90 text-xs font-medium tracking-wide">ISO CERTIFIED</span>
              </div>
            </motion.div>

            {/* Main Content - Improved spacing */}
            <motion.div 
              className="text-center space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="text-white/80 text-sm font-medium tracking-wider">
                SKILL UP. RISE UP. EMBRACE EMPOWERMENT.
              </h2>
              <h1 className="text-[1.75rem] font-bold text-white leading-tight px-4">
                Start Your Journey towards Success with Medh
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed max-w-[320px] mx-auto px-2">
                Nurturing Minds, Shaping Futures. Inspiring Growth, Igniting Potential. Transforming Dreams into Reality!
              </p>
            </motion.div>
          </div>

          {/* Middle Section with Featured Image */}
          <motion.div 
            className="relative w-full aspect-[4/3] my-8 rounded-2xl overflow-hidden shadow-xl mx-auto max-w-md"
            {...scaleIn}
          >
            <Image
              src={AboutUs}
              alt="About Medh"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-2xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
          </motion.div>

          {/* Bottom Section with CTA */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {/* Slogan - Adjusted spacing */}
            <div className="text-center">
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-xl font-bold px-2">
                Medh Hain Toh Mumkin Hain!
              </h3>
            </div>

            {/* CTA Button - Improved padding and max-width */}
            <div className="max-w-xs mx-auto w-full">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-sm flex items-center justify-center space-x-3 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all">
                <span>Explore More</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Scroll Indicator - Adjusted spacing */}
            <div className="flex flex-col items-center pt-4 pb-2 animate-bounce">
              <span className="text-gray-400 text-xs mb-2">Scroll to explore</span>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Desktop version remains unchanged
  return (
    <div>
      <AboutBanner
        bannerImage={heroBg}
        logoImage={AboutUs}     
        isoImage={Iso}                 
        heading="Start Your Journey towards Success with Medh"   
        subheading="SKILL UP. RISE UP. EMBRACE EMPOWERMENT."  
        description="Nurturing Minds, Shaping Futures. Inspiring Growth, Igniting Potential. Transforming Dreams into Reality!"
        buttonText="Explore More"        
        isoText="ISO CERTIFIED"         
        slogan="Medh Hain Toh Mumkin Hain!"  
        buttonImage={LetsConnect}           
      />
    </div>
  );
}

export default CourseAiBanner;

