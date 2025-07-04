import axios from 'axios';
import { 
  apiUrls, 
  ICurrency, 
  ICurrencyResponse, 
  ICurrenciesResponse, 
  ICreateCurrencyInput, 
  IUpdateCurrencyInput 
} from '../index';

/**
 * Fetches all currencie
 * @returns Promise with array of currencies
 */
export const getAllCurrencies = async (): Promise<ICurrency[]> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Make API request with authentication header
    const response = await axios.get<ICurrenciesResponse>(apiUrls.currencies.getAllCurrencies, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data.currencies;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

/**
 * Fetches a currency by its ID
 * @param id - Currency ID
 * @returns Promise with the currency data
 */
export const getCurrencyById = async (id: string): Promise<ICurrency> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Make API request with authentication header
    const response = await axios.get<ICurrencyResponse>(apiUrls.currencies.getCurrencyById(id), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data.currency;
  } catch (error) {
    console.error(`Error fetching currency with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches a currency by country code
 * @param code - Country code (e.g., "USD", "EUR")
 * @returns Promise with the currency data
 */
export const getCurrencyByCountryCode = async (code: string): Promise<ICurrency> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Make API request with authentication header
    const response = await axios.get<ICurrencyResponse>(apiUrls.currencies.getCurrencyByCountryCode(code), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data.currency;
  } catch (error) {
    console.error(`Error fetching currency with country code ${code}:`, error);
    throw error;
  }
};

/**
 * Creates a new currency
 * @param currencyData - Currency data to create
 * @returns Promise with the created currency
 */
export const createCurrency = async (currencyData: ICreateCurrencyInput): Promise<ICurrency> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Make API request with authentication header
    const response = await axios.post<ICurrencyResponse>(
      apiUrls.currencies.createCurrency, 
      currencyData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data.currency;
  } catch (error) {
    console.error('Error creating currency:', error);
    throw error;
  }
};

/**
 * Updates an existing currency
 * @param id - Currency ID
 * @param updateData - Currency data to update
 * @returns Promise with the updated currency
 */
export const updateCurrency = async (id: string, updateData: IUpdateCurrencyInput): Promise<ICurrency> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Make API request with authentication header
    const response = await axios.put<ICurrencyResponse>(
      apiUrls.currencies.updateCurrency(id), 
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data.currency;
  } catch (error) {
    console.error(`Error updating currency with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a currency
 * @param id - Currency ID to delete
 */
export const deleteCurrency = async (id: string): Promise<void> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Make API request with authentication header
    await axios.delete(apiUrls.currencies.deleteCurrency(id), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`Error deleting currency with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Toggles the active status of a currency
 * @param id - Currency ID
 * @returns Promise with the updated currency
 */
export const toggleCurrencyStatus = async (id: string): Promise<ICurrency> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Make API request with authentication header
    const response = await axios.patch<ICurrencyResponse>(apiUrls.currencies.toggleCurrencyStatus(id), {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data.currency;
  } catch (error) {
    console.error(`Error toggling status for currency with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Converts an amount from one currency to another
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Promise with the converted amount
 */
export const convertCurrency = async (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<number> => {
  try {
    // Get the source currency
    let sourceCurrency;
    let targetCurrency;
    
    try {
      sourceCurrency = await getCurrencyByCountryCode(fromCurrency);
      targetCurrency = await getCurrencyByCountryCode(toCurrency);
    } catch (error) {
      console.warn(`Error fetching currency data for conversion, using fallback values:`, error);
      // Fallback to approximate rates if API call fails
      sourceCurrency = { valueWrtUSD: fromCurrency === 'USD' ? 1 : 0.01 };
      targetCurrency = { valueWrtUSD: toCurrency === 'USD' ? 1 : 80 };
    }
    
    // Convert to USD first (if not already USD)
    const amountInUSD = fromCurrency === 'USD' 
      ? amount 
      : amount / sourceCurrency.valueWrtUSD;
    
    // Convert from USD to target currency (if not USD)
    const convertedAmount = toCurrency === 'USD'
      ? amountInUSD
      : amountInUSD * targetCurrency.valueWrtUSD;
    
    return Number(convertedAmount.toFixed(2));
  } catch (error) {
    console.error(`Error converting ${amount} ${fromCurrency} to ${toCurrency}:`, error);
    // Return original amount as fallback
    return amount;
  }
};

/**
 * Formats an amount in the specified currency
 * @param amount - Amount to format
 * @param currencyCode - Currency code
 * @returns Formatted currency string
 */
export const formatCurrency = async (amount: number, currencyCode: string): Promise<string> => {
  try {
    let currency;
    
    try {
      currency = await getCurrencyByCountryCode(currencyCode);
    } catch (error) {
      console.warn(`Error fetching currency for formatting, using fallback:`, error);
      // Use default symbol based on common currencies if API call fails
      const fallbackSymbols: {[key: string]: string} = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'INR': '₹',
        'CNY': '¥', 'KRW': '₩', 'AUD': 'A$', 'CAD': 'C$', 'AED': 'د.إ'
      };
      return `${fallbackSymbols[currencyCode] || ''}${amount.toLocaleString()} ${currencyCode}`;
    }
    
    return `${currency.symbol}${amount.toLocaleString()}`;
  } catch (error) {
    // Fallback to a basic format if currency information is not available
    console.error(`Error formatting amount in ${currencyCode}:`, error);
    return `${amount.toLocaleString()} ${currencyCode}`;
  }
}; 