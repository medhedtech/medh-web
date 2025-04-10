// Instructor related interfaces
export interface IInstructor {
  _id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  meta?: {
    category?: string;
    course_name?: string;
    gender?: string;
    upload_resume?: string;
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