"use client";
import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { shimmer, toBase64 } from '@/utils/imageUtils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
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
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle successful load
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  // Handle load error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(e);
  };

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;

  // Combine classes
  const imageClasses = `
    ${className}
    ${isLoading ? 'opacity-0' : 'opacity-100'}
    ${hasError ? 'filter grayscale' : ''}
    transition-opacity duration-300
  `.trim();

  // Determine image props based on fill mode
  const imageProps: Partial<ImageProps> = {
    src: hasError ? '/fallback-course-image.jpg' : src,
    alt,
    className: imageClasses,
    placeholder,
    blurDataURL: defaultBlurDataURL,
    quality: quality || 85,
    priority,
    loading: loading || (priority ? 'eager' : 'lazy'),
    sizes: sizes || '100vw',
    style
  };

  // Add either fill or dimensions, but not both
  if (fill) {
    imageProps.fill = true;
  } else if (width && height) {
    imageProps.width = width;
    imageProps.height = height;
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