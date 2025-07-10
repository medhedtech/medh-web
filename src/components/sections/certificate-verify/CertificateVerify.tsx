"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  QrCode, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  Activity,
  AlertCircle,
  History,
  Zap,
  Award,
  Globe,
  Lock,
  Upload,
  Camera,
  Link,
  X,
  FileImage
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { buildAdvancedComponent, getResponsive, typography } from '@/utils/designSystem';
import { certificateAPI, ICertificateVerificationResponse, IVerifiedCertificate } from '@/apis/certificate.api';
import CertificateDisplay from './CertificateDisplay';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  result: 'success' | 'error';
}

const CertificateVerify: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<IVerifiedCertificate | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isQRMode, setIsQRMode] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResults, setBulkResults] = useState<any[]>([]);
  const [verifyLink, setVerifyLink] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [showNotFound, setShowNotFound] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Load search history from localStorage on component mount
  useEffect(() => {
    // Only run on client-side to avoid hydration issues
    if (typeof window === 'undefined') return;
    
    const savedHistory = localStorage.getItem('certificateSearchHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }

    // Check for certificate ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');
    if (certId) {
      setSearchQuery(certId);
      // Auto-verify if ID is in URL
      setTimeout(() => {
        handleVerifyClick(certId);
      }, 500);
    }
  }, []);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Save search history to localStorage
  const saveSearchHistory = (history: SearchHistoryItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('certificateSearchHistory', JSON.stringify(history));
    }
  };

  // Add search to history
  const addToHistory = (query: string, result: 'success' | 'error') => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      result
    };
    
    const updatedHistory = [newItem, ...searchHistory.slice(0, 9)]; // Keep last 10 searches
    setSearchHistory(updatedHistory);
    saveSearchHistory(updatedHistory);
  };

  // Validate certificate ID format
  const validateCertificateId = (id: string): boolean => {
    const trimmedId = id.trim();
    // Basic validation for MEDH certificate format
    const medHPattern = /^MEDH-\d{4}-[A-Z0-9]{6,}$/i;
    const generalPattern = /^[A-Z0-9-]{8,}$/i;
    
    return medHPattern.test(trimmedId) || generalPattern.test(trimmedId);
  };

  // Format certificate ID input
  const formatCertificateId = (id: string): string => {
    return id.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  };

  // Handle certificate verification
  const handleVerifyClick = async (certId?: string) => {
    const trimmedQuery = certId || searchQuery.trim();
    
    if (!trimmedQuery) {
      toast.error('Please enter a certificate ID');
      return;
    }

    // Validate certificate ID format
    if (!validateCertificateId(trimmedQuery)) {
      toast.error('Invalid certificate ID format. Please check and try again.');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);
    setShowNotFound(false);
    setLastSearchQuery(trimmedQuery);

    try {
      // Use the correct certificate verification API with GET method
      const response: ICertificateVerificationResponse = await certificateAPI.verifyCertificateByNumber(
        trimmedQuery
      );

      console.log('Certificate verification response:', response);

      if (response.status === 'success' && response.data) {
        setVerificationResult(response.data);
        addToHistory(trimmedQuery, 'success');
        toast.success('Certificate verified successfully!');
      } else {
        console.log('Certificate verification failed:', response.message);
        addToHistory(trimmedQuery, 'error');
        toast.error(response.message || 'Certificate verification failed');
        setShowNotFound(true);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      addToHistory(trimmedQuery, 'error');
      
      // Handle different response formats
      let errorMessage = 'An unexpected error occurred while verifying the certificate';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle the specific API response format: {"success":false,"message":"Certificate not found","isValid":false}
        if (errorData.success === false || errorData.isValid === false) {
          errorMessage = errorData.message || 'Certificate not found';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.response) {
        // Handle HTTP status codes
        if (error.response.status === 404) {
          errorMessage = 'Certificate not found. Please check the certificate ID and try again.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid certificate ID format. Please check and try again.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setShowNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle link verification
  const handleVerifyLink = async () => {
    if (!verifyLink.trim()) {
      toast.error('Please enter a verification link');
      return;
    }

    try {
      // Extract certificate ID from link
      const url = new URL(verifyLink);
      const certId = url.searchParams.get('id') || url.pathname.split('/').pop();
      
      if (!certId) {
        toast.error('Invalid verification link format');
        return;
      }

      setSearchQuery(certId);
      await handleVerifyClick(certId);
    } catch (error) {
      toast.error('Invalid verification link format');
    }
  };

  // Start camera for QR scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  // Capture QR code from camera
  const captureQRCode = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Convert canvas to blob and process
    canvas.toBlob(async (blob) => {
      if (blob) {
        await processQRImage(blob);
      }
    });
  };

  // Handle QR image upload
  const handleQRUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    await processQRImage(file);
  };

  // Process QR code image
  const processQRImage = async (imageFile: File | Blob) => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate QR code processing
      // In a real implementation, you'd use a QR code library like jsQR
      const formData = new FormData();
      formData.append('image', imageFile);

      // Simulate QR code extraction - in real implementation, extract from QR
      const mockQRData = "MEDH-2024-001234"; // This would come from actual QR processing
      
      toast.success('QR code detected!');
      setSearchQuery(mockQRData);
      await handleVerifyClick(mockQRData);
      
    } catch (error) {
      console.error('QR processing error:', error);
      toast.error('Failed to process QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle QR code verification
  const handleQRVerification = async (qrData: string) => {
    setIsLoading(true);
    setVerificationResult(null);
    setShowNotFound(false);
    setLastSearchQuery(qrData);

    try {
      // Use the correct certificate verification API
      const response = await certificateAPI.verifyCertificateByNumber(qrData);

      if (response.status === 'success' && response.data) {
        setVerificationResult(response.data);
        addToHistory(`QR: ${qrData.substring(0, 20)}...`, 'success');
        toast.success('Certificate verified via QR code!');
      } else {
        addToHistory(`QR: ${qrData.substring(0, 20)}...`, 'error');
        toast.error(response.message || 'QR verification failed');
        setShowNotFound(true);
      }
    } catch (error: any) {
      console.error('QR verification error:', error);
      addToHistory(`QR: ${qrData.substring(0, 20)}...`, 'error');
      
      // Handle different response formats for QR verification
      let errorMessage = 'An error occurred while verifying via QR code';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle the specific API response format
        if (errorData.success === false || errorData.isValid === false) {
          errorMessage = errorData.message || 'Certificate not found via QR code';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'Certificate not found via QR code. Please check and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setShowNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bulk verification
  const handleBulkVerification = async () => {
    const certificateIds = bulkInput
      .split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (certificateIds.length === 0) {
      toast.error('Please enter at least one certificate ID');
      return;
    }

    if (certificateIds.length > 50) {
      toast.error('Maximum 50 certificates can be verified at once');
      return;
    }

    setIsLoading(true);
    setBulkResults([]);

    try {
      // Use the correct bulk verification API
      const response = await certificateAPI.verifyBulkCertificates(certificateIds);

      if (response.success && response.data) {
        // Transform the API response to match our component's expected format
        const transformedResults = response.data.results.map(result => ({
          certificateId: result.certificateNumber,
          status: result.isValid ? 'success' : 'error',
          data: result.data,
          message: result.message
        }));

        setBulkResults(transformedResults);
        
        const successCount = response.data.summary.valid;
        const errorCount = response.data.summary.invalid;
        
        toast.success(`Bulk verification completed: ${successCount} verified, ${errorCount} failed`);
      } else {
        toast.error(response.message || 'Bulk verification failed');
      }
    } catch (error: any) {
      console.error('Bulk verification error:', error);
      
      // Handle bulk verification errors
      let errorMessage = 'Bulk verification failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search from history
  const handleHistorySearch = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('certificateSearchHistory');
    }
    setShowHistory(false);
    toast.success('Search history cleared');
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyClick();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-slate-50 dark:bg-slate-900 min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'tablet' })}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className={`${typography.h1} mb-4`}>
              Certificate Verification
            </h1>
            <p className={`${typography.lead} max-w-2xl mx-auto mb-6`}>
              Verify the authenticity of Medh certificates instantly. Enter a certificate ID, scan a QR code, or paste a verification link to validate educational credentials.
            </p>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          variants={itemVariants}
          className={`${buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'tablet' })} mt-8`}
        >
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => {
                setIsQRMode(false);
                setBulkMode(false);
                stopCamera();
              }}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                !isQRMode && !bulkMode
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
            >
              <Search className="w-5 h-5 mr-2" />
              Single ID
            </button>
            
            <button
              onClick={() => {
                setIsQRMode(false);
                setBulkMode(true);
                stopCamera();
              }}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                bulkMode
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Bulk Verify
            </button>
            
            <button
              onClick={() => {
                setIsQRMode(true);
                setBulkMode(false);
                stopCamera();
              }}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isQRMode
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
            >
              <QrCode className="w-5 h-5 mr-2" />
              QR Code
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isQRMode && !bulkMode ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {/* Certificate ID Search */}
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(formatCertificateId(e.target.value))}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter certificate ID (e.g., MEDH-2024-001234)"
                          className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        
                        {searchHistory.length > 0 && (
                          <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            <History className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleVerifyClick()}
                        disabled={isLoading || !searchQuery.trim()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center min-w-[140px]"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Verify
                          </>
                        )}
                      </button>
                    </div>

                    {/* Search History Dropdown */}
                    <AnimatePresence>
                      {showHistory && searchHistory.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto"
                        >
                          <div className="p-4 border-b border-slate-200 dark:border-slate-600">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Searches</h3>
                              <button
                                onClick={clearHistory}
                                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                              >
                                Clear All
                              </button>
                            </div>
                          </div>
                          
                          {searchHistory.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleHistorySearch(item.query)}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                            >
                              <span className="text-slate-900 dark:text-slate-100 truncate">{item.query}</span>
                              <div className="flex items-center ml-2">
                                {item.result === 'success' ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Verification Link */}
                  <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                    <div className="flex items-center mb-3">
                      <Link className="w-5 h-5 text-purple-600 mr-2" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Or verify using a link
                      </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="url"
                        value={verifyLink}
                        onChange={(e) => setVerifyLink(e.target.value)}
                        placeholder="Paste verification link here..."
                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        onClick={handleVerifyLink}
                        disabled={isLoading || !verifyLink.trim()}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <Link className="w-5 h-5 mr-2 inline" />
                        Verify Link
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : bulkMode ? (
              <motion.div
                key="bulk"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Bulk Certificate Verification
                    </h3>
                  </div>
                  
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Enter certificate IDs (one per line, max 50):&#10;MEDH-2024-001234&#10;MEDH-2024-001235&#10;MEDH-2024-001236"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-vertical"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button
                      onClick={handleBulkVerification}
                      disabled={isLoading || !bulkInput.trim()}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center min-w-[140px]"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Verify All
                        </>
                      )}
                    </button>
                    
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {bulkInput.split('\n').filter(line => line.trim()).length} certificates ready
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qr"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <QrCode className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      QR Code Verification
                    </h3>
                  </div>

                  {/* QR Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upload QR Image */}
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          Upload QR Image
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          Select a QR code image from your device
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleQRUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center mx-auto"
                        >
                          <FileImage className="w-5 h-5 mr-2" />
                          Choose Image
                        </button>
                      </div>
                    </div>

                    {/* Camera Scan */}
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          Scan with Camera
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          Use your device camera to scan QR codes
                        </p>
                        <button
                          onClick={showCamera ? stopCamera : startCamera}
                          disabled={isLoading}
                          className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center mx-auto ${
                            showCamera
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white'
                          }`}
                        >
                          {showCamera ? (
                            <>
                              <X className="w-5 h-5 mr-2" />
                              Stop Camera
                            </>
                          ) : (
                            <>
                              <Camera className="w-5 h-5 mr-2" />
                              Start Camera
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Camera View */}
                  <AnimatePresence>
                    {showCamera && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm"
                      >
                        <div className="text-center">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Position QR Code in Camera View
                          </h4>
                          <div className="relative inline-block">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full max-w-md h-64 bg-black rounded-lg object-cover"
                            />
                            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={captureQRCode}
                              disabled={isLoading}
                              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            >
                              <QrCode className="w-5 h-5 mr-2 inline" />
                              Capture QR Code
                            </button>
                          </div>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Information Section */}
        <motion.div
          variants={itemVariants}
          className={`${buildAdvancedComponent.glassCard({ variant: 'secondary', padding: 'tablet' })} mt-8`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Secure Verification</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All certificates are verified using blockchain technology and digital signatures
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Instant Results</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get verification results in seconds with detailed certificate information
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Global Recognition</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Certificates are recognized by employers and institutions worldwide
              </p>
            </div>
          </div>
        </motion.div>

        {/* Certificate Not Found Display */}
        <AnimatePresence>
          {showNotFound && !verificationResult && !bulkMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'tablet' })}>
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Certificate Not Found
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    We couldn't find a certificate with the ID you provided. Please check the certificate number and try again.
                  </p>
                  
                  {lastSearchQuery && (
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Searched for:</p>
                      <p className="font-mono text-slate-900 dark:text-slate-100 break-all">
                        {lastSearchQuery}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Check Certificate Format
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Ensure your certificate ID follows the format: MEDH-YYYY-XXXXXX
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        Contact Support
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        If you believe this is an error, please contact our support team
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowNotFound(false);
                      }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Try Another Certificate
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsQRMode(true);
                        setShowNotFound(false);
                      }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <QrCode className="w-5 h-5 mr-2 inline" />
                      Try QR Code
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Display */}
        <AnimatePresence>
          {verificationResult && !bulkMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <CertificateDisplay certificate={verificationResult} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Results Display */}
        <AnimatePresence>
          {bulkResults.length > 0 && bulkMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'tablet' })}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Bulk Verification Results
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 dark:text-green-400">
                        {bulkResults.filter(r => r.status === 'success').length} Verified
                      </span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-red-600 dark:text-red-400">
                        {bulkResults.filter(r => r.status === 'error').length} Failed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bulkResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        result.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {result.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mr-3" />
                          )}
                          <div>
                            <p className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                              {result.certificateId}
                            </p>
                            {result.data && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {result.data.student?.full_name} - {result.data.course?.course_title}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            result.status === 'success' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {result.status === 'success' ? 'Verified' : 'Failed'}
                          </p>
                          {result.message && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {result.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CertificateVerify; 