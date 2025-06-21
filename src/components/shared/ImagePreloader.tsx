"use client";
import { useEffect } from 'react';
import { preloadCriticalImage } from '@/utils/imageOptimization';

interface ImagePreloaderProps {
  images: Array<{
    url: string;
    priority?: boolean;
    width?: number;
    height?: number;
  }>;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images }) => {
  useEffect(() => {
    // Preload critical images on mount
    images.forEach((image) => {
      if (image.priority) {
        preloadCriticalImage(image.url, {
          width: image.width || 800,
          height: image.height || 500,
          fetchPriority: 'high',
          priority: true,
          format: 'webp'
        });
      }
    });
  }, [images]);

  // This component doesn't render anything visible
  return null;
};

// Hook to preload course images
export const useCourseImagePreloader = (courses: any[]) => {
  useEffect(() => {
    // Preload the first 2-3 course images for LCP
    const criticalImages = courses.slice(0, 3).map((course, index) => ({
      url: course.course_image,
      priority: index < 2,
      width: 800,
      height: 500
    }));

    criticalImages.forEach((image) => {
      if (image.url && image.priority) {
        preloadCriticalImage(image.url, {
          width: image.width,
          height: image.height,
          fetchPriority: 'high',
          priority: true,
          format: 'webp'
        });
      }
    });
  }, [courses]);
};

export default ImagePreloader; 