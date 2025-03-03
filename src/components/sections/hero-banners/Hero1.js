"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import stemImg from "@/assets/images/herobanner/Background.png";
import Group from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import bgImage from "@/assets/Header-Images/Home/Home_Banner_2_e7389bb905.jpg";
import "@/assets/css/ovalAnimation.css";
import CourseCard from "@/components/sections/courses/CourseCard";
import { ArrowRight, ChevronRight, GraduationCap, Users, Star, Clock, Sparkles, BookOpen, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader2 from "@/components/shared/others/Preloader2";

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
      <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh] py-20">
            <div className={`space-y-8 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Enhanced Badge with Animation */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/20 to-primary-500/5 rounded-full p-1.5 pl-3 pr-5 backdrop-blur-sm border border-primary-500/20 shadow-lg shadow-primary-500/5 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full group-hover:scale-105 transition-transform">New</span>
                <span className="text-primary-300 text-sm font-medium">ISO / STEM Certified Courses</span>
                <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
              </div>

              {/* Enhanced Main Heading with Advanced Animation */}
              <div className="space-y-4">
                <h1 className="font-bold leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap">
                    UNLOCK YOUR POTENTIAL
                  </span>
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 animate-gradient relative text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    WITH MEDH
                    <span className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </span>
                </h1>
                
                {/* STEM.org Accreditation Badge with white container */}
                <div className="flex justify-start mt-4 mb-6">
                  <div className="relative w-[200px] h-[100px] bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Image 
                      src="/images/certifications/stem-accredited.png"
                      alt="STEM.org Accredited Educational Experience"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
                    Skill Development Courses led by Seasoned Experts
                  </p>
                  <div className="py-3 px-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Transforming lives at every stage: from curious children and ambitious teens to career professionals and innovative homemakers.
                    </p>
                  </div>
                </div>
                
                {/* Tagline with special highlighting */}
                <div className="relative mt-6 inline-block group overflow-hidden">
                  {/* Advanced background effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/40 via-secondary-500/40 to-primary-500/40 
                    blur-lg opacity-70 animate-pulse-slow rounded-lg 
                    dark:from-primary-500/40 dark:via-secondary-500/40 dark:to-primary-500/40
                    light:from-primary-400/30 light:via-secondary-400/30 light:to-primary-400/30">
                  </div>
                  
                  {/* Particle effect overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Main tagline with multilingual effect */}
                  <div className="relative py-3 px-6 rounded-xl backdrop-blur-sm border border-white/10 
                    bg-gradient-to-br from-white/10 to-white/5 
                    dark:from-white/10 dark:to-white/5
                    light:from-primary-900/10 light:to-primary-900/5
                    hover:border-primary-400/30 transition-all duration-500
                    hover:shadow-lg hover:shadow-primary-500/20 transform hover:-translate-y-1">
                    
                    {/* Primary tagline with advanced animation */}
                    <p className="text-xl md:text-2xl font-bold tracking-wide relative text-center">
                      {/* Enhanced glow effect - now automatic instead of hover */}
                      <span className="absolute -inset-1 bg-primary-500/10 filter blur-md rounded-lg animate-pulse-glow"></span>
                      <span className="inline-block transition-transform duration-300
                        font-hinglish relative animate-text-glow animate-text-pop animate-text-color" 
                        style={{
                          fontFamily: "'Bulgathi', 'Hind', Tahoma, Geneva, Verdana, sans-serif", 
                          letterSpacing: "1px",
                          fontWeight: "1000",
                          fontSize: "calc(1.2rem + 0.8vw)",
                          textShadow: "0 0 30px rgba(120, 119, 198, 0.3)",
                          color: ""
                        }}>
                        Medh Hain Toh Mumkin Hain!
                      </span>
                    </p>
                    
                    {/* Psychological impact indicators - now always visible with fade animation */}
                    <div className="mt-2 flex items-center justify-center gap-2 animate-fade-in-out">
                      <span className="text-xs md:text-sm font-bold text-primary-400 light:text-primary-600 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mr-1 animate-ping"></span>
                        Learn
                      </span>
                      <span className="text-xs md:text-sm font-bold text-secondary-400 light:text-secondary-600 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary-500 mr-1 animate-ping-delayed"></span>
                        Upskill
                      </span>
                      <span className="text-xs md:text-sm font-bold text-pink-400 light:text-pink-600 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mr-1 animate-ping-delayed-2"></span>
                        Elevate
                      </span>
                    </div>
                  </div>
                  
                  {/* Certification Logos - Positioned to the right of the tagline */}
                  <div className="absolute -right-[280px] top-1/2 -translate-y-1/2 flex flex-row gap-3 items-center z-10">
                    {/* ISO Certification */}
                    <div className="certification-badge flex flex-col items-center group transform hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 md:w-20 md:h-20 relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-md group-hover:bg-white/20 transition-all duration-300"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 overflow-hidden">
                          {/* Inner ring with subtle texture */}
                          <div className="absolute inset-2 rounded-full border border-white/40 bg-gray-900/40 opacity-30"></div>
                          <div className="w-full h-full relative flex items-center justify-center">
                            <div className="absolute inset-0.5 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                              <div className="text-sm font-bold text-white text-center leading-tight">
                                <span className="block">ISO</span>
                                <span className="block text-xs">9001:2015</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Small decorative dot */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-2 h-2 rounded-full bg-primary-400 animate-ping-delayed opacity-70"></div>
                      </div>
                      <span className="mt-1 text-xs text-gray-300 group-hover:text-primary-300 transition-colors duration-300">Certified</span>
                    </div>
                    
                    {/* STEM Certification */}
                    <div className="certification-badge flex flex-col items-center group transform hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 md:w-20 md:h-20 relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-md group-hover:bg-white/20 transition-all duration-300"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-primary-300/30 flex items-center justify-center backdrop-blur-sm bg-white/5 overflow-hidden">
                          {/* Inner ring with subtle texture */}
                          <div className="absolute inset-2 rounded-full border border-primary-400/20 bg-gray-900/40 opacity-30"></div>
                          <div className="w-full h-full relative flex items-center justify-center">
                            <div className="absolute inset-0.5 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                              <div className="text-sm font-bold text-white text-center leading-tight">
                                <span className="block text-primary-300">STEM</span>
                                <span className="block text-xs">EDUCATION</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Small decorative dot */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-2 h-2 rounded-full bg-secondary-400 animate-ping-delayed-2 opacity-70"></div>
                      </div>
                      <span className="mt-1 text-xs text-gray-300 group-hover:text-primary-300 transition-colors duration-300">Accredited</span>
                    </div>
                    
                    {/* CERTIFIED Badge */}
                    <div className="certification-badge flex flex-col items-center group transform hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 md:w-20 md:h-20 relative">
                        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md group-hover:bg-primary-500/30 transition-all duration-300 animate-pulse-slow"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-primary-400/50 flex items-center justify-center backdrop-blur-sm bg-white/5 overflow-hidden">
                          {/* Inner ring with subtle texture */}
                          <div className="absolute inset-2 rounded-full border border-secondary-400/20 bg-gray-900/40 opacity-30"></div>
                          <div className="w-full h-full relative flex items-center justify-center">
                            <div className="absolute inset-0.5 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                              <div className="text-sm font-bold text-white text-center leading-tight">
                                <span className="block text-secondary-300">CERTIFIED</span>
                                <span className="block text-xs">QUALITY</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Small decorative dots */}
                        <div className="absolute left-0 top-1/2 -translate-x-1/3 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-70"></div>
                        <div className="absolute right-0 top-1/2 translate-x-1/3 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-400 animate-ping-delayed opacity-70"></div>
                      </div>
                      <span className="mt-1 text-xs text-gray-300 group-hover:text-secondary-300 transition-colors duration-300">Excellence</span>
                    </div>
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
              <div className="relative w-full aspect-square perspective-1500">
                {/* Enhanced Animated Background with glow effect */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-conic from-primary-500 via-purple-500 to-secondary-500 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
                  <div className="absolute inset-0 bg-gradient-conic from-secondary-500 via-pink-500 to-primary-500 rounded-full blur-3xl opacity-20 animate-spin-slow-reverse"></div>
                </div>
                
                {/* 3D Text Element that aligns with main heading */}
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400/20 via-secondary-400/20 to-primary-400/20 animate-pulse-slow transform-gpu rotate3d-slow select-none">
                    MEDH
                  </div>
                </div> */}
                
                {/* Enhanced Interactive 3D Cards - modified to be parallel to text */}
                <div className="absolute inset-0 flex flex-col justify-center">
                  <div className="relative transform-gpu rotate3d-subtle">
                    {/* Cards arranged in a vertical order to parallel the text flow */}
                    <div className="space-y-4">
                      {/* Row 1 */}
                      <div className="flex gap-4">
                        {/* Course Card 1 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-primary-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                          <BookOpen className="text-primary-400 mb-3 transform transition-transform group-hover:scale-110 group-hover:rotate-6" size={28} />
                          <h3 className="text-white font-semibold mb-1">For Children</h3>
                          <p className="text-gray-400 text-xs">Building foundations for the future</p>
                        </div>
                        
                        {/* Course Card 2 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-secondary-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                          <Target className="text-secondary-400 mb-3 transform transition-transform group-hover:scale-110 group-hover:rotate-6" size={28} />
                          <h3 className="text-white font-semibold mb-1">For Teens</h3>
                          <p className="text-gray-400 text-xs">Igniting passion for learning</p>
                        </div>
                      </div>
                      
                      {/* Row 2 */}
                      <div className="flex gap-4">
                        {/* Course Card 3 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                          <Users className="text-purple-400 mb-3 transform transition-transform group-hover:scale-110 group-hover:rotate-6" size={28} />
                          <h3 className="text-white font-semibold mb-1">For Professionals</h3>
                          <p className="text-gray-400 text-xs">Advancing career opportunities</p>
                        </div>
                        
                        {/* Course Card 4 */}
                        <div className="group relative w-1/2 bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                          <TrendingUp className="text-blue-400 mb-3 transform transition-transform group-hover:scale-110 group-hover:rotate-6" size={28} />
                          <h3 className="text-white font-semibold mb-1">For Homemakers</h3>
                          <p className="text-gray-400 text-xs">Empowering with new skills</p>
                        </div>
                      </div>
                      
                      {/* Optional Connecting Line */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/0 via-primary-500/30 to-primary-500/0 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Certification Logos - repositioned to bottom right */}
                {/* Removing this section as we've moved the certification logos next to the tagline */}
                
                {/* Enhanced Floating Elements */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float animation-delay-4000"></div>
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
            perspective: 1500px;
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
            0%, 100% { transform: rotate3d(1, 1, 1, 0deg); }
            25% { transform: rotate3d(1, 0, 0, 2deg); }
            50% { transform: rotate3d(0, 1, 0, 2deg); }
            75% { transform: rotate3d(0, 0, 1, 2deg); }
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
