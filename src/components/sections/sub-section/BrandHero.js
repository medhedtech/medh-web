"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import bgImg1 from "@/assets/images/herobanner/bg1-img.jpeg";
import Link from "next/link";

const BrandHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Set visible after initial render for animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Feature cards data
  const featureCards = [
    {
      id: 1,
      title: "50+ Medh Upskill Courses",
      description: "In high-demand domains like AI, Cybersecurity, Career Development, Data Analytics, etc.",
      linkText: "View Courses",
      linkUrl: "/skill-development-courses",
      bgColor: "bg-primary-500",
      bgImage: null,
    },
    {
      id: 2,
      title: "Explore Medh Membership",
      description: "Achieve mastery in your chosen domain by gaining comprehensive expertise.",
      linkText: "View Memberships",
      linkUrl: "/medh-membership",
      bgColor: "",
      bgImage: bgImg,
    },
    {
      id: 3,
      title: "Earn a Course Certificate",
      description: "Nurture skills and elevate your career with industry-recognized certifications upon completion.",
      linkText: "View More",
      linkUrl: "/about-us",
      bgColor: "bg-primary-500",
      bgImage: null,
    },
    {
      id: 4,
      title: "100% Placement Guaranteed",
      description: "Secure your future with assured placement in our selected job-guaranteed Courses.",
      linkText: "View Courses",
      linkUrl: "/placement-guaranteed-courses",
      bgColor: "",
      bgImage: bgImg1,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Feature Cards Grid */}
      <div 
        className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 shadow-md">
          {featureCards.map((card, index) => (
            <div 
              key={card.id}
              className={`relative overflow-hidden group ${card.bgColor || 'bg-gray-800'} transition-all duration-500`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Background image if present */}
              {card.bgImage && (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={card.bgImage}
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    className="transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                </div>
              )}
              
              {/* Card content */}
              <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col min-h-[280px]">
                <h2 className="font-semibold text-xl lg:text-2xl text-white mb-4">
                  {card.title}
                </h2>
                
                <p className="mt-2 text-sm md:text-base text-white/90 flex-grow">
                  {card.description}
                </p>
                
                <Link 
                  href={card.linkUrl}
                  className="mt-auto inline-flex items-center text-white font-medium text-sm md:text-base group-hover:text-secondary-300 transition-colors"
                >
                  <span className="border-b border-secondary-400 pb-0.5 group-hover:border-secondary-300">
                    {card.linkText}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                
                {/* Decorative corner element */}
                <div className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full bg-white/5 group-hover:bg-white/10 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome Section */}
      <section 
        className={`transition-all duration-1000 ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bold text-gray-800 dark:text-white text-2xl lg:text-3xl mb-6">
              Welcome to <span className="text-primary-500 dark:text-primary-400">Medh</span> | Pioneering
              Skill Development for every stage of life.
            </h2>
            
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-8 w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-secondary-100 dark:bg-secondary-900/20 rounded-full blur-2xl opacity-60"></div>
              
              <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg mb-6 leading-relaxed relative z-10">
                MEDH, the leading global EdTech innovator, is dedicated to
                delivering skill development courses through cutting-edge technology
                and bespoke mentorship. To empower individuals at every stage of
                life, from early childhood and adolescence (preschool, school,
                college) to working professionals and homemakers, with the knowledge
                and capabilities to excel in today&#39;s dynamic world.
              </p>
            </div>
            
            <div className="relative inline-block">
              <span className="font-semibold text-gray-800 dark:text-white text-sm lg:text-base">
                We nurture growth, foster expertise, and ignite potential for
                learners of every background.
              </span>
              <div className="absolute -z-10 bottom-0 left-0 right-0 h-2 bg-primary-100 dark:bg-primary-900/30 rounded-full transform skew-x-2"></div>
            </div>
            
            {/* CTA button */}
            <div className="mt-8">
              <Link 
                href="/about-us" 
                className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1"
              >
                Learn More About Us
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandHero;
