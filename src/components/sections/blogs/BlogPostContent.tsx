"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Eye, User, Tag, ArrowLeft, Share2, Bookmark, Heart } from "lucide-react";
import Link from "next/link";
import { IBlog } from "@/types/blog.types";
import { formatDistanceToNow } from "date-fns";

interface BlogPostContentProps {
  blog: IBlog;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ blog }) => {
  const [mounted, setMounted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes || 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 dark:bg-gray-600"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryName = () => {
    if (blog.categories && Array.isArray(blog.categories) && blog.categories.length > 0) {
      return typeof blog.categories[0] === 'object' 
        ? blog.categories[0].category_name 
        : blog.categories[0];
    }
    return 'Article';
  };

  const getAuthorName = () => {
    return blog.author?.name || 'Medh Editorial Team';
  };

  const getPublishedDate = () => {
    const date = blog.createdAt;
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = () => {
    return blog.reading_time || 5;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description || blog.meta_description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to local storage or user preferences
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // Here you would typically send to API
  };

  // Process and clean blog content
  const getBlogContent = () => {
    let content = blog.content || blog.description || blog.meta_description || 'Content coming soon...';
    
    // Clean up any remaining HTML artifacts and code blocks
    content = content
      .replace(/```html\s*/gi, '')
      .replace(/```\s*/g, '')
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<html[^>]*>[\s\S]*?<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      .replace(/<header[^>]*>/gi, '')
      .replace(/<\/header>/gi, '')
      .replace(/<footer[^>]*>/gi, '')
      .replace(/<\/footer>/gi, '')
      .replace(/<section[^>]*>/gi, '')
      .replace(/<\/section>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .trim();
    
    return content;
  };

  // Convert markdown-style content to JSX
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle headings
      if (trimmedLine.startsWith('## ')) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${elements.length}`} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentParagraph.join(' ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
                if (i === 0) return part;
                const [bold, rest] = part.split('</strong>');
                return <span key={i}><strong>{bold}</strong>{rest}</span>;
              })}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <h2 key={`h2-${elements.length}`} className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      }
      // Handle subheadings
      else if (trimmedLine.startsWith('### ')) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${elements.length}`} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentParagraph.join(' ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
                if (i === 0) return part;
                const [bold, rest] = part.split('</strong>');
                return <span key={i}><strong>{bold}</strong>{rest}</span>;
              })}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <h3 key={`h3-${elements.length}`} className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }
      // Handle empty lines (paragraph breaks)
      else if (trimmedLine === '') {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${elements.length}`} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentParagraph.join(' ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
                if (i === 0) return part;
                const [bold, rest] = part.split('</strong>');
                return <span key={i}><strong>{bold}</strong>{rest}</span>;
              })}
            </p>
          );
          currentParagraph = [];
        }
      }
      // Regular content lines
      else {
        currentParagraph.push(trimmedLine);
      }
    });
    
    // Flush any remaining paragraph
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={`p-${elements.length}`} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          {currentParagraph.join(' ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
            if (i === 0) return part;
            const [bold, rest] = part.split('</strong>');
            return <span key={i}><strong>{bold}</strong>{rest}</span>;
          })}
        </p>
      );
    }
    
    return elements;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative container mx-auto px-4 py-12">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/blogs"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                {getCategoryName()}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{getAuthorName()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time>{getPublishedDate()}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getReadTime()} min read</span>
              </div>
              {blog.views && blog.views > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatViews(blog.views)} views</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isLiked 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
              
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.upload_image && (
        <section className="relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  src={blog.upload_image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {renderContent(getBlogContent())}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Actions */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-600 dark:text-gray-400">
                  Enjoyed this article? Share it with others!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Share Article
                </button>
                <Link
                  href="/blogs"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  More Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostContent; 