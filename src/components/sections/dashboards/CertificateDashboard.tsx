"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, Star, Eye, Download, Award, Users, User, FileText, X, Loader2, ChevronRight, Check } from "lucide-react";
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
  count?: number;
}

// Enhanced TabButton with count badges matching upcoming classes style
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
      active
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700'
    }`}
  >
    {/* Animated background for active state */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {count !== undefined && count > 0 && (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Enhanced Certificate Card Component
const CertificateCard = ({ 
  certificate, 
  onViewDetails 
}: { 
  certificate: Certificate; 
  onViewDetails: (certificate: Certificate) => void;
}) => {
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

  const getStatusStripe = (status?: string) => {
    switch (status) {
      case 'issued':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'expired':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'processing':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Status stripe */}
      <div className={`w-full h-1 ${getStatusStripe(certificate?.status)} rounded-t-xl mb-4 -mt-6 -mx-6`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
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
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
        
      {/* Category, Status and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {certificate?.category && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {certificate.category}
            </span>
          )}
          {certificate?.status && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(certificate.status)}`}>
              {certificate.status === 'processing' && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>}
              {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
            </span>
          )}
          {certificate?.level && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(certificate.level)}`}>
              {certificate.level.charAt(0).toUpperCase() + certificate.level.slice(1)}
            </span>
          )}
          {certificate?.grade && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getGradeColor(certificate.grade)}`}>
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
          className="flex-1 flex items-center justify-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button
          className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
            certificate?.status === 'issued' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : certificate?.status === 'processing'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : certificate?.status === 'expired'
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={certificate?.status !== 'issued'}
        >
          <Download className="w-4 h-4 mr-2" />
          {certificate?.status === 'issued' ? 'Download' : 
           certificate?.status === 'processing' ? 'Processing' : 
           certificate?.status === 'expired' ? 'Expired' : 'Pending'}
        </button>
      </div>
    </div>
  );
};

const StudentCertificates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch certificates from API
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // Example API call structure:
      // const response = await fetch('/api/student/certificates');
      // const data = await response.json();
      // setCertificates(data.certificates || []);
      
      // For now, set empty array until API is integrated
      setCertificates([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleCloseModal = () => {
    setSelectedCertificate(null);
  };

  const getFilteredCertificates = () => {
    let filtered = certificates;
    
    // Filter by tab
    switch (currentTab) {
      case 0: // All Certificates
        filtered = certificates;
        break;
      case 1: // Issued
        filtered = certificates.filter(cert => cert.status === 'issued');
        break;
      case 2: // Pending
        filtered = certificates.filter(cert => cert.status === 'pending' || cert.status === 'processing');
        break;
      case 3: // Expired
        filtered = certificates.filter(cert => cert.status === 'expired');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cert =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Sort by status priority, then by issue date
      const statusPriority = {
        'issued': 1,
        'processing': 2,
        'pending': 3,
        'expired': 4
      };
      
      const aPriority = statusPriority[a.status || 'pending'];
      const bPriority = statusPriority[b.status || 'pending'];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      if (!a.issueDate && !b.issueDate) return 0;
      if (!a.issueDate) return 1;
      if (!b.issueDate) return -1;
      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    });
  };

  const filteredContent = getFilteredCertificates();

  // Count certificates for each tab
  const tabCounts = {
    all: certificates.length,
    issued: certificates.filter(cert => cert.status === 'issued').length,
    pending: certificates.filter(cert => cert.status === 'pending' || cert.status === 'processing').length,
    expired: certificates.filter(cert => cert.status === 'expired').length
  };

  const tabs = [
    { name: "All Certificates", icon: Award, count: tabCounts.all },
    { name: "Issued", icon: Check, count: tabCounts.issued },
    { name: "Pending", icon: Clock, count: tabCounts.pending },
    { name: "Expired", icon: X, count: tabCounts.expired }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-8 rounded-lg max-w-7xl mx-auto"
    >
      <div className="flex flex-col space-y-6">
        {/* Enhanced Header */}
        <div className="text-center pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl backdrop-blur-sm mr-4">
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                My Certificates
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                Track your achievements and credentials
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-lg mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
            {tabs.map((tab, idx) => {
              const TabIcon = tab.icon;
              return (
                <TabButton
                  key={idx}
                  active={currentTab === idx}
                  onClick={() => setCurrentTab(idx)}
                  count={tab.count}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </TabButton>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading certificates...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <X className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Certificates</h3>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchCertificates}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Content */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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
                  className="col-span-full flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                    <Award className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm ? "No matching certificates found" : "No certificates available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {searchTerm 
                      ? "Try adjusting your search term to find what you're looking for."
                      : "You don't have any certificates yet. Complete courses to earn certificates."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enhanced Details Modal */}
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
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-lg w-full relative max-h-[85vh] overflow-y-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>

                <div className="pr-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                      <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCertificate?.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedCertificate?.courseName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate?.instructor?.name || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Grade</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedCertificate?.grade || "Not graded"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Issue Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedCertificate?.issueDate ? new Date(selectedCertificate.issueDate).toLocaleDateString() : "Not issued"}
                        </p>
                      </div>
                    </div>

                    {selectedCertificate?.completionDate && (
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Completion Date</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedCertificate?.credentialId && (
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Credential ID</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate.credentialId}</p>
                        </div>
                      </div>
                    )}

                    {selectedCertificate?.validUntil && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Valid Until</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(selectedCertificate.validUntil).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedCertificate?.description && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate.description}</p>
                        </div>
                      </div>
                    )}

                    {(!selectedCertificate?.description) && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No additional details available for this certificate.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedCertificate?.status === 'issued' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                      disabled={selectedCertificate?.status !== 'issued'}
                    >
                      {selectedCertificate?.status === 'issued' ? 'Download Certificate' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

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