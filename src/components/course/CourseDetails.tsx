import React, { useState } from 'react';
import { Course } from '@/types/course';
import CourseFee from './CourseFee';
import { useCourseFee } from '@/hooks/useCourseFee';

interface CourseDetailsProps {
  course: Course;
  currency?: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ 
  course, 
  currency = 'USD' 
}) => {
  const [priceType, setPriceType] = useState<'individual' | 'batch'>('individual');
  
  // Example of using the useCourseFee hook
  const { 
    originalFee, 
    discountedFee, 
    isLoading, 
    hasDiscount, 
    discountAmount,
    batchInfo
  } = useCourseFee(course, {
    currency,
    priceType,
    applyDiscount: true,
    discountPercentage: 10 // 10% discount example
  });
  
  if (isLoading) {
    return <div>Loading course details...</div>;
  }
  
  return (
    <div className="course-details">
      <h1>{course.course_title}</h1>
      <p className="course-category">{course.course_category}</p>
      
      <div className="course-info">
        <div className="info-item">
          <span className="label">Duration:</span>
          <span className="value">{course.course_duration}</span>
        </div>
        <div className="info-item">
          <span className="label">Sessions:</span>
          <span className="value">{course.no_of_Sessions}</span>
        </div>
      </div>
      
      <div className="course-fee-section">
        <h2>Pricing</h2>
        
        <div className="pricing-toggle">
          <button 
            className={`toggle-btn ${priceType === 'individual' ? 'active' : ''}`}
            onClick={() => setPriceType('individual')}
          >
            Individual
          </button>
          <button 
            className={`toggle-btn ${priceType === 'batch' ? 'active' : ''}`}
            onClick={() => setPriceType('batch')}
          >
            Batch
          </button>
        </div>
        
        {/* Using the CourseFee component */}
        <CourseFee 
          course={course} 
          currency={currency} 
          className="main-fee"
          showBatchPricing={priceType === 'batch'}
        />
        
        {/* Using the hook directly for more complex display */}
        {hasDiscount && (
          <div className="discount-info">
            <p className="original-price">
              Original Price: {currency} {originalFee?.toLocaleString()}
            </p>
            <p className="discount-amount">
              You save: {currency} {discountAmount?.toLocaleString()}
            </p>
            <p className="final-price">
              Final Price: {currency} {discountedFee?.toLocaleString()}
            </p>
          </div>
        )}
        
        {priceType === 'batch' && batchInfo && (
          <div className="batch-info">
            <h3>Batch Details</h3>
            <p>Minimum Batch Size: {batchInfo.minBatchSize} students</p>
            <p>Maximum Batch Size: {batchInfo.maxBatchSize} students</p>
            {batchInfo.groupDiscount > 0 && (
              <p>Group Discount: {batchInfo.groupDiscount}%</p>
            )}
          </div>
        )}
      </div>
      
      <div className="course-description">
        <h2>Course Description</h2>
        <div dangerouslySetInnerHTML={{ __html: course.course_description.replace(/\n/g, '<br />') }} />
      </div>
    </div>
  );
};

export default CourseDetails; 