// Instructor related interfaces
export interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  
  // Instructor-specific fields from instructor collection
  domain?: string;
  experience?: {
    years?: number;
    description?: string;
    previous_companies?: Array<{
      company_name: string;
      position: string;
      duration: string;
      description: string;
    }>;
  };
  qualifications?: {
    education?: Array<{
      degree: string;
      institution: string;
      year?: number;
      grade?: string;
    }>;
    certifications?: Array<{
      name: string;
      issuing_organization?: string;
      issue_date?: string;
      expiry_date?: string;
      credential_id?: string;
    }>;
    skills?: string[];
  };
  bio?: string;
  avatar?: string;
  is_active?: boolean;
  email_verified?: boolean;
  
  // Performance metrics
  performance_metrics?: {
    total_courses?: number;
    total_students?: number;
    average_rating?: number;
    completion_rate?: number;
  };
  
  meta?: {
    category?: string;
    course_name?: string;
    gender?: string;
    upload_resume?: string;
    age?: number;
    skills?: string[];
    education?: any[];
    certifications?: any[];
    previous_companies?: any[];
  };
  no?: number;
}

export interface IInstructorFormData {
  full_name: string;
  email: string;
  phone_number?: string;
  password?: string;
  confirm_password?: string;
  meta?: {
    category?: string;
    course_name?: string;
    gender?: string;
    upload_resume?: string;
  };
}

export interface IFilterOptions {
  full_name: string;
  email: string;
  phone_number: string;
  course_name: string;
  status: string;
}

// Response interfaces
export interface IInstructorResponse {
  status: string;
  message: string;
  data: IInstructor[];
}

// Table column type
export interface IColumn {
  Header: string;
  accessor: string;
  className?: string;
  render?: (row: any) => React.ReactNode;
}

// CSV Import/Export
export interface IInstructorCSVRow {
  'Full Name': string;
  'Email': string;
  'Phone Number': string;
  'Status': string;
  'Category'?: string;
  'Course Name'?: string;
  'Gender'?: string;
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