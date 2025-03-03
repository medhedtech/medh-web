import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Info, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";

const RECAPTCHA_SITE_KEY = "6LdHwxUqAAAAANjZ5-6I5-UYrL8owEGEi_QyJBX9";

const CustomReCaptcha = ({ onChange, error }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";
  
  return (
    <>
      <style jsx global>{`
        /* Basic positioning */
        .g-recaptcha {
          transform-origin: left top;
          -webkit-transform-origin: left top;
          margin: 0 auto;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
        }
        
        /* Base styles for both light and dark modes */
        .g-recaptcha iframe {
          background: transparent !important;
          transition: all 0.5s ease-in-out;
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
          transform: scale(1);
          opacity: 0.97;
          transform-origin: center;
          max-width: 100%;
        }
        
        /* Hover effects */
        .recaptcha-container:hover .g-recaptcha iframe {
          transform: scale(1.01);
          opacity: 1;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.09) !important;
        }
        
        .g-recaptcha > div {
          background: transparent !important;
          margin: 0 auto;
          max-width: 100%;
          border-radius: 12px;
          overflow: hidden;
        }
        
        /* Light mode specific */
        .light .g-recaptcha iframe {
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98)) !important;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 
                      0 0 0 1px rgba(0, 0, 0, 0.02) !important;
        }
        
        /* Dark mode specific styles - refined approach */
        .dark .g-recaptcha > div {
          filter: invert(0.85) hue-rotate(180deg) brightness(1.15) contrast(0.95);
          background: transparent !important;
        }
        
        .dark .g-recaptcha iframe {
          filter: invert(0.85) hue-rotate(180deg) brightness(1.15) contrast(0.95);
          background: linear-gradient(to bottom, rgba(25, 33, 46, 0.98), rgba(15, 23, 36, 0.98)) !important;
          backdrop-filter: blur(12px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3) !important;
        }
        
        /* Container styling */
        .recaptcha-container {
          position: relative;
          padding: 12px;
          border-radius: 1rem;
          transition: all 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        /* Light mode container */
        .recaptcha-container.light {
          background-color: transparent;
          border: none;
        }
        
        /* Dark mode container */
        .recaptcha-container.dark {
          background-color: transparent;
          border: none;
        }
        
        /* reCAPTCHA badge customization */
        .grecaptcha-badge {
          opacity: 0.8 !important;
          transition: opacity 0.3s ease;
        }
        
        .grecaptcha-badge:hover {
          opacity: 1 !important;
        }
        
        /* Remove any borders from reCAPTCHA elements */
        .g-recaptcha * {
          border: none !important;
          border-radius: 12px !important;
        }
        
        /* Improve focus states for accessibility */
        .g-recaptcha iframe:focus-within {
          outline: 2px solid #2563eb !important; 
          outline-offset: 2px !important;
        }
        
        /* Verified animation */
        .recaptcha-verified {
          color: #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-weight: 500;
        }
        
        .recaptcha-verified.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Make responsive for mobile */
        @media (max-width: 380px) {
          .g-recaptcha {
            transform: scale(0.95);
            margin-left: -15px;
          }
        }
        
        @media (max-width: 340px) {
          .g-recaptcha {
            transform: scale(0.90);
            margin-left: -20px;
          }
        }
      `}</style>
      
      <div className={`recaptcha-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(value) => {
              onChange(value);
              // Show verification message animation on successful verification
              if (value) {
                const verifiedEl = document.querySelector('.recaptcha-verified');
                if (verifiedEl) verifiedEl.classList.add('visible');
              }
            }}
            theme={isDarkMode ? "dark" : "light"}
            size="normal"
            hl="en"
          />
        </div>
        
        {/* Success indicator that appears when verified */}
        <div className="recaptcha-verified">
          <ShieldCheck size={16} className="mr-1.5" />
          <span>Verification successful</span>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-center">
          <span className="text-red-500 dark:text-red-400 text-sm flex items-center justify-center">
            <Info size={14} className="mr-1.5" />
            Please complete the ReCAPTCHA verification
          </span>
        </div>
      )}
    </>
  );
};

export default CustomReCaptcha; 