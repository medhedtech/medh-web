'use client';

import { Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface BlogInteractiveButtonsProps {
  title: string;
  description?: string;
  url?: string;
}

export default function BlogInteractiveButtons({ title, description, url }: BlogInteractiveButtonsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        // Could add a toast notification here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you could add logic to save/remove bookmark to/from localStorage or API
  };

  return (
    <div className="flex items-center gap-4">
      <button 
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        onClick={handleShare}
        aria-label="Share this article"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button 
        className={`p-2 transition-colors ${
          isBookmarked 
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
        }`}
        onClick={handleBookmark}
        aria-label="Bookmark this article"
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
} 