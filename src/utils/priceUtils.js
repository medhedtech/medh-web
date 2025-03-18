/**
 * Utility functions for formatting and handling prices throughout the application
 */

/**
 * Formats a price with the appropriate currency symbol and decimal places
 * 
 * Note: This is a fallback function when you cannot use the CurrencyContext.
 * Prefer using the `formatPrice` function from useCurrency() hook when possible.
 * 
 * @param {Number} price - The price to format
 * @param {String} currencyCode - The currency code (USD, EUR, etc.)
 * @param {Boolean} showSymbol - Whether to include the currency symbol
 * @returns {String} - Formatted price string
 */
export const formatPrice = (price, currencyCode = 'USD', showSymbol = true) => {
  if (price === undefined || price === null) return '';
  
  // Common currency symbols
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    AED: 'د.إ‎',
    SGD: 'S$'
  };
  
  const symbol = currencySymbols[currencyCode] || '$';
  const formattedPrice = typeof price === 'number' ? Math.round(price).toString() : price;
  
  return showSymbol ? `${symbol}${formattedPrice}` : formattedPrice;
};

/**
 * Calculates discount percentage between original and current price
 * 
 * @param {Number} originalPrice - The original price
 * @param {Number} currentPrice - The current/discounted price
 * @returns {Number} - Discount percentage as an integer
 */
export const calculateDiscountPercentage = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Determines if a price should be displayed as free
 * 
 * @param {Number} price - The price to check
 * @returns {Boolean} - Whether the price is considered free
 */
export const isFreePrice = (price) => {
  return price === 0 || price === '0' || price === '0.00' || price === null || price === undefined;
};

/**
 * Formats a free price display
 * 
 * @returns {String} - "Free" text
 */
export const getFreeLabel = () => {
  return 'Free';
}; 