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
    if (Array.isArray(selectedCategory)) {
      if (selectedCategory.includes(category)) {
        setSelectedCategory(selectedCategory.filter((c) => c !== category));
      } else {
        setSelectedCategory([...selectedCategory, category]);
      }
    } else {
      if (selectedCategory === category) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(category);
      }
    }
  };

  // Check if a category is selected
  const isChecked = (category) => {
    if (Array.isArray(selectedCategory)) {
      return selectedCategory.includes(category);
    }
    return selectedCategory === category;
  };

  return (
    <div className="w-full dark:text-gray-300 rounded-md">
      {heading && (
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {heading}
        </h2>
      )}
      <div className="flex flex-col space-y-2">
        {categories.map((category) => (
          <div 
            key={category} 
            className="group"
          >
            <label 
              className="flex items-start cursor-pointer group select-none"
              htmlFor={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
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
                  id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  className="sr-only" // Visually hidden but accessible
                  checked={isChecked(category)}
                  onChange={() => handleCategoryChange(category)}
                  aria-label={`Filter by ${category}`}
                />
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                {category}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
