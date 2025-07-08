"use client";
import ErrorMain from "@/components/layout/main/ErrorMain";
import React, { useEffect, useState } from "react";
import { AlertTriangle, Copy, Home, RefreshCcw, Send, Bug, FileText } from "lucide-react";

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
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to console
    console.error('Route-level error caught:', error);
  }, [error]);

  const debugInfo = `Message: ${error?.message || 'N/A'}\n${error?.stack ? `Stack:\n${error.stack}` : ''}${error?.digest ? `\nDigest: ${error.digest}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(debugInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-2xl rounded-2xl shadow-xl p-0 overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 relative">
        {/* Animated Error Icon */}
        <div className="flex justify-center pt-8">
          <span className="animate-bounce-slow">
            <AlertTriangle className="w-14 h-14 text-red-500 dark:text-red-400 drop-shadow-lg" aria-hidden="true" />
          </span>
        </div>
        <div className="px-8 pb-8 pt-4 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-red-700 dark:text-red-400 mb-1">
            Oops! Something went wrong
          </h1>
          <p className="text-center text-base md:text-lg text-slate-700 dark:text-slate-200 mb-2">
            We hit a snag while loading this page. This could be a temporary network issue, a code problem, or a browser incompatibility.
          </p>
          <div className="bg-red-50 dark:bg-red-900/40 border-l-4 border-red-500 dark:border-red-400 p-4 rounded mb-2">
            <p className="text-red-700 dark:text-red-200 font-medium">
              {error?.message || 'An unexpected error occurred.'}
            </p>
            {error?.digest && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Error digest: {error.digest}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white font-semibold shadow hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              aria-label="Try Again"
            >
              <RefreshCcw className="w-5 h-5" /> Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold shadow hover:bg-slate-300 dark:hover:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              aria-label="Return to Home"
            >
              <Home className="w-5 h-5" /> Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow hover:bg-slate-100 dark:hover:bg-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              aria-label="Reload Page"
            >
              <RefreshCcw className="w-5 h-5" /> Reload
            </button>
            <a
              href="mailto:support@medh.com?subject=Error%20Report&body="
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-pink-500 dark:bg-pink-600 text-white font-semibold shadow hover:bg-pink-600 dark:hover:bg-pink-700 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              aria-label="Report Issue"
            >
              <Bug className="w-5 h-5" /> Report Issue
            </a>
          </div>

          {/* Collapsible Debug Console */}
          <div className="mt-6">
            <button
              onClick={() => setShowDebug(v => !v)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              aria-expanded={showDebug}
              aria-controls="debug-console"
            >
              <FileText className="w-4 h-4" />
              {showDebug ? 'Hide Debug Console' : 'Show Debug Console'}
            </button>
            {showDebug && (
              <div id="debug-console" className="mt-3 bg-slate-100 dark:bg-slate-800 rounded p-4 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 relative">
                <pre className="whitespace-pre-wrap break-words">{debugInfo}</pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Copy debug info"
                >
                  <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 