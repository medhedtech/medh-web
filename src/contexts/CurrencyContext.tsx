"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { ICurrency, ICurrencyResponse, ICurrenciesResponse } from '@/apis';

// Define currency codes as string literals for better type safety
type CurrencyCode = 'USD' | 'EUR' | 'AED' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'NZD' | 'JPY' | 'CNY' | 'KRW' | 'BRL' | 'MXN' | 'ZAR' | 'HKD';

// Define currency interface
interface Currency {
  symbol: string;
  name: string;
  rate: number;
}

// Define currency info interface
interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
}

// Define context state interface
interface CurrencyContextState {
  currency: CurrencyInfo;
  currencies: Record<string, Currency>;
  exchangeRates: Record<string, number>;
  loading: boolean;
  convertPrice: (price: number | undefined | null, toCurrencyCode?: CurrencyCode) => number;
  formatPrice: (price: number | undefined | null, showCurrency?: boolean, currencyCode?: CurrencyCode) => string;
  changeCurrency: (currencyCode: CurrencyCode) => void;
  getAvailableCurrencies: () => Array<Currency & { code: CurrencyCode }>;
  getCurrentCurrency: () => (Currency & { code: CurrencyCode }) | null;
  refreshRates: () => Promise<void>;
  updateCurrencies: (currenciesObject: Record<string, Currency>) => void;
  setAutoDetectPreference: (value: boolean) => void;
  autoDetect: boolean;
  fetchExternalCurrencies: () => Promise<ICurrency[]>;
}

// Define provider props interface
interface CurrencyProviderProps {
  children: ReactNode;
}

// Define available currencies with their symbols
const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { symbol: "$", name: "US Dollar", rate: 1 },
  EUR: { symbol: "€", name: "Euro", rate: 0.91 },
  AED: { symbol: "د.إ‎", name: "United Arab Emirates Dirham", rate: 3.67 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.78 },
  INR: { symbol: "₹", name: "Indian Rupee", rate: 83.18 },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  SGD: { symbol: "S$", name: "Singapore Dollar", rate: 1.34 },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar", rate: 1.65 },
  JPY: { symbol: "¥", name: "Japanese Yen", rate: 150.12 },
  CNY: { symbol: "¥", name: "Chinese Yuan", rate: 7.12 },
  KRW: { symbol: "₩", name: "South Korean Won", rate: 1350.45 },
  BRL: { symbol: "R$", name: "Brazilian Real", rate: 5.23 },
  MXN: { symbol: "$", name: "Mexican Peso", rate: 16.78 },
  ZAR: { symbol: "R", name: "South African Rand", rate: 18.12 },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar", rate: 7.81 }
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  US: 'USD', AE: 'AED', CA: 'CAD', GB: 'GBP', 
  IE: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', 
  IN: 'INR', AU: 'AUD', SG: 'SGD',
  // Extended country mappings for better coverage
  NZ: 'NZD', JP: 'JPY', CN: 'CNY', KR: 'KRW', 
  BR: 'BRL', MX: 'MXN', ZA: 'ZAR', HK: 'HKD'
};

// Default currency if everything fails
const DEFAULT_CURRENCY: CurrencyInfo = { code: 'INR', symbol: '₹' };

// Schema for exchange rates API response
const ExchangeRatesSchema = z.object({
  rates: z.record(z.number()),
  base: z.string().optional(),
  timestamp: z.number().optional(),
});

// Schema for IP API response
const IPAPISchema = z.object({
  country: z.string().optional(),
  country_code: z.string().optional(),
  countryCode: z.string().optional(),
});

// Create context with default undefined value
const CurrencyContext = createContext<CurrencyContextState | undefined>(undefined);

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyInfo>({ code: 'USD', symbol: '$' });
  const [currencies, setCurrencies] = useState<Record<string, Currency>>(CURRENCIES);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [autoDetect, setAutoDetect] = useState<boolean>(true);
  const [lastRatesUpdate, setLastRatesUpdate] = useState<number>(0);
  const [externalCurrencies, setExternalCurrencies] = useState<ICurrency[]>([]);

  // Cache duration constants
  const RATES_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
  const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

  // Fetch external currencies from the API
  const fetchExternalCurrencies = async (): Promise<ICurrency[]> => {
    const MAX_RETRIES = 3;
    let retries = 0;

    // First check if we have cached currencies in state
    if (externalCurrencies.length > 0) {
      console.log('Using cached currencies from state');
      return externalCurrencies;
    }

    // Then check if we have cached currencies in localStorage
    try {
      const cachedCurrencies = localStorage.getItem('cachedCurrencies');
      if (cachedCurrencies) {
        const parsed = JSON.parse(cachedCurrencies);
        const timestamp = parsed.timestamp || 0;
        
        // Use cached data if less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000 && Array.isArray(parsed.currencies) && parsed.currencies.length > 0) {
          console.log('Using cached currencies from localStorage');
          setExternalCurrencies(parsed.currencies);
          return parsed.currencies;
        }
      }
    } catch (cacheError) {
      console.warn('Error reading cached currencies:', cacheError);
      // Continue to API call if cache read fails
    }

    // Create fallback currencies from CURRENCIES constant - will be used if API fails
    const fallbackCurrencies: ICurrency[] = Object.entries(CURRENCIES).map(([code, curr]) => ({
      _id: code,
      country: curr.name,
      countryCode: code,
      valueWrtUSD: curr.rate,
      symbol: curr.symbol,
      isActive: true
    }));
    
    // Skip API calls in development or if API isn't available
    if (process.env.NODE_ENV === 'development' || 
        process.env.NEXT_PUBLIC_SKIP_CURRENCY_API === 'true') {
      console.log('Skipping currency API call in development - using fallback data');
      setExternalCurrencies(fallbackCurrencies);
      
      // Still cache the fallback currencies for future use
      localStorage.setItem('cachedCurrencies', JSON.stringify({ 
        currencies: fallbackCurrencies,
        timestamp: Date.now()
      }));
      
      return fallbackCurrencies;
    }

    // Now try the API
    while (retries < MAX_RETRIES) {
      try {
        // Use a more reliable way to get the API URL
        let baseUrl = '';
        
        try {
          // Try to dynamically import, but catch any import errors
          const { apiBaseUrl } = await import('@/apis/config');
          baseUrl = apiBaseUrl || '';
        } catch (importError) {
          console.warn('Error importing API config:', importError);
        }
        
        // Fallback options if import fails
        if (!baseUrl) {
          baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
                   'https://api.medh.io/api/v1';
        }
        
        const url = `${baseUrl}/currencies`;
        
        console.log(`Fetching currencies from ${url} (Attempt ${retries + 1}/${MAX_RETRIES})`);
        
        const response = await axios.get(url, { 
          timeout: 8000,
          headers: {
            'X-Request-ID': `currency-req-${Date.now()}`
          }
        });
        
        const validatedData = z.object({
          status: z.string(),
          results: z.number(),
          data: z.object({
            currencies: z.array(z.object({
              _id: z.string(),
              country: z.string(),
              countryCode: z.string(),
              valueWrtUSD: z.number(),
              symbol: z.string(),
              isActive: z.boolean(),
              createdAt: z.string().optional(),
              updatedAt: z.string().optional(),
            }))
          })
        }).safeParse(response.data);

        if (validatedData.success) {
          const currencies = validatedData.data.data.currencies;
          
          // Cache the currencies
          setExternalCurrencies(currencies);
          localStorage.setItem('cachedCurrencies', JSON.stringify({ 
            currencies,
            timestamp: Date.now()
          }));
          
          console.log(`Successfully fetched ${currencies.length} currencies`);
          return currencies;
        }

        throw new Error('Invalid response format from currencies API');
      } catch (error) {
        retries++;
        
        if (retries < MAX_RETRIES) {
          // For all errors, we retry with backoff
          const backoffTime = 1000 * Math.pow(2, retries - 1); // Exponential backoff
          console.log(`Error fetching currencies, retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          continue;
        }
        
        console.error('Error fetching external currencies:', 
          error instanceof Error ? error.message : String(error)
        );
        
        break;
      }
    }
    
    // Return fallback static currencies if all API calls fail
    console.warn('Using fallback static currencies after API failure');
    setExternalCurrencies(fallbackCurrencies);
    
    // Cache the fallback currencies as well
    localStorage.setItem('cachedCurrencies', JSON.stringify({ 
      currencies: fallbackCurrencies,
      timestamp: Date.now()
    }));
    
    return fallbackCurrencies;
  };

  // Fetch exchange rates using our proxy API
  const fetchExchangeRates = async (): Promise<Record<string, number>> => {
    try {
      // Use our own proxy API to avoid CORS issues and protect API keys
      const response = await axios.get('/api/proxy/exchange-rates', { 
        params: { base: 'USD' },
        timeout: 5000,
        // Adding cache busting parameter to avoid stale responses
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Request-Time': Date.now().toString()
        }
      });
      
      // Validate response with zod
      const validatedData = ExchangeRatesSchema.safeParse(response.data);
      
      if (validatedData.success && validatedData.data.rates) {
        console.log('Successfully fetched exchange rates from proxy API');
        return validatedData.data.rates;
      }
      
      console.warn('Invalid response format from exchange rates API, using fallback rates');
      return Object.fromEntries(
        Object.entries(CURRENCIES).map(([code, currency]) => [code, currency.rate])
      );
    } catch (error) {
      // Log error but with more details for troubleshooting
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorDetails = error instanceof Error && error.stack ? error.stack : '';
      console.error(`Error fetching exchange rates: ${errorMessage}${errorDetails ? `\nStack: ${errorDetails}` : ''}`);
      
      // If proxy API fails, return default rates from our constants
      console.warn('Using fallback static exchange rates due to API error');
      return Object.fromEntries(
        Object.entries(CURRENCIES).map(([code, currency]) => [code, currency.rate])
      );
    }
  };

  // Fetch country code with fallback using our proxy API
  const fetchCountryCode = async (): Promise<string> => {
    try {
      // Use our own proxy API to avoid CORS issues and protect API keys
      const response = await axios.get('/api/proxy/ipapi', { 
        timeout: 5000,
        // Adding cache busting parameter to avoid stale responses
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Request-Time': Date.now().toString()
        }
      });
      
      // Validate response with zod
      const validatedData = IPAPISchema.safeParse(response.data);
      
      if (validatedData.success) {
        const countryCode = validatedData.data.country || 
                            validatedData.data.country_code || 
                            validatedData.data.countryCode;
                            
        if (countryCode && typeof countryCode === 'string') {
          console.log(`Country detected: ${countryCode} from proxy API`);
          return countryCode;
        }
      }
      
      console.warn('Invalid country code from location API, trying browser locale');
      throw new Error('Invalid country code from location API');
    } catch (error) {
      // Log error but with more context for debugging
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.debug(`IP API error details: ${errorMessage}`);
      
      // If proxy API fails, try to get from browser
      try {
        const browserLocale = navigator.language || (navigator as any).userLanguage;
        const countryCode = browserLocale.split('-')[1];
        if (countryCode && countryCode.length === 2) {
          console.log(`Country detected from browser: ${countryCode}`);
          return countryCode;
        }
      } catch (browserError) {
        console.error('Error getting browser locale:', browserError instanceof Error ? browserError.message : String(browserError));
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
      if (now - lastRatesUpdate > REFRESH_INTERVAL) {
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
      console.error('Error refreshing exchange rates:', error instanceof Error ? error.message : String(error));
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
          if (rates && timestamp && Date.now() - timestamp < RATES_CACHE_DURATION) {
            setExchangeRates(rates);
            setLastRatesUpdate(timestamp);
          } else {
            // Cached rates are too old, fetch new ones
            await refreshRates();
          }
        } catch (error) {
          console.error('Error parsing cached exchange rates:', error instanceof Error ? error.message : String(error));
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
          console.error('Error parsing stored currency:', parseError instanceof Error ? parseError.message : String(parseError));
        }
      }

      // Auto-detect currency based on location (if enabled)
      if (autoDetect) {
        const countryCode = await fetchCountryCode();
        const newCurrency = getCurrencyForCountry(countryCode);
        
        // Store the currency preference
        localStorage.setItem('preferredCurrency', JSON.stringify(newCurrency));
        setCurrency(newCurrency);
      }
    } catch (error) {
      console.error('Error setting initial currency:', error instanceof Error ? error.message : String(error));
      // Fallback to default currency
      setCurrency(DEFAULT_CURRENCY);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually change currency
  const changeCurrency = useCallback((newCurrencyCode: CurrencyCode): void => {
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
      console.error('Error changing currency:', error instanceof Error ? error.message : String(error));
      // If error, keep current currency
    }
  }, []);

  // Update the currencies object with new values
  const updateCurrencies = useCallback((currenciesObject: Record<string, Currency>) => {
    setCurrencies(currenciesObject);
    localStorage.setItem('appCurrencies', JSON.stringify(currenciesObject));
  }, []);

  // Set auto detect preference
  const setAutoDetectPreference = useCallback((value: boolean) => {
    setAutoDetect(value);
    localStorage.setItem('autoDetectCurrency', JSON.stringify(value));
  }, []);

  // Setup initial currency and exchange rates
  useEffect(() => {
    // Initialize with a small delay to avoid blocking page render
    const initTimeout = setTimeout(() => {
      setInitialCurrency().catch(error => {
        console.error('Failed to initialize currency context:', error);
        // Even if initialization fails, make sure we're not stuck in loading state
        setLoading(false);
      });
      
      fetchExternalCurrencies().catch(error => {
        console.error('Failed to fetch external currencies:', error);
      });
    }, 100);
    
    // Set up periodic rate refresh
    const refreshInterval = setInterval(() => {
      refreshRates().catch(error => {
        console.debug('Background rate refresh failed:', error);
        // Silent fail for background updates
      });
    }, REFRESH_INTERVAL);
    
    return () => {
      clearTimeout(initTimeout);
      clearInterval(refreshInterval);
    };
  }, [autoDetect]); // Re-run when autoDetect changes

  // Initial setup
  useEffect(() => {
    const storedAutoDetect = localStorage.getItem('autoDetectCurrency');
    if (storedAutoDetect !== null) {
      setAutoDetect(JSON.parse(storedAutoDetect));
    }
    
    const storedCurrencies = localStorage.getItem('appCurrencies');
    if (storedCurrencies) {
      setCurrencies(JSON.parse(storedCurrencies));
    }
  }, []);

  // Convert price from USD to selected currency using real-time rates
  const convertPrice = useCallback((priceInUSD: number | undefined | null, toCurrencyCode?: CurrencyCode): number => {
    if (priceInUSD === null || priceInUSD === undefined) return 0;
    
    const targetCurrency = toCurrencyCode || currency.code;
    
    // Use real-time rates from API first, fall back to static rates
    const rate = exchangeRates[targetCurrency] || CURRENCIES[targetCurrency]?.rate || 1;
    
    return Number((priceInUSD * rate).toFixed(2));
  }, [currency.code, exchangeRates]);

  // Format price with currency symbol using Intl.NumberFormat for better localization
  const formatPrice = useCallback((price: number | undefined | null, showCurrency = true, currencyCode?: CurrencyCode): string => {
    if (price === undefined || price === null) return '';
    
    const targetCurrency = currencyCode || currency.code;
    const { symbol } = CURRENCIES[targetCurrency] || CURRENCIES.USD;
    
    // Use Intl.NumberFormat for better number formatting
    if (showCurrency) {
      return `${symbol}${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price)}`;
    } else {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    }
  }, [currency.code]);

  // Get all available currencies (memoized)
  const getAvailableCurrencies = useCallback((): Array<Currency & { code: CurrencyCode }> => {
    return Object.entries(CURRENCIES).map(([code, details]) => ({
      code: code as CurrencyCode,
      ...details,
    }));
  }, []);

  // Get current currency info (memoized)
  const getCurrentCurrency = useCallback((): (Currency & { code: CurrencyCode }) | null => {
    if (!currency.code || !CURRENCIES[currency.code]) return null;
    
    return {
      code: currency.code,
      ...CURRENCIES[currency.code]
    };
  }, [currency.code]);

  // Maps ICurrency from API to internal Currency format
  const mapExternalToInternalCurrency = useCallback((extCurrency: ICurrency): Currency & { code: string } => {
    return {
      code: extCurrency.countryCode,
      symbol: extCurrency.symbol,
      name: extCurrency.country,
      rate: extCurrency.valueWrtUSD
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currency,
    currencies,
    exchangeRates,
    loading,
    convertPrice,
    formatPrice,
    changeCurrency,
    getAvailableCurrencies,
    getCurrentCurrency,
    refreshRates,
    updateCurrencies,
    setAutoDetectPreference,
    autoDetect,
    fetchExternalCurrencies
  }), [
    currency, 
    currencies, 
    exchangeRates, 
    loading, 
    convertPrice, 
    formatPrice, 
    changeCurrency, 
    getAvailableCurrencies, 
    getCurrentCurrency, 
    refreshRates,
    updateCurrencies, 
    setAutoDetectPreference, 
    autoDetect,
    fetchExternalCurrencies
  ]);

  return (
    <CurrencyContext.Provider value={contextValue}>
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