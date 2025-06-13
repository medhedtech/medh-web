"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, Star, Eye, Download, Award, Users, User, FileText } from "lucide-react";
import StudentDashboardLayout from "./StudentDashboardLayout";

interface Certificate {
  id: string;
  title: string;
  courseName: string;
  instructor?: {
    name: string;
    rating: number;
  };
  category?: string;
  completionDate?: string;
  issueDate?: string;
  status?: 'issued' | 'pending' | 'expired' | 'processing';
  level?: 'beginner' | 'intermediate' | 'advanced';
  grade?: string;
  certificateUrl?: string;
  description?: string;
  validUntil?: string;
  credentialId?: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Updated TabButton with blog-style filter button styling
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
        : 'glass-stats text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 animate-gradient-x"></div>
    )}
    
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
    
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
  </motion.button>
);

// Certificate Card Component - matching demo classes style
const CertificateCard = ({ certificate, onViewDetails }: { certificate: Certificate; onViewDetails: (certificate: Certificate) => void }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    const gradeValue = grade.toLowerCase();
    if (gradeValue.includes('a')) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (gradeValue.includes('b')) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (gradeValue.includes('c')) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {certificate?.title || "Certificate Title"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {certificate?.courseName || "Course Name"} • by {certificate?.instructor?.name || "Instructor"}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(certificate?.issueDate)}
            </div>
            {certificate?.credentialId && (
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                ID: {certificate.credentialId}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
        
      {/* Category, Status and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {certificate?.category && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              {certificate.category}
            </span>
          )}
          {certificate?.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(certificate.status)}`}>
              {certificate.status === 'processing' && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>}
              {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
            </span>
          )}
          {certificate?.level && (
            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(certificate.level)}`}>
              {certificate.level.charAt(0).toUpperCase() + certificate.level.slice(1)}
            </span>
          )}
          {certificate?.grade && (
            <span className={`px-2 py-1 text-xs rounded-full ${getGradeColor(certificate.grade)}`}>
              Grade: {certificate.grade}
            </span>
          )}
        </div>
      </div>

      {/* Rating and Completion Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {certificate?.instructor?.rating || "4.5"}
          </span>
        </div>
        {certificate?.completionDate && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Award className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              Completed {formatDate(certificate.completionDate)}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {certificate?.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {certificate.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(certificate)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            certificate?.status === 'issued' 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          disabled={certificate?.status !== 'issued'}
        >
          <Download className="w-4 h-4 mr-2" />
          {certificate?.status === 'issued' ? 'Download' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

// Main Student Certificates Component
const StudentCertificates: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
  const [issuedCertificates, setIssuedCertificates] = useState<Certificate[]>([]);
  const [pendingCertificates, setPendingCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // No certificate data - empty arrays
        const emptyCertificates: Certificate[] = [];

        setAllCertificates(emptyCertificates);
        setIssuedCertificates(emptyCertificates);
        setPendingCertificates(emptyCertificates);
        
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to load certificates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const tabs = [
    { name: "All", content: allCertificates },
    { name: "Issued", content: issuedCertificates },
    { name: "Pending", content: pendingCertificates },
  ];

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleCloseModal = () => {
    setSelectedCertificate(null);
  };

  const filteredContent = tabs[currentTab].content.filter(certificate => 
    certificate?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate?.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <Award className="w-8 h-8 text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400 text-lg">Loading your certificates...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <Award className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Error Loading Certificates</h3>
          <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 lg:p-12 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-2 bg-primary-100/80 dark:bg-primary-900/30 rounded-xl backdrop-blur-sm mr-3">
              <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              My Certificates
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            View and manage your course completion certificates and credentials
          </p>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-md mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Tabs - in a box container */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab, idx) => {
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                >
                  <span className="relative z-10 font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredContent.length > 0 ? (
              filteredContent.map((certificate, index) => (
                <motion.div
                  key={certificate.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CertificateCard
                    certificate={certificate}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center text-center py-12"
              >
                <Award className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? "No certificates found" : "No certificates available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? "Try adjusting your search term to find what you're looking for."
                    : "Complete courses to earn certificates that will appear here."}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedCertificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full relative"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Certificate Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedCertificate?.title}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Course</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate?.courseName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Issue Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedCertificate?.issueDate ? new Date(selectedCertificate.issueDate).toLocaleDateString() : "Not available"}
                      </p>
                    </div>
                  </div>

                  {selectedCertificate?.credentialId && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Credential ID</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate.credentialId}</p>
                      </div>
                    </div>
                  )}

                  {selectedCertificate?.grade && (
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Grade</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate.grade}</p>
                      </div>
                    </div>
                  )}

                  {selectedCertificate?.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate.description}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCertificate?.status === 'issued'
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={selectedCertificate?.status !== 'issued'}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * CertificateDashboard - Component that displays the student's certificate page
 * within the student dashboard layout
 */
const CertificateDashboard: React.FC = () => {
  return (
    <StudentDashboardLayout 
      userRole="student"
      fullName="Student"
      userEmail="student@example.com"
      userImage=""
      userNotifications={0}
      userSettings={{
        theme: "light",
        language: "en",
        notifications: true
      }}
    >
      <StudentCertificates />
    </StudentDashboardLayout>
  );
};

export default CertificateDashboard;