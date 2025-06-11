import { apiClient } from "./apiClient";
import { apiBaseUrl } from "./config";
import type { IApiResponse } from "./apiClient";

/* =============================================== */
/* INSTRUCTOR TYPE DEFINITIONS                     */
/* =============================================== */

export type TInstructorType = 'on_payroll' | 'hourly_basis' | 'contractual' | 'guest' | 'legacy';
export type TInstructorStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'terminated';
export type TPayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TPayoutType = 'monthly_salary' | 'hourly_payment' | 'project_bonus' | 'commission' | 'one_time';
export type TDataSource = 'users' | 'instructors' | 'both';

/* =============================================== */
/* CORE INSTRUCTOR INTERFACES                      */
/* =============================================== */

export interface IInstructorContactInfo {
  country: string;
  number: string;
  is_primary?: boolean;
  is_verified?: boolean;
}

export interface IInstructorAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  is_primary?: boolean;
}

export interface IInstructorEducation {
  degree: string;
  institution: string;
  field_of_study: string;
  graduation_year: number;
  is_verified?: boolean;
  documents?: string[];
}

export interface IInstructorCertification {
  name: string;
  issuing_organization: string;
  issue_date: Date;
  expiry_date?: Date;
  credential_id?: string;
  verification_url?: string;
  document_url?: string;
}

export interface IInstructorExperience {
  company: string;
  position: string;
  start_date: Date;
  end_date?: Date;
  description?: string;
  technologies?: string[];
  is_current?: boolean;
}

export interface IInstructorSpecialization {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  certifications?: string[];
}

export interface IInstructorAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  timezone: string;
}

export interface IInstructorPerformanceMetrics {
  average_rating: number;
  total_ratings: number;
  total_students_taught: number;
  total_batches_taught: number;
  total_courses_created: number;
  completion_rate: number;
  response_time_hours: number;
  punctuality_score: number;
  student_satisfaction_score: number;
  last_updated: string;
}

export interface IInstructorPaymentInfo {
  bank_name?: string;
  account_number?: string;
  routing_number?: string;
  swift_code?: string;
  paypal_email?: string;
  preferred_payment_method: 'bank_transfer' | 'paypal' | 'check' | 'crypto';
  tax_id?: string;
  currency_preference: string;
}

/* =============================================== */
/* ENHANCED INSTRUCTOR PROFILE                     */
/* =============================================== */

export interface IInstructorProfile {
  _id?: string;
  user: string; // Reference to User model
  instructor_type: TInstructorType;
  instructor_status: TInstructorStatus;
  employee_id?: string;
  hire_date?: Date;
  termination_date?: Date;
  
  // Personal Information
  bio?: string;
  tagline?: string;
  website_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  
  // Professional Information
  specializations: IInstructorSpecialization[];
  education: IInstructorEducation[];
  certifications: IInstructorCertification[];
  work_experience: IInstructorExperience[];
  
  // Availability & Schedule
  availability: IInstructorAvailability[];
  max_hours_per_week?: number;
  preferred_batch_size?: number;
  can_teach_weekends?: boolean;
  
  // Payment & Compensation
  hourly_rate?: number;
  monthly_salary?: number;
  currency: string;
  payment_info?: IInstructorPaymentInfo;
  
  // Performance & Analytics
  performance_metrics: IInstructorPerformanceMetrics;
  
  // System Fields
  created_by?: string;
  updated_by?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =============================================== */
/* LEGACY INSTRUCTOR (USER MODEL)                 */
/* =============================================== */

export interface ILegacyInstructor {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers: IInstructorContactInfo[];
  user_image?: string;
  user_status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  user_role: string;
  address?: IInstructorAddress[];
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/* =============================================== */
/* UNIFIED INSTRUCTOR DATA                         */
/* =============================================== */

export interface IUnifiedInstructor {
  _id: string;
  user_id: string;
  
  // Basic Information (always available)
  full_name: string;
  email: string;
  phone_numbers: IInstructorContactInfo[];
  user_image?: string;
  user_status: string;
  
  // Instructor-specific data
  instructor_type: TInstructorType;
  instructor_status: TInstructorStatus;
  employee_id?: string;
  hire_date?: string;
  
  // Professional Information
  specializations: IInstructorSpecialization[];
  bio?: string;
  tagline?: string;
  
  // Performance Metrics
  performance_metrics: IInstructorPerformanceMetrics;
  
  // Analytics
  active_batches_count: number;
  total_courses_assigned: number;
  
  // Data Source Metadata
  has_enhanced_profile: boolean;
  data_source: 'enhanced' | 'legacy';
  
  // Enhanced profile data (if available)
  enhanced_profile?: IInstructorProfile;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

/* =============================================== */
/* INSTRUCTOR BATCH ASSIGNMENTS                    */
/* =============================================== */

export interface IInstructorBatchAssignment {
  _id: string;
  instructor_id: string;
  batch_id: string;
  assigned_date: string;
  assignment_status: 'active' | 'completed' | 'cancelled';
  role: 'primary_instructor' | 'co_instructor' | 'guest_instructor';
  hourly_rate?: number;
  total_sessions?: number;
  completed_sessions?: number;
  assigned_by: string;
  notes?: string;
  
  // Populated fields
  batch_details?: {
    _id: string;
    batch_name: string;
    course_title: string;
    start_date: string;
    end_date: string;
    total_students: number;
  };
}

/* =============================================== */
/* INSTRUCTOR PAYOUTS                              */
/* =============================================== */

export interface IInstructorPayout {
  _id?: string;
  instructor_id: string;
  payout_type: TPayoutType;
  amount: number;
  currency: string;
  payment_period: {
    start_date: string;
    end_date: string;
  };
  
  // Calculation Details
  calculation_details: {
    base_amount?: number;
    hourly_rate?: number;
    hours_worked?: number;
    bonus_amount?: number;
    deductions?: number;
    tax_amount?: number;
    net_amount: number;
  };
  
  // Payment Information
  payout_status: TPayoutStatus;
  payment_method: string;
  transaction_id?: string;
  payment_date?: string;
  due_date: string;
  
  // Related Data
  batch_assignments?: string[]; // Batch IDs
  invoice_url?: string;
  receipt_url?: string;
  
  // Approval Workflow
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
  
  // System Fields
  created_by: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =============================================== */
/* INSTRUCTOR STATISTICS & ANALYTICS              */
/* =============================================== */

export interface IInstructorStatistics {
  overview: {
    total_instructors: number;
    active_instructors: number;
    inactive_instructors: number;
    pending_instructors: number;
    enhanced_profiles: number;
    legacy_profiles: number;
  };
  
  by_type: {
    on_payroll: number;
    hourly_basis: number;
    contractual: number;
    guest: number;
    legacy: number;
  };
  
  performance_metrics: {
    average_rating: number;
    top_rated_instructors: Array<{
      instructor_id: string;
      full_name: string;
      average_rating: number;
      total_students: number;
    }>;
    student_satisfaction_average: number;
    completion_rate_average: number;
  };
  
  workload_distribution: {
    overloaded_instructors: number;
    optimal_workload_instructors: number;
    underutilized_instructors: number;
    average_hours_per_week: number;
  };
  
  financial_overview: {
    total_payouts_pending: number;
    total_payouts_this_month: number;
    average_hourly_rate: number;
    highest_earning_instructor: {
      instructor_id: string;
      full_name: string;
      monthly_earnings: number;
    };
  };
  
  recent_activities: Array<{
    activity_type: 'new_instructor' | 'status_change' | 'assignment' | 'payout';
    instructor_id: string;
    instructor_name: string;
    description: string;
    timestamp: string;
  }>;
}

/* =============================================== */
/* QUERY PARAMETERS INTERFACES                    */
/* =============================================== */

export interface IInstructorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  instructor_type?: TInstructorType | 'all';
  instructor_status?: TInstructorStatus | 'all';
  user_status?: string;
  employee_id?: string;
  specialization?: string;
  availability_day?: string;
  min_rating?: number;
  max_hours_per_week?: number;
  hire_date_from?: string;
  hire_date_to?: string;
  sort_by?: 'full_name' | 'hire_date' | 'average_rating' | 'total_students' | 'createdAt';
  sort_order?: 'asc' | 'desc';
  include_performance_metrics?: boolean;
  include_assignments?: boolean;
  include_payouts?: boolean;
}

export interface IInstructorCommonQueryParams extends IInstructorQueryParams {
  data_source?: TDataSource;
  include_legacy?: boolean;
  group_by_type?: boolean;
  include_summary?: boolean;
}

export interface IInstructorStatisticsParams {
  date_range?: {
    start_date: string;
    end_date: string;
  };
  include_performance_breakdown?: boolean;
  include_financial_details?: boolean;
  include_recent_activities?: boolean;
  activity_limit?: number;
}

export interface IPayoutQueryParams {
  page?: number;
  limit?: number;
  instructor_id?: string;
  payout_type?: TPayoutType;
  payout_status?: TPayoutStatus;
  payment_period_start?: string;
  payment_period_end?: string;
  amount_min?: number;
  amount_max?: number;
  currency?: string;
  due_date_from?: string;
  due_date_to?: string;
  sort_by?: 'due_date' | 'amount' | 'payment_date' | 'createdAt';
  sort_order?: 'asc' | 'desc';
}

/* =============================================== */
/* REQUEST & RESPONSE INTERFACES                   */
/* =============================================== */

export interface IInstructorCreateInput {
  user_id: string;
  instructor_type: TInstructorType;
  instructor_status?: TInstructorStatus;
  employee_id?: string;
  hire_date?: Date;
  bio?: string;
  tagline?: string;
  specializations?: Omit<IInstructorSpecialization, 'certifications'>[];
  hourly_rate?: number;
  monthly_salary?: number;
  currency?: string;
  max_hours_per_week?: number;
  availability?: IInstructorAvailability[];
}

export interface IInstructorUpdateInput extends Partial<IInstructorCreateInput> {
  termination_date?: Date;
  website_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  education?: IInstructorEducation[];
  certifications?: IInstructorCertification[];
  work_experience?: IInstructorExperience[];
  payment_info?: IInstructorPaymentInfo;
}

export interface IInstructorAssignmentInput {
  batch_id: string;
  role?: 'primary_instructor' | 'co_instructor' | 'guest_instructor';
  hourly_rate?: number;
  notes?: string;
}

export interface IPayoutCreateInput {
  payout_type: TPayoutType;
  amount: number;
  currency: string;
  payment_period: {
    start_date: string;
    end_date: string;
  };
  calculation_details: {
    base_amount?: number;
    hourly_rate?: number;
    hours_worked?: number;
    bonus_amount?: number;
    deductions?: number;
    tax_amount?: number;
    net_amount: number;
  };
  due_date: string;
  payment_method: string;
  batch_assignments?: string[];
  notes?: string;
}

export interface IPayoutStatusUpdateInput {
  payout_status: TPayoutStatus;
  payment_date?: string;
  transaction_id?: string;
  rejection_reason?: string;
  notes?: string;
}

/* =============================================== */
/* RESPONSE INTERFACES                             */
/* =============================================== */

export interface IInstructorResponse {
  success: boolean;
  message: string;
  data: IInstructorProfile;
}

export interface IInstructorsListResponse {
  success: boolean;
  message: string;
  data: IInstructorProfile[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface IInstructorCommonResponse {
  success: boolean;
  message: string;
  data: IUnifiedInstructor[];
  count: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  summary: {
    enhanced_profiles: number;
    legacy_profiles: number;
    total: number;
    by_type: Record<TInstructorType, number>;
  };
  filters_applied: {
    search?: string;
    instructor_type: string;
    status: string;
    data_source: TDataSource;
    include_legacy: boolean;
  };
}

export interface IInstructorStatisticsResponse {
  success: boolean;
  message: string;
  data: IInstructorStatistics;
  generated_at: string;
}

export interface IPayoutResponse {
  success: boolean;
  message: string;
  data: IInstructorPayout;
}

export interface IPayoutsListResponse {
  success: boolean;
  message: string;
  data: IInstructorPayout[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    total_amount: number;
    pending_amount: number;
    completed_amount: number;
    currency_breakdown: Record<string, number>;
  };
}

export interface IAssignmentResponse {
  success: boolean;
  message: string;
  data: IInstructorBatchAssignment;
}

/* =============================================== */
/* INSTRUCTOR PAYMENT BATCH MANAGEMENT            */
/* =============================================== */

export type TPaymentBatchStatus = 'draft' | 'pending_approval' | 'approved' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TPaymentFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';

export interface IPaymentBatch {
  _id?: string;
  batch_name: string;
  batch_status: TPaymentBatchStatus;
  payment_frequency: TPaymentFrequency;
  
  // Payment Details
  total_amount: number;
  currency: string;
  payment_date: string;
  processing_date?: string;
  completion_date?: string;
  
  // Period Information
  payment_period: {
    start_date: string;
    end_date: string;
    period_description?: string;
  };
  
  // Instructors and Payouts
  instructor_payouts: string[]; // Array of payout IDs
  instructor_count: number;
  total_instructors: number;
  
  // Approval Workflow
  created_by: string;
  approved_by?: string;
  approval_date?: string;
  approval_notes?: string;
  rejection_reason?: string;
  
  // Processing Information
  payment_method: 'bank_transfer' | 'paypal' | 'check' | 'crypto' | 'mixed';
  transaction_references?: string[];
  processing_fees?: number;
  exchange_rates?: Record<string, number>;
  
  // Metadata
  tags?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPaymentBatchSummary {
  total_batches: number;
  total_amount: number;
  by_status: Record<TPaymentBatchStatus, number>;
  by_currency: Record<string, number>;
  pending_approval_amount: number;
  processing_amount: number;
  completed_this_month: number;
  failed_batches: number;
}

/* =============================================== */
/* INSTRUCTOR AVAILABILITY & TIME MANAGEMENT       */
/* =============================================== */

export type TDayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TTimeSlotStatus = 'available' | 'busy' | 'blocked' | 'tentative';
export type TRecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface ITimeSlot {
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  timezone: string;
  status: TTimeSlotStatus;
  description?: string;
}

export interface IInstructorSchedule {
  instructor_id: string;
  date: string; // YYYY-MM-DD format
  day_of_week: TDayOfWeek;
  timezone: string;
  
  // Time slots for the day
  time_slots: ITimeSlot[];
  
  // Day-level settings
  is_available: boolean;
  notes?: string;
  max_sessions_per_day?: number;
  current_sessions_count?: number;
}

export interface IAvailabilityPattern {
  _id?: string;
  instructor_id: string;
  pattern_name: string;
  is_default: boolean;
  
  // Weekly pattern
  weekly_schedule: {
    [K in TDayOfWeek]: {
      is_available: boolean;
      time_slots: ITimeSlot[];
      max_sessions?: number;
    };
  };
  
  // Recurrence settings
  recurrence: {
    type: TRecurrenceType;
    interval: number; // every N days/weeks/months
    end_date?: string;
    exceptions?: string[]; // Array of dates to exclude
  };
  
  // Timezone and preferences
  timezone: string;
  buffer_time_minutes: number; // Time between sessions
  max_consecutive_sessions: number;
  
  // Validity period
  effective_from: string;
  effective_until?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface IAvailabilityQuery {
  instructor_id?: string;
  date_from: string;
  date_to: string;
  timezone?: string;
  min_duration_minutes?: number;
  required_skills?: string[];
  exclude_booked?: boolean;
  group_by_instructor?: boolean;
}

export interface IAvailabilitySlot {
  instructor_id: string;
  instructor_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  timezone: string;
  confidence_score: number; // 0-100, how likely this slot is truly available
  conflict_risk: 'low' | 'medium' | 'high';
  
  // Context information
  existing_sessions_count: number;
  max_daily_sessions: number;
  is_preferred_time: boolean;
  instructor_rating: number;
  specializations: string[];
}

export interface ISchedulingConflict {
  type: 'overlap' | 'buffer_violation' | 'max_sessions_exceeded' | 'outside_availability';
  severity: 'warning' | 'error' | 'critical';
  description: string;
  affected_time: {
    start: string;
    end: string;
    date: string;
  };
  suggestions?: string[];
}

/* =============================================== */
/* ENHANCED QUERY PARAMETERS                       */
/* =============================================== */

export interface IPaymentBatchQueryParams {
  page?: number;
  limit?: number;
  batch_status?: TPaymentBatchStatus | 'all';
  payment_frequency?: TPaymentFrequency;
  currency?: string;
  payment_date_from?: string;
  payment_date_to?: string;
  created_by?: string;
  approved_by?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  tags?: string[];
  sort_by?: 'payment_date' | 'total_amount' | 'instructor_count' | 'createdAt';
  sort_order?: 'asc' | 'desc';
  include_payout_details?: boolean;
}

/* =============================================== */
/* REQUEST & RESPONSE INTERFACES                   */
/* =============================================== */

export interface IPaymentBatchCreateInput {
  batch_name: string;
  payment_frequency: TPaymentFrequency;
  payment_date: string;
  payment_period: {
    start_date: string;
    end_date: string;
    period_description?: string;
  };
  instructor_payouts: string[]; // Array of payout IDs
  payment_method: 'bank_transfer' | 'paypal' | 'check' | 'crypto' | 'mixed';
  description?: string;
  tags?: string[];
}

export interface IPaymentBatchUpdateInput extends Partial<IPaymentBatchCreateInput> {
  batch_status?: TPaymentBatchStatus;
  approval_notes?: string;
  rejection_reason?: string;
  transaction_references?: string[];
  processing_fees?: number;
}

export interface IAvailabilityPatternInput {
  pattern_name: string;
  is_default?: boolean;
  weekly_schedule: IAvailabilityPattern['weekly_schedule'];
  timezone: string;
  buffer_time_minutes: number;
  max_consecutive_sessions: number;
  effective_from: string;
  effective_until?: string;
  recurrence?: IAvailabilityPattern['recurrence'];
}

export interface IScheduleUpdateInput {
  date: string;
  time_slots: ITimeSlot[];
  is_available: boolean;
  notes?: string;
  max_sessions_per_day?: number;
}

export interface IPaymentBatchResponse {
  success: boolean;
  message: string;
  data: IPaymentBatch;
}

export interface IPaymentBatchListResponse {
  success: boolean;
  message: string;
  data: IPaymentBatch[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: IPaymentBatchSummary;
}

export interface IAvailabilityResponse {
  success: boolean;
  message: string;
  data: IAvailabilitySlot[];
  conflicts?: ISchedulingConflict[];
  total_slots: number;
  instructors_count: number;
  date_range: {
    from: string;
    to: string;
    timezone: string;
  };
}

/* =============================================== */
/* ENHANCED UTILITY FUNCTIONS                      */
/* =============================================== */

/**
 * Get instructor time zone
 */
export const getInstructorTimeZone = async (instructorId: string): Promise<IApiResponse<{ timezone: string; offset: string }>> => {
  return apiClient.get(`${apiBaseUrl}/instructors/${instructorId}/timezone`);
};

/**
 * Convert time between time zones
 */
export const convertTimeZone = (
  time: string, 
  date: string, 
  fromTz: string, 
  toTz: string
): { converted_time: string; converted_date: string } => {
  // This would typically use a library like date-fns-tz or moment-timezone
  // For now, returning a placeholder structure
  return {
    converted_time: time,
    converted_date: date
  };
};

/**
 * Calculate instructor workload for a period
 */
export const calculateInstructorWorkload = async (
  instructorId: string,
  dateRange: { start_date: string; end_date: string }
): Promise<IApiResponse<{
  total_scheduled_hours: number;
  total_available_hours: number;
  utilization_percentage: number;
  daily_breakdown: Array<{
    date: string;
    scheduled_hours: number;
    available_hours: number;
  }>;
  workload_status: 'underutilized' | 'optimal' | 'overloaded';
  recommendations: string[];
}>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/${instructorId}/workload-calculation`, dateRange);
};

/**
 * Generate recurring payment batches
 */
export const generateRecurringPaymentBatches = async (config: {
  frequency: TPaymentFrequency;
  start_date: string;
  end_date?: string;
  occurrences?: number;
  instructor_criteria: {
    instructor_types?: TInstructorType[];
    instructor_status?: TInstructorStatus[];
  };
  payment_settings: {
    payment_method: string;
    auto_approve?: boolean;
    approval_workflow?: boolean;
  };
}): Promise<IApiResponse<{ 
  success: boolean; 
  generated_batches: IPaymentBatch[];
  total_amount: number;
  schedule: Array<{ date: string; batch_name: string }>;
}>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/payment-batches/generate-recurring`, config);
};

/**
 * Smart instructor matching for time slots
 */
export const smartInstructorMatching = async (requirements: {
  time_slot: {
    date: string;
    start_time: string;
    end_time: string;
    timezone: string;
  };
  required_skills: string[];
  preferred_experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  max_instructors: number;
  budget_constraints?: {
    max_hourly_rate: number;
    currency: string;
  };
  student_preferences?: {
    preferred_languages: string[];
    previous_instructor_ratings_min: number;
  };
}): Promise<IApiResponse<{
  success: boolean;
  matched_instructors: Array<{
    instructor_id: string;
    instructor_name: string;
    match_score: number;
    availability_confidence: number;
    hourly_rate: number;
    specializations: string[];
    average_rating: number;
    languages: string[];
    experience_level: string;
    reasons: string[];
  }>;
  alternative_times?: Array<{
    date: string;
    start_time: string;
    end_time: string;
    available_instructors_count: number;
  }>;
}>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/smart-matching`, requirements);
};

/**
 * Optimize instructor schedules across multiple instructors
 */
export const optimizeInstructorSchedules = async (optimization: {
  instructor_ids: string[];
  date_range: { start_date: string; end_date: string };
  constraints: {
    max_daily_hours: number;
    min_break_minutes: number;
    preferred_working_hours: { start: string; end: string };
    maximum_consecutive_days: number;
  };
  goals: {
    maximize_utilization: boolean;
    balance_workload: boolean;
    respect_preferences: boolean;
  };
}): Promise<IApiResponse<{
  success: boolean;
  optimized_schedules: Array<{
    instructor_id: string;
    schedule: IInstructorSchedule[];
    optimization_score: number;
    improvements: string[];
  }>;
  overall_metrics: {
    total_utilization_improvement: number;
    workload_balance_score: number;
    instructor_satisfaction_score: number;
  };
}>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/optimize-schedules`, optimization);
};

/**
 * Validate payment batch before processing
 */
export const validatePaymentBatch = async (batchId: string): Promise<IApiResponse<{
  success: boolean;
  is_valid: boolean;
  validation_results: {
    instructor_validation: Array<{
      instructor_id: string;
      is_valid: boolean;
      issues: string[];
    }>;
    amount_validation: {
      total_calculated: number;
      total_declared: number;
      discrepancy: number;
    };
    compliance_checks: {
      tax_compliance: boolean;
      payment_method_validation: boolean;
      regulatory_compliance: boolean;
    };
  };
  warnings: string[];
  errors: string[];
  can_process: boolean;
}>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/payment-batches/${batchId}/validate`);
};

/**
 * Forecast instructor availability
 */
export const forecastInstructorAvailability = async (forecast: {
  instructor_ids?: string[];
  forecast_period_days: number;
  historical_data_days?: number;
  factors: {
    consider_trends: boolean;
    consider_seasonality: boolean;
    consider_workload_patterns: boolean;
  };
}): Promise<IApiResponse<{
  success: boolean;
  forecasts: Array<{
    instructor_id: string;
    instructor_name: string;
    predicted_availability: Array<{
      date: string;
      predicted_available_hours: number;
      confidence_level: number;
      factors_influencing: string[];
    }>;
    trends: {
      increasing_availability: boolean;
      seasonal_patterns: string[];
      workload_trend: 'increasing' | 'decreasing' | 'stable';
    };
  }>;
  aggregate_forecast: {
    total_predicted_hours: number;
    peak_availability_dates: string[];
    low_availability_dates: string[];
  };
}>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/availability/forecast`, forecast);
};

/* =============================================== */
/* PAYMENT BATCH MANAGEMENT METHODS               */
/* =============================================== */

/**
 * Create a new payment batch
 */
export const createPaymentBatch = async (data: IPaymentBatchCreateInput): Promise<IApiResponse<IPaymentBatchResponse>> => {
  return apiClient.post<IPaymentBatchResponse>(`${apiBaseUrl}/instructors/payment-batches`, data);
};

/**
 * Get all payment batches with filtering
 */
export const getPaymentBatches = async (params: IPaymentBatchQueryParams = {}): Promise<IApiResponse<IPaymentBatchListResponse>> => {
  const queryString = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        queryString.append(key, value.join(','));
      } else if (typeof value === 'object') {
        queryString.append(key, JSON.stringify(value));
      } else {
        queryString.append(key, value.toString());
      }
    }
  });
  
  return apiClient.get<IPaymentBatchListResponse>(
    `${apiBaseUrl}/instructors/payment-batches?${queryString.toString()}`
  );
};

/**
 * Get payment batch by ID
 */
export const getPaymentBatchById = async (batchId: string): Promise<IApiResponse<IPaymentBatchResponse>> => {
  return apiClient.get<IPaymentBatchResponse>(`${apiBaseUrl}/instructors/payment-batches/${batchId}`);
};

/**
 * Update payment batch
 */
export const updatePaymentBatch = async (batchId: string, data: IPaymentBatchUpdateInput): Promise<IApiResponse<IPaymentBatchResponse>> => {
  return apiClient.put<IPaymentBatchResponse>(`${apiBaseUrl}/instructors/payment-batches/${batchId}`, data);
};

/**
 * Approve payment batch
 */
export const approvePaymentBatch = async (batchId: string, notes?: string): Promise<IApiResponse<IPaymentBatchResponse>> => {
  return apiClient.patch<IPaymentBatchResponse>(`${apiBaseUrl}/instructors/payment-batches/${batchId}/approve`, { notes });
};

/**
 * Reject payment batch
 */
export const rejectPaymentBatch = async (batchId: string, reason: string): Promise<IApiResponse<IPaymentBatchResponse>> => {
  return apiClient.patch<IPaymentBatchResponse>(`${apiBaseUrl}/instructors/payment-batches/${batchId}/reject`, { reason });
};

/**
 * Process payment batch
 */
export const processPaymentBatch = async (batchId: string): Promise<IApiResponse<IPaymentBatchResponse>> => {
  return apiClient.patch<IPaymentBatchResponse>(`${apiBaseUrl}/instructors/payment-batches/${batchId}/process`);
};

/**
 * Delete payment batch (only if draft or cancelled)
 */
export const deletePaymentBatch = async (batchId: string): Promise<IApiResponse<{ message: string }>> => {
  return apiClient.delete<{ message: string }>(`${apiBaseUrl}/instructors/payment-batches/${batchId}`);
};

/**
 * Generate payment batch from criteria
 */
export const generatePaymentBatch = async (criteria: {
  payment_period: { start_date: string; end_date: string };
  instructor_types?: TInstructorType[];
  instructor_status?: TInstructorStatus[];
  payment_method?: string;
  auto_approve?: boolean;
}): Promise<IApiResponse<IPaymentBatchResponse>> => {
  return apiClient.post<IPaymentBatchResponse>(`${apiBaseUrl}/instructors/payment-batches/generate`, criteria);
};

/* =============================================== */
/* AVAILABILITY & SCHEDULING METHODS              */
/* =============================================== */

/**
 * Create or update instructor availability pattern
 */
export const setInstructorAvailabilityPattern = async (
  instructorId: string, 
  data: IAvailabilityPatternInput
): Promise<IApiResponse<{ success: boolean; pattern: IAvailabilityPattern }>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/${instructorId}/availability-pattern`, data);
};

/**
 * Get instructor availability pattern
 */
export const getInstructorAvailabilityPattern = async (
  instructorId: string
): Promise<IApiResponse<{ success: boolean; patterns: IAvailabilityPattern[] }>> => {
  return apiClient.get(`${apiBaseUrl}/instructors/${instructorId}/availability-pattern`);
};

/**
 * Update specific date schedule
 */
export const updateInstructorSchedule = async (
  instructorId: string, 
  data: IScheduleUpdateInput
): Promise<IApiResponse<{ success: boolean; schedule: IInstructorSchedule }>> => {
  return apiClient.patch(`${apiBaseUrl}/instructors/${instructorId}/schedule`, data);
};

/**
 * Get instructor schedule for date range
 */
export const getInstructorSchedule = async (
  instructorId: string,
  dateFrom: string,
  dateTo: string,
  timezone?: string
): Promise<IApiResponse<{ success: boolean; schedules: IInstructorSchedule[] }>> => {
  const params = new URLSearchParams({
    date_from: dateFrom,
    date_to: dateTo,
    ...(timezone && { timezone })
  });
  
  return apiClient.get(`${apiBaseUrl}/instructors/${instructorId}/schedule?${params.toString()}`);
};

/**
 * Find available instructors for specific time slot
 */
export const findAvailableInstructors = async (
  query: IAvailabilityQuery
): Promise<IApiResponse<IAvailabilityResponse>> => {
  const queryString = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        queryString.append(key, value.join(','));
      } else {
        queryString.append(key, value.toString());
      }
    }
  });
  
  return apiClient.get<IAvailabilityResponse>(
    `${apiBaseUrl}/instructors/availability/search?${queryString.toString()}`
  );
};

/**
 * Check for scheduling conflicts
 */
export const checkSchedulingConflicts = async (
  instructorId: string,
  proposedSchedule: {
    date: string;
    start_time: string;
    end_time: string;
    timezone: string;
  }
): Promise<IApiResponse<{ success: boolean; conflicts: ISchedulingConflict[]; can_schedule: boolean }>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/${instructorId}/check-conflicts`, proposedSchedule);
};

/**
 * Get optimal time slots for multiple instructors
 */
export const findOptimalTimeSlots = async (criteria: {
  instructor_ids: string[];
  date_range: { start_date: string; end_date: string };
  session_duration_minutes: number;
  preferred_times?: string[]; // Array of "HH:MM" times
  timezone: string;
  max_results?: number;
}): Promise<IApiResponse<{
  success: boolean;
  optimal_slots: Array<{
    date: string;
    start_time: string;
    end_time: string;
    available_instructors: string[];
    compatibility_score: number;
  }>;
}>> => {
  return apiClient.post(`${apiBaseUrl}/instructors/availability/optimal-slots`, criteria);
};

/**
 * Bulk update instructor availability
 */
export const bulkUpdateAvailability = async (updates: Array<{
  instructor_id: string;
  date: string;
  time_slots: ITimeSlot[];
}>): Promise<IApiResponse<{ success: boolean; updated_count: number; errors: any[] }>> => {
  return apiClient.patch(`${apiBaseUrl}/instructors/availability/bulk-update`, { updates });
};

/**
 * Get availability analytics
 */
export const getAvailabilityAnalytics = async (params: {
  date_range: { start_date: string; end_date: string };
  instructor_ids?: string[];
  timezone?: string;
}): Promise<IApiResponse<{
  success: boolean;
  analytics: {
    total_available_hours: number;
    total_scheduled_hours: number;
    utilization_rate: number;
    peak_availability_times: string[];
    least_available_times: string[];
    instructor_utilization: Array<{
      instructor_id: string;
      instructor_name: string;
      available_hours: number;
      scheduled_hours: number;
      utilization_rate: number;
    }>;
  };
}>> => {
  const queryString = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        queryString.append(key, JSON.stringify(value));
      } else {
        queryString.append(key, value.toString());
      }
    }
  });
  
  return apiClient.get(`${apiBaseUrl}/instructors/availability/analytics?${queryString.toString()}`);
};

/* =============================================== */
/* UPDATED CONSOLIDATED API OBJECT                 */
/* =============================================== */

export const instructorAPI = {
  // Core CRUD operations
  getAll: getAllInstructors,
  getById: getInstructorById,
  create: createInstructor,
  update: updateInstructor,
  delete: deleteInstructor,
  
  // Common route (unified data)
  getCommon: getInstructorsCommon,
  search: searchInstructors,
  
  // Status management
  toggleStatus: toggleInstructorStatus,
  
  // Statistics and analytics
  getStatistics: getInstructorStatistics,
  getAvailable: findAvailableInstructors,
  getWorkload: getInstructorWorkload,
  getPerformanceReport: getInstructorPerformanceReport,
  
  // Assignment management
  assignToBatch: assignInstructorToBatch,
  unassignFromBatch: unassignInstructorFromBatch,
  
  // Payout management
  payouts: {
    create: createInstructorPayout,
    getByInstructor: getInstructorPayouts,
    updateStatus: updatePayoutStatus,
  },
  
  // Payment Batch Management
  paymentBatches: {
    create: createPaymentBatch,
    getAll: getPaymentBatches,
    getById: getPaymentBatchById,
    update: updatePaymentBatch,
    approve: approvePaymentBatch,
    reject: rejectPaymentBatch,
    process: processPaymentBatch,
    delete: deletePaymentBatch,
    generate: generatePaymentBatch,
    generateRecurring: generateRecurringPaymentBatches,
    validate: validatePaymentBatch,
  },
  
  // Availability & Scheduling
  availability: {
    setPattern: setInstructorAvailabilityPattern,
    getPattern: getInstructorAvailabilityPattern,
    updateSchedule: updateInstructorSchedule,
    getSchedule: getInstructorSchedule,
    findAvailable: findAvailableInstructors,
    checkConflicts: checkSchedulingConflicts,
    findOptimalSlots: findOptimalTimeSlots,
    bulkUpdate: bulkUpdateAvailability,
    getAnalytics: getAvailabilityAnalytics,
    forecast: forecastInstructorAvailability,
  },
  
  // Advanced Features
  optimization: {
    smartMatching: smartInstructorMatching,
    optimizeSchedules: optimizeInstructorSchedules,
    calculateWorkload: calculateInstructorWorkload,
  },
  
  // Utility functions
  utils: {
    getTimeZone: getInstructorTimeZone,
    convertTimeZone: convertTimeZone,
  }
} as const;

export default instructorAPI; 