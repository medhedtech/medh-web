"use client";
import ErrorMain from "@/components/layout/main/ErrorMain";
import React, { useEffect } from "react";

// Types
interface IErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for the Next.js application
 * This catches errors at the route level, including chunk loading errors
 */
const ErrorBoundary: React.FC<IErrorBoundaryProps> = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to console
    console.error('Route-level error caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h1>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          {error?.digest && (
            <p className="text-sm text-gray-500 mt-2">
              Error digest: {error.digest}
            </p>
          )}
        </div>
        
        <p className="mb-6 text-gray-600">
          This could be due to a temporary network issue, a code problem, or an incompatibility with your browser.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Return to Home
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 