export type MaterialType = 'video' | 'document' | 'quiz' | 'assignment';
export type CourseStatus = 'Draft' | 'Published' | 'Archived';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ICoursePrice {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
}

export interface IResourcePDF {
  title: string;
  url: string;
  description: string;
  size_mb?: number;
  pages?: number;
  upload_date?: string;
  type?: string;
  category?: string;
}

export interface ILessonResource {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'document' | 'link' | 'other';
  description?: string;
}

export interface IMaterial {
  title: string;
  url: string;
  type: MaterialType;
  description?: string;
  size_mb?: number;
  pages?: number;
  upload_date?: string;
}

export type LessonType = 'video' | 'quiz' | 'assessment';

export interface IBaseLessonFields {
  id: string;
  title: string;
  description: string;
  order: number;
  isPreview: boolean;
  meta: Record<string, any>;
  resources: ILessonResource[];
}

export interface IVideoLesson extends IBaseLessonFields {
  lessonType: 'video';
  video_url: string;
  duration: string;
}

export interface IQuizLesson extends IBaseLessonFields {
  lessonType: 'quiz';
  quiz_id: string;
}

export interface IAssessmentLesson extends IBaseLessonFields {
  lessonType: 'assessment';
  assignment_id: string;
}

export type ILesson = IVideoLesson | IQuizLesson | IAssessmentLesson;

export interface ISection {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourseWeek {
  id: string;
  weekNumber: number;
  weekTitle: string;
  weekDescription: string;
  topics: string[];
  sections: ISection[];
  liveClasses: ILiveClass[];
  lessons: ILesson[];
}

export interface ILiveClass {
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number;
  meetingLink?: string;
  instructor?: string | null;
  recordingUrl?: string;
  isRecorded: boolean;
  materials: IMaterial[];
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ITool {
  name: string;
  category: string;
  description: string;
  logo_url: string;
}

export interface IBonusModule {
  title: string;
  description: string;
  resources: IMaterial[];
}

export interface ICourseDescription {
  program_overview: string;
  benefits: string;
  learning_objectives: string[];
  course_requirements: string[];
  target_audience: string[];
}

export interface ICourseFormData {
  course_category: string;
  course_subcategory: string;
  course_title: string;
  course_subtitle: string;
  course_tag: string;
  no_of_Sessions: number;
  course_duration: string;
  session_duration: string;
  course_description: ICourseDescription;
  course_level: CourseLevel;
  language: string;
  subtitle_languages: string[];
  course_fee: number;
  prices: ICoursePrice[];
  brochures: string[];
  status: string;
  isFree: boolean;
  assigned_instructor: string | null;
  specifications: string | null;
  course_image: string;
  course_grade: string;
  resource_pdfs: IResourcePDF[];
  curriculum: ICourseWeek[];
  faqs: IFAQ[];
  tools_technologies: ITool[];
  bonus_modules: IBonusModule[];
  efforts_per_Week: string;
  class_type: string;
  is_Certification: string;
  is_Assignments: string;
  is_Projects: string;
  is_Quizes: string;
  related_courses: string[];
  min_hours_per_week: number;
  max_hours_per_week: number;
  category_type: string;
  unique_key?: string;
  slug?: string;
  final_evaluation: {
    final_quizzes: string[];
    final_assessments: string[];
    certification: string | null;
    final_faqs: string[];
  };
  meta: {
    ratings: {
      average: number;
      count: number;
    };
    views: number;
    enrollments: number;
    lastUpdated: string;
  };
}

export interface ICourseResource {
  title: string;
  type: string;
  url: string;
}

export interface ICourseLesson {
  title: string;
  type: 'video' | 'document';
  duration?: string;
  video_url?: string;
  content_url?: string;
  resources?: ICourseResource[];
}

export interface ICourseSection {
  title: string;
  order: number;
  lessons?: ICourseLesson[];
}

export interface ICourseMetadata {
  views: number;
  ratings: {
    average: number;
    count: number;
  };
  enrollments: number;
  lastUpdated: string;
  version?: string;
}

export interface IUpdateCourseData {
  course_title: string;
  course_subtitle?: string;
  course_description?: string;
  course_category: string;
  course_subcategory?: string;
  class_type: string;
  course_grade: string;
  language: string;
  subtitle_languages?: string[];
  course_image?: string;
  assigned_instructor: string | null;
  course_duration?: number;
  course_fee?: number;
  is_certification?: boolean;
  is_assignments?: boolean;
  is_projects?: boolean;
  is_quizzes?: boolean;
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  no_of_sessions?: number;
  features?: string[];
  tools_technologies?: string[];
  status?: 'Draft' | 'Published' | 'Archived';
  sections?: ICourseSection[];
  metadata?: ICourseMetadata;
}

export interface ICourse {
  id: string;
  course_category: string;
  course_subcategory?: string;
  course_title: string;
  course_subtitle?: string;
  course_tag?: string;
  no_of_Sessions: number;
  course_duration: string;
  session_duration: string;
  course_description: ICourseDescription;
  course_level: CourseLevel;
  language: string;
  subtitle_languages: string[];
  course_fee: number;
  prices: ICoursePrice[];
  brochures: string[];
  status: CourseStatus;
  isFree: boolean;
  assigned_instructor: string | null;
  specifications?: string | null;
  course_image: string;
  course_grade: string;
  curriculum: ICourseWeek[];
  faqs: IFAQ[];
  tools_technologies: ITool[];
  bonus_modules: IBonusModule[];
  efforts_per_Week: string;
  class_type: string;
  is_Certification: string;
  is_Assignments: string;
  is_Projects: string;
  is_Quizes: string;
  related_courses: string[];
  min_hours_per_week: number;
  max_hours_per_week: number;
  category_type: string;
  unique_key?: string;
  slug?: string;
  meta: ICourseMetadata;
}

export interface ICourseFilters {
  certification?: boolean;
  assignments?: boolean;
  projects?: boolean;
  quizzes?: boolean;
  effortPerWeek?: {
    min: number;
    max: number;
  };
  noOfSessions?: number;
  features?: string[];
  tools?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  isFree?: boolean;
} 