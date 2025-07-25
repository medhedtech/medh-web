"use client";

import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface CustomReCaptchaProps {
  onChange: (value: string) => void;
  error?: boolean;
}

// Function to generate a realistic token
const generateToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const segments = [
    Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
    Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
    Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
    Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  ];
  return segments.join('.');
};

const CustomReCaptcha: React.FC<CustomReCaptchaProps> = ({ onChange, error = false }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  const handleVerification = (): void => {
    if (isVerified) return;
    
    setIsChecking(true);
    // Simulate verification process
    setTimeout(() => {
      const generatedToken = generateToken();
      setToken(generatedToken);
      setIsVerified(true);
      setIsChecking(false);
      onChange(generatedToken);
    }, 1000);
  };

  return (
    <div className="relative">
      <div
        className={`w-full p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none
          ${error 
            ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
            : isVerified
              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
              : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-600/30'
          }`}
        onClick={handleVerification}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isVerified ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
            ) : error ? (
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            ) : (
              <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
            <span className={`text-sm font-medium ${
              error 
                ? 'text-red-600 dark:text-red-400' 
                : isVerified
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300'
            }`}>
              {error 
                ? 'Verification required' 
                : isVerified
                  ? 'Verified successfully'
                  : 'Click to verify you are human'}
            </span>
          </div>
          
          {isChecking && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-start">
          <AlertCircle className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" />
          <span>Please verify that you are human</span>
        </p>
      )}
    </div>
  );
};

export default CustomReCaptcha; 