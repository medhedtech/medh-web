import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Info } from "lucide-react";
import { useTheme } from "next-themes";

const RECAPTCHA_SITE_KEY = "6LdHwxUqAAAAANjZ5-6I5-UYrL8owEGEi_QyJBX9";

const CustomReCaptcha = ({ onChange, error }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  
  return (
    <>
      <style jsx global>{`
        .g-recaptcha {
          transform-origin: left top;
          -webkit-transform-origin: left top;
        }
        
        .g-recaptcha iframe {
          background: transparent !important;
        }
        
        .g-recaptcha > div {
          background: transparent !important;
        }
        
        .dark .g-recaptcha > div {
          filter: invert(0.9) hue-rotate(180deg);
          background: transparent !important;
        }
        
        .dark .g-recaptcha iframe {
          background: transparent !important;
        }
        
        /* Remove any borders or shadows */
        .g-recaptcha * {
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
      
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        onChange={onChange}
        theme="light"
        size="normal"
        hl="en"
      />
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