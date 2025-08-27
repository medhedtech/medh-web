'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Mail, Wrench, Shield, Clock } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [mounted, setMounted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    console.error('Application Error:', error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Add a small delay for better UX
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating Error Symbols */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-red-400/20 text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            ⚠
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Error Icon and Number */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <AlertTriangle className="w-32 h-32 text-red-400 animate-pulse" />
                <div className="absolute inset-0 w-32 h-32 text-red-500/30 blur-xl">
                  <AlertTriangle className="w-32 h-32" />
                </div>
              </div>
            </div>
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 leading-none select-none">
              500
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-black text-red-500/20 blur-2xl leading-none select-none flex items-center justify-center pt-20">
              500
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
              Internal Server Error
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Something went wrong on our end. Our team has been notified and is working to fix this issue.
            </p>
            {error.message && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm animate-fade-in-up delay-300">
                <p className="text-red-300 text-sm font-mono">
                  Error: {error.message}
                </p>
                {error.digest && (
                  <p className="text-red-400/70 text-xs mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-400">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 transition-transform duration-300 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </button>

            <Link
              href="/"
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Back to Home
            </Link>
          </div>

          {/* Retry Information */}
          {retryCount > 0 && (
            <div className="mb-8 animate-fade-in-up delay-500">
              <p className="text-gray-400 text-sm">
                Retry attempts: {retryCount}
              </p>
            </div>
          )}

          {/* Support Information */}
          <div className="mb-8 animate-fade-in-up delay-600">
            <p className="text-gray-400 mb-4">Need immediate help?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors duration-300 group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Contact Support
            </Link>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in-up delay-800">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-3">
                <Wrench className="w-8 h-8 text-orange-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Fixing</h3>
              <p className="text-gray-400 text-sm">Our team is on it</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-green-400 group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Secure</h3>
              <p className="text-gray-400 text-sm">Your data is safe</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-blue-400 group-hover:animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Soon</h3>
              <p className="text-gray-400 text-sm">Back online shortly</p>
            </div>
          </div>

          {/* Error Details for Development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left max-w-2xl mx-auto animate-fade-in-up delay-1000">
              <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 mb-4">
                🔧 Development Details
              </summary>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <pre className="text-xs text-gray-300 overflow-auto">
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        
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
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}