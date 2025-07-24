"use client";
import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';

// Enhanced interface with better type safety and more options
interface IOptimizedImageProps extends Omit<ImageProps, 'src' | 'onError' | 'onLoad'> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: (error?: string) => void;
  onLoad?: (img: HTMLImageElement) => void;
  enableProxy?: boolean;
  retryCount?: number;
  optimizationLevel?: 'low' | 'medium' | 'high';
}

// Image optimization settings
const OPTIMIZATION_SETTINGS = {
  low: { quality: 95, enableWebP: false },
  medium: { quality: 85, enableWebP: true },
  high: { quality: 75, enableWebP: true, enableAVIF: true }
} as const;

// Fallback images for different scenarios
const FALLBACK_IMAGES = {
  course: '/fallback-course-image.jpg',
  general: '/images/placeholder.jpg',
  error: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
};

// Check if URL is from S3 and needs proxy
const needsProxy = (url: string): boolean => {
  if (!url || url.startsWith('data:') || url.startsWith('/')) return false;
  
  const s3Patterns = [
    'medhdocuments.s3.amazonaws.com',
    'medhdocuments.s3.ap-south-1.amazonaws.com',
    'medh-documents.s3.amazonaws.com'
  ];
  
  return s3Patterns.some(pattern => url.includes(pattern));
};

// Generate optimized image URL
const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number | string | `${number}`,
  height?: number | string | `${number}`,
  quality?: number,
  enableProxy: boolean = true
): string => {
  if (!originalUrl) return FALLBACK_IMAGES.error;
  
  // Handle data URLs and local paths
  if (originalUrl.startsWith('data:') || originalUrl.startsWith('/')) {
    return originalUrl;
  }
  
  // Use proxy for S3 images in production
  if (needsProxy(originalUrl) && enableProxy) {
    try {
      const params = new URLSearchParams();
      params.set('url', encodeURIComponent(originalUrl));
      if (width) params.set('w', String(width));
      if (height) params.set('h', String(height));
      if (quality) params.set('q', quality.toString());
      
      return `/api/image-proxy?${params.toString()}`;
    } catch (error) {
      console.warn('Failed to create proxy URL:', error);
      return originalUrl;
    }
  }
  
  return originalUrl;
};

// Generate progressive blur placeholder
const generateBlurPlaceholder = (width: number = 400, height: number = 300): string => {
  // Use a simple, browser-compatible SVG
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#e2e8f0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;
  
  // Use btoa only in browser environment
  if (typeof window !== 'undefined') {
    try {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    } catch (error) {
      // Fallback to URL encoding if btoa fails
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
  }
  
  // Server-side fallback
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const OptimizedImage: React.FC<IOptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  fallbackSrc,
  loading = 'lazy',
  fill,
  width,
  height,
  style,
  onError: customOnError,
  onLoad: customOnLoad,
  enableProxy = true,
  retryCount = 2,
  optimizationLevel = 'medium',
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Get optimization settings
  const optimizationSettings = OPTIMIZATION_SETTINGS[optimizationLevel];
  const finalQuality = quality || optimizationSettings.quality;

  // Initialize optimized source URL
  useEffect(() => {
    if (src && src !== imgSrc) {
      setImgSrc(getOptimizedImageUrl(
        src,
        width,
        height,
        finalQuality,
        enableProxy
      ));
      setHasError(false);
      setRetryAttempts(0);
      setIsLoading(true);
    }
  }, [src, width, height, finalQuality, enableProxy, imgSrc]);

  // Handle image loading errors with retry logic
  const handleError = useCallback(() => {
    setIsLoading(false);
    
    if (retryAttempts < retryCount) {
      // Retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, retryAttempts), 5000);
      
      retryTimeoutRef.current = setTimeout(() => {
        setRetryAttempts(prev => prev + 1);
        
        // Try different strategies on retry
        if (retryAttempts === 0 && enableProxy && needsProxy(src)) {
          // First retry: try without proxy
          setImgSrc(src);
        } else if (retryAttempts === 1 && fallbackSrc) {
          // Second retry: try fallback
          setImgSrc(fallbackSrc);
        } else {
          // Final retry: use error placeholder
          setImgSrc(FALLBACK_IMAGES.error);
        }
      }, delay);
      
      return;
    }

    // All retries exhausted
    setHasError(true);
    
    // Set final fallback
    const finalFallback = fallbackSrc || 
      (src.includes('course') ? FALLBACK_IMAGES.course : FALLBACK_IMAGES.general);
    setImgSrc(finalFallback);
    
    if (customOnError) {
      customOnError(`Failed to load image after ${retryCount} retries`);
    }
  }, [retryAttempts, retryCount, enableProxy, src, fallbackSrc, customOnError]);

  // Handle successful load
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(false);
    
    if (customOnLoad) {
      customOnLoad(event.currentTarget);
    }
  }, [customOnLoad]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Generate blur placeholder with proper dimensions
  const getBlurPlaceholder = useCallback(() => {
    if (blurDataURL) return blurDataURL;
    if (placeholder !== 'blur') return undefined;
    
    const w = typeof width === 'number' ? width : Number(width) || 400;
    const h = typeof height === 'number' ? height : Number(height) || 300;
    
    return generateBlurPlaceholder(w, h);
  }, [blurDataURL, placeholder, width, height]);

  // Prepare alt text with error state
  const finalAlt = hasError ? `${alt} (fallback image)` : alt || 'Image';

  // Build optimized image props
  const imageProps: ImageProps = {
    src: imgSrc,
    alt: finalAlt,
    className: `${className} ${isLoading ? 'opacity-0 animate-pulse' : 'opacity-100'} transition-opacity duration-300`,
    placeholder,
    blurDataURL: getBlurPlaceholder(),
    quality: finalQuality,
    priority,
    loading: priority ? 'eager' : loading,
    sizes: sizes || (fill ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'),
    onLoad: handleLoad,
    onError: handleError,
    ...rest
  };

  // Handle fill vs fixed dimensions
  if (fill) {
    imageProps.fill = true;
    if (style) {
      imageProps.style = {
        objectFit: 'cover',
        objectPosition: 'center',
        ...style
      };
    }
  } else {
    imageProps.width = width || 400;
    imageProps.height = height || 300;
    if (style) {
      imageProps.style = {
        width: '100%',
        height: 'auto',
        maxWidth: '100%',
        ...style
      };
    }
  }

  return <Image {...imageProps} />;
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 