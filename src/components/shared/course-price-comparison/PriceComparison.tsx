"use client";

import React from 'react';
import { Users, User, CheckCircle } from 'lucide-react';
import { getCoursePriceValue, getMinBatchSize } from '@/utils/priceUtils';
import clsx from 'clsx';

interface PriceComparisonProps {
  course: any;
  onSelectPricingType: (type: 'individual' | 'batch') => void;
  selectedType: 'individual' | 'batch';
  className?: string;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({
  course,
  onSelectPricingType,
  selectedType = 'batch',
  className = ''
}) => {
  
  // Get pricing information
  const individualPrice = getCoursePriceValue(course, false);
  const batchPrice = getCoursePriceValue(course, true);
  const minBatchSize = getMinBatchSize(course);
  
  // Format prices in current currency
  const formattedIndividualPrice = `$${individualPrice}`;
  const formattedBatchPrice = `$${batchPrice}`;
  
  // Calculate savings
  const savingsPercentage = Math.round(((individualPrice - batchPrice) / individualPrice) * 100);
  const savingsAmount = `$${individualPrice - batchPrice}`;
  
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {/* Individual Price Card */}
      <div 
        className={clsx(
          'border rounded-lg p-4 flex flex-col relative transition-all duration-200',
          selectedType === 'individual' 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700/50 cursor-pointer'
        )}
        onClick={() => onSelectPricingType('individual')}
      >
        {selectedType === 'individual' && (
          <div className="absolute -top-3 -right-3 bg-primary-500 text-white rounded-full p-1">
            <CheckCircle size={20} />
          </div>
        )}
        
        <div className="flex items-center mb-3">
          <div className="mr-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
            <User size={20} className="text-gray-700 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold">Individual Enrollment</h3>
        </div>
        
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formattedIndividualPrice}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            per student
          </div>
        </div>
        
        <ul className="space-y-2 flex-grow mb-4">
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Full access to all course materials</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Self-paced learning</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Certificate upon completion</span>
          </li>
        </ul>
        
        <button 
          className={clsx(
            'w-full py-2 rounded-md font-medium text-center transition-colors',
            selectedType === 'individual'
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          )}
          onClick={() => onSelectPricingType('individual')}
        >
          {selectedType === 'individual' ? 'Selected' : 'Choose Individual'}
        </button>
      </div>
      
      {/* Batch Price Card */}
      <div 
        className={clsx(
          'border rounded-lg p-4 flex flex-col relative transition-all duration-200',
          selectedType === 'batch'
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700/50 cursor-pointer'
        )}
        onClick={() => onSelectPricingType('batch')}
      >
        {selectedType === 'batch' && (
          <div className="absolute -top-3 -right-3 bg-primary-500 text-white rounded-full p-1">
            <CheckCircle size={20} />
          </div>
        )}
        
        {savingsPercentage > 0 && (
          <div className="absolute -top-3 -left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Save {savingsPercentage}%
          </div>
        )}
        
        <div className="flex items-center mb-3">
          <div className="mr-3 bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full">
            <Users size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold">Batch Enrollment ({minBatchSize}+ students)</h3>
        </div>
        
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formattedBatchPrice}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            per student
          </div>
          
          {savingsPercentage > 0 && (
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              Save {savingsAmount} per student
            </div>
          )}
        </div>
        
        <ul className="space-y-2 flex-grow mb-4">
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Everything in Individual plan</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Group discount for {minBatchSize}+ students</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Dedicated support for your group</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Progress tracking for group admins</span>
          </li>
        </ul>
        
        <button 
          className={clsx(
            'w-full py-2 rounded-md font-medium text-center transition-colors',
            selectedType === 'batch'
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          )}
          onClick={() => onSelectPricingType('batch')}
        >
          {selectedType === 'batch' ? 'Selected' : 'Choose Batch Enrollment'}
        </button>
      </div>
    </div>
  );
};

export default PriceComparison; 