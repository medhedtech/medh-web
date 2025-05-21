/**
 * Calculates the percentage discount between original and current price
 * @param originalPrice - Original price before discount
 * @param currentPrice - Current price after discount
 * @returns Percentage discount rounded to nearest integer
 */
export const calculateDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
  if (!originalPrice || originalPrice <= 0 || !currentPrice) return 0;
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Determines if a price should be displayed as "Free"
 * @param price - Price to check
 * @returns Boolean indicating if price should be displayed as free
 */
export const isFreePrice = (price: number | null | undefined): boolean => {
  return price === 0 || price === null || price === undefined;
};

/**
 * Returns the appropriate label for free items
 * @param locale - Optional locale for translation
 * @returns Free label string
 */
export const getFreeLabel = (locale?: string): string => {
  return 'Free';
};

/**
 * Gets the appropriate price field from a course object, preferring 'prices' over 'course_fee'
 * @param course - Course object
 * @param isBatch - Whether to get batch price (true) or individual price (false)
 * @returns The appropriate price value
 */
export const getCoursePriceValue = (
  course: any, 
  isBatch: boolean = true
): number => {
  // If course has prices array, use it
  if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
    // Use the first active price (typically in base currency)
    const activePrice = course.prices.find((p: any) => p.is_active === true);
    
    if (activePrice) {
      return isBatch ? activePrice.batch : activePrice.individual;
    }
  }
  
  // Fall back to price/batchPrice if available
  if (isBatch && course.batchPrice !== undefined) {
    return course.batchPrice;
  }
  
  if (!isBatch && course.price !== undefined) {
    return course.price;
  }
  
  // Fall back to course_fee (with discount applied for batch)
  if (course.course_fee !== undefined) {
    return isBatch ? course.course_fee * 0.75 : course.course_fee;
  }
  
  // Last resort fallbacks
  return isBatch ? 24.00 : 32.00;
};

/**
 * Gets the appropriate minimum batch size from a course object
 * @param course - Course object
 * @returns The minimum batch size
 */
export const getMinBatchSize = (course: any): number => {
  // If course has prices array, use min_batch_size from there
  if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
    const activePrice = course.prices.find((p: any) => p.is_active === true);
    
    if (activePrice && activePrice.min_batch_size) {
      return activePrice.min_batch_size;
    }
  }
  
  // Fall back to course.minBatchSize if available
  if (course.minBatchSize !== undefined) {
    return course.minBatchSize;
  }
  
  // Default min batch size
  return 2;
};

/**
 * Formats a price for display using the application's currency context
 * @param price - Price to format
 * @param currencyCode - Optional currency code to override the current currency
 * @returns Formatted price string with currency symbol
 */
export const formatPriceWithCurrency = (
  price: number,
  currencyCode?: string
): string => {
  // This is a mock implementation since we can't use hooks directly in utility functions
  // In components, use the formatPrice function from useCurrency() directly
  
  if (price === 0) {
    return getFreeLabel();
  }
  
  // This is just a fallback for when the hook can't be used
  // Format with basic $ symbol if currency context not available
  return `$${price.toLocaleString()}`;
}; 