"use client";

import React, { memo } from 'react';

interface OptimizedLoaderProps {
  type?: 'default' | 'skeleton' | 'minimal' | 'card';
  className?: string;
  height?: number;
  width?: number;
  count?: number;
}

const OptimizedLoader: React.FC<OptimizedLoaderProps> = memo(({
  type = 'default',
  className = '',
  height,
  width,
  count = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const style = {
    height: height ? `${height}px` : undefined,
    width: width ? `${width}px` : undefined,
  };

  if (type === 'minimal') {
    return (
      <div className={`${baseClasses} w-8 h-8 ${className}`} style={style} />
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} style={style}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-r-2 border-green-500 border-solid rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  );
});

OptimizedLoader.displayName = 'OptimizedLoader';

export default OptimizedLoader; 