"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

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

// Default currency mappings
const CURRENCY_MAPPINGS = {
  IN: { code: 'INR', symbol: '₹' },
  US: { code: 'USD', symbol: '$' },
  GB: { code: 'GBP', symbol: '£' },
  EU: { code: 'EUR', symbol: '€' },
  // Add more currency mappings as needed
};

// Default currency if everything fails
const DEFAULT_CURRENCY = { code: 'USD', symbol: '$' };

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);

  const fetchCountryCode = async () => {
    try {
      // First try the primary API
      const response = await axios.get('/api/proxy/ipapi', {
        timeout: 5000 // 5 second timeout
      });
      return response.data.country;
    } catch (primaryError) {
      console.error('Error fetching from primary API:', primaryError);
      
      try {
        // Fallback to a secondary API
        const fallbackResponse = await axios.get('https://api.ipapi.com/check', {
          timeout: 5000,
          params: {
            access_key: process.env.NEXT_PUBLIC_IPAPI_KEY // Make sure to add this to your env variables
          }
        });
        return fallbackResponse.data.country_code;
      } catch (fallbackError) {
        console.error('Error fetching from fallback API:', fallbackError);
        
        // If both APIs fail, try to get from browser
        try {
          const browserLocale = navigator.language || navigator.userLanguage;
          const countryCode = browserLocale.split('-')[1];
          if (countryCode && countryCode.length === 2) {
            return countryCode;
          }
        } catch (browserError) {
          console.error('Error getting browser locale:', browserError);
        }
        
        // If all methods fail, return default
        return 'US';
      }
    }
  };

  const getCurrencyForCountry = (countryCode) => {
    // Check if we have a mapping for this country
    if (CURRENCY_MAPPINGS[countryCode]) {
      return CURRENCY_MAPPINGS[countryCode];
    }
    
    // If no mapping found, return default currency
    return DEFAULT_CURRENCY;
  };

  const setInitialCurrency = async () => {
    try {
      setLoading(true);
      
      // Try to get stored currency first
      const storedCurrency = localStorage.getItem('preferredCurrency');
      if (storedCurrency) {
        try {
          // Try to parse as JSON first
          const parsedCurrency = JSON.parse(storedCurrency);
          setCurrency(parsedCurrency);
        } catch (parseError) {
          // If parsing fails, treat it as a currency code string
          const currencyCode = storedCurrency;
          const newCurrency = Object.values(CURRENCY_MAPPINGS).find(
            curr => curr.code === currencyCode
          ) || DEFAULT_CURRENCY;
          setCurrency(newCurrency);
        }
        setLoading(false);
        return;
      }

      // If no stored currency, fetch country and set currency
      const countryCode = await fetchCountryCode();
      const newCurrency = getCurrencyForCountry(countryCode);
      
      // Store the currency preference
      localStorage.setItem('preferredCurrency', JSON.stringify(newCurrency));
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Error setting initial currency:', error);
      // Fallback to default currency
      setCurrency(DEFAULT_CURRENCY);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually change currency
  const changeCurrency = (newCurrencyCode) => {
    try {
      const newCurrency = Object.values(CURRENCY_MAPPINGS).find(
        curr => curr.code === newCurrencyCode
      ) || DEFAULT_CURRENCY;
      
      localStorage.setItem('preferredCurrency', JSON.stringify(newCurrency));
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Error changing currency:', error);
      // If error, keep current currency
    }
  };

  useEffect(() => {
    setInitialCurrency();
  }, []);

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD, toCurrency = currency) => {
    if (!priceInUSD) return 0;
    
    const rate = CURRENCY_MAPPINGS[toCurrency]?.rate || 1;
    return (priceInUSD * rate).toFixed(2);
  };

  // Format price with currency symbol
  const formatPrice = (price, showCurrency = true, currencyCode = currency) => {
    if (price === undefined || price === null) return '';
    
    const { symbol } = CURRENCIES[currencyCode] || CURRENCIES.USD;
    return showCurrency ? `${symbol}${Math.round(Number(price))}` : Math.round(Number(price)).toString();
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