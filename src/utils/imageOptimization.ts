/**
 * Image Optimization Utilities for LCP Improvement
 * Handles modern formats, compression, and responsive sizing
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
}

export interface ResponsiveImageSizes {
  mobile: { width: number; height: number };
  tablet: { width: number; height: number };
  desktop: { width: number; height: number };
}

// Maximum allowed dimensions
const MAX_IMAGE_WIDTH = 9000;
const MAX_IMAGE_HEIGHT = 7000;

// Modern image format detection
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(true); // Assume support on server
      return;
    }
    
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false); // Conservative approach for server
      return;
    }
    
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

// Get optimal image format based on browser support
export const getOptimalFormat = async (originalFormat?: string): Promise<string> => {
  if (typeof window === 'undefined') {
    return 'webp'; // Default to WebP on server
  }

  const [avifSupported, webpSupported] = await Promise.all([
    supportsAVIF(),
    supportsWebP()
  ]);

  if (avifSupported) return 'avif';
  if (webpSupported) return 'webp';
  return originalFormat || 'jpg';
};

// Generate responsive image sizes for course cards
export const getCourseCardSizes = (viewportWidth: number): string => {
  if (viewportWidth < 640) {
    return '100vw'; // Full width on mobile
  } else if (viewportWidth < 768) {
    return '50vw';  // Two columns on small tablets
  } else if (viewportWidth < 1024) {
    return '33vw';  // Three columns on large tablets
  } else {
    return '25vw';  // Four columns on desktop
  }
};

// Generate optimized image URL with compression and format conversion
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
    return '';
  }

  if (!urlString) return '';

  const {
    width = 800,
    height = 500,
    quality = 85,
    format = 'auto'
  } = options;

  // For local images, return as-is (will be handled by Next.js Image component)
  if (urlString.startsWith('/') || urlString.startsWith('./')) {
    return urlString;
  }

  // Use our image optimization API for external images
  try {
    const params = new URLSearchParams();
    params.set('url', urlString);
    params.set('w', width.toString());
    params.set('h', height.toString());
    params.set('q', quality.toString());
    if (format !== 'auto') {
      params.set('f', format);
    }

    return `/api/image-optimization?${params.toString()}`;
  } catch {
    return urlString;
  }
};

// Generate srcSet for responsive images
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

// Generate sizes attribute for responsive images
export const generateSizesAttribute = (breakpoints?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw'
  } = breakpoints || {};

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
};

// Constants for image dimensions
export const IMAGE_DIMENSIONS = {
  COURSE_CARD: {
    width: 400,
    height: 250,
    maxWidth: 9000,
    maxHeight: 7000,
    quality: {
      lcp: 95,
      normal: 85
    }
  },
  COURSE_DETAIL: {
    width: 800,
    height: 500,
    maxWidth: 9000,
    maxHeight: 7000,
    quality: {
      lcp: 95,
      normal: 85
    }
  }
} as const;

// Function to get image dimensions based on type
export const getImageDimensions = (type: keyof typeof IMAGE_DIMENSIONS) => {
  return IMAGE_DIMENSIONS[type];
};

// Function to get responsive image sizes
export const getImageSizes = (type: 'card' | 'detail' | 'hero') => {
  switch (type) {
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
    case 'detail':
      return '(max-width: 1024px) 100vw, 800px';
    case 'hero':
      return '100vw';
    default:
      return '100vw';
  }
};

// Function to optimize course image URL
export const optimizeCourseImage = (src: string): string => {
  // If it's already an optimized URL or a data URL, return as is
  if (src.startsWith('data:') || src.includes('?w=')) {
    return src;
  }

  // Add width and quality parameters for CDN optimization
  const width = 800; // Default width for optimization
  const quality = 85; // Default quality
  
  // Check if the URL already has parameters
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}w=${width}&q=${quality}`;
};

// Function to generate a simple SVG blur placeholder
const generateBlurPlaceholder = (width: number, height: number): string => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#e2e8f0"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Function to get image props for Next.js Image component
export const getImageProps = (
  type: keyof typeof IMAGE_DIMENSIONS,
  src: string,
  alt: string,
  isLCP: boolean = false,
  useFill: boolean = false
): Partial<ImageProps> => {
  const dimensions = getImageDimensions(type);
  
  const baseProps = {
    src: optimizeCourseImage(src),
    alt,
    quality: isLCP ? dimensions.quality.lcp : dimensions.quality.normal,
    loading: isLCP ? 'eager' as const : 'lazy' as const,
    priority: isLCP,
    sizes: getImageSizes(type === 'COURSE_CARD' ? 'card' : 'detail'),
    className: "object-cover transition-opacity duration-300 gpu-accelerated",
    placeholder: "blur" as const,
    blurDataURL: generateBlurPlaceholder(dimensions.width, dimensions.height)
  };

  // If using fill mode, don't include width and height
  if (useFill) {
    return {
      ...baseProps,
      fill: true,
      style: {
        maxWidth: dimensions.maxWidth,
        maxHeight: dimensions.maxHeight
      }
    };
  }

  // If not using fill mode, include width and height
  return {
    ...baseProps,
    width: dimensions.width,
    height: dimensions.height,
    style: {
      maxWidth: '100%',
      height: 'auto'
    }
  };
};

// Function to preload critical images
export const preloadCriticalImage = (imageUrl: string) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizeCourseImage(imageUrl);
  document.head.appendChild(link);
};

// Function to generate blur data URL
export const generateBlurDataURL = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error generating blur data URL:', error);
    return undefined;
  }
};

// Compress image file (client-side)
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
      // Calculate new dimensions
      let { width, height } = img;
      
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

// Lazy loading with intersection observer
export const createLazyImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

// Image optimization middleware for Next.js
export const nextImageLoader = ({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}): string => {
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }

  return `${src}?${params.toString()}`;
};

// Export constants
export const IMAGE_CONSTANTS = {
  MAX_WIDTH: MAX_IMAGE_WIDTH,
  MAX_HEIGHT: MAX_IMAGE_HEIGHT,
  DEFAULT_QUALITY: 85,
  DEFAULT_FORMAT: 'webp' as const
}; 