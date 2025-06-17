"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Type definitions
interface ICookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface ICookieConsentContext {
  consentGiven: boolean;
  showBanner: boolean;
  cookieSettings: ICookieSettings;
  acceptAllCookies: () => void;
  acceptNecessaryCookies: () => void;
  customizeCookies: (settings: Partial<ICookieSettings>) => void;
  reopenCookieSettings: () => void;
}

interface ICookieConsentProviderProps {
  children: ReactNode;
}

// Default cookie settings
const COOKIE_CONSENT_KEY = 'medh-cookie-consent';
const DEFAULT_CONSENT: ICookieSettings = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieConsentContext = createContext<ICookieConsentContext | undefined>(undefined);

export function CookieConsentProvider({ children }: ICookieConsentProviderProps): JSX.Element {
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [cookieSettings, setCookieSettings] = useState<ICookieSettings>(DEFAULT_CONSENT);

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = Cookies.get(COOKIE_CONSENT_KEY);
    
    if (savedConsent) {
      try {
        const parsedConsent: ICookieSettings = JSON.parse(savedConsent);
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

  const acceptAllCookies = (): void => {
    const fullConsent: ICookieSettings = {
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

  const acceptNecessaryCookies = (): void => {
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(DEFAULT_CONSENT), { expires: 365 });
    setCookieSettings(DEFAULT_CONSENT);
    setConsentGiven(true);
    setShowBanner(false);
  };

  const customizeCookies = (settings: Partial<ICookieSettings>): void => {
    const newSettings: ICookieSettings = {
      ...DEFAULT_CONSENT,
      ...settings,
    };
    
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(newSettings), { expires: 365 });
    setCookieSettings(newSettings);
    setConsentGiven(true);
    setShowBanner(false);
  };

  const reopenCookieSettings = (): void => {
    setShowBanner(true);
  };

  const contextValue: ICookieConsentContext = {
    consentGiven,
    showBanner,
    cookieSettings,
    acceptAllCookies,
    acceptNecessaryCookies,
    customizeCookies,
    reopenCookieSettings,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): ICookieConsentContext {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

// Export types for use in other components
export type { ICookieSettings, ICookieConsentContext }; 