'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Send, Copy } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [mounted, setMounted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.error('Global Application Error:', error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 1500);
  };

  const copyErrorDetails = async () => {
    const errorDetails = `
Error: ${error.message}
Stack: ${error.stack}
Digest: ${error.digest || 'N/A'}
Timestamp: ${new Date().toISOString()}
URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
User Agent: ${typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  const sendErrorReport = async () => {
    // Simulate sending error report
    setReportSent(true);
    setTimeout(() => setReportSent(false), 3000);
  };

  if (!mounted) return null;

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
          {/* Critical Error Background */}
          <div className="absolute inset-0">
            {/* Warning Grid */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-red-500 flex items-center justify-center animate-pulse"
                    style={{
                      animationDelay: `${(i * 0.05) % 2}s`,
                      animationDuration: '2s'
                    }}
                  >
                    ⚠
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-4xl mx-auto">
              {/* Critical Error Icon */}
              <div className="relative mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <AlertTriangle className="w-40 h-40 text-red-500 animate-pulse" />
                    <div className="absolute inset-0 w-40 h-40 text-red-600/40 blur-2xl">
                      <AlertTriangle className="w-40 h-40" />
                    </div>
                    {/* Critical Alert Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-4 border-red-500/50 rounded-full animate-ping"></div>
                      <div className="absolute w-56 h-56 border-2 border-red-500/30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 leading-none select-none">
                  CRITICAL
                </h1>
                <div className="absolute inset-0 text-6xl md:text-8xl font-black text-red-600/20 blur-2xl leading-none select-none flex items-center justify-center pt-32">
                  CRITICAL
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-12 space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                  Application Error
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
                  A critical error has occurred that prevented the application from functioning properly. 
                  Our development team has been automatically notified.
                </p>
                
                {/* Error Details */}
                <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm animate-fade-in-up delay-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Bug className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-red-300">Error Details</h3>
                  </div>
                  <p className="text-red-200 text-sm font-mono bg-black/30 p-3 rounded border border-red-500/20">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-red-400/70 text-xs mt-3">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-400">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 transition-transform duration-300 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                  {isRetrying ? 'Restarting...' : 'Restart App'}
                </button>

                <a
                  href="/"
                  className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                >
                  <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Safe Mode Home
                </a>
              </div>

              {/* Developer Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-600">
                <button
                  onClick={copyErrorDetails}
                  className="group relative px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-gray-300 font-medium rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Error Details'}
                </button>

                <button
                  onClick={sendErrorReport}
                  className="group relative px-6 py-3 bg-blue-800/50 backdrop-blur-sm text-blue-300 font-medium rounded-lg border border-blue-600/30 hover:bg-blue-700/50 transition-all duration-300 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {reportSent ? 'Report Sent!' : 'Send Report'}
                </button>
              </div>

              {/* Emergency Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto animate-fade-in-up delay-800">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-2">What Happened?</h3>
                  <p className="text-gray-400 text-sm">
                    A critical error occurred that couldn't be recovered from automatically. 
                    This is likely a temporary issue.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-2">What's Next?</h3>
                  <p className="text-gray-400 text-sm">
                    Try restarting the app or return to the home page. 
                    Our team has been notified and is working on a fix.
                  </p>
                </div>
              </div>

              {/* Development Mode Stack Trace */}
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-12 text-left max-w-4xl mx-auto animate-fade-in-up delay-1000">
                  <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 mb-4 text-center">
                    🔧 Full Stack Trace (Development Mode)
                  </summary>
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 border border-red-500/30">
                    <pre className="text-xs text-red-300 overflow-auto whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>

          {/* Custom Styles */}
          <style jsx>{`
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out forwards;
            }
            
            .delay-200 { animation-delay: 0.2s; }
            .delay-300 { animation-delay: 0.3s; }
            .delay-400 { animation-delay: 0.4s; }
            .delay-600 { animation-delay: 0.6s; }
            .delay-800 { animation-delay: 0.8s; }
            .delay-1000 { animation-delay: 1s; }
          `}</style>
        </div>
      </body>
    </html>
  );
}

