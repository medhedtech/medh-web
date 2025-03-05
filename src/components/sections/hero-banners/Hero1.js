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

  const cacheManager = {
    set: (data) => {
      const cacheData = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(cacheData));
    },
    get: () => {
      const cache = localStorage.getItem(JOBS_CACHE_KEY);
      if (!cache) return null;
      const { timestamp, data } = JSON.parse(cache);
      return Date.now() - timestamp > CACHE_DURATION ? null : data;
    }
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh] py-12 lg:py-20">
            {/* Hero Content Left Side */}
            <div className={`flex flex-col items-center lg:items-start justify-center transition-all duration-1000 transform text-center lg:text-left px-4 lg:px-0 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Main Heading */}
              <div className="w-full max-w-[500px] lg:max-w-[600px] mx-auto lg:mx-0 space-y-8">
                <h1 className="font-bold leading-tight w-full">
                  <span 
                    style={{ 
                      fontSize: 'clamp(1.5rem, 3vw, 1.5rem)',
                      lineHeight: '1',
                      letterSpacing: '0.02em'
                    }} 
                    className="block text-white font-extrabold mb-4 lg:mb-6">
                    UNLOCK YOUR POTENTIAL WITH
                  </span>
                  <span className="block relative mx-auto lg:mx-0 mb-8">
                    <div className="relative h-[clamp(3rem,_11vw,_5rem)] max-w-[150px] lg:max-w-[200px] mx-auto lg:mx-0">
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
                
                <div className="space-y-8">
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-300">
                    <GraduationCap className="w-6 h-6 lg:w-7 lg:h-7 text-primary-400 flex-shrink-0" />
                    <p style={{ 
                      fontSize: 'clamp(1rem, 3vw, 1.35rem)',
                      lineHeight: '1.4'
                    }} 
                    className="font-medium">
                      Skill Development Courses led by Seasoned Experts
                    </p>
                  </div>

                  <div className="bg-[#0C1015]/60 backdrop-blur-sm rounded-xl p-5 lg:p-6 border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-white/90 font-semibold mb-5 flex items-center justify-center lg:justify-start gap-2">
                      <Target className="w-6 h-6 text-primary-400" />
                      <span className="text-lg lg:text-xl">Transforming Lives at Every Stage</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                        <div className="p-2.5 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                          <BookOpen className="w-5 h-5 text-primary-400" />
                        </div>
                        <h4 className="text-white/90 font-medium text-base">Children & Teens</h4>
                      </div>
                      <div className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                        <div className="p-2.5 rounded-lg bg-secondary-500/10 group-hover:bg-secondary-500/20 transition-colors">
                          <Users className="w-5 h-5 text-secondary-400" />
                        </div>
                        <h4 className="text-white/90 font-medium text-base">Professionals</h4>
                      </div>
                      <div className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                        <div className="p-2.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                          <Star className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-white/90 font-medium text-base">Homemakers</h4>
                      </div>
                      <div className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                        <div className="p-2.5 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                          <TrendingUp className="w-5 h-5 text-pink-400" />
                        </div>
                        <h4 className="text-white/90 font-medium text-base">Lifelong Learners</h4>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-2">
                    <Link href="/courses" 
                      className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/25 overflow-hidden">
                      <span className="relative z-10 text-base">Let's Connect</span>
                      <ArrowRight size={20} className="relative z-10 ml-2 transform transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    </Link>
                    <a href="#featured-courses" 
                      className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 transform hover:-translate-y-1 overflow-hidden">
                      <span className="relative z-10 text-base">Explore Courses</span>
                      <ChevronRight size={20} className="relative z-10 ml-2 transform transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    </a>
                  </div>
                </div>
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
