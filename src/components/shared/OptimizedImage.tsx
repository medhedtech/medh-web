"use client";
import React, { useState, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { shimmer, toBase64 } from '@/utils/imageUtils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete' | 'alt'> {
  alt?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
  quality,
  priority = false,
  loading,
  sizes,
  fill,
  width,
  height,
  style,
  fallbackSrc,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackAttempts, setFallbackAttempts] = useState(0);

  // Define fallback hierarchy
  const getFallbackSrc = useCallback((attemptNumber: number): string => {
    const fallbacks = [
      fallbackSrc || '/fallback-course-image.jpg',
      '/fallback-course-image 2.jpg',
      '/images/placeholder.jpg',
      // Generate a data URL as last resort
      `data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`
    ];
    
    return fallbacks[Math.min(attemptNumber, fallbacks.length - 1)];
  }, [fallbackSrc]);

  // Handle successful load
  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  }, [onLoad]);

  // Handle load error with progressive fallback
  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Image failed to load: ${currentSrc}, attempting fallback ${fallbackAttempts + 1}`);
    
    if (fallbackAttempts < 3) {
      const nextFallback = getFallbackSrc(fallbackAttempts);
      setCurrentSrc(nextFallback);
      setFallbackAttempts(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
      if (onError) onError(e);
    }
  }, [currentSrc, fallbackAttempts, getFallbackSrc, onError]);

  // Reset state when src changes
  React.useEffect(() => {
    if (src !== currentSrc && fallbackAttempts === 0) {
      setCurrentSrc(src);
      setIsLoading(true);
      setHasError(false);
      setFallbackAttempts(0);
    }
  }, [src, currentSrc, fallbackAttempts]);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;

  // Combine classes with better error and loading states
  const imageClasses = `
    ${className}
    ${isLoading ? 'opacity-0' : 'opacity-100'}
    ${hasError ? 'filter grayscale opacity-50' : ''}
    transition-opacity duration-300 ease-in-out
  `.trim();

  // Determine image props based on fill mode
  const finalAlt = alt || 'Image';
  
  // Build base props
  const baseProps = {
    src: currentSrc,
    alt: hasError ? `${finalAlt} (fallback)` : finalAlt,
    className: imageClasses,
    placeholder,
    blurDataURL: defaultBlurDataURL,
    quality: quality || 85,
    priority,
    loading: loading || (priority ? 'eager' : 'lazy'),
    sizes: sizes || '100vw'
  };

  // Handle fill mode vs fixed dimensions separately
  let imageProps: Partial<ImageProps>;
  
  if (fill) {
    // For fill mode, don't include width, height, or conflicting styles
    imageProps = {
      ...baseProps,
      fill: true,
      style: {
        objectFit: 'cover',
        objectPosition: 'center',
        ...style // Allow custom styles but don't override objectFit/objectPosition
      }
    };
  } else if (width && height) {
    // For fixed dimensions, include width/height and different styles
    imageProps = {
      ...baseProps,
      width,
      height,
      style: {
        maxWidth: '100%',
        height: 'auto',
        ...style
      }
    };
  } else {
    // Fallback case - use intrinsic sizing
    imageProps = {
      ...baseProps,
      style: {
        maxWidth: '100%',
        height: 'auto',
        ...style
      }
    };
  }

  return (
    <Image
      {...imageProps}
      {...props}
      onLoadingComplete={handleLoad}
      onError={handleError}
    />
  );
};

export default OptimizedImage; 