"use client";

import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface CustomReCaptchaProps {
  onChange: (value: string | null) => void;
  error?: boolean;
  disabled?: boolean;
  siteKey?: string;
}

const CustomReCaptcha: React.FC<CustomReCaptchaProps> = ({
  onChange,
  error = false,
  disabled = false,
  siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test key, should be replaced with real site key in production
}) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaId = useRef<number | null>(null);

  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') return;
    
    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        renderReCaptcha();
      };
      
      document.head.appendChild(script);
    } else {
      renderReCaptcha();
    }

    return () => {
      // Ensure we're in browser environment
      if (typeof window === 'undefined') return;
      
      // Reset reCAPTCHA if it was rendered
      if (recaptchaId.current !== null && window.grecaptcha) {
        // Use type assertion to allow an argument
        (window.grecaptcha as any).reset(recaptchaId.current);
      }
    };
  }, [disabled]);

  const renderReCaptcha = () => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') return;
    
    if (recaptchaRef.current && window.grecaptcha) {
      // If already rendered, reset it
      if (recaptchaId.current !== null) {
        (window.grecaptcha as any).reset();
      }
      
      // Render the reCAPTCHA
      setTimeout(() => {
        if (window.grecaptcha && (window.grecaptcha as any).render) {
          try {
            recaptchaId.current = (window.grecaptcha as any).render(recaptchaRef.current!, {
              sitekey: siteKey,
              callback: onChange,
              'expired-callback': () => onChange(null),
              'error-callback': () => onChange(null)
            });
          } catch (error) {
            console.error('Error rendering reCAPTCHA:', error);
          }
        }
      }, 100);
    }
  };

  return (
    <div className={`recaptcha-container ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div ref={recaptchaRef} className="g-recaptcha" />
      {error && (
        <div className="mt-1 text-xs text-red-500 flex items-start">
          <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
          <span>Please complete the reCAPTCHA verification</span>
        </div>
      )}
    </div>
  );
};

export default CustomReCaptcha; 