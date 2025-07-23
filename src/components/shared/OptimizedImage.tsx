"use client";
import React, { useState, useCallback, memo } from 'react';
import Image, { ImageProps } from 'next/image';

// Define interface with proper types
interface IOptimizedImageProps extends Omit<ImageProps, 'src' | 'onError' | 'onLoad'> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: (img: HTMLImageElement) => void;
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
  fallbackSrc = '/images/placeholder.jpg',
  loading = 'lazy',
  fill,
  width,
  height,
  style,
  onError: customOnError,
  onLoad: customOnLoad,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  // Handle image loading errors with simple fallback
  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      if (customOnError) customOnError();
    }
  }, [hasError, fallbackSrc, customOnError]);

  // Handle successful load
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    if (customOnLoad) customOnLoad(event.currentTarget);
  }, [customOnLoad]);

  // Generate simple blur placeholder with browser-compatible base64 encoding
  const defaultBlurDataURL = blurDataURL || (placeholder === 'blur' ? 
    `data:image/svg+xml;base64,${typeof window !== 'undefined' ? btoa(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f1f5f9"/>
      </svg>`
    ) : ''}` : undefined);

  // Prepare alt text
  const finalAlt = alt || 'Image';

  // Build image props
  const imageProps: ImageProps = {
    src: imgSrc,
    alt: hasError ? `${finalAlt} (fallback)` : finalAlt,
    className,
    placeholder,
    blurDataURL: defaultBlurDataURL,
    quality,
    priority,
    loading,
    sizes: sizes || '100vw',
    onLoad: handleLoad,
    onError: handleError,
    ...rest
  };

  // Add layout-specific props
  if (fill) {
    imageProps.fill = true;
    if (style) {
      imageProps.style = style;
    }
  } else {
    imageProps.width = width || 400;
    imageProps.height = height || 300;
    if (style) {
      imageProps.style = style;
    }
  }

  return <Image {...imageProps} />;
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 