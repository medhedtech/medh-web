import React from 'react';
import { Loader2, Loader } from 'lucide-react';

// Loading indicator styles
export const loadingIndicatorStyles = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes dots {
    0%, 80%, 100% { 
      transform: scale(0);
    }
    40% { 
      transform: scale(1);
    }
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  .loading-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .loading-dots > div {
    animation: dots 1.4s infinite ease-in-out both;
  }
`;

interface LoadingIndicatorProps {
  /**
   * The type of loading indicator to display
   * - spinner: A rotating spinner (default)
   * - dots: Three animated dots
   * - progress: A progress bar (requires progress prop)
   * - pulse: A pulsing circle
   */
  type?: 'spinner' | 'dots' | 'progress' | 'pulse';
  
  /**
   * The size of the loading indicator
   * - sm: Small
   * - md: Medium
   * - lg: Large
   * - xl: Extra large
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * The color of the loading indicator
   * - primary: Primary color from theme
   * - secondary: Secondary color from theme
   * - white: White color
   * - gray: Gray color
   */
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  
  /**
   * Progress value for progress type (0-100)
   */
  progress?: number;
  
  /**
   * Optional text to display alongside the loader
   */
  text?: string;
  
  /**
   * Whether to center the loading indicator
   */
  centered?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  progress = 0,
  text,
  centered = false,
}) => {
  // Define size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Define color classes
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  // Get size and color classes
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  // Define wrapper classes for centering if needed
  const wrapperClasses = centered ? 'flex flex-col items-center justify-center' : 'inline-flex flex-col items-center';

  // Render the appropriate loader based on type
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <Loader2 className={`${sizeClass} ${colorClass} loading-spinner`} />;
      
      case 'dots':
        return (
          <div className="loading-dots flex space-x-1">
            {[1, 2, 3].map((dot) => (
              <div 
                key={dot} 
                className={`rounded-full ${colorClass}`}
                style={{
                  width: size === 'sm' ? '0.5rem' : size === 'md' ? '0.75rem' : size === 'lg' ? '1rem' : '1.25rem',
                  height: size === 'sm' ? '0.5rem' : size === 'md' ? '0.75rem' : size === 'lg' ? '1rem' : '1.25rem',
                  animationDelay: `${dot * 0.15}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'progress':
        return (
          <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div 
              className={`${colorClass.replace('text-', 'bg-')} rounded-full h-2`} 
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        );
      
      case 'pulse':
        return (
          <div 
            className={`${sizeClass} ${colorClass.replace('text-', 'bg-')} rounded-full loading-pulse`}
          />
        );
      
      default:
        return <Loader className={`${sizeClass} ${colorClass} loading-spinner`} />;
    }
  };

  return (
    <div className={wrapperClasses}>
      {renderLoader()}
      {text && <span className={`mt-2 text-sm ${colorClass}`}>{text}</span>}
    </div>
  );
};

export default LoadingIndicator;