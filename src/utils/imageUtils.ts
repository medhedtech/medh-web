// Image optimization utilities

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

// Generate placeholder image data URL for course cards
export const generateCoursePlaceholder = (width: number = 400, height: number = 250) => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc"/>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="${width-40}" height="${height-40}" rx="12" fill="url(#grad)"/>
      <circle cx="${width/2}" cy="${height/2-20}" r="24" fill="#94a3b8"/>
      <rect x="${width/2-60}" y="${height/2+10}" width="120" height="8" rx="4" fill="#94a3b8"/>
      <rect x="${width/2-40}" y="${height/2+25}" width="80" height="6" rx="3" fill="#cbd5e1"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

// Course category color mapping
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'data science': '#3b82f6',
    'web development': '#10b981',
    'mobile development': '#8b5cf6',
    'ai & ml': '#f59e0b',
    'cloud computing': '#06b6d4',
    'cybersecurity': '#ef4444',
    'blockchain': '#6366f1',
    'devops': '#f97316',
    'digital marketing': '#ec4899',
    'business': '#84cc16',
    'finance': '#14b8a6',
    'design': '#f43f5e',
    'default': '#6b7280'
  };
  
  const key = category.toLowerCase();
  return colors[key] || colors.default;
};

// Image optimization settings for Next.js
export const imageOptimizations = {
  quality: 85,
  format: 'webp' as const,
  sizes: {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1200px) 50vw', 
    desktop: '33vw'
  },
  placeholder: 'blur' as const,
  priority: false
};

// Lazy loading configuration
export const lazyLoadConfig = {
  rootMargin: '50px 0px',
  threshold: 0.1,
  triggerOnce: true
}; 