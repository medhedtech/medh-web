"use client";

import React, { useState, useEffect } from 'react';
import { 
  certificateAPI, 
  ICertificateGenerationRequest, 
  ICertificateGenerationResponse,
  IDemoEnrollmentRequest,
  IDemoEnrollmentResponse,
  ICertificateStatsResponse,
  ICertificateVerificationResponse
} from '@/apis/certificate.api';
import { buildAdvancedComponent, buildComponent, getEnhancedSemanticColor } from '@/utils/designSystem';
import { 
  Award, 
  UserPlus, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  RefreshCw,
  Plus,
  Search,
  QrCode,
  Scan,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CertificateStats {
  totalCertificates: number;
  activeCertificates: number;
  expiredCertificates: number;
  revokedCertificates: number;
  recentVerifications: number;
  topCourses: Array<{
    courseId: string;
    courseName: string;
    certificateCount: number;
  }>;
  monthlyStats: Array<{
    month: string;
    issued: number;
    verified: number;
  }>;
}

const AdminCertificateManagementPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'generate' | 'demo' | 'qr' | 'verify' | 'stats'>('generate');
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<CertificateStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // Certificate Generation Form State
  const [generateForm, setGenerateForm] = useState<ICertificateGenerationRequest>({
    studentId: '',
    courseId: '',
    enrollmentId: '',
    finalScore: 85
  });
  const [generateResult, setGenerateResult] = useState<ICertificateGenerationResponse | null>(null);

  // Demo Enrollment Form State
  const [demoForm, setDemoForm] = useState<IDemoEnrollmentRequest>({
    studentData: {
      full_name: '',
      email: '',
      phone_number: '',
      age_group: '25-34',
      gender: 'prefer-not-to-say'
    },
    courseId: '',
    enrollmentType: 'individual',
    demoMode: true
  });
  const [demoResult, setDemoResult] = useState<IDemoEnrollmentResponse | null>(null);

  // QR Code Generation State
  const [qrForm, setQrForm] = useState({
    certificateId: '',
    width: 300,
    errorCorrectionLevel: 'H' as 'L' | 'M' | 'Q' | 'H',
    margin: 2
  });
  const [qrResult, setQrResult] = useState<any>(null);

  // Certificate Verification State
  const [verifyForm, setVerifyForm] = useState({
    certificateNumber: '',
    bulkCertificates: ''
  });
  const [verifyResult, setVerifyResult] = useState<ICertificateVerificationResponse | null>(null);
  const [bulkVerifyResult, setBulkVerifyResult] = useState<any>(null);

  // Design system classes
  const cardClasses = buildAdvancedComponent.glassCard({ variant: 'primary', hover: false });
  const buttonClasses = buildComponent.button('primary', 'md');
  const inputClasses = "block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

  // Load certificate statistics on component mount
  useEffect(() => {
    loadCertificateStats();
  }, []);

  const loadCertificateStats = async () => {
    setStatsLoading(true);
    try {
      const response: ICertificateStatsResponse = await certificateAPI.getCertificateStats();
      if (response.status === 'success' && response.data) {
        setStats(response.data);
      } else {
        toast.error('Failed to load certificate statistics');
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Error loading certificate statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle certificate generation
  const handleGenerateCertificate = async () => {
    if (!generateForm.studentId.trim() || !generateForm.courseId.trim()) {
      toast.error('Student ID and Course ID are required');
      return;
    }

    if (generateForm.finalScore < 0 || generateForm.finalScore > 100) {
      toast.error('Final score must be between 0 and 100');
      return;
    }

    setLoading(true);
    try {
      const response = await certificateAPI.generateCertificateId(generateForm);
      setGenerateResult(response);
      
      if (response.success) {
        toast.success('Certificate generated successfully!');
        // Refresh stats
        loadCertificateStats();
      } else {
        toast.error(response.message || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
      toast.error('An error occurred while generating the certificate');
    } finally {
      setLoading(false);
    }
  };

  // Handle demo enrollment creation
  const handleCreateDemoEnrollment = async () => {
    if (!demoForm.studentData.full_name.trim() || !demoForm.studentData.email.trim() || 
        !demoForm.studentData.phone_number.trim() || !demoForm.courseId.trim()) {
      toast.error('All required fields must be filled');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(demoForm.studentData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await certificateAPI.createDemoEnrollment(demoForm);
      setDemoResult(response);
      
      if (response.success) {
        toast.success('Demo enrollment created successfully!');
        // Reset form
        setDemoForm({
          studentData: {
            full_name: '',
            email: '',
            phone_number: '',
            age_group: '25-34',
            gender: 'prefer-not-to-say'
          },
          courseId: '',
          enrollmentType: 'individual',
          demoMode: true
        });
      } else {
        toast.error(response.message || 'Failed to create demo enrollment');
      }
    } catch (error) {
      console.error('Demo enrollment error:', error);
      toast.error('An error occurred while creating demo enrollment');
    } finally {
      setLoading(false);
    }
  };

  // Handle QR code generation
  const handleGenerateQRCode = async () => {
    if (!qrForm.certificateId.trim()) {
      toast.error('Certificate ID is required');
      return;
    }

    setLoading(true);
    try {
      const response = await certificateAPI.generateQRCodeWithOptions({
        certificateId: qrForm.certificateId,
        options: {
          width: qrForm.width,
          errorCorrectionLevel: qrForm.errorCorrectionLevel,
          margin: qrForm.margin
        }
      });
      
      setQrResult(response);
      
      if (response.success) {
        toast.success('QR code generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR code generation error:', error);
      toast.error('An error occurred while generating QR code');
    } finally {
      setLoading(false);
    }
  };

  // Handle QR code download
  const handleDownloadQRCode = async (format: 'png' | 'jpg' | 'svg' = 'png') => {
    if (!qrResult?.data?.certificateId) {
      toast.error('No QR code available to download');
      return;
    }

    try {
      const blob = await certificateAPI.downloadQRCode(qrResult.data.certificateId, format, qrForm.width);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-qr-${qrResult.data.certificateNumber}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`QR code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('QR code download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  // Handle single certificate verification
  const handleVerifyCertificate = async () => {
    if (!verifyForm.certificateNumber.trim()) {
      toast.error('Certificate number is required');
      return;
    }

    setLoading(true);
    try {
      const response = await certificateAPI.verifyCertificateByNumber(verifyForm.certificateNumber);
      setVerifyResult(response);
      
      if (response.status === 'success') {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error(response.message || 'Certificate verification failed');
      }
    } catch (error) {
      console.error('Certificate verification error:', error);
      toast.error('An error occurred while verifying certificate');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk certificate verification
  const handleBulkVerification = async () => {
    if (!verifyForm.bulkCertificates.trim()) {
      toast.error('Certificate numbers are required');
      return;
    }

    // Parse certificate numbers from textarea (one per line or comma-separated)
    const certificateNumbers = verifyForm.bulkCertificates
      .split(/[\n,]/)
      .map(num => num.trim())
      .filter(num => num.length > 0);

    if (certificateNumbers.length === 0) {
      toast.error('No valid certificate numbers found');
      return;
    }

    if (certificateNumbers.length > 50) {
      toast.error('Maximum 50 certificates can be verified at once');
      return;
    }

    setLoading(true);
    try {
      const response = await certificateAPI.verifyBulkCertificates(certificateNumbers);
      setBulkVerifyResult(response);
      
      if (response.success) {
        toast.success(`Verified ${certificateNumbers.length} certificates`);
      } else {
        toast.error(response.message || 'Bulk verification failed');
      }
    } catch (error) {
      console.error('Bulk verification error:', error);
      toast.error('An error occurred during bulk verification');
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  // Calculate grade display
  const getGradeDisplay = (score: number) => {
    const grade = certificateAPI.calculateGrade(score);
    const validation = certificateAPI.validateCertificateRequirements(score);
    
    return {
      grade,
      isValid: validation.isValid,
      color: validation.isValid ? 'text-green-600' : 'text-red-600'
    };
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Certificate Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate certificates, create demo enrollments, and view certificate statistics
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'generate', label: 'Generate Certificate', icon: Award },
              { id: 'demo', label: 'Demo Enrollment', icon: UserPlus },
              { id: 'qr', label: 'QR Code Generator', icon: QrCode },
              { id: 'verify', label: 'Verify Certificate', icon: Shield },
              { id: 'stats', label: 'Statistics', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className={`${cardClasses} p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Generate Certificate
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Student ID *</label>
                  <input
                    type="text"
                    value={generateForm.studentId}
                    onChange={(e) => setGenerateForm({ ...generateForm, studentId: e.target.value })}
                    placeholder="Enter student ID"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Course ID *</label>
                  <input
                    type="text"
                    value={generateForm.courseId}
                    onChange={(e) => setGenerateForm({ ...generateForm, courseId: e.target.value })}
                    placeholder="Enter course ID"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Enrollment ID (Optional)</label>
                  <input
                    type="text"
                    value={generateForm.enrollmentId}
                    onChange={(e) => setGenerateForm({ ...generateForm, enrollmentId: e.target.value })}
                    placeholder="Enter enrollment ID"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Final Score (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={generateForm.finalScore}
                    onChange={(e) => setGenerateForm({ ...generateForm, finalScore: Number(e.target.value) })}
                    className={inputClasses}
                  />
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade:</span>
                    <span className={`text-sm font-medium ${getGradeDisplay(generateForm.finalScore).color}`}>
                      {getGradeDisplay(generateForm.finalScore).grade}
                    </span>
                    {!getGradeDisplay(generateForm.finalScore).isValid && (
                      <span className="text-xs text-red-500">(Minimum 70% required)</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleGenerateCertificate}
                  disabled={loading}
                  className={`${buttonClasses} w-full flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Generating...' : 'Generate Certificate'}</span>
                </button>
              </div>

              {/* Result Display */}
              <div>
                {generateResult && (
                  <div className={`p-4 rounded-lg border ${
                    generateResult.success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      {generateResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <h3 className={`font-medium ${
                        generateResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {generateResult.success ? 'Certificate Generated' : 'Generation Failed'}
                      </h3>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      generateResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {generateResult.message}
                    </p>

                    {generateResult.success && generateResult.data && (
                      <div className="space-y-2 text-sm">
                        <div><strong>Certificate ID:</strong> {generateResult.data.certificateId}</div>
                        <div><strong>Certificate Number:</strong> {generateResult.data.certificateNumber}</div>
                        <div><strong>Grade:</strong> {generateResult.data.grade}</div>
                        <div><strong>Final Score:</strong> {generateResult.data.finalScore}%</div>
                        <div><strong>Issue Date:</strong> {new Date(generateResult.data.issueDate).toLocaleDateString()}</div>
                        <div className="pt-2">
                          <a
                            href={generateResult.data.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 dark:text-primary-400"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Certificate</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {generateResult.errors && generateResult.errors.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Errors:</h4>
                        <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                          {generateResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'demo' && (
        <div className="space-y-6">
          <div className={`${cardClasses} p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <UserPlus className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create Demo Enrollment
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Student Full Name *</label>
                  <input
                    type="text"
                    value={demoForm.studentData.full_name}
                    onChange={(e) => setDemoForm({
                      ...demoForm,
                      studentData: { ...demoForm.studentData, full_name: e.target.value }
                    })}
                    placeholder="Enter student full name"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Email Address *</label>
                  <input
                    type="email"
                    value={demoForm.studentData.email}
                    onChange={(e) => setDemoForm({
                      ...demoForm,
                      studentData: { ...demoForm.studentData, email: e.target.value }
                    })}
                    placeholder="Enter email address"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Phone Number *</label>
                  <input
                    type="tel"
                    value={demoForm.studentData.phone_number}
                    onChange={(e) => setDemoForm({
                      ...demoForm,
                      studentData: { ...demoForm.studentData, phone_number: e.target.value }
                    })}
                    placeholder="Enter phone number"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Course ID *</label>
                  <input
                    type="text"
                    value={demoForm.courseId}
                    onChange={(e) => setDemoForm({ ...demoForm, courseId: e.target.value })}
                    placeholder="Enter course ID"
                    className={inputClasses}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Age Group</label>
                    <select
                      value={demoForm.studentData.age_group}
                      onChange={(e) => setDemoForm({
                        ...demoForm,
                        studentData: { ...demoForm.studentData, age_group: e.target.value }
                      })}
                      className={inputClasses}
                    >
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55+">55+</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClasses}>Gender</label>
                    <select
                      value={demoForm.studentData.gender}
                      onChange={(e) => setDemoForm({
                        ...demoForm,
                        studentData: { ...demoForm.studentData, gender: e.target.value }
                      })}
                      className={inputClasses}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Enrollment Type</label>
                  <select
                    value={demoForm.enrollmentType}
                    onChange={(e) => setDemoForm({ ...demoForm, enrollmentType: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                    <option value="group">Group</option>
                  </select>
                </div>

                <button
                  onClick={handleCreateDemoEnrollment}
                  disabled={loading}
                  className={`${buttonClasses} w-full flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Creating...' : 'Create Demo Enrollment'}</span>
                </button>
              </div>

              {/* Result Display */}
              <div>
                {demoResult && (
                  <div className={`p-4 rounded-lg border ${
                    demoResult.success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      {demoResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <h3 className={`font-medium ${
                        demoResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {demoResult.success ? 'Demo Enrollment Created' : 'Creation Failed'}
                      </h3>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      demoResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {demoResult.message}
                    </p>

                    {demoResult.success && demoResult.data && (
                      <div className="space-y-2 text-sm">
                        <div><strong>Enrollment ID:</strong> {demoResult.data.enrollment.id}</div>
                        <div><strong>Student ID:</strong> {demoResult.data.student.id}</div>
                        <div><strong>Student Name:</strong> {demoResult.data.student.name}</div>
                        <div><strong>Course:</strong> {demoResult.data.course.title}</div>
                        <div><strong>Status:</strong> {demoResult.data.enrollment.status}</div>
                        <div><strong>Enrollment Date:</strong> {new Date(demoResult.data.enrollment.enrollmentDate).toLocaleDateString()}</div>
                        
                        {demoResult.data.nextSteps && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Next Steps:</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                              {demoResult.data.nextSteps.message}
                            </p>
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              <strong>Required fields for certificate generation:</strong>
                              <ul className="list-disc list-inside mt-1">
                                {demoResult.data.nextSteps.requiredFields.map((field, index) => (
                                  <li key={index}>{field}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Generator Tab */}
      {activeTab === 'qr' && (
        <div className="space-y-6">
          <div className={`${cardClasses} p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <QrCode className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                QR Code Generator
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Generation Form */}
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Certificate ID / Number *</label>
                  <input
                    type="text"
                    value={qrForm.certificateId}
                    onChange={(e) => setQrForm({ ...qrForm, certificateId: e.target.value })}
                    placeholder="Enter certificate ID or number"
                    className={inputClasses}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Width (px)</label>
                    <input
                      type="number"
                      min="50"
                      max="2000"
                      value={qrForm.width}
                      onChange={(e) => setQrForm({ ...qrForm, width: Number(e.target.value) })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Error Correction</label>
                    <select
                      value={qrForm.errorCorrectionLevel}
                      onChange={(e) => setQrForm({ ...qrForm, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                      className={inputClasses}
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Margin</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={qrForm.margin}
                    onChange={(e) => setQrForm({ ...qrForm, margin: Number(e.target.value) })}
                    className={inputClasses}
                  />
                </div>

                <button
                  onClick={handleGenerateQRCode}
                  disabled={loading}
                  className={`${buttonClasses} w-full flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <QrCode className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Generating...' : 'Generate QR Code'}</span>
                </button>
              </div>

              {/* QR Code Display */}
              <div>
                {qrResult && (
                  <div className={`p-4 rounded-lg border ${
                    qrResult.success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      {qrResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <h3 className={`font-medium ${
                        qrResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {qrResult.success ? 'QR Code Generated' : 'Generation Failed'}
                      </h3>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      qrResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {qrResult.message}
                    </p>

                    {qrResult.success && qrResult.data && (
                      <div className="space-y-4">
                        {/* QR Code Image */}
                        <div className="flex justify-center">
                          <img 
                            src={qrResult.data.qrCode} 
                            alt="Certificate QR Code"
                            className="border border-gray-300 rounded-lg"
                            style={{ width: qrForm.width, height: qrForm.width }}
                          />
                        </div>

                        {/* Certificate Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <strong>Certificate Number:</strong>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono">{qrResult.data.certificateNumber}</span>
                              <button
                                onClick={() => copyToClipboard(qrResult.data.certificateNumber, 'Certificate number')}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <strong>Verification URL:</strong>
                            <div className="flex items-center space-x-2">
                              <a 
                                href={qrResult.data.verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <span className="text-xs">Open</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => copyToClipboard(qrResult.data.verificationUrl, 'Verification URL')}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Download Options */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={() => handleDownloadQRCode('png')}
                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>PNG</span>
                          </button>
                          <button
                            onClick={() => handleDownloadQRCode('jpg')}
                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>JPG</span>
                          </button>
                          <button
                            onClick={() => handleDownloadQRCode('svg')}
                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>SVG</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Verification Tab */}
      {activeTab === 'verify' && (
        <div className="space-y-6">
          <div className={`${cardClasses} p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Certificate Verification
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Single Certificate Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Scan className="w-5 h-5" />
                  <span>Single Certificate Verification</span>
                </h3>
                
                <div>
                  <label className={labelClasses}>Certificate Number *</label>
                  <input
                    type="text"
                    value={verifyForm.certificateNumber}
                    onChange={(e) => setVerifyForm({ ...verifyForm, certificateNumber: e.target.value })}
                    placeholder="Enter certificate number (e.g., MEDH-CERT-2024-ABC12345)"
                    className={inputClasses}
                  />
                </div>

                <button
                  onClick={handleVerifyCertificate}
                  disabled={loading}
                  className={`${buttonClasses} w-full flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Verifying...' : 'Verify Certificate'}</span>
                </button>

                {/* Single Verification Result */}
                {verifyResult && (
                  <div className={`p-4 rounded-lg border ${
                    verifyResult.status === 'success'
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      {verifyResult.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <h4 className={`font-medium ${
                        verifyResult.status === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {verifyResult.status === 'success' ? 'Certificate Valid' : 'Verification Failed'}
                      </h4>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      verifyResult.status === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {verifyResult.message}
                    </p>

                    {verifyResult.status === 'success' && verifyResult.data && (
                      <div className="space-y-2 text-sm">
                        <div><strong>Certificate Number:</strong> {verifyResult.data.certificateNumber}</div>
                        <div><strong>Issue Date:</strong> {new Date(verifyResult.data.issueDate).toLocaleDateString()}</div>
                        <div><strong>Grade:</strong> {verifyResult.data.grade}</div>
                        <div><strong>Final Score:</strong> {verifyResult.data.finalScore}%</div>
                        <div><strong>Status:</strong> <span className="capitalize">{verifyResult.data.status}</span></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bulk Certificate Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Bulk Verification</span>
                </h3>
                
                <div>
                  <label className={labelClasses}>Certificate Numbers (max 50) *</label>
                  <textarea
                    value={verifyForm.bulkCertificates}
                    onChange={(e) => setVerifyForm({ ...verifyForm, bulkCertificates: e.target.value })}
                    placeholder="Enter certificate numbers, one per line or comma-separated"
                    rows={6}
                    className={inputClasses}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter up to 50 certificate numbers separated by new lines or commas
                  </p>
                </div>

                <button
                  onClick={handleBulkVerification}
                  disabled={loading}
                  className={`${buttonClasses} w-full flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Verifying...' : 'Bulk Verify'}</span>
                </button>

                {/* Bulk Verification Results */}
                {bulkVerifyResult && (
                  <div className={`p-4 rounded-lg border ${
                    bulkVerifyResult.success
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      {bulkVerifyResult.success ? (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <h4 className={`font-medium ${
                        bulkVerifyResult.success ? 'text-blue-800 dark:text-blue-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        Bulk Verification Results
                      </h4>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      bulkVerifyResult.success ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {bulkVerifyResult.message}
                    </p>

                    {bulkVerifyResult.success && bulkVerifyResult.data && (
                      <div className="space-y-4">
                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {bulkVerifyResult.data.summary.total}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                            <div className="text-lg font-bold text-green-700 dark:text-green-300">
                              {bulkVerifyResult.data.summary.valid}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">Valid</div>
                          </div>
                          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                            <div className="text-lg font-bold text-red-700 dark:text-red-300">
                              {bulkVerifyResult.data.summary.invalid}
                            </div>
                            <div className="text-xs text-red-600 dark:text-red-400">Invalid</div>
                          </div>
                        </div>

                        {/* Results List */}
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {bulkVerifyResult.data.results.map((result: any, index: number) => (
                            <div 
                              key={index}
                              className={`p-3 rounded-lg border ${
                                result.isValid
                                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-sm">{result.certificateNumber}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  result.isValid
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                }`}>
                                  {result.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {result.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Certificate Statistics
              </h2>
            </div>
            <button
              onClick={loadCertificateStats}
              disabled={statsLoading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className={`${cardClasses} p-6`}>
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Certificates</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCertificates}</p>
                  </div>
                </div>
              </div>

              <div className={`${cardClasses} p-6`}>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Certificates</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeCertificates}</p>
                  </div>
                </div>
              </div>

              <div className={`${cardClasses} p-6`}>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Verifications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.recentVerifications}</p>
                  </div>
                </div>
              </div>

              <div className={`${cardClasses} p-6`}>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired/Revoked</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.expiredCertificates + stats.revokedCertificates}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Courses */}
              {stats.topCourses && stats.topCourses.length > 0 && (
                <div className={`${cardClasses} p-6 md:col-span-2`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Top Courses by Certificates</h3>
                  <div className="space-y-3">
                    {stats.topCourses.slice(0, 5).map((course, index) => (
                      <div key={course.courseId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {course.courseName}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {course.certificateCount} certificates
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Stats */}
              {stats.monthlyStats && stats.monthlyStats.length > 0 && (
                <div className={`${cardClasses} p-6 md:col-span-2`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Monthly Activity</h3>
                  <div className="space-y-3">
                    {stats.monthlyStats.slice(-6).map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {month.month}
                        </span>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600 dark:text-green-400">
                            {month.issued} issued
                          </span>
                          <span className="text-blue-600 dark:text-blue-400">
                            {month.verified} verified
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`${cardClasses} p-12 text-center`}>
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Statistics Available</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Unable to load certificate statistics at this time.
              </p>
              <button
                onClick={loadCertificateStats}
                className={buttonClasses}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCertificateManagementPage; 