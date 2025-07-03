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
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate fallback URLs for S3 images
  const generateFallbacks = useCallback((originalSrc: string): string[] => {
    const fallbacks: string[] = [];
    
    // Check if it's an S3 URL that's failing
    if (originalSrc.includes('medhdocuments.s3') || originalSrc.includes('amazonaws.com')) {
      // Extract the key from the S3 URL
      const urlParts = originalSrc.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Use the proxy endpoint for S3 images
      fallbacks.push(`/api/image-proxy?url=${encodeURIComponent(originalSrc)}`);
      
      // Try different S3 endpoints
      if (originalSrc.includes('ap-south-1')) {
        // Try without region-specific endpoint
        const globalUrl = originalSrc.replace('medhdocuments.s3.ap-south-1.amazonaws.com', 'medhdocuments.s3.amazonaws.com');
        fallbacks.push(globalUrl);
        fallbacks.push(`/api/image-proxy?url=${encodeURIComponent(globalUrl)}`);
      } else {
        // Try with region-specific endpoint
        const regionalUrl = originalSrc.replace('medhdocuments.s3.amazonaws.com', 'medhdocuments.s3.ap-south-1.amazonaws.com');
        fallbacks.push(regionalUrl);
        fallbacks.push(`/api/image-proxy?url=${encodeURIComponent(regionalUrl)}`);
      }
      
      // Try direct CloudFront URL if available
      if (originalSrc.includes('medhdocuments')) {
        fallbacks.push(`https://medh-documents.s3.amazonaws.com/images/${fileName}`);
      }
      
      // Add local fallback for common images
      if (fileName.includes('course') || fileName.includes('blog')) {
        fallbacks.push('/placeholder.jpg');
      }
    }
    
    // Always add the default fallback as last resort
    fallbacks.push(fallbackSrc);
    fallbacks.push('/placeholder.jpg'); // Final fallback
    
    // Remove duplicates while preserving order
    return [...new Set(fallbacks)];
  }, [fallbackSrc]);

  // Handle image loading errors
  const handleError = useCallback(() => {
    const fallbacks = generateFallbacks(srcString);
    
    if (fallbackAttempts < fallbacks.length) {
      const currentSrc = typeof imgSrc === 'string' ? imgSrc : imgSrc.src;
      console.warn(`Image failed to load: ${currentSrc}, attempting fallback ${fallbackAttempts + 1}`);
      setImgSrc(fallbacks[fallbackAttempts]);
      setFallbackAttempts(prev => prev + 1);
      setIsLoading(true);
    } else {
      console.error(`All image fallbacks failed for: ${srcString}`);
      setHasError(true);
      // As last resort, use the original src directly, unoptimized
      setImgSrc(srcString);
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
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
      setFallbackAttempts(0);
      setUnoptimized(false);
    }
  }, [src, imgSrc, fallbackAttempts]);

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
      onLoadingComplete={handleLoad}
      onError={handleError}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 