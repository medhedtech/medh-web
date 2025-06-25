"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, Clock, FileText, X, Download, BookOpen, GraduationCap } from "lucide-react";
import materialsAPI, { ICertificate } from "@/apis/materials";

interface CertificateGroup {
  title: string;
  certificates: ICertificate[];
  icon: React.ReactNode;
  description: string;
}

const CertificateList: React.FC = () => {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<ICertificate | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await materialsAPI.getStudentCertificates();
        
        if (!mounted) return;

        if (response.status === 'error') {
          if (response.message === 'No certificates found for the given student ID') {
            setCertificates([]);
          } else {
            setError(response.message || 'Failed to fetch certificates');
          }
          return;
        }

        if (response.data) {
          setCertificates(response.data);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Failed to fetch certificates');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCertificates();

    return () => {
      mounted = false;
    };
  }, []);

  const certificateGroups: CertificateGroup[] = [
    {
      title: "Issued Certificates",
      certificates: certificates.filter(cert => cert.status === 'issued'),
      icon: <Award className="w-6 h-6 text-green-500" />,
      description: "Successfully completed course certificates"
    },
    {
      title: "Pending Certificates",
      certificates: certificates.filter(cert => cert.status === 'pending'),
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      description: "Certificates awaiting issuance"
    },
    {
      title: "Expired Certificates",
      certificates: certificates.filter(cert => cert.status === 'expired'),
      icon: <Calendar className="w-6 h-6 text-red-500" />,
      description: "Past certificates that need renewal"
    }
  ];

  if (loading) {
    return (
      <div className="p-6 min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="text-red-500 mb-4">
          <X className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Error Loading Certificates
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="p-6 min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="text-blue-500 mb-4">
          <GraduationCap className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          No Certificates Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Complete your courses to earn certificates. They'll appear here once you've finished your coursework.
        </p>
        <a
          href="/courses"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Explore Courses
        </a>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificateGroups.map((group) => (
          <div
            key={group.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              {group.icon}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {group.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {group.description}
            </p>
            <div className="space-y-4">
              {group.certificates.map((certificate) => (
                <motion.div
                  key={certificate._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {certificate.course_id.course_title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completed: {new Date(certificate.completion_date).toLocaleDateString()}
                      </p>
                    </div>
                    {certificate.status === 'issued' && (
                      <a
                        href={certificate.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
              {group.certificates.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                  No {group.title.toLowerCase()} found
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateList; 