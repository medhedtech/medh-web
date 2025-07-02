"use client";
import React, { useState, useEffect } from "react";
import FilterCourseCard from "../courses/FilterCourseCard";
import Link from "next/link";
import { 
  BarChart2, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Users, 
  Award,
  ChevronRight,
  Search,
  Filter,
  Zap,
  Rocket,
  Star,
  CheckCircle,
  Clock,
  Play,
  BookOpen,
  ArrowRight,
  Brain,
  Heart,
  Briefcase
} from "lucide-react";
import Image from "next/image";
import MedhLogo from "@/assets/images/logo/medh.png";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import { 
  buildAdvancedComponent, 
  getResponsive, 
  getAnimations, 
  backgroundPatterns,
  getEnhancedSemanticColor 
} from "@/utils/designSystem";

const DigiMarketingCourse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load courses and filter for Digital Marketing category
  useEffect(() => {
    const fetchDigitalMarketingCourses = async () => {
      try {
        // Use the API to fetch Digital Marketing courses
        const apiUrl = getAllCoursesWithLimits({
          course_category: "Digital Marketing with Data Analytics",
          status: "Published",
          page: 1,
          limit: 50,
          sort_by: "createdAt",
          sort_order: "desc"
        });

        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.success && data.data && data.data.courses) {
          const allApiCourses = data.data.courses;
          const digitalMarketingCourses = allApiCourses.filter((course: any) => 
            course.course_category === "Digital Marketing with Data Analytics" || 
            course.course_title?.toLowerCase().includes("digital marketing") ||
            course.course_title?.toLowerCase().includes("marketing") ||
            course.course_title?.toLowerCase().includes("analytics") ||
            course.course_tag?.toLowerCase().includes("marketing") ||
            course.course_tag?.toLowerCase().includes("digital")
          );
          
          setAllCourses(digitalMarketingCourses);
          setFilteredCourses(digitalMarketingCourses);
        } else {
          console.warn("No courses found in API response");
          setAllCourses([]);
          setFilteredCourses([]);
        }
      } catch (error) {
        console.error("Error fetching Digital Marketing courses:", error);
        setAllCourses([]);
        setFilteredCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDigitalMarketingCourses();
  }, []);

  // Search functionality with API integration
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim() === "") {
        setFilteredCourses(allCourses);
      } else {
        try {
          const apiUrl = getAllCoursesWithLimits({
            search: searchTerm,
            course_category: "Digital Marketing with Data Analytics",
            status: "Published",
            page: 1,
            limit: 30,
            sort_by: "createdAt",
            sort_order: "desc"
          });

          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (data.success && data.data && data.data.courses) {
            const digitalMarketingCourses = data.data.courses.filter((course: any) => 
              course.course_category === "Digital Marketing with Data Analytics" || 
              course.course_title?.toLowerCase().includes("digital marketing") ||
              course.course_title?.toLowerCase().includes("marketing") ||
              course.course_title?.toLowerCase().includes("analytics")
            );
            setFilteredCourses(digitalMarketingCourses);
          } else {
            const filtered = allCourses.filter((course: any) =>
              course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.program_overview?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.course_subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.course_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.course_tag?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCourses(filtered);
          }
        } catch (error) {
          console.error("Search API error:", error);
          const filtered = allCourses.filter((course: any) =>
            course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.program_overview?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.course_subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.course_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.course_tag?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredCourses(filtered);
        }
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, allCourses]);

  // Enhanced header with psychological appeal and real data
  const customHeader = (
    <div className="relative w-full overflow-hidden">
      {/* Dynamic background with floating blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-emerald-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className={backgroundPatterns.floatingBlobs.blob1} />
        <div className={backgroundPatterns.floatingBlobs.blob2} />
        <div className={backgroundPatterns.floatingBlobs.blob3} />
      </div>

      {/* Enhanced hero content */}
      <div className="relative z-10 w-full px-0 py-12 md:py-20">
        {/* Glassmorphic hero card */}
        <div className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'desktop', hover: false })}>
          
          {/* Category badge with animation */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200/30 dark:border-emerald-700/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                🚀 Digital Marketing Excellence
              </span>
            </div>
          </div>

          {/* Simple header */}
          <div className="text-center space-y-6 mb-8">
            <h1 className={`${getResponsive.fluidText('heading')} font-bold text-slate-900 dark:text-white leading-tight`}>
              Digital Marketing with Data Analytics
            </h1>

            {/* Real feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-600/20">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 dark:text-white">Data Analytics</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Real campaign analysis</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-600/20">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 dark:text-white">Campaign Strategy</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Multi-platform expertise</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-600/20">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 dark:text-white">Industry Certification</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Recognized credentials</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real course statistics display */}
          {filteredCourses.length > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200/30 dark:border-emerald-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Available
                  </span>
                </div>
                {filteredCourses.some(course => course.enrolled_students) && (
                  <>
                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {filteredCourses.reduce((total, course) => total + (course.enrolled_students || 0), 0).toLocaleString()} Students Enrolled
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Header */}
      <div className="w-full">
        {customHeader}
      </div>

      {/* Course Discovery Section */}
      <div className="relative w-full px-0 pb-12">
        <div className="w-full">
          {/* Section title with psychological messaging */}
          {filteredCourses.length > 0 && (
            <div className="w-full mb-8">
              <div className={buildAdvancedComponent.glassCard({ variant: 'secondary', padding: 'tablet', hover: false }) + ' w-full'}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    Choose Your Success Path
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Each course is designed with real industry projects and current market demands. 
                  Start your journey to becoming a digital marketing expert.
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Course Grid */}
          <div className="space-y-6 w-full">
            {isLoading ? (
              <div className="grid gap-4 md:gap-6 auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl h-80 shadow-sm border border-slate-200/50 dark:border-slate-700/50"></div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <>
                {/* Course cards with enhanced spacing */}
                <div className={`grid gap-4 md:gap-6 auto-rows-fr w-full ${
                  filteredCourses.length === 1 
                    ? 'grid-cols-1 justify-items-center' 
                    : filteredCourses.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2 justify-items-center' 
                    : filteredCourses.length === 3 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {filteredCourses.map((course, index) => (
                    <div key={course._id || index} className="h-full w-full">
                      <FilterCourseCard
                        course={course}
                        index={index}
                        isLCP={index < 2}
                        coursesPageCompact={true}
                        classType="live_courses"
                        preserveClassType={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Success indicators using real data */}
                <div className="mt-12">
                  <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop', hover: false })}>
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Why Choose Our Digital Marketing Program?</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">Industry-Relevant Curriculum</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Updated with latest trends and tools</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">Expert Instructors</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Learn from industry professionals</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">Career Support</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Job placement assistance included</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center w-full py-12">
                <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop' })}>
                  <div className="flex flex-col items-center justify-center text-center max-w-md">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 mb-6">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      {searchTerm ? "No courses found" : "Exciting Courses Coming Soon"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {searchTerm 
                        ? `No courses match "${searchTerm}". Try different keywords or explore our other categories.`
                        : "We're crafting exceptional Digital Marketing courses with real-world projects and industry partnerships. Be the first to know when they launch!"
                      }
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Heart className="w-4 h-4" />
                      <span>Built with care for your success</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Enhanced CSS for professional animations and effects */}
      <style jsx>{`
        /* Advanced animation keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Enhanced animation classes */
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-blob {
          animation: blob 8s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        /* Staggered animation delays */
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* Hover effects for enhanced interactivity */
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        /* Glassmorphism enhancements */
        .glass-effect {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        /* Professional gradient overlays */
        .gradient-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          pointer-events: none;
        }
        
        /* Responsive text scaling */
        @media (max-width: 640px) {
          .responsive-text-scale {
            font-size: clamp(0.875rem, 4vw, 1.125rem);
          }
        }
      `}</style>
    </div>
  );
};

export default DigiMarketingCourse;
