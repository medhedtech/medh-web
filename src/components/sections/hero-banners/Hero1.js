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
import CourseCard from "@/components/sections/courses/CourseCard";
import { ArrowRight, ChevronRight, GraduationCap, Users, Star, Clock } from "lucide-react";
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
        url: apiUrls?.courses?.getAllCoursesWithLimits(
          1, // page
          3, // limit to 3 courses
          "", // empty string for no specific filter
          "", // empty string for no specific filter
          "", // empty string for no specific filter
          "Published", // status
          "", // search term
          "", // grade
          [] // categories
        ),
        onSuccess: (data) => {
          // Sort by creation date and take the 3 most recent
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
      <section className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-[1920px] w-[92%] xl:w-[90%] mx-auto relative z-10">
          {/* Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20">
            <div className={`space-y-8 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-primary-500/0 rounded-full p-1 pl-2 pr-4 backdrop-blur-sm">
                <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">New</span>
                <span className="text-primary-300 text-sm">Professional Courses Available</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Transform Your Future with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400"> Professional Skills</span>
              </h1>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-primary-400" size={24} />
                    <span className="text-2xl font-bold text-white">20+</span>
                  </div>
                  <p className="text-gray-400 text-sm">Professional Courses</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="text-primary-400" size={24} />
                    <span className="text-2xl font-bold text-white">1000+</span>
                  </div>
                  <p className="text-gray-400 text-sm">Active Students</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="text-primary-400" size={24} />
                    <span className="text-2xl font-bold text-white">4.9</span>
                  </div>
                  <p className="text-gray-400 text-sm">Average Rating</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/courses" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary-500/25">
                  Explore Courses
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <a href="#featured-courses" 
                  className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all backdrop-blur-sm">
                  View Featured
                  <ChevronRight size={18} className="ml-1" />
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className={`relative transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="wavy-oval overflow-hidden rounded-3xl border border-white/10 backdrop-blur-sm">
                  <Image
                    src={family}
                    alt="Hero Image"
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Featured Courses Section - Updated with Real Data */}
          <div id="featured-courses" className="py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </span>
                <span className="text-primary-400 font-medium">Newly Added Courses</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Featured Professional Courses
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Start your journey with our latest and most in-demand professional courses
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

            {/* View All Courses Card - Updated */}
            <div className="mt-16 text-center">
              <Link 
                href="/courses" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-xl shadow-primary-500/25"
              >
                <span className="text-lg">View All Courses</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 text-gray-400">
                Explore our complete catalog of professional courses
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero1;
