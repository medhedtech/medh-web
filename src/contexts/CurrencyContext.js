"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Define available currencies with their symbols and exchange rates
// These rates would ideally be fetched from an API in production
const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1 },
  EUR: { symbol: "€", name: "Euro", rate: 0.91 },
  AED: { symbol: "د.إ‎", name: "United Arab Emirates Dirham", rate: 3.67 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.78 },
  INR: { symbol: "₹", name: "Indian Rupee", rate: 83.18 },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  SGD: { symbol: "S$", name: "Singapore Dollar", rate: 1.34 }
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
  US: 'USD', AED: 'AED', CA: 'CAD', GB: 'GBP', 
  IE: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', 
  IN: 'INR', AU: 'AUD', SG: 'SGD',
  // Add more country to currency mappings as needed
};

// Create context
const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Get default currency from cookie or based on user's locale
  const getDefaultCurrency = () => {
    // First check if user has a saved preference
    const savedCurrency = Cookies.get('preferredCurrency');
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      return savedCurrency;
    }

    // If no saved preference, try to detect based on locale
    try {
      // Use navigator.language to get user's locale
      if (typeof window !== 'undefined') {
        const userLocale = navigator.language || navigator.userLanguage;
        // Extract country code from locale (e.g., 'en-US' -> 'US')
        const countryCode = userLocale.split('-')[1];
        
        // Get currency for country or default to USD
        if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
          return COUNTRY_CURRENCY_MAP[countryCode];
        }
      }
    } catch (error) {
      console.error("Error detecting locale:", error);
    }

    // Default to USD if detection fails
    return 'USD';
  };

  const [currency, setCurrency] = useState('USD'); // Default, will be updated in useEffect
  const [loading, setLoading] = useState(true);

  // Set initial currency based on locale or saved preference
  useEffect(() => {
    const defaultCurrency = getDefaultCurrency();
    setCurrency(defaultCurrency);
    setLoading(false);
  }, []);

  // Save currency preference when it changes
  useEffect(() => {
    if (!loading) {
      Cookies.set('preferredCurrency', currency, { expires: 365 });
    }
  }, [currency, loading]);

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD, toCurrency = currency) => {
    if (!priceInUSD) return 0;
    
    const rate = CURRENCIES[toCurrency]?.rate || 1;
    return (priceInUSD * rate).toFixed(2);
  };

  // Format price with currency symbol
  const formatPrice = (price, showCurrency = true, currencyCode = currency) => {
    if (price === undefined || price === null) return '';
    
    const { symbol } = CURRENCIES[currencyCode] || CURRENCIES.USD;
    return showCurrency ? `${symbol}${Number(price).toFixed(2)}` : Number(price).toFixed(2);
  };

  // Change the current currency
  const changeCurrency = (newCurrency) => {
    if (CURRENCIES[newCurrency]) {
      setCurrency(newCurrency);
    }
  };

  // Get all available currencies
  const getAvailableCurrencies = () => {
    return Object.keys(CURRENCIES).map(code => ({
      code,
      ...CURRENCIES[code]
    }));
  };

  // Get current currency info
  const getCurrentCurrency = () => {
    return {
      code: currency,
      ...CURRENCIES[currency]
    };
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies: CURRENCIES,
        loading,
        convertPrice,
        formatPrice,
        changeCurrency,
        getAvailableCurrencies,
        getCurrentCurrency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext; 