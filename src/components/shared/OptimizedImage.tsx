"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { generateBlurPlaceholder } from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  onLoad,
  onError,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  style,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);
  const imageRef = useRef<HTMLImageElement>(null);

  // Simple error handler with fallback
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback image if not already using one
    if (!imageSrc.includes('fallback') && !imageSrc.includes('placeholder')) {
      setImageSrc('/fallback-course-image.jpg');
      setHasError(false); // Reset to try fallback
      return;
    }
    
    // If fallback also fails, try the basic placeholder
    if (!imageSrc.includes('image.png')) {
      setImageSrc('/image.png');
      setHasError(false);
      return;
    }
    
    if (onError) {
      onError();
    }
  }, [imageSrc, onError]);

  // Simple load handler
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Reset image source when src prop changes
  useEffect(() => {
    if (src !== imageSrc && !hasError) {
      setImageSrc(src);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src, imageSrc, hasError]);

  // Generate blur placeholder if needed
  const getBlurDataURL = () => {
    if (placeholder === 'blur') {
      return blurDataURL || generateBlurPlaceholder();
    }
    return undefined;
  };

  const blurData = getBlurDataURL();

  // Build image props with proper typing
  const imageProps: any = {
    src: imageSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    onLoad: handleLoad,
    onError: handleError,
    quality,
    priority,
    loading: priority ? 'eager' : loading,
    decoding,
    style: {
      ...style,
      // Only add width/height auto if not using fill
      ...(fill ? {} : { width: 'auto', height: 'auto' })
    },
    ref: imageRef,
    ...props
  };

  // Add dimensions for non-fill images
  if (!fill && width && height) {
    imageProps.width = width;
    imageProps.height = height;
  }

  // Add fill prop if specified
  if (fill) {
    imageProps.fill = true;
  }

  // Add sizes if specified
  if (sizes) {
    imageProps.sizes = sizes;
  }

  // Add blur placeholder if needed
  if (blurData) {
    imageProps.placeholder = 'blur';
    imageProps.blurDataURL = blurData;
  }

  return (
    <Image
      {...imageProps}
    />
  );
};

export default OptimizedImage; 