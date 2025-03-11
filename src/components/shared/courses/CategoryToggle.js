"use client";
import CategoryFilter from "@/components/sections/courses/CategoryFilter";
import { ArrowLeft, Filter, Search, X } from "lucide-react";
import React from "react";

const CategoryToggle = ({
  categorySliderOpen,
  toggleCategorySlider,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleClearFilters,
  searchTerm,
  handleSearch,
  customClass = "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30"
}) => {
  // Mobile sidebar functionality
  if (categorySliderOpen !== undefined) {
    return (
      <div className="md:hidden">
        {/* Mobile sidebar trigger */}
        <div 
          className="flex justify-between items-center py-2"
          aria-hidden={!categorySliderOpen}
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCategory.length} {selectedCategory.length === 1 ? 'category' : 'categories'} selected
          </span>
        </div>

        {/* Slide-in sidebar for mobile */}
        <div
          className={`fixed top-0 right-0 w-[90vw] max-w-[400px] h-[100vh] bg-white dark:bg-gray-800 shadow-xl z-[10000000] transition-transform duration-300 ease-in-out transform ${
            categorySliderOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button 
              onClick={toggleCategorySlider} 
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close categories panel"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Categories
            </h2>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          {/* Search and category filters */}
          <div className="p-4 overflow-auto h-[calc(100vh-70px)]">
            {/* Search input */}
            <div className="relative mb-6 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Category filter component */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              heading="Filter by Category"
            />
            
            {/* Clear filters button */}
            {(selectedCategory.length > 0 || searchTerm) && (
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={handleClearFilters}
                  className="flex items-center justify-center w-full px-4 py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30 font-medium rounded-lg transition-colors"
                >
                  <X size={18} className="mr-2" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Simple category buttons (used in course filter)
  return (
    <div className="flex flex-wrap gap-2">
      {categories?.map((category, idx) => (
        <button
          key={`cat-toggle-${idx}`}
          onClick={() => setSelectedCategory([...new Set([...selectedCategory, category])])}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            selectedCategory.includes(category)
              ? "bg-blue-600 text-white"
              : customClass
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryToggle;
