'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Flame } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Minimal Header */}
      <header className="py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Minimal Under Development Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="relative mx-auto w-64 h-64 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 animate-pulse bg-orange-50 dark:bg-orange-900/20 rounded-full"></div>
                <Flame className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-orange-500 dark:text-orange-400" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            We're Cooking Something Great
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
            This feature is currently under development. We're working hard to bring you something special. Stay tuned!
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      {/* Minimal Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} MEDH. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 