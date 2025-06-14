"use client";
import BlogsPrimary from "@/components/sections/blogs/BlogsPrimary";
import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useTheme } from "next-themes";

interface BlogsMainProps {
  initialBlogs?: any[];
  totalBlogs?: number;
  currentPage?: number;
  totalPages?: number;
  hasMore?: boolean;
  initialFilters?: {
    category?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
    page?: number;
  };
}

const BlogsMain: React.FC<BlogsMainProps> = ({ 
  initialBlogs = [], 
  totalBlogs = 0,
  currentPage = 1,
  totalPages = 1,
  hasMore = false,
  initialFilters = {} 
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : false;

  // Prepare title based on filters
  let pageTitle = "Blogs";
  
  if (initialFilters.search) {
    pageTitle = `Search: "${initialFilters.search}"`;
  } else if (initialFilters.category) {
    pageTitle = `${initialFilters.category} Articles`;
  } else if (initialFilters.tag) {
    pageTitle = `${initialFilters.tag} Content`;
  } else if (initialFilters.featured) {
    pageTitle = "Featured Articles";
  }

  return (
    <>
      {/* Optimized Static Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        {/* Simple gradient overlays - no animations for better performance */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-purple-200/10 dark:from-primary-500/10 dark:to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-bl from-secondary-200/15 to-blue-200/10 dark:from-secondary-500/8 dark:to-blue-500/4 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-tr from-purple-200/10 to-pink-200/8 dark:from-purple-500/6 dark:to-pink-500/4 rounded-full blur-3xl"></div>
      </div>

      {/* Simple Header */}
      <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 justify-center">
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {pageTitle}
              </h1>
              {totalBlogs > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {totalBlogs} article{totalBlogs !== 1 ? 's' : ''} found
                  {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <BlogsPrimary 
          initialBlogs={initialBlogs} 
          totalBlogs={totalBlogs}
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
          initialFilters={initialFilters}
        />
      </div>
    </>
  );
};

export default BlogsMain;
