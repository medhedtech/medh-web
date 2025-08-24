'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, ArrowLeft, Shield, Lock, Eye, EyeOff, HelpCircle, Mail, Phone, Clock, Users } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-70"></div>
        
        {/* Large Gradient Blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-floating"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
        
        {/* Simple Dot Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-slate-400 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header with Time */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm animate-fade-in relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20"></div>
            
            <CardContent className="p-8 relative z-10">
              {/* Icon Section */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center space-y-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-red-600 to-orange-600 dark:from-white dark:via-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                    Access Denied
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Lock className="w-4 h-4" />
                    <span>403 Forbidden</span>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                  Sorry, you don't have permission to access this page. 
                  Please contact your administrator if you believe this is an error.
                </p>

                {/* Error Details Toggle */}
                <div className="space-y-4">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showDetails ? 'Hide' : 'Show'} Technical Details
                  </button>

                  {showDetails && (
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2 animate-slide-down">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span className="font-medium">Error Code:</span>
                          <span className="text-red-600 dark:text-red-400">403</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <span className="text-orange-600 dark:text-orange-400">Forbidden</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Timestamp:</span>
                          <span className="text-slate-600 dark:text-slate-400">{currentTime.toISOString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">User Agent:</span>
                          <span className="text-slate-600 dark:text-slate-400 truncate">Browser</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="mt-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    href="/" 
                    className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <Home className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Go to Homepage</span>
                  </Link>

                  <button 
                    onClick={() => window.history.back()}
                    className="group inline-flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 font-medium py-4 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>Need help? Contact our support team</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-xs">
                    <Link 
                      href="mailto:support@medh.co" 
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      support@medh.co
                    </Link>
                    <Link 
                      href="tel:+1234567890" 
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      +1 (234) 567-890
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Stats */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>1,234+ Users</span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
