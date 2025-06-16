"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Briefcase,
  CheckCircle,
  Star,
  Calendar,
  DollarSign,
  Globe,
  ChevronRight,
  Brain,
  BarChart3,
  Code,
  Database,
  Zap,
  Shield
} from "lucide-react";
import { courseTypesAPI, TNewCourse, ILegacyCourse } from "@/apis/courses";
import { usePlacementForm } from "@/context/PlacementFormContext";

interface ICourseCardProps {
  course: TNewCourse | ILegacyCourse;
  isLoading?: boolean;
}

interface IFeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PlacementCourseDetails: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<(TNewCourse | ILegacyCourse)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openForm } = usePlacementForm();

  const isDark = mounted ? theme === 'dark' : true;

  useEffect(() => {
    setMounted(true);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await courseTypesAPI.advancedSearch({
        search: "AI Data Science Digital Marketing",
        course_category: "Data Science,Digital Marketing",
        status: "Published",
        limit: 10,
        source: "both",
        merge_strategy: "unified"
      });

      if (response.status === 'success' && response.data?.data) {
        const coursesData = Array.isArray(response.data.data) ? response.data.data : [];
        const filteredCourses = coursesData.filter((course: TNewCourse | ILegacyCourse) => {
          const title = course.course_title?.toLowerCase() || '';
          return (
            title.includes('ai') || 
            title.includes('data science') || 
            title.includes('digital marketing') ||
            title.includes('data analytics')
          );
        });

        setCourses(filteredCourses.slice(0, 2));
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load course details');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const CourseCard: React.FC<ICourseCardProps> = ({ course, isLoading = false }) => {
    if (isLoading) {
      return (
        <div className={`glass-container rounded-2xl p-6 md:p-8 animate-pulse ${isDark ? 'bg-gray-800/20' : 'bg-white/20'}`}>
          <div className="space-y-4">
            <div className={`h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
            <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
            <div className={`h-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
          </div>
        </div>
      );
    }

    const isNewCourse = 'course_type' in course;
    const courseTitle = course.course_title || 'Course Title';
    const courseDescription = typeof course.course_description === 'string' 
      ? course.course_description 
      : course.course_description?.program_overview || 'Course description not available';
    
    const courseDuration = isNewCourse 
      ? ((course as any).course_duration || (course as any).estimated_duration || '18 months')
      : (course as ILegacyCourse).course_duration || '18 months';
    
    const courseLevel = isNewCourse 
      ? (course as TNewCourse).course_level || 'All Levels'
      : (course as ILegacyCourse).course_level || 'All Levels';

    const coursePrice = isNewCourse 
      ? (course as TNewCourse).prices?.[0]?.individual || 0
      : (course as ILegacyCourse).prices?.[0]?.individual || 0;

    const isAICourse = courseTitle.toLowerCase().includes('ai') || courseTitle.toLowerCase().includes('data science');
    const courseIcon = isAICourse ? <Brain className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />;
    const courseColor = isAICourse ? 'from-blue-500 to-purple-500' : 'from-green-500 to-emerald-500';

    const features: IFeatureItem[] = [
      {
        icon: <Award className="w-4 h-4" />,
        title: "Industry Certification",
        description: "Get certified by leading industry partners"
      },
      {
        icon: <Briefcase className="w-4 h-4" />,
        title: "100% Job Guarantee",
        description: "Guaranteed placement or money back"
      },
      {
        icon: <Users className="w-4 h-4" />,
        title: "Live Interactive Sessions",
        description: "Learn from industry experts in real-time"
      },
      {
        icon: <Target className="w-4 h-4" />,
        title: "3 Months Internship",
        description: "Hands-on corporate experience included"
      }
    ];

    return (
      <div className={`glass-container rounded-2xl p-6 md:p-8 hover:scale-105 transition-all duration-300 group ${isDark ? 'hover:bg-white/10' : 'hover:bg-white/30'}`}>
        {/* Course Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${courseColor} text-white`}>
              {courseIcon}
            </div>
            <div>
              <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${courseColor} group-hover:bg-clip-text transition-all duration-300`}>
                {courseTitle}
              </h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {courseDuration}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'}`}>
                  <Star className="w-3 h-3 mr-1" />
                  {courseLevel}
                </span>
              </div>
            </div>
          </div>
          {coursePrice > 0 && (
            <div className={`text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <div className="text-sm opacity-70">Starting from</div>
              <div className="text-lg font-bold">₹{coursePrice.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Course Description */}
        <p className={`text-sm md:text-base leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {courseDescription.length > 200 ? `${courseDescription.substring(0, 200)}...` : courseDescription}
        </p>

        {/* Course Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'} text-${courseColor.split('-')[1]}-500`}>
                {feature.icon}
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h4>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={openForm}
          className={`w-full inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 group/btn ${
            isDark 
              ? `bg-gradient-to-r ${courseColor} text-white hover:shadow-lg hover:shadow-${courseColor.split('-')[1]}-500/30` 
              : `bg-gradient-to-r ${courseColor} text-white hover:shadow-lg hover:shadow-${courseColor.split('-')[1]}-500/30`
          }`}
        >
          <span className="font-bold">Enroll Now - 100% Job Guaranteed</span>
          <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 md:py-24 ${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mr-3`}>
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Empower Your Career Ambitions with
            </h2>
          </div>
          <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${isDark ? 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text' : 'text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text'}`}>
            Medh 18-Month Job Assurance Programs
          </h3>
          <p className={`text-lg md:text-xl leading-relaxed max-w-4xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            At Medh, we empower individuals through education, offering <span className="font-semibold text-green-500">100% Job Guaranteed Courses</span> designed to provide in-depth skills with our comprehensive 18-month live interactive programs including 3 months of corporate internship.
          </p>
        </div>

        {/* Course Cards */}
        {error ? (
          <div className={`text-center py-12 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            <p className="text-lg mb-4">{error}</p>
            <button 
              onClick={fetchCourses}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {isLoading ? (
              <>
                <CourseCard course={{} as any} isLoading={true} />
                <CourseCard course={{} as any} isLoading={true} />
              </>
            ) : courses.length > 0 ? (
              courses.map((course, index) => (
                <CourseCard key={course._id || index} course={course} />
              ))
            ) : (
              // Fallback content when no courses are found
              <>
                <div className={`glass-container rounded-2xl p-6 md:p-8 hover:scale-105 transition-all duration-300 group ${isDark ? 'hover:bg-white/10' : 'hover:bg-white/30'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          AI and Data Science
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                            <Clock className="w-3 h-3 mr-1" />
                            18 months
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'}`}>
                            <Star className="w-3 h-3 mr-1" />
                            All Levels
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm md:text-base leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Master the future of technology with our comprehensive AI and Data Science program. Learn machine learning, deep learning, data analysis, and AI implementation with hands-on projects and industry mentorship.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: <Award className="w-4 h-4" />, title: "Industry Certification", description: "Get certified by leading industry partners" },
                      { icon: <Briefcase className="w-4 h-4" />, title: "100% Job Guarantee", description: "Guaranteed placement or money back" },
                      { icon: <Users className="w-4 h-4" />, title: "Live Interactive Sessions", description: "Learn from industry experts in real-time" },
                      { icon: <Target className="w-4 h-4" />, title: "3 Months Internship", description: "Hands-on corporate experience included" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'} text-blue-500`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {feature.title}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={openForm}
                    className="w-full inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 group/btn bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <span className="font-bold">Enroll Now - 100% Job Guaranteed</span>
                    <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className={`glass-container rounded-2xl p-6 md:p-8 hover:scale-105 transition-all duration-300 group ${isDark ? 'hover:bg-white/10' : 'hover:bg-white/30'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Digital Marketing and Data Analytics
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                            <Clock className="w-3 h-3 mr-1" />
                            18 months
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'}`}>
                            <Star className="w-3 h-3 mr-1" />
                            All Levels
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm md:text-base leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Become a digital marketing expert with data-driven insights. Master SEO, SEM, social media marketing, content strategy, and analytics to drive business growth in the digital age.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: <Award className="w-4 h-4" />, title: "Industry Certification", description: "Get certified by leading industry partners" },
                      { icon: <Briefcase className="w-4 h-4" />, title: "100% Job Guarantee", description: "Guaranteed placement or money back" },
                      { icon: <Users className="w-4 h-4" />, title: "Live Interactive Sessions", description: "Learn from industry experts in real-time" },
                      { icon: <Target className="w-4 h-4" />, title: "3 Months Internship", description: "Hands-on corporate experience included" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'} text-green-500`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {feature.title}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={openForm}
                    className="w-full inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 group/btn bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30"
                  >
                    <span className="font-bold">Enroll Now - 100% Job Guaranteed</span>
                    <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className={`glass-container rounded-2xl p-8 md:p-12 ${isDark ? 'bg-white/5' : 'bg-white/20'}`}>
            <div className="flex items-center justify-center mb-6">
              <Shield className={`w-8 h-8 mr-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Why Choose Medh Job Assurance Programs?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4`}>
                  <Briefcase className="w-8 h-8" />
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  100% Job Guarantee
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  We guarantee job placement or provide a full refund
                </p>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4`}>
                  <Users className="w-8 h-8" />
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Industry Experts
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Learn from professionals with 10+ years of experience
                </p>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4`}>
                  <Target className="w-8 h-8" />
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Corporate Internship
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  3 months of hands-on experience with our partner companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementCourseDetails; 