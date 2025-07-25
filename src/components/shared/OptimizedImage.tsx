"use client";
import React, { useState, useCallback, memo } from 'react';
import Image, { ImageProps } from 'next/image';

// Simplified interface that extends Next.js ImageProps
interface IOptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

// Simple fallback images
const FALLBACK_IMAGES = {
  course: '/fallback-course-image.jpg',
  general: '/images/placeholder.jpg',
  error: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
};

// Generate simple blur placeholder
const generateBlurPlaceholder = (width: number = 400, height: number = 300): string => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f1f5f9"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const OptimizedImage: React.FC<IOptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  fallbackSrc,
  onError,
  onLoad,
  placeholder = 'blur',
  blurDataURL,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK_IMAGES.course);
  const [hasError, setHasError] = useState(false);

  // Handle image loading errors
  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    if (!hasError) {
      setHasError(true);
      const fallback = fallbackSrc || 
        (src?.includes('course') ? FALLBACK_IMAGES.course : FALLBACK_IMAGES.general);
      setImgSrc(fallback);
    }
    
    if (onError) {
      onError(event);
    }
  }, [hasError, fallbackSrc, src, onError]);

  // Handle successful load
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(false);
    
    if (onLoad) {
      onLoad(event);
    }
  }, [onLoad]);

  // Generate blur placeholder if needed
  const getBlurPlaceholder = useCallback(() => {
    if (blurDataURL) return blurDataURL;
    if (placeholder !== 'blur') return undefined;
    
    const width = typeof rest.width === 'number' ? rest.width : 400;
    const height = typeof rest.height === 'number' ? rest.height : 300;
    
    return generateBlurPlaceholder(width, height);
  }, [blurDataURL, placeholder, rest.width, rest.height]);

  // Prepare final props
  const imageProps: ImageProps = {
    src: imgSrc,
    alt: hasError ? `${alt} (fallback image)` : alt,
    className: `${className} transition-opacity duration-300`,
    placeholder,
    blurDataURL: getBlurPlaceholder(),
    onLoad: handleLoad,
    onError: handleError,
    ...rest
  };

  return <Image {...imageProps} />;
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 