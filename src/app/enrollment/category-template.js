'use client';

/**
 * This file serves as a template for category-specific enrollment pages.
 * It can be customized by adding URL parameters for each category,
 * such as: /enrollment?category=vedic-mathematics
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { motion } from 'framer-motion';

// The main category page component
const CategoryEnrollmentPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  
  // Define category mappings
  const categoryInfo = {
    'vedic-mathematics': {
      displayName: 'Vedic Mathematics',
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
    },
    'ai-and-data-science': {
      displayName: 'AI & Data Science',
      colorClass: 'text-violet-600',
      bgClass: 'bg-violet-50',
    },
    'digital-marketing': {
      displayName: 'Digital Marketing',
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
    },
    'personality-development': {
      displayName: 'Personality Development',
      colorClass: 'text-pink-600',
      bgClass: 'bg-pink-50',
    }
  };
  
  // Get information for the current category
  const currentCategory = categoryInfo[category] || {
    displayName: 'All Courses',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentCategory.displayName}
              </h1>
              <span className={`px-2 py-1 text-xs font-medium ${currentCategory.bgClass} ${currentCategory.colorClass} rounded-full`}>
                Courses
              </span>
            </div>
          </nav>
        </header>
        
        {/* Content */}
        <main className="pt-20 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentCategory.displayName} <span className={currentCategory.colorClass}>Courses</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  This is a template for category-specific enrollment pages. You can use this as a starting point to develop dynamic category pages.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">How to Use This Template</h2>
                <p className="mb-4">You can access category-specific pages using URL parameters:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li><code>/enrollment?category=vedic-mathematics</code></li>
                  <li><code>/enrollment?category=ai-and-data-science</code></li>
                  <li><code>/enrollment?category=digital-marketing</code></li>
                  <li><code>/enrollment?category=personality-development</code></li>
                </ul>
                <p>
                  To create a fully dynamic route structure, you'll need to implement <code>/enrollment/[categoryname]/page.js</code> following Next.js dynamic routing patterns.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
};

export default CategoryEnrollmentPage; 