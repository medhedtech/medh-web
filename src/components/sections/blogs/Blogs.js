"use client";

import React, { useEffect, useState, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import BlogCard from "./BlogCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import Link from "next/link";
import { Eye, ChevronRight, BookOpen, Loader2, Calendar, Clock, User, ArrowRight, Filter } from "lucide-react";

const BlogSkeleton = () => (
  <div className="animate-pulse">
    <div className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-[16/9] mb-4"></div>
    <div className="flex items-center gap-4 mb-2">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

const Blogs = ({ 
  title = "Latest Articles & Insights",
  description = "Stay updated with the latest trends, tips, and educational insights",
  variant = "standard",
  maxBlogs = 6
}) => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  const [blogs, setBlogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add entrance animation effect
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  // Slider settings
  const settings = {
    dots: true,
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
    beforeChange: (current, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(blogs.length, 2),
          slidesToScroll: 1,
          centerMode: blogs.length > 2,
          arrows: !isMobile,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: blogs.length > 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Articles', icon: <BookOpen size={16} /> },
    { id: 'latest', label: 'Latest', icon: <Calendar size={16} /> },
    { id: 'popular', label: 'Popular', icon: <Eye size={16} /> },
    { id: 'quick', label: 'Quick Reads', icon: <Clock size={16} /> },
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    // Use our enhanced API endpoints for more advanced filtering
    if (filterId === 'all') {
      fetchBlogs();
    } else if (filterId === 'latest') {
      fetchBlogs({ sort_by: 'createdAt', sort_order: 'desc', limit: maxBlogs });
    } else if (filterId === 'popular') {
      fetchBlogs({ sort_by: 'views', sort_order: 'desc', limit: maxBlogs });
    } else if (filterId === 'quick') {
      fetchBlogs({ tags: 'quick-read', limit: maxBlogs });
    }
  };

  // Fetch Blogs Data from API using enhanced API endpoints
  const fetchBlogs = async (options = {}) => {
    try {
      // Use the enhanced getAllBlogs function with filtering options
      const apiUrl = apiUrls?.Blogs?.getAllBlogs({
        limit: options.limit || maxBlogs,
        sort_by: options.sort_by || 'createdAt',
        sort_order: options.sort_order || 'desc',
        tags: options.tags || '',
        status: 'published'
      });
      
      await getQuery({
        url: apiUrl,
        onSuccess: (response) => {
          if (response.success) {
            setBlogs(response.data.slice(0, maxBlogs));
          } else {
            console.error("Failed to fetch blogs: ", response.message);
            setBlogs([]);
          }
        },
        onFail: (err) => {
          console.error("API error:", err);
          setBlogs([]);
        },
      });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setBlogs([]);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            {title}
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
            {description}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-2 mr-4">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleFilterChange(option.id)}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                    activeFilter === option.id
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
          <Link 
            href="/blogs"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <span>View All Articles</span>
            <ChevronRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {isMobile && (
        <div className="flex items-center justify-start space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleFilterChange(option.id)}
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                activeFilter === option.id
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900/30 dark:via-gray-900 dark:to-gray-900/30 p-5 md:p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-2 md:p-1.5">
                <BlogSkeleton />
              </div>
            ))}
          </div>
        </div>
      ) : blogs.length > 0 ? (
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900/30 dark:via-gray-900 dark:to-gray-900/30 p-5 md:p-4 shadow-sm">
          <Slider ref={sliderRef} {...settings}>
            {blogs.map((blog) => (
              <div key={blog._id} className="p-2 md:p-1.5">
                <BlogCard 
                  blog={blog} 
                  imageSrc={blog.featured_image || `/images/blog/blog_${(Math.floor(Math.random() * 25) + 1)}.png`}
                  title={blog.title}
                  author={blog.author || "Medh Team"}
                  date={blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : "Recently Published"}
                  readTime={blog.readTime || "5 min read"}
                  buttonText="Read More"
                />
              </div>
            ))}
          </Slider>
          
          {/* Custom dot navigation */}
          <div className="hidden md:flex justify-center items-center mt-4">
            {blogs.slice(0, settings.slidesToShow * 2).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="mx-1 focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`transition-all duration-300 ${
                    currentSlide === index 
                      ? 'w-6 bg-gradient-to-r from-primary-500 to-secondary-500' 
                      : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                  } h-2 rounded-full`}
                ></div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 md:p-5 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50">
            <BookOpen className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            No Articles Available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            We're working on new insightful articles. Check back soon!
          </p>
          <Link href="/contact-us" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300">
            Suggest a Topic
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Blogs;
