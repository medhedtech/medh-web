"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Eye, ArrowUpRight, Tag, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "next-themes";

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    description?: string;
    excerpt?: string;
    author: {
      _id?: string;
      name?: string;
      email?: string;
    };
    publishedAt?: string;
    createdAt?: string;
    category?: string;
    categories?: Array<{
      _id: string;
      category_name: string;
      category_image?: string;
    }> | string[];
    tags?: string[];
    featured_image?: string;
    upload_image?: string;
    read_time?: number;
    reading_time?: number;
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

const BlogCard: React.FC<BlogCardProps> = ({ blog, className = "" }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
        <div className="p-6 space-y-3">
          <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  const getImageUrl = () => {
    return blog.upload_image || blog.featured_image || '';
  };

  const getExcerpt = () => {
    const content = blog.description || blog.excerpt || blog.meta_description || '';
    return content.length > 120 ? content.substring(0, 120) + '...' : content;
  };

  const getCategoryName = () => {
    if (blog.categories && Array.isArray(blog.categories) && blog.categories.length > 0) {
      return typeof blog.categories[0] === 'object' 
        ? blog.categories[0].category_name 
        : blog.categories[0];
    }
    return blog.category || 'Article';
  };

  const getAuthorName = () => {
    return blog.author?.name || 'Medh Team';
  };

  const getPublishedDate = () => {
    const date = blog.publishedAt || blog.createdAt;
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadTime = () => {
    return blog.reading_time || blog.read_time || 5;
  };

  const getBlogUrl = () => {
    return `/blogs/${blog.slug || blog._id}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <article className={`group ${className}`}>
      <Link href={getBlogUrl()} className="block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
          {/* Featured Badge */}
          {blog.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                FEATURED
              </span>
            </div>
          )}
          
          {/* Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
            {getImageUrl() && (
              <img
                src={getImageUrl()}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            )}
            {!getImageUrl() && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                  <Tag className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Category and Meta */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded font-medium">
                {getCategoryName()}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <time>{getPublishedDate()}</time>
              </div>
              {getReadTime() && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{getReadTime()} min read</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight">
              {blog.title}
            </h3>
            
            {/* Excerpt */}
            {getExcerpt() && (
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                {getExcerpt()}
              </p>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{getAuthorName()}</span>
                </div>
                {(blog.views || 0) > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatViews(blog.views || 0)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                <span>Read</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;