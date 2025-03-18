'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Enrollment error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Something Went Wrong</h1>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-3xl">
          <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 dark:bg-red-800/30 p-3">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3 text-center">
              We encountered an issue
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              {error?.message || "We're having trouble loading this page. Please try again or contact support if the problem persists."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => reset()}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors inline-flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              
              <Link 
                href="/enrollment"
                className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium inline-flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Courses
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} MEDH. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                Contact Support
              </Link>
              <Link href="/enrollment" className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                Course Catalog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 