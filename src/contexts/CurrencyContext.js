'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Currency data with exchange rates (relative to USD)
const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1 },
  EUR: { symbol: "€", name: "Euro", rate: 0.91 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.78 },
  INR: { symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  AED: { symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
  SGD: { symbol: "S$", name: "Singapore Dollar", rate: 1.35 },
  JPY: { symbol: "¥", name: "Japanese Yen", rate: 149.34 },
  CNY: { symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  KRW: { symbol: "₩", name: "South Korean Won", rate: 1312.50 }
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
  US: 'USD', CA: 'CAD', GB: 'GBP', 
  IE: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  AT: 'EUR', BE: 'EUR', FI: 'EUR', PT: 'EUR', GR: 'EUR', LU: 'EUR',
  IN: 'INR', AU: 'AUD', NZ: 'AUD', JP: 'JPY', SG: 'SGD',
  AE: 'AED', SA: 'AED', QA: 'AED', CN: 'CNY', KR: 'KRW',
  HK: 'USD', TW: 'USD', MY: 'USD', TH: 'USD', PH: 'USD'
};

// Default currency
const DEFAULT_CURRENCY = 'USD';

// Create context
const CurrencyContext = createContext(undefined);

// Currency provider component
export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(DEFAULT_CURRENCY);
  const [autoDetect, setAutoDetect] = useState(true);

  // Function to detect user's currency from locale
  const detectCurrencyFromLocale = useCallback(() => {
    if (typeof window === 'undefined') return DEFAULT_CURRENCY;
    
    try {
      // Try to get country from navigator.language
      const locale = navigator.language || navigator.languages?.[0] || 'en-US';
      const countryCode = locale.split('-')[1]?.toUpperCase();
      
      if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
        return COUNTRY_CURRENCY_MAP[countryCode];
      }
      
      // Try to detect from Intl.DateTimeFormat
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        // Simple timezone to country mapping for major zones
        const timezoneCountryMap = {
          'America/New_York': 'US',
          'America/Los_Angeles': 'US', 
          'America/Chicago': 'US',
          'America/Toronto': 'CA',
          'Europe/London': 'GB',
          'Europe/Paris': 'FR',
          'Europe/Berlin': 'DE',
          'Asia/Kolkata': 'IN',
          'Asia/Mumbai': 'IN',
          'Asia/Tokyo': 'JP',
          'Asia/Singapore': 'SG',
          'Australia/Sydney': 'AU',
          'Asia/Dubai': 'AE'
        };
        
        const detectedCountry = timezoneCountryMap[timezone];
        if (detectedCountry && COUNTRY_CURRENCY_MAP[detectedCountry]) {
          return COUNTRY_CURRENCY_MAP[detectedCountry];
        }
      }
    } catch (error) {
      console.warn('Currency detection failed:', error);
    }
    
    return DEFAULT_CURRENCY;
  }, []);

  // Load currency preference from localStorage or detect automatically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // First check for saved preference
      const savedCurrency = localStorage.getItem('preferred-currency');
      const savedAutoDetect = localStorage.getItem('currency-auto-detect');
      
      if (savedAutoDetect !== null) {
        setAutoDetect(JSON.parse(savedAutoDetect));
      }
      
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrentCurrency(savedCurrency);
      } else if (autoDetect) {
        // Auto-detect currency
        const detectedCurrency = detectCurrencyFromLocale();
        setCurrentCurrency(detectedCurrency);
        // Save the detected currency
        localStorage.setItem('preferred-currency', detectedCurrency);
      }
    } catch (error) {
      console.warn('Failed to load currency preference:', error);
      setCurrentCurrency(DEFAULT_CURRENCY);
    }
  }, [autoDetect, detectCurrencyFromLocale]);

  // Convert price from USD to current currency
  const convertPrice = useCallback((priceInUSD) => {
    if (typeof priceInUSD !== 'number' || isNaN(priceInUSD)) {
      return 0;
    }
    
    const currency = CURRENCIES[currentCurrency];
    if (!currency) return priceInUSD;
    
    return Math.round(priceInUSD * currency.rate * 100) / 100;
  }, [currentCurrency]);

  // Format price with currency symbol
  const formatPrice = useCallback((price, options = {}) => {
    const { 
      showSymbol = true, 
      showCode = false,
      precision = 0 
    } = options;
    
    if (typeof price !== 'number' || isNaN(price)) {
      return showSymbol ? `${CURRENCIES[currentCurrency]?.symbol || '$'}0` : '0';
    }
    
    // Handle free prices
    if (price === 0) {
      return 'Free';
    }
    
    const currency = CURRENCIES[currentCurrency];
    if (!currency) return price.toString();
    
    const formattedNumber = precision > 0 
      ? price.toFixed(precision)
      : Math.round(price).toLocaleString();
    
    let result = '';
    if (showSymbol) {
      result = `${currency.symbol}${formattedNumber}`;
    } else {
      result = formattedNumber;
    }
    
    if (showCode) {
      result += ` ${currentCurrency}`;
    }
    
    return result;
  }, [currentCurrency]);

  // Change currency
  const changeCurrency = useCallback((newCurrency) => {
    if (!CURRENCIES[newCurrency]) {
      console.warn(`Currency ${newCurrency} is not supported`);
      return;
    }
    
    setCurrentCurrency(newCurrency);
    
    try {
      localStorage.setItem('preferred-currency', newCurrency);
    } catch (error) {
      console.warn('Failed to save currency preference:', error);
    }
  }, []);

  // Get current currency info
  const getCurrentCurrency = useCallback(() => {
    const currency = CURRENCIES[currentCurrency];
    return {
      code: currentCurrency,
      symbol: currency?.symbol || '$',
      name: currency?.name || 'US Dollar',
      rate: currency?.rate || 1
    };
  }, [currentCurrency]);

  // Get available currencies
  const getAvailableCurrencies = useCallback(() => {
    return Object.entries(CURRENCIES).map(([code, info]) => ({
      code,
      ...info
    }));
  }, []);

  // Set auto-detect preference
  const setAutoDetectPreference = useCallback((enabled) => {
    setAutoDetect(enabled);
    try {
      localStorage.setItem('currency-auto-detect', JSON.stringify(enabled));
    } catch (error) {
      console.warn('Failed to save auto-detect preference:', error);
    }
  }, []);

  // Update currencies (for admin use)
  const updateCurrencies = useCallback((newCurrencies) => {
    // This would typically update the currency data
    // For now, we'll just log it since our currencies are hardcoded
    console.log('Currency update requested:', newCurrencies);
  }, []);

  // Context value
  const value = {
    // Current state
    currency: getCurrentCurrency(),
    currentCurrency,
    autoDetect,
    
    // Main functions
    convertPrice,
    formatPrice,
    changeCurrency,
    
    // Utility functions
    getCurrentCurrency,
    getAvailableCurrencies,
    setAutoDetectPreference,
    updateCurrencies,
    
    // Data
    currencies: CURRENCIES
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  
  return context;
};

// Export the context for advanced usage
export { CurrencyContext };

// Default export
export default CurrencyProvider; 