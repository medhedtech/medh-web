"use client";

import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { motion } from 'framer-motion';
import { Shield, BarChart3, Target, Heart, Save, RotateCcw, Info, CheckCircle, XCircle } from 'lucide-react';
import { buildAdvancedComponent, getAnimations } from '@/utils/designSystem';

const CookieSettings = () => {
  const { cookieSettings, customizeCookies } = useCookieConsent();
  const [localSettings, setLocalSettings] = useState(cookieSettings);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Cookie configuration with enhanced details
  const cookieConfig = [
    {
      key: 'necessary',
      name: 'Necessary Cookies',
      description: 'Essential cookies that enable core website functionality such as security, navigation, and access to protected areas. These cookies do not store personally identifiable information and cannot be disabled.',
      details: [
        'Authentication and security',
        'Shopping cart functionality',
        'Load balancing',
        'Form submission security'
      ],
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      required: true,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      key: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting anonymous information about usage patterns, helping us improve user experience.',
      details: [
        'Page view tracking',
        'User behavior analysis',
        'Performance metrics',
        'Error reporting'
      ],
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      required: false,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      key: 'marketing',
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites with the goal of displaying advertisements that are relevant and engaging to individual users, making them more valuable for publishers and advertisers.',
      details: [
        'Targeted advertising',
        'Cross-site tracking',
        'Retargeting campaigns',
        'Conversion tracking'
      ],
      icon: <Target className="w-6 h-6 text-purple-500" />,
      required: false,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      key: 'preferences',
      name: 'Preferences Cookies',
      description: 'These cookies allow the website to remember your preferences and choices, providing a more personalized experience when you return to our site.',
      details: [
        'Language preferences',
        'Theme selection',
        'Region settings',
        'Accessibility options'
      ],
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      required: false,
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800'
    }
  ];

  // Update local settings when cookie settings change
  useEffect(() => {
    setLocalSettings(cookieSettings);
    setHasChanges(false);
  }, [cookieSettings]);

  // Check for changes
  useEffect(() => {
    const hasAnyChanges = Object.keys(localSettings).some(
      key => localSettings[key] !== cookieSettings[key]
    );
    setHasChanges(hasAnyChanges);
  }, [localSettings, cookieSettings]);

  const handleToggle = (key) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    customizeCookies(localSettings);
    setShowSaveNotification(true);
    setHasChanges(false);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  const handleReset = () => {
    setLocalSettings(cookieSettings);
    setHasChanges(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setLocalSettings(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setLocalSettings(onlyNecessary);
  };

  return (
    <div className="space-y-6">
      {/* Save notification */}
      {showSaveNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200 font-medium">
            Cookie preferences saved successfully!
          </span>
        </motion.div>
      )}

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAcceptAll}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <CheckCircle className="w-4 h-4" />
          Accept All Cookies
        </button>
        <button
          onClick={handleRejectAll}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
        >
          <XCircle className="w-4 h-4" />
          Necessary Only
        </button>
      </div>

      {/* Cookie settings */}
      <div className="space-y-4">
        {cookieConfig.map((cookie) => (
          <motion.div
            key={cookie.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${buildAdvancedComponent.glassCard({ 
              variant: 'secondary', 
              hover: false, 
              padding: 'tablet' 
            })} ${cookie.bgColor} ${cookie.borderColor}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-1">
                  {cookie.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {cookie.name}
                    </h3>
                    {cookie.required && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    {cookie.description}
                  </p>
                  
                  {/* Cookie details */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      What this includes:
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {cookie.details.map((detail, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-current rounded-full"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Toggle switch */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localSettings[cookie.key] || false}
                    onChange={() => handleToggle(cookie.key)}
                    disabled={cookie.required}
                    className="sr-only"
                    id={`setting-${cookie.key}`}
                  />
                  <label
                    htmlFor={`setting-${cookie.key}`}
                    className={`block w-14 h-7 rounded-full transition-colors duration-200 ${
                      localSettings[cookie.key]
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    } ${cookie.required 
                        ? 'cursor-not-allowed opacity-70' 
                        : 'cursor-pointer hover:shadow-md'
                    }`}
                  >
                    <span
                      className={`block w-6 h-6 rounded-full bg-white transition-transform duration-200 transform ${
                        localSettings[cookie.key] ? 'translate-x-7' : 'translate-x-0.5'
                      } mt-0.5 shadow-sm`}
                    />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-200 min-h-[44px] ${
            hasChanges
              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
        
        {hasChanges && (
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Changes
          </button>
        )}
      </div>

      {/* Privacy notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Your Privacy Matters</p>
            <p className="text-blue-700 dark:text-blue-300">
              You can change these settings at any time by returning to this page. 
              For more information about how we use cookies, please read our{' '}
              <a 
                href="/privacy-policy" 
                className="underline hover:no-underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a 
                href="/cookie-policy" 
                className="underline hover:no-underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieSettings; 