"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import image6 from "@/assets/images/courses/image6.png";
import { 
  Clock, 
  Calendar, 
  Award, 
  BookOpen, 
  Check, 
  ArrowRight, 
  Download, 
  Users,
  Star,
  GraduationCap,
  Timer,
  Tag,
  Sparkles
} from "lucide-react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const router = useRouter();

  const handleImageLoad = () => setIsImageLoaded(true);
  const handleImageError = () => setIsImageError(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "Free";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'usd',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format duration for display
  const formatDuration = (duration) => {
    if (!duration) return "Self-paced";
    const durationLower = duration.toLowerCase();
    
    if (durationLower.includes("week")) {
      const weeks = parseInt(duration);
      return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
    } else if (durationLower.includes("month")) {
      const months = parseInt(duration);
      return `${months} ${months === 1 ? 'Month' : 'Months'}`;
    }
    
    return duration;
  };

  const navigateToCourse = () => {
    if (course?._id) {
      router.push(`/course-details/${course._id}`);
    }
  };

  return (
    <div 
      className="group relative flex flex-col h-full min-h-[580px] w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-transparent hover:border-primary-300/50 dark:hover:border-primary-600/50 transition-all duration-500 ease-out transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? '0 20px 30px -12px rgba(59, 130, 246, 0.15), 0 10px 20px -8px rgba(59, 130, 246, 0.1)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Course Image with Enhanced Gradient Overlay */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        {/* Skeleton loader with shimmer effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer bg-[length:200%_100%] ${
            isImageLoaded ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        />
        
        <Image
          src={!isImageError ? (course?.course_image || image6) : image6}
          alt={course?.course_title || "Course image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-110 blur-[1px]' : 'scale-100'
          } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
          loading="lazy"
        />

        {/* Category Badge with Enhanced Styling */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[80%]">
          {course?.course_category && (
            <span className="bg-gradient-to-r from-primary-500 to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm flex items-center shadow-lg transform transition-transform duration-300 hover:scale-105">
              <Tag size={14} className="mr-2 animate-pulse shrink-0" />
              <span className="truncate">{course.course_category}</span>
            </span>
          )}
        </div>

        {/* Enhanced Hot Badge */}
        {course?.is_popular && (
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm flex items-center shadow-lg">
              <Sparkles size={14} className="mr-2 animate-twinkle" />
              Trending
            </span>
          </div>
        )}
      </div>

      {/* Course Content with Enhanced Visual Hierarchy */}
      <div className="flex flex-col flex-grow p-6 space-y-6">
        {/* Title and Rating with Enhanced Interaction */}
        <div>
          <h3 
            className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem] cursor-pointer transition-all duration-300 ease-out hover:text-primary-600 dark:hover:text-primary-400"
            onClick={navigateToCourse}
            style={{
              background: isHovered ? 'linear-gradient(to right, #3B82F6, #6366F1)' : '',
              WebkitBackgroundClip: isHovered ? 'text' : '',
              WebkitTextFillColor: isHovered ? 'transparent' : ''
            }}
          >
            {course?.course_title || "Course Title"}
          </h3>
          
          <div className="flex items-center justify-between">
            {course?.rating && (
              <div className="flex items-center group/rating">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(course.rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      } transition-all duration-300 ${
                        isHovered ? 'animate-starPulse' : ''
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 group-hover/rating:text-yellow-500">
                  {course.rating} ({course.reviews || 0} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Course Brief Info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl transition-transform duration-300 hover:scale-105">
            <Timer size={18} className="text-primary-500 mb-1.5 transition-all duration-300 group-hover:rotate-12" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Duration</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{formatDuration(course?.course_duration)}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md">
            <BookOpen 
              size={18} 
              className="text-emerald-500 dark:text-emerald-400 mb-1.5 transition-all duration-300 group-hover:rotate-12" 
            />
            <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Sessions</span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 text-center">
              {course?.no_of_Sessions || 0}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl transition-all duration-300 hover:scale-105">
            <GraduationCap 
              size={18} 
              className="text-violet-500 dark:text-violet-400 mb-1.5 transition-all duration-300 group-hover:rotate-12" 
            />
            <span className="text-xs text-violet-600/70 dark:text-violet-400/70">Grade</span>
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300 text-center line-clamp-1">
              {course?.course_grade || "All Levels"}
            </span>
          </div>
        </div>

        {/* Enhanced Price Section */}
        <div className="flex justify-end items-center">
          {course?.course_fee !== undefined && (
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {formatPrice(course.course_fee)}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Key Features */}
        <div className="space-y-2.5">
          {[
            { icon: Users, text: "Expert-led sessions", color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: Award, text: "Industry certification", color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
            { icon: Calendar, text: "Flexible schedule", color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-900/20" }
          ].map(({ icon: Icon, text, color, bgColor }, index) => (
            <div key={index} className="flex items-center gap-2.5 text-sm group/feature">
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${bgColor} transition-all duration-300 group-hover/feature:scale-110`}>
                <Icon size={14} className={`${color} transition-transform duration-300 group-hover/feature:rotate-12`} />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={openModal}
            className="group/brochure relative overflow-hidden flex items-center justify-center px-4 py-2.5 text-sm font-medium text-primary-700 hover:text-white bg-primary-50 hover:bg-primary-600 rounded-xl transition-all duration-300 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:text-white dark:hover:bg-primary-700"
          >
            <Download size={16} className="mr-2 transition-transform duration-300 group-hover/brochure:-translate-y-1" />
            Brochure
          </button>
          
          <button
            onClick={navigateToCourse}
            className="relative overflow-hidden flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-500 bg-[length:200%_auto] hover:bg-right rounded-xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg"
          >
            View Course
            <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Download Brochure Modal */}
      <DownloadBrochureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={course?.course_title}
      />
    </div>
  );
};

export default CourseCard;