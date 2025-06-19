// progress.types.ts - Enhanced Progress Tracking System Types

// ===== ENUM TYPES =====

export enum EContentType {
  LESSON = 'lesson',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  PROJECT = 'project',
  VIDEO = 'video',
  READING = 'reading',
  DISCUSSION = 'discussion',
  EXAM = 'exam'
}

export enum EProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

export enum EDifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum ETimeframe {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL = 'all'
}

export enum EExportFormat {
  JSON = 'json',
  CSV = 'csv',
  XLSX = 'xlsx',
  PDF = 'pdf'
}

export enum EUserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
  CORPORATE = 'corporate'
}

export enum ERecommendationType {
  CONTENT = 'content',
  STUDY_PLAN = 'study_plan',
  SKILL_IMPROVEMENT = 'skill_improvement',
  PEER_INTERACTION = 'peer_interaction'
}

export enum EPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum ELeaderboardCategory {
  OVERALL = 'overall',
  COURSE = 'course',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum ESyncStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum EExportStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum ETrendDirection {
  INCREASING = 'increasing',
  DECREASING = 'decreasing',
  STABLE = 'stable'
}

export enum EValidationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum EValidationType {
  MISSING_DATA = 'missing_data',
  INVALID_VALUE = 'invalid_value',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  ORPHANED_RECORD = 'orphaned_record'
}

// ===== COMPONENT PROP TYPES =====

export interface IProgressCardProps {
  progressData: IProgressEntry;
  showMetadata?: boolean;
  onUpdate?: (progress: IProgressEntry) => void;
  className?: string;
}

export interface IProgressDashboardProps {
  userId: string;
  courseId?: string;
  includeAnalytics?: boolean;
  refreshInterval?: number;
}

export interface ILeaderboardProps {
  category: ELeaderboardCategory;
  timeframe: ETimeframe;
  courseId?: string;
  limit?: number;
  showCurrentUser?: boolean;
  className?: string;
}

export interface IAnalyticsChartProps {
  data: IAdvancedProgressAnalytics;
  chartType: 'line' | 'bar' | 'pie' | 'area';
  metric: 'progress' | 'score' | 'timeSpent' | 'completion';
  timeframe: ETimeframe;
  className?: string;
}

export interface IRecommendationsProps {
  userId: string;
  type?: ERecommendationType;
  limit?: number;
  onAction?: (recommendation: IRecommendation) => void;
  className?: string;
}

export interface IProgressExportProps {
  userId: string;
  onExportComplete?: (exportId: string) => void;
  formats?: EExportFormat[];
  className?: string;
}

// ===== HOOK RETURN TYPES =====

export interface IUseProgressReturn {
  progress: IProgressEntry[];
  loading: boolean;
  error: string | null;
  createProgress: (data: ICreateProgressRequest) => Promise<void>;
  updateProgress: (id: string, data: IUpdateProgressRequest) => Promise<void>;
  deleteProgress: (id: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

export interface IUseAnalyticsReturn {
  analytics: IAdvancedProgressAnalytics | null;
  loading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
  getInsights: () => string[];
  getRecommendations: () => IRecommendation[];
}

export interface IUseLeaderboardReturn {
  leaderboard: ILeaderboardEntry[];
  currentUserRank: number | null;
  totalParticipants: number;
  loading: boolean;
  error: string | null;
  refreshLeaderboard: () => Promise<void>;
}

export interface IUseSyncReturn {
  syncProgress: (data: ISyncProgressData) => Promise<ISyncResponse>;
  syncStatus: (syncId: string) => Promise<ESyncStatus>;
  loading: boolean;
  error: string | null;
}

export interface IUseExportReturn {
  requestExport: (request: IAdvancedExportRequest) => Promise<string>;
  getExportStatus: (exportId: string) => Promise<IExportStatusResponse>;
  downloadExport: (exportId: string) => Promise<void>;
  exportHistory: IExportStatusResponse[];
  loading: boolean;
  error: string | null;
}

// ===== CONTEXT TYPES =====

export interface IProgressContextValue {
  userProgress: IProgressEntry[];
  analytics: IAdvancedProgressAnalytics | null;
  leaderboard: ILeaderboardEntry[];
  recommendations: IRecommendation[];
  loading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  updateProgress: (progressData: IProgressEntry) => void;
}

export interface IProgressProviderProps {
  userId: string;
  courseId?: string;
  children: React.ReactNode;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// ===== UTILITY TYPES =====

export type TProgressMetrics = Pick<IProgressEntry, 'progressPercentage' | 'timeSpent' | 'score'>;

export type TProgressFilters = {
  status?: EProgressStatus[];
  contentType?: EContentType[];
  difficulty?: EDifficultyLevel[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  minScore?: number;
  maxScore?: number;
};

export type TAnalyticsFilters = {
  timeframe?: ETimeframe;
  includeComparison?: boolean;
  includePreviousPeriod?: boolean;
  includeCohortData?: boolean;
  courseId?: string;
  contentType?: EContentType[];
  granularity?: 'day' | 'week' | 'month';
};

export type TProgressSortBy = 'createdAt' | 'updatedAt' | 'progressPercentage' | 'timeSpent' | 'score';

export type TProgressGroupBy = 'contentType' | 'difficulty' | 'status' | 'course' | 'date';

export type TChartDataPoint = {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
};

export type TProgressTrend = {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  direction: ETrendDirection;
};

// ===== VALIDATION TYPES =====

export interface IValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface IValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

// ===== EXTENDED INTERFACES (importing from progress.api.ts conceptually) =====

export interface IProgressEntry {
  _id?: string;
  userId: string;
  courseId: string;
  contentId: string;
  contentType: EContentType;
  progressPercentage: number;
  status: EProgressStatus;
  timeSpent: number;
  score?: number;
  metadata?: IProgressMetadata;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProgressMetadata {
  attempts?: number;
  difficulty?: EDifficultyLevel;
  hints_used?: number;
  errors_made?: number;
  device_type?: 'desktop' | 'tablet' | 'mobile';
  session_id?: string;
  [key: string]: any;
}

export interface IAdvancedProgressAnalytics {
  overview: {
    totalProgress: number;
    completionRate: number;
    averageScore: number;
    totalTimeSpent: number;
    streakDays: number;
    activeDays: number;
    totalSessions: number;
    averageSessionTime: number;
    lastActivity?: string;
  };
  trends: {
    progressTrend: ETrendDirection;
    scoreTrend: ETrendDirection;
    timeSpentTrend: ETrendDirection;
    engagementTrend: ETrendDirection;
  };
  breakdown: {
    byContentType: Record<EContentType, {
      count: number;
      completionRate: number;
      averageScore: number;
      totalTimeSpent: number;
    }>;
    byDifficulty: Record<EDifficultyLevel, {
      count: number;
      completionRate: number;
      averageScore: number;
    }>;
    byWeek: Array<{
      week: string;
      progress: number;
      timeSpent: number;
      itemsCompleted: number;
    }>;
    byMonth: Array<{
      month: string;
      progress: number;
      timeSpent: number;
      itemsCompleted: number;
    }>;
  };
  comparison?: IProgressComparison;
  insights?: string[];
  recommendations?: string[];
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: string;
    icon?: string;
  }>;
}

export interface IProgressComparison {
  previousPeriod: {
    progressChange: number;
    scoreChange: number;
    timeSpentChange: number;
    completionRateChange: number;
  };
  cohortAverage: {
    relativeProgress: number;
    relativeScore: number;
    relativeTimeSpent: number;
    percentile: number;
  };
  classmateComparison?: {
    rank: number;
    totalStudents: number;
    aboveAverage: boolean;
  };
}

export interface ILeaderboardEntry {
  userId: string;
  userName: string;
  userImage?: string;
  rank: number;
  score: number;
  totalProgress: number;
  completionRate: number;
  totalTimeSpent: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface IRecommendation {
  id: string;
  type: ERecommendationType;
  title: string;
  description: string;
  contentId?: string;
  contentType?: EContentType;
  priority: EPriority;
  estimatedTime?: number;
  difficulty?: EDifficultyLevel;
  reasoning: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface ISyncProgressData {
  progressData: Array<{
    userId: string;
    courseId: string;
    contentType: EContentType;
    contentId: string;
    progressPercentage: number;
    status: EProgressStatus;
    timeSpent: number;
    score?: number;
    timestamp: number;
    source: 'offline' | 'mobile' | 'web';
  }>;
  options?: {
    overwriteExisting?: boolean;
    validateData?: boolean;
    createMissing?: boolean;
  };
}

export interface ISyncResponse {
  syncId: string;
  processed: number;
  created: number;
  updated: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: string;
    data?: any;
  }>;
  summary: {
    totalTimeSpent: number;
    itemsCompleted: number;
    averageScore: number;
  };
}

export interface IAdvancedExportRequest {
  format: EExportFormat;
  userId?: string;
  courseId?: string;
  includeMetadata?: boolean;
  includeAnalytics?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  contentTypes?: EContentType[];
  status?: EProgressStatus[];
  customFields?: string[];
}

export interface IExportStatusResponse {
  exportId: string;
  status: EExportStatus;
  progress: number;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: string;
  recordsCount?: number;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
  error?: string;
}

export interface ICreateProgressRequest {
  userId: string;
  courseId: string;
  contentId: string;
  contentType: EContentType;
  progressPercentage: number;
  status: EProgressStatus;
  timeSpent: number;
  score?: number;
  metadata?: IProgressMetadata;
}

export interface IUpdateProgressRequest {
  progressPercentage?: number;
  status?: EProgressStatus;
  timeSpent?: number;
  score?: number;
  metadata?: IProgressMetadata;
}

export interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ===== DEFAULT VALUES =====

export const DEFAULT_PAGINATION: IPaginationInfo = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 20,
  hasNextPage: false,
  hasPreviousPage: false
};

export const DEFAULT_PROGRESS_FILTERS: TProgressFilters = {
  status: undefined,
  contentType: undefined,
  difficulty: undefined,
  dateRange: undefined,
  minScore: undefined,
  maxScore: undefined
};

export const DEFAULT_ANALYTICS_FILTERS: TAnalyticsFilters = {
  timeframe: ETimeframe.MONTH,
  includeComparison: true,
  includePreviousPeriod: true,
  includeCohortData: false,
  granularity: 'week'
};

export default {
  EContentType,
  EProgressStatus,
  EDifficultyLevel,
  ETimeframe,
  EExportFormat,
  EUserRole,
  ERecommendationType,
  EPriority,
  ELeaderboardCategory,
  ESyncStatus,
  EExportStatus,
  ETrendDirection,
  EValidationSeverity,
  EValidationType,
  DEFAULT_PAGINATION,
  DEFAULT_PROGRESS_FILTERS,
  DEFAULT_ANALYTICS_FILTERS
}; 