"use client";

import React, { useState } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import MobileQuickLogin from './MobileQuickLogin';
import LoginForm from './LoginForm';
import { useIsMobile } from '@/utils/hydration';
import { buildAdvancedComponent, mobilePatterns } from '@/utils/designSystem';

interface MobileQuickLoginDemoProps {
  onClose?: () => void;
  redirectAfterLogin?: string;
}

/**
 * Demo component showing enhanced mobile quick login integration
 * This demonstrates how to integrate the new MobileQuickLogin component
 * with existing authentication flows
 */
const MobileQuickLoginDemo: React.FC<MobileQuickLoginDemoProps> = ({
  onClose,
  redirectAfterLogin
}) => {
  const [loginMethod, setLoginMethod] = useState<'mobile-quick' | 'regular'>('mobile-quick');
  const [showDemo, setShowDemo] = useState(true);
  const { isMobile } = useIsMobile();

  const handleLoginSuccess = () => {
    if (redirectAfterLogin) {
      window.location.href = redirectAfterLogin;
    } else if (onClose) {
      onClose();
    }
  };

  const handleSwitchToRegular = () => {
    setLoginMethod('regular');
  };

  const handleSwitchToMobileQuick = () => {
    setLoginMethod('mobile-quick');
  };

  if (!showDemo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowDemo(false)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mobile Quick Login
              </h1>
            </div>
            
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Demo Info */}
        <div className={buildAdvancedComponent.glassCard({ variant: 'secondary' }) + ' mb-6'}>
          <div className="text-center">
            <h2 className={mobilePatterns.mobileTypography.subheading + ' mb-2'}>
              Enhanced Mobile Login Experience
            </h2>
            <p className={mobilePatterns.mobileTypography.body + ' mb-4'}>
              Experience the new mobile-first quick login with biometric authentication, 
              haptic feedback, and optimized touch interactions.
            </p>
            
            {/* Features List */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Face ID / Touch ID</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Haptic Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">One-Tap Login</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Smart Keyboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Method Toggle */}
        <div className="mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 grid grid-cols-2 gap-1">
            <button
              onClick={handleSwitchToMobileQuick}
              className={`
                px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                ${loginMethod === 'mobile-quick'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }
              `}
            >
              Mobile Quick Login
            </button>
            <button
              onClick={handleSwitchToRegular}
              className={`
                px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                ${loginMethod === 'regular'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }
              `}
            >
              Regular Login
            </button>
          </div>
        </div>

        {/* Login Components */}
        {loginMethod === 'mobile-quick' ? (
          <MobileQuickLogin
            onSuccess={handleLoginSuccess}
            onSwitchToRegular={handleSwitchToRegular}
            className="animate-fadeIn"
          />
        ) : (
          <div className="animate-fadeIn">
            <LoginForm
              onSuccess={handleLoginSuccess}
              showQuickLoginOption={true}
              onSwitchToQuickLogin={handleSwitchToMobileQuick}
            />
          </div>
        )}

        {/* Demo Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Demo Instructions:
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Try tapping account cards to feel haptic feedback</li>
            <li>• Use Face ID/Touch ID if available on your device</li>
            <li>• Notice smooth animations and mobile-optimized inputs</li>
            <li>• Switch between login methods to compare experiences</li>
          </ul>
        </div>

        {/* Device Info */}
        {isMobile && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-800 dark:text-green-200 text-center">
              ✓ Mobile device detected - Full mobile optimizations active
            </p>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MobileQuickLoginDemo; 