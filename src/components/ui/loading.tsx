import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  /**
   * Size of the loading spinner
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Variant of the loading component
   * @default "spinner"
   */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  
  /**
   * Loading text to display
   */
  text?: string;
  
  /**
   * Whether to show as fullscreen overlay
   * @default false
   */
  fullscreen?: boolean;
  
  /**
   * Whether to show as page loading (min-height screen)
   * @default false
   */
  fullPage?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Color theme
   * @default "primary"
   */
  color?: 'primary' | 'secondary' | 'white' | 'gray';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const colorClasses = {
  primary: {
    spinner: 'border-gray-200 dark:border-gray-700 border-t-primary-500',
    dots: 'bg-primary-500',
    pulse: 'bg-primary-500',
    bars: 'bg-primary-500'
  },
  secondary: {
    spinner: 'border-gray-200 dark:border-gray-700 border-t-secondary-500',
    dots: 'bg-secondary-500',
    pulse: 'bg-secondary-500',
    bars: 'bg-secondary-500'
  },
  white: {
    spinner: 'border-gray-300 border-t-white',
    dots: 'bg-white',
    pulse: 'bg-white',
    bars: 'bg-white'
  },
  gray: {
    spinner: 'border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300',
    dots: 'bg-gray-600 dark:bg-gray-300',
    pulse: 'bg-gray-600 dark:bg-gray-300',
    bars: 'bg-gray-600 dark:bg-gray-300'
  }
};

const SpinnerLoader: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className={cn(size, 'border-4 rounded-full animate-spin', color)} />
);

const DotsLoader: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const dotSize = size === 'w-4 h-4' ? 'w-2 h-2' : 
                  size === 'w-8 h-8' ? 'w-3 h-3' :
                  size === 'w-12 h-12' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className="flex space-x-1">
      <div className={cn(dotSize, 'rounded-full animate-bounce', color)} style={{ animationDelay: '0ms' }} />
      <div className={cn(dotSize, 'rounded-full animate-bounce', color)} style={{ animationDelay: '150ms' }} />
      <div className={cn(dotSize, 'rounded-full animate-bounce', color)} style={{ animationDelay: '300ms' }} />
    </div>
  );
};

const PulseLoader: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className={cn(size, 'rounded-full animate-pulse', color)} />
);

const BarsLoader: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const barHeight = size === 'w-4 h-4' ? 'h-4' : 
                    size === 'w-8 h-8' ? 'h-8' :
                    size === 'w-12 h-12' ? 'h-12' : 'h-16';
  
  return (
    <div className="flex items-end space-x-1">
      <div className={cn('w-1', barHeight, 'animate-pulse', color)} style={{ animationDelay: '0ms' }} />
      <div className={cn('w-1', barHeight, 'animate-pulse', color)} style={{ animationDelay: '150ms' }} />
      <div className={cn('w-1', barHeight, 'animate-pulse', color)} style={{ animationDelay: '300ms' }} />
      <div className={cn('w-1', barHeight, 'animate-pulse', color)} style={{ animationDelay: '450ms' }} />
    </div>
  );
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullscreen = false,
  fullPage = false,
  className,
  color = 'primary'
}) => {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color][variant];
  
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={sizeClass} color={colorClass} />;
      case 'pulse':
        return <PulseLoader size={sizeClass} color={colorClass} />;
      case 'bars':
        return <BarsLoader size={sizeClass} color={colorClass} />;
      default:
        return <SpinnerLoader size={sizeClass} color={colorClass} />;
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center gap-3',
      className
    )}>
      {renderLoader()}
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Convenience components for common use cases
export const PageLoading: React.FC<Omit<LoadingProps, 'fullPage'>> = (props) => (
  <Loading {...props} fullPage={true} />
);

export const OverlayLoading: React.FC<Omit<LoadingProps, 'fullscreen'>> = (props) => (
  <Loading {...props} fullscreen={true} />
);

export const InlineLoading: React.FC<LoadingProps> = (props) => (
  <Loading {...props} />
);

// Button loading component
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <Loading size={size} variant="spinner" color="white" />
);

export default Loading; 