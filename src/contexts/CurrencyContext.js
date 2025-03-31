"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
// Removed axios and js-cookie imports as they are no longer needed

// Define default available currencies (used if no admin settings found)
const DEFAULT_CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1 },
  AED: { symbol: "د.إ‎", name: "United Arab Emirates Dirham", rate: 3.7 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.80 },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.6 },
};

// Removed COUNTRY_CURRENCY_MAP and DEFAULT_CURRENCY_MAPPINGS

// Create context
const CurrencyContext = createContext();

// Default currency if everything fails or no admin setting
const DEFAULT_CURRENCY_DETAIL = { code: 'USD', symbol: '$', name: "US Dollar", rate: 1 };

export const CurrencyProvider = ({ children }) => {
  // Simplified state: only currency and the list of available currencies
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY_DETAIL);
  const [currencies, setCurrencies] = useState(DEFAULT_CURRENCIES);
  // Removed loading, currencyMappings, and autoDetect states

  // Load admin settings from localStorage on initial mount
  useEffect(() => {
    try {
      const adminSettings = localStorage.getItem('currencySettings');
      if (adminSettings) {
        const settings = JSON.parse(adminSettings);

        // Update available currencies if provided by admin
        if (settings.currencies && typeof settings.currencies === 'object' && Object.keys(settings.currencies).length > 0) {
          setCurrencies(settings.currencies);
        } else {
          // Reset to default if admin settings are invalid or empty
          setCurrencies(DEFAULT_CURRENCIES);
        }

        // Set the initial currency based on admin's default currency
        const effectiveCurrencies = settings.currencies || DEFAULT_CURRENCIES; // Use admin or default list
        if (settings.defaultCurrency && effectiveCurrencies[settings.defaultCurrency]) {
          const defaultData = effectiveCurrencies[settings.defaultCurrency];
          setCurrency({
            code: settings.defaultCurrency,
            symbol: defaultData.symbol,
            name: defaultData.name,
            rate: defaultData.rate
          });
        } else {
          // Fallback if defaultCurrency is not set or invalid
          setCurrency(DEFAULT_CURRENCY_DETAIL);
        }
      } else {
        // No admin settings found, use hardcoded defaults
        setCurrencies(DEFAULT_CURRENCIES);
        setCurrency(DEFAULT_CURRENCY_DETAIL);
      }
    } catch (error) {
      console.error('Error loading admin currency settings:', error);
      // Fallback to hardcoded defaults on error
      setCurrencies(DEFAULT_CURRENCIES);
      setCurrency(DEFAULT_CURRENCY_DETAIL);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Removed fetchCountryCode, getCurrencyForCountry, and setInitialCurrency (merged into useEffect)

  // Function to manually change currency for the current session
  // Does NOT save preference to localStorage, reverts to admin default on reload
  const changeCurrency = (newCurrencyCode) => {
    try {
      const currencyData = currencies[newCurrencyCode];
      if (currencyData) {
        setCurrency({
          code: newCurrencyCode,
          symbol: currencyData.symbol,
          name: currencyData.name,
          rate: currencyData.rate
        });
      } else {
        console.warn(`Currency code "${newCurrencyCode}" not found in available currencies. Reverting to default.`);
        // Optionally revert to default or keep current if not found
        // setCurrency(DEFAULT_CURRENCY_DETAIL); // Or just do nothing
      }
    } catch (error) {
      console.error('Error changing currency:', error);
    }
  };

  // Removed the second useEffect that called setInitialCurrency

  // Convert price from base currency (assumed USD for rate calculation) to selected currency
  const convertPrice = (priceInBase, toCurrency = currency) => {
    if (priceInBase === undefined || priceInBase === null) return 0;

    const currencyCode = toCurrency.code;
    const rate = currencies[currencyCode]?.rate;

    // Handle case where rate might be missing or invalid
    if (rate === undefined || typeof rate !== 'number') {
      console.warn(`Rate not found or invalid for currency ${currencyCode}. Using rate 1.`);
      return Number(priceInBase).toFixed(2); // Return base price if rate is invalid
    }

    return (Number(priceInBase) * rate).toFixed(2);
  };

  // Format price with currency symbol
  const formatPrice = (price, showCurrency = true, currencyObj = currency) => {
    if (price === undefined || price === null) return '';

    const symbol = currencyObj.symbol || '$'; // Fallback symbol
    const formattedPrice = Math.round(Number(price)); // Round to nearest integer

    return showCurrency ? `${symbol}${formattedPrice}` : formattedPrice.toString();
  };

  // Get all available currencies as defined by admin or defaults
  const getAvailableCurrencies = () => {
    return Object.entries(currencies).map(([code, details]) => ({
      code,
      symbol: details.symbol,
      name: details.name,
      rate: details.rate
    }));
  };

  // Get current currency info object
  const getCurrentCurrency = () => {
    // Ensure the returned object matches the structure used elsewhere
    const currentData = currencies[currency.code];
    return {
      code: currency.code,
      symbol: currency.symbol || (currentData ? currentData.symbol : '$'),
      name: currency.name || (currentData ? currentData.name : 'Unknown'),
      rate: currency.rate || (currentData ? currentData.rate : 1)
    };
  };

  // Update currencies and optionally the default currency (for admin use)
  const updateCurrencies = (newCurrencies, newDefaultCurrencyCode = null) => {
    if (newCurrencies && typeof newCurrencies === 'object' && Object.keys(newCurrencies).length > 0) {
      setCurrencies(newCurrencies);

      // Determine the default currency code to save
      let defaultCodeToSave = newDefaultCurrencyCode;
      if (!defaultCodeToSave || !newCurrencies[defaultCodeToSave]) {
        // If new default is not provided or invalid, try using the current one
        defaultCodeToSave = currency.code;
        // If current one is also not in the new set, pick the first available or fallback
        if (!newCurrencies[defaultCodeToSave]) {
          defaultCodeToSave = Object.keys(newCurrencies)[0] || DEFAULT_CURRENCY_DETAIL.code;
        }
      }

      // Save new settings to localStorage
      const adminSettings = {
        currencies: newCurrencies,
        defaultCurrency: defaultCodeToSave,
        // Removed autoDetect setting
      };

      try {
        localStorage.setItem('currencySettings', JSON.stringify(adminSettings));

        // Update the current currency state if the default changed
        if (defaultCodeToSave !== currency.code && newCurrencies[defaultCodeToSave]) {
           const defaultData = newCurrencies[defaultCodeToSave];
           setCurrency({
            code: defaultCodeToSave,
            symbol: defaultData.symbol,
            name: defaultData.name,
            rate: defaultData.rate
           });
        } else if (!newCurrencies[currency.code]) {
            // If the current currency is no longer valid, update to the new default
            const defaultData = newCurrencies[defaultCodeToSave];
            setCurrency({
             code: defaultCodeToSave,
             symbol: defaultData.symbol,
             name: defaultData.name,
             rate: defaultData.rate
            });
        }

      } catch (error) {
        console.error("Failed to save currency settings to localStorage:", error);
      }

    } else {
        console.warn("Invalid or empty currencies object provided to updateCurrencies. No changes made.");
    }
  };

  // Removed setAutoDetectPreference function

  return (
    <CurrencyContext.Provider
      value={{
        currency, // The current currency object { code, symbol, name, rate }
        currencies, // The available currencies object { CODE: { symbol, name, rate } }
        // Removed loading
        convertPrice, // Function to convert a base price
        formatPrice, // Function to format price with symbol
        changeCurrency, // Function to change currency for the session
        getAvailableCurrencies, // Function to get list of available currencies
        getCurrentCurrency, // Function to get the current currency object
        updateCurrencies, // Function for admin to update currencies and default
        // Removed setAutoDetectPreference and autoDetect
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
// Removed unused lines and simplified logic throughout 