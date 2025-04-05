import { useState, useEffect } from 'react';
import { Course } from '@/types/course';
import { getCourseFeeAsNumber, getBatchPricingInfo } from '@/utils/courseUtils';

interface UseCourseFeeOptions {
  currency?: string;
  priceType?: 'individual' | 'batch';
  applyDiscount?: boolean;
  discountPercentage?: number;
}

export const useCourseFee = (
  course: Course, 
  options: UseCourseFeeOptions = {}
) => {
  const { 
    currency = 'USD', 
    priceType = 'individual',
    applyDiscount = false, 
    discountPercentage = 0 
  } = options;
  
  const [originalFee, setOriginalFee] = useState<number | null>(null);
  const [discountedFee, setDiscountedFee] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [batchInfo, setBatchInfo] = useState<{
    batchPrice: number;
    minBatchSize: number;
    maxBatchSize: number;
    groupDiscount: number;
  } | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Get the original fee
    const fee = getCourseFeeAsNumber(course, currency, priceType);
    setOriginalFee(fee);
    
    // Get batch pricing info
    const batchPricing = getBatchPricingInfo(course, currency);
    setBatchInfo(batchPricing);
    
    // Calculate discounted fee if needed
    if (fee !== null && applyDiscount && discountPercentage > 0) {
      const discount = fee * (discountPercentage / 100);
      setDiscountedFee(fee - discount);
    } else {
      setDiscountedFee(fee);
    }
    
    setIsLoading(false);
  }, [course, currency, priceType, applyDiscount, discountPercentage]);
  
  return {
    originalFee,
    discountedFee,
    isLoading,
    hasDiscount: applyDiscount && discountPercentage > 0,
    discountAmount: originalFee !== null && discountedFee !== null 
      ? originalFee - discountedFee 
      : null,
    batchInfo
  };
}; 