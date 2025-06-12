"use client";
import BlogsPrimary from "@/components/sections/blogs/BlogsPrimary";
import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useTheme } from "next-themes";

interface BlogsMainProps {
  initialBlogs?: any[];
  totalBlogs?: number;
  initialFilters?: {
    category?: string;
    tag?: string;
    featured?: boolean;
  };
}

// Moving background animation styles
const getMovingBackgroundStyles = (isDark: boolean) => `
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(100px, -100px) scale(1.1); }
    66% { transform: translate(-50px, 50px) scale(0.9); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-80px, -120px) scale(1.2); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(120px, 80px) scale(0.8); }
    75% { transform: translate(-90px, -60px) scale(1.1); }
  }
  
  @keyframes gradient-shift {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
  }
  
  .float-1 { animation: float1 20s ease-in-out infinite; }
  .float-2 { animation: float2 25s ease-in-out infinite; }
  .float-3 { animation: float3 30s ease-in-out infinite; }
  .gradient-shift { animation: gradient-shift 15s ease-in-out infinite; }
`;

const BlogsMain: React.FC<BlogsMainProps> = ({ 
  initialBlogs = [], 
  totalBlogs = 0, 
  initialFilters = {} 
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : false;

  // Inject moving background styles
  useEffect(() => {
    if (!mounted) return;
    
    const existingStyle = document.getElementById('moving-bg-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'moving-bg-styles';
    styleSheet.innerText = getMovingBackgroundStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('moving-bg-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);

  // Prepare title based on filters
  let pageTitle = "Blogs";
  
  if (initialFilters.category) {
    pageTitle = `${initialFilters.category} Articles`;
  } else if (initialFilters.tag) {
    pageTitle = `${initialFilters.tag} Content`;
  } else if (initialFilters.featured) {
    pageTitle = "Featured Articles";
  }

  return (
    <>
      {/* Moving Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient blobs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-purple-200/20 dark:from-primary-500/20 dark:to-purple-500/10 rounded-full blur-3xl float-1"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-bl from-secondary-200/25 to-blue-200/15 dark:from-secondary-500/15 dark:to-blue-500/8 rounded-full blur-3xl float-2"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-tr from-purple-200/20 to-pink-200/15 dark:from-purple-500/12 dark:to-pink-500/8 rounded-full blur-3xl float-3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-100/20 to-secondary-100/15 dark:from-primary-400/10 dark:to-secondary-400/8 rounded-full blur-3xl gradient-shift"></div>
      </div>

      {/* Simple Header */}
      <div className="relative z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 justify-center">
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <BlogsPrimary 
          initialBlogs={initialBlogs} 
          totalBlogs={totalBlogs}
          initialFilters={initialFilters}
        />
      </div>
    </>
  );
};

export default BlogsMain;
