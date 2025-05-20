"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Calendar, Clock, User, ExternalLink, BookOpen, Tag, EyeIcon, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface IBlogCardProps {
  blog?: {
    _id?: string;
    title?: string;
    featured_image?: string;
    author?: string | { name?: string; email?: string; };
    createdAt?: string;
    readTime?: string;
    category?: string;
    tags?: string[];
    excerpt?: string;
  };
  imageSrc?: string;
  title?: string;
  id?: string;
  buttonText?: string;
  author?: string;
  date?: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
}

const BlogCard: React.FC<IBlogCardProps> = ({ 
  blog = {},
  imageSrc, 
  title, 
  id, 
  buttonText = "Read More",
  author = "Medh Team",
  date = "Recently Published",
  readTime = "5 min read",
  category = "Blog",
  tags = [],
  excerpt
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isImageError, setIsImageError] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Get actual props from blog object if available
  const blogId = blog._id || id;
  const blogTitle = blog.title || title;
  const blogImage = blog.featured_image || imageSrc || "/images/blog/blog_1.png";
  const blogAuthor = typeof blog.author === 'object' ? blog.author.name : (blog.author || author);
  const blogDate = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : date;
  const blogReadTime = blog.readTime || readTime;
  const blogCategory = blog.category || category;
  const blogTags = blog.tags || tags;
  const blogExcerpt = blog.excerpt || excerpt || "Discover valuable insights in this article...";
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };
  
  const handleImageLoad = () => setIsImageLoaded(true);
  const handleImageError = () => setIsImageError(true);
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, blogId?: string) => {
    try {
      // Only trigger this on mobile and not when clicking the button, link, or other interactive elements
      if (isMobile && 
          !e.target.closest('button') && 
          !e.target.closest('a') && 
          !e.target.closest('input') &&
          !e.target.closest('[role="button"]') &&
          blogId) {
        e.preventDefault();
        router.push(`/blogs/${blogId}`);
      }
    } catch (error) {
      console.error('Error navigating to blog:', error);
      // Fallback to regular link navigation
      if (blogId) {
        window.location.href = `/blogs/${blogId}`;
      }
    }
  };
  
  // Add error boundary for the entire component
  if (!blog) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <p className="text-gray-500 dark:text-gray-400">Blog post not available</p>
      </div>
    );
  }
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group relative ${isMobile ? 'active:scale-[0.98]' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => handleCardClick(e, blogId)}
    >
      {/* Image container with overlay effect */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 ${isHovered ? 'opacity-70' : 'opacity-30'} group-hover:opacity-60 transition-opacity duration-300`}></div>
        
        {/* Skeleton loader */}
        {!isImageLoaded && !isImageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        )}
        
        <Image
          src={blogImage}
          alt={blogTitle || "Blog image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          quality={80}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Category tag */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-block bg-primary-500/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {blogCategory}
          </span>
        </div>
        
        {/* Read time badge */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="inline-flex items-center bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <Clock size={12} className="mr-1" />
            {blogReadTime}
          </span>
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <User size={14} className="text-primary-500" />
            <span className="font-medium">{blogAuthor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-primary-500" />
            <span>{blogDate}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 flex-grow group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {blogTitle}
        </h3>
        
        {/* Excerpt - show only on hover for desktop or always for mobile */}
        <div className={`mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 transition-opacity duration-300 ${isMobile ? 'block' : (isHovered ? 'opacity-100' : 'opacity-0 h-0 mb-0')}`}>
          {blogExcerpt}
        </div>
        
        {/* Tags - show on hover */}
        {blogTags && blogTags.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-3 transition-opacity duration-300 ${isMobile ? 'block' : (isHovered ? 'opacity-100' : 'opacity-0 h-0 mb-0')}`}>
            {blogTags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Read More Button */}
        <Link 
          href={`/blogs/${blogId}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors"
        >
          {buttonText}
          <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      {/* View more button for mobile - only visible on mobile */}
      {isMobile && (
        <div className="absolute bottom-3 right-3 z-20">
          <Link
            href={`/blogs/${blogId}`}
            className="flex items-center justify-center p-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-medium rounded-full shadow-md"
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogCard; 