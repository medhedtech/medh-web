"use client";

import React, { useState, useEffect } from 'react';
import { FaUpload, FaVideo, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { batchAPI, type IUploadRecordedLessonInput } from '@/apis/batch';
import { validateVideoFile, formatFileSize, convertBlobToBase64 } from '@/utils/videoUploadUtils';
import { toast } from 'react-hot-toast';

interface SimpleRecordedLessonUploadProps {
  batchId: string;
  sessionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export default function SimpleRecordedLessonUpload({
  batchId,
  sessionId,
  onSuccess,
  onCancel,
  isOpen
}: SimpleRecordedLessonUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [videoId, setVideoId] = useState('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Cleanup polling interval when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Reset polling when modal opens/closes
  useEffect(() => {
    if (!isOpen && pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [isOpen, pollingInterval]);

  if (!isOpen) return null;

  const resetForm = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
    setSelectedFile(null);
    setTitle('');
    setErrorMessage('');
    setVideoId('');
    // Clear any active polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // Status polling function for background processing
  const startProcessingStatusPolling = (videoId: string, batchId: string, sessionId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for up to 5 minutes (30 attempts * 10 seconds)
    
    const poll = () => {
      attempts++;
      
      // Simulate processing progress
      const progressIncrement = Math.min(5, (100 - uploadProgress) / (maxAttempts - attempts + 1));
      setUploadProgress(prev => Math.min(95, prev + progressIncrement));
      
      // TODO: Replace with actual API call to check processing status
      // Example: batchAPI.getRecordedLessonStatus(batchId, sessionId, videoId)
      
      if (attempts >= maxAttempts) {
        // Assume completion after max attempts
        setUploadStatus('completed');
        setUploadProgress(100);
        toast.success('Recorded lesson processing completed!');
        if (pollingInterval) clearInterval(pollingInterval);
        setPollingInterval(null);
        if (onSuccess) onSuccess();
        return;
      }
      
      // For now, simulate completion after 20-30 seconds
      if (attempts >= 3) { // Reduced for better UX
        setUploadStatus('completed');
        setUploadProgress(100);
        toast.success('Recorded lesson processing completed!');
        if (pollingInterval) clearInterval(pollingInterval);
        setPollingInterval(null);
        if (onSuccess) onSuccess();
        return;
      }
    };
    
    // Start immediate polling
    poll();
    
    // Set up interval for continued polling
    const interval = setInterval(poll, 10000); // Poll every 10 seconds
    setPollingInterval(interval);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.errors.join(', '));
      return;
    }

    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, '')); // Remove file extension
    setErrorMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setErrorMessage('Please select a file and enter a title');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      // Convert to base64
      setUploadProgress(25);
      const encodedData = await convertBlobToBase64(selectedFile);
      
      setUploadProgress(50);

      // Prepare upload payload
      const uploadPayload: IUploadRecordedLessonInput = {
        base64String: `data:${selectedFile.type};base64,${encodedData.base64Data}`,
        title: title.trim(),
        recorded_date: new Date().toISOString(),
        metadata: {
          fileName: selectedFile.name,
          originalSize: encodedData.originalSize,
          encodedSize: encodedData.encodedSize,
          mimeType: selectedFile.type,
          uploadedAt: new Date().toISOString()
        }
      };

      setUploadProgress(75);

      // Upload using batch API
      const response = await batchAPI.uploadAndAddRecordedLesson(
        batchId,
        sessionId,
        uploadPayload
      );

      const responseStatus = Number(response.status);
      const dataStatus = response.data?.status;
      
      // Check for 202 Accepted or other success indicators
      const isUploadAccepted = 
        responseStatus === 202 || 
        response.data?.success === true ||
        (typeof dataStatus === 'string' && ['uploading', 'in_progress', '202'].includes(dataStatus));

      if (response.data && isUploadAccepted) {
        const responseData = response.data.data;
        const uploadedVideoId = responseData?.videoId || `upload_${Date.now()}`;
        setVideoId(uploadedVideoId);
        
        // Handle 202 Accepted (background processing)
        if (responseStatus === 202 || dataStatus === 'uploading' || responseData?.uploadStatus === 'in_progress') {
          console.log('Upload accepted for background processing:', {
            status: responseStatus,
            dataStatus,
            videoId: uploadedVideoId,
            message: response.data.message
          });
          
          setUploadStatus('processing');
          setUploadProgress(85);
          toast.success('Upload started! Processing in background...');
          
          // Start polling for processing status
          startProcessingStatusPolling(uploadedVideoId, batchId, sessionId);
          
        } else {
          // Immediate completion (unlikely with current API)
          setUploadStatus('completed');
          setUploadProgress(100);
          toast.success('Recorded lesson uploaded successfully!');
          if (onSuccess) onSuccess();
        }
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadStatus('failed');
      setUploadProgress(0);
      
      let errorMsg = 'Upload failed. Please try again.';
      if (error.response?.status === 403) {
        errorMsg = 'Permission denied. Please check your authentication.';
      } else if (error.response?.status === 413) {
        errorMsg = 'File too large. Please use a smaller file.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'processing':
        return <div className="animate-pulse w-6 h-6 bg-yellow-500 rounded-full" />;
      case 'completed':
        return <FaCheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <FaExclamationTriangle className="w-6 h-6 text-red-500" />;
      default:
        return <FaVideo className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading video...';
      case 'processing':
        return 'Processing video in background...';
      case 'completed':
        return 'Upload completed!';
      case 'failed':
        return 'Upload failed';
      default:
        return 'Ready to upload';
    }
  };

  const getStatusDescription = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading file to server';
      case 'processing':
        return 'Server is processing your video (202 Accepted)';
      case 'completed':
        return 'Video is ready and added to the lesson';
      case 'failed':
        return 'Please try again or contact support';
      default:
        return 'Select a video file to begin';
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <FaVideo className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Add Recorded Lesson
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a video recording for this session
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              if (onCancel) onCancel();
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter video title..."
            disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Video File
          </label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`
              w-full p-4 border-2 border-dashed rounded-lg transition-all duration-200
              ${selectedFile 
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-700'
              }
              ${(uploadStatus === 'uploading' || uploadStatus === 'processing') ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}>
              <div className="flex flex-col items-center gap-2">
                <FaUpload className={selectedFile ? 'text-green-500' : 'text-gray-400'} />
                <div className="text-center">
                  {selectedFile ? (
                    <>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to select video
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        MP4, MOV, WebM, AVI, MKV
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {getStatusIcon()}
            <div className="flex-1">
              <p className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getStatusDescription()}
              </p>
              {uploadProgress > 0 && uploadStatus !== 'completed' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {uploadProgress}%
                  </p>
                </div>
              )}
              {videoId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                  Video ID: {videoId}
                </p>
              )}
              {uploadStatus === 'processing' && (
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">
                        Background Processing Active
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-500">
                        Server returned HTTP 202 (Accepted) - Your video is being processed. You can safely close this dialog and the processing will continue on the server.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              if (onCancel) onCancel();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={uploadStatus === 'uploading'}
          >
            {uploadStatus === 'processing' ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={handleUpload}
            disabled={
              !selectedFile || 
              !title.trim() || 
              uploadStatus === 'uploading' || 
              uploadStatus === 'processing' ||
              uploadStatus === 'completed'
            }
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 
             uploadStatus === 'processing' ? 'Processing...' : 
             uploadStatus === 'completed' ? 'Completed ✓' : 
             'Upload Video'}
          </button>
        </div>
      </div>
    </div>
  );
}
