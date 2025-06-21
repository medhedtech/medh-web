'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Smartphone,
  Key,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  QrCode,
  Settings,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Clock,
  Info
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { 
  authUtils, 
  IMFAStatusResponse,
  IMFASetupTOTPResponse,
  IMFASetupVerifyResponse,
  IMFABackupCodesResponse,
  IMFADisableResponse
} from '@/apis/auth.api';

interface MFAManagementProps {
  className?: string;
}

interface MFAStatus {
  enabled: boolean;
  method: 'totp' | 'sms' | null;
  setupDate?: string;
  phoneNumber?: string;
  backupCodesCount: number;
  lastRegenerated?: string;
}

interface TOTPSetupData {
  secret: string;
  manualEntryKey: string;
  qrCodeUrl?: string;
  backupCodes: string[] | null;
  instructions: string[];
}

const MFAManagement: React.FC<MFAManagementProps> = ({ className = '' }) => {
  const [mfaStatus, setMfaStatus] = useState<MFAStatus>({
    enabled: false,
    method: null,
    setupDate: undefined,
    phoneNumber: undefined,
    backupCodesCount: 0,
    lastRegenerated: undefined
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [setupLoading, setSetupLoading] = useState<boolean>(false);
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [setupMethod, setSetupMethod] = useState<'totp' | 'sms'>('totp');
  const [totpSetupData, setTotpSetupData] = useState<TOTPSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showBackupCodes, setShowBackupCodes] = useState<boolean>(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showDisableConfirm, setShowDisableConfirm] = useState<boolean>(false);
  const [disablePassword, setDisablePassword] = useState<string>('');
  const [disableCode, setDisableCode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  // Load MFA status on component mount
  useEffect(() => {
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      const response: IMFAStatusResponse = await authUtils.getMFAStatus();
      
      if (response.success) {
        setMfaStatus({
          enabled: response.data.enabled,
          method: response.data.method,
          setupDate: response.data.setup_date,
          phoneNumber: response.data.phone_number,
          backupCodesCount: response.data.backup_codes_count,
          lastRegenerated: response.data.last_regenerated
        });
      } else {
        console.error('Failed to load MFA status:', response.message);
        showToast.error('Failed to load MFA status');
      }
    } catch (error: any) {
      console.error('Error loading MFA status:', error);
      showToast.error('Error loading MFA status');
    } finally {
      setLoading(false);
    }
  };

  const startTOTPSetup = async (): Promise<void> => {
    try {
      setSetupLoading(true);
      setError('');
      
      const response: IMFASetupTOTPResponse = await authUtils.setupTOTP();
      
      if (response.success) {
        setTotpSetupData({
          secret: response.data.secret,
          manualEntryKey: response.data.manual_entry_key,
          qrCodeUrl: response.data.qr_code_url,
          backupCodes: response.data.backup_codes,
          instructions: response.data.instructions
        });
        setStep(2);
      } else {
        setError(response.message || 'Failed to setup TOTP');
        showToast.error(response.message || 'Failed to setup TOTP');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Error setting up TOTP';
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setSetupLoading(false);
    }
  };

  const startSMSSetup = async (): Promise<void> => {
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setSetupLoading(true);
      setError('');
      
      const response = await authUtils.setupSMS(phoneNumber);
      
      if (response.success) {
        setStep(2);
        showToast.success('SMS verification code sent to your phone');
      } else {
        setError(response.message || 'Failed to send SMS code');
        showToast.error(response.message || 'Failed to send SMS code');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Error setting up SMS';
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setSetupLoading(false);
    }
  };

  const verifySetup = async (): Promise<void> => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!authUtils.isValidMFACode(verificationCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setSetupLoading(true);
      setError('');
      
      const response: IMFASetupVerifyResponse = setupMethod === 'totp' 
        ? await authUtils.verifyTOTPSetup(verificationCode)
        : await authUtils.verifySMSSetup(verificationCode);
      
      if (response.success) {
        setBackupCodes(response.data.backup_codes);
        setStep(3);
        showToast.success('MFA setup completed successfully!');
        // Reload status after successful setup
        await loadMFAStatus();
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Verification failed';
      setError(errorMsg);
    } finally {
      setSetupLoading(false);
    }
  };

  const regenerateBackupCodes = async (): Promise<void> => {
    const password = prompt('Please enter your password to regenerate backup codes:');
    if (!password) return;

    try {
      setSetupLoading(true);
      const response: IMFABackupCodesResponse = await authUtils.regenerateBackupCodes(password);
      
      if (response.success) {
        setBackupCodes(response.data.backup_codes);
        setShowBackupCodes(true);
        showToast.success('Backup codes regenerated successfully');
        await loadMFAStatus();
      } else {
        showToast.error(response.message || 'Failed to regenerate backup codes');
      }
    } catch (error: any) {
      showToast.error(error.message || 'Error regenerating backup codes');
    } finally {
      setSetupLoading(false);
    }
  };

  const disableMFA = async (): Promise<void> => {
    if (!disablePassword.trim() || !disableCode.trim()) {
      setError('Please enter both password and verification code');
      return;
    }

    try {
      setSetupLoading(true);
      setError('');
      
      const response: IMFADisableResponse = await authUtils.disableMFA(disablePassword, disableCode);
      
      if (response.success) {
        setShowDisableConfirm(false);
        setDisablePassword('');
        setDisableCode('');
        showToast.success('MFA disabled successfully');
        await loadMFAStatus();
      } else {
        setError(response.message || 'Failed to disable MFA');
      }
    } catch (error: any) {
      setError(error.message || 'Error disabling MFA');
    } finally {
      setSetupLoading(false);
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success('Copied to clipboard');
    }).catch(() => {
      showToast.error('Failed to copy to clipboard');
    });
  };

  const downloadBackupCodes = (): void => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medh-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast.success('Backup codes downloaded');
  };

  const resetSetup = (): void => {
    setShowSetup(false);
    setStep(1);
    setTotpSetupData(null);
    setVerificationCode('');
    setPhoneNumber('');
    setError('');
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading MFA settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Multi-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {mfaStatus.enabled ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Enabled</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Disabled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {!showSetup && !showDisableConfirm ? (
          <div className="space-y-6">
            {/* Current Status */}
            {mfaStatus.enabled && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                      MFA is Active
                    </h4>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p>Method: {authUtils.getMFAMethodDisplayName(mfaStatus.method)}</p>
                      {mfaStatus.setupDate && (
                        <p>Enabled: {new Date(mfaStatus.setupDate).toLocaleDateString()}</p>
                      )}
                      {mfaStatus.phoneNumber && (
                        <p>Phone: {mfaStatus.phoneNumber}</p>
                      )}
                      <p>Backup codes: {mfaStatus.backupCodesCount} remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!mfaStatus.enabled && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      MFA is Disabled
                    </h4>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                      Your account is more vulnerable without multi-factor authentication. Enable it now for better security.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {!mfaStatus.enabled ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSetupMethod('totp');
                      setShowSetup(true);
                    }}
                    className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Setup Authenticator App
                  </button>
                  <button
                    onClick={() => {
                      setSetupMethod('sms');
                      setShowSetup(true);
                    }}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Setup SMS Verification
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowBackupCodes(true)}
                    className="flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    View Backup Codes
                  </button>
                  <button
                    onClick={regenerateBackupCodes}
                    disabled={setupLoading}
                    className="flex items-center justify-center px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
                  >
                    {setupLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5 mr-2" />
                    )}
                    Regenerate Codes
                  </button>
                  <button
                    onClick={() => setShowDisableConfirm(true)}
                    className="flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Unlock className="w-5 h-5 mr-2" />
                    Disable MFA
                  </button>
                </div>
              )}
            </div>

            {/* Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    About Multi-Factor Authentication
                  </h4>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>• Authenticator apps (like Google Authenticator) are more secure than SMS</p>
                    <p>• Always save your backup codes in a secure location</p>
                    <p>• You can use backup codes if you lose access to your primary method</p>
                    <p>• MFA significantly reduces the risk of unauthorized access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showSetup ? (
          <MFASetupFlow
            method={setupMethod}
            step={step}
            totpSetupData={totpSetupData}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            backupCodes={backupCodes}
            error={error}
            loading={setupLoading}
            onStartTOTP={startTOTPSetup}
            onStartSMS={startSMSSetup}
            onVerify={verifySetup}
            onCancel={resetSetup}
            onCopyCode={copyToClipboard}
            onDownloadCodes={downloadBackupCodes}
          />
        ) : (
          <DisableMFAForm
            password={disablePassword}
            setPassword={setDisablePassword}
            code={disableCode}
            setCode={setDisableCode}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={error}
            loading={setupLoading}
            onDisable={disableMFA}
            onCancel={() => {
              setShowDisableConfirm(false);
              setDisablePassword('');
              setDisableCode('');
              setError('');
            }}
          />
        )}
      </div>

      {/* Backup Codes Modal */}
      <AnimatePresence>
        {showBackupCodes && (
          <BackupCodesModal
            codes={backupCodes}
            onClose={() => setShowBackupCodes(false)}
            onCopy={copyToClipboard}
            onDownload={downloadBackupCodes}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// MFA Setup Flow Component
interface MFASetupFlowProps {
  method: 'totp' | 'sms';
  step: number;
  totpSetupData: TOTPSetupData | null;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  backupCodes: string[];
  error: string;
  loading: boolean;
  onStartTOTP: () => void;
  onStartSMS: () => void;
  onVerify: () => void;
  onCancel: () => void;
  onCopyCode: (text: string) => void;
  onDownloadCodes: () => void;
}

const MFASetupFlow: React.FC<MFASetupFlowProps> = ({
  method,
  step,
  totpSetupData,
  verificationCode,
  setVerificationCode,
  phoneNumber,
  setPhoneNumber,
  backupCodes,
  error,
  loading,
  onStartTOTP,
  onStartSMS,
  onVerify,
  onCancel,
  onCopyCode,
  onDownloadCodes
}) => {
  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-12 h-0.5 ${
                step > stepNum ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 1 && (
        <div className="text-center space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Setup {method === 'totp' ? 'Authenticator App' : 'SMS Verification'}
          </h4>
          
          {method === 'sms' && (
            <div className="max-w-sm mx-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={method === 'totp' ? onStartTOTP : onStartSMS}
              disabled={loading || (method === 'sms' && !phoneNumber.trim())}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Start Setup
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {method === 'totp' ? 'Scan QR Code' : 'Enter Verification Code'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {method === 'totp' 
                ? 'Scan the QR code with your authenticator app and enter the 6-digit code'
                : 'Enter the 6-digit code sent to your phone'
              }
            </p>
          </div>

          {method === 'totp' && totpSetupData && (
            <div className="space-y-4">
              {totpSetupData.qrCodeUrl && (
                <div className="flex justify-center">
                  <img 
                    src={totpSetupData.qrCodeUrl} 
                    alt="TOTP QR Code" 
                    className="w-48 h-48 border border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Manual entry key (if you can't scan the QR code):
                </p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded border">
                    {totpSetupData.manualEntryKey}
                  </code>
                  <button
                    onClick={() => onCopyCode(totpSetupData.manualEntryKey)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-sm mx-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              placeholder="000000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="text-center text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onVerify}
              disabled={loading || verificationCode.length !== 6}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Verify & Enable
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              MFA Setup Complete!
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your account is now protected with multi-factor authentication.
            </p>
          </div>

          {backupCodes.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Important: Save Your Backup Codes
              </h5>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                These codes can be used to access your account if you lose your primary MFA method.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                    {code}
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => onCopyCode(backupCodes.join('\n'))}
                  className="text-sm text-yellow-700 dark:text-yellow-300 hover:underline flex items-center"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy All
                </button>
                <button
                  onClick={onDownloadCodes}
                  className="text-sm text-yellow-700 dark:text-yellow-300 hover:underline flex items-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onCancel}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Complete Setup
          </button>
        </div>
      )}
    </div>
  );
};

// Disable MFA Form Component
interface DisableMFAFormProps {
  password: string;
  setPassword: (password: string) => void;
  code: string;
  setCode: (code: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  error: string;
  loading: boolean;
  onDisable: () => void;
  onCancel: () => void;
}

const DisableMFAForm: React.FC<DisableMFAFormProps> = ({
  password,
  setPassword,
  code,
  setCode,
  showPassword,
  setShowPassword,
  error,
  loading,
  onDisable,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Disable Multi-Factor Authentication
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This will make your account less secure. Please confirm by entering your password and a verification code.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
            }}
            placeholder="000000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={6}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter a code from your authenticator app or use a backup code
          </p>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDisable}
          disabled={loading || !password.trim() || !code.trim()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Unlock className="w-4 h-4 mr-2" />
          )}
          Disable MFA
        </button>
      </div>
    </div>
  );
};

// Backup Codes Modal Component
interface BackupCodesModalProps {
  codes: string[];
  onClose: () => void;
  onCopy: (text: string) => void;
  onDownload: () => void;
}

const BackupCodesModal: React.FC<BackupCodesModalProps> = ({
  codes,
  onClose,
  onCopy,
  onDownload
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Backup Codes
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Save these codes in a secure location. Each code can only be used once.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {codes.map((code, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border font-mono text-sm text-center"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => onCopy(codes.join('\n'))}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </button>
              <button
                onClick={onDownload}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MFAManagement; 