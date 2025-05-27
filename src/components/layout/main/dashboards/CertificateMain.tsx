"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Download,
  Eye,
  GraduationCap,
  Search,
  Filter,
  Star,
  BookOpen,
  User,
  CheckCircle,
  Clock,
  FileText,
  ExternalLink,
  Share2
} from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';

// TypeScript interfaces
interface ICertificate {
  id: number;
  title: string;
  course: string;
  instructor: string;
  completionDate: string;
  issueDate: string;
  certificateId: string;
  status: "issued" | "pending" | "expired";
  grade: number;
  maxGrade: number;
  creditsEarned: number;
  validUntil: string | null;
  certificateUrl: string;
  courseImage: string;
  skills: string[];
  type: "Course Completion" | "Specialization" | "Professional" | "Achievement";
}

interface ICertificateStats {
  total: number;
  issued: number;
  pending: number;
  thisMonth: number;
  totalCredits: number;
}

/**
 * CertificateMain - Component that displays the certificate content
 * within the student dashboard layout
 */
const CertificateMain: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "issued" | "pending" | "expired">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  // Mock certificate data
  const certificates = useMemo<ICertificate[]>(() => [
    {
      id: 1,
      title: "Full Stack Web Development",
      course: "Complete Web Development Bootcamp",
      instructor: "Dr. Sarah Johnson",
      completionDate: "2024-03-15",
      issueDate: "2024-03-16",
      certificateId: "CERT-2024-001",
      status: "issued",
      grade: 92,
      maxGrade: 100,
      creditsEarned: 12,
      validUntil: null,
      certificateUrl: "/certificates/cert-001.pdf",
      courseImage: "/images/courses/fullstack.jpg",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      type: "Course Completion"
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      course: "Data Science with Python",
      instructor: "Prof. Michael Chen",
      completionDate: "2024-02-28",
      issueDate: "2024-03-01",
      certificateId: "CERT-2024-002",
      status: "issued",
      grade: 88,
      maxGrade: 100,
      creditsEarned: 10,
      validUntil: "2027-03-01",
      certificateUrl: "/certificates/cert-002.pdf",
      courseImage: "/images/courses/datascience.jpg",
      skills: ["Python", "Pandas", "Machine Learning", "Statistics"],
      type: "Specialization"
    },
    {
      id: 3,
      title: "UI/UX Design Mastery",
      course: "Advanced UI/UX Design",
      instructor: "Emily Rodriguez",
      completionDate: "2024-04-10",
      issueDate: "2024-04-11",
      certificateId: "CERT-2024-003",
      status: "issued",
      grade: 95,
      maxGrade: 100,
      creditsEarned: 8,
      validUntil: null,
      certificateUrl: "/certificates/cert-003.pdf",
      courseImage: "/images/courses/uxdesign.jpg",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      type: "Professional"
    },
    {
      id: 4,
      title: "Digital Marketing Excellence",
      course: "Digital Marketing Fundamentals",
      instructor: "Lisa Thompson",
      completionDate: "2024-04-05",
      issueDate: null,
      certificateId: "CERT-2024-004",
      status: "pending",
      grade: 89,
      maxGrade: 100,
      creditsEarned: 6,
      validUntil: null,
      certificateUrl: "",
      courseImage: "/images/courses/marketing.jpg",
      skills: ["SEO", "Social Media", "Analytics", "Content Marketing"],
      type: "Course Completion"
    },
    {
      id: 5,
      title: "Project Management Professional",
      course: "Advanced Project Management",
      instructor: "Dr. James Wilson",
      completionDate: "2024-01-20",
      issueDate: "2024-01-21",
      certificateId: "CERT-2024-005",
      status: "issued",
      grade: 91,
      maxGrade: 100,
      creditsEarned: 15,
      validUntil: "2026-01-21",
      certificateUrl: "/certificates/cert-005.pdf",
      courseImage: "/images/courses/projectmgmt.jpg",
      skills: ["Agile", "Scrum", "Risk Management", "Leadership"],
      type: "Professional"
    },
    {
      id: 6,
      title: "Cloud Computing Fundamentals",
      course: "AWS Cloud Practitioner",
      instructor: "Alex Kumar",
      completionDate: "2024-03-30",
      issueDate: "2024-03-31",
      certificateId: "CERT-2024-006",
      status: "issued",
      grade: 87,
      maxGrade: 100,
      creditsEarned: 9,
      validUntil: "2025-03-31",
      certificateUrl: "/certificates/cert-006.pdf",
      courseImage: "/images/courses/cloud.jpg",
      skills: ["AWS", "Cloud Architecture", "Security", "DevOps"],
      type: "Achievement"
    }
  ], []);

  // Certificate stats
  const certificateStats = useMemo<ICertificateStats>(() => {
    const total = certificates.length;
    const issued = certificates.filter(c => c.status === "issued").length;
    const pending = certificates.filter(c => c.status === "pending").length;
    const thisMonth = certificates.filter(c => 
      moment(c.issueDate).isSame(moment(), 'month')
    ).length;
    const totalCredits = certificates
      .filter(c => c.status === "issued")
      .reduce((sum, c) => sum + c.creditsEarned, 0);

    return {
      total,
      issued,
      pending,
      thisMonth,
      totalCredits
    };
  }, [certificates]);

  // Filter certificates based on status and search
  const filteredCertificates = useMemo(() => {
    let filtered = certificates;
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(cert => cert.status === selectedStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(cert => 
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [certificates, selectedStatus, searchTerm]);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "issued":
        return {
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Issued"
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending"
        };
      case "expired":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <FileText className="w-4 h-4" />,
          label: "Expired"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <Award className="w-4 h-4" />,
          label: "Unknown"
        };
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Course Completion":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Specialization":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Professional":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Achievement":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Certificate Stats Component
  const CertificateStats = () => (
    <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex flex-nowrap items-center justify-between gap-4 sm:gap-6 overflow-x-auto">
        {/* Total Certificates */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{certificateStats.total}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">Total Certificates</div>
        </div>

        {/* Issued */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{certificateStats.issued}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Issued</div>
        </div>

        {/* Total Credits */}
        <div className="text-center flex-1 min-w-[100px]">
          <div className="text-3xl sm:text-4xl font-bold mb-1 text-yellow-200">{certificateStats.totalCredits}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap">Total Credits</div>
        </div>

        {/* This Month */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{certificateStats.thisMonth}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium whitespace-nowrap">This Month</div>
        </div>

        {/* Pending */}
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{certificateStats.pending}</div>
          <div className="text-primary-100 text-xs sm:text-sm font-medium">Pending</div>
        </div>
      </div>
    </div>
  );

  // Certificate Card Component
  const CertificateCard = ({ certificate }: { certificate: ICertificate }) => {
    const statusInfo = getStatusInfo(certificate.status);
    const isIssued = certificate.status === "issued";
    const isPending = certificate.status === "pending";

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${isPending ? 'border-yellow-200 dark:border-yellow-800' : 'border-gray-200 dark:border-gray-700'} hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(certificate.type)}`}>
                {certificate.type}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {certificate.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {certificate.course} • {certificate.instructor}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Certificate ID: {certificate.certificateId}
            </p>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Completed: {moment(certificate.completionDate).format("MMM D, YYYY")}
          </div>
          <div className="flex items-center">
            <Award className="w-3 h-3 mr-1" />
            {certificate.creditsEarned} Credits
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Grade: {certificate.grade}/{certificate.maxGrade}
          </div>
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {certificate.instructor}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Skills Acquired:</p>
          <div className="flex flex-wrap gap-1">
            {certificate.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                {skill}
              </span>
            ))}
            {certificate.skills.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                +{certificate.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Grade Display */}
        {isIssued && (
          <div className="flex items-center justify-between mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Final Grade: {certificate.grade}/{certificate.maxGrade}
              </span>
            </div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {((certificate.grade / certificate.maxGrade) * 100).toFixed(1)}%
            </div>
          </div>
        )}



        {/* Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          {isIssued && (
            <>
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Share2 className="w-4 h-4" />
              </button>
            </>
          )}
          {isPending && (
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Processing
            </button>
          )}
        </div>
      </div>
    );
  };

  // Certificate Preloader
  const CertificatePreloader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <CertificatePreloader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 lg:space-y-12 pt-8 lg:pt-12"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Certificates
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            View, download, and share your course completion certificates
          </p>
        </motion.div>



        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: "All", icon: Award },
                { key: "issued", label: "Issued", icon: CheckCircle },
                { key: "pending", label: "Pending", icon: Clock }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key as any)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStatus === key
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Certificates Grid */}
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCertificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No certificates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CertificateMain; 