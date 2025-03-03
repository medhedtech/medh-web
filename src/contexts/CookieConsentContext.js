"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Default cookie settings
const COOKIE_CONSENT_KEY = 'medh-cookie-consent';
const DEFAULT_CONSENT = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieConsentContext = createContext();

export function CookieConsentProvider({ children }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [cookieSettings, setCookieSettings] = useState(DEFAULT_CONSENT);

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = Cookies.get(COOKIE_CONSENT_KEY);
    
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setCookieSettings(parsedConsent);
        setConsentGiven(true);
      } catch (e) {
        // If parsing fails, reset cookies
        Cookies.remove(COOKIE_CONSENT_KEY);
        setShowBanner(true);
      }
    } else {
      // If no consent was given yet, show the banner
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(fullConsent), { expires: 365 });
    setCookieSettings(fullConsent);
    setConsentGiven(true);
    setShowBanner(false);
  };

  const acceptNecessaryCookies = () => {
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(DEFAULT_CONSENT), { expires: 365 });
    setCookieSettings(DEFAULT_CONSENT);
    setConsentGiven(true);
    setShowBanner(false);
  };

  const customizeCookies = (settings) => {
    const newSettings = {
      ...DEFAULT_CONSENT,
      ...settings,
    };
    
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(newSettings), { expires: 365 });
    setCookieSettings(newSettings);
    setConsentGiven(true);
    setShowBanner(false);
  };

  const reopenCookieSettings = () => {
    setShowBanner(true);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentGiven,
        showBanner,
        cookieSettings,
        acceptAllCookies,
        acceptNecessaryCookies,
        customizeCookies,
        reopenCookieSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
} 