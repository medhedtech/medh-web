"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Share2,
  Copy,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buildAdvancedComponent, typography } from '@/utils/designSystem';
import { certificateAPI, ICertificateVerificationResponse, IVerifiedCertificate, transformCertificateResponse, IRealCertificateResponse } from '@/apis/certificate.api';
import CertificateDisplay from './CertificateDisplay';

interface CertificateDirectVerifyProps {
  certificateId: string;
}

const CertificateDirectVerify: React.FC<CertificateDirectVerifyProps> = ({ certificateId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<IVerifiedCertificate | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failed' | 'invalid' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Validate certificate ID format
  const validateCertificateId = (id: string): boolean => {
    const trimmedId = id.trim();
    // Enhanced validation for various certificate formats
    const patterns = [
      /^MEDH-CERT-\d{4}-[A-Z0-9]{8}$/i,  // MEDH-CERT-2025-DD2BF7D0
      /^CERT-\d{8}-[A-Z0-9]{8}$/i,       // CERT-20241230-08943F43
      /^MEDH-\d{4}-[A-Z0-9]{6,}$/i,      // MEDH-2024-001234
      /^[A-Z0-9-]{8,}$/i                 // General pattern
    ];
    
    return patterns.some(pattern => pattern.test(trimmedId));
  };

  // Handle certificate verification
  const verifyCertificate = async (certId: string) => {
    if (!certId?.trim()) {
      setVerificationStatus('invalid');
      setErrorMessage('Certificate ID is empty or invalid');
      setIsLoading(false);
      return;
    }

    // Validate certificate ID format
    if (!validateCertificateId(certId)) {
      setVerificationStatus('invalid');
      setErrorMessage('Invalid certificate ID format. Please check the ID and try again.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setVerificationResult(null);
      setErrorMessage('');

      console.log('Direct verification for certificate:', certId);

      // Use the certificate verification API
      const response: ICertificateVerificationResponse = await certificateAPI.verifyCertificateByNumber(
        certId.trim()
      );

      console.log('Direct verification response:', response);

      // Check if this is the new real API response format
      if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        const realResponse = response as any as IRealCertificateResponse;
        if (realResponse.success && realResponse.data) {
          // Transform the real API response to the expected format
          const transformedCertificate = transformCertificateResponse(realResponse);
          setVerificationResult(transformedCertificate);
          setVerificationStatus('success');
          
          // Update URL without page reload for better UX
          if (typeof window !== 'undefined') {
            const newUrl = `${window.location.origin}/verify-certificate/${certId}`;
            window.history.replaceState({}, '', newUrl);
          }
          return;
        }
      }

      // Handle the old format
      if (response.status === 'success' && response.data) {
        setVerificationResult(response.data);
        setVerificationStatus('success');
      } else {
        console.log('Direct certificate verification failed:', response.message);
        setVerificationStatus('failed');
        setErrorMessage(response.message || 'Certificate verification failed');
      }
    } catch (error: any) {
      console.error('Direct verification error:', error);
      setVerificationStatus('failed');
      
      // Handle different response formats
      let errorMsg = 'An unexpected error occurred while verifying the certificate';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle the specific API response format
        if (errorData.success === false || errorData.isValid === false) {
          errorMsg = errorData.message || 'Certificate not found';
        } else if (errorData.message) {
          errorMsg = errorData.message;
        }
      } else if (error.response) {
        // Handle HTTP status codes
        if (error.response.status === 404) {
          errorMsg = 'Certificate not found. Please check the certificate ID and try again.';
        } else if (error.response.status === 400) {
          errorMsg = 'Invalid certificate ID format. Please check and try again.';
        } else if (error.response.status === 500) {
          errorMsg = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-verify on component mount
  useEffect(() => {
    if (certificateId) {
      verifyCertificate(certificateId);
    }
  }, [certificateId]);

  // Handle share certificate
  const handleShare = async () => {
    if (typeof window === 'undefined' || isSharing) return;
    
    setIsSharing(true);
    
    try {
      const shareData = {
        title: `Certificate Verification - ${verificationResult?.student?.full_name || 'Student'}`,
        text: `Verified certificate for ${verificationResult?.course?.course_title || 'Course'}`,
        url: `${window.location.origin}/verify-certificate/${certificateId}`
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          toast.success('Certificate shared successfully!');
        } catch (error: any) {
          console.error('Share error:', error);
          
          // Handle specific share errors
          if (error.name === 'AbortError') {
            // User cancelled the share - don't show error
            return;
          } else if (error.name === 'InvalidStateError') {
            // Share already in progress - handled by isSharing state
            return;
          } else {
            // Other errors - fallback to clipboard
            await navigator.clipboard.writeText(shareData.url);
            toast.success('Verification link copied to clipboard!');
          }
        }
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Verification link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share fallback error:', error);
      toast.error('Failed to share certificate');
    } finally {
      setIsSharing(false);
    }
  };

  // Handle copy certificate ID
  const handleCopyId = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      await navigator.clipboard.writeText(certificateId);
      toast.success('Certificate ID copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy certificate ID');
    }
  };

  // Handle copy verification URL
  const handleCopyUrl = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const url = `${window.location.origin}/verify-certificate/${certificateId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Verification URL copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy verification URL');
    }
  };

  // If verification is successful, show the certificate display
  if (verificationStatus === 'success' && verificationResult) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-slate-50 dark:bg-slate-900"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
          {/* Header with navigation */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                href="/certificate-verify"
                className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Certificate Verification
              </Link>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isSharing 
                      ? 'bg-green-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
                  } text-white`}
                >
                  {isSharing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  {isSharing ? 'Sharing...' : 'Share'}
                </button>
                
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Copy URL
                </button>
              </div>
            </div>
          </motion.div>

          {/* Certificate Display */}
          <CertificateDisplay certificate={verificationResult} />
        </div>
      </motion.div>
    );
  }

  // Loading, error, or invalid states
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Header with navigation */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <Link
            href="/certificate-verify"
            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Certificate Verification
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={itemVariants}
          className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop' })}
        >
          <div className="text-center py-12">
            {/* Loading State */}
            {isLoading && (
              <>
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                
                <h2 className={`${typography.h2} text-blue-600 dark:text-blue-400 mb-4`}>
                  Verifying Certificate
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Please wait while we verify the authenticity of certificate <span className="font-mono font-semibold">{certificateId}</span>
                </p>
                
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Certificate ID</p>
                  <p className="font-mono text-slate-900 dark:text-slate-100 break-all">
                    {certificateId}
                  </p>
                </div>
              </>
            )}

            {/* Error States */}
            {!isLoading && (verificationStatus === 'failed' || verificationStatus === 'invalid') && (
              <>
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  {verificationStatus === 'invalid' ? (
                    <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  )}
                </div>
                
                <h2 className={`${typography.h2} text-red-600 dark:text-red-400 mb-4`}>
                  {verificationStatus === 'invalid' ? 'Invalid Certificate ID' : 'Certificate Not Found'}
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  {errorMessage || 'We could not verify this certificate. Please check the certificate ID and try again.'}
                </p>
                
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Certificate ID</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-slate-900 dark:text-slate-100 break-all mr-2">
                      {certificateId}
                    </p>
                    <button
                      onClick={handleCopyId}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Copy Certificate ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {verificationStatus === 'invalid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Valid Format Examples
                      </h4>
                      <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <p className="font-mono">MEDH-CERT-2025-DD2BF7D0</p>
                        <p className="font-mono">CERT-20241230-08943F43</p>
                        <p className="font-mono">MEDH-2024-001234</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        Need Help?
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Contact our support team if you believe this certificate should be valid.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/certificate-verify"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center justify-center"
                  >
                    Try Another Certificate
                  </Link>
                  
                  <button
                    onClick={() => verifyCertificate(certificateId)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Retry Verification
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Information Section */}
        <motion.div
          variants={itemVariants}
          className={`${buildAdvancedComponent.glassCard({ variant: 'secondary', padding: 'tablet' })} mt-8`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Secure Verification</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All certificates are verified using blockchain technology and digital signatures
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Instant Results</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get verification results in seconds with detailed certificate information
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Share & Verify</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share verification links with employers and institutions worldwide
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CertificateDirectVerify; 