"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ArrowRight, Calendar, Clock, User, ExternalLink, BookOpen, Tag, EyeIcon, Heart, ChevronRight, Star, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "next-themes";

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    description?: string; // API uses description instead of excerpt
    excerpt?: string;
    author: {
      _id?: string;
      name?: string;
      email?: string;
    };
    publishedAt?: string;
    createdAt?: string; // API uses createdAt
    category?: string;
    categories?: Array<{
      _id: string;
      category_name: string;
      category_image?: string;
    }> | string[];
    tags?: string[];
    featured_image?: string;
    upload_image?: string; // API uses upload_image
    read_time?: number;
    reading_time?: number; // API uses reading_time
    featured?: boolean;
    views?: number;
    likes?: number;
    blog_link?: string;
    slug?: string;
    status?: string;
    meta_title?: string;
    meta_description?: string;
  };
  className?: string;
}

// Enhanced professional glassmorphic card styles
const getGlassCardStyles = (isDark: boolean) => `
  .professional-card {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.7)' 
      : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.6)'};
    border-radius: 1.5rem;
    box-shadow: 
      ${isDark 
        ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
        : '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'};
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
    transform: translateY(0);
  }
  
  .professional-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      ${isDark ? 'rgba(59, 172, 99, 0.4)' : 'rgba(59, 172, 99, 0.5)'} 20%, 
      ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.5)'} 80%, 
      transparent 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .professional-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    padding: 1px;
    background: linear-gradient(135deg, 
      ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'} 0%,
      transparent 50%,
      ${isDark ? 'rgba(59, 172, 99, 0.1)' : 'rgba(59, 172, 99, 0.2)'} 100%);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .professional-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 
      ${isDark 
        ? '0 32px 80px rgba(0, 0, 0, 0.6), 0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
        : '0 32px 80px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1)'};
    border-color: ${isDark 
      ? 'rgba(59, 172, 99, 0.4)' 
      : 'rgba(59, 172, 99, 0.6)'};
  }
  
  .professional-card:hover::before,
  .professional-card:hover::after {
    opacity: 1;
  }
  
  .professional-card.featured {
    border: 2px solid ${isDark 
      ? 'rgba(59, 172, 99, 0.5)' 
      : 'rgba(59, 172, 99, 0.6)'};
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.8)' 
      : 'rgba(255, 255, 255, 0.98)'};
    box-shadow: 
      ${isDark 
        ? '0 24px 70px rgba(59, 172, 99, 0.15), 0 12px 40px rgba(0, 0, 0, 0.3)' 
        : '0 24px 70px rgba(59, 172, 99, 0.1), 0 12px 40px rgba(0, 0, 0, 0.06)'};
  }
  
  .glass-badge {
    background: ${isDark 
      ? 'rgba(59, 172, 99, 0.3)' 
      : 'rgba(59, 172, 99, 0.2)'};
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${isDark 
      ? 'rgba(59, 172, 99, 0.5)' 
      : 'rgba(59, 172, 99, 0.4)'};
    border-radius: 1rem;
    box-shadow: 
      0 8px 24px rgba(59, 172, 99, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 8px 24px rgba(59, 172, 99, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
    50% { box-shadow: 0 8px 32px rgba(59, 172, 99, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3); }
  }
  
  .category-badge {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.9)' 
      : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(0, 0, 0, 0.08)'};
    border-radius: 0.75rem;
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  }
  
  .stats-badge {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.8)' 
      : 'rgba(255, 255, 255, 0.9)'};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.06)'};
    border-radius: 0.625rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
  
  .read-more-btn {
    background: ${isDark 
      ? 'rgba(59, 172, 99, 0.25)' 
      : 'rgba(59, 172, 99, 0.15)'};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${isDark 
      ? 'rgba(59, 172, 99, 0.4)' 
      : 'rgba(59, 172, 99, 0.3)'};
    border-radius: 1rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(59, 172, 99, 0.1);
  }
  
  .read-more-btn:hover {
    background: ${isDark 
      ? 'rgba(59, 172, 99, 0.4)' 
      : 'rgba(59, 172, 99, 0.25)'};
    transform: translateX(6px) scale(1.1);
    box-shadow: 0 6px 24px rgba(59, 172, 99, 0.2);
  }
  
  .image-overlay {
    background: linear-gradient(
      135deg,
      ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'} 0%,
      transparent 40%,
      transparent 60%,
      ${isDark ? 'rgba(59, 172, 99, 0.15)' : 'rgba(59, 172, 99, 0.08)'} 100%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .professional-card:hover .image-overlay {
    opacity: 1;
  }
  
  .content-gradient {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      ${isDark ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)'} 100%
    );
  }
  
  .tag-chip {
    background: ${isDark 
      ? 'rgba(99, 102, 241, 0.15)' 
      : 'rgba(99, 102, 241, 0.1)'};
    border: 1px solid ${isDark 
      ? 'rgba(99, 102, 241, 0.3)' 
      : 'rgba(99, 102, 241, 0.2)'};
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }
  
  .tag-chip:hover {
    background: ${isDark 
      ? 'rgba(99, 102, 241, 0.25)' 
      : 'rgba(99, 102, 241, 0.15)'};
    transform: translateY(-1px);
  }
  
  .author-avatar {
    background: linear-gradient(135deg, 
      ${isDark ? 'rgba(59, 172, 99, 0.3)' : 'rgba(59, 172, 99, 0.2)'} 0%,
      ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'} 100%);
    border: 2px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(255, 255, 255, 0.8)'};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const BlogCard: React.FC<BlogCardProps> = ({ blog, className = "" }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isDark = mounted ? theme === 'dark' : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Inject glassmorphic styles
  useEffect(() => {
    if (!mounted) return;
    
    const existingStyle = document.getElementById('professional-card-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'professional-card-styles';
    styleSheet.innerText = getGlassCardStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('professional-card-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);

  // Helper functions to extract data from API response
  const getImageUrl = () => {
    return blog.upload_image || blog.featured_image || "/api/placeholder/600/400";
  };

  const getExcerpt = () => {
    const description = blog.description || blog.excerpt || "";
    // Clean HTML tags if present
    const cleanDescription = description.replace(/<[^>]*>/g, '');
    // Limit to reasonable length
    return cleanDescription.length > 160 
      ? cleanDescription.substring(0, 160) + "..." 
      : cleanDescription;
  };

  const getCategoryName = () => {
    if (blog.category) return blog.category;
    
    if (blog.categories && Array.isArray(blog.categories) && blog.categories.length > 0) {
      const firstCategory = blog.categories[0];
      if (typeof firstCategory === 'object' && firstCategory.category_name) {
        return firstCategory.category_name;
      }
      if (typeof firstCategory === 'string') {
        return firstCategory;
      }
    }
    
    return 'General';
  };

  const getAuthorName = () => {
    if (blog.author?.name) return blog.author.name;
    if (blog.author?.email) {
      // Extract name from email if no name provided
      return blog.author.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Anonymous';
  };

  const getPublishedDate = () => {
    const date = blog.publishedAt || blog.createdAt;
    return date ? new Date(date) : new Date();
  };

  const getReadTime = () => {
    if (blog.reading_time) return blog.reading_time;
    if (blog.read_time) return blog.read_time;
    
    // Estimate read time based on description length
    const text = blog.description || blog.excerpt || "";
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const getCleanTags = () => {
    if (!blog.tags || !Array.isArray(blog.tags)) return [];
    
    // Filter out malformed tags (like JSON strings)
    return blog.tags.filter(tag => {
      if (typeof tag !== 'string') return false;
      // Filter out JSON-like strings
      if (tag.includes('{') || tag.includes('}') || tag.includes('"')) return false;
      return tag.trim().length > 0;
    });
  };

  const getBlogUrl = () => {
    // Use _id for routing to match the [id] dynamic route in page.tsx
    // The page.tsx expects the ID parameter and fetches by ID
    return `/blogs/${blog._id}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const defaultImage = "/api/placeholder/600/400";
  const imageUrl = getImageUrl();
  const timeAgo = formatDistanceToNow(getPublishedDate(), { addSuffix: true });
  const excerpt = getExcerpt();
  const categoryName = getCategoryName();
  const authorName = getAuthorName();
  const readTime = getReadTime();
  const cleanTags = getCleanTags();

  return (
    <article className={`professional-card ${blog.featured ? 'featured' : ''} group ${className}`}>
      <Link href={getBlogUrl()} className="block h-full">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          )}
          
          <Image
            src={imageError ? defaultImage : imageUrl}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={blog.featured}
          />
          
          {/* Image overlay */}
          <div className="image-overlay absolute inset-0"></div>
          
          {/* Featured Badge */}
          {blog.featured && (
            <div className="absolute top-4 left-4 z-10">
              <div className="glass-badge flex items-center gap-2 px-4 py-2 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4" />
                <span>Featured</span>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="category-badge px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {categoryName}
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
            {/* Read Time */}
            <div className="stats-badge flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime} min</span>
            </div>

            {/* Views & External Link */}
            <div className="flex items-center gap-2">
              {blog.views !== undefined && blog.views > 0 && (
                <div className="stats-badge flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{formatViews(blog.views)}</span>
                </div>
              )}
              
              {blog.blog_link && (
                <div className="stats-badge p-2 text-gray-600 dark:text-gray-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-gradient p-7 flex flex-col h-full">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight">
            {blog.title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {cleanTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {cleanTags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="tag-chip px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {cleanTags.length > 2 && (
                <span className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-500 bg-gray-100/50 dark:bg-gray-800/30 rounded-full">
                  +{cleanTags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-200/60 dark:border-gray-700/60 mt-auto">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="author-avatar w-9 h-9 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {authorName}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Read More Button */}
            <div className="read-more-btn p-3 opacity-0 group-hover:opacity-100 transition-all duration-400">
              <ArrowRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;