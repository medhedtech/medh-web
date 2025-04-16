"use client";

import { useScrollProgress } from "@/hooks/useScrolling";

/**
 * ScrollProgress component that shows a progress bar at the top of the page 
 * indicating how far the user has scrolled through the content
 */
export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />
    </div>
  );
} 