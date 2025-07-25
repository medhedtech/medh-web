"use client";
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 85,
  sizes,
  className,
  style,
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/fallback-course-image.jpg',
  onLoad,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    onError?.(e);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(false);
    onLoad?.(e);
  };

  // Industry standard props for Next.js Image
  const imageProps = {
    src: imgSrc,
    alt,
    priority,
    quality,
    className,
    style,
    onLoad: handleLoad,
    onError: handleError,
    placeholder,
    blurDataURL,
    ...props
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes || "100vw"}
        style={{
          objectFit: 'cover',
          ...style
        }}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
      sizes={sizes}
    />
  );
};

export default OptimizedImage; 