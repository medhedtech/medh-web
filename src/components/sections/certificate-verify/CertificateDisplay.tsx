"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download, 
  Share2, 
  Eye,
  Calendar,
  User,
  BookOpen,
  Award,
  Clock,
  Building,
  GraduationCap,
  Shield,
  ExternalLink,
  Copy,
  Flag,
  Star,
  FileText,
  Globe,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { buildAdvancedComponent, typography } from '@/utils/designSystem';
import { IVerifiedCertificate, certificateAPI } from '@/apis/certificate.api';

interface CertificateDisplayProps {
  certificate: IVerifiedCertificate;
}

const CertificateDisplay: React.FC<CertificateDisplayProps> = ({ certificate }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFullCertificate, setShowFullCertificate] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporterInfo, setReporterInfo] = useState({
    name: '',
    email: '',
    organization: ''
  });

  // Get status color and icon
  const getStatusDisplay = () => {
    if (!certificate.isActive) {
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: <XCircle className="w-6 h-6" />,
        text: 'Invalid/Revoked'
      };
    }
    
    if (certificate.validUntil && new Date(certificate.validUntil) < new Date()) {
      return {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        icon: <AlertTriangle className="w-6 h-6" />,
        text: 'Expired'
      };
    }
    
    return {
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Valid & Active'
    };
  };

  const statusDisplay = getStatusDisplay();

  // Handle certificate download
  const handleDownload = async () => {
    if (typeof window === 'undefined') return;
    
    setIsDownloading(true);
    try {
      const blob = await certificateAPI.downloadCertificate(certificate.certificateId || '');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certificate.certificateId || 'certificate'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle share certificate
  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    
    const shareData = {
      title: `Certificate Verification - ${certificate.student?.full_name || 'Student'}`,
      text: `Verified certificate for ${certificate.course?.course_title || 'Course'}`,
      url: `${window.location.origin}/certificate-verify?id=${certificate.certificateId || ''}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Certificate shared successfully!');
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Verification link copied to clipboard!');
    }
  };

  // Handle copy certificate ID
  const handleCopyId = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      await navigator.clipboard.writeText(certificate.certificateId || '');
      toast.success('Certificate ID copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy certificate ID');
    }
  };

  // Handle report fraud
  const handleReportFraud = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    try {
      const response = await certificateAPI.reportFraudulentCertificate(
        certificate.certificateId,
        reportReason,
        reporterInfo
      );

      if (response.status === 'success') {
        toast.success('Report submitted successfully. Thank you for helping us maintain certificate integrity.');
        setShowReportModal(false);
        setReportReason('');
        setReporterInfo({ name: '', email: '', organization: '' });
      } else {
        toast.error(response.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Report error:', error);
      toast.error('Failed to submit report');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'tablet' })}
    >
      {/* Header with Status */}
      <div className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border-l-4 rounded-lg p-6 mb-8`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <div className={statusDisplay.color}>
              {statusDisplay.icon}
            </div>
            <div className="ml-4">
              <h2 className={`${typography.h2} ${statusDisplay.color} mb-1`}>
                Certificate {statusDisplay.text}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Verified on {certificate.verificationDetails?.verifiedAt ? formatDate(certificate.verificationDetails.verifiedAt) : 'N/A'}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {isDownloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            
            <button
              onClick={() => setShowFullCertificate(true)}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full
            </button>
            
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Information */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className={`${typography.h3} text-slate-900 dark:text-slate-100`}>
              Student Information
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              {certificate.student?.profile_picture ? (
                <Image
                  src={certificate.student.profile_picture}
                  alt={certificate.student?.full_name || 'Student'}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  {certificate.student?.full_name || 'N/A'}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {certificate.student?.email || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Student ID</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {certificate.student?._id || 'N/A'}
                </p>
              </div>
              {certificate.grade && (
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Grade</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {certificate.grade}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <h3 className={`${typography.h3} text-slate-900 dark:text-slate-100`}>
              Course Information
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              {certificate.course?.course_image ? (
                <Image
                  src={certificate.course.course_image}
                  alt={certificate.course?.course_title || 'Course'}
                  width={48}
                  height={48}
                  className="rounded-lg mr-4 object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {certificate.course?.course_title || 'N/A'}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {certificate.course?.category || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Duration</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {certificate.course?.duration || 'N/A'}
                </p>
              </div>
              {certificate.course?.instructor && (
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Instructor</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {certificate.course.instructor?.full_name || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="mt-8 bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center mb-6">
          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
          <h3 className={`${typography.h3} text-slate-900 dark:text-slate-100`}>
            Certificate Details
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Certificate ID</p>
              <div className="flex items-center">
                <p className="font-medium text-slate-900 dark:text-slate-100 mr-2">
                  {certificate.certificateId || 'N/A'}
                </p>
                <button
                  onClick={handleCopyId}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Issue Date</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {certificate.issueDate ? formatDate(certificate.issueDate) : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Completion Date</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {certificate.completionDate ? formatDate(certificate.completionDate) : 'N/A'}
              </p>
            </div>
          </div>
          
          {certificate.validUntil && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Valid Until</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(certificate.validUntil)}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Verification Method</p>
              <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                {certificate.verificationDetails?.verificationMethod?.replace('_', ' ') || 'Standard'}
              </p>
            </div>
          </div>
          
          {certificate.score && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Score</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {certificate.score}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      {certificate.additionalInfo && (
        <div className="mt-8 bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
            <h3 className={`${typography.h3} text-slate-900 dark:text-slate-100`}>
              Additional Information
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificate.additionalInfo.certificateType && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Certificate Type</p>
                <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {certificate.additionalInfo.certificateType}
                </p>
              </div>
            )}
            
            {certificate.additionalInfo.skillsAcquired && certificate.additionalInfo.skillsAcquired.length > 0 && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Skills Acquired</p>
                <div className="flex flex-wrap gap-2">
                  {certificate.additionalInfo.skillsAcquired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {certificate.additionalInfo.accreditation && (
              <div className="md:col-span-2">
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Accreditation</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {certificate.additionalInfo.accreditation.body} - {certificate.additionalInfo.accreditation.accreditationNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Certificate Modal */}
      <AnimatePresence>
        {showFullCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullCertificate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Full Certificate View
                  </h3>
                  <button
                    onClick={() => setShowFullCertificate(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {certificate.certificateUrl ? (
                  <iframe
                    src={certificate.certificateUrl}
                    className="w-full h-[600px] rounded-lg"
                    title="Certificate Preview"
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Certificate preview not available
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Report Fraudulent Certificate
                  </h3>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reason for reporting *
                  </label>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Please describe why you believe this certificate is fraudulent..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={reporterInfo.name}
                      onChange={(e) => setReporterInfo({...reporterInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={reporterInfo.email}
                      onChange={(e) => setReporterInfo({...reporterInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterInfo.organization}
                    onChange={(e) => setReporterInfo({...reporterInfo, organization: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleReportFraud}
                    disabled={!reportReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Submit Report
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CertificateDisplay; 