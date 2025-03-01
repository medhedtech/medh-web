"use client";
import React from "react";
import { CheckSquare, Square } from "lucide-react";

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  heading,
}) => {
  const handleCategoryChange = (category) => {
    const categoryValue = typeof category === 'object' ? category.category_name : category;
    
    if (Array.isArray(selectedCategory)) {
      if (selectedCategory.includes(categoryValue)) {
        setSelectedCategory(selectedCategory.filter((c) => c !== categoryValue));
      } else {
        setSelectedCategory([...selectedCategory, categoryValue]);
      }
    } else {
      // If selectedCategory is not an array, convert it to one
      if (selectedCategory === categoryValue) {
        setSelectedCategory([]);
      } else {
        setSelectedCategory([categoryValue]);
      }
    }
  };

  // Check if a category is selected
  const isChecked = (category) => {
    const categoryValue = typeof category === 'object' ? category.category_name : category;
    
    if (Array.isArray(selectedCategory)) {
      return selectedCategory.includes(categoryValue);
    }
    return selectedCategory === categoryValue;
  };

  // Get category display value
  const getCategoryDisplayValue = (category) => {
    return typeof category === 'object' ? category.category_name : category;
  };

  // Get category ID for HTML attributes
  const getCategoryId = (category) => {
    const value = getCategoryDisplayValue(category);
    return `category-${value.replace(/\s+/g, '-').toLowerCase()}`;
  };

  return (
    <div className="w-full dark:text-gray-300 rounded-md">
      {heading && (
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {heading}
        </h2>
      )}
      <div className="flex flex-col space-y-2">
        {categories?.map((category) => (
          <div 
            key={typeof category === 'object' ? category._id || category.category_name : category} 
            className="group"
          >
            <label 
              className="flex items-start cursor-pointer group select-none"
              htmlFor={getCategoryId(category)}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isChecked(category) ? (
                  <CheckSquare 
                    size={18} 
                    className="text-primary-500 dark:text-primary-400"
                  />
                ) : (
                  <Square 
                    size={18} 
                    className="text-gray-400 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-500 transition-colors"
                  />
                )}
                <input
                  type="checkbox"
                  id={getCategoryId(category)}
                  className="sr-only"
                  checked={isChecked(category)}
                  onChange={() => handleCategoryChange(category)}
                  aria-label={`Filter by ${getCategoryDisplayValue(category)}`}
                />
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                {getCategoryDisplayValue(category)}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
