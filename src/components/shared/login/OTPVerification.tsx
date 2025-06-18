"use client";

import React, { useState, useEffect, useRef } from 'react';
import { showToast } from '@/utils/toastManager';
import { Loader2, AlertCircle, ArrowRight, RefreshCw, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import usePostQuery from '@/hooks/postQuery.hook';
import { apiUrls, IVerifyEmailData, IResendVerificationData, IOTPVerificationResponse } from '@/apis';
import Image from 'next/image';
import logo1 from '@/assets/images/logo/medh_logo-1.png';
import logo2 from '@/assets/images/logo/logo_2.png';
import { useTheme } from 'next-themes';

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
  backButtonText?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationSuccess,
  onBack,
  backButtonText = "Back to Sign Up"
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);
  const { postQuery } = usePostQuery();
  const { theme, resolvedTheme } = useTheme();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle countdown for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, []);

  // Handle input change
  const handleChange = (element: HTMLInputElement, index: number): void => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    // Only take the last character if more than one is pasted
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Move to next input if value is entered
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all fields are filled
    if (index === 5 && newOtp.every(digit => digit !== '')) {
      setTimeout(() => verifyOTP(), 300);
    }
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;

    const pastedArray = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];
    
    pastedArray.forEach((value, index) => {
      if (index < 6) newOtp[index] = value;
    });
    
    setOtp(newOtp);
    setError(null);
    
    // Focus the last field or the next empty one
    const lastIndex = Math.min(5, pastedArray.length - 1);
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
    
    // Auto-submit if all fields are filled
    if (pastedArray.length >= 6) {
      setTimeout(() => verifyOTP(), 300);
    }
  };

  // Verify OTP
  const verifyOTP = async (): Promise<void> => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const verifyData: IVerifyEmailData = {
        email,
        otp: otpString
      };
      
      await postQuery({
        url: apiUrls?.user?.verifyEmail,
        postData: verifyData,
        requireAuth: false,
        showToast: true,
        onSuccess: (response: any) => {
          showToast.success(response.message || 'Email verified successfully!');
          onVerificationSuccess();
        },
        onFail: (error: any) => {
          const errorMessage = error?.response?.data?.message || 'Invalid verification code';
          setError(errorMessage);
          showToast.error(errorMessage);
        }
      });
    } catch (error) {
      setError('An error occurred. Please try again.');
      showToast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (): Promise<void> => {
    if (resendDisabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const resendData: IResendVerificationData = { email };
      
      await postQuery({
        url: apiUrls?.user?.resendOTP,
        postData: resendData,
        requireAuth: false,
        showToast: true,
        onSuccess: (response: any) => {
          showToast.success(response.message || 'Verification code resent successfully!');
          setResendDisabled(true);
          setCountdown(30);
          
          // Clear OTP fields
          setOtp(new Array(6).fill(''));
          
          // Focus first input
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
        },
        onFail: (error: any) => {
          const errorMessage = error?.response?.data?.message || 'Failed to resend verification code';
          setError(errorMessage);
          showToast.error(errorMessage);
        }
      });
    } catch (error) {
      setError('Failed to resend verification code. Please try again.');
      showToast.error('Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 inline-block">
          <Image 
            src={(resolvedTheme === 'dark' || theme === 'dark') ? logo1 : logo2} 
            alt="Medh Logo" 
            width={100} 
            height={32} 
            className="mx-auto w-24 sm:w-28"
            priority
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
          Verify Your Email
        </h2>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>We've sent a verification code to</p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center justify-center">
            <Mail className="w-4 h-4 mr-2 text-primary-500" />
            {email}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all duration-200"
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          ))}
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center flex items-center justify-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={resendOTP}
            disabled={resendDisabled || loading}
            className={`flex items-center text-sm py-1 px-2 rounded-md transition-colors ${
              resendDisabled
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-primary-600 hover:text-primary-500 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${resendDisabled && countdown < 15 ? 'animate-spin' : ''}`} />
            {resendDisabled
              ? `Resend code in ${countdown}s`
              : 'Resend verification code'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={verifyOTP}
          disabled={otp.some(digit => !digit) || loading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-primary-500/30 disabled:hover:translate-y-0"
        >
          <span className="relative z-10 flex items-center justify-center">
            Verify Email
            <CheckCircle className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <button
          onClick={onBack}
          className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backButtonText}
        </button>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
        <p>Check your spam folder if you don't see the email in your inbox</p>
      </div>
    </div>
  );
};

export default OTPVerification; 