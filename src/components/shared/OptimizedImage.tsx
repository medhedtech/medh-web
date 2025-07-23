"use client";
import React, { useState, useCallback, useRef, memo } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';
import { shimmer, toBase64 } from '@/utils/imageUtils';

// Define interface with proper types
interface IOptimizedImageProps extends Omit<ImageProps, 'src' | 'onError' | 'onLoad'> {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: (img: HTMLImageElement) => void;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage: React.FC<IOptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  sizes,
  priority = false,
  quality = 90,
  placeholder = 'blur',
  blurDataURL,
  fallbackSrc = '/placeholder.jpg',
  loading = 'lazy',
  objectFit = 'cover',
  fill,
  width,
  height,
  style,
  onError: customOnError,
  onLoad: customOnLoad,
  ...rest
}) => {
  // Convert StaticImageData to string if needed
  const srcString = typeof src === 'string' ? src : src.src;
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fallbackAttempts, setFallbackAttempts] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate optimized fallback URLs for S3 images
  const generateFallbacks = useCallback((originalSrc: string): string[] => {
    const fallbacks: string[] = [];
    
    // Check if it's an S3 URL that's failing
    if (originalSrc.includes('medhdocuments.s3') || originalSrc.includes('amazonaws.com')) {
      // Extract the key from the S3 URL
      const urlParts = originalSrc.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Prioritize most likely to work fallbacks first
      
      // 1. Try global S3 endpoint (most reliable)
      if (originalSrc.includes('ap-south-1')) {
        const globalUrl = originalSrc.replace('medhdocuments.s3.ap-south-1.amazonaws.com', 'medhdocuments.s3.amazonaws.com');
        fallbacks.push(globalUrl);
      }
      
      // 2. Try image proxy as backup (server-side processing)
      fallbacks.push(`/api/image-proxy?url=${encodeURIComponent(originalSrc)}`);
      
      // 3. For course/blog images, go straight to placeholder (faster UX)
      if (fileName.includes('course') || fileName.includes('blog')) {
        fallbacks.push('/fallback-course-image.jpg');
      }
    }
    
    // Always add the default fallbacks as last resort
    fallbacks.push(fallbackSrc);
    fallbacks.push('/placeholder.jpg');
    
    // Remove duplicates while preserving order
    return [...new Set(fallbacks)];
  }, [fallbackSrc]);

  // Handle image loading errors with optimized fallback strategy
  const handleError = useCallback(() => {
    const fallbacks = generateFallbacks(srcString);
    
    if (fallbackAttempts < fallbacks.length) {
      const currentSrc = typeof imgSrc === 'string' ? imgSrc : imgSrc.src;
      
      // Only log in development to reduce console noise in production
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Image failed to load: ${currentSrc}, attempting fallback ${fallbackAttempts + 1}`);
      }
      
      // Clear any existing timeout
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      
      // Add small delay before trying next fallback to avoid rapid requests
      const timeout = setTimeout(() => {
        setImgSrc(fallbacks[fallbackAttempts]);
        setFallbackAttempts(prev => prev + 1);
        setIsLoading(true);
        setRetryTimeout(null);
      }, Math.min(100 * (fallbackAttempts + 1), 500)); // Exponential backoff up to 500ms
      
      setRetryTimeout(timeout);
    } else {
      // Log final failure only in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`All image fallbacks failed for: ${srcString}`);
      }
      
      setHasError(true);
      // Use placeholder as final fallback for better UX
      setImgSrc('/placeholder.jpg');
      setUnoptimized(true);
      if (customOnError) customOnError();
    }
  }, [srcString, imgSrc, fallbackAttempts, generateFallbacks, customOnError]);

  // Track if we should use unoptimized mode
  const [unoptimized, setUnoptimized] = useState(false);

  // Handle successful load
  const handleLoad = useCallback((img: any) => {
    setIsLoading(false);
    setHasError(false);
    if (customOnLoad) customOnLoad(img);
  }, [customOnLoad]);

  // Reset state when src changes
  React.useEffect(() => {
    if (src !== imgSrc && fallbackAttempts === 0) {
      // Clear any pending retry timeout
      if (retryTimeout) {
        clearTimeout(retryTimeout);
        setRetryTimeout(null);
      }
      
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
      setFallbackAttempts(0);
      setUnoptimized(false);
    }
  }, [src, imgSrc, fallbackAttempts, retryTimeout]);
  
  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || (placeholder === 'blur' ? `data:image/svg+xml;base64,${toBase64(shimmer(Number(width) || 400, Number(height) || 300))}` : undefined);

  // Prepare alt text
  const finalAlt = alt || 'Image';

  // Determine image classes
  const imageClasses = `
    ${className}
    ${isLoading ? 'animate-pulse' : ''}
    ${hasError ? 'opacity-50' : ''}
    transition-opacity duration-300
  `.trim();

  // Build base props
  const baseProps: Partial<ImageProps> = {
    src: imgSrc,
    alt: hasError ? `${finalAlt} (fallback)` : finalAlt,
    className: imageClasses,
    placeholder,
    blurDataURL: defaultBlurDataURL,
    quality,
    priority,
    loading,
    sizes: sizes || '100vw',
    unoptimized,
  };

  // Conditional props based on layout type
  const imageProps = fill
    ? {
        ...baseProps,
        fill: true,
        style: {
          objectFit: objectFit || 'cover',
          ...style,
        },
      }
    : {
        ...baseProps,
        width: width || 400,
        height: height || 300,
        style,
      };

  return (
    <Image
      {...(imageProps as any)}
      {...rest}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 