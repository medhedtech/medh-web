// Student related interfaces
export interface IPhoneNumber {
  country: string;
  number: string;
}

export interface IStudentMeta {
  age_group?: string;
  gender?: 'Male' | 'Female' | 'Other';
  upload_resume?: any[];
}

export interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers: IPhoneNumber[];
  agree_terms: boolean;
  role: string[];
  assign_department: string[];
  permissions: string[];
  status: 'Active' | 'Inactive';
  meta: IStudentMeta;
  admin_role: string;
  login_count: number;
  emailVerified: boolean;
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  last_login?: string;
  // Legacy fields for backward compatibility
  phone_number?: string;
  country_code?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  profile_image?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  education?: string;
  bio?: string;
  skills?: string[];
  metadata?: Record<string, any>;
}

export interface IStudentFormData {
  full_name: string;
  email: string;
  phone_number?: string;
  country_code?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  profile_image?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  password?: string;
  confirm_password?: string;
}

export interface IGroupedStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  status: string;
  createdAt: string;
  courses: string[];
  no?: number;
}

// Enrolled student interfaces
export interface ICourse {
  _id: string;
  course_title: string;
  course_subtitle?: string;
  course_description?: string;
  course_image?: string;
  course_fee?: number;
  course_duration?: number;
  course_type?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEnrolledStudent {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  student_id: {
    _id: string;
    full_name: string;
    email: string;
    phone_number?: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
  };
  enrollments: Array<{
    course: {
      id: string;
      name: string;
    };
    enrollment_date: string;
  }>;
}

export interface IGroupedEnrolledStudent {
  _id: string;
  full_name: string;
  email: string;
  courses: string;
  enrollment_date: string;
  no?: number;
}

export interface IFilterOptions {
  full_name: string;
  email: string;
  phone_number: string;
  course_name: string;
  role: "all" | "student" | "corporate-student";
  status: "all" | "Active" | "Inactive";
}

// Response interfaces
export interface IStudentResponse {
  status: string;
  message: string;
  data: IStudent[];
}

export interface IEnrolledStudentResponse {
  status: string;
  message: string;
  enrollments: IEnrolledStudent[];
}

// CSV Import/Export
export interface IStudentCSVRow {
  'Full Name': string;
  'Email': string;
  'Phone Number': string;
  'Status': string;
  'Country Code'?: string;
  'Address'?: string;
  'City'?: string;
  'State'?: string;
  'Zipcode'?: string;
  'Country'?: string;
  'Password'?: string;
}

export interface ICsvImportResponse {
  status: string;
  message: string;
  imported: number;
  failed: number;
  errors?: {
    row: number;
    error: string;
  }[];
} 