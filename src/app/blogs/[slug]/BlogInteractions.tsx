'use client';

import React from 'react';
import { Share2, Bookmark } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BlogInteractionsProps {
  blogId: string;
}

const BlogInteractions: React.FC<BlogInteractionsProps> = ({ blogId }) => {
  const handleShare = () => {
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
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast.success('Blog link copied to clipboard!');
  };

  const handleBookmark = () => {
    // This would typically connect to a user's bookmarks in a real implementation
    // For now, just show a toast message
    showToast.success('Blog added to your bookmarks!');
    
    // You could save to localStorage as a simple implementation
    const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
    if (!bookmarks.includes(blogId)) {
      bookmarks.push(blogId);
      localStorage.setItem('blog-bookmarks', JSON.stringify(bookmarks));
    }
  };

  return (
    <>
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
    </>
  );
};

export default BlogInteractions; 