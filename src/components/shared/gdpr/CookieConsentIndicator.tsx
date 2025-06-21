"use client";

import React, { useState } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Shield, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { buildAdvancedComponent } from '@/utils/designSystem';

interface CookieConsentIndicatorProps {
  position?: 'header' | 'footer' | 'sidebar';
  compact?: boolean;
}

const CookieConsentIndicator: React.FC<CookieConsentIndicatorProps> = ({ 
  position = 'footer',
  compact = false 
}) => {
  const { cookieSettings, reopenCookieSettings, consentGiven } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);

  // Don't show if no consent has been given yet (main banner will handle)
  if (!consentGiven) return null;

  // Get cookie status summary
  const enabledCount = Object.values(cookieSettings).filter(Boolean).length;
  const totalCount = Object.keys(cookieSettings).length;
  const hasAllCookies = enabledCount === totalCount;
  const hasOnlyNecessary = enabledCount === 1 && cookieSettings.necessary;

  const getStatusColor = () => {
    if (hasAllCookies) return 'text-green-600 dark:text-green-400';
    if (hasOnlyNecessary) return 'text-amber-600 dark:text-amber-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getStatusText = () => {
    if (hasAllCookies) return 'All cookies accepted';
    if (hasOnlyNecessary) return 'Necessary cookies only';
    return `${enabledCount}/${totalCount} cookie types active`;
  };

  if (compact) {
    return (
      <button
        onClick={reopenCookieSettings}
        className="inline-flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        title="Manage cookie preferences"
      >
        <Cookie className="w-4 h-4" />
        <span className="hidden sm:inline">Cookies</span>
      </button>
    );
  }

  return (
    <div className={`${position === 'header' ? 'relative' : 'relative'}`}>
      <div className={buildAdvancedComponent.glassCard({ 
        variant: 'secondary', 
        hover: false, 
        padding: 'mobile' 
      })}>
        <div className="space-y-3">
          {/* Main indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Privacy Settings
                  </h4>
                  <span className={`text-xs font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  GDPR compliant • ISO certified
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={showDetails ? "Hide details" : "Show details"}
              >
                {showDetails ? (
                  <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={reopenCookieSettings}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium"
              >
                <Settings className="w-3 h-3" />
                Manage
              </button>
            </div>
          </div>

          {/* Expandable details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <h5 className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Current Cookie Settings:
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-2 ${cookieSettings.necessary ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${cookieSettings.necessary ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Necessary</span>
                    </div>
                    <div className={`flex items-center gap-2 ${cookieSettings.analytics ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${cookieSettings.analytics ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Analytics</span>
                    </div>
                    <div className={`flex items-center gap-2 ${cookieSettings.marketing ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${cookieSettings.marketing ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Marketing</span>
                    </div>
                    <div className={`flex items-center gap-2 ${cookieSettings.preferences ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${cookieSettings.preferences ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Preferences</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date().toLocaleDateString()}
                    </span>
                    <button
                      onClick={reopenCookieSettings}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Change Settings
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentIndicator; 