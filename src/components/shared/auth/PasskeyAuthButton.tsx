"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Fingerprint, 
  Shield, 
  Smartphone, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  Zap,
  Lock
} from "lucide-react";
import { authUtils, IPasskeyCapabilities, IPasskeyAuthenticationResponse } from "@/apis/auth.api";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { buildAdvancedComponent, getEnhancedSemanticColor } from "@/utils/designSystem";

interface PasskeyAuthButtonProps {
  onSuccess?: (data: IPasskeyAuthenticationResponse) => void;
  onError?: (error: any) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  mode?: 'login' | 'register' | 'conditional';
  email?: string;
  showCapabilities?: boolean;
  enableConditionalUI?: boolean;
  passkeyName?: string;
}

const PasskeyAuthButton: React.FC<PasskeyAuthButtonProps> = ({
  onSuccess,
  onError,
  className = "",
  variant = 'primary',
  size = 'md',
  mode = 'login',
  email,
  showCapabilities = true,
  enableConditionalUI = true,
  passkeyName
}) => {
  const [loading, setLoading] = useState(false);
  const [capabilities, setCapabilities] = useState<IPasskeyCapabilities | null>(null);
  const [conditionalUIActive, setConditionalUIActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const showToast = useToast();

  // Initialize passkey capabilities
  useEffect(() => {
    const initializeCapabilities = async () => {
      try {
        const caps = await authUtils.getPasskeyCapabilities();
        setCapabilities(caps);
        
        if (caps.conditionalMediation && enableConditionalUI && mode === 'login') {
          setConditionalUIActive(true);
        }
      } catch (error) {
        console.error('Error detecting passkey capabilities:', error);
      }
    };

    initializeCapabilities();
  }, [enableConditionalUI, mode]);

  // Handle passkey authentication
  const handlePasskeyAuth = async () => {
    if (!capabilities?.webauthn) {
      const errorMsg = "Passkeys are not supported on this device or browser.";
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      showToast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result: IPasskeyAuthenticationResponse;

      if (mode === 'register') {
        // Register new passkey
        const registerResult = await authUtils.registerPasskey(passkeyName);
        if (registerResult.success) {
          result = {
            success: true,
            message: "Passkey registered successfully",
            data: {
              user: {
                id: registerResult.data?.passkey.id || '',
                email: email || '',
                full_name: 'User'
              },
              passkey: registerResult.data!.passkey,
              tokens: {
                access_token: '',
                refresh_token: ''
              },
              session_id: '',
              deviceInfo: {
                isNewDevice: true,
                isTrustedDevice: false,
                requiresAdditionalVerification: false
              }
            }
          };
        } else {
          throw new Error(registerResult.message);
        }
      } else {
        // Authenticate with passkey
        result = await authUtils.authenticateWithPasskey(email, conditionalUIActive);
      }

      if (result.success) {
        setSuccess(true);
        showToast.success(
          mode === 'register' 
            ? "✨ Passkey registered successfully!" 
            : "🎉 Signed in with passkey!"
        );
        onSuccess?.(result);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      const errorMsg = authUtils.handlePasskeyError(error);
      setError(errorMsg);
      onError?.(error);
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get button styling based on variant and capabilities
  const getButtonClasses = () => {
    const baseClasses = buildAdvancedComponent.glassButton({ size });
    const variantClasses = {
      primary: capabilities?.webauthn 
        ? `${getEnhancedSemanticColor('courses', 'glass')} hover:${getEnhancedSemanticColor('courses', 'light')} border-blue-200/30`
        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-gray-200/30',
      secondary: capabilities?.webauthn
        ? `bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-700/90 border-gray-200/50`
        : 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed border-gray-200/30',
      minimal: capabilities?.webauthn
        ? `bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border-transparent`
        : 'bg-transparent text-gray-400 cursor-not-allowed border-transparent'
    };

    return `${baseClasses} ${variantClasses[variant]} ${className}`;
  };

  // Get icon based on capabilities and state
  const getIcon = () => {
    if (loading) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (success) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (error) return <AlertCircle className="w-5 h-5 text-red-500" />;

    if (capabilities?.biometrics) return <Fingerprint className="w-5 h-5" />;
    if (capabilities?.userVerifyingPlatformAuthenticator) return <Shield className="w-5 h-5" />;
    if (capabilities?.webauthn) return <Key className="w-5 h-5" />;
    return <Lock className="w-5 h-5" />;
  };

  // Get button text based on mode and capabilities
  const getButtonText = () => {
    if (loading) {
      return mode === 'register' ? 'Creating passkey...' : 'Authenticating...';
    }
    if (success) {
      return mode === 'register' ? 'Passkey created!' : 'Authenticated!';
    }
    if (error) return 'Try again';
    
    if (!capabilities?.webauthn) return 'Passkeys not supported';
    
    if (mode === 'register') {
      if (capabilities.biometrics) return 'Create passkey with biometrics';
      return 'Create passkey';
    }
    
    if (capabilities.biometrics) return 'Sign in with biometrics';
    if (capabilities.userVerifyingPlatformAuthenticator) return 'Sign in with passkey';
    return 'Sign in with security key';
  };

  return (
    <div className="space-y-3">
      {/* Main Passkey Button */}
      <button
        ref={buttonRef}
        onClick={handlePasskeyAuth}
        disabled={!capabilities?.webauthn || loading}
        className={getButtonClasses()}
        aria-label={getButtonText()}
      >
        <div className="flex items-center justify-center gap-3">
          {getIcon()}
          <span className="font-medium">
            {getButtonText()}
          </span>
          {conditionalUIActive && (
            <div className="flex items-center gap-1 text-xs opacity-70">
              <Zap className="w-3 h-3" />
              <span>Auto</span>
            </div>
          )}
        </div>
      </button>

      {/* Capabilities Display */}
      {showCapabilities && capabilities && (
        <div className="space-y-2">
          {/* Supported Features */}
          <div className="flex flex-wrap gap-2">
            {capabilities.biometrics && (
              <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                <Fingerprint className="w-3 h-3" />
                <span>Biometrics</span>
              </div>
            )}
            {capabilities.conditionalMediation && (
              <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                <Zap className="w-3 h-3" />
                <span>Autofill</span>
              </div>
            )}
            {capabilities.hybridTransport && (
              <div className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                <Smartphone className="w-3 h-3" />
                <span>Cross-device</span>
              </div>
            )}
            {capabilities.multiDevice && (
              <div className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                <Eye className="w-3 h-3" />
                <span>Synced</span>
              </div>
            )}
          </div>

          {/* Security Level Indicator */}
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {capabilities.biometrics ? (
              <span className="text-green-600 dark:text-green-400">🟢 High security with biometrics</span>
            ) : capabilities.userVerifyingPlatformAuthenticator ? (
              <span className="text-blue-600 dark:text-blue-400">🔵 Medium security with device unlock</span>
            ) : capabilities.webauthn ? (
              <span className="text-yellow-600 dark:text-yellow-400">🟡 Basic security with security key</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">🔴 Passkeys not supported</span>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasskeyAuthButton; 