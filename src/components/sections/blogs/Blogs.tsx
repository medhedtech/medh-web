"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { 
  Eye, ChevronRight, BookOpen, Calendar, 
  Clock, ArrowRight, TrendingUp, 
  Users, Grid3x3, List
} from "lucide-react";

// Simplified interfaces
interface IBlog {
  _id: string;
  title: string;
  description?: string;
  upload_image?: string;
  featured_image?: string;
  blog_link?: string;
  slug?: string;
  author: {
    _id?: string;
    name?: string;
    email?: string;
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

// Optimized filter options - reduced to essential items
const FILTER_OPTIONS = [
  { id: 'all', label: 'All Articles', icon: BookOpen, color: 'blue' },
  { id: 'latest', label: 'Latest', icon: Calendar, color: 'emerald' },
  { id: 'popular', label: 'Popular', icon: Eye, color: 'purple' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'pink' },
  { id: 'quick', label: 'Quick Reads', icon: Clock, color: 'orange' }
];

// Simplified skeleton component
const BlogSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
);

// Optimized main component
const Blogs: React.FC<IBlogsProps> = ({
  title = "Latest Insights",
  description = "Discover the latest trends and insights in education and technology",
  variant = "default",
  maxBlogs = 6
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { getQuery, loading } = useGetQuery();
  
  // Simplified state management
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isGridView, setIsGridView] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const isDark = mounted ? theme === 'dark' : true;
  
  // Single initialization effect
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Optimized fetch function
  const fetchBlogs = useCallback(async (filter = 'all') => {
    try {
      const apiUrl = filter === 'popular' 
        ? apiUrls.Blogs.getFeaturedBlogs({
            limit: maxBlogs,
            with_content: false
          })
        : apiUrls.Blogs.getAllBlogs({
            limit: maxBlogs,
            sort_by: filter === 'latest' ? 'createdAt' : 'createdAt',
            sort_order: 'desc',
            status: 'published'
          });

      await getQuery({
        url: apiUrl,
        onSuccess: (response: any) => {
          let blogData: any[] = [];
          
          if (Array.isArray(response)) {
            blogData = response;
          } else if (response?.data) {
            if (Array.isArray(response.data)) {
              blogData = response.data;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
              blogData = response.data.data;
            }
          }
          
          if (blogData && blogData.length > 0) {
            const transformedBlogs = blogData.map((blog: any) => ({
              _id: blog._id,
              title: blog.title || "Untitled Article",
              featured_image: blog.upload_image || blog.featured_image || "/images/blog/default.png",
              blog_link: blog.blog_link || `/blogs/${blog.slug || blog._id}`,
              excerpt: blog.description 
                ? (blog.description.length > 120 ? blog.description.substring(0, 120) + '...' : blog.description)
                : `Discover insights about ${blog.title || 'this topic'}`,
              author: {
                _id: blog.author?._id || '',
                name: blog.author?.name || blog.author?.email || "Medh Team",
                email: blog.author?.email || ''
              },
              createdAt: blog.createdAt,
              readTime: blog.reading_time ? `${blog.reading_time} min read` : "3 min read",
              category: blog.categories?.[0]?.category_name || blog.category || "Education",
              tags: blog.tags || []
            }));
            
            setBlogs(transformedBlogs.slice(0, maxBlogs));
          } else {
            setBlogs([]);
          }
        },
        onFail: (error: any) => {
          console.error('Failed to fetch blogs:', error);
          setBlogs([]);
        }
      });
    } catch (error) {
      console.error('Error in fetchBlogs:', error);
      setBlogs([]);
    }
  }, [getQuery, maxBlogs]);

  // Fetch blogs on mount and filter change
  useEffect(() => {
    if (mounted) {
      fetchBlogs(activeFilter);
    }
  }, [mounted, activeFilter, fetchBlogs]);

  // Optimized filter handler
  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilter(filterId);
  }, []);

  // Loading state
  if (!mounted) {
    return (
      <div className="py-8 opacity-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className={`grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {[...Array(maxBlogs)].map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} py-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50`}>
      
      <section className="w-full py-8 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center mb-12 relative">
            <div className="inline-flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Blog & Insights
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded-md transition-all duration-200 ${
                  isGridView
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded-md transition-all duration-200 ${
                  !isGridView
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className={`grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {[...Array(maxBlogs)].map((_, index) => (
                <BlogSkeleton key={index} />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className={`grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new content or try a different filter.
                </p>
              </div>
            </div>
          )}

          {/* View All Button */}
          {blogs.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs; 