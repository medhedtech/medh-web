/**
 * Enhanced Image Optimization Utilities for Production
 * Handles modern formats, compression, responsive sizing, and fallback strategies
 */

import { ImageProps } from 'next/image';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto' | 'jpeg' | 'jpg' | 'png';
  priority?: boolean;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  enableProxy?: boolean;
  retryCount?: number;
}

export interface ResponsiveImageSizes {
  mobile: { width: number; height: number };
  tablet: { width: number; height: number };
  desktop: { width: number; height: number };
}

// Enhanced optimization constants for production
export const IMAGE_OPTIMIZATION = {
  COURSE_CARD: {
    maxWidth: 400,
    maxHeight: 300,
    aspectRatio: 4/3,
    quality: {
      lcp: 95,
      normal: 85,
      low: 75
    },
    maxSourceWidth: 8000,
    maxSourceHeight: 6000,
    maxFileSizeMB: 15,
    formats: ['webp', 'jpg'] as const,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
  },
  COURSE_DETAIL: {
    maxWidth: 800,
    maxHeight: 600,
    aspectRatio: 4/3,
    quality: {
      lcp: 95,
      normal: 85,
      low: 75
    },
    maxSourceWidth: 8000,
    maxSourceHeight: 6000,
    maxFileSizeMB: 15,
    formats: ['webp', 'jpg'] as const,
    sizes: '(max-width: 1024px) 100vw, 800px'
  },
  HERO: {
    maxWidth: 1920,
    maxHeight: 1080,
    aspectRatio: 16/9,
    quality: {
      lcp: 95,
      normal: 90,
      low: 80
    },
    maxSourceWidth: 8000,
    maxSourceHeight: 6000,
    maxFileSizeMB: 20,
    formats: ['webp', 'jpg'] as const,
    sizes: '100vw'
  }
} as const;

// Enhanced fallback images with different scenarios
export const FALLBACK_IMAGES = {
  course: '/fallback-course-image.jpg',
  general: '/images/placeholder.jpg',
  hero: '/images/hero-placeholder.jpg',
  error: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
} as const;

// S3 URL patterns for proxy detection
const S3_PATTERNS = [
  'medhdocuments.s3.amazonaws.com',
  'medhdocuments.s3.ap-south-1.amazonaws.com',
  'medh-documents.s3.amazonaws.com',
  's3.amazonaws.com/medhdocuments',
  's3.ap-south-1.amazonaws.com/medhdocuments'
] as const;

// Check if URL needs proxy (S3 or external)
export const needsImageProxy = (url: string): boolean => {
  if (!url || url.startsWith('data:') || url.startsWith('/')) return false;
  return S3_PATTERNS.some(pattern => url.includes(pattern));
};

// Enhanced image URL optimization with proxy support
export const getOptimizedImageUrl = (
  originalUrl: string | any,
  options: ImageOptimizationOptions = {}
): string => {
  // Handle StaticImageData objects from Next.js imports
  let urlString: string;
  if (typeof originalUrl === 'object' && originalUrl?.src) {
    urlString = originalUrl.src;
  } else if (typeof originalUrl === 'string') {
    urlString = originalUrl;
  } else {
    console.warn('Invalid image URL provided:', originalUrl);
    return FALLBACK_IMAGES.error;
  }

  if (!urlString) return FALLBACK_IMAGES.error;

  const {
    width = 800,
    height = 500,
    quality = 85,
    format = 'auto',
    enableProxy = true
  } = options;

  // For local images, return as-is (handled by Next.js Image component)
  if (urlString.startsWith('/') || urlString.startsWith('./')) {
    return urlString;
  }

  // Use proxy for S3 images
  if (needsImageProxy(urlString) && enableProxy) {
    try {
      const params = new URLSearchParams();
      params.set('url', encodeURIComponent(urlString));
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', quality.toString());
      if (format !== 'auto') params.set('f', format);

      return `/api/image-proxy?${params.toString()}`;
    } catch (error) {
      console.warn('Failed to create proxy URL:', error);
      return urlString;
    }
  }

  return urlString;
};

// Generate optimized srcSet for responsive images
export const generateSrcSet = (
  originalUrl: string,
  sizes: ResponsiveImageSizes,
  format?: 'webp' | 'avif' | 'auto' | 'jpeg' | 'jpg' | 'png'
): string => {
  const srcSetEntries = [
    `${getOptimizedImageUrl(originalUrl, { ...sizes.mobile, format })} ${sizes.mobile.width}w`,
    `${getOptimizedImageUrl(originalUrl, { ...sizes.tablet, format })} ${sizes.tablet.width}w`,
    `${getOptimizedImageUrl(originalUrl, { ...sizes.desktop, format })} ${sizes.desktop.width}w`
  ];

  return srcSetEntries.join(', ');
};

// Calculate scaled dimensions maintaining aspect ratio
export const calculateScaledDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const scaleX = maxWidth / originalWidth;
  const scaleY = maxHeight / originalHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
  
  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale)
  };
};

// Get responsive image sizes string
export const getImageSizes = (type: 'card' | 'detail' | 'hero'): string => {
  switch (type) {
    case 'card':
      return IMAGE_OPTIMIZATION.COURSE_CARD.sizes;
    case 'detail':
      return IMAGE_OPTIMIZATION.COURSE_DETAIL.sizes;
    case 'hero':
      return IMAGE_OPTIMIZATION.HERO.sizes;
    default:
      return '100vw';
  }
};

// Enhanced safe course image URL with intelligent fallbacks
export const getSafeCourseImageUrl = (
  courseImage: string | undefined | null,
  courseId?: string,
  courseTitle?: string
): string => {
  // If no image provided, use fallback
  if (!courseImage) {
    return FALLBACK_IMAGES.course;
  }

  // Handle known problematic URLs
  if (courseImage.includes('undefined') || courseImage.includes('null')) {
    return FALLBACK_IMAGES.course;
  }

  // For course-specific optimizations
  if (courseId || courseTitle) {
    const id = courseId?.toLowerCase() || '';
    const title = courseTitle?.toLowerCase() || '';
    
    // Map to optimized local images where available
    const courseImageMap: Record<string, string> = {
      'ai_data_science': '/images/courses/ai-data-science.png',
      'digital_marketing': '/images/courses/digital-marketing.png',
      'personality_development': '/images/courses/personality-development.jpg',
      'vedic_mathematics': '/images/courses/vedic-mathematics.jpg'
    };

    // Check for matches
    for (const [key, localImage] of Object.entries(courseImageMap)) {
      if (id.includes(key) || title.includes(key.replace('_', ' '))) {
        return localImage;
      }
    }
  }

  return courseImage;
};

// Generate blur placeholder with proper browser compatibility
export const generateBlurPlaceholder = (width: number = 400, height: number = 300): string => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#e2e8f0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${width/2}" cy="${height/2-20}" r="20" fill="#94a3b8" opacity="0.3"/>
    <rect x="${width/2-40}" y="${height/2+10}" width="80" height="6" rx="3" fill="#94a3b8" opacity="0.3"/>
  </svg>`;
  
  // Use URL encoding for better browser compatibility
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Get image optimization settings
export const getImageOptimization = (type: keyof typeof IMAGE_OPTIMIZATION) => {
  return IMAGE_OPTIMIZATION[type];
};

// Enhanced image props generator for Next.js Image component
export const getImageProps = (
  type: keyof typeof IMAGE_OPTIMIZATION,
  src: string,
  alt: string,
  isLCP: boolean = false,
  useFill: boolean = false,
  originalDimensions?: { width: number; height: number }
): Partial<ImageProps> => {
  const optimization = getImageOptimization(type);
  
  // Calculate scaled dimensions
  let scaledDimensions: { width: number; height: number };
  
  if (originalDimensions) {
    scaledDimensions = calculateScaledDimensions(
      originalDimensions.width,
      originalDimensions.height,
      optimization.maxWidth,
      optimization.maxHeight
    );
  } else {
    scaledDimensions = {
      width: optimization.maxWidth,
      height: Math.round(optimization.maxWidth / optimization.aspectRatio)
    };
  }

  // Get optimized source URL
  const optimizedSrc = getSafeCourseImageUrl(src);
  const finalSrc = getOptimizedImageUrl(optimizedSrc, {
    width: scaledDimensions.width,
    height: scaledDimensions.height,
    quality: isLCP ? optimization.quality.lcp : optimization.quality.normal,
    enableProxy: true
  });

  const baseProps = {
    src: finalSrc,
    alt,
    quality: isLCP ? optimization.quality.lcp : optimization.quality.normal,
    loading: isLCP ? 'eager' as const : 'lazy' as const,
    priority: isLCP,
    sizes: optimization.sizes,
    className: "object-cover transition-opacity duration-300",
    placeholder: "blur" as const,
    blurDataURL: generateBlurPlaceholder(scaledDimensions.width, scaledDimensions.height)
  };

  // Handle fill vs fixed dimensions
  if (useFill) {
    return {
      ...baseProps,
      fill: true,
      style: {
        objectFit: 'cover',
        objectPosition: 'center'
      }
    };
  }

  return {
    ...baseProps,
    width: scaledDimensions.width,
    height: scaledDimensions.height,
    style: {
      width: '100%',
      height: 'auto',
      maxWidth: '100%'
    }
  };
};

// Image preloading utility
export const preloadImage = (src: string, options: ImageOptimizationOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const optimizedSrc = getOptimizedImageUrl(src, options);
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${optimizedSrc}`));
    img.src = optimizedSrc;
  });
};

// Batch image preloading
export const preloadImages = async (
  urls: string[], 
  options: ImageOptimizationOptions = {}
): Promise<void> => {
  const preloadPromises = urls.map(url => preloadImage(url, options));
  await Promise.allSettled(preloadPromises);
};

// Image dimension detection
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

// Client-side image compression
export const compressImage = (
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: string;
  } = {}
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1200,
      maxHeight = 800,
      quality = 0.85,
      format = 'image/webp'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas compression failed'));
          }
        },
        format,
        quality
      );
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
};

// Export constants for external use
export const IMAGE_CONSTANTS = {
  MAX_WIDTH: 8000,
  MAX_HEIGHT: 6000,
  DEFAULT_QUALITY: 85,
  DEFAULT_FORMAT: 'webp' as const,
  FALLBACK_IMAGES,
  S3_PATTERNS
} as const; 