"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
// Removed broken import - using simple preloader logic

interface ImagePreloaderContextType {
  preloadedImages: Set<string>;
  preloadImage: (src: string) => Promise<void>;
  isImagePreloaded: (src: string) => boolean;
}

const ImagePreloaderContext = createContext<ImagePreloaderContextType | null>(null);

// Simple image preloader function
const preloadImageSimple = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
    img.src = src;
  });
};

export const ImagePreloaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  const preloadImage = async (src: string): Promise<void> => {
    if (preloadedImages.has(src)) return;
    
    try {
      await preloadImageSimple(src);
      setPreloadedImages(prev => new Set([...prev, src]));
    } catch (error) {
      console.warn('Failed to preload image:', src);
    }
  };

  const isImagePreloaded = (src: string): boolean => {
    return preloadedImages.has(src);
  };

  return (
    <ImagePreloaderContext.Provider value={{ preloadedImages, preloadImage, isImagePreloaded }}>
      {children}
    </ImagePreloaderContext.Provider>
  );
};

export const useImagePreloader = () => {
  const context = useContext(ImagePreloaderContext);
  if (!context) {
    throw new Error('useImagePreloader must be used within ImagePreloaderProvider');
  }
  return context;
};

// Simple hook for course image preloading
export const useCourseImagePreloader = () => {
  const { preloadImage, isImagePreloaded } = useImagePreloader();

  const preloadCourseImages = (courses: Array<{ course_image?: string }>) => {
    courses.slice(0, 6).forEach(course => {
      if (course.course_image) {
        preloadImage(course.course_image);
      }
    });
  };

  return { preloadCourseImages, isImagePreloaded };
}; 