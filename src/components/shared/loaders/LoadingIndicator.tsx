import React from 'react';

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoadingType = 'spinner' | 'dots' | 'pulse' | 'skeleton';
export type LoadingColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';

interface LoadingIndicatorProps {
  /**
   * Size of the loading indicator
   */
  size?: LoadingSize;
  
  /**
   * Type of the animation
   */
  type?: LoadingType;
  
  /**
   * Color scheme of the indicator
   */
  color?: LoadingColor;
  
  /**
   * Text displayed alongside the indicator
   */
  text?: string;
  
  /**
   * Whether to center the indicator
   */
  centered?: boolean;
  
  /**
   * Custom class name to apply
   */
  className?: string;
  
  /**
   * Accessibility label for screen readers
   */
  ariaLabel?: string;
}

/**
 * A flexible loading indicator component with multiple
 * animation types, sizes, and color options.
 * 
 * @example
 * // Basic spinner
 * <LoadingIndicator />
 * 
 * @example
 * // Custom dots with text
 * <LoadingIndicator type="dots" color="secondary" text="Processing..." />
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  type = 'spinner',
  color = 'primary',
  text,
  centered = false,
  className = '',
  ariaLabel = 'Loading...'
}) => {
  // Size mappings for different loading types
  const sizeMap = {
    xs: {
      spinner: 'h-3 w-3',
      dots: 'h-1.5 w-1.5 mx-0.5',
      pulse: 'h-5 w-5',
      skeleton: 'h-3'
    },
    sm: {
      spinner: 'h-4 w-4',
      dots: 'h-2 w-2 mx-0.75',
      pulse: 'h-6 w-6',
      skeleton: 'h-4'
    },
    md: {
      spinner: 'h-6 w-6',
      dots: 'h-2.5 w-2.5 mx-1',
      pulse: 'h-8 w-8',
      skeleton: 'h-5'
    },
    lg: {
      spinner: 'h-8 w-8',
      dots: 'h-3 w-3 mx-1.5',
      pulse: 'h-10 w-10',
      skeleton: 'h-6'
    },
    xl: {
      spinner: 'h-10 w-10',
      dots: 'h-4 w-4 mx-2',
      pulse: 'h-12 w-12',
      skeleton: 'h-8'
    }
  };
  
  // Enhanced color mappings with dark mode support
  const colorMap = {
    primary: 'text-primary-500 dark:text-primary-400 fill-primary-500 dark:fill-primary-400',
    secondary: 'text-secondary-500 dark:text-secondary-400 fill-secondary-500 dark:fill-secondary-400',
    success: 'text-green-500 dark:text-green-400 fill-green-500 dark:fill-green-400',
    warning: 'text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400',
    danger: 'text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400',
    info: 'text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400',
    light: 'text-gray-300 dark:text-gray-200 fill-gray-300 dark:fill-gray-200',
    dark: 'text-gray-800 dark:text-gray-100 fill-gray-800 dark:fill-gray-100'
  };
  
  // Base container classes
  const containerClasses = [
    centered ? 'flex justify-center items-center' : 'inline-flex items-center',
    className
  ].filter(Boolean).join(' ');
  
  // Text style classes
  const textClasses = 'ml-3 text-gray-700 dark:text-gray-300';
  
  // Render spinner loading type
  const renderSpinner = () => (
    <div role="status" aria-live="polite" aria-label={ariaLabel} className={containerClasses}>
      <svg 
        aria-hidden="true" 
        className={`animate-spin ${sizeMap[size].spinner} ${colorMap[color]}`} 
        viewBox="0 0 100 101" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" 
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path 
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" 
          fill="currentFill"
        />
      </svg>
      {text && <span className={textClasses}>{text}</span>}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
  
  // Render dots loading type
  const renderDots = () => (
    <div role="status" aria-live="polite" aria-label={ariaLabel} className={containerClasses}>
      <div className="flex">
        <div className={`${sizeMap[size].dots} ${colorMap[color]} rounded-full animate-bounce-delay-1`}></div>
        <div className={`${sizeMap[size].dots} ${colorMap[color]} rounded-full animate-bounce-delay-2`}></div>
        <div className={`${sizeMap[size].dots} ${colorMap[color]} rounded-full animate-bounce-delay-3`}></div>
      </div>
      {text && <span className={textClasses}>{text}</span>}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
  
  // Render pulse loading type
  const renderPulse = () => (
    <div role="status" aria-live="polite" aria-label={ariaLabel} className={containerClasses}>
      <div className={`${sizeMap[size].pulse} ${colorMap[color]} rounded-full animate-pulse-scale`}></div>
      {text && <span className={textClasses}>{text}</span>}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
  
  // Render skeleton loading type
  const renderSkeleton = () => (
    <div role="status" aria-live="polite" aria-label={ariaLabel} className={containerClasses}>
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${sizeMap[size].skeleton} w-24`}></div>
      {text && <span className="ml-3 text-gray-500 dark:text-gray-400">{text}</span>}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
  
  // Render the appropriate loading indicator
  const renderLoading = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };
  
  return renderLoading();
};

// Custom animations for dots loading
const globalStyles = `
  @keyframes bounce-delay {
    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
  .animate-bounce-delay-1 {
    animation: bounce-delay 1.4s infinite ease-in-out both;
    animation-delay: -0.32s;
  }
  .animate-bounce-delay-2 {
    animation: bounce-delay 1.4s infinite ease-in-out both;
    animation-delay: -0.16s;
  }
  .animate-bounce-delay-3 {
    animation: bounce-delay 1.4s infinite ease-in-out both;
  }
  
  @keyframes pulse-scale {
    0%, 100% { transform: scale(0.85); opacity: 0.7; }
    50% { transform: scale(1); opacity: 1; }
  }
  .animate-pulse-scale {
    animation: pulse-scale 1.5s infinite ease-in-out;
  }
  
  /* Respect user's reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .animate-bounce-delay-1,
    .animate-bounce-delay-2,
    .animate-bounce-delay-3,
    .animate-pulse-scale,
    .animate-spin {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default LoadingIndicator;

// Export styles for global injection
export { globalStyles as loadingIndicatorStyles }; 