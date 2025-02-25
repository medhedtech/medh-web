"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import aboutImage1 from "@/assets/images/about/about_1.png";
import aboutImage8 from "@/assets/images/about/about_8.png";

import SectionName from "@/components/shared/section-names/SectionName";
import AboutListItem from "@/components/shared/abouts/AboutListItem";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";

const About2 = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after initial render for animations
    setIsVisible(true);
  }, []);

  const aboutItems = [
    { 
      id: 1, 
      title: "Expert-Led Interactive Sessions",
      description: "Learn directly from industry professionals through engaging live sessions."
    },
    { 
      id: 2, 
      title: "Practical Real-World Projects",
      description: "Apply your knowledge to hands-on projects that simulate real workplace challenges."
    },
    { 
      id: 3, 
      title: "Personalized Learning Experience",
      description: "Receive tailored guidance and feedback to accelerate your growth journey."
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Background decorative elements */}
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-30 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary-100 dark:bg-secondary-900/20 blur-3xl opacity-30 -translate-x-1/3"></div>
        
        {/* About section grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image section with layered effect */}
          <div 
            className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {/* Main image */}
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-700">
                <Image
                  className="w-full h-full object-cover"
                  src={aboutImage8}
                  alt="Students engaging in a learning environment"
                  placeholder="blur"
                />
              </div>
              
              {/* Overlay image with animation */}
              <div className="absolute -top-10 -right-10 w-3/5 h-3/5 rounded-xl overflow-hidden shadow-2xl hover:shadow-primary-500/20 transform hover:scale-105 transition-all duration-500">
                <Image
                  className="w-full h-full object-cover"
                  src={aboutImage1}
                  alt="Teacher in a classroom"
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/0 mix-blend-overlay"></div>
              </div>
              
              {/* Stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 w-48 transform hover:translate-y-1 transition-transform duration-300">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">94%</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <div className="h-2 bg-primary-500 rounded-full w-[94%]"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content section */}
          <div 
            className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Section label */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              About Medh
            </div>
            
            {/* Heading with styled highlight */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to the{" "}
              <span className="relative inline-block text-primary-600 dark:text-primary-400">
                Online
                <span className="absolute left-0 bottom-1.5 w-full h-2 bg-secondary-400/30 dark:bg-secondary-400/20 -z-10 rounded-full"></span>
              </span>{" "}
              Learning Center
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              At Medh, we bring together the best educational resources and expert instructors to help you master in-demand skills. Our mission is to make quality education accessible and engaging for everyone.
            </p>
            
            {/* Feature list */}
            <div className="space-y-6 mb-10">
              {aboutItems.map((item, idx) => (
                <div 
                  key={item.id}
                  className={`flex items-start transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ transitionDelay: `${300 + (idx * 150)}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA button */}
            <div className="mt-8">
              <ButtonPrimary path="/about-us" arrow={true} className="px-8 py-3 text-base shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-1">
                Discover Our Story
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About2;
