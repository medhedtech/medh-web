"use client";

import React, { memo, forwardRef, useMemo } from 'react';
import { useReducedMotion } from '@/utils/performance';

interface MotionVariants {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
}

interface OptimizedMotionProps {
  children: React.ReactNode;
  className?: string;
  variants?: MotionVariants;
  type?: 'fadeIn' | 'slideUp' | 'slideDown' | 'scaleIn' | 'none';
  delay?: number;
  duration?: number;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
  onAnimationComplete?: () => void;
  [key: string]: any;
}

const OptimizedMotion = memo(forwardRef<HTMLElement, OptimizedMotionProps>(({
  children,
  className = '',
  type = 'fadeIn',
  delay = 0,
  duration = 0.3,
  as: Component = 'div',
  style = {},
  onAnimationComplete,
  ...props
}, ref) => {
  const prefersReducedMotion = useReducedMotion();

  const animationStyles = useMemo(() => {
    if (prefersReducedMotion || type === 'none') {
      return {};
    }

    const animationName = getAnimationName(type);
    return {
      animation: `${animationName} ${duration}s ease-out ${delay}s both`,
      ...style
    };
  }, [prefersReducedMotion, type, duration, delay, style]);

  const handleAnimationEnd = () => {
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return React.createElement(
    Component as any,
    {
      ref,
      className: `${className} ${!prefersReducedMotion && type !== 'none' ? 'animate-optimized' : ''}`,
      style: animationStyles,
      onAnimationEnd: handleAnimationEnd,
      ...props
    },
    children
  );
}));

OptimizedMotion.displayName = 'OptimizedMotion';

function getAnimationName(type: string): string {
  switch (type) {
    case 'fadeIn':
      return 'optimized-fade-in';
    case 'slideUp':
      return 'optimized-slide-up';
    case 'slideDown':
      return 'optimized-slide-down';
    case 'scaleIn':
      return 'optimized-scale-in';
    default:
      return 'optimized-fade-in';
  }
}

export const MotionDiv: React.FC<OptimizedMotionProps> = memo((props) => (
  <OptimizedMotion as="div" {...props} />
));

export const MotionSection: React.FC<OptimizedMotionProps> = memo((props) => (
  <OptimizedMotion as="section" {...props} />
));

export const injectOptimizedAnimations = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'optimized-animations';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes optimized-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes optimized-slide-up {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes optimized-scale-in {
      from { 
        opacity: 0;
        transform: scale(0.95);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-optimized {
      will-change: transform, opacity;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .animate-optimized * {
        animation-duration: 0.01ms !important;
      }
    }
  `;
  
  document.head.appendChild(style);
};

export default OptimizedMotion; 