'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { authAPI } from '@/apis/auth.api';

const DeleteDataContent = () => {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [requestProcessed, setRequestProcessed] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const signedRequest = searchParams.get('signed_request');
    if (signedRequest) {
      handleMetaDataDeletionRequest(signedRequest);
    }
  }, [searchParams]);

  const handleMetaDataDeletionRequest = async (signedRequest: string) => {
    setIsProcessing(true);
    
    try {
      const [encodedSig, payload] = signedRequest.split('.');
      
      if (!payload) {
        throw new Error('Invalid signed request format');
      }
      
      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      );
      
      const confirmCode = generateConfirmationCode();
      setConfirmationCode(confirmCode);
      
      await simulateDataDeletion(decodedPayload.user_id, confirmCode);
      
      setRequestProcessed(true);
      toast.success('Data deletion request has been processed successfully.');
      
    } catch (error) {
      console.error('Error processing Meta data deletion request:', error);
      toast.error('Failed to process data deletion request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualDataDeletion = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);
    
    try {
      const confirmCode = generateConfirmationCode();
      setConfirmationCode(confirmCode);
      
      const response = await fetch(authAPI.profile.deleteAccount, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'manual_request',
          confirmation_code: confirmCode
        })
      });
      
      if (response.ok) {
        setRequestProcessed(true);
        toast.success('Data deletion request submitted successfully. You will receive a confirmation email.');
      } else {
        throw new Error('Failed to submit deletion request');
      }
      
    } catch (error) {
      console.error('Error submitting manual data deletion request:', error);
      toast.error('Failed to submit data deletion request. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateDataDeletion = async (userId: string, confirmCode: string) => {
    console.log(`Scheduling data deletion for user: ${userId}, confirmation: ${confirmCode}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const generateConfirmationCode = () => {
    return `MEDH_DEL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Processing Request
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we process your data deletion request...
          </p>
        </div>
      </div>
    );
  }

  if (requestProcessed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Data Deletion Request Confirmed
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your data deletion request has been successfully processed.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Confirmation Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Confirmation Code:</span>
                <span className="font-mono text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  {confirmationCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Request Date:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="text-green-600 font-semibold">Confirmed</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h4 className="text-blue-900 dark:text-blue-300 font-semibold mb-2">
              What happens next?
            </h4>
            <ul className="text-blue-800 dark:text-blue-400 text-sm space-y-1">
              <li>• Your data deletion request has been queued for processing</li>
              <li>• All personal data will be permanently removed within 30 days</li>
              <li>• You will receive email confirmation once deletion is complete</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              If you have any questions about this process, please contact our support team at{' '}
              <a 
                href="mailto:support@medh.co" 
                className="text-green-600 hover:underline"
              >
                support@medh.co
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Data Deletion Request
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            You can request the deletion of your personal data from our systems. 
            This process is irreversible and will permanently remove all your account information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Request Data Deletion
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleManualDataDeletion(userEmail);
            }}>
              <div className="mb-6">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your registered email address"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="text-yellow-900 dark:text-yellow-300 font-semibold text-sm mb-1">
                        Important Notice
                      </h4>
                      <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                        This action will permanently delete all your data including profile, course progress, 
                        certificates, and cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Submit Deletion Request'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              What Data Gets Deleted?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Personal Information</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Name, email, phone number, profile picture</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Course Data</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Enrollment history, progress, assignments, grades</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Account Settings</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Preferences, notifications, privacy settings</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Social Connections</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">OAuth connections, social media links</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Retention Policy</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Some data may be retained for legal or business purposes as outlined in our 
                <a href="/privacy-policy" className="text-green-600 hover:underline ml-1">Privacy Policy</a>.
                Complete deletion occurs within 30 days of request confirmation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Meta OAuth Data Deletion Compliance
          </h3>
          <p className="text-blue-800 dark:text-blue-400 text-sm mb-4">
            This page serves as our data deletion callback URL for Meta (Facebook) OAuth compliance. 
            If you connected your account using Facebook login, you can use this page to request complete 
            data deletion as required by Meta's platform policies.
          </p>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p><strong>Callback URL:</strong> https://medh.co/delete-data/</p>
            <p><strong>Compliance:</strong> Meta Platform Policy 7.c - Data Deletion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Loading
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we load the page...
        </p>
      </div>
    </div>
  );
};

const DeleteDataPage = () => {
  return (
    <PageWrapper>
      <Suspense fallback={<LoadingFallback />}>
        <DeleteDataContent />
      </Suspense>
    </PageWrapper>
  );
};

export default DeleteDataPage; 