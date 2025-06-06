"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import stemImg from "@/assets/images/iso/iso-STEM.jpg";
import Group from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import bgImage from "@/assets/Header-Images/Home/Home_Banner_2_e7389bb905.jpg";
import "@/assets/css/ovalAnimation.css";
import CourseCard from "@/components/sections/courses/CourseCard";
import { ArrowRight, ChevronRight, GraduationCap, Users, Star, Clock, Sparkles, BookOpen, Target, TrendingUp, Menu, Brain, Lightbulb, Calculator, Rocket } from "lucide-react";
import Link from "next/link";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader2 from "@/components/shared/others/Preloader2";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import medhLogo from "@/assets/images/logo/medh.png";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import { ICourse } from "@/types/course.types";

// Define interfaces for component props
interface IHeroMobileProps {
  isLoaded: boolean;
  featuredCourses: ICourse[];
  loading: boolean;
}

// Mobile version of Hero component
const HeroMobile: React.FC<IHeroMobileProps> = ({ isLoaded, featuredCourses, loading }) => {
  return (
    <div className="mobile-hero-wrapper grid grid-cols-1 gap-6 p-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-28"></div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-gray-900 dark:text-white font-bold text-center mb-3">
            <span className="hero-heading-text text-gray-800 dark:text-white">UNLOCK YOUR POTENTIAL WITH</span>
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
        <p className="hero-paragraph-text text-gray-700 dark:text-gray-300 text-center md:mt-3 mb-6">
          Join our expert-led courses and master the skills that drive industry innovation
        </p>

        {/* Grid Layout for Content */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* Children & Teens */}
          <div className="bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-purple-500/10 rounded-xl p-2.5 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[90px] justify-center items-center text-center">
            <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400 mb-2" />
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-300 dark:to-purple-300 font-semibold text-[11px] leading-tight px-1">Children & Teens</h4>
          </div>

          {/* Professionals */}
          <div className="bg-gradient-to-br from-secondary-500/10 via-secondary-400/5 to-blue-500/10 rounded-xl p-2.5 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[90px] justify-center items-center text-center">
            <Users className="w-4 h-4 text-secondary-600 dark:text-secondary-400 mb-2" />
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-blue-600 dark:from-secondary-300 dark:to-blue-300 font-semibold text-[11px] leading-tight px-1">Professionals</h4>
          </div>

          {/* Homemakers */}
          <div className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 rounded-xl p-2.5 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[90px] justify-center items-center text-center">
            <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-2" />
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 font-semibold text-[11px] leading-tight px-1">Homemakers</h4>
          </div>

          {/* Lifelong Learners */}
          <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-teal-500/10 rounded-xl p-2.5 transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col h-[90px] justify-center items-center text-center">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-2" />
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-300 dark:to-teal-300 font-semibold text-[11px] leading-tight px-1">Lifelong Learners</h4>
          </div>
        </div>

        {/* Tagline moved above CTA buttons */}
        <div className="mt-6 mb-4 text-center">
          <h3 className="mumkinMedh">
            Medh Hai Toh Mumkin Hai!
          </h3>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mt-4 mb-6 sm:mb-8">
          <Link href="/courses" className="w-full group relative inline-flex items-center justify-center py-3.5 bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-medium rounded-xl text-sm transition-all border-2 border-primary-500 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800">
            <span>Explore Courses</span>
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

interface IHero1Props {
  isCompact?: boolean;
}

// Main Hero component
const Hero1: React.FC<IHero1Props> = ({ isCompact = false }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { getQuery } = useGetQuery();

  // Add scroll management on mount
  useEffect(() => {
    // Reset scroll position on component mount
    window.scrollTo(0, 0);
    
    // Prevent scroll during initial load animation
    document.body.style.overflow = 'hidden';
    
    // Enable scroll and set loaded state after animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.style.overflow = 'auto';
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = (): void => {
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
    const fetchFeaturedCourses = (): void => {
      getQuery({
        url: getAllCoursesWithLimits({
          page: 1,
          limit: 4,
          status: "Published"
        }),
        onSuccess: (data: { courses: ICourse[] }) => {
          const sortedCourses = (data?.courses || [])
            .sort((a: ICourse, b: ICourse) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4);
          setFeaturedCourses(sortedCourses);
          setLoading(false);
        },
        onFail: (error: any) => {
          console.error("Error fetching courses:", error);
          setLoading(false);
        },
      });
    };

    fetchFeaturedCourses();
  }, [getQuery]);

  // Conditionally render mobile or desktop version
  if (isMobile) {
    return (
      <section className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
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
          paddingTop: isCompact ? "max(10px, 1.5vh)" : "max(12px, 2vh)",
          paddingBottom: isCompact ? "max(8px, 1.5vh)" : "max(10px, 2vh)"
        }}
        className={`relative bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 w-full ${
          isCompact ? 'min-h-[82vh]' : 'min-h-[88vh]'
        }`}
      >
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Geometric Patterns - Adjusted sizes for small laptops */}
          <div className="absolute top-0 -left-4 w-[35vw] h-[35vw] bg-gradient-conic from-primary-500/40 via-purple-500/30 to-secondary-500/40 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] bg-gradient-conic from-secondary-500/40 via-pink-500/30 to-primary-500/40 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow-reverse"></div>
          <div className="absolute bottom-0 left-1/3 w-[40vw] h-[40vw] bg-gradient-conic from-blue-500/40 via-teal-500/30 to-purple-500/40 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-pulse-slow"></div>
          
          {/* Enhanced Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(circle_at_center,white,transparent_80%)] opacity-30"></div>
        </div>

        <div className="max-w-[1920px] w-full mx-auto relative z-10">
          {/* Hero Content - Centered Text */}
          <div className={`flex flex-col items-center justify-center ${
            isCompact ? 'pt-10 pb-4 lg:pt-12 lg:pb-6' : 'pt-12 pb-6 lg:pt-16 lg:pb-8'
          }`}>
            {/* Hero Content - Centered */}
            <div className={`flex flex-col items-center justify-center transition-all duration-1000 transform text-center px-4 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Main Heading - Centered */}
              <div className={`w-full max-w-[700px] mx-auto ${
                isCompact ? 'mb-4 space-y-3' : 'mb-6 space-y-4'
              }`}>
                <h1 className="font-bold leading-tight w-full">
                  <span className="hero-heading-text block mb-3 text-gray-800 dark:text-white">
                  UNLOCK YOUR POTENTIAL JOURNEY WITH
                  </span>
                  <span className="block relative mx-auto">
                    <div className="relative h-[clamp(2.5rem,_9vw,_4rem)] max-w-[180px] mx-auto">
                      <Image
                        src={medhLogo}
                        alt="Medh Logo"
                        className=""
                        priority
                        sizes="(max-width: 630px) 160px, (max-width: 1024px) 180px, 200px"
                      />
                    </div>
                  </span>
                </h1>
                
                <p className="hero-paragraph-text text-center mt-4 text-xs lg:text-sm text-gray-700 dark:text-gray-300">
                   Expert-Led Courses Transforming Skills and Driving Professional Innovation Globally.
                </p>
              </div>
              {/* Desktop full-row version - WITH FIXED OVERFLOW ISSUES */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 p-3 lg:p-4 ${
                isCompact ? 'max-w-[1400px]' : 'max-w-[1600px]'
              }`}>
                  {/* Children & Teens - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[420px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-purple-500/10 hover:from-primary-500/15 hover:to-purple-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl p-3 lg:p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/10 to-purple-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-3 -bottom-3 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-secondary-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-primary-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-500 dark:group-hover:text-primary-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-300 dark:to-purple-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Children & Teens</h4>
                      <p className="relative z-10 text-gray-800 dark:text-white text-sm leading-relaxed mb-3 group-hover:text-gray-900 dark:group-hover:text-gray-100">Future-ready STEM education and creative thinking</p>
                      <div className="mt-auto pt-2 border-t border-gray-200/20 dark:border-white/5">
                        <div className="text-xs text-gray-700 dark:text-white flex items-center justify-between">
                          <span>Perfect for ages 8-18</span>
                          <span className="bg-primary-500/20 text-primary-700 dark:text-primary-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Interactive</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professionals - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[420px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-secondary-500/10 via-secondary-400/5 to-blue-500/10 hover:from-secondary-500/15 hover:to-blue-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl p-3 lg:p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-secondary-500/10 to-blue-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-3 -bottom-3 w-14 h-14 rounded-full bg-gradient-to-br from-secondary-500/10 to-indigo-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-secondary-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-secondary-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <Users className="w-6 h-6 text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-500 dark:group-hover:text-secondary-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-blue-600 dark:from-secondary-300 dark:to-blue-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Professionals</h4>
                      <p className="relative z-10 text-gray-800 dark:text-white text-sm leading-relaxed mb-3 group-hover:text-gray-900 dark:group-hover:text-gray-100">Industry-relevant skills for career advancement</p>
                      <div className="mt-auto pt-2 border-t border-gray-200/20 dark:border-white/5">
                        <div className="text-xs text-gray-700 dark:text-white flex items-center justify-between">
                          <span>Industry certifications</span>
                          <span className="bg-secondary-500/20 text-secondary-700 dark:text-secondary-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Practical</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Homemakers - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[420px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 hover:from-purple-500/15 hover:to-pink-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl p-3 lg:p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-3 -bottom-3 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/10 to-rose-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-purple-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-purple-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <Star className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-purple-500 dark:group-hover:text-purple-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Homemakers</h4>
                      <p className="relative z-10 text-gray-800 dark:text-white text-sm leading-relaxed mb-3 group-hover:text-gray-900 dark:group-hover:text-gray-100">Flexible learning paths for personal growth</p>
                      <div className="mt-auto pt-2 border-t border-gray-200/20 dark:border-white/5">
                        <div className="text-xs text-gray-700 dark:text-white flex items-center justify-between">
                          <span>Flexible scheduling</span>
                          <span className="bg-purple-500/20 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Adaptable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lifelong Learners - Desktop Card */}
                  <div className="flex-shrink-0 w-full max-w-[420px] snap-start group transition-transform duration-500 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
                    <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-teal-500/10 hover:from-blue-500/15 hover:to-teal-500/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl p-3 lg:p-4 transition-all duration-300 h-full flex flex-col relative">
                      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-teal-500/10 animate-pulse-slow blur-xl"></div>
                      <div className="absolute -left-3 -bottom-3 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 animate-pulse-slower blur-lg"></div>
                      <div className="relative z-10 mb-4 bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-blue-500/5 rounded-xl animate-ping-slow opacity-60"></div>
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-200 transition-colors" />
                      </div>
                      <h4 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-300 dark:to-teal-300 font-semibold text-base mb-2 group-hover:scale-[1.03] transition-transform">Lifelong Learners</h4>
                      <p className="relative z-10 text-gray-800 dark:text-white text-sm leading-relaxed mb-3 group-hover:text-gray-900 dark:group-hover:text-gray-100">Continuous skills development at any age</p>
                      <div className="mt-auto pt-2 border-t border-gray-200/20 dark:border-white/5">
                        <div className="text-xs text-gray-700 dark:text-white flex items-center justify-between">
                          <span>Age-inclusive content</span>
                          <span className="bg-blue-500/20 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">Continuous</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="motto-container relative mt-6 lg:mt-8">
                <div className="mumkinMedh">
                  Medh Hai Toh Mumkin Hai!
                </div>
              </div>
            </div>
            {/* CTA Buttons for Desktop */}
            <div className="flex flex-row gap-3 mt-6 lg:mt-8 hidden md:flex items-center justify-center">
              <Link 
                href="/courses" 
                className="group relative inline-flex items-center justify-center py-3 px-5 lg:py-4 lg:px-6 bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-medium rounded-xl text-base lg:text-lg border-2 border-primary-500 dark:border-primary-400 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-primary-50 dark:hover:bg-gray-800"
              >
                <span>Explore Courses</span>
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Horizontal Card Layout - Optimized for small laptops */}
          <div className="w-full max-w-[1200px] lg:max-w-[1400px] mx-auto px-3 lg:px-4 perspective-1500">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 dark:from-primary-400 dark:via-purple-400 dark:to-secondary-400 inline-block">
                Explore Our Learning Pathways
              </h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {/* Future Tech Skills Card */}
              <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-primary-500/15 to-purple-500/15 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10 hover:from-primary-500/25 hover:to-purple-500/25 hover:border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary-500/10 rounded-xl transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <Brain className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-primary-500 dark:group-hover:text-primary-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-300 dark:to-purple-300 mb-2">
                    Future Tech Skills
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white/90">
                    AI, ML & Data Science Excellence
                  </p>
                </div>
              </div>
              
              {/* Personal Growth Card */}
              <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-secondary-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-secondary-500/10 rounded-xl transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <Lightbulb className="w-8 h-8 text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-500 dark:group-hover:text-secondary-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-pink-600 dark:from-secondary-300 dark:to-pink-300 mb-2">
                    Personal Growth
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white/90">
                    Transform Your Inner Potential
                  </p>
                </div>
              </div>
              
              {/* Ancient Wisdom Card */}
              <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-purple-500/10 rounded-xl transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <Calculator className="w-8 h-8 text-purple-600 dark:text-purple-400 group-hover:text-purple-500 dark:group-hover:text-purple-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 mb-2">
                    Ancient Wisdom
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white/90">
                    Vedic Math Mastery
                  </p>
                </div>
              </div>
              
              {/* Digital Success Card */}
              <div className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-xl rounded-xl p-6 sm:p-7 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-blue-500/10 rounded-xl transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-300 dark:to-teal-300 mb-2">
                    Digital Success
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white/90">
                    Modern Marketing & SEO
                  </p>
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