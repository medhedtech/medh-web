"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CategorySelect = ({ handleCategory, handleCategoryType, errors, selected, selectedType, setSelected, setSelectedType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Artificial Intelligence",
    "Blockchain",
    "UI/UX Design"
  ];

  const categoryTypes = [
    "Live",
    "Hybrid",
    "Pre-Recorded",
    "Free"
  ];

  const handleSelect = (category) => {
    setSelected(category);
    handleCategory(category);
    setIsOpen(false);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    handleCategoryType(type);
    setIsTypeOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Category Select */}
      <div className="relative">
        <label className="block text-sm font-medium mb-2">
          Course Category <span className="text-red-500">*</span>
        </label>
        <div 
          className="relative cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={`
            w-full p-3 border rounded-lg flex justify-between items-center
            ${errors?.category ? 'border-red-500' : 'border-gray-300'}
            hover:border-gray-400 transition-colors
            dark:bg-gray-700 dark:border-gray-600
          `}>
            <span className={selected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
              {selected || 'Select category'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700
                    ${selected === category ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400' : ''}
                  `}
                  onClick={() => handleSelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors?.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Category Type Select */}
      <div className="relative">
        <label className="block text-sm font-medium mb-2">
          Category Type <span className="text-red-500">*</span>
        </label>
        <div 
          className="relative cursor-pointer"
          onClick={() => setIsTypeOpen(!isTypeOpen)}
        >
          <div className={`
            w-full p-3 border rounded-lg flex justify-between items-center
            ${errors?.categoryType ? 'border-red-500' : 'border-gray-300'}
            hover:border-gray-400 transition-colors
            dark:bg-gray-700 dark:border-gray-600
          `}>
            <span className={selectedType ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
              {selectedType || 'Select type'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isTypeOpen ? 'transform rotate-180' : ''}`} />
          </div>

          {isTypeOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {categoryTypes.map((type) => (
                <div
                  key={type}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700
                    ${selectedType === type ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400' : ''}
                  `}
                  onClick={() => handleTypeSelect(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors?.categoryType && (
          <p className="text-red-500 text-xs mt-1">{errors.categoryType.message}</p>
        )}
      </div>
    </div>
  );
};

export default CategorySelect;
