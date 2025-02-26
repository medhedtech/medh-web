"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import image6 from "@/assets/images/courses/image6.png";
import { Clock, Calendar, Award, BookOpen, Check, ArrowRight, Download, ExternalLink, Star } from "lucide-react";

// API imports if needed
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const router = useRouter();
  
  // Optional: If you have a getQuery hook
  const { getQuery } = useGetQuery ? useGetQuery() : { getQuery: null };

  // Image loading handlers
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  // Fetch course details when the component mounts
  useEffect(() => {
    if (course?._id && getQuery) {
      fetchCourseDetails(course._id);
    }
  }, [course?._id]);

  const fetchCourseDetails = async (id) => {
    try {
      if (getQuery) {
        await getQuery({
          url: `${apiUrls?.courses?.getCourseById}/${id}`,
          onSuccess: (data) => setCourseDetails(data),
          onFail: (err) => console.error("Error fetching course details:", err),
        });
      }
    } catch (error) {
      console.error("Error in fetching course details:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Format course duration for display
  const formatDuration = (duration) => {
    if (!duration) return "Self-paced";
    
    if (duration.toLowerCase().includes("week")) {
      return `${duration} (Course)`;
    } else if (duration.toLowerCase().includes("month")) {
      return `${duration} (Program)`;
    }
    
    return duration;
  };

  // Handle click to navigate to course details
  const navigateToCourse = () => {
    if (course?._id) {
      router.push(`/course-detailed/${course?._id}`);
    }
  };

  return (
    <div 
      className="group h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Course Image Section */}
      <div className="relative w-full aspect-video overflow-hidden">
        {/* Image skeleton loader */}
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
        
        {/* Main image with loading optimization */}
        <Image
          src={!isImageError ? (course?.course_image || image6) : image6}
          alt={course?.course_title || "Course image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
          loading="lazy"
        />
        
        {/* Category tag */}
        {course?.course_category && (
          <div className="absolute top-3 left-3 bg-primary-500/80 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
            {course.course_category}
          </div>
        )}
        
        {/* Duration tag */}
        {course?.course_duration && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center">
            <Clock size={12} className="mr-1" />
            {formatDuration(course.course_duration)}
          </div>
        )}
      </div>
      
      {/* Course Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {course?.course_title || "Course Title"}
        </h3>
        
        {course?.rating && (
          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {course.rating}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {course?.course_short_desc || "Master in-demand skills with our expert-led professional course."}
        </p>
        
        {/* Course highlights */}
        <div className="space-y-2 mb-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-start">
              <Check size={16} className="text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                {index === 0 && "Expert-led live sessions"}
                {index === 1 && "Hands-on projects & assignments"}
                {index === 2 && "Industry-recognized certification"}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex space-x-2 mt-auto">
        <button
          onClick={openModal}
          className="flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
        >
          <Download size={16} className="mr-1" />
          Brochure
        </button>
        
        <button
          onClick={navigateToCourse}
          className="flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
        >
          View Details
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
      
      {/* Modal for downloading brochure */}
      <DownloadBrochureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={course?.course_title}
      />
    </div>
  );
};

export default CourseCard;
