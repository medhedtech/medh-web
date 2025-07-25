"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Key, ArrowRight, Shield, Clock, Loader2, AlertCircle, Zap, Lock } from "lucide-react";
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
      {/* Main Container with Glassmorphism */}
      <div className="relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10 dark:from-blue-400/10 dark:via-indigo-400/5 dark:to-purple-400/10 animate-pulse"></div>
        
        {/* Glass Container */}
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/10">
          
          {/* Header with Enhanced Styling */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-sm opacity-50 animate-pulse"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quick Access
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-1 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Lightning-fast secure authentication
            </p>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleQuickLogin} className="space-y-6">
            {/* Email Input with Modern Styling */}
            <div className="group">
              <label htmlFor="quick-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                Email Address
              </label>
              <div className="relative">
                <input
                  id="quick-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={loading}
                  className="w-full px-5 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/80 dark:focus:bg-gray-800/80 dark:text-gray-100 disabled:opacity-50 transition-all duration-300 group-hover:border-blue-400/50 shadow-sm"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Quick Login Key Input with Enhanced Design */}
            <div className="group">
              <label htmlFor="quick-key" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                Quick Login Key
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Key className="w-5 h-5" />
                </div>
                <input
                  ref={keyInputRef}
                  id="quick-key"
                  type={showKey ? "text" : "password"}
                  value={quickLoginKey}
                  onChange={(e) => setQuickLoginKey(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your secure key"
                  disabled={loading}
                  className="w-full pl-12 pr-14 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/80 dark:focus:bg-gray-800/80 dark:text-gray-100 disabled:opacity-50 transition-all duration-300 group-hover:border-indigo-400/50 shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <div className="p-1 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Premium Submit Button */}
            <button
              type="submit"
              disabled={loading || !quickLoginKey.trim() || !email.trim()}
              className="group relative w-full overflow-hidden rounded-xl p-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-[11px] text-white font-semibold transition-all duration-300 group-hover:bg-white/5">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                )}
                <span className="text-lg">{loading ? "Authenticating..." : "Quick Login"}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
              </div>
            </button>
          </form>

          {/* Enhanced Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/30 dark:border-green-800/30">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Bank-Grade Security</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/30 dark:border-blue-800/30">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Instant Access</span>
              </div>
            </div>
            
            {/* Enhanced Footer Info */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-900/30 dark:to-slate-900/30 border border-gray-200/30 dark:border-gray-700/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Secure Session</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center leading-relaxed">
                Your quick login key is encrypted and valid for 30 days. 
                <br />
                Stored securely using industry-standard protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLoginComponent; 