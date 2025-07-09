/**
 * Quick Login Password Component
 * For accounts that need password verification (after 30 days)
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowRight, 
  ChevronLeft, 
  Shield,
  AlertCircle,
  Loader2,
  Clock
} from "lucide-react";
import { RememberedAccount } from "@/utils/rememberedAccounts";

interface QuickLoginPasswordProps {
  account: RememberedAccount;
  onSubmit: (password: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

const QuickLoginPassword: React.FC<QuickLoginPasswordProps> = ({
  account,
  onSubmit,
  onBack,
  isLoading = false,
  error,
  className = ""
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Focus password input on mount
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;
    onSubmit(password);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const getAccountInitials = (fullName: string, email: string): string => {
    if (fullName && fullName.trim()) {
      const names = fullName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      } else {
        return names[0][0].toUpperCase();
      }
    }
    return email[0].toUpperCase();
  };

  const getDaysSinceLastLogin = (): number => {
    const now = Date.now();
    const daysDiff = Math.floor((now - account.lastLogin) / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  const daysSinceLogin = getDaysSinceLastLogin();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        {/* Account Avatar */}
        <div className="flex justify-center">
          {account.avatar ? (
            <Image
              src={account.avatar}
              alt={`${account.fullName} avatar`}
              width={64}
              height={64}
              className="rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-4 border-white dark:border-gray-700 shadow-lg">
              {getAccountInitials(account.fullName, account.email)}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Welcome back, {account.fullName || account.email.split('@')[0]}!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {account.email}
          </p>
          {account.role && (
            <span className="inline-flex items-center px-2.5 py-1 mt-2 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              {account.role}
            </span>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Password Required
            </span>
          </div>
          <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
            <Clock className="w-3 h-3 mr-1" />
            {daysSinceLogin}d ago
          </div>
        </div>
      </div>

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              ref={passwordInputRef}
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border ${
                error ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
              } focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all duration-200 outline-none pl-11 pr-11 text-base`}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              )}
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!password.trim() || isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={isLoading}
        className="w-full py-2.5 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to accounts</span>
      </button>

      {/* Forgot Password Link */}
      <div className="text-center">
        <a
          href="/forgot-password"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Forgot your password?
        </a>
      </div>

      {/* Privacy Note */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          Your credentials are securely encrypted and stored locally on your device.
        </p>
      </div>
    </div>
  );
};

export default QuickLoginPassword;