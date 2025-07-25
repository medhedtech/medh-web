/**
 * Biometric Authentication Utilities
 * Handles WebAuthn operations for Face ID/Touch ID on mobile devices
 */

export interface BiometricCapabilities {
  isSupported: boolean;
  hasUserVerifyingPlatformAuthenticator: boolean;
  supportedTransports: string[];
  error?: string;
}

export interface BiometricCredential {
  id: string;
  email: string;
  displayName: string;
  createdAt: number;
  lastUsed: number;
}

export interface BiometricAuthOptions {
  timeout?: number;
  userVerification?: 'required' | 'preferred' | 'discouraged';
  challenge?: Uint8Array;
}

export class BiometricAuthManager {
  private static readonly STORAGE_KEY = 'biometric_credentials';
  private static readonly SETTINGS_KEY = 'biometric_auth_settings';

  /**
   * Check if biometric authentication is supported on this device
   */
  static async checkCapabilities(): Promise<BiometricCapabilities> {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        return {
          isSupported: false,
          hasUserVerifyingPlatformAuthenticator: false,
          supportedTransports: [],
          error: 'WebAuthn not supported'
        };
      }

      // Check for platform authenticator (Face ID/Touch ID)
      const hasUserVerifyingPlatformAuthenticator = await window.PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable();

      // Check for conditional mediation (enhanced UX)
      const isConditionalMediationAvailable = await window.PublicKeyCredential
        .isConditionalMediationAvailable?.() || false;

      return {
        isSupported: true,
        hasUserVerifyingPlatformAuthenticator,
        supportedTransports: ['internal', 'hybrid'],
        error: hasUserVerifyingPlatformAuthenticator ? undefined : 'No biometric authenticator available'
      };
    } catch (error) {
      console.error('Biometric capability check failed:', error);
      return {
        isSupported: false,
        hasUserVerifyingPlatformAuthenticator: false,
        supportedTransports: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate a cryptographically secure challenge
   */
  static generateChallenge(): Uint8Array {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    return challenge;
  }

  /**
   * Register a new biometric credential for an account
   */
  static async registerCredential(
    email: string, 
    displayName: string,
    options: BiometricAuthOptions = {}
  ): Promise<{ success: boolean; credentialId?: string; error?: string }> {
    try {
      const capabilities = await this.checkCapabilities();
      if (!capabilities.hasUserVerifyingPlatformAuthenticator) {
        return { 
          success: false, 
          error: capabilities.error || 'Biometric authentication not available' 
        };
      }

      const challenge = options.challenge || this.generateChallenge();
      const userId = new TextEncoder().encode(email);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'Medh Education Platform',
            id: window.location.hostname
          },
          user: {
            id: userId,
            name: email,
            displayName: displayName || email
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: options.userVerification || 'required',
            requireResidentKey: true
          },
          timeout: options.timeout || 60000,
          attestation: 'none'
        }
      }) as PublicKeyCredential;

      if (!credential) {
        return { success: false, error: 'Failed to create credential' };
      }

      // Store credential metadata
      const credentialData: BiometricCredential = {
        id: credential.id,
        email,
        displayName: displayName || email,
        createdAt: Date.now(),
        lastUsed: Date.now()
      };

      this.storeCredential(credentialData);
      this.setEnabled(true);

      return { 
        success: true, 
        credentialId: credential.id 
      };
    } catch (error: any) {
      console.error('Biometric registration failed:', error);
      
      let errorMessage = 'Registration failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permission denied or cancelled by user';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Authenticator already registered';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Biometric authentication not supported';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error - invalid domain or configuration';
      }

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Authenticate using biometric credential
   */
  static async authenticate(
    email: string,
    options: BiometricAuthOptions = {}
  ): Promise<{ success: boolean; credentialId?: string; error?: string }> {
    try {
      const capabilities = await this.checkCapabilities();
      if (!capabilities.hasUserVerifyingPlatformAuthenticator) {
        return { 
          success: false, 
          error: capabilities.error || 'Biometric authentication not available' 
        };
      }

      const credential = this.getCredentialForEmail(email);
      if (!credential) {
        return { success: false, error: 'No biometric credential found for this account' };
      }

      const challenge = options.challenge || this.generateChallenge();

      const authCredential = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{
            id: new TextEncoder().encode(credential.id),
            type: 'public-key',
            transports: ['internal']
          }],
          userVerification: options.userVerification || 'required',
          timeout: options.timeout || 60000
        }
      }) as PublicKeyCredential;

      if (!authCredential) {
        return { success: false, error: 'Authentication failed' };
      }

      // Update last used timestamp
      this.updateCredentialLastUsed(credential.id);

      return { 
        success: true, 
        credentialId: authCredential.id 
      };
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      
      let errorMessage = 'Authentication failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Authentication cancelled or timed out';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Invalid authenticator state';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Biometric authentication not supported';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error during authentication';
      }

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Remove biometric credential for an account
   */
  static removeCredential(email: string): boolean {
    try {
      const credentials = this.getStoredCredentials();
      const filteredCredentials = credentials.filter(cred => cred.email !== email);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCredentials));
      
      // If no credentials left, disable biometric auth
      if (filteredCredentials.length === 0) {
        this.setEnabled(false);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to remove biometric credential:', error);
      return false;
    }
  }

  /**
   * Get all stored biometric credentials
   */
  static getStoredCredentials(): BiometricCredential[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load biometric credentials:', error);
      return [];
    }
  }

  /**
   * Get credential for specific email
   */
  static getCredentialForEmail(email: string): BiometricCredential | null {
    const credentials = this.getStoredCredentials();
    return credentials.find(cred => cred.email === email) || null;
  }

  /**
   * Check if biometric auth is enabled
   */
  static isEnabled(): boolean {
    try {
      return localStorage.getItem('biometric_auth_enabled') === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Enable/disable biometric authentication
   */
  static setEnabled(enabled: boolean): void {
    try {
      localStorage.setItem('biometric_auth_enabled', enabled.toString());
    } catch (error) {
      console.error('Failed to update biometric auth settings:', error);
    }
  }

  /**
   * Check if account has biometric credential
   */
  static hasCredentialForEmail(email: string): boolean {
    return this.getCredentialForEmail(email) !== null;
  }

  /**
   * Get biometric authentication settings
   */
  static getSettings(): { enabled: boolean; credentialCount: number } {
    return {
      enabled: this.isEnabled(),
      credentialCount: this.getStoredCredentials().length
    };
  }

  /**
   * Clear all biometric data
   */
  static clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      localStorage.removeItem('biometric_auth_enabled');
    } catch (error) {
      console.error('Failed to clear biometric data:', error);
    }
  }

  /**
   * Store credential metadata
   */
  private static storeCredential(credential: BiometricCredential): void {
    try {
      const credentials = this.getStoredCredentials();
      
      // Remove existing credential for same email
      const filteredCredentials = credentials.filter(cred => cred.email !== credential.email);
      
      // Add new credential
      filteredCredentials.push(credential);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCredentials));
    } catch (error) {
      console.error('Failed to store biometric credential:', error);
    }
  }

  /**
   * Update last used timestamp for credential
   */
  private static updateCredentialLastUsed(credentialId: string): void {
    try {
      const credentials = this.getStoredCredentials();
      const credential = credentials.find(cred => cred.id === credentialId);
      
      if (credential) {
        credential.lastUsed = Date.now();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
      }
    } catch (error) {
      console.error('Failed to update credential last used:', error);
    }
  }
}

/**
 * React hook for biometric authentication
 */
export const useBiometricAuth = () => {
  const [capabilities, setCapabilities] = React.useState<BiometricCapabilities>({
    isSupported: false,
    hasUserVerifyingPlatformAuthenticator: false,
    supportedTransports: []
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    BiometricAuthManager.checkCapabilities()
      .then(setCapabilities)
      .finally(() => setIsLoading(false));
  }, []);

  const register = React.useCallback(async (email: string, displayName: string) => {
    return BiometricAuthManager.registerCredential(email, displayName);
  }, []);

  const authenticate = React.useCallback(async (email: string) => {
    return BiometricAuthManager.authenticate(email);
  }, []);

  const remove = React.useCallback((email: string) => {
    return BiometricAuthManager.removeCredential(email);
  }, []);

  const hasCredential = React.useCallback((email: string) => {
    return BiometricAuthManager.hasCredentialForEmail(email);
  }, []);

  return {
    capabilities,
    isLoading,
    isEnabled: BiometricAuthManager.isEnabled(),
    settings: BiometricAuthManager.getSettings(),
    register,
    authenticate,
    remove,
    hasCredential,
    setEnabled: BiometricAuthManager.setEnabled,
    clearAll: BiometricAuthManager.clearAllData
  };
};

// Add React import for the hook
import React from 'react'; 