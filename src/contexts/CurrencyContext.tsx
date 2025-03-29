"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define currency interface
interface Currency {
  symbol: string;
  name: string;
  rate: number;
}

// Define currency info interface
interface CurrencyInfo {
  code: string;
  symbol: string;
}

// Define context state interface
interface CurrencyContextState {
  currency: CurrencyInfo;
  currencies: Record<string, Currency>;
  exchangeRates: Record<string, number>;
  loading: boolean;
  convertPrice: (price: number, toCurrencyCode?: string) => number;
  formatPrice: (price: number | undefined | null, showCurrency?: boolean, currencyCode?: string) => string;
  changeCurrency: (currencyCode: string) => void;
  getAvailableCurrencies: () => Array<Currency & { code: string }>;
  getCurrentCurrency: () => (Currency & { code: string }) | null;
  refreshRates: () => Promise<void>;
}

// Define provider props interface
interface CurrencyProviderProps {
  children: ReactNode;
}

// Define available currencies with their symbols
const CURRENCIES: Record<string, Currency> = {
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
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: 'USD', AE: 'AED', CA: 'CAD', GB: 'GBP', 
  IE: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', 
  IN: 'INR', AU: 'AUD', SG: 'SGD',
  // Extended country mappings for better coverage
  NZ: 'NZD', JP: 'JPY', CN: 'CNY', KR: 'KRW', 
  BR: 'BRL', MX: 'MXN', ZA: 'ZAR', HK: 'HKD'
};

// Default currency if everything fails
const DEFAULT_CURRENCY: CurrencyInfo = { code: 'USD', symbol: '$' };

// Create context with default undefined value
const CurrencyContext = createContext<CurrencyContextState | undefined>(undefined);

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRatesUpdate, setLastRatesUpdate] = useState<number>(0);

  // Fetch exchange rates using our proxy API
  const fetchExchangeRates = async (): Promise<Record<string, number>> => {
    try {
      // Use our own proxy API to avoid CORS issues and protect API keys
      const response = await axios.get('/api/proxy/exchange-rates', { 
        params: { base: 'USD' },
        timeout: 5000 
      });
      
      if (response.data && response.data.rates) {
        console.log('Successfully fetched exchange rates from proxy API');
        return response.data.rates;
      }
      
      throw new Error('Invalid response format from exchange rates API');
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      
      // If proxy API fails, return default rates from our constants
      console.warn('Using fallback static exchange rates');
      return Object.fromEntries(
        Object.entries(CURRENCIES).map(([code, currency]) => [code, currency.rate])
      );
    }
  };

  // Fetch country code with fallback using our proxy API
  const fetchCountryCode = async (): Promise<string> => {
    try {
      // Use our own proxy API to avoid CORS issues and protect API keys
      const response = await axios.get('/api/proxy/ipapi', { timeout: 5000 });
      
      const countryCode = response.data.country || 
                          response.data.country_code || 
                          response.data.countryCode;
                          
      if (countryCode && typeof countryCode === 'string') {
        console.log(`Country detected: ${countryCode} from proxy API`);
        return countryCode;
      }
      
      throw new Error('Invalid country code from location API');
    } catch (error) {
      console.error('Error fetching location from proxy API:', error);
      
      // If proxy API fails, try to get from browser
      try {
        const browserLocale = navigator.language || (navigator as any).userLanguage;
        const countryCode = browserLocale.split('-')[1];
        if (countryCode && countryCode.length === 2) {
          console.log(`Country detected from browser: ${countryCode}`);
          return countryCode;
        }
      } catch (browserError) {
        console.error('Error getting browser locale:', browserError);
      }
      
      // If all methods fail, return default
      console.warn('Could not detect country, using default: US');
      return 'US';
    }
  };

  // Get the appropriate currency for a country
  const getCurrencyForCountry = (countryCode: string): CurrencyInfo => {
    const currencyCode = COUNTRY_CURRENCY_MAP[countryCode];
    if (currencyCode && CURRENCIES[currencyCode]) {
      return { code: currencyCode, symbol: CURRENCIES[currencyCode].symbol };
    }
    return DEFAULT_CURRENCY;
  };

  // Refresh exchange rates
  const refreshRates = async (): Promise<void> => {
    try {
      const now = Date.now();
      // Only refresh if more than 1 hour has passed since last update
      if (now - lastRatesUpdate > 60 * 60 * 1000) {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
        setLastRatesUpdate(now);
        
        // Store rates in localStorage with timestamp
        localStorage.setItem('exchangeRates', JSON.stringify({
          rates,
          timestamp: now
        }));
      }
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
    }
  };

  const setInitialCurrency = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // First, load any cached exchange rates
      const cachedRatesData = localStorage.getItem('exchangeRates');
      if (cachedRatesData) {
        try {
          const { rates, timestamp } = JSON.parse(cachedRatesData);
          if (rates && timestamp && Date.now() - timestamp < 6 * 60 * 60 * 1000) { // 6 hours
            setExchangeRates(rates);
            setLastRatesUpdate(timestamp);
          } else {
            // Cached rates are too old, fetch new ones
            await refreshRates();
          }
        } catch (error) {
          console.error('Error parsing cached exchange rates:', error);
          await refreshRates();
        }
      } else {
        // No cached rates, fetch new ones
        await refreshRates();
      }
      
      // Try to get stored currency preference
      const storedCurrency = localStorage.getItem('preferredCurrency');
      if (storedCurrency) {
        try {
          const parsedCurrency = JSON.parse(storedCurrency);
          setCurrency(parsedCurrency);
          setLoading(false);
          return;
        } catch (parseError) {
          console.error('Error parsing stored currency:', parseError);
        }
      }

      // No valid stored preference, detect from location
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
  const changeCurrency = (newCurrencyCode: string): void => {
    try {
      if (CURRENCIES[newCurrencyCode]) {
        const newCurrency = { 
          code: newCurrencyCode, 
          symbol: CURRENCIES[newCurrencyCode].symbol 
        };
        
        localStorage.setItem('preferredCurrency', JSON.stringify(newCurrency));
        setCurrency(newCurrency);
      } else {
        throw new Error(`Invalid currency code: ${newCurrencyCode}`);
      }
    } catch (error) {
      console.error('Error changing currency:', error);
      // If error, keep current currency
    }
  };

  // Setup initial currency and exchange rates
  useEffect(() => {
    setInitialCurrency();
    
    // Set up periodic rate refresh (every hour)
    const refreshInterval = setInterval(() => {
      refreshRates();
    }, 60 * 60 * 1000); // 1 hour
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Convert price from USD to selected currency using real-time rates
  const convertPrice = (priceInUSD: number, toCurrencyCode?: string): number => {
    if (priceInUSD === null || priceInUSD === undefined) return 0;
    
    const targetCurrency = toCurrencyCode || currency.code;
    
    // Use real-time rates from API first, fall back to static rates
    const rate = exchangeRates[targetCurrency] || CURRENCIES[targetCurrency]?.rate || 1;
    
    return Number((priceInUSD * rate).toFixed(2));
  };

  // Format price with currency symbol
  const formatPrice = (price: number | undefined | null, showCurrency = true, currencyCode?: string): string => {
    if (price === undefined || price === null) return '';
    
    const targetCurrency = currencyCode || currency.code;
    const { symbol } = CURRENCIES[targetCurrency] || CURRENCIES.USD;
    
    return showCurrency 
      ? `${symbol}${Math.round(Number(price))}` 
      : Math.round(Number(price)).toString();
  };

  // Get all available currencies
  const getAvailableCurrencies = (): Array<Currency & { code: string }> => {
    return Object.entries(CURRENCIES).map(([code, details]) => ({
      code,
      ...details,
    }));
  };

  // Get current currency info
  const getCurrentCurrency = (): (Currency & { code: string }) | null => {
    if (!currency.code || !CURRENCIES[currency.code]) return null;
    
    return {
      code: currency.code,
      ...CURRENCIES[currency.code]
    };
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies: CURRENCIES,
        exchangeRates,
        loading,
        convertPrice,
        formatPrice,
        changeCurrency,
        getAvailableCurrencies,
        getCurrentCurrency,
        refreshRates
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextState => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext; 