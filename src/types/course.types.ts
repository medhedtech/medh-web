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
  size_mb: number;
  pages: number;
  upload_date: string;
}

export interface ILessonResource {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'document' | 'link' | 'other';
  description?: string;
}

export interface IBaseLesson {
  id: string;
  title: string;
  description?: string;
  order: number;
  isPreview: boolean;
  meta: Record<string, any>;
  resources: ILessonResource[];
  lessonType: 'video' | 'quiz' | 'assessment';
}

export interface IVideoLesson extends IBaseLesson {
  lessonType: 'video';
  video_url: string;
  duration: string;
}

export interface IQuizLesson extends IBaseLesson {
  lessonType: 'quiz';
  quiz_id: string;
}

export interface IAssessmentLesson extends IBaseLesson {
  lessonType: 'assessment';
  assignment_id: string;
}

export type ILesson = IVideoLesson | IQuizLesson | IAssessmentLesson;

export interface ISection {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: ILesson[];
  resources: {
    title: string;
    description: string;
    fileUrl: string;
    type: string;
  }[];
}

export interface ICurriculumWeek {
  id: string;
  weekNumber: number;
  weekTitle: string;
  weekDescription: string;
  sections: ISection[];
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
  resources: {
    title: string;
    type: string;
    url: string;
    description: string;
  }[];
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
  course_level: string;
  language: string;
  subtitle_languages: string[];
  course_fee: number;
  prices: ICoursePrice[];
  brochures: string[];
  status: string;
  isFree: boolean;
  assigned_instructor: string;
  specifications: string;
  course_image: string;
  course_grade: string;
  resource_pdfs: IResourcePDF[];
  curriculum: ICurriculumWeek[];
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
} 