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
import { ArrowRight, ChevronRight, GraduationCap, Users, Star, Clock, Sparkles, BookOpen, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader2 from "@/components/shared/others/Preloader2";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import medhLogo from "@/assets/images/logo/medh.png";

const Hero1 = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getQuery } = useGetQuery();

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

  return (
    <>
      <section style={{ paddingTop: "var(--header-height, 80px)", paddingBottom: "var(--footer-height, 80px)" }} className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Geometric Patterns */}
          <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-conic from-primary-500/30 via-purple-500/20 to-secondary-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-conic from-secondary-500/30 via-pink-500/20 to-primary-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow-reverse"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-conic from-blue-500/30 via-teal-500/20 to-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-pulse-slow"></div>
          
          {/* Enhanced Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(circle_at_center,white,transparent_80%)]"></div>
        </div>

        <div className="max-w-[1920px] w-[92%] xl:w-[90%] mx-auto relative z-10">
          {/* Hero Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[85vh] py-20">
            {/* Mobile Hero Content */}
            <div className={`space-y-6 md:space-y-8 transition-all duration-1000 transform text-center md:text-left px-4 md:px-0 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Mobile-optimized Main Heading */}
              <div className="space-y-4">
                <h1 className="font-bold leading-tight transform transition-all duration-500 hover:scale-105 w-full">
                  <span 
                    style={{ 
                      fontSize: 'min(max(1.5rem, 3.5vw), 1.5rem)',
                      lineHeight: '1.1',
                      letterSpacing: 'min(max(0.5px, 0.15vw), 1.5px)'
                    }} 
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 
                      transform transition-all duration-500 hover:from-white hover:to-gray-300
                      sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%]">
                    UNLOCK YOUR POTENTIAL WITH
                  </span>
                  <span 
                    className="block mt-4 relative group-hover:tracking-wider transition-all duration-500
                      sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] flex items-center gap-3">
                    <div className="relative h-[min(max(2rem,_5vw),_4rem)] aspect-[3/1]">
                      <Image
                        src={medhLogo}
                        alt="Medh Logo"
                        fill
                        className="object-contain filter brightness-200 hover:brightness-150 transition-all duration-300"
                        priority
                      />
                    </div>
                    <span className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 
                      blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </span>
                </h1>
                
                <div className="space-y-4 transform transition-all duration-500 hover:scale-[1.02]
                  sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%]">
                  <p style={{ 
                      fontSize: 'min(max(1.1rem, 2.5vw), 1.5rem)',
                      lineHeight: '1.4'
                    }} 
                    className="text-gray-300 leading-relaxed flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary-400" />
                    Skill Development Courses led by Seasoned Experts
                  </p>
                  <div className="py-4 px-5 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent 
                    rounded-xl backdrop-blur-sm border border-white/10 
                    hover:border-white/20 transition-all duration-500 transform hover:scale-[1.01]
                    hover:shadow-lg hover:shadow-primary-500/10">
                    <h3 className="text-white/90 font-semibold mb-3 flex items-center gap-2"
                      style={{ 
                        fontSize: 'min(max(1rem, 1.8vw), 1.25rem)',
                      }}>
                      <Target className="w-5 h-5 text-primary-400" />
                      Transforming Lives at Every Stage
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 group p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                        <div className="p-2 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                          <BookOpen className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-white/90 font-semibold text-base group-hover:text-primary-400 transition-colors">
                          Children & Teens
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 group p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                        <div className="p-2 rounded-lg bg-secondary-500/10 group-hover:bg-secondary-500/20 transition-colors">
                          <Users className="w-4 h-4 text-secondary-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-white/90 font-semibold text-base group-hover:text-secondary-400 transition-colors">
                          Professionals
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 group p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                        <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                          <Star className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-white/90 font-semibold text-base group-hover:text-purple-400 transition-colors">
                          Homemakers
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 group p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                        <div className="p-2 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                          <TrendingUp className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-white/90 font-semibold text-base group-hover:text-pink-400 transition-colors">
                          Lifelong Learners
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tagline with special highlighting */}
                <div className="relative mt-6 inline-flex items-center gap-6 group">
                  {/* Advanced background effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/40 via-secondary-500/40 to-primary-500/40 
                    blur-lg opacity-70 animate-pulse-slow rounded-lg 
                    dark:from-primary-500/40 dark:via-secondary-500/40 dark:to-primary-500/40
                    light:from-primary-400/30 light:via-secondary-400/30 light:to-primary-400/30">
                  </div>
                  
                  {/* Main tagline container */}
                  <div className="relative py-3 px-6 rounded-xl backdrop-blur-sm border border-white/10 
                    bg-gradient-to-br from-[#1E3C72]/10 to-[#2A5298]/5
                    hover:border-[#E94E1B]/30 transition-all duration-500
                    hover:shadow-lg hover:shadow-[#E94E1B]/20 transform hover:-translate-y-1">
                    
                    {/* Primary tagline with advanced animation */}
                    <p className="text-xl md:text-2xl font-bold tracking-wide relative text-center">
                      {/* Enhanced glow effect - now automatic instead of hover */}
                      <span className="absolute -inset-1 bg-[#E94E1B]/10 filter blur-md rounded-lg animate-pulse-glow"></span>
                      <span className="inline-block transition-transform duration-300
                        font-hinglish relative animate-text-glow animate-text-pop animate-text-color" 
                        style={{
                          fontFamily: "'Bulgathi', 'Hind', Tahoma, Geneva, Verdana, sans-serif", 
                          letterSpacing: "1px",
                          fontWeight: "1000",
                          fontSize: "calc(1.2rem + 0.8vw)",
                          textShadow: "0 0 30px rgba(233, 78, 27, 0.3)",
                          background: "linear-gradient(to right, #E94E1B, #1E3C72)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}>
                        Medh Hain Toh Mumkin Hain!
                      </span>
                    </p>
                    
                    {/* Psychological impact indicators */}
                    <div className="mt-2 flex items-center justify-center gap-4 animate-fade-in-out">
                      <div className="flex items-center group">
                        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#E94E1B] to-[#FF6B6B] mr-2 
                          animate-ping group-hover:animate-none group-hover:scale-150 transition-transform duration-500"></span>
                        <span className="text-sm md:text-base font-bold bg-gradient-to-r from-[#E94E1B] to-[#FF6B6B] 
                          bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300">
                          Learn
                        </span>
                      </div>
                      <div className="flex items-center group">
                        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#1E3C72] to-[#4776E6] mr-2 
                          animate-ping-delayed group-hover:animate-none group-hover:scale-150 transition-transform duration-500"></span>
                        <span className="text-sm md:text-base font-bold bg-gradient-to-r from-[#1E3C72] to-[#4776E6] 
                          bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300">
                          Upskill
                        </span>
                      </div>
                      <div className="flex items-center group">
                        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#2A5298] to-[#00C6FF] mr-2 
                          animate-ping-delayed-2 group-hover:animate-none group-hover:scale-150 transition-transform duration-500"></span>
                        <span className="text-sm md:text-base font-bold bg-gradient-to-r from-[#2A5298] to-[#00C6FF] 
                          bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300">
                          Elevate
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STEM Logo - Now positioned to the right */}
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#E94E1B]/20 to-[#1E3C72]/20 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative w-auto h-full rounded-lg overflow-hidden transform group-hover:scale-105 transition duration-500">
                      <Image
                        src={stemImg}
                        alt="STEM Accredited"
                        className="w-auto h-[calc(2.5rem+1.6vw)] object-contain"
                        style={{
                          minHeight: '3rem',
                          maxHeight: '4.5rem'
                        }}
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3C72]/10 via-transparent to-[#E94E1B]/10 group-hover:opacity-0 transition duration-500"></div>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#E94E1B] to-[#1E3C72] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats with Advanced Hover Effects
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="group space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-500/20 group-hover:bg-primary-500/30 transition-colors">
                      <BookOpen className="text-primary-400 group-hover:text-primary-300 transition-colors transform group-hover:scale-110 group-hover:rotate-6" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">30+</span>
                  </div>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Expert Courses</p>
                </div>
                
                <div className="group space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary-500/20 group-hover:bg-secondary-500/30 transition-colors">
                      <Users className="text-secondary-400 group-hover:text-secondary-300 transition-colors transform group-hover:scale-110 group-hover:-rotate-6" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-white group-hover:text-secondary-400 transition-colors">2000+</span>
                  </div>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Active Learners</p>
                </div>
                
                <div className="group space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                      <Target className="text-purple-400 group-hover:text-purple-300 transition-colors transform group-hover:scale-110 group-hover:rotate-6" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">98%</span>
                  </div>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Success Rate</p>
                </div>
                
                <div className="group space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
                      <TrendingUp className="text-pink-400 group-hover:text-pink-300 transition-colors transform group-hover:scale-110 group-hover:-rotate-6" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">4.9</span>
                  </div>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">User Rating</p>
                </div>
              </div> */}

              {/* Enhanced CTA Buttons with Advanced Hover Effects */}
              <div className="flex flex-wrap gap-4">
                <Link href="/courses" 
                  className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/25 overflow-hidden">
                  <span className="relative z-10">Let's Connect</span>
                  <ArrowRight size={20} className="relative z-10 ml-2 transform transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </Link>
                <a href="#featured-courses" 
                  className="group relative inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 transform hover:-translate-y-1 overflow-hidden">
                  <span className="relative z-10">Explore Courses</span>
                  <ChevronRight size={20} className="relative z-10 ml-2 transform transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </a>
              </div>
            </div>

            {/* Enhanced 3D Interactive Element - Modified to align with "UNLOCK YOUR POTENTIAL WITH MEDH" */}
            <div className={`relative transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative w-full max-w-[600px] mx-auto aspect-[4/3] perspective-1500">
                {/* Enhanced Animated Background with glow effect */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-conic from-primary-500 via-purple-500 to-secondary-500 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
                  <div className="absolute inset-0 bg-gradient-conic from-secondary-500 via-pink-500 to-primary-500 rounded-full blur-3xl opacity-20 animate-spin-slow-reverse"></div>
                </div>
                
                {/* Enhanced Interactive 3D Cards - modified to be more compact */}
                <div className="absolute inset-0 flex flex-col justify-center">
                  <div className="relative transform-gpu rotate3d-subtle">
                    {/* Cards arranged in a vertical order with improved responsiveness */}
                    <div className="space-y-2 sm:space-y-3 md:space-y-4 scale-[0.85] sm:scale-90 md:scale-100">
                      {/* Row 1 */}
                      <div className="flex gap-2 sm:gap-3 md:gap-4">
                        {/* Course Card 1 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-primary-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl p-3 sm:p-4 md:p-5 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          <BookOpen className="text-primary-400 mb-2 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          <h3 className="text-white font-semibold mb-1 text-sm sm:text-base md:text-lg relative z-10 transition-all duration-300 group-hover:text-primary-300">Future Tech Skills</h3>
                          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm relative z-10 transition-all duration-300 group-hover:text-white/90">AI, ML & Data Science Excellence</p>
                        </div>
                        
                        {/* Course Card 2 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-secondary-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-3 sm:p-4 md:p-5 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          <Target className="text-secondary-400 mb-2 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          <h3 className="text-white font-semibold mb-1 text-sm sm:text-base md:text-lg relative z-10 transition-all duration-300 group-hover:text-secondary-300">Personal Growth</h3>
                          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm relative z-10 transition-all duration-300 group-hover:text-white/90">Transform Your Inner Potential</p>
                        </div>
                      </div>
                      
                      {/* Row 2 */}
                      <div className="flex gap-2 sm:gap-3 md:gap-4">
                        {/* Course Card 3 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl p-3 sm:p-4 md:p-5 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          <Users className="text-purple-400 mb-2 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          <h3 className="text-white font-semibold mb-1 text-sm sm:text-base md:text-lg relative z-10 transition-all duration-300 group-hover:text-purple-300">Ancient Wisdom</h3>
                          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm relative z-10 transition-all duration-300 group-hover:text-white/90">Vedic Math Mastery</p>
                        </div>
                        
                        {/* Course Card 4 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-xl rounded-xl p-3 sm:p-4 md:p-5 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          <TrendingUp className="text-blue-400 mb-2 transform transition-transform group-hover:scale-110 group-hover:rotate-6 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          <h3 className="text-white font-semibold mb-1 text-sm sm:text-base md:text-lg relative z-10 transition-all duration-300 group-hover:text-blue-300">Digital Success</h3>
                          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm relative z-10 transition-all duration-300 group-hover:text-white/90">Data-Driven Marketing Mastery</p>
                        </div>
                      </div>
                      
                      {/* Optional Connecting Line - made responsive */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/0 via-primary-500/30 to-primary-500/0 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Elements - made more compact */}
                <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-primary-500/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-secondary-500/20 rounded-full blur-xl animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-purple-500/20 rounded-full blur-xl animate-float animation-delay-4000"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Featured Courses Section */}
          <div id="featured-courses" className="py-12 px-4 max-w-[1800px] mx-auto">
            <div className="text-center mb-10">
              
              <h2 className="text-4xl md:text-5xl font-extrabold relative z-10 mb-6 inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-secondary-400 
                inline-block transform hover:scale-105 transition-transform duration-300">
                  Featured Live Courses
                </span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
                Discover our most popular courses designed to help you master the skills that matter most in today's digital landscape
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <Preloader2 />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-[1700px] mx-auto px-2">
                {featuredCourses.map((course, index) => (
                  <div 
                    key={course._id}
                    className={`transition-all duration-700 transform hover:scale-105 
                      ${isLoaded 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-10 opacity-0'
                      } 
                      delay-${index * 100} bg-gradient-to-br from-gray-800/80 to-gray-900/80 
                      rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary-500/10
                      border border-gray-700/50 backdrop-blur-sm`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}
            
            {/* Enhanced View All Courses Button */}
            <div className="mt-12 text-center">
              <Link 
                href="/courses" 
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-primary-500/20 overflow-hidden"
              >
                <span className="relative z-10">Explore All Courses</span>
                <ArrowRight size={18} className="relative z-10 transform transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </Link>
              <p className="mt-3 text-gray-400 text-sm">
                Take the next step in your professional journey
              </p>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, -10px); }
          }

          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }

          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes spin-slow-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-pulse-slow {
            animation: pulse-slow 6s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 15s linear infinite;
          }

          .animate-spin-slow-reverse {
            animation: spin-slow-reverse 15s linear infinite;
          }

          .animate-spin-slower {
            animation: spin-slow 25s linear infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2000ms;
          }

          .animation-delay-4000 {
            animation-delay: 4000ms;
          }

          .perspective-1000 {
            perspective: 1000px;
          }
          
          .perspective-1500 {
            perspective: clamp(1000px, 150vw, 1500px);
          }

          @media (max-width: 640px) {
            .perspective-1500 {
              perspective: 800px;
            }
          }

          @media (min-width: 1536px) {
            .perspective-1500 {
              perspective: 2000px;
            }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s linear infinite;
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .rotate3d-slow {
            animation: rotate3d 15s ease-in-out infinite;
          }
          
          .rotate3d-subtle {
            animation: rotate3d-subtle 10s ease-in-out infinite;
          }
          
          @keyframes rotate3d {
            0%, 100% { transform: rotate3d(1, 1, 1, 0deg); }
            25% { transform: rotate3d(1, 0, 0, 5deg); }
            50% { transform: rotate3d(0, 1, 0, 5deg); }
            75% { transform: rotate3d(0, 0, 1, 5deg); }
          }
          
          @keyframes rotate3d-subtle {
            0%, 100% { transform: rotate3d(1, 1, 1, 0deg) scale(0.95); }
            25% { transform: rotate3d(1, 0, 0, 2deg) scale(1); }
            50% { transform: rotate3d(0, 1, 0, 2deg) scale(0.98); }
            75% { transform: rotate3d(0, 0, 1, 2deg) scale(0.95); }
          }
          
          /* Multilanguage translation animations */
          @keyframes slide-up {
            0%, 25% { 
              transform: translateY(100%); 
              opacity: 0;
            }
            30%, 45% { 
              transform: translateY(0); 
              opacity: 1;
            }
            50%, 100% { 
              transform: translateY(-100%); 
              opacity: 0;
            }
          }
          
          .animate-slide-up {
            animation: slide-up 9s ease-in-out infinite;
          }
          
          .animate-slide-up-delay-1 {
            animation: slide-up 9s ease-in-out infinite;
            animation-delay: 3s;
          }
          
          .animate-slide-up-delay-2 {
            animation: slide-up 9s ease-in-out infinite;
            animation-delay: 6s;
          }
          
          /* Ping animations with delays */
          .animate-ping {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          
          .animate-ping-delayed {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            animation-delay: 0.5s;
          }
          
          .animate-ping-delayed-2 {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            animation-delay: 1s;
          }
          
          @keyframes ping {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          
          .animation-delay-500 {
            animation-delay: 500ms;
          }
          
          .animation-delay-1000 {
            animation-delay: 1000ms;
          }
          
          .animation-delay-1500 {
            animation-delay: 1500ms;
          }
          
          /* Automatic glow and fade animations */
          @keyframes pulse-glow {
            0%, 100% { 
              opacity: 0.2;
              filter: blur(5px);
            }
            50% { 
              opacity: 0.8;
              filter: blur(15px);
            }
          }
          
          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          
          @keyframes fade-in-out {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          
          .animate-fade-in-out {
            animation: fade-in-out 4s ease-in-out infinite;
          }
          
          @keyframes text-glow {
            0%, 100% {
              text-shadow: 0 0 10px rgba(56, 178, 172, 0.2),
                          0 0 20px rgba(56, 178, 172, 0);
            }
            50% {
              text-shadow: 0 0 15px rgba(56, 178, 172, 0.4),
                          0 0 30px rgba(56, 178, 172, 0.2),
                          0 0 40px rgba(237, 137, 54, 0.1);
            }
          }
          
          .animate-text-glow {
            animation: text-glow 4s ease-in-out infinite;
          }
          
          @keyframes text-pop {
            0%, 100% {
              transform: scale(1);
            }
            30% {
              transform: scale(1.05);
            }
            60% {
              transform: scale(1);
            }
          }
          
          .animate-text-pop {
            animation: text-pop 5s ease-in-out infinite;
          }
          
          @keyframes text-color {
            0%, 100% {
              background-image: linear-gradient(to right, #4FD1C5, #ED8936, #4FD1C5);
              background-size: 200% auto;
              background-position: 0% center;
            }
            50% {
              background-position: 100% center;
            }
          }
          
          .animate-text-color {
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: text-color 8s linear infinite;
          }
        `}</style>
      </section>
    </>
  );
};

export default Hero1;
