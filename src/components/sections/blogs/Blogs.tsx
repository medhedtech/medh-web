"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { 
  Eye, ChevronRight, BookOpen, Calendar, 
  Clock, ArrowRight, Filter, TrendingUp, 
  Sparkles, Users, Star, Target, Search,
  Grid3x3, List, Zap, Award, MessageSquare
} from "lucide-react";

// Define interfaces for TypeScript
interface IBlog {
  _id: string;
  title: string;
  description?: string;
  upload_image?: string;
  featured_image?: string;
  blog_link?: string | null;
  slug?: string;
  author?: {
    _id: string;
    email?: string;
    name?: string;
  };
  createdAt?: string;
  reading_time?: number;
  readTime?: string;
  categories?: Array<{
    _id: string;
    category_name: string;
    category_image?: string;
  }>;
  category?: string;
  tags?: string[];
  excerpt?: string;
}

interface IBlogsProps {
  title?: string;
  description?: string;
  variant?: string;
  maxBlogs?: number;
}

// Theme-aware glassmorphism styles (similar to Hero2.tsx)
const getThemeStyles = (isDark: boolean) => `
  @keyframes animate-gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes animate-bounce-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes animate-pulse-slow {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes theme-transition {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: animate-gradient-x 3s ease infinite;
  }
  
  .animate-bounce-slow {
    animation: animate-bounce-slow 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: animate-pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}, transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .animate-theme-transition {
    animation: theme-transition 0.5s ease-in-out;
  }
  
  .glass-container {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.08)' 
      : 'rgba(255, 255, 255, 0.08)'};
    backdrop-filter: blur(25px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.25)'};
    border-radius: 1.5rem;
    box-shadow: 
      ${isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.15), 0 16px 64px rgba(0, 0, 0, 0.08)' 
        : '0 8px 32px rgba(0, 0, 0, 0.06), 0 16px 64px rgba(0, 0, 0, 0.02)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.35)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.18)'};
    position: relative;
  }
  
  .glass-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  
  .glass-card {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.2)' 
      : 'rgba(255, 255, 255, 0.3)'};
    backdrop-filter: blur(12px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.5)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(0, 0, 0, 0.25)' 
        : '0 4px 20px rgba(0, 0, 0, 0.08)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
  
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  
  .glass-stats {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.12)' 
      : 'rgba(255, 255, 255, 0.15)'};
    backdrop-filter: blur(20px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.3)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(0, 0, 0, 0.12), 0 8px 40px rgba(0, 0, 0, 0.06)' 
        : '0 4px 20px rgba(0, 0, 0, 0.04), 0 8px 40px rgba(0, 0, 0, 0.015)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.4)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.25)'};
    position: relative;
  }
  
  .glass-stats::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.4)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  
  .glass-primary {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.25)' 
      : 'rgba(59, 172, 99, 0.15)'};
    backdrop-filter: blur(15px);
    border: 1px solid ${isDark 
      ? 'rgba(59, 172, 99, 0.08)' 
      : 'rgba(59, 172, 99, 0.4)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(59, 172, 99, 0.2)' 
        : '0 4px 20px rgba(59, 172, 99, 0.15)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
  
  .glass-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(59, 172, 99, 0.05), rgba(59, 172, 99, 0.01), rgba(59, 172, 99, 0.03)' 
      : 'rgba(59, 172, 99, 0.3), rgba(59, 172, 99, 0.1), rgba(59, 172, 99, 0.2)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  
  .glass-purple {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.25)' 
      : 'rgba(147, 51, 234, 0.15)'};
    backdrop-filter: blur(15px);
    border: 1px solid ${isDark 
      ? 'rgba(147, 51, 234, 0.08)' 
      : 'rgba(147, 51, 234, 0.4)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(147, 51, 234, 0.2)' 
        : '0 4px 20px rgba(147, 51, 234, 0.15)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
  
  .glass-purple::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(147, 51, 234, 0.05), rgba(147, 51, 234, 0.01), rgba(147, 51, 234, 0.03)' 
      : 'rgba(147, 51, 234, 0.3), rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.2)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  
  .text-shadow-light {
    text-shadow: ${isDark 
      ? '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.6)' 
      : '1px 1px 3px rgba(0, 0, 0, 0.3), 0 0 6px rgba(0, 0, 0, 0.2)'};
  }
  
  .text-shadow-medium {
    text-shadow: ${isDark 
      ? '1px 1px 4px rgba(0, 0, 0, 0.7)' 
      : '1px 1px 2px rgba(0, 0, 0, 0.4)'};
  }
  
  .text-shadow-subtle {
    text-shadow: ${isDark 
      ? '1px 1px 3px rgba(0, 0, 0, 0.6)' 
      : '0.5px 0.5px 1px rgba(0, 0, 0, 0.3)'};
  }
`;

// Skeleton loader component with glassmorphism
const BlogSkeleton: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="glass-card h-[420px] md:h-[450px] flex flex-col"
  >
    <div className="animate-pulse">
      <div className="rounded-t-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-[16/9] mb-4"></div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Enhanced Filter Button with glassmorphism
interface IFilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isDark?: boolean;
}

const FilterButton: React.FC<IFilterButtonProps> = React.memo(({ active, onClick, icon, label, isDark = false }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
      active
        ? isDark 
          ? 'glass-primary text-white shadow-md' 
          : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-lg'
        : isDark 
          ? 'glass-stats text-gray-300 hover:text-white' 
          : 'glass-stats text-gray-700 hover:text-gray-900 hover:bg-white/20'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 animate-gradient-x"></div>
    )}
    
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    
    <span className="relative z-10 mr-1.5 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="relative z-10 font-medium">{label}</span>
  </motion.button>
));

FilterButton.displayName = 'FilterButton';

// View Toggle Button
interface IViewToggleProps {
  isGridView: boolean;
  onToggle: () => void;
  isDark?: boolean;
}

const ViewToggle: React.FC<IViewToggleProps> = React.memo(({ isGridView, onToggle, isDark = false }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onToggle}
    className={`glass-stats p-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
    }`}
  >
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    <span className="relative z-10 group-hover:scale-110 transition-transform">
      {isGridView ? <Grid3x3 size={20} /> : <List size={20} />}
    </span>
  </motion.button>
));

ViewToggle.displayName = 'ViewToggle';

const Blogs: React.FC<IBlogsProps> = ({ 
  title = "Latest Articles & Insights",
  description = "Stay updated with the latest trends, tips, and educational insights from industry experts",
  variant = "standard",
  maxBlogs = 6
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { getQuery, loading } = useGetQuery();
  
  // State management
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  
  const sliderRef = useRef<Slider | null>(null);
  
  const isDark = mounted ? theme === 'dark' : true; // Default to dark during SSR
  
  // Enhanced filter options with icons and descriptions
  const filterOptions = useMemo(() => [
    { 
      id: 'all', 
      label: 'All Articles', 
      icon: <BookOpen size={16} />, 
      description: 'View all available articles',
      color: 'blue'
    },
    { 
      id: 'latest', 
      label: 'Latest', 
      icon: <Calendar size={16} />, 
      description: 'Recently published content',
      color: 'emerald'
    },
    { 
      id: 'popular', 
      label: 'Popular', 
      icon: <Eye size={16} />, 
      description: 'Most viewed articles',
      color: 'purple'
    },
    { 
      id: 'trending', 
      label: 'Trending', 
      icon: <TrendingUp size={16} />, 
      description: 'Currently trending topics',
      color: 'pink'
    },
    { 
      id: 'quick', 
      label: 'Quick Reads', 
      icon: <Clock size={16} />, 
      description: '5 minutes or less',
      color: 'orange'
    },
  ], []);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Inject theme-aware styles
  useEffect(() => {
    if (!mounted) return;
    
    const existingStyle = document.getElementById('blogs-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'blogs-theme-styles';
    styleSheet.innerText = getThemeStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('blogs-theme-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);

  // Compact slider settings with better responsiveness
  const settings = useMemo(() => ({
    dots: false,
    infinite: blogs.length > 3,
    speed: 500,
    arrows: !isMobile,
    slidesToShow: Math.min(blogs.length, isGridView ? 3 : 2),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    centerMode: blogs.length > (isGridView ? 3 : 2),
    centerPadding: "0",
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(blogs.length, isGridView ? 2 : 1),
          slidesToScroll: 1,
          centerMode: blogs.length > (isGridView ? 2 : 1),
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: blogs.length > 1,
          arrows: false,
          dots: true,
        }
      }
    ]
  }), [blogs.length, isMobile, isGridView]);

  // Enhanced fetch blogs function with better error handling and response structure handling
  const fetchBlogs = useCallback(async (options: any = {}, retryCount = 3) => {
    try {
      const apiUrl = options.featured 
        ? apiUrls.Blogs.getFeaturedBlogs({
            limit: options.limit || maxBlogs,
            with_content: false,
            tags: options.tags || (activeFilter !== 'all' ? activeFilter : ''),
            category: options.category || ''
          })
        : apiUrls.Blogs.getAllBlogs({
            limit: options.limit || maxBlogs,
            sort_by: options.sort_by || 'createdAt',
            sort_order: options.sort_order || 'desc',
            tags: options.tags || (activeFilter !== 'all' ? activeFilter : ''),
            status: 'published'
          });

      await getQuery({
        url: apiUrl,
        onSuccess: (response: any) => {
          console.log('Raw API response:', response);
          
          // Handle multiple possible response structures:
          // 1. Direct array: response = [blogs...]
          // 2. Standard wrapper: response = { data: [blogs...] }
          // 3. Nested wrapper: response = { data: { data: [blogs...] } }
          // 4. Server response: response = { data: { success: true, data: [blogs...] } }
          let blogData: any[] = [];
          
          if (Array.isArray(response)) {
            blogData = response;
          } else if (response?.data) {
            if (Array.isArray(response.data)) {
              blogData = response.data;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
              blogData = response.data.data;
            } else if (response.data?.success && Array.isArray(response.data?.data)) {
              blogData = response.data.data;
            }
          }
          
          console.log('Extracted blog data:', blogData);
          
          if (blogData && blogData.length > 0) {
            const transformedBlogs = blogData.map((blog: any) => ({
              _id: blog._id,
              title: blog.title || "Untitled Article",
              featured_image: blog.upload_image || blog.featured_image || "/images/blog/default.png",
              blog_link: blog.blog_link || `/blogs/${blog.slug || blog._id}`,
              excerpt: blog.description 
                ? (blog.description.length > 120 ? blog.description.substring(0, 120) + '...' : blog.description)
                : blog.excerpt || `Discover insights about ${blog.title || 'this topic'}`,
              author: (() => {
                if (blog.author) {
                  if (typeof blog.author === 'object') {
                    return blog.author.name || blog.author.email || "Medh Team";
                  }
                  return blog.author;
                }
                return "Medh Team";
              })(),
              createdAt: blog.createdAt,
              readTime: blog.reading_time 
                ? `${blog.reading_time} min read` 
                : blog.readTime || "3 min read",
              category: (() => {
                if (blog.categories && blog.categories.length > 0) {
                  return typeof blog.categories[0] === 'object' 
                    ? blog.categories[0].category_name || blog.categories[0].name
                    : blog.categories[0];
                }
                return blog.category || "Education";
              })(),
              tags: blog.tags || []
            }));
            
            console.log('Transformed blogs:', transformedBlogs);
            setBlogs(transformedBlogs.slice(0, maxBlogs));
          } else {
            console.log('No blog data found, setting empty array');
            setBlogs([]);
          }
        },
        onFail: async (error: any) => {
          console.error("Error fetching blogs:", error);
          if (retryCount > 0) {
            console.log(`Retrying... attempts left: ${retryCount - 1}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retryCount))); // Exponential backoff
            await fetchBlogs(options, retryCount - 1);
          } else {
            console.error("All retry attempts failed, setting empty blogs array");
            setBlogs([]);
          }
        },
      });
    } catch (error) {
      console.error("Failed to fetch blogs due to exception:", error);
      if (retryCount > 0) {
        console.log(`Exception occurred, retrying... attempts left: ${retryCount - 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchBlogs(options, retryCount - 1);
      } else {
        setBlogs([]);
      }
    }
  }, [getQuery, maxBlogs, activeFilter]);

  // Effects
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
      if (sliderRef.current && (sliderRef.current as any).slick) {
        try {
          (sliderRef.current as any).slick.refresh();
        } catch (error) {
          console.warn('Error refreshing slider:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => setIsVisible(true), 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [activeFilter, fetchBlogs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="relative animate-theme-transition"
    >
      {/* Compact Header Section with Glassmorphism */}
      <div className="glass-container p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title and Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Badge */}
            <div className={`inline-flex items-center px-2.5 py-1 glass-stats rounded-full text-xs font-medium mb-3 opacity-95 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              <Sparkles size={12} className="mr-1.5" />
              Expert Insights & Knowledge
            </div>
            
            <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight tracking-tight max-w-3xl ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-light`}>
              {title}
            </h2>
            <p className={`text-sm md:text-base leading-relaxed max-w-2xl ${isDark ? 'text-white' : 'text-gray-800'} font-medium text-shadow-medium`}>
              {description}
            </p>
          </motion.div>

          {/* Compact Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            {/* View Toggle and View All */}
            <div className="flex items-center gap-2">
              {!isMobile && (
                <ViewToggle 
                  isGridView={isGridView} 
                  onToggle={() => setIsGridView(!isGridView)} 
                  isDark={isDark}
                />
              )}
              
              <Link href="/blogs">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 relative overflow-hidden group ${
                    isDark 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-primary-500/30 glass-stats' 
                      : 'bg-white/95 backdrop-blur-lg text-gray-900 border border-primary-500/40 hover:border-primary-500/70 hover:bg-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {!isDark && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50/60 to-purple-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  )}
                  
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
                  
                  <span className="relative z-10 font-bold tracking-wide">View All</span>
                  <ChevronRight size={14} className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
                  
                  {!isDark && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Compact Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-1.5 mr-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Filter size={14} />
              <span className="font-medium text-xs">Filter:</span>
            </div>
            
            {filterOptions.map((option) => (
              <FilterButton
                key={option.id}
                active={activeFilter === option.id}
                onClick={() => setActiveFilter(option.id)}
                icon={option.icon}
                label={option.label}
                isDark={isDark}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Content Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-4 ${
              isGridView 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}
          >
            {[...Array(maxBlogs)].map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </motion.div>
        ) : blogs.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-container p-4 md:p-6 rounded-2xl"
          >
            <Slider ref={sliderRef} {...settings}>
              {blogs.map((blog) => (
                <div key={blog._id} className="p-2">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </Slider>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-container p-8 rounded-2xl"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <BookOpen className={`w-12 h-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </motion.div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No Articles Available
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 max-w-md text-sm`}>
                We're working on new content for the "{filterOptions.find(f => f.id === activeFilter)?.label}" category. Check back soon!
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFilter('all')}
                className="glass-primary px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 text-sm"
              >
                Show All Articles
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Blogs; 