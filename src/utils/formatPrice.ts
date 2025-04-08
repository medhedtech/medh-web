/**
 * Utility for formatting prices with currency symbols
 */

/**
 * Formats a price with the appropriate currency symbol
 * 
 * @param price - The price to format
 * @param currencyCode - The currency code (USD, EUR, etc.) - defaults to USD
 * @returns Formatted price string with currency symbol
 */
export const formatPrice = (price: number | undefined, currencyCode: string = 'USD'): string => {
  if (price === undefined || price === null) {
    return '';
  }
  
  if (price === 0) {
    return 'Free';
  }

  // Common currency symbols
  const currencySymbols: Record<string, string> = {
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
  
  return `${symbol}${price.toLocaleString()}`;
}; 