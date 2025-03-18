'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, AlarmClock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Course Not Found</h1>
          </div>
        </div>
      </header>

      {/* 404 Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="relative mx-auto w-64 h-64 mb-8">
            {/* Animated illustration can be added here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 animate-pulse bg-emerald-50 dark:bg-emerald-900/20 rounded-full"></div>
                <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
            We couldn't find the course you're looking for. It may have been removed, renamed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/enrollment"
              className="px-6 py-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium"
            >
              Browse All Courses
            </Link>
            
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} MEDH. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
                Contact Support
              </Link>
              <Link href="/enrollment" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
                Course Catalog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 