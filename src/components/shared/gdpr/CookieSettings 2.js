"use client";

import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { motion } from 'framer-motion';

const CookieSettings = () => {
  const {
    cookieSettings,
    customizeCookies,
    reopenCookieSettings
  } = useCookieConsent();

  const [settings, setSettings] = useState({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    setSettings({
      analytics: cookieSettings.analytics || false,
      marketing: cookieSettings.marketing || false,
      preferences: cookieSettings.preferences || false,
    });
  }, [cookieSettings]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = () => {
    customizeCookies(settings);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Cookie Settings
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Necessary Cookies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Essential for website functionality. These cookies are required for basic site functionality and cannot be disabled.
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="appearance-none w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-not-allowed opacity-70"
              />
              <span className="block w-5 h-5 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-6.5 transition-all duration-200"></span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These cookies collect information about how you use our website, which pages you visited and which links you clicked on. All data is anonymized and cannot be used to identify you.
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                name="analytics"
                checked={settings.analytics}
                onChange={handleChange}
                className="appearance-none w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-pointer"
              />
              <span className="block w-5 h-5 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-6.5 transition-all duration-200"></span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Marketing Cookies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These cookies are used by advertising companies to serve ads that are relevant to your interests. They're also used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                name="marketing"
                checked={settings.marketing}
                onChange={handleChange}
                className="appearance-none w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-pointer"
              />
              <span className="block w-5 h-5 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-6.5 transition-all duration-200"></span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Preferences Cookies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These cookies allow our website to remember choices you make (such as your username, language or the region you're in) and provide enhanced, more personal features.
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                name="preferences"
                checked={settings.preferences}
                onChange={handleChange}
                className="appearance-none w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 checked:bg-blue-600 peer transition-colors duration-200 cursor-pointer"
              />
              <span className="block w-5 h-5 rounded-full bg-white absolute left-0.5 top-0.5 peer-checked:left-6.5 transition-all duration-200"></span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="py-2.5 px-6 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </motion.div>
  );
};

export default CookieSettings; 