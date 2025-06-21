/**
 * Image Optimization Utilities for LCP Improvement
 * Handles modern formats, compression, and responsive sizing
 */

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
export const getCourseCardSizes = (): ResponsiveImageSizes => ({
  mobile: { width: 400, height: 250 },
  tablet: { width: 600, height: 375 },
  desktop: { width: 800, height: 500 }
});

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

// Preload critical images for LCP optimization
export const preloadCriticalImage = (
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): void => {
  if (typeof window === 'undefined') return;

  const {
    width = 800,
    height = 500,
    format = 'webp',
    fetchPriority = 'high'
  } = options;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedImageUrl(imageUrl, { width, height, format });
  link.fetchPriority = fetchPriority;

  // Add responsive preloading
  const sizes = getCourseCardSizes();
  link.imageSrcset = generateSrcSet(imageUrl, sizes, format);
  link.imageSizes = generateSizesAttribute();

  document.head.appendChild(link);
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

// Get image dimensions without loading full image
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
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

// Generate blur placeholder
export const generateBlurPlaceholder = (width: number = 8, height: number = 6): string => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f1f5f9"/>
      <rect x="1" y="1" width="${width-2}" height="${height-2}" fill="url(#gradient)" rx="1"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Course-specific image optimization
export const optimizeCourseImage = async (
  imageUrl: string,
  isLCP: boolean = false
): Promise<{
  src: string;
  srcSet: string;
  sizes: string;
  placeholder: string;
  priority: boolean;
  fetchPriority: 'high' | 'low' | 'auto';
}> => {
  const sizes = getCourseCardSizes();
  const format = await getOptimalFormat() as 'webp' | 'avif' | 'auto' | 'jpeg' | 'jpg' | 'png';
  
  return {
    src: getOptimizedImageUrl(imageUrl, { 
      width: sizes.desktop.width, 
      height: sizes.desktop.height,
      format,
      quality: isLCP ? 95 : 85
    }),
    srcSet: generateSrcSet(imageUrl, sizes, format),
    sizes: generateSizesAttribute({
      mobile: '100vw',
      tablet: '50vw', 
      desktop: '33vw'
    }),
    placeholder: generateBlurPlaceholder(),
    priority: isLCP,
    fetchPriority: isLCP ? 'high' : 'auto'
  };
}; 