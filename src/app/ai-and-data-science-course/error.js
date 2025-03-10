'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Error boundary for the AI and Data Science course page
 * This catches errors specific to this route, including chunk loading errors
 */
export default function AIDataScienceCourseError({ error, reset }) {
  useEffect(() => {
    // Log the specific error
    console.error('AI & Data Science course error caught:', error);
    
    // Analytics could be added here to track this specific error
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          AI & Data Science Course
        </h1>
        
        <h2 className="text-xl font-semibold text-red-600 mb-6">
          We encountered an issue loading this page
        </h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-gray-700">
            We're working to resolve this issue. In the meantime, you can explore our other courses or try again later.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Popular Alternatives</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/data-analytics-course" className="text-blue-600 hover:underline">
                  Data Analytics Course
                </Link>
              </li>
              <li>
                <Link href="/machine-learning-course" className="text-blue-600 hover:underline">
                  Machine Learning Course
                </Link>
              </li>
              <li>
                <Link href="/artificial-intelligence-course" className="text-blue-600 hover:underline">
                  Artificial Intelligence Course
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Try These Actions</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded mr-2">1</span>
                <span>Clear your browser cache and reload</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded mr-2">2</span>
                <span>Try using a different browser</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded mr-2">3</span>
                <span>Check your internet connection</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <Link href="/courses" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            View All Courses
          </Link>
          
          <Link href="/" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 