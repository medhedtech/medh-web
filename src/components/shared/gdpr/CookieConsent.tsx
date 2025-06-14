"use client";

import React, { useState } from 'react';
import { useCookieConsent, ICookieSettings } from '@/contexts/CookieConsentContext';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import Link from 'next/link';

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

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800"
      >
        <div className="container mx-auto">
          {!showSettings ? (
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                 We value your privacy
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>{' '}
                  for more information.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <button
                  onClick={() => setShowSettings(true)}
                  className="py-2.5 px-5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={acceptNecessaryCookies}
                  className="py-2.5 px-5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Necessary Only
                </button>
                <button
                  onClick={acceptAllCookies}
                  className="py-2.5 px-5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Cookie Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Necessary Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Essential for website functionality. Cannot be disabled.</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="appearance-none w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-not-allowed opacity-70"
                      />
                      <span className="block w-4 h-4 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-5.5 transition-all duration-200"></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Help us improve by tracking how you use our website.</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="analytics"
                        checked={settings.analytics}
                        onChange={handleChange}
                        className="appearance-none w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-pointer"
                      />
                      <span className="block w-4 h-4 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-5.5 transition-all duration-200"></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Used to track advertisements and limit the number of ads you see.</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="marketing"
                        checked={settings.marketing}
                        onChange={handleChange}
                        className="appearance-none w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-pointer"
                      />
                      <span className="block w-4 h-4 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-5.5 transition-all duration-200"></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Preferences Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allow the website to remember your preferences and settings.</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="preferences"
                        checked={settings.preferences}
                        onChange={handleChange}
                        className="appearance-none w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-pointer"
                      />
                      <span className="block w-4 h-4 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-5.5 transition-all duration-200"></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="py-2.5 px-5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="py-2.5 px-5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent; 