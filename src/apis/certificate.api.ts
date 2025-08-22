import { apiClient } from './apiClient';
import { apiBaseUrl } from './config';

// Certificate verification types
export interface ICertificateVerificationRequest {
  certificateId: string;
  additionalInfo?: {
    studentName?: string;
    courseName?: string;
    issueDate?: string;
  };
}

export interface ICertificateVerificationResponse {
  status: 'success' | 'error';
  data?: IVerifiedCertificate;
  message: string;
}

export interface IVerifiedCertificate {
  _id: string;
  certificateId: string;
  isValid: boolean;
  isActive: boolean;
  student: {
    _id: string;
    full_name: string;
    email: string;
    profile_picture?: string;
  };
  course: {
    _id: string;
    course_title: string;
    course_image?: string;
    category: string;
    duration: string;
    instructor?: {
      full_name: string;
      profile_picture?: string;
    };
  };
  issueDate: string;
  completionDate: string;
  validUntil?: string;
  grade?: string;
  score?: number;
  certificateUrl: string;
  verificationDetails: {
    verifiedAt: string;
    verificationMethod: 'id' | 'qr_code' | 'blockchain';
    digitalSignature?: string;
    blockchainHash?: string;
  };
  additionalInfo?: {
    courseDuration: string;
    skillsAcquired: string[];
    certificateType: 'completion' | 'achievement' | 'professional';
    accreditation?: {
      body: string;
      accreditationNumber: string;
    };
  };
}

// Real API response format
export interface IRealCertificateResponse {
  success: boolean;
  message: string;
  data: {
    isValid: boolean;
    certificate: {
      id: string;
      certificateNumber: string;
      issueDate: string;
      status: string;
      grade: string;
      finalScore: number;
      completionDate: string;
    };
    student: {
      id: string;
      name: string;
      email: string;
    };
    course: {
      id: string;
      title: string;
      description?: {
        program_overview?: string;
        benefits?: string;
        learning_objectives?: string[];
        course_requirements?: string[];
        target_audience?: string[];
      };
    };
    enrollment?: null;
    metadata: {
      issuedBy: string;
      issuerTitle: string;
      verificationDate: string;
    };
  };
}

export interface ICertificateSearchRequest {
  query: string;
  searchType: 'id' | 'student_name' | 'course_name' | 'email';
  filters?: {
    courseCategory?: string;
    issueDate?: {
      from: string;
      to: string;
    };
    status?: 'active' | 'expired' | 'revoked';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface ICertificateSearchResponse {
  status: 'success' | 'error';
  data?: {
    certificates: IVerifiedCertificate[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalResults: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
}

export interface ICertificateStatsResponse {
  status: 'success' | 'error';
  data?: {
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
  };
  message: string;
}

// ============================================================================
// NEW: Certificate ID Generation Types
// ============================================================================

export interface ICertificateGenerationRequest {
  studentId: string;
  courseId: string;
  enrollmentId?: string;
  finalScore: number;
}

export interface ICertificateGenerationResponse {
  success: boolean;
  message: string;
  data?: {
    certificateId: string;
    certificateNumber: string;
    verificationUrl: string;
    grade: string;
    finalScore: number;
    issueDate: string;
    student: {
      id: string;
      name: string;
      email: string;
    };
    course: {
      id: string;
      title: string;
      instructor: string;
    };
  };
  errors?: string[];
  certificate?: {
    id: string;
    certificateNumber: string;
    verificationUrl: string;
  };
}

// ============================================================================
// NEW: Demo Student Enrollment Types
// ============================================================================

export interface IDemoStudentData {
  full_name: string;
  email: string;
  phone_number: string;
  age_group?: string;
  gender?: string;
}

export interface IDemoPaymentData {
  amount?: number;
  payment_method?: string;
  transaction_id?: string;
}

export interface IDemoEnrollmentRequest {
  studentData: IDemoStudentData;
  courseId: string;
  enrollmentType?: string;
  paymentData?: IDemoPaymentData;
  demoMode?: boolean;
}

export interface IDemoEnrollmentResponse {
  success: boolean;
  message: string;
  data?: {
    enrollment: {
      id: string;
      status: string;
      enrollmentDate: string;
      accessExpiryDate: string;
      enrollmentType: string;
      progress: {
        overall_percentage: number;
        lessons_completed: number;
        last_activity_date: string;
      };
    };
    student: {
      id: string;
      name: string;
      email: string;
      phone: string;
      isDemo: boolean;
    };
    course: {
      id: string;
      title: string;
      description: string;
      price: number;
      currency: string;
    };
    nextSteps: {
      message: string;
      generateCertificateEndpoint: string;
      requiredFields: string[];
    };
  };
}

// Transform real API response to expected format
export const transformCertificateResponse = (realResponse: IRealCertificateResponse): IVerifiedCertificate => {
  const { data } = realResponse;
  
  return {
    _id: data.certificate.id,
    certificateId: data.certificate.certificateNumber,
    isValid: data.isValid,
    isActive: data.certificate.status === 'active',
    student: {
      _id: data.student.id,
      full_name: data.student.name,
      email: data.student.email,
      profile_picture: undefined
    },
    course: {
      _id: data.course.id,
      course_title: data.course.title,
      course_image: undefined,
      category: 'General',
      duration: 'N/A',
      instructor: undefined
    },
    issueDate: data.certificate.issueDate,
    completionDate: data.certificate.completionDate,
    validUntil: undefined,
    grade: data.certificate.grade,
    score: data.certificate.finalScore,
    certificateUrl: '',
    verificationDetails: {
      verifiedAt: data.metadata.verificationDate,
      verificationMethod: 'id',
      digitalSignature: undefined,
      blockchainHash: undefined
    },
    additionalInfo: {
      courseDuration: 'N/A',
      skillsAcquired: [],
      certificateType: 'completion',
      accreditation: {
        body: data.metadata.issuedBy,
        accreditationNumber: data.certificate.certificateNumber
      }
    }
  };
};

// Certificate verification API
export const certificateAPI = {
  /**
   * Verify a certificate by ID
   * @param certificateId - The certificate ID to verify
   * @param additionalInfo - Optional additional information for verification
   */
  verifyCertificate: async (
    certificateId: string,
    additionalInfo?: ICertificateVerificationRequest['additionalInfo']
  ): Promise<ICertificateVerificationResponse> => {
    if (!certificateId?.trim()) {
      return {
        status: 'error',
        message: 'Certificate ID is required'
      };
    }

    try {
      const response = await apiClient.post('/certificates/verify', {
        certificateId: certificateId.trim(),
        additionalInfo
      });

      return {
        status: 'success',
        data: response.data.certificate,
        message: response.data.message || 'Certificate verified successfully'
      };
    } catch (error: any) {
      console.error('Certificate verification error:', error);
      
      if (error.response?.status === 404) {
        return {
          status: 'error',
          message: 'Certificate not found. Please check the certificate ID and try again.'
        };
      }
      
      if (error.response?.status === 400) {
        return {
          status: 'error',
          message: error.response.data?.message || 'Invalid certificate ID format'
        };
      }
      
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to verify certificate. Please try again.'
      };
    }
  },

  /**
   * Search certificates by various criteria
   * @param searchRequest - Search parameters
   */
  searchCertificates: async (
    searchRequest: ICertificateSearchRequest
  ): Promise<ICertificateSearchResponse> => {
    if (!searchRequest.query?.trim()) {
      return {
        status: 'error',
        message: 'Search query is required'
      };
    }

    try {
      const response = await apiClient.post('/certificates/search', searchRequest);

      return {
        status: 'success',
        data: response.data,
        message: 'Search completed successfully'
      };
    } catch (error: any) {
      console.error('Certificate search error:', error);
      
      return {
        status: 'error',
        message: error.response?.data?.message || 'Search failed. Please try again.'
      };
    }
  },

  /**
   * Get certificate verification statistics (admin only)
   */
  getCertificateStats: async (): Promise<ICertificateStatsResponse> => {
    try {
      const response = await apiClient.get('/certificates/stats');

      return {
        status: 'success',
        data: response.data,
        message: 'Statistics retrieved successfully'
      };
    } catch (error: any) {
      console.error('Certificate stats error:', error);
      
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to retrieve statistics'
      };
    }
  },

  /**
   * Verify certificate by QR code
   * @param qrCodeData - The QR code data
   */
  verifyByQRCode: async (qrCodeData: string): Promise<ICertificateVerificationResponse> => {
    if (!qrCodeData?.trim()) {
      return {
        status: 'error',
        message: 'QR code data is required'
      };
    }

    try {
      const response = await apiClient.post('/certificates/verify-qr', {
        qrCodeData: qrCodeData.trim()
      });

      return {
        status: 'success',
        data: response.data.certificate,
        message: response.data.message || 'Certificate verified successfully via QR code'
      };
    } catch (error: any) {
      console.error('QR code verification error:', error);
      
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to verify certificate via QR code'
      };
    }
  },

  /**
   * Download certificate PDF
   * @param certificateId - The certificate ID
   */
  downloadCertificate: async (certificateId: string): Promise<Blob> => {
    if (!certificateId?.trim()) {
      throw new Error('Certificate ID is required');
    }

    try {
      const response = await apiClient.get(`/certificates/${certificateId}/download`, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error: any) {
      console.error('Certificate download error:', error);
      throw new Error(error.response?.data?.message || 'Failed to download certificate');
    }
  },

  /**
   * Report a fraudulent certificate
   * @param certificateId - The certificate ID to report
   * @param reason - Reason for reporting
   * @param reporterInfo - Reporter information
   */
  reportFraudulentCertificate: async (
    certificateId: string,
    reason: string,
    reporterInfo?: {
      name?: string;
      email?: string;
      organization?: string;
    }
  ): Promise<{ status: 'success' | 'error'; message: string }> => {
    if (!certificateId?.trim() || !reason?.trim()) {
      return {
        status: 'error',
        message: 'Certificate ID and reason are required'
      };
    }

    try {
      const response = await apiClient.post('/certificates/report-fraud', {
        certificateId: certificateId.trim(),
        reason: reason.trim(),
        reporterInfo
      });

      return {
        status: 'success',
        message: response.data.message || 'Report submitted successfully'
      };
    } catch (error: any) {
      console.error('Fraud report error:', error);
      
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to submit report'
      };
    }
  },

  // ============================================================================
  // NEW: Certificate ID Generation API
  // ============================================================================

  /**
   * Generate Certificate ID for a completed course enrollment
   * @param request - Certificate generation request parameters
   */
  generateCertificateId: async (
    request: ICertificateGenerationRequest
  ): Promise<ICertificateGenerationResponse> => {
    // Validate required fields
    if (!request.studentId?.trim() || !request.courseId?.trim() || typeof request.finalScore !== 'number') {
      return {
        success: false,
        message: 'Student ID, Course ID, and Final Score are required'
      };
    }

    // Validate score range
    if (request.finalScore < 0 || request.finalScore > 100) {
      return {
        success: false,
        message: 'Final score must be a number between 0 and 100'
      };
    }

    try {
      const response = await apiClient.post('/certificates/generate-id', {
        studentId: request.studentId.trim(),
        courseId: request.courseId.trim(),
        enrollmentId: request.enrollmentId?.trim(),
        finalScore: request.finalScore
      });

      return {
        success: true,
        message: response.data.message || 'Certificate ID generated successfully',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Certificate ID generation error:', error);
      
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || 'Invalid request parameters',
          errors: error.response.data?.errors
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: error.response.data?.message || 'Enrollment not found for the given student and course'
        };
      }
      
      if (error.response?.status === 409) {
        return {
          success: false,
          message: error.response.data?.message || 'Certificate already exists for this enrollment',
          certificate: error.response.data?.certificate
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate certificate ID. Please try again.'
      };
    }
  },

  // ============================================================================
  // NEW: Demo Student Enrollment API
  // ============================================================================

  /**
   * Create Demo Student Enrollment for testing certificate generation
   * @param request - Demo enrollment request parameters
   */
  createDemoEnrollment: async (
    request: IDemoEnrollmentRequest
  ): Promise<IDemoEnrollmentResponse> => {
    // Validate required fields
    if (!request.studentData || !request.courseId?.trim()) {
      return {
        success: false,
        message: 'Student data and Course ID are required'
      };
    }

    // Validate student data
    const requiredStudentFields = ['full_name', 'email', 'phone_number'];
    const missingFields = requiredStudentFields.filter(field => 
      !request.studentData[field as keyof IDemoStudentData]?.trim()
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required student fields: ${missingFields.join(', ')}`
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.studentData.email)) {
      return {
        success: false,
        message: 'Invalid email format'
      };
    }

    try {
      const response = await apiClient.post('/certificates/demo-enrollment', {
        studentData: {
          full_name: request.studentData.full_name.trim(),
          email: request.studentData.email.trim(),
          phone_number: request.studentData.phone_number.trim(),
          age_group: request.studentData.age_group || '25-34',
          gender: request.studentData.gender || 'prefer-not-to-say'
        },
        courseId: request.courseId.trim(),
        enrollmentType: request.enrollmentType || 'individual',
        paymentData: request.paymentData,
        demoMode: request.demoMode !== false // Default to true
      });

      return {
        success: true,
        message: response.data.message || 'Demo enrollment created successfully',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Demo enrollment creation error:', error);
      
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || 'Invalid request parameters'
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Course not found'
        };
      }
      
      if (error.response?.status === 409) {
        return {
          success: false,
          message: error.response.data?.message || 'Student is already enrolled in this course'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create demo enrollment. Please try again.'
      };
    }
  },

  // ============================================================================
// NEW: QR Code Generation and Verification APIs
// ============================================================================

/**
 * Verify a single certificate by certificate number
 * @param certificateNumber - The certificate number to verify
 */
verifyCertificateByNumber: async (certificateNumber: string): Promise<ICertificateVerificationResponse> => {
  if (!certificateNumber?.trim()) {
    return {
      status: 'error',
      message: 'Certificate number is required'
    };
  }

  try {
    const response = await apiClient.get(`/certificates/verify/${certificateNumber.trim()}`);

    console.log('API Response for certificate verification:', response.data);

    // Handle the case where API returns {"success":false,"message":"Certificate not found","isValid":false}
    // This might come as a successful HTTP response (200 status) rather than an error
    if (response.data.success === false || response.data.isValid === false) {
      return {
        status: 'error',
        message: response.data.message || 'Certificate not found'
      };
    }

    // Handle successful response - check for the real API format first
    if (response.data.success === true && response.data.data) {
      // Return the raw response data so the component can transform it
      return response.data as any;
    } else if (response.data.status === 'success' && response.data.data) {
      // Handle old format
      return {
        status: 'success',
        data: response.data.data,
        message: response.data.message || 'Certificate verified successfully'
      };
    } else {
      // Handle case where API returns success but no certificate data
      return {
        status: 'error',
        message: response.data.message || 'Certificate verification failed'
      };
    }
  } catch (error: any) {
    console.error('Certificate verification error:', error);
    
    // Handle the specific API response format in error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.success === false || errorData.isValid === false) {
        return {
          status: 'error',
          message: errorData.message || 'Certificate not found'
        };
      }
    }
    
    // Handle HTTP status codes
    if (error.response?.status === 404) {
      return {
        status: 'error',
        message: 'Certificate not found. Please check the certificate number and try again.'
      };
    }
    
    if (error.response?.status === 400) {
      return {
        status: 'error',
        message: 'Invalid certificate number format. Please check and try again.'
      };
    }
    
    if (error.response?.status === 500) {
      return {
        status: 'error',
        message: 'Server error. Please try again later.'
      };
    }
    
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to verify certificate. Please try again.'
    };
  }
},

/**
 * Bulk verify multiple certificates
 * @param certificateNumbers - Array of certificate numbers (max 50)
 */
verifyBulkCertificates: async (certificateNumbers: string[]): Promise<{
  success: boolean;
  message: string;
  data?: {
    summary: { total: number; valid: number; invalid: number };
    results: Array<{
      certificateNumber: string;
      isValid: boolean;
      status: string;
      message: string;
      data?: any;
    }>;
  };
}> => {
  if (!certificateNumbers || certificateNumbers.length === 0) {
    return {
      success: false,
      message: 'Certificate numbers are required'
    };
  }

  if (certificateNumbers.length > 50) {
    return {
      success: false,
      message: 'Maximum 50 certificates can be verified at once'
    };
  }

  try {
    const response = await apiClient.post('/certificates/verify-bulk', {
      certificateNumbers: certificateNumbers.map(num => num.trim())
    });

    return {
      success: true,
      message: response.data.message || `Verified ${certificateNumbers.length} certificates`,
      data: response.data.data
    };
  } catch (error: any) {
    console.error('Bulk certificate verification error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to verify certificates. Please try again.'
    };
  }
},

/**
 * Generate QR code for a certificate (GET method)
 * @param certificateId - Certificate ID, MongoDB ObjectId, or certificate number
 */
generateQRCode: async (certificateId: string): Promise<{
  success: boolean;
  message: string;
  data?: {
    qrCode: string;
    verificationUrl: string;
    certificateId: string;
    certificateNumber: string;
    format: string;
    certificate?: any;
  };
}> => {
  if (!certificateId?.trim()) {
    return {
      success: false,
      message: 'Certificate ID is required'
    };
  }

  try {
    const response = await apiClient.get(`/certificates/${certificateId.trim()}/qr-code`);

    return {
      success: true,
      message: response.data.message || 'QR code generated successfully',
      data: response.data.data
    };
  } catch (error: any) {
    console.error('QR code generation error:', error);
    
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Certificate not found'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to generate QR code. Please try again.'
    };
  }
},

/**
 * Generate QR code with custom options (POST method)
 * @param request - QR code generation request with options
 */
generateQRCodeWithOptions: async (request: {
  certificateId?: string;
  certificateNumber?: string;
  verificationUrl?: string;
  options?: {
    width?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
  };
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    qrCode: string;
    verificationUrl: string;
    certificateId: string;
    certificateNumber: string;
    format: string;
    certificate?: any;
  };
}> => {
  if (!request.certificateId && !request.certificateNumber) {
    return {
      success: false,
      message: 'Certificate ID or certificate number is required'
    };
  }

  try {
    const response = await apiClient.post('/certificates/generate-qr-code', request);

    return {
      success: true,
      message: response.data.message || 'QR code generated successfully',
      data: response.data.data
    };
  } catch (error: any) {
    console.error('QR code generation with options error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to generate QR code. Please try again.'
    };
  }
},

/**
 * Download QR code as image file
 * @param certificateId - Certificate ID
 * @param format - Image format (png, jpg, svg)
 * @param width - Image width in pixels
 */
downloadQRCode: async (
  certificateId: string, 
  format: 'png' | 'jpg' | 'svg' = 'png', 
  width: number = 300
): Promise<Blob> => {
  if (!certificateId?.trim()) {
    throw new Error('Certificate ID is required');
  }

  try {
    const response = await apiClient.get(
      `/certificates/${certificateId.trim()}/qr-code/download?format=${format}&width=${width}`,
      { responseType: 'blob' }
    );

    return response.data;
  } catch (error: any) {
    console.error('QR code download error:', error);
    throw new Error(error.response?.data?.message || 'Failed to download QR code');
  }
},

/**
 * Create enhanced demo enrollment with more options
 * @param request - Enhanced demo enrollment request
 */
createEnhancedDemoEnrollment: async (request: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseDuration?: string;
  finalScore: number;
  completionDate?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    enrollment: any;
    student: any;
    course: any;
    certificateEligible: boolean;
    nextSteps: {
      generateCertificateId: string;
      generateQRCode: string;
    };
  };
}> => {
  // Validate required fields
  if (!request.studentName?.trim() || !request.studentEmail?.trim() || 
      !request.courseTitle?.trim() || typeof request.finalScore !== 'number') {
    return {
      success: false,
      message: 'Student name, email, course title, and final score are required'
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.studentEmail)) {
    return {
      success: false,
      message: 'Invalid email format'
    };
  }

  // Validate score range
  if (request.finalScore < 0 || request.finalScore > 100) {
    return {
      success: false,
      message: 'Final score must be between 0 and 100'
    };
  }

  try {
    const response = await apiClient.post('/certificates/demo-enrollment', {
      studentName: request.studentName.trim(),
      studentEmail: request.studentEmail.trim(),
      courseTitle: request.courseTitle.trim(),
      courseDuration: request.courseDuration || '30 days',
      finalScore: request.finalScore,
      completionDate: request.completionDate || new Date().toISOString()
    });

    return {
      success: true,
      message: response.data.message || 'Demo enrollment created successfully',
      data: response.data.data
    };
  } catch (error: any) {
    console.error('Enhanced demo enrollment creation error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create demo enrollment. Please try again.'
    };
  }
},

// ============================================================================
// NEW: Utility Functions
// ============================================================================

/**
 * Calculate grade based on final score
 * @param finalScore - Score percentage (0-100)
 */
calculateGrade: (finalScore: number): string => {
  if (finalScore >= 97) return 'A+';
  if (finalScore >= 93) return 'A';
  if (finalScore >= 90) return 'A-';
  if (finalScore >= 87) return 'B+';
  if (finalScore >= 83) return 'B';
  if (finalScore >= 80) return 'B-';
  if (finalScore >= 77) return 'C+';
  if (finalScore >= 73) return 'C';
  if (finalScore >= 70) return 'C-';
  if (finalScore >= 60) return 'D';
  return 'F';
},

/**
 * Validate certificate requirements
 * @param finalScore - Final score percentage
 */
validateCertificateRequirements: (finalScore: number): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (finalScore < 70) {
    errors.push('Minimum score of 70% required for certificate');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
},

/**
 * Generate verification URL
 * @param certificateNumber - Certificate number
 */
generateVerificationUrl: (certificateNumber: string): string => {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://medh.edu.in';
  return `${frontendUrl}/verify-certificate/${certificateNumber}`;
},

/**
 * Get QR code style options
 * @param style - QR code style type
 */
getQRCodeOptions: (style: 'certificate' | 'verification' | 'general' = 'general') => {
  const styles = {
    certificate: {
      width: 300,
      errorCorrectionLevel: 'H' as const,
      margin: 2,
      color: '#1a365d'
    },
    verification: {
      width: 200,
      errorCorrectionLevel: 'M' as const,
      margin: 1,
      color: '#000000'
    },
    general: {
      width: 256,
      errorCorrectionLevel: 'M' as const,
      margin: 1,
      color: '#000000'
    }
  };
  
  return styles[style];
},

// ============================================================================
// DEMO CERTIFICATE FUNCTIONS
// ============================================================================

/**
 * Generate demo certificate
 * @param certificateData - Certificate generation data
 */
generateDemoCertificate: async (certificateData: {
  student_id: string;
  course_id: string;
  enrollment_id: string;
  course_name: string;
  full_name: string;
  instructor_name?: string;
  date?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    certificate: any;
    pdfUrl: string;
    certificateId: string;
    verificationUrl: string;
  };
}> => {
  try {
    const response = await apiClient.post('/certificates/demo', certificateData);

    return {
      success: true,
      message: response.data.message || 'Demo certificate generated successfully',
      data: response.data.data
    };
  } catch (error: any) {
    console.error('Demo certificate generation error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || 'Failed to generate demo certificate. Please try again.'
    };
  }
},

/**
 * Download demo certificate PDF
 * @param certificateId - Certificate ID to download
 */
downloadDemoCertificate: async (certificateId: string): Promise<{
  success: boolean;
  message: string;
  data?: Blob;
}> => {
  try {
    const response = await apiClient.get(`/certificates/demo/download/${certificateId}`, {
      responseType: 'blob'
    });

    return {
      success: true,
      message: 'Certificate downloaded successfully',
      data: response.data
    };
  } catch (error: any) {
    console.error('Demo certificate download error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to download certificate. Please try again.'
    };
  }
},

/**
 * Download demo certificate PDF with automatic file save
 * @param certificateId - Certificate ID to download
 * @param fileName - Optional custom filename
 */
downloadAndSaveDemoCertificate: async (certificateId: string, fileName?: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const result = await certificateAPI.downloadDemoCertificate(certificateId);
    
    if (!result.success || !result.data) {
      return {
        success: false,
        message: result.message
      };
    }

    // Create download link
    const url = window.URL.createObjectURL(result.data);
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename
    if (fileName) {
      link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    } else {
      link.download = `MEDH-Certificate-${certificateId}.pdf`;
    }
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'Certificate downloaded successfully'
    };
  } catch (error: any) {
    console.error('Certificate download and save error:', error);
    
    return {
      success: false,
      message: 'Failed to download certificate. Please try again.'
    };
  }
}
};

// Certificate verification URLs for direct access
export const certificateVerificationUrls = {
  verify: `${apiBaseUrl}/certificates/verify`,
  search: `${apiBaseUrl}/certificates/search`,
  stats: `${apiBaseUrl}/certificates/stats`,
  verifyQR: `${apiBaseUrl}/certificates/verify-qr`,
  download: (certificateId: string) => `${apiBaseUrl}/certificates/${certificateId}/download`,
  reportFraud: `${apiBaseUrl}/certificates/report-fraud`,
  // New endpoints
  generateId: `${apiBaseUrl}/certificates/generate-id`,
  demoEnrollment: `${apiBaseUrl}/certificates/demo-enrollment`,
  // QR Code and Verification endpoints
  verifyByNumber: (certificateNumber: string) => `${apiBaseUrl}/certificates/verify/${certificateNumber}`,
  verifyBulk: `${apiBaseUrl}/certificates/verify-bulk`,
  generateQRCode: (certificateId: string) => `${apiBaseUrl}/certificates/${certificateId}/qr-code`,
  generateQRCodePost: `${apiBaseUrl}/certificates/generate-qr-code`,
  downloadQRCode: (certificateId: string, format: string = 'png', width: number = 300) => 
    `${apiBaseUrl}/certificates/${certificateId}/qr-code/download?format=${format}&width=${width}`,
  enhancedDemoEnrollment: `${apiBaseUrl}/certificates/demo-enrollment`
};

export default certificateAPI; 