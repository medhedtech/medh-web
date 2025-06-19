import { clsx } from 'clsx';

// Enhanced semantic color function
export const getEnhancedSemanticColor = (category: string, variant: string = 'light') => {
  const colorMap = {
    courses: {
      light: '#3b82f6',
      dark: '#1e40af',
      bg: 'rgba(59, 130, 246, 0.15)',
      glass: 'rgba(59, 130, 246, 0.08)'
    },
    pricing: {
      light: '#10b981',
      dark: '#047857',
      bg: 'rgba(16, 185, 129, 0.15)',
      glass: 'rgba(16, 185, 129, 0.08)'
    },
    certification: {
      light: '#f59e0b',
      dark: '#d97706',
      bg: 'rgba(245, 158, 11, 0.15)',
      glass: 'rgba(245, 158, 11, 0.08)'
    },
    support: {
      light: '#8b5cf6',
      dark: '#7c3aed',
      bg: 'rgba(139, 92, 246, 0.15)',
      glass: 'rgba(139, 92, 246, 0.08)'
    },
    enrollment: {
      light: '#ec4899',
      dark: '#db2777',
      bg: 'rgba(236, 72, 153, 0.15)',
      glass: 'rgba(236, 72, 153, 0.08)'
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

// Responsive utility functions
export const getResponsive = {
  // Fluid typography
  fluidText: (size: 'caption' | 'body' | 'subheading' | 'heading' | 'display' = 'body') => {
    const sizes = {
      caption: 'text-[clamp(0.75rem,2vw+0.25rem,0.875rem)]',
      body: 'text-[clamp(0.875rem,2.5vw+0.5rem,1.125rem)]',
      subheading: 'text-[clamp(1.25rem,3vw+0.5rem,2rem)]',
      heading: 'text-[clamp(1.5rem,4vw+1rem,3rem)]',
      display: 'text-[clamp(2rem,8vw+1rem,6rem)]'
    };
    return sizes[size];
  },

  // Grid system
  grid: (config: { mobile: number; tablet?: number; desktop?: number }) => {
    const { mobile, tablet = mobile * 2, desktop = tablet + 1 } = config;
    return `grid grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop} gap-4 md:gap-6`;
  },

  // Spacing
  spacing: (size: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' = 'base') => {
    const mobile = {
      xs: 'p-2',
      sm: 'p-3',
      base: 'p-4',
      md: 'p-5',
      lg: 'p-6',
      xl: 'p-8',
      '2xl': 'p-10',
      '3xl': 'p-12'
    };
    
    const desktop = {
      xs: 'md:p-3',
      sm: 'md:p-4',
      base: 'md:p-6',
      md: 'md:p-8',
      lg: 'md:p-10',
      xl: 'md:p-12',
      '2xl': 'md:p-16',
      '3xl': 'md:p-20'
    };

    return `${mobile[size]} ${desktop[size]}`;
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
  backgroundPatterns
}; 