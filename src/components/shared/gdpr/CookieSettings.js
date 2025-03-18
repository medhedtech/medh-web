"use client";

import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { motion } from 'framer-motion';
import { Check, Save } from 'lucide-react';

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

  const [saveStatus, setSaveStatus] = useState({
    saved: false,
    loading: false,
    error: null
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

    // Reset save status when settings change
    if (saveStatus.saved) {
      setSaveStatus({ saved: false, loading: false, error: null });
    }
  };

  const handleSaveSettings = () => {
    try {
      setSaveStatus({ saved: false, loading: true, error: null });
      
      // Apply cookie settings
      customizeCookies(settings);
      
      // Show success message
      setSaveStatus({ saved: true, loading: false, error: null });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, saved: false }));
      }, 3000);
      
      // Log to console for debugging
      console.log('Cookie settings saved:', settings);
    } catch (error) {
      console.error('Error saving cookie settings:', error);
      setSaveStatus({ saved: false, loading: false, error: 'Failed to save settings. Please try again.' });
    }
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
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {saveStatus.error && (
          <p className="text-red-500 text-sm">{saveStatus.error}</p>
        )}
        
        {saveStatus.saved && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Check size={16} className="mr-1" />
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        )}
        
        <button
          onClick={handleSaveSettings}
          disabled={saveStatus.loading}
          className={`py-2.5 px-6 text-sm font-medium rounded-md ${
            saveStatus.loading 
              ? 'bg-gray-400 cursor-wait' 
              : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
          } text-white transition-colors flex items-center ml-auto`}
          aria-label="Save cookie preferences"
        >
          {saveStatus.loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default CookieSettings; 