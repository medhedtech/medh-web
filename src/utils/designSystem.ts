import { clsx } from 'clsx';

// Enhanced semantic color function with extended corporate colors
export const getEnhancedSemanticColor = (category: string, variant: string = 'light') => {
  const colorMap = {
    courses: {
      light: '#3b82f6',
      dark: '#1e40af',
      bg: 'rgba(59, 130, 246, 0.15)',
      glass: 'rgba(59, 130, 246, 0.08)',
      gradient: 'from-blue-500 to-blue-600'
    },
    pricing: {
      light: '#10b981',
      dark: '#047857',
      bg: 'rgba(16, 185, 129, 0.15)',
      glass: 'rgba(16, 185, 129, 0.08)',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    certification: {
      light: '#f59e0b',
      dark: '#d97706',
      bg: 'rgba(245, 158, 11, 0.15)',
      glass: 'rgba(245, 158, 11, 0.08)',
      gradient: 'from-amber-500 to-amber-600'
    },
    support: {
      light: '#8b5cf6',
      dark: '#7c3aed',
      bg: 'rgba(139, 92, 246, 0.15)',
      glass: 'rgba(139, 92, 246, 0.08)',
      gradient: 'from-violet-500 to-violet-600'
    },
    enrollment: {
      light: '#ec4899',
      dark: '#db2777',
      bg: 'rgba(236, 72, 153, 0.15)',
      glass: 'rgba(236, 72, 153, 0.08)',
      gradient: 'from-pink-500 to-pink-600'
    },
    corporate: {
      light: '#6366f1',
      dark: '#4338ca',
      bg: 'rgba(99, 102, 241, 0.15)',
      glass: 'rgba(99, 102, 241, 0.08)',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    professional: {
      light: '#1e40af',
      dark: '#1e3a8a',
      bg: 'rgba(30, 64, 175, 0.15)',
      glass: 'rgba(30, 64, 175, 0.08)',
      gradient: 'from-blue-700 to-indigo-700'
    }
  };

  return colorMap[category as keyof typeof colorMap]?.[variant as keyof typeof colorMap[keyof typeof colorMap]] || '#3b82f6';
};

// Glassmorphism utility functions
export const getGlassmorphism = (variant: 'subtle' | 'gentle' | 'moderate' | 'prominent' = 'gentle') => {
  const variants = {
    subtle: 'bg-white/3 backdrop-blur-[4px] border-white/8',
    gentle: 'bg-white/6 backdrop-blur-[8px] border-white/12',
    moderate: 'bg-white/8 backdrop-blur-[12px] border-white/18',
    prominent: 'bg-white/12 backdrop-blur-[16px] border-white/25'
  };
  
  return variants[variant];
};

// Enhanced responsive utility functions with mobile-first approach
export const getResponsive = {
  // Fluid typography with better mobile scaling
  fluidText: (size: 'caption' | 'body' | 'subheading' | 'heading' | 'display' = 'body') => {
    const sizes = {
      caption: 'text-[clamp(0.75rem,1.5vw+0.5rem,0.875rem)]',
      body: 'text-[clamp(0.875rem,2vw+0.5rem,1rem)]',
      subheading: 'text-[clamp(1.125rem,3vw+0.75rem,1.5rem)]',
      heading: 'text-[clamp(1.25rem,4vw+1rem,2.5rem)]',
      display: 'text-[clamp(1.75rem,6vw+1rem,4rem)]'
    };
    return sizes[size];
  },

  // Enhanced grid system with better mobile breakpoints
  grid: (config: { mobile: number; tablet?: number; desktop?: number; gap?: 'sm' | 'md' | 'lg' }) => {
    const { mobile, tablet = mobile * 2, desktop = tablet + 1, gap = 'md' } = config;
    const gaps = {
      sm: 'gap-2 sm:gap-3 md:gap-4',
      md: 'gap-3 sm:gap-4 md:gap-6',
      lg: 'gap-4 sm:gap-6 md:gap-8'
    };
    return `grid grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop} ${gaps[gap]}`;
  },

  // Mobile-optimized spacing
  spacing: (size: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' = 'base') => {
    const spacing = {
      xs: 'p-2 sm:p-3 md:p-4',
      sm: 'p-3 sm:p-4 md:p-5',
      base: 'p-4 sm:p-5 md:p-6',
      md: 'p-5 sm:p-6 md:p-8',
      lg: 'p-6 sm:p-8 md:p-10',
      xl: 'p-8 sm:p-10 md:p-12',
      '2xl': 'p-10 sm:p-12 md:p-16',
      '3xl': 'p-12 sm:p-16 md:p-20'
    };
    return spacing[size];
  },

  // Mobile container with proper touch spacing
  container: (size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg') => {
    const containers = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full'
    };
    return `${containers[size]} mx-auto px-4 sm:px-6 md:px-8`;
  },

  // Mobile-first section padding
  sectionPadding: (size: 'sm' | 'md' | 'lg' = 'md') => {
    const paddings = {
      sm: 'py-8 sm:py-10 md:py-12',
      md: 'py-10 sm:py-12 md:py-16',
      lg: 'py-12 sm:py-16 md:py-20'
    };
    return paddings[size];
  },

  // Touch-friendly button sizing
  touchTarget: (size: 'sm' | 'md' | 'lg' = 'md') => {
    const targets = {
      sm: 'min-h-[40px] min-w-[40px] p-2',
      md: 'min-h-[44px] min-w-[44px] p-3',
      lg: 'min-h-[48px] min-w-[48px] p-4'
    };
    return targets[size];
  },

  // Mobile-optimized image aspect ratios
  imageAspect: (ratio: '16:9' | '4:3' | '1:1' | '3:2' = '16:9') => {
    const ratios = {
      '16:9': 'aspect-[16/9]',
      '4:3': 'aspect-[4/3]',
      '1:1': 'aspect-square',
      '3:2': 'aspect-[3/2]'
    };
    return ratios[ratio];
  }
};

// Animation utilities
export const getAnimations = {
  transition: (duration: 'quick' | 'fast' | 'normal' | 'smooth' | 'slow' = 'normal') => {
    const durations = {
      quick: 'transition-all duration-100 ease-out',
      fast: 'transition-all duration-150 ease-out',
      normal: 'transition-all duration-200 ease-in-out',
      smooth: 'transition-all duration-250 ease-in-out',
      slow: 'transition-all duration-300 ease-in-out'
    };
    return durations[duration];
  },

  hover: (type: 'subtle' | 'gentle' | 'elegant' = 'gentle') => {
    const types = {
      subtle: 'hover:-translate-y-0.5 hover:scale-[1.01]',
      gentle: 'hover:-translate-y-1 hover:scale-[1.02]',
      elegant: 'hover:-translate-y-1.5 hover:scale-[1.03]'
    };
    return types[type];
  }
};

// Component builders
export const buildComponent = {
  // Section wrapper
  section: (theme: 'light' | 'dark' = 'light') => {
    return theme === 'light' 
      ? 'bg-slate-50 dark:bg-slate-900 min-h-screen'
      : 'bg-slate-900 dark:bg-slate-950 min-h-screen';
  },

  // Container
  container: () => 'max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12',

  // Card variants
  card: (variant: 'minimal' | 'elegant' | 'premium' = 'elegant', padding: 'mobile' | 'tablet' | 'desktop' = 'mobile') => {
    const variants = {
      minimal: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm',
      elegant: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg md:rounded-xl shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50',
      premium: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/30 dark:shadow-slate-900/30'
    };

    const paddings = {
      mobile: 'p-4 sm:p-5',
      tablet: 'p-5 sm:p-6 md:p-7',
      desktop: 'p-6 sm:p-7 md:p-8 lg:p-10'
    };

    return `${variants[variant]} ${paddings[padding]}`;
  },

  // Button variants
  button: (variant: 'primary' | 'secondary' | 'minimal' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
      secondary: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600',
      minimal: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-md',
      md: 'px-6 py-3 text-base rounded-lg',
      lg: 'px-8 py-4 text-lg rounded-xl'
    };

    return `${variants[variant]} ${sizes[size]} font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`;
  }
};

// Advanced component builders with glassmorphism
export const buildAdvancedComponent = {
  // Glass cards
  glassCard: ({ 
    variant = 'primary', 
    hover = true,
    padding = 'mobile' 
  }: { 
    variant?: 'primary' | 'secondary' | 'hero';
    hover?: boolean;
    padding?: 'mobile' | 'tablet' | 'desktop';
  } = {}) => {
    const variants = {
      primary: 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/50 dark:border-slate-600/50',
      secondary: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/40 dark:border-slate-600/40',
      hero: 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/60 dark:border-slate-600/60'
    };

    const paddings = {
      mobile: 'p-4 sm:p-5 md:p-6',
      tablet: 'p-5 sm:p-6 md:p-7 lg:p-8',
      desktop: 'p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12'
    };

    const hoverEffects = hover ? 'hover:bg-white/95 dark:hover:bg-slate-800/95 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]' : '';

    return clsx(
      variants[variant],
      paddings[padding],
      'rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300',
      hoverEffects
    );
  },

  // Glass buttons
  glassButton: ({ 
    size = 'md',
    variant = 'primary' 
  }: { 
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary';
  } = {}) => {
    const variants = {
      primary: 'bg-blue-500/80 hover:bg-blue-600/90 backdrop-blur-md border border-blue-400/30 text-white',
      secondary: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-slate-800 dark:text-white'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-2xl'
    };

    return clsx(
      variants[variant],
      sizes[size],
      'font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'
    );
  },

  // Header card
  headerCard: () => {
    return buildComponent.card('elegant', 'tablet') + ' text-center mb-8 md:mb-12';
  },

  // Content card
  contentCard: () => {
    return buildComponent.card('premium', 'desktop');
  }
};

// Layout patterns from design system
export const layoutPatterns = {
  sectionWrapper: 'bg-slate-50 dark:bg-slate-900 min-h-screen',
  containerWrapper: 'max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12',
  headerCard: 'bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-6 md:mb-8 text-center',
  contentCard: 'bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50'
};

// Typography patterns
export const typography = {
  h1: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100',
  h2: 'text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100',
  h3: 'text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-slate-100',
  body: 'text-sm sm:text-base text-slate-600 dark:text-slate-400',
  caption: 'text-xs sm:text-sm text-slate-500 dark:text-slate-500',
  lead: 'text-base sm:text-lg text-slate-600 dark:text-slate-400'
};

// Interactive patterns
export const interactive = {
  button: 'inline-flex items-center px-4 md:px-6 py-2 md:py-3 rounded-md font-medium transition-all duration-200 text-sm md:text-base',
  buttonPrimary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
  buttonSecondary: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
};

// Background patterns
export const backgroundPatterns = {
  gridPattern: 'bg-grid-pattern opacity-30 dark:opacity-20',
  gradientOverlay: (colors: string) => `bg-gradient-to-br ${colors}`,
  floatingBlobs: {
    blob1: 'absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob',
    blob2: 'absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000',
    blob3: 'absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-3xl animate-blob animation-delay-4000'
  }
};

// Corporate Training Specific Patterns
export const corporatePatterns = {
  // Enhanced header patterns for corporate pages
  heroHeader: (accent: 'blue' | 'indigo' | 'violet' | 'emerald' = 'blue') => {
    const accents = {
      blue: 'text-blue-600 dark:text-blue-400',
      indigo: 'text-indigo-600 dark:text-indigo-400',
      violet: 'text-violet-600 dark:text-violet-400',
      emerald: 'text-emerald-600 dark:text-emerald-400'
    };
    
    return {
      container: 'text-center mb-16 max-w-4xl mx-auto',
      title: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight',
      accent: accents[accent],
      subtitle: 'text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-3xl mx-auto',
      highlights: 'flex flex-wrap justify-center gap-6 text-sm sm:text-base'
    };
  },

  // Professional feature cards
  featureCard: (variant: 'standard' | 'premium' | 'enterprise' = 'standard') => {
    const variants = {
      standard: 'bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2',
      premium: 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl p-8 border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-600',
      enterprise: 'bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 group-hover:border-indigo-300 dark:group-hover:border-indigo-600'
    };
    
    return variants[variant];
  },

  // Business impact cards
  metricCard: () => ({
    container: 'bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
    icon: 'w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg',
    metric: 'text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2',
    title: 'text-xl font-bold text-slate-900 dark:text-slate-100 mb-2',
    description: 'text-slate-600 dark:text-slate-300',
    progressBar: 'w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2',
    progressFill: 'bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full'
  }),

  // Professional CTA sections
  ctaSection: (theme: 'gradient' | 'glass' | 'solid' = 'gradient') => {
    const themes = {
      gradient: 'bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800',
      glass: 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/60 dark:border-slate-600/60',
      solid: 'bg-slate-900 dark:bg-slate-800'
    };
    
    return {
      container: `${themes[theme]} rounded-3xl p-8 md:p-12 text-center relative overflow-hidden`,
      pattern: 'absolute inset-0 bg-white/5 opacity-20',
      grid: 'absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-30',
      floatingElements: {
        top: 'absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl',
        bottom: 'absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full blur-xl'
      }
    };
  },

  // Badge components
  sectionBadge: (color: 'blue' | 'indigo' | 'violet' | 'emerald' | 'amber' = 'blue') => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
      violet: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
      amber: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
    };
    
    return `inline-flex items-center ${colors[color]} px-4 py-2 rounded-full mb-6 font-semibold text-sm`;
  },

  // Value proposition highlights
  valueHighlight: (color: 'blue' | 'emerald' | 'violet' | 'amber' = 'blue') => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
      amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    };
    
    return `flex items-center ${colors[color]} px-4 py-2 rounded-full`;
  }
};

// SEO Utilities
export const seoUtils = {
  // Generate structured data for corporate training pages
  generateStructuredData: (pageData: {
    title: string;
    description: string;
    type: 'course' | 'program' | 'certification' | 'corporate';
    provider: string;
    url: string;
    image?: string;
    price?: string;
    duration?: string;
    skills?: string[];
    instructor?: {
      name: string;
      title: string;
      image?: string;
    };
  }) => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": pageData.type === 'course' ? "Course" : "EducationalOrganization",
      "name": pageData.title,
      "description": pageData.description,
      "provider": {
        "@type": "Organization",
        "name": pageData.provider,
        "url": pageData.url
      }
    };

    if (pageData.type === 'course') {
      return {
        ...baseSchema,
        "@type": "Course",
        "courseCode": pageData.title.replace(/\s+/g, '-').toLowerCase(),
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "duration": pageData.duration || "6 weeks",
          "instructor": pageData.instructor ? {
            "@type": "Person",
            "name": pageData.instructor.name,
            "jobTitle": pageData.instructor.title,
            "image": pageData.instructor.image
          } : undefined
        },
        "teaches": pageData.skills || [],
        "image": pageData.image,
        "offers": pageData.price ? {
          "@type": "Offer",
          "price": pageData.price,
          "priceCurrency": "USD"
        } : undefined
      };
    }

    return baseSchema;
  },

  // Generate meta tags for corporate training pages
  generateMetaTags: (seoData: {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    noIndex?: boolean;
    pageType?: 'website' | 'article' | 'course';
  }) => {
    const defaultKeywords = [
      'corporate training',
      'professional development',
      'enterprise training',
      'skill development',
      'online learning',
      'certification programs'
    ];

    return {
      title: seoData.title,
      description: seoData.description,
      keywords: [...defaultKeywords, ...(seoData.keywords || [])].join(', '),
      canonical: seoData.canonical,
      openGraph: {
        title: seoData.title,
        description: seoData.description,
        type: seoData.pageType || 'website',
        image: seoData.ogImage || '/images/default-og-image.jpg',
        url: seoData.canonical
      },
      twitter: {
        card: seoData.twitterCard || 'summary_large_image',
        title: seoData.title,
        description: seoData.description,
        image: seoData.ogImage || '/images/default-twitter-image.jpg'
      },
      robots: seoData.noIndex ? 'noindex,nofollow' : 'index,follow'
    };
  },

  // Generate breadcrumb structured data
  generateBreadcrumbSchema: (breadcrumbs: Array<{ name: string; url: string }>) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  },

  // Generate FAQ structured data
  generateFAQSchema: (faqs: Array<{ question: string; answer: string }>) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  },

  // SEO-optimized heading hierarchy
  headingHierarchy: {
    h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight',
    h2: 'text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight',
    h3: 'text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 leading-tight',
    h4: 'text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100',
    h5: 'text-base sm:text-lg md:text-xl font-medium text-slate-900 dark:text-slate-100',
    h6: 'text-sm sm:text-base md:text-lg font-medium text-slate-900 dark:text-slate-100'
  }
};

// Mobile-first optimization patterns
export const mobilePatterns = {
  // Mobile-optimized sections
  mobileSection: (theme: 'light' | 'dark' = 'light') => {
    const base = theme === 'light' 
      ? 'bg-slate-50 dark:bg-slate-900' 
      : 'bg-slate-900 dark:bg-slate-950';
    return `${base} ${getResponsive.sectionPadding('sm')}`;
  },

  // Mobile-friendly containers
  mobileContainer: (size: 'sm' | 'md' | 'lg' = 'md') => {
    return getResponsive.container(size);
  },

  // Mobile-optimized cards
  mobileCard: (variant: 'minimal' | 'elevated' | 'glass' = 'elevated') => {
    const variants = {
      minimal: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-4 shadow-sm',
      elevated: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300',
      glass: 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/50 dark:border-slate-600/50 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg'
    };
    return variants[variant];
  },

  // Mobile button with proper touch targets
  mobileButton: (variant: 'primary' | 'secondary' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800',
      secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700',
      ghost: 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
    };

    const sizes = {
      sm: getResponsive.touchTarget('sm') + ' px-4 text-sm rounded-lg',
      md: getResponsive.touchTarget('md') + ' px-6 text-base rounded-xl',
      lg: getResponsive.touchTarget('lg') + ' px-8 text-lg rounded-2xl'
    };

    return `${variants[variant]} ${sizes[size]} font-semibold transition-all duration-200 touch-manipulation select-none active:scale-95`;
  },

  // Mobile typography scale
  mobileTypography: {
    hero: getResponsive.fluidText('display') + ' font-bold text-slate-900 dark:text-slate-100 leading-tight tracking-tight',
    heading: getResponsive.fluidText('heading') + ' font-bold text-slate-900 dark:text-slate-100 leading-tight',
    subheading: getResponsive.fluidText('subheading') + ' font-semibold text-slate-900 dark:text-slate-100 leading-snug',
    body: getResponsive.fluidText('body') + ' text-slate-600 dark:text-slate-300 leading-relaxed',
    caption: getResponsive.fluidText('caption') + ' text-slate-500 dark:text-slate-400'
  },

  // Mobile-specific layouts
  mobileLayouts: {
    // Single column layout for mobile
    singleColumn: 'flex flex-col space-y-4 sm:space-y-6 md:space-y-8',
    
    // Two column for tablet+
    responsiveColumns: 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8',
    
    // Three column for desktop
    adaptiveGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
    
    // Card grid that adapts to screen size
    cardGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
    
    // Hero section layout
    heroLayout: 'text-center space-y-6 sm:space-y-8 md:space-y-10 max-w-4xl mx-auto',
    
    // Feature section layout
    featureLayout: 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'
  },

  // Mobile-specific spacing utilities
  mobileSpacing: {
    section: 'py-8 sm:py-12 md:py-16 lg:py-20',
    container: 'px-4 sm:px-6 md:px-8',
    cardGap: 'space-y-4 sm:space-y-6 md:space-y-8',
    elementGap: 'space-y-2 sm:space-y-3 md:space-y-4'
  },

  // Mobile image optimization
  mobileImage: (aspectRatio: '16:9' | '4:3' | '1:1' | '3:2' = '16:9') => {
    return `w-full ${getResponsive.imageAspect(aspectRatio)} object-cover rounded-lg sm:rounded-xl md:rounded-2xl`;
  },

  // Mobile-friendly forms
  mobileForm: {
    input: `w-full ${getResponsive.touchTarget('md')} px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`,
    textarea: `w-full min-h-[120px] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y`,
    select: `w-full ${getResponsive.touchTarget('md')} px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`,
    label: 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2',
    error: 'text-sm text-red-600 dark:text-red-400 mt-1'
  },

  // Mobile navigation patterns
  mobileNav: {
    // Bottom navigation for mobile
    bottomNav: 'fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2 safe-area-pb z-50',
    
    // Mobile menu overlay
    mobileMenu: 'fixed inset-0 bg-white dark:bg-slate-900 z-50 overflow-y-auto',
    
    // Mobile menu items
    mobileMenuItem: `w-full text-left px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-700 ${getAnimations.transition('fast')}`,
    
    // Mobile hamburger menu
    hamburger: `${getResponsive.touchTarget('md')} flex flex-col justify-center items-center space-y-1`
  },

  // Mobile accessibility enhancements
  mobileA11y: {
    // Focus visible states for mobile
    focusVisible: 'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
    
    // Screen reader only content
    srOnly: 'sr-only',
    
    // High contrast mode support
    highContrast: 'contrast-more:border-2 contrast-more:border-current',
    
    // Reduced motion support
    reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none'
  }
};

// Default export for convenience
export default {
  getEnhancedSemanticColor,
  getGlassmorphism,
  getResponsive,
  getAnimations,
  buildComponent,
  buildAdvancedComponent,
  layoutPatterns,
  typography,
  interactive,
  backgroundPatterns,
  corporatePatterns,
  mobilePatterns,
  seoUtils
};
