'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  QrCode,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Clock
} from 'lucide-react';
import QRCode from 'qrcode';
import { buildAdvancedComponent, typography, interactive, getAnimations } from '@/utils/designSystem';
import { 
  authUtils, 
  IMFAStatusResponse, 
  IMFASetupTOTPResponse, 
  IMFASetupVerifyResponse,
  IMFASendSMSResponse,
  IMFABackupCodesResponse,
  IMFADisableResponse
} from '@/apis/auth.api';
import { showToast } from '@/utils/toastManager';

interface MFAManagementProps {
  onStatusChange?: (enabled: boolean) => void;
  className?: string;
}

interface MFAStatus {
  enabled: boolean;
  method: 'totp' | 'sms' | null;
  setup_date?: string;
  phone_number?: string;
  backup_codes_count: number;
  last_regenerated?: string;
}

interface TOTPSetupData {
  secret: string;
  manual_entry_key: string;
  qr_code_url?: string;
  backup_codes?: string[] | null;
  instructions: string[];
}

const QRCodeDisplay: React.FC<{ value: string }> = ({ value }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, { 
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    .then(url => {
      setQrDataUrl(url);
    })
    .catch(err => {
      console.error('Error generating QR code:', err);
    });
  }, [value]);

  return qrDataUrl ? (
    <img 
      src={qrDataUrl} 
      alt="QR Code for MFA Setup"
      className="w-48 h-48 mx-auto my-4 rounded-lg shadow-md"
    />
  ) : (
    <div className="w-48 h-48 mx-auto my-4 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading QR Code...</p>
    </div>
  );
};

const MFAManagement: React.FC<MFAManagementProps> = ({ onStatusChange, className = '' }) => {
  // State management
  const [mfaStatus, setMfaStatus] = useState<MFAStatus>({
    enabled: false,
    method: null,
    setup_date: undefined,
    phone_number: undefined,
    backup_codes_count: 0,
    last_regenerated: undefined
  });
  
  const [loading, setLoading] = useState(true);
  const [setupStep, setSetupStep] = useState<'method' | 'totp' | 'sms' | 'verify' | 'backup' | null>(null);
  const [setupData, setSetupData] = useState<{
    secret?: string;
    qrCodeUrl?: string;
    phoneNumber?: string;
    verificationCode?: string;
    backupCodes?: string[];
  }>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableVerificationCode, setDisableVerificationCode] = useState('');
  const [showDisablePassword, setShowDisablePassword] = useState(false);

  // Refs for focus management
  const verificationInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Load MFA status on component mount
  useEffect(() => {
    loadMFAStatus();
  }, []);

  // Focus management
  useEffect(() => {
    if (setupStep === 'verify' && verificationInputRef.current) {
      verificationInputRef.current.focus();
    }
    if (setupStep === 'sms' && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [setupStep]);

  const loadMFAStatus = async () => {
    setLoading(true);
    try {
      const response: IMFAStatusResponse = await authUtils.getMFAStatus();
      
      if (response.success) {
        setMfaStatus({
          enabled: response.data.enabled,
          method: response.data.method,
          setup_date: response.data.setup_date,
          phone_number: response.data.phone_number,
          backup_codes_count: response.data.backup_codes_count,
          last_regenerated: response.data.last_regenerated
        });
      } else {
        showToast.error(response.message || 'Failed to load MFA status');
      }
    } catch (error: any) {
      console.error('Error loading MFA status:', error);
      showToast.error('Failed to load MFA status');
    } finally {
      setLoading(false);
    }
  };

  const startSetup = (method: 'totp' | 'sms') => {
    setSetupStep('method');
    setSetupData({});
    setErrors({});
    
    if (method === 'totp') {
      setupTOTP();
    } else {
      setSetupStep('sms');
    }
  };

  const setupTOTP = async () => {
    setActionLoading('totp_setup');
    try {
      const response: IMFASetupTOTPResponse = await authUtils.setupTOTP();
      
      if (response.success) {
        setSetupData({
          secret: response.data.secret,
          qrCodeUrl: response.data.qr_code_url || authUtils.generateTOTPQRCodeUrl(
            response.data.secret, 
            localStorage.getItem('userEmail') || 'user@medh.co'
          )
        });
        setSetupStep('totp');
        showToast.success('TOTP setup initiated. Scan the QR code with your authenticator app.');
      } else {
        showToast.error(response.message || 'Failed to setup TOTP');
        setSetupStep(null);
      }
    } catch (error: any) {
      console.error('Error setting up TOTP:', error);
      showToast.error('Failed to setup TOTP');
      setSetupStep(null);
    } finally {
      setActionLoading(null);
    }
  };

  const setupSMS = async () => {
    if (!phoneNumber.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    // Basic phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrors({ phone: 'Please enter a valid phone number' });
      return;
    }

    setActionLoading('sms_setup');
    setErrors({});
    
    try {
      const response: IMFASendSMSResponse = await authUtils.setupSMS(phoneNumber);
      
      if (response.success) {
        setSetupData({ phoneNumber });
        setSetupStep('verify');
        showToast.success('SMS verification code sent to your phone');
      } else {
        setErrors({ phone: response.message || 'Failed to send SMS code' });
      }
    } catch (error: any) {
      console.error('Error setting up SMS:', error);
      setErrors({ phone: 'Failed to setup SMS authentication' });
    } finally {
      setActionLoading(null);
    }
  };

  const verifySetup = async () => {
    if (!verificationCode.trim()) {
      setErrors({ verification: 'Please enter the verification code' });
      return;
    }

    if (!authUtils.isValidMFACode(verificationCode)) {
      setErrors({ verification: 'Please enter a valid 6-digit code' });
      return;
    }

    setActionLoading('verify_setup');
    setErrors({});
    
    try {
      let response: IMFASetupVerifyResponse;
      
      if (setupStep === 'verify' && setupData.phoneNumber) {
        // SMS verification
        response = await authUtils.verifySMSSetup(verificationCode.trim());
      } else {
        // TOTP verification
        response = await authUtils.verifyTOTPSetup(verificationCode.trim());
      }
      
      if (response.success) {
        if (response.data.backup_codes) {
          setBackupCodes(response.data.backup_codes);
          setSetupStep('backup');
        } else {
          // Setup complete
          await loadMFAStatus();
          setSetupStep(null);
          showToast.success('🎉 MFA setup completed successfully!');
          onStatusChange?.(true);
        }
      } else {
        setErrors({ verification: response.message || 'Invalid verification code' });
      }
    } catch (error: any) {
      console.error('Error verifying setup:', error);
      setErrors({ verification: 'Verification failed. Please try again.' });
    } finally {
      setActionLoading(null);
    }
  };

  const completeSetup = async () => {
    await loadMFAStatus();
    setSetupStep(null);
    setBackupCodes([]);
    showToast.success('🎉 MFA setup completed successfully!');
    onStatusChange?.(true);
  };

  const disableMFA = async () => {
    if (!disablePassword.trim()) {
      setErrors({ disablePassword: 'Password is required' });
      return;
    }

    if (mfaStatus.enabled && !disableVerificationCode.trim()) {
      setErrors({ disableVerification: 'Verification code is required' });
      return;
    }

    if (mfaStatus.enabled && !authUtils.isValidMFACode(disableVerificationCode)) {
      setErrors({ disableVerification: 'Please enter a valid 6-digit code' });
      return;
    }

    setActionLoading('disable_mfa');
    setErrors({});
    
    try {
      const response: IMFADisableResponse = await authUtils.disableMFA(
        disablePassword,
        disableVerificationCode
      );
      
      if (response.success) {
        await loadMFAStatus();
        setShowDisableConfirm(false);
        setDisablePassword('');
        setDisableVerificationCode('');
        showToast.success('MFA has been disabled successfully');
        onStatusChange?.(false);
      } else {
        setErrors({ disableGeneral: response.message || 'Failed to disable MFA' });
      }
    } catch (error: any) {
      console.error('Error disabling MFA:', error);
      setErrors({ disableGeneral: 'Failed to disable MFA. Please try again.' });
    } finally {
      setActionLoading(null);
    }
  };

  const regenerateBackupCodes = async () => {
    if (!window.confirm('Are you sure you want to regenerate backup codes? Your current codes will be invalidated.')) {
      return;
    }

    const password = window.prompt('Please enter your password to regenerate backup codes:');
    if (!password) return;

    setActionLoading('regenerate_codes');
    
    try {
      const response: IMFABackupCodesResponse = await authUtils.regenerateBackupCodes(password);
      
      if (response.success) {
        setBackupCodes(response.data.backup_codes);
        setShowBackupCodes(true);
        await loadMFAStatus();
        showToast.success('Backup codes regenerated successfully');
      } else {
        showToast.error(response.message || 'Failed to regenerate backup codes');
      }
    } catch (error: any) {
      console.error('Error regenerating backup codes:', error);
      showToast.error('Failed to regenerate backup codes');
    } finally {
      setActionLoading(null);
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText).then(() => {
      showToast.success('Backup codes copied to clipboard');
    }).catch(() => {
      showToast.error('Failed to copy backup codes');
    });
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
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

  const cancelSetup = () => {
    setSetupStep(null);
    setSetupData({});
    setVerificationCode('');
    setPhoneNumber('');
    setErrors({});
  };

  if (loading) {
    return (
      <div className={buildAdvancedComponent.contentCard()}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-3 text-slate-600">Loading MFA settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Main MFA Status Card */}
      <div className={buildAdvancedComponent.contentCard()}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            mfaStatus.enabled 
              ? 'bg-green-100 text-green-600' 
              : 'bg-orange-100 text-orange-600'
          }`}>
            <Shield className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`${typography.h3} text-slate-800`}>
                Multi-Factor Authentication
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                mfaStatus.enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {mfaStatus.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <p className={`${typography.body} text-slate-600 mb-4`}>
              {mfaStatus.enabled
                ? `Protected with ${authUtils.getMFAMethodDisplayName(mfaStatus.method)}${mfaStatus.setup_date ? ` • Setup on ${new Date(mfaStatus.setup_date).toLocaleDateString()}` : ''}`
                : 'Add an extra layer of security to your account with two-factor authentication'
              }
            </p>

            {mfaStatus.enabled && (
              <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Key className="w-4 h-4" />
                  <span>{mfaStatus.backup_codes_count} backup codes remaining</span>
                </div>
                {mfaStatus.method === 'sms' && mfaStatus.phone_number && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{mfaStatus.phone_number}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {!mfaStatus.enabled ? (
                <>
                  <button
                    onClick={() => startSetup('totp')}
                    className={`${interactive.button} bg-blue-600 text-white hover:bg-blue-700`}
                    disabled={!!actionLoading}
                  >
                    {actionLoading === 'totp_setup' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <QrCode className="w-4 h-4 mr-2" />
                    )}
                    Setup with Authenticator App
                  </button>
                  <button
                    onClick={() => startSetup('sms')}
                    className={`${interactive.button} bg-emerald-600 text-white hover:bg-emerald-700`}
                    disabled={!!actionLoading}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Setup with SMS
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                    className={`${interactive.button} bg-slate-600 text-white hover:bg-slate-700`}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
                  </button>
                  <button
                    onClick={regenerateBackupCodes}
                    className={`${interactive.button} bg-amber-600 text-white hover:bg-amber-700`}
                    disabled={!!actionLoading}
                  >
                    {actionLoading === 'regenerate_codes' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Regenerate Codes
                  </button>
                  <button
                    onClick={() => setShowDisableConfirm(true)}
                    className={`${interactive.button} bg-red-600 text-white hover:bg-red-700`}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Disable MFA
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Setup Flow */}
      <AnimatePresence>
        {setupStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={buildAdvancedComponent.contentCard()}>
            {/* Setup Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {setupStep === 'totp' && <QrCode className="w-8 h-8 text-white" />}
                {setupStep === 'sms' && <Phone className="w-8 h-8 text-white" />}
                {setupStep === 'verify' && <Shield className="w-8 h-8 text-white" />}
                {setupStep === 'backup' && <Key className="w-8 h-8 text-white" />}
              </div>
              <h3 className={`${typography.h3} text-slate-800 mb-2`}>
                {setupStep === 'totp' && 'Setup Authenticator App'}
                {setupStep === 'sms' && 'Setup SMS Authentication'}
                {setupStep === 'verify' && 'Verify Your Setup'}
                {setupStep === 'backup' && 'Save Your Backup Codes'}
              </h3>
              <p className={`${typography.body} text-slate-600`}>
                {setupStep === 'totp' && 'Scan the QR code with your authenticator app and enter the verification code'}
                {setupStep === 'sms' && 'Enter your phone number to receive verification codes'}
                {setupStep === 'verify' && 'Enter the verification code to complete setup'}
                {setupStep === 'backup' && 'Store these backup codes in a safe place. You can use them to access your account if you lose your MFA device.'}
              </p>
            </div>

            {/* TOTP Setup */}
            {setupStep === 'totp' && setupData.qrCodeUrl && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* QR Code */}
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="bg-white p-4 rounded-xl border-2 border-slate-200">
                      <QRCodeDisplay value={setupData.qrCodeUrl} />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="flex-1 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                        {authUtils.getMFASetupInstructions('totp').map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Manual Entry */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Manual Entry Key:</h4>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded border font-mono text-sm">
                          {setupData.secret}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(setupData.secret || '');
                            showToast.success('Secret key copied to clipboard');
                          }}
                          className={`${interactive.button} bg-slate-600 text-white hover:bg-slate-700 px-3 py-2`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Enter the 6-digit code from your authenticator app
                    </label>
                    <input
                      ref={verificationInputRef}
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                        setErrors({ ...errors, verification: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-center text-lg font-mono tracking-widest ${
                        errors.verification ? 'border-red-300' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="000000"
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                    {errors.verification && (
                      <p className="mt-1 text-sm text-red-600">{errors.verification}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={verifySetup}
                      disabled={!verificationCode || verificationCode.length !== 6 || !!actionLoading}
                      className={`${interactive.button} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50`}
                    >
                      {actionLoading === 'verify_setup' ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      Verify & Continue
                    </button>
                    <button
                      onClick={cancelSetup}
                      className={`${interactive.button} bg-slate-300 text-slate-700 hover:bg-slate-400`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SMS Setup */}
            {setupStep === 'sms' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">SMS Authentication:</h4>
                  <p className="text-sm text-blue-800">
                    You'll receive verification codes via SMS. Make sure you have access to your phone.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number (with country code)
                  </label>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl ${
                      errors.phone ? 'border-red-300' : 'border-slate-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={setupSMS}
                    disabled={!phoneNumber.trim() || !!actionLoading}
                    className={`${interactive.button} bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50`}
                  >
                    {actionLoading === 'sms_setup' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    Send Verification Code
                  </button>
                  <button
                    onClick={cancelSetup}
                    className={`${interactive.button} bg-slate-300 text-slate-700 hover:bg-slate-400`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Verification Step */}
            {setupStep === 'verify' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-900 mb-2">Verification Code Sent:</h4>
                  <p className="text-sm text-emerald-800">
                    We've sent a 6-digit code to {setupData.phoneNumber}. Enter it below to complete setup.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    ref={verificationInputRef}
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                      setErrors({ ...errors, verification: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl text-center text-lg font-mono tracking-widest ${
                      errors.verification ? 'border-red-300' : 'border-slate-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {errors.verification && (
                    <p className="mt-1 text-sm text-red-600">{errors.verification}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={verifySetup}
                    disabled={!verificationCode || verificationCode.length !== 6 || !!actionLoading}
                    className={`${interactive.button} bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50`}
                  >
                    {actionLoading === 'verify_setup' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Verify & Complete Setup
                  </button>
                  <button
                    onClick={cancelSetup}
                    className={`${interactive.button} bg-slate-300 text-slate-700 hover:bg-slate-400`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Backup Codes Display */}
            {setupStep === 'backup' && backupCodes.length > 0 && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">Important: Save These Backup Codes</h4>
                      <p className="text-sm text-amber-800">
                        These codes can be used to access your account if you lose your MFA device. 
                        Store them in a secure location and don't share them with anyone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="bg-white px-3 py-2 rounded border font-mono text-sm text-center">
                        {authUtils.formatBackupCodes([code])[0]}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={copyBackupCodes}
                      className={`${interactive.button} bg-slate-600 text-white hover:bg-slate-700`}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Codes
                    </button>
                    <button
                      onClick={downloadBackupCodes}
                      className={`${interactive.button} bg-blue-600 text-white hover:bg-blue-700`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Codes
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={completeSetup}
                    className={`${interactive.button} bg-green-600 text-white hover:bg-green-700`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Setup
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backup Codes Display */}
      <AnimatePresence>
        {showBackupCodes && mfaStatus.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={buildAdvancedComponent.contentCard()}>
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-amber-600" />
              <h3 className={`${typography.h3} text-slate-800`}>Backup Codes</h3>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                You have {mfaStatus.backup_codes_count} backup codes remaining. 
                Each code can only be used once. Generate new codes if you're running low.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={regenerateBackupCodes}
                disabled={!!actionLoading}
                className={`${interactive.button} bg-amber-600 text-white hover:bg-amber-700`}
              >
                {actionLoading === 'regenerate_codes' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Regenerate Backup Codes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable MFA Confirmation */}
      <AnimatePresence>
        {showDisableConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={buildAdvancedComponent.contentCard()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className={`${typography.h3} text-slate-800`}>Disable Multi-Factor Authentication</h3>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Disabling MFA will make your account less secure. 
                You'll only need your password to sign in, which is less safe than two-factor authentication.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showDisablePassword ? 'text' : 'password'}
                    value={disablePassword}
                    onChange={(e) => {
                      setDisablePassword(e.target.value);
                      setErrors({ ...errors, disablePassword: '' });
                    }}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl ${
                      errors.disablePassword ? 'border-red-300' : 'border-slate-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDisablePassword(!showDisablePassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showDisablePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.disablePassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.disablePassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={disableVerificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setDisableVerificationCode(value);
                    setErrors({ ...errors, disableVerification: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-center text-lg font-mono tracking-widest ${
                    errors.disableVerification ? 'border-red-300' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="000000"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                {errors.disableVerification && (
                  <p className="mt-1 text-sm text-red-600">{errors.disableVerification}</p>
                )}
              </div>

              {errors.disableGeneral && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{errors.disableGeneral}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={disableMFA}
                  disabled={!disablePassword || !disableVerificationCode || !!actionLoading}
                  className={`${interactive.button} bg-red-600 text-white hover:bg-red-700 disabled:opacity-50`}
                >
                  {actionLoading === 'disable_mfa' ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Disable MFA
                </button>
                <button
                  onClick={() => {
                    setShowDisableConfirm(false);
                    setDisablePassword('');
                    setDisableVerificationCode('');
                    setErrors({});
                  }}
                  className={`${interactive.button} bg-slate-300 text-slate-700 hover:bg-slate-400`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MFAManagement; 