"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Key, ArrowRight, Shield, Clock, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { authAPI } from "@/apis/auth.api";

interface QuickLoginComponentProps {
  className?: string;
}

const QuickLoginComponent: React.FC<QuickLoginComponentProps> = ({ className = "" }) => {
  const [quickLoginKey, setQuickLoginKey] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const keyInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Auto-fill email from localStorage if available
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    
    // Focus the key input
    if (keyInputRef.current) {
      keyInputRef.current.focus();
    }
  }, []);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickLoginKey.trim()) {
      setError("Please enter your quick login key");
      return;
    }
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(authAPI.local.quickLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          quick_login_key: quickLoginKey.trim(),
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Store authentication data
        if (result.data.access_token || result.data.token) {
          localStorage.setItem("token", result.data.access_token || result.data.token);
        }
        if (result.data.refresh_token || result.data.session_id) {
          localStorage.setItem("refresh_token", result.data.refresh_token || result.data.session_id);
        }
        if (result.data.user?.id) {
          localStorage.setItem("userId", result.data.user.id);
        }
        if (result.data.user?.full_name) {
          localStorage.setItem("userName", result.data.user.full_name);
        }
        if (result.data.user?.email) {
          localStorage.setItem("userEmail", result.data.user.email);
        }
        if (result.data.user?.role) {
          const role = Array.isArray(result.data.user.role) ? result.data.user.role[0] : result.data.user.role;
          localStorage.setItem("userRole", role);
        }

        showToast.success("⚡ Quick login successful!");
        
        // Redirect based on role
        const role = Array.isArray(result.data.user?.role) ? result.data.user.role[0] : result.data.user?.role;
        const redirectPath = role === 'admin' ? '/dashboards/admin' : 
                           role === 'instructor' ? '/dashboards/instructor' : 
                           '/dashboards/student';
        
        window.location.href = redirectPath;
      } else {
        setError(result.message || "Quick login failed. Please check your key and try again.");
      }
    } catch (error: any) {
      console.error("Quick login error:", error);
      if (error.message?.includes('Network Error')) {
        setError("Network connection issue. Please check your internet connection.");
      } else {
        setError("Quick login failed. Please try again or use password login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickLogin(e);
    }
  };

  return (
    <div className={`quick-login-component ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-blue-600 rounded-full">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Login
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your quick login key for instant access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleQuickLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="quick-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="quick-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
              required
            />
          </div>

          {/* Quick Login Key Input */}
          <div>
            <label htmlFor="quick-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Login Key
            </label>
            <div className="relative">
              <input
                ref={keyInputRef}
                id="quick-key"
                type={showKey ? "text" : "password"}
                value={quickLoginKey}
                onChange={(e) => setQuickLoginKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your quick login key"
                disabled={loading}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !quickLoginKey.trim() || !email.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            <span>{loading ? "Logging in..." : "Quick Login"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Benefits */}
        <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Instant</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-3">
            Your quick login key is valid for 30 days and stored securely on your device
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickLoginComponent; 