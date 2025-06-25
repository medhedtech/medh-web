"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {error.message}
          </p>
          <button
            onClick={resetErrorBoundary}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

// Client component wrapper for the demo classes dashboard
const DemoClassesDashboardWrapper = dynamic(
  () => import("@/components/sections/dashboards/DemoClassesDashboard").then(mod => mod.default),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Loading Demo Classes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we fetch your demo classes...
            </p>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);

// Server component
export default function DemoClassesDashboardPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Initializing Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we set up your dashboard...
              </p>
            </div>
          </div>
        </div>
      }>
        <DemoClassesDashboardWrapper />
      </Suspense>
    </ErrorBoundary>
  );
} 