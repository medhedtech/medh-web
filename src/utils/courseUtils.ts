import { Course } from "@/types/course";

/**
 * Formats the course fee for display
 * @param course The course object
 * @param currency The currency code (default: 'USD')
 * @param priceType The type of price to display ('individual' or 'batch')
 * @returns Formatted course fee string
 */
export const formatCourseFee = (
  course: Course, 
  currency: string = 'USD',
  priceType: 'individual' | 'batch' = 'individual'
): string => {
  // Get the price from prices array
  const price = course.prices?.find(p => p.currency === currency);
  
  if (price) {
    const fee = priceType === 'individual' ? price.individual : price.batch;
    return `${currency} ${fee.toLocaleString()}`;
  }
  
  // Fallback if no price is found
  return 'Price not available';
};

/**
 * Gets the course fee as a number
 * @param course The course object
 * @param currency The currency code (default: 'USD')
 * @param priceType The type of price to get ('individual' or 'batch')
 * @returns Course fee as a number or null if not available
 */
export const getCourseFeeAsNumber = (
  course: Course, 
  currency: string = 'USD',
  priceType: 'individual' | 'batch' = 'individual'
): number | null => {
  // Get the price from prices array
  const price = course.prices?.find(p => p.currency === currency);
  
  if (price) {
    return priceType === 'individual' ? price.individual : price.batch;
  }
  
  return null;
};

/**
 * Gets batch pricing information
 * @param course The course object
 * @param currency The currency code (default: 'USD')
 * @returns Batch pricing information or null if not available
 */
export const getBatchPricingInfo = (
  course: Course,
  currency: string = 'USD'
): { 
  batchPrice: number; 
  minBatchSize: number; 
  maxBatchSize: number;
  groupDiscount: number;
} | null => {
  const price = course.prices?.find(p => p.currency === currency);
  
  if (price) {
    return {
      batchPrice: price.batch,
      minBatchSize: price.min_batch_size,
      maxBatchSize: price.max_batch_size,
      groupDiscount: price.group_discount
    };
  }
  
  return null;
}; 