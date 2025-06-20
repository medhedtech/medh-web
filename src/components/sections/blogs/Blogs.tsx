"use client";

import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
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

// PERFORMANCE OPTIMIZATION: Move interfaces and constants outside component
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

// PERFORMANCE OPTIMIZATION: Frozen filter options to prevent mutations
const FILTER_OPTIONS = Object.freeze([
  Object.freeze({ id: 'all', label: 'All Articles', icon: BookOpen, color: 'blue' }),
  Object.freeze({ id: 'latest', label: 'Latest', icon: Calendar, color: 'emerald' }),
  Object.freeze({ id: 'popular', label: 'Popular', icon: Eye, color: 'purple' }),
  Object.freeze({ id: 'trending', label: 'Trending', icon: TrendingUp, color: 'pink' }),
  Object.freeze({ id: 'quick', label: 'Quick Reads', icon: Clock, color: 'orange' })
]);

// PERFORMANCE OPTIMIZATION: Memoized BlogSkeleton component
const BlogSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
));

BlogSkeleton.displayName = 'BlogSkeleton';

// PERFORMANCE OPTIMIZATION: Memoized FilterButton component
const FilterButton = memo<{
  filter: typeof FILTER_OPTIONS[0];
  isActive: boolean;
  onClick: (filterId: string) => void;
  isDark: boolean;
}>(({ filter, isActive, onClick, isDark }) => {
  const IconComponent = filter.icon;
  
  const buttonClasses = useMemo(() => {
    return `inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? `bg-${filter.color}-500 text-white shadow-lg`
        : `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-${filter.color}-50 dark:hover:bg-${filter.color}-900/20`
    }`;
  }, [isActive, filter.color]);

  const handleClick = useCallback(() => {
    onClick(filter.id);
  }, [onClick, filter.id]);

  return (
    <button
      onClick={handleClick}
      className={buttonClasses}
    >
      <IconComponent className="w-4 h-4" />
      <span className="text-sm">{filter.label}</span>
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.filter === nextProps.filter &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.isDark === nextProps.isDark
  );
});

FilterButton.displayName = 'FilterButton';

// PERFORMANCE OPTIMIZATION: Memoized BlogGrid component
const BlogGrid = memo<{
  blogs: IBlog[];
  isGridView: boolean;
  loading: boolean;
  maxBlogs: number;
}>(({ blogs, isGridView, loading, maxBlogs }) => {
  const gridClasses = useMemo(() => {
    return `grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`;
  }, [isGridView]);

  if (loading) {
    return (
      <div className={gridClasses}>
        {[...Array(maxBlogs)].map((_, index) => (
          <BlogSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
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
    );
  }

  return (
    <div className={gridClasses}>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.blogs === nextProps.blogs &&
    prevProps.isGridView === nextProps.isGridView &&
    prevProps.loading === nextProps.loading &&
    prevProps.maxBlogs === nextProps.maxBlogs
  );
});

BlogGrid.displayName = 'BlogGrid';

// PERFORMANCE OPTIMIZATION: Main component with comprehensive memoization
const Blogs = memo<IBlogsProps>(({
  title = "Latest Insights",
  description = "Discover the latest trends and insights in education and technology",
  variant = "default",
  maxBlogs = 6
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { getQuery, loading } = useGetQuery();
  
  // PERFORMANCE OPTIMIZATION: Memoized state management
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isGridView, setIsGridView] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // PERFORMANCE OPTIMIZATION: Memoized computed values
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);
  
  // PERFORMANCE OPTIMIZATION: Single initialization effect
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized fetch function
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

  // PERFORMANCE OPTIMIZATION: Effect for fetching blogs
  useEffect(() => {
    if (mounted) {
      fetchBlogs(activeFilter);
    }
  }, [mounted, activeFilter, fetchBlogs]);

  // PERFORMANCE OPTIMIZATION: Memoized filter handler
  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilter(filterId);
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized class names
  const containerClasses = useMemo(() => {
    return `w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} py-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50`;
  }, [isVisible]);

  const sectionClasses = useMemo(() => {
    return "w-full py-8 relative";
  }, []);

  const headerContainerClasses = useMemo(() => {
    return "text-center mb-12 relative";
  }, []);

  const badgeClasses = useMemo(() => {
    return "inline-flex items-center gap-2 mb-6";
  }, []);

  const titleClasses = useMemo(() => {
    return "text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8";
  }, []);

  const filtersClasses = useMemo(() => {
    return "flex flex-wrap items-center justify-center gap-3 mb-8";
  }, []);

  const viewToggleClasses = useMemo(() => {
    return "flex items-center gap-2 mb-8 justify-center";
  }, []);

  // Fast loading state
  if (!mounted) {
    return (
      <div className="py-8 opacity-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(maxBlogs)].map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      
      <section className={sectionClasses}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className={headerContainerClasses}>
            <div className={badgeClasses}>
              <BookOpen className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Blog & Insights
              </span>
            </div>
            <h2 className={titleClasses}>
              {title}
            </h2>
            <p className={descriptionClasses}>
              {description}
            </p>
          </div>

          {/* Filters */}
          <div className={filtersClasses}>
            {FILTER_OPTIONS.map((filter) => (
              <FilterButton
                key={filter.id}
                filter={filter}
                isActive={activeFilter === filter.id}
                onClick={handleFilterChange}
                isDark={isDark}
              />
            ))}
          </div>

          {/* View Toggle */}
          <div className={viewToggleClasses}>
            <button
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isGridView
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                !isGridView
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <BlogGrid
            blogs={blogs}
            isGridView={isGridView}
            loading={loading}
            maxBlogs={maxBlogs}
          />

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
});

Blogs.displayName = 'Blogs';

export default Blogs; 