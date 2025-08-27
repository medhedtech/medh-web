'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, Home, ArrowLeft, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import type { NextPage } from 'next';

interface UnauthorizedPageState {
  mounted: boolean;
}

const UnauthorizedPage: NextPage = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect((): void => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-red-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-200 to-red-200 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Animated Lock Icon */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full mb-6 animate-pulse">
            <Shield className="w-16 h-16 text-white animate-bounce" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-800">
            401
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Access Denied
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              You don't have permission to access this page. Please check your credentials or contact support if you believe this is an error.
            </p>
          </div>

          {/* Access Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Protected Content</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-4">
              This page requires special permissions or authentication to access.
            </p>
            <div className="space-y-2 text-xs text-yellow-600">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                <span>Check if you're logged in with the correct account</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                <span>Ensure you have the required permissions</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                <span>Contact support if you need access</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5 group-hover:animate-bounce" />
              Sign In
            </Link>
            
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 group-hover:animate-bounce" />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-bounce" />
              Go Back
            </button>
          </div>

          {/* Additional Options */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Don't have an account?</p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4 group-hover:animate-bounce" />
              Create Account
            </Link>
          </div>

          {/* Support Information */}
          <div className="pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-4">
                If you believe you should have access to this page, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute -top-20 -left-20 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-10 -right-10 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75 delay-500"></div>
        <div className="absolute top-10 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-bounce delay-1000"></div>
      </div>

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
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export { UnauthorizedPage };
export default UnauthorizedPage;