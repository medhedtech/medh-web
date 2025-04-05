import React from 'react';
import { Course } from '@/types/course';
import { formatCourseFee, getBatchPricingInfo } from '@/utils/courseUtils';

interface CourseFeeProps {
  course: Course;
  currency?: string;
  className?: string;
  showBatchPricing?: boolean;
}

const CourseFee: React.FC<CourseFeeProps> = ({ 
  course, 
  currency = 'USD',
  className = '',
  showBatchPricing = false
}) => {
  const individualFee = formatCourseFee(course, currency, 'individual');
  const batchPricingInfo = getBatchPricingInfo(course, currency);
  
  return (
    <div className={`course-fee ${className}`}>
      <div className="individual-pricing">
        <span className="fee-label">Individual Price:</span>
        <span className="fee-value">{individualFee}</span>
      </div>
      
      {showBatchPricing && batchPricingInfo && (
        <div className="batch-pricing">
          <span className="fee-label">Batch Price:</span>
          <span className="fee-value">
            {formatCourseFee(course, currency, 'batch')}
          </span>
          <div className="batch-details">
            <p>Min. Batch Size: {batchPricingInfo.minBatchSize} students</p>
            <p>Max. Batch Size: {batchPricingInfo.maxBatchSize} students</p>
            {batchPricingInfo.groupDiscount > 0 && (
              <p>Group Discount: {batchPricingInfo.groupDiscount}%</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFee; 