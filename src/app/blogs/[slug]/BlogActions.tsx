'use client';

import React from 'react';
import { Share2, Bookmark } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BlogActionsProps {
  blogId: string;
}

export default function BlogActions({ blogId }: BlogActionsProps) {
  // Define share functionality
  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator
          .share({
            title: document.title,
            url: window.location.href,
          })
          .then(() => {
            console.log('Content shared successfully');
          })
          .catch((error) => {
            console.error('Error sharing content:', error);
            fallbackShare();
          });
      } else {
        fallbackShare();
      }
    } catch (error) {
      console.error('Share error:', error);
      fallbackShare();
    }
  };

  // Fallback for browsers without native sharing
  const fallbackShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Blog link copied to clipboard!');
    } catch (error) {
      console.error('Clipboard error:', error);
      toast.error('Could not copy link. Please try again.');
    }
  };

  // Handle bookmarking
  const handleBookmark = () => {
    try {
      // This would typically connect to a user's bookmarks in a real implementation
      toast.success('Blog added to your bookmarks!');
      
      // Simple localStorage implementation
      if (typeof window !== 'undefined') {
        const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
        if (!bookmarks.includes(blogId)) {
          bookmarks.push(blogId);
          localStorage.setItem('blog-bookmarks', JSON.stringify(bookmarks));
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error('Could not bookmark this post. Please try again.');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={handleShare}
        aria-label="Share this post" 
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button 
        onClick={handleBookmark}
        aria-label="Bookmark this post" 
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Bookmark className="w-5 h-5" />
      </button>
    </div>
  );
} 