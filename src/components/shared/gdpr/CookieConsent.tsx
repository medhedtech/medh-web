"use client";

import React, { useState } from 'react';
import { useCookieConsent, ICookieSettings } from '@/contexts/CookieConsentContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Shield, Cookie, Settings, Check, Eye, BarChart3, Target, Heart } from 'lucide-react';
import Link from 'next/link';
import { buildAdvancedComponent, getAnimations, getResponsive } from '@/utils/designSystem';

const CookieConsent: React.FC = () => {
  const {
    showBanner,
    acceptAllCookies,
    acceptNecessaryCookies,
    customizeCookies,
  } = useCookieConsent();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<Partial<ICookieSettings>>({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = (): void => {
    customizeCookies(settings);
    setShowSettings(false);
  };

  // Cookie type information with icons and descriptions
  const cookieTypes = [
    {
      key: 'necessary',
      name: 'Necessary Cookies',
      description: 'Essential for website functionality. These cannot be disabled as they are required for basic website features like navigation and security.',
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      required: true,
      enabled: true
    },
    {
      key: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us understand how you interact with our website by collecting and reporting information anonymously to improve user experience.',
      icon: <BarChart3 className="w-5 h-5 text-green-500" />,
      required: false,
      enabled: settings.analytics || false
    },
    {
      key: 'marketing',
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant and engaging advertisements tailored to your interests.',
      icon: <Target className="w-5 h-5 text-purple-500" />,
      required: false,
      enabled: settings.marketing || false
    },
    {
      key: 'preferences',
      name: 'Preferences Cookies',
      description: 'Allow the website to remember your choices and preferences such as language, region, or accessibility settings.',
      icon: <Heart className="w-5 h-5 text-pink-500" />,
      required: false,
      enabled: settings.preferences || false
    }
  ];

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ 
          duration: 0.5, 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className={buildAdvancedComponent.glassCard({ 
            variant: 'hero', 
            hover: false, 
            padding: 'tablet' 
          })}>
            {!showSettings ? (
              // Main consent banner
              <div className="space-y-6">
                {/* Header with icon and title */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      We Value Your Privacy
                      <Shield className="w-5 h-5 text-green-500" />
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      At MEDH, we use cookies and similar technologies to enhance your learning experience, 
                      provide personalized content, analyze website traffic, and improve our educational services. 
                      Your privacy matters to us - you have full control over your cookie preferences.
                    </p>
                  </div>
                </div>

                {/* Privacy links */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Link
                    href="/privacy-policy"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Privacy Policy
                  </Link>
                  <Link
                    href="/cookie-policy"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    <Cookie className="w-4 h-4" />
                    Cookie Policy
                  </Link>
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    GDPR Compliant • ISO Certified
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={acceptAllCookies}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-h-[44px]"
                  >
                    <Check className="w-4 h-4" />
                    Accept All Cookies
                  </button>
                  
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 hover:shadow-md min-h-[44px]"
                  >
                    <Settings className="w-4 h-4" />
                    Customize Settings
                  </button>
                  
                  <button
                    onClick={acceptNecessaryCookies}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 font-medium rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 min-h-[44px]"
                  >
                    <Shield className="w-4 h-4" />
                    Necessary Only
                  </button>
                </div>
              </div>
            ) : (
              // Settings panel
              <div className="space-y-6">
                {/* Settings header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Cookie Preferences
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close settings"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose which types of cookies you'd like to allow. You can change these settings at any time.
                </p>
                
                {/* Cookie settings */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {cookieTypes.map((cookieType) => (
                    <div 
                      key={cookieType.key}
                      className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">
                            {cookieType.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {cookieType.name}
                              </h4>
                              {cookieType.required && (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-1 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {cookieType.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Toggle switch */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name={cookieType.key}
                              checked={cookieType.enabled}
                              onChange={handleChange}
                              disabled={cookieType.required}
                              className="sr-only"
                              id={`cookie-${cookieType.key}`}
                            />
                            <label
                              htmlFor={`cookie-${cookieType.key}`}
                              className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                                cookieType.enabled 
                                  ? 'bg-blue-600' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                              } ${cookieType.required ? 'cursor-not-allowed opacity-70' : ''}`}
                            >
                              <span
                                className={`block w-5 h-5 rounded-full bg-white transition-transform duration-200 transform ${
                                  cookieType.enabled ? 'translate-x-6' : 'translate-x-0.5'
                                } mt-0.5`}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Settings action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSaveSettings}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-h-[44px]"
                  >
                    <Check className="w-4 h-4" />
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent; 