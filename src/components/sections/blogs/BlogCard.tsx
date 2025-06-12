"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Calendar, Clock, User, ExternalLink, BookOpen, Tag, EyeIcon, Heart, ChevronRight, Sparkles, Share } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

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

// Theme-aware glassmorphism styles (matching improved Blogs.tsx)
const getThemeStyles = (isDark: boolean) => `
  @keyframes shimmer-card {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes glow-pulse {
    0%, 100% { box-shadow: ${isDark 
      ? '0 0 20px rgba(59, 172, 99, 0.3)' 
      : '0 0 20px rgba(59, 172, 99, 0.2)'}; }
    50% { box-shadow: ${isDark 
      ? '0 0 30px rgba(59, 172, 99, 0.4)' 
      : '0 0 30px rgba(59, 172, 99, 0.3)'}; }
  }
  
  .blog-card-glass {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.15)' 
      : 'rgba(255, 255, 255, 0.25)'};
    backdrop-filter: blur(20px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.4)'};
    border-radius: 1.5rem;
    box-shadow: 
      ${isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(0, 0, 0, 0.1)' 
        : '0 8px 32px rgba(0, 0, 0, 0.1), 0 16px 64px rgba(0, 0, 0, 0.02)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.6)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(255, 255, 255, 0.2)'};
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .blog-card-glass::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  
  .blog-card-glass:hover {
    transform: translateY(-8px) scale(1.02);
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.25)' 
      : 'rgba(255, 255, 255, 0.35)'};
    border-color: ${isDark 
      ? 'rgba(59, 172, 99, 0.3)' 
      : 'rgba(59, 172, 99, 0.5)'};
    box-shadow: 
      ${isDark 
        ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 30px 120px rgba(0, 0, 0, 0.15)' 
        : '0 20px 60px rgba(0, 0, 0, 0.15), 0 30px 120px rgba(0, 0, 0, 0.05)'},
      ${isDark 
        ? '0 0 40px rgba(59, 172, 99, 0.3)' 
        : '0 0 40px rgba(59, 172, 99, 0.2)'};
  }
  
  .blog-card-shimmer {
    background: linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)'}, transparent);
    background-size: 200% 100%;
    animation: shimmer-card 2s infinite;
  }
  
  .blog-card-badge {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.6)' 
      : 'rgba(255, 255, 255, 0.9)'};
    backdrop-filter: blur(12px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(255, 255, 255, 0.5)'};
    border-radius: 2rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
        : '0 4px 16px rgba(0, 0, 0, 0.08)'};
  }
  
  .blog-card-content {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.4)' 
      : 'rgba(255, 255, 255, 0.5)'};
    backdrop-filter: blur(15px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(255, 255, 255, 0.3)'};
    border-radius: 1.25rem;
  }
  
  .blog-text-shadow {
    text-shadow: ${isDark 
      ? '1px 1px 3px rgba(0, 0, 0, 0.8)' 
      : '0.5px 0.5px 2px rgba(0, 0, 0, 0.3)'};
  }
  
  .blog-tag-glass {
    background: ${isDark 
      ? 'rgba(59, 172, 99, 0.2)' 
      : 'rgba(59, 172, 99, 0.15)'};
    backdrop-filter: blur(8px);
    border: 1px solid ${isDark 
      ? 'rgba(59, 172, 99, 0.3)' 
      : 'rgba(59, 172, 99, 0.4)'};
    color: ${isDark ? '#34d399' : '#059669'};
  }
  
  .blog-cta-button {
    background: ${isDark 
      ? 'linear-gradient(135deg, rgba(59, 172, 99, 0.8), rgba(34, 197, 94, 0.8))' 
      : 'linear-gradient(135deg, rgba(59, 172, 99, 0.9), rgba(34, 197, 94, 0.9))'};
    backdrop-filter: blur(10px);
    border: 1px solid ${isDark 
      ? 'rgba(59, 172, 99, 0.4)' 
      : 'rgba(59, 172, 99, 0.6)'};
    box-shadow: 
      ${isDark 
        ? '0 4px 16px rgba(59, 172, 99, 0.3)' 
        : '0 4px 16px rgba(59, 172, 99, 0.2)'};
  }
  
  .blog-cta-button:hover {
    background: ${isDark 
      ? 'linear-gradient(135deg, rgba(59, 172, 99, 1), rgba(34, 197, 94, 1))' 
      : 'linear-gradient(135deg, rgba(59, 172, 99, 1), rgba(34, 197, 94, 1))'};
    box-shadow: 
      ${isDark 
        ? '0 6px 24px rgba(59, 172, 99, 0.4), 0 0 30px rgba(59, 172, 99, 0.3)' 
        : '0 6px 24px rgba(59, 172, 99, 0.3), 0 0 30px rgba(59, 172, 99, 0.2)'};
  }
`;

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
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isImageError, setIsImageError] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isDark = mounted ? theme === 'dark' : true; // Default to dark during SSR
  
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
  
  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Inject theme-aware styles
  useEffect(() => {
    if (!mounted) return;
    
    const existingStyle = document.getElementById(`blog-card-theme-styles-${blogId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = `blog-card-theme-styles-${blogId}`;
    styleSheet.innerText = getThemeStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById(`blog-card-theme-styles-${blogId}`);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark, blogId]);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
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
      const target = e.target as HTMLElement;
      if (isMobile && 
          !target.closest('button') && 
          !target.closest('a') && 
          !target.closest('input') &&
          !target.closest('[role="button"]') &&
          blogId) {
        e.preventDefault();
        router.push(`/blogs/${blogId}`);
      }
    } catch (error) {
      console.error('Error navigating to blog:', error);
      if (blogId) {
        window.location.href = `/blogs/${blogId}`;
      }
    }
  };
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: blogTitle,
        text: blogExcerpt,
        url: `/blogs/${blogId}`,
      });
    }
  };
  
  // Error boundary
  if (!blog && !title) {
    return (
      <div className="blog-card-glass p-6 h-[350px] flex items-center justify-center">
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
          Blog post not available
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      ref={cardRef}
      className={`blog-card-glass h-[450px] md:h-[480px] flex flex-col group relative overflow-hidden ${isMobile ? 'active:scale-[0.98]' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => handleCardClick(e, blogId)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 blog-card-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Enhanced Image container */}
      <div className="relative overflow-hidden rounded-t-3xl h-[220px]">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${
          isDark 
            ? 'from-slate-900/80 via-slate-900/30 to-transparent' 
            : 'from-black/60 via-black/20 to-transparent'
        } z-10 transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-40'}`}></div>
        
        {/* Loading skeleton */}
        {!isImageLoaded && !isImageError && (
          <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        )}
        
        {/* Main image */}
        <Image
          src={blogImage}
          alt={blogTitle || "Blog image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover object-center transform group-hover:scale-110 transition-all duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          quality={85}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Enhanced badges and interactions */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="blog-card-badge px-3 py-1.5"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className={isDark ? 'text-primary-400' : 'text-primary-600'} />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'} blog-text-shadow`}>
                {blogCategory}
              </span>
            </div>
          </motion.div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLikeClick}
              className={`blog-card-badge w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                isLiked ? 'text-red-500' : isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-current' : ''} />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShareClick}
              className={`blog-card-badge w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Share size={14} />
            </motion.button>
          </div>
        </div>
        
        {/* Read time badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 z-20"
        >
          <div className="blog-card-badge px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className={isDark ? 'text-primary-400' : 'text-primary-600'} />
              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'} blog-text-shadow`}>
                {blogReadTime}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Content area */}
      <div className="blog-card-content p-6 flex flex-col flex-grow m-1 rounded-b-3xl">
        {/* Meta information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`flex items-center gap-4 text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-1.5">
            <User size={14} className={isDark ? 'text-primary-400' : 'text-primary-600'} />
            <span className="font-semibold blog-text-shadow">{blogAuthor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className={isDark ? 'text-primary-400' : 'text-primary-600'} />
            <span className="blog-text-shadow">{blogDate}</span>
          </div>
        </motion.div>
        
        {/* Enhanced Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`text-xl font-bold mb-4 line-clamp-2 flex-grow transition-colors duration-300 ${
            isDark 
              ? 'text-white group-hover:text-primary-300' 
              : 'text-gray-900 group-hover:text-primary-600'
          } blog-text-shadow leading-tight`}
        >
          {blogTitle}
        </motion.h3>
        
        {/* Enhanced Excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`mb-4 text-sm line-clamp-2 transition-all duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } blog-text-shadow leading-relaxed`}
        >
          {blogExcerpt}
        </motion.div>
        
        {/* Enhanced Tags */}
        {blogTags && blogTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {blogTags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                className="blog-tag-glass text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-300"
              >
                #{tag}
              </motion.span>
            ))}
          </motion.div>
        )}
        
        {/* Enhanced CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-auto"
        >
          <Link href={`/blogs/${blogId}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="blog-cta-button w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              
              <BookOpen size={16} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
              <span className="relative z-10 blog-text-shadow">{buttonText}</span>
              <ChevronRight size={16} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      {/* Enhanced Mobile floating button */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-4 right-4 z-20"
        >
          <Link href={`/blogs/${blogId}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="blog-cta-button w-12 h-12 rounded-full flex items-center justify-center shadow-lg group/fab"
            >
              <ArrowRight size={18} className="text-white group-hover/fab:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BlogCard; 