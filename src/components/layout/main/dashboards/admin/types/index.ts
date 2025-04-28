// Admin Dashboard Types
export interface AdminDashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalEnrollments: number;
  totalRevenue: number;
}

// Course Management Types
export interface CourseListItem {
  id: string;
  title: string;
  category: string;
  instructor: string;
  status: string;
  enrollments: number;
  lastUpdated: string;
}

// Student Management Types
export interface StudentListItem {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  joinDate: string;
  status: string;
}

// Instructor Management Types
export interface InstructorListItem {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  assignedCourses: number;
  rating: number;
  status: string;
}

// Settings Types
export interface CurrencySettings {
  defaultCurrency: string;
  supportedCurrencies: string[];
  exchangeRates: Record<string, number>;
  lastUpdated: string;
}

// Content Management Types
export interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'faq' | 'announcement';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
} 