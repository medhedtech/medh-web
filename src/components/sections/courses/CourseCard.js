"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import image6 from "@/assets/images/courses/image6.png";
import { 
  Clock, 
  Calendar, 
  Award, 
  BookOpen, 
  Download, 
  Users,
  Star,
  GraduationCap,
  Timer,
  Tag,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const CourseCard = ({ 
  course, 
  onShowRelated,
  showRelatedButton 
}) => {
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
      window.open(`/course-details/${course._id}`, '_blank');
    }
  };

  // Determine enrollment status label
  const getEnrollmentStatus = () => {
    if (course?.enrolled_students > 100) return "High demand";
    if (course?.is_new) return "New course";
    return course?.enrollment_status || null;
  };

  const enrollmentStatus = getEnrollmentStatus();

  return (
    <div 
      className="group relative flex flex-col h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image section with improved loading state */}
      <div className="relative w-full aspect-video overflow-hidden">
        {/* Skeleton loader */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse ${
            isImageLoaded ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        />
        
        <Image
          src={!isImageError ? (course?.course_image || image6) : image6}
          alt={course?.course_title || "Course image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          {course?.course_category && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-primary-700 dark:text-primary-400 backdrop-blur-sm shadow-sm">
              <Tag size={12} className="mr-1.5 text-primary-500" />
              {course.course_category}
            </span>
          )}
        </div>

        {/* Trending badge */}
        {course?.is_popular && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500 text-white shadow-sm">
              <Sparkles size={12} className="mr-1.5" />
              Trending
            </span>
          </div>
        )}

        {/* Price tag - moved to overlay */}
        <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {course?.course_fee !== undefined && (
            <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(course.course_fee)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col flex-grow p-5">
        {/* Title and rating */}
        <div className="mb-4">
          <h3 
            className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={navigateToCourse}
          >
            {course?.course_title || "Course Title"}
          </h3>
          
          <div className="flex items-center justify-between">
            {course?.rating && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`sm:w-3.5 sm:h-3.5 ${
                        i < Math.floor(course.rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  {course.rating} ({course.reviews || 0})
                </span>
              </div>
            )}
            
            {/* Enrollment status */}
            {enrollmentStatus && (
              <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate max-w-[100px] sm:max-w-[150px]">
                {enrollmentStatus}
              </span>
            )}
          </div>
        </div>

        {/* Course details */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4">
          <div className="flex flex-col items-center p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Timer size={14} className="text-primary-500 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Duration</span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-800 dark:text-gray-300 truncate w-full text-center px-1">{formatDuration(course?.course_duration)}</span>
          </div>
          
          <div className="flex flex-col items-center p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <BookOpen size={14} className="text-emerald-500 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Sessions</span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-800 dark:text-gray-300 truncate w-full text-center px-1">
              {course?.no_of_Sessions || "N/A"}
            </span>
          </div>

          <div className="flex flex-col items-center p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <GraduationCap size={14} className="text-violet-500 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Level</span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-800 dark:text-gray-300 truncate w-full text-center px-1">
              {course?.course_grade || "All Levels"}
            </span>
          </div>
        </div>

        {/* Course features */}
        <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
          {[
            { icon: Users, text: "Expert-led instruction", color: "text-blue-500" },
            { icon: Award, text: "Industry certification", color: "text-amber-500" },
            { icon: Calendar, text: "Flexible scheduling", color: "text-emerald-500" }
          ].map(({ icon: Icon, text, color }, index) => (
            <div key={index} className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 dark:bg-gray-800 ${color}`}>
                <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300">{text}</span>
            </div>
          ))}
        </div>

        {/* Price section */}
        <div className="mt-auto flex items-center justify-between mb-3 sm:mb-4">
          {course?.course_fee !== undefined && (
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(course.course_fee)}
              </span>
              {course?.original_fee && course.original_fee > course.course_fee && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {formatPrice(course.original_fee)}
                </span>
              )}
            </div>
          )}
          
          {/* Show student count if available */}
          {course?.enrolled_students && (
            <div className="flex items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <Users size={12} className="mr-1 sm:mr-1.5" />
              {course.enrolled_students}+ enrolled
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-5 mt-auto">
        <div className={`grid ${showRelatedButton ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {showRelatedButton ? (
            <button
              onClick={onShowRelated}
              className="w-full px-5 py-2.5 bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles size={16} />
              Show Related Courses
            </button>
          ) : (
            <>
              <button
                onClick={openModal}
                className="px-5 py-2.5 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Brochure
              </button>
              <button
                onClick={navigateToCourse}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Details
                <ArrowUpRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Download brochure modal */}
      <DownloadBrochureModal
        title={course?.course_title || "Course Brochure"}
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={course?.course_title}
        courseId={course?._id}
      />
    </div>
  );
};

CourseCard.defaultProps = {
  onShowRelated: () => {},
  showRelatedButton: false
};

export default CourseCard;