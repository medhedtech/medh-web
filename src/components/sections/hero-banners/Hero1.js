"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import stemImg from "@/assets/images/iso/stem.jpg";
import Group from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import bgImage from "@/assets/Header-Images/Home/Home_Banner_2_e7389bb905.jpg";
import "@/assets/css/ovalAnimation.css";
import CourseCard from "@/components/sections/courses/CourseCard";
import { ArrowRight, ChevronRight, GraduationCap, Users, Star, Clock, Sparkles, BookOpen, Target, TrendingUp, Menu } from "lucide-react";
import Link from "next/link";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader2 from "@/components/shared/others/Preloader2";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import medhLogo from "@/assets/images/logo/medh.png";

// Mobile version of Hero component
const HeroMobile = ({ isLoaded, featuredCourses, loading }) => {
  return (
    <div className="mobile-hero-wrapper grid grid-cols-1 gap-6 p-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-12 w-28"></div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="flex flex-col items-center justify-center">
        <h1 className="text-white font-bold text-center mb-3">
          <span className="hero-heading-text">UNLOCK YOUR POTENTIAL WITH</span>
          <div className="relative h-[clamp(3rem,_11vw,_5rem)] max-w-[200px] mx-auto mb-4">
            <Image
              src={medhLogo}
              alt="Medh Logo"
              className=""
              priority
              sizes="(max-width: 630px) 280px, (max-width: 1024px) 200px, 280px"
            />
          </div>
        </h1>
        </div>
        <p className="hero-paragraph-text text-center md:mt-3">
          Join our expert-led professional courses and master the skills that drive industry innovation
        </p>

        {/* Grid Layout for Content */}
        <div className="grid grid-cols-2 gap-3 mt-5 ">
          {/* Children & Teens */}
          <div className="bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-purple-500/10 rounded-xl p-3 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[120px]">
            <div className="flex items-center mb-1.5 h-5">
              <BookOpen className="w-4 h-4 text-primary-400 mr-1.5 flex-shrink-0" />
              <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-purple-300 font-semibold text-sm truncate">Children & Teens</h4>
            </div>
            <p className="text-gray-300 text-xs leading-tight mb-auto line-clamp-2">Future-ready STEM education</p>
            <div className="flex items-center justify-between text-[10px] mt-1.5 pt-1.5 border-t border-white/5 w-full">
              <span className="text-gray-400 truncate max-w-[40%]">Ages 8-18</span>
              <span className="bg-primary-500/20 text-primary-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap text-[9px]">Interactive</span>
            </div>
          </div>

          {/* Professionals */}
          <div className="bg-gradient-to-br from-secondary-500/10 via-secondary-400/5 to-blue-500/10 rounded-xl p-3 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[120px]">
            <div className="flex items-center mb-1.5 h-5">
              <Users className="w-4 h-4 text-secondary-400 mr-1.5 flex-shrink-0" />
              <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-blue-300 font-semibold text-sm truncate">Professionals</h4>
            </div>
            <p className="text-gray-300 text-xs leading-tight mb-auto line-clamp-2">Industry-relevant skills</p>
            <div className="flex items-center justify-between text-[10px] mt-1.5 pt-1.5 border-t border-white/5 w-full">
              <span className="text-gray-400 truncate max-w-[40%]">Certifications</span>
              <span className="bg-secondary-500/20 text-secondary-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap text-[9px]">Practical</span>
            </div>
          </div>

          {/* Homemakers */}
          <div className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 rounded-xl p-3 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[120px]">
            <div className="flex items-center mb-1.5 h-5">
              <Star className="w-4 h-4 text-purple-400 mr-1.5 flex-shrink-0" />
              <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-semibold text-sm truncate">Homemakers</h4>
            </div>
            <p className="text-gray-300 text-xs leading-tight mb-auto line-clamp-2">Flexible learning paths</p>
            <div className="flex items-center justify-between text-[10px] mt-1.5 pt-1.5 border-t border-white/5 w-full">
              <span className="text-gray-400 truncate max-w-[40%]">Flexible scheduling</span>
              <span className="bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap text-[9px]">Adaptable</span>
            </div>
          </div>

          {/* Lifelong Learners */}
          <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-teal-500/10 rounded-xl p-3 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[120px]">
            <div className="flex items-center mb-1.5 h-5">
              <TrendingUp className="w-4 h-4 text-blue-400 mr-1.5 flex-shrink-0" />
              <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300 font-semibold text-sm truncate">Lifelong Learners</h4>
            </div>
            <p className="text-gray-300 text-xs leading-tight mb-auto line-clamp-2">Continuous development</p>
            <div className="flex items-center justify-between text-[10px] mt-1.5 pt-1.5 border-t border-white/5 w-full">
              <span className="text-gray-400 truncate max-w-[40%]">Age-inclusive</span>
              <span className="bg-blue-500/20 text-blue-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap text-[9px]">Continuous</span>
            </div>
          </div>
        </div>

        {/* Tagline moved above CTA buttons */}
        <div className="mt-8 mb-5 text-center">
          <h3 className="mumkinMedh text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-secondary-400 text-lg font-semibold animate-text-shimmer">
            Medh Hain Toh Mumkin Hain!
          </h3>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <Link href="/contact-us" className="w-full group relative inline-flex items-center justify-center py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl text-sm transition-all">
            <span>Let's Connect</span>
            <ArrowRight size={16} className="ml-2" />
          </Link>
          <a href="#featured-courses" className="w-full group relative inline-flex items-center justify-center py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl text-sm transition-all backdrop-blur-sm border border-white/10">
            <span>Explore Courses</span>
            <ChevronRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Main Hero component
const Hero1 = ({ isCompact = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { getQuery } = useGetQuery();

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Set up listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fetch featured courses
  useEffect(() => {
    const fetchFeaturedCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(1, 4, "", "", "", "Published", "", "", []),
        onSuccess: (data) => {
          const sortedCourses = (data?.courses || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
          setFeaturedCourses(sortedCourses);
          setLoading(false);
        },
        onFail: (error) => {
          console.error("Error fetching courses:", error);
          setLoading(false);
        },
      });
    };

    fetchFeaturedCourses();
  }, []);

  // Conditionally render mobile or desktop version
  if (isMobile) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden">
        <HeroMobile 
          isLoaded={isLoaded} 
          featuredCourses={featuredCourses} 
          loading={loading} 
        />
      </section>
    );
  }

  // Desktop version with isCompact handling
  return (
    <>
      <section 
        style={{ 
          paddingTop: "var(--header-height, clamp(30px, 8vh, 50px))",
          paddingBottom: isCompact ? "clamp(15px, 4vh, 30px)" : "var(--footer-height, clamp(30px, 8vh, 50px))"
        }}
        className={`relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 w-full ${
          isCompact ? 'max-h-[90vh]' : 'min-h-screen'
        }`}
      >
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Geometric Patterns */}
          <div className="absolute top-0 -left-4 w-[40vw] h-[40vw] bg-gradient-conic from-primary-500/40 via-purple-500/30 to-secondary-500/40 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-gradient-conic from-secondary-500/40 via-pink-500/30 to-primary-500/40 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow-reverse"></div>
          <div className="absolute bottom-0 left-1/3 w-[45vw] h-[45vw] bg-gradient-conic from-blue-500/40 via-teal-500/30 to-purple-500/40 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-pulse-slow"></div>
          
          {/* Enhanced Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(circle_at_center,white,transparent_80%)] opacity-30"></div>
        </div>

        <div className="max-w-[1920px] w-full mx-auto relative z-10">
          {/* Hero Content - Centered Text */}
          <div className={`flex flex-col items-center justify-center py-12 lg:py-20 ${
            isCompact ? 'py-8 lg:py-12' : 'min-h-[75vh]'
          }`}>
            {/* Hero Content - Centered */}
            <div className={`flex flex-col items-center justify-center transition-all duration-1000 transform text-center px-4 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Live badge - similar to page.js */}
             
              
              {/* Main Heading - Centered */}
              <div className={`w-full max-w-[800px] mx-auto mb-8 ${
                isCompact ? 'mb-6' : ''
              }`}>
                <h1 className="font-bold leading-tight w-full">
                  <span className="hero-heading-text">
                    UNLOCK YOUR POTENTIAL WITH
                  </span>
                  <span className="block relative mx-auto mb-6">
                    <div className="relative h-[clamp(3rem,_11vw,_5rem)] max-w-[200px] mx-auto mb-8">
                      <Image
                        src={medhLogo}
                        alt="Medh Logo"
                        className=""
                        priority
                        sizes="(max-width: 630px) 280px, (max-width: 1024px) 200px, 280px"
                      />
                    </div>
                  </span>
                </h1>
                
                <p className="hero-paragraph-text text-center md:mt-3">
                  Join our expert-led professional courses and master the skills that drive industry innovation
                </p>
              </div>
              {/* Desktop full-row version - WITH FIXED OVERFLOW ISSUES */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 p-6 sm:p-8 ${
                isCompact ? 'gap-3 lg:gap-4 p-4 sm:p-6' : ''
              }`}>
                  {/* Children & Teens - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[480px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-purple-500/10 hover:from-primary-500/15 hover:to-purple-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary-500/10 to-purple-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-secondary-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-primary-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <BookOpen className="w-6 h-6 text-primary-400 group-hover:text-primary-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-purple-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Children & Teens</h4>
                      <p className="relative z-10 text-white text-sm leading-relaxed mb-3 group-hover:text-gray-100">Future-ready STEM education and creative thinking</p>
                      <div className="mt-auto pt-2 border-t border-white/5">
                        <div className="text-xs text-white flex items-center justify-between">
                          <span>Perfect for ages 8-18</span>
                          <span className="bg-primary-500/20 text-primary-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Interactive</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professionals - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[480px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-secondary-500/10 via-secondary-400/5 to-blue-500/10 hover:from-secondary-500/15 hover:to-blue-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-secondary-500/10 to-blue-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-secondary-500/10 to-indigo-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-secondary-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-secondary-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <Users className="w-6 h-6 text-secondary-400 group-hover:text-secondary-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-blue-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Professionals</h4>
                      <p className="relative z-10 text-white text-sm leading-relaxed mb-3 group-hover:text-gray-100">Industry-relevant skills for career advancement</p>
                      <div className="mt-auto pt-2 border-t border-white/5">
                        <div className="text-xs text-white flex items-center justify-between">
                          <span>Industry certifications</span>
                          <span className="bg-secondary-500/20 text-secondary-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Practical</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Homemakers - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[480px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 hover:from-purple-500/15 hover:to-pink-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-rose-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-purple-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-purple-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <Star className="w-6 h-6 text-purple-400 group-hover:text-purple-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Homemakers</h4>
                      <p className="relative z-10 text-white text-sm leading-relaxed mb-3 group-hover:text-gray-100">Flexible learning paths for personal growth</p>
                      <div className="mt-auto pt-2 border-t border-white/5">
                        <div className="text-xs text-white flex items-center justify-between">
                          <span>Flexible scheduling</span>
                          <span className="bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Adaptable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lifelong Learners - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[480px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-teal-500/10 hover:from-blue-500/15 hover:to-teal-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-teal-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-blue-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <TrendingUp className="w-6 h-6 text-blue-400 group-hover:text-blue-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Lifelong Learners</h4>
                      <p className="relative z-10 text-white text-sm leading-relaxed mb-3 group-hover:text-gray-100">Continuous skills development at any age</p>
                      <div className="mt-auto pt-2 border-t border-white/5">
                        <div className="text-xs text-white flex items-center justify-between">
                          <span>Age-inclusive content</span>
                          <span className="bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Continuous</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="motto-container relative mt-6 lg:mt-8">
                <h2 className="mumkinMedh text-center lg:text-left text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-secondary-400 animate-text-shimmer relative z-10 whitespace-nowrap">
                  Medh Hain Toh Mumkin Hain!
                </h2>
              </div>
            </div>
            {/* CTA Buttons for Desktop */}
            <div className="flex flex-row gap-3 mt-8 hidden md:flex items-center justify-center">
              <Link 
                href="/contact-us" 
                className="group relative inline-flex items-center justify-center py-4 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Let's Connect</span>
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <a 
                href="#featured-courses" 
                className="group relative inline-flex items-center justify-center py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10"
              >
                <span>Explore Courses</span>
                <ChevronRight size={20} className="ml-2" />
              </a>
            </div>
          </div>
          
          {/* Horizontal 3D Interactive Cards Section - REMOVED OVERFLOW HIDDEN */}
          <div className={`relative transition-all duration-1000 delay-300 transform py-12 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-secondary-400">Explore Our Learning Pathways</span>
              </h3>
              
              {/* Horizontal Card Layout - REDUCED WIDTH FOR BETTER WRAPPING */}
              <div className="w-full max-w-[1400px] mx-auto px-4 perspective-1500">
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {/* Course Card 1 */}
                  <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-primary-500/15 to-purple-500/15 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10 hover:from-primary-500/25 hover:to-purple-500/25 hover:border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    <BookOpen className="text-primary-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-7 h-7" />
                    <h3 className="text-white font-semibold mb-2 text-lg md:text-xl relative z-10 transition-all duration-300 group-hover:text-primary-300">Future Tech Skills</h3>
                    <p className="text-gray-400 text-sm md:text-base relative z-10 transition-all duration-300 group-hover:text-white/90">AI, ML & Data Science Excellence</p>
                  </div>
                  
                  {/* Course Card 2 */}
                  <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-secondary-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    <Target className="text-secondary-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-7 h-7" />
                    <h3 className="text-white font-semibold mb-2 text-lg md:text-xl relative z-10 transition-all duration-300 group-hover:text-secondary-300">Personal Growth</h3>
                    <p className="text-gray-400 text-sm md:text-base relative z-10 transition-all duration-300 group-hover:text-white/90">Transform Your Inner Potential</p>
                  </div>
                  
                  {/* Course Card 3 */}
                  <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    <Users className="text-purple-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-7 h-7" />
                    <h3 className="text-white font-semibold mb-2 text-lg md:text-xl relative z-10 transition-all duration-300 group-hover:text-purple-300">Ancient Wisdom</h3>
                    <p className="text-gray-400 text-sm md:text-base relative z-10 transition-all duration-300 group-hover:text-white/90">Vedic Math Mastery</p>
                  </div>
                  
                  {/* Course Card 4 */}
                  <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    <TrendingUp className="text-blue-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-7 h-7" />
                    <h3 className="text-white font-semibold mb-2 text-lg md:text-xl relative z-10 transition-all duration-300 group-hover:text-blue-300">Digital Success</h3>
                    <p className="text-gray-400 text-sm md:text-base relative z-10 transition-all duration-300 group-hover:text-white/90">Modern Marketing & SEO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero1;
