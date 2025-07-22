"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Fingerprint, 
  Key, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Smartphone,
  QrCode,
  Clock,
  Zap,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { authAPI, authUtils, IPasskeyAuthenticationResponse, IEnhancedMFAStatus } from "@/apis/auth.api";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { buildAdvancedComponent, getEnhancedSemanticColor } from "@/utils/designSystem";
import PasskeyAuthButton from "./PasskeyAuthButton";
import { storeAuthData, saveUserId, saveAuthToken } from "@/utils/auth";

interface UnifiedAuthFlowProps {
  mode?: 'login' | 'register';
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  className?: string;
  redirectTo?: string;
  enablePasskeys?: boolean;
  enableRememberMe?: boolean;
  showSocialAuth?: boolean;
}

type AuthStep = 'initial' | 'password' | 'mfa' | 'passkey' | 'success';
type MFAMethod = 'totp' | 'sms' | 'passkey' | 'backup';

const UnifiedAuthFlow: React.FC<UnifiedAuthFlowProps> = ({
  mode = 'login',
  onSuccess,
  onError,
  className = "",
  redirectTo,
  enablePasskeys = true,
  enableRememberMe = true,
  showSocialAuth = true
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState<AuthStep>('initial');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // MFA state
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaMethods, setMfaMethods] = useState<string[]>([]);
  const [selectedMfaMethod, setSelectedMfaMethod] = useState<MFAMethod>('totp');
  const [mfaCode, setMfaCode] = useState("");
  const [mfaSessionToken, setMfaSessionToken] = useState("");
  
  // Passkey state
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [conditionalUIEnabled, setConditionalUIEnabled] = useState(false);
  
  // Refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const mfaInputRef = useRef<HTMLInputElement>(null);
  
  const showToast = useToast();

  // Initialize passkey capabilities
  useEffect(() => {
    const initPasskeys = async () => {
      if (enablePasskeys) {
        try {
          const capabilities = await authUtils.getPasskeyCapabilities();
          setPasskeySupported(capabilities.webauthn);
          setConditionalUIEnabled(capabilities.conditionalMediation);
          
          // Enable conditional UI on email input
          if (capabilities.conditionalMediation && emailInputRef.current) {
            authUtils.enablePasskeyAutofill(
              emailInputRef.current,
              handlePasskeySuccess
            );
          }
        } catch (error) {
          console.error('Error initializing passkeys:', error);
        }
      }
    };

    initPasskeys();
  }, [enablePasskeys]);

  // Handle initial authentication attempt
  const handleInitialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      emailInputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === 'register') {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (error: any) {
      setError(error.message || "Authentication failed");
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle login flow
  const handleLogin = async () => {
    try {
      const response = await fetch(authAPI.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password || undefined, // Send undefined if no password for passkey-only flow
          rememberMe: rememberMe
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.mfa_required) {
          // MFA challenge required
          setMfaRequired(true);
          setMfaMethods(data.mfa_methods || ['totp']);
          setMfaSessionToken(data.session_token);
          setCurrentStep('mfa');
          
          // Auto-select best MFA method
          if (data.mfa_methods?.includes('passkey') && passkeySupported) {
            setSelectedMfaMethod('passkey');
          } else if (data.mfa_methods?.includes('totp')) {
            setSelectedMfaMethod('totp');
          } else {
            setSelectedMfaMethod(data.mfa_methods[0] as MFAMethod);
          }
        } else {
          // Login successful
          await handleAuthSuccess(data);
        }
      } else {
        if (data.message?.includes('password')) {
          setCurrentStep('password');
          setTimeout(() => passwordInputRef.current?.focus(), 100);
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error: any) {
      throw error;
    }
  };

  // Handle registration flow
  const handleRegister = async () => {
    if (!password) {
      setCurrentStep('password');
      setTimeout(() => passwordInputRef.current?.focus(), 100);
      return;
    }

    const response = await fetch(authAPI.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        password,
        rememberMe
      })
    });

    const data = await response.json();

    if (data.success) {
      await handleAuthSuccess(data);
    } else {
      throw new Error(data.message);
    }
  };

  // Handle MFA verification
  const handleMfaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMfaMethod === 'passkey') {
      // Handle passkey MFA
      await handlePasskeyMfa();
      return;
    }

    if (!mfaCode.trim()) {
      setError("Verification code is required");
      mfaInputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(authAPI.mfa.verify, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: mfaSessionToken,
          method: selectedMfaMethod,
          code: mfaCode.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        await handleAuthSuccess(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message || "MFA verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle passkey MFA
  const handlePasskeyMfa = async () => {
    try {
      setLoading(true);
      const result = await authUtils.authenticateWithPasskey(email);
      
      if (result.success && result.data) {
        await handleAuthSuccess({
          success: true,
          data: result.data,
          message: "Authenticated with passkey"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      setError(authUtils.handlePasskeyError(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle passkey success from conditional UI
  const handlePasskeySuccess = async (result: IPasskeyAuthenticationResponse) => {
    if (result.success && result.data) {
      await handleAuthSuccess({
        success: true,
        data: result.data,
        message: "Authenticated with passkey"
      });
    }
  };

  // Handle successful authentication
  const handleAuthSuccess = async (data: any) => {
    try {
      // Store authentication data
      if (data.data?.tokens) {
        storeAuthData(data.data.tokens.access_token, data.data.tokens.refresh_token);
        saveAuthToken(data.data.tokens.access_token);
      }
      
      if (data.data?.user?.id) {
        saveUserId(data.data.user.id);
        localStorage.setItem('userName', data.data.user.full_name || data.data.user.email);
        localStorage.setItem('userEmail', data.data.user.email);
      }

      setCurrentStep('success');
      showToast.success(`🎉 ${mode === 'register' ? 'Account created' : 'Welcome back'}!`);
      
      // Call success callback
      onSuccess?.(data);

      // Redirect if specified
      if (redirectTo) {
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1500);
      }
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  // Send SMS code
  const handleSendSms = async () => {
    try {
      setLoading(true);
      const response = await fetch(authAPI.mfa.sendSMS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: mfaSessionToken })
      });

      const data = await response.json();
      if (data.success) {
        showToast.success("SMS code sent!");
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      showToast.error("Failed to send SMS: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get step content
  const getStepContent = () => {
    switch (currentStep) {
      case 'initial':
      case 'password':
        return (
          <form onSubmit={handleInitialAuth} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  autoComplete={conditionalUIEnabled ? "email webauthn" : "email"}
                  disabled={loading}
                  required
                />
                {conditionalUIEnabled && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <Fingerprint className="w-3 h-3" />
                      <span>Auto</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Input */}
            {currentStep === 'password' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={passwordInputRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    autoComplete={mode === 'register' ? "new-password" : "current-password"}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me */}
            {enableRememberMe && currentStep === 'password' && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Keep me signed in
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={buildAdvancedComponent.glassButton({ size: 'lg' })}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {currentStep === 'initial' ? (
                    mode === 'register' ? 'Create Account' : 'Continue'
                  ) : (
                    mode === 'register' ? 'Create Account' : 'Sign In'
                  )}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Passkey Alternative */}
            {passkeySupported && currentStep === 'password' && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
                </div>
              </div>
            )}
          </form>
        );

      case 'mfa':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Two-Factor Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please verify your identity to continue
              </p>
            </div>

            {/* MFA Method Selection */}
            {mfaMethods.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {mfaMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMfaMethod(method as MFAMethod)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedMfaMethod === method
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {method === 'totp' && <QrCode className="w-4 h-4" />}
                    {method === 'sms' && <Smartphone className="w-4 h-4" />}
                    {method === 'passkey' && <Fingerprint className="w-4 h-4" />}
                    {method === 'backup' && <Key className="w-4 h-4" />}
                    {method === 'totp' && 'Authenticator App'}
                    {method === 'sms' && 'SMS Code'}
                    {method === 'passkey' && 'Passkey'}
                    {method === 'backup' && 'Backup Code'}
                  </button>
                ))}
              </div>
            )}

            {/* MFA Input */}
            {selectedMfaMethod !== 'passkey' ? (
              <form onSubmit={handleMfaVerification} className="space-y-4">
                <div>
                  <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {selectedMfaMethod === 'totp' && 'Authenticator Code'}
                    {selectedMfaMethod === 'sms' && 'SMS Code'}
                    {selectedMfaMethod === 'backup' && 'Backup Code'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={mfaInputRef}
                      id="mfa-code"
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\s/g, ''))}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                      placeholder={selectedMfaMethod === 'backup' ? '••••••••' : '••••••'}
                      maxLength={selectedMfaMethod === 'backup' ? 8 : 6}
                      autoComplete="one-time-code"
                      disabled={loading}
                      required
                    />
                    {selectedMfaMethod === 'sms' && (
                      <button
                        type="button"
                        onClick={handleSendSms}
                        disabled={loading}
                        className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !mfaCode.trim()}
                  className={buildAdvancedComponent.glassButton({ size: 'lg' })}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <PasskeyAuthButton
                mode="login"
                email={email}
                onSuccess={handlePasskeySuccess}
                onError={(error) => setError(authUtils.handlePasskeyError(error))}
                variant="primary"
                size="lg"
              />
            )}
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mode === 'register' ? 'Account Created!' : 'Welcome Back!'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {redirectTo ? 'Redirecting you now...' : 'You are now signed in.'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className={buildAdvancedComponent.glassCard({ variant: 'primary' })}>
        {/* Header */}
        {currentStep !== 'success' && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === 'register' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'register' 
                ? 'Join thousands of learners on their journey'
                : 'Sign in to continue your learning journey'
              }
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Step Content */}
        {getStepContent()}

        {/* Passkey Option */}
        {passkeySupported && currentStep === 'password' && (
          <div className="mt-6">
            <PasskeyAuthButton
              mode="login"
              email={email}
              onSuccess={handlePasskeySuccess}
              onError={(error) => setError(authUtils.handlePasskeyError(error))}
              variant="secondary"
              size="lg"
              showCapabilities={false}
            />
          </div>
        )}

        {/* Back Button */}
        {(currentStep === 'password' || currentStep === 'mfa') && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setCurrentStep('initial');
                setError("");
                setPassword("");
                setMfaCode("");
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedAuthFlow; 