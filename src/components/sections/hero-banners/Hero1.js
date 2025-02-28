"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import stemImg from "@/assets/images/herobanner/Background.png";
import Group from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import family from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import bgImage from "@/assets/Header-Images/Home/Home_Banner_2_e7389bb905.jpg";
import "@/assets/css/ovalAnimation.css";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Dynamically import CourseCard for better performance
const CourseCard = dynamic(() => import('@/components/sections/courses/CourseCard'), {
  loading: () => <div className="animate-pulse bg-white/5 rounded-xl h-[300px]"></div>
});

const Hero1 = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimize animation performance with RAF
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, []);

  // Featured courses data
  const featuredCourses = [
    {
      _id: "1",
      course_title: "Full Stack Development",
      course_category: "Development",
      course_duration: "12 weeks",
      course_short_desc: "Master modern web development with MERN stack",
      rating: "4.9",
      course_image: Group
    },
    {
      _id: "2",
      course_title: "Data Science & Analytics",
      course_category: "Data Science",
      course_duration: "10 weeks",
      course_short_desc: "Learn data analysis, ML and visualization",
      rating: "4.8",
      course_image: Group
    }
  ];

  return (
    <section 
      className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 overflow-hidden"
      aria-label="Hero Section"
    >
      {/* Optimized Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob will-change-transform"
          aria-hidden="true"
        ></div>
        <div 
          className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 will-change-transform"
          aria-hidden="true"
        ></div>
        <div 
          className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 will-change-transform"
          aria-hidden="true"
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20">
          {/* Content Section */}
          <div 
            className={`space-y-8 transition-all duration-1000 transform ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            } will-change-transform`}
          >
            {/* Status Badge */}
            <div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-primary-500/0 rounded-full p-1 pl-2 pr-4 backdrop-blur-sm"
              role="status"
            >
              <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                New
              </span>
              <span className="text-primary-300 text-sm">
                Professional Courses Available
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Transform Your Future with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                Professional Skills
              </span>
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6" role="list">
              {[
                { icon: GraduationCap, count: '20+', label: 'Professional Courses' },
                { icon: Users, count: '1000+', label: 'Active Students' },
                { icon: Star, count: '4.9', label: 'Average Rating' }
              ].map((stat, index) => (
                <div key={index} className="space-y-2" role="listitem">
                  <div className="flex items-center gap-2">
                    <stat.icon className="text-primary-400" size={24} aria-hidden="true" />
                    <span className="text-2xl font-bold text-white">{stat.count}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/courses"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary-500/25 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Explore Courses
                <ArrowRight size={18} className="ml-2" aria-hidden="true" />
              </Link>
              <a 
                href="#featured-courses"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all backdrop-blur-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                View Featured
                <ChevronRight size={18} className="ml-1" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div 
            className={`relative transition-all duration-1000 delay-300 transform ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            } will-change-transform`}
          >
            <div className="relative w-full aspect-square">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-20 animate-pulse will-change-transform"
                aria-hidden="true"
              ></div>
              <div className="wavy-oval overflow-hidden rounded-3xl border border-white/10 backdrop-blur-sm">
                <Image
                  src={family}
                  alt="Students learning together"
                  className="w-full h-full object-cover"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Courses Section */}
        <div id="featured-courses" className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured LIVE Courses
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start your journey with our most popular professional courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
            
            {/* View All Card */}
            <div className="relative group">
              <div 
                className="h-full bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 dark:border-gray-700/50 p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/10 dark:hover:bg-gray-800/80"
                role="link"
                tabIndex={0}
              >
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                    <ArrowRight size={24} className="text-white" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Explore All Courses
                </h3>
                <p className="text-gray-400 mb-6">
                  Discover our full range of professional courses
                </p>
                <Link 
                  href="/courses"
                  className="inline-flex items-center px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  View All
                  <ChevronRight size={18} className="ml-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
