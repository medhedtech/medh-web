"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { 
  Eye, ChevronRight, BookOpen, Calendar, 
  Clock, ArrowRight, Filter, TrendingUp 
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

// Skeleton loader component
const BlogSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="animate-pulse"
  >
    <div className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-[16/9] mb-4"></div>
    <div className="flex items-center gap-4 mb-2">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </motion.div>
);

// Filter button component
interface IFilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const FilterButton: React.FC<IFilterButtonProps> = ({ active, onClick, icon, label }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
      active
        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
  </motion.button>
);

const Blogs: React.FC<IBlogsProps> = ({ 
  title = "Latest Articles & Insights",
  description = "Stay updated with the latest trends, tips, and educational insights",
  variant = "standard",
  maxBlogs = 6
}) => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const sliderRef = useRef<Slider | null>(null);
  
  const filterOptions = [
    { id: 'all', label: 'All Articles', icon: <BookOpen size={16} /> },
    { id: 'latest', label: 'Latest', icon: <Calendar size={16} /> },
    { id: 'popular', label: 'Popular', icon: <Eye size={16} /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp size={16} /> },
    { id: 'quick', label: 'Quick Reads', icon: <Clock size={16} /> },
  ];

  // Slider settings with enhanced animations
  const settings = {
    dots: false,
    infinite: blogs.length > 3,
    speed: 700,
    arrows: !isMobile,
    slidesToShow: Math.min(blogs.length, 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: blogs.length > 3,
    centerPadding: "0",
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(blogs.length, 2),
          slidesToScroll: 1,
          centerMode: blogs.length > 2,
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
  };

  // Enhanced fetch blogs function with error handling and retries
  const fetchBlogs = async (options: any = {}, retryCount = 3) => {
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
          // Check if we have data in the response
          const blogData = response.data || [];
          
          if (blogData.length > 0) {
            const transformedBlogs = blogData.map((blog: any) => ({
              _id: blog._id,
              title: blog.title,
              featured_image: blog.upload_image || "/images/blog/default.png",
              blog_link: blog.blog_link || `/blogs/${blog.slug || blog._id}`,
              excerpt: blog.description ? blog.description.substring(0, 120) + '...' : `Read our latest blog post about ${blog.title}`,
              author: blog.author ? blog.author.email || "Medh Team" : "Medh Team",
              createdAt: blog.createdAt,
              readTime: blog.reading_time ? `${blog.reading_time} min read` : "3 min read",
              category: blog.categories && blog.categories.length > 0 ? blog.categories[0].category_name : "Education",
              tags: blog.tags || []
            }));
            
            console.log('Transformed blogs:', transformedBlogs);
            setBlogs(transformedBlogs.slice(0, maxBlogs));
          } else {
            console.log("No blogs found in the response:", response);
            setBlogs([]);
          }
        },
        onFail: async (error: any) => {
          console.error("Error fetching blogs:", error);
          if (retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchBlogs(options, retryCount - 1);
          } else {
            setBlogs([]);
          }
        },
      });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setBlogs([]);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
      // Safely reinitialize slider on resize
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
  }, [activeFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            {title}
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
            {description}
          </p>
        </motion.div>

        {/* Filters and View All Button */}
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-2 mr-4">
              {filterOptions.map((option) => (
                <FilterButton
                  key={option.id}
                  active={activeFilter === option.id}
                  onClick={() => setActiveFilter(option.id)}
                  icon={option.icon}
                  label={option.label}
                />
              ))}
            </div>
          )}
          
          <Link href="/blogs">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View All Articles
              <ChevronRight size={16} className="ml-2" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Mobile Filters */}
      {isMobile && (
        <div className="flex items-center justify-start space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {filterOptions.map((option) => (
            <FilterButton
              key={option.id}
              active={activeFilter === option.id}
              onClick={() => setActiveFilter(option.id)}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </div>
      )}

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(3)].map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </motion.div>
        ) : blogs.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900/30 dark:via-gray-900 dark:to-gray-900/30 p-5 md:p-4 shadow-sm"
          >
            <Slider ref={sliderRef} {...settings}>
              {blogs.map((blog) => (
                <div key={blog._id} className="p-2 md:p-1.5">
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
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Articles Available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're working on new content. Check back soon!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Blogs; 