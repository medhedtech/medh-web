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
        url: apiUrls?.courses?.getAllCoursesWithLimits(1, 3, "", "", "", "Published", "", "", []),
        onSuccess: (data) => {
          const sortedCourses = (data?.courses || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
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
                <span className="text-primary-300 text-sm font-medium">Industry-Leading Courses</span>
                <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
              </div>

              {/* Enhanced Main Heading with Advanced Animation */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Elevate Your Career with</span>
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 animate-gradient relative">
                    Expert-Led Learning
                    <span className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                  Join a community of ambitious learners and industry experts. Master the skills that drive innovation and success in today's digital world.
                </p>
              </div>

              {/* Enhanced Stats with Advanced Hover Effects */}
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
              </div>

              {/* Enhanced CTA Buttons with Advanced Hover Effects */}
              <div className="flex flex-wrap gap-4">
                <Link href="/courses" 
                  className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/25 overflow-hidden">
                  <span className="relative z-10">Start Learning Now</span>
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

            {/* Enhanced 3D Interactive Element */}
            <div className={`relative transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative w-full aspect-square perspective-1000">
                {/* Enhanced Animated Background */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-conic from-primary-500 via-purple-500 to-secondary-500 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
                  <div className="absolute inset-0 bg-gradient-conic from-secondary-500 via-pink-500 to-primary-500 rounded-full blur-3xl opacity-20 animate-spin-slow-reverse"></div>
                </div>
                
                {/* Enhanced Interactive 3D Cards */}
                <div className="relative grid grid-cols-2 gap-6 p-8 transform-gpu">
                  {/* Course Card 1 */}
                  <div className="group relative bg-gradient-to-br from-primary-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-rotate-2 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <BookOpen className="text-primary-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-6" size={32} />
                    <h3 className="text-white font-semibold mb-2">Expert-Led Courses</h3>
                    <p className="text-gray-400 text-sm">Learn from industry leaders</p>
                  </div>
                  
                  {/* Course Card 2 */}
                  <div className="group relative bg-gradient-to-br from-secondary-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:rotate-2 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <Target className="text-secondary-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:-rotate-6" size={32} />
                    <h3 className="text-white font-semibold mb-2">Practical Projects</h3>
                    <p className="text-gray-400 text-sm">Build real-world skills</p>
                  </div>
                  
                  {/* Course Card 3 */}
                  <div className="group relative bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:-rotate-2 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <Users className="text-purple-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-6" size={32} />
                    <h3 className="text-white font-semibold mb-2">Community Learning</h3>
                    <p className="text-gray-400 text-sm">Collaborate and grow</p>
                  </div>
                  
                  {/* Course Card 4 */}
                  <div className="group relative bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-105 hover:rotate-2 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <TrendingUp className="text-blue-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:-rotate-6" size={32} />
                    <h3 className="text-white font-semibold mb-2">Career Growth</h3>
                    <p className="text-gray-400 text-sm">Achieve your goals</p>
                  </div>
                </div>

                {/* Enhanced Floating Elements */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float animation-delay-4000"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Featured Courses Section */}
          <div id="featured-courses" className="py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full mb-6 backdrop-blur-sm border border-primary-500/20 hover:border-primary-500/30 transition-colors group">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </span>
                <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent font-medium group-hover:from-primary-300 group-hover:to-secondary-300 transition-colors">Featured Courses</span>
                <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6">
                Trending Professional Courses
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Discover our most popular courses designed to help you master the skills that matter most in today's digital landscape
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Preloader2 />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
                {featuredCourses.map((course, index) => (
                  <div 
                    key={course._id}
                    className={`transition-all duration-700 transform ${
                      isLoaded 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-10 opacity-0'
                    } h-full min-h-[580px]`}
                    style={{ 
                      transitionDelay: `${index * 200}ms`,
                    }}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced View All Courses Card */}
            <div className="mt-16 text-center">
              <Link 
                href="/courses" 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-primary-500/25 overflow-hidden"
              >
                <span className="relative z-10 text-lg">Explore All Courses</span>
                <ArrowRight size={20} className="relative z-10 transform transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </Link>
              <p className="mt-4 text-gray-400">
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

          .animation-delay-2000 {
            animation-delay: 2000ms;
          }

          .animation-delay-4000 {
            animation-delay: 4000ms;
          }

          .perspective-1000 {
            perspective: 1000px;
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
        `}</style>
      </section>
    </>
  );
};

export default Hero1;
