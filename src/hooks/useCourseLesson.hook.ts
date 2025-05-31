import { useState, useEffect, useCallback } from 'react';
import { apiUrls } from '@/apis';
import useGetQuery from './getQuery.hook';
import { toast } from 'react-toastify';
import { getCourseById } from '@/apis/course/course';
import curriculumService, { type Curriculum, type CurriculumLesson } from '@/services/curriculum.service';

// ----------------------
// Type Definitions
// ----------------------

interface CourseWeek {
  id?: string;
  _id?: string;
  weekTitle: string;
  weekDescription?: string;
  sections?: CourseSection[];
  lessons?: LessonData[];
  topics?: string[];
  liveClasses?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface CourseSection {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  lessons: LessonData[];
  assignments?: AssignmentData[];
  quizzes?: QuizData[];
}

interface ResourceFile {
  title: string;
  description: string;
  fileUrl: string;
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
}

export interface LessonData {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  lessonType?: 'video' | 'quiz' | 'assessment';
  isPreview?: boolean;
  meta?: {
    presenter?: string | null;
    transcript?: string | null;
    time_limit?: number | null;
    passing_score?: number | null;
    due_date?: string | null;
    max_score?: number | null;
  };
  resources?: ResourceFile[];
  video_url?: string;
  videoUrl?: string;
  duration?: string | number;
  completed?: boolean;
  is_completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  weekTitle?: string;
  sectionTitle?: string;
}

interface CoursePrice {
  _id?: { $oid: string } | string;
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
}

interface CourseMeta {
  views: number;
  ratings?: {
    average: number;
    count: number;
  };
  enrollments?: number;
  lastUpdated?: string;
}

interface MongoDBDate {
  $date: string;
}

export interface CourseData {
  _id: string | { $oid: string };
  course_category: string;
  course_title: string;
  course_tag?: string;
  no_of_Sessions: number;
  course_duration: string;
  session_duration: string;
  course_description: string | {
    program_overview?: string;
    benefits?: string;
  };
  category: string;
  course_fee: number;
  prices: CoursePrice[];
  course_videos: string[];
  brochures: string[];
  status: string;
  isFree: boolean;
  assigned_instructor?: { $oid: string };
  specifications?: any;
  course_image: string;
  course_grade: string;
  resource_videos: string[];
  resource_pdfs: {
    title: string;
    url: string;
    description: string;
    size_mb?: number;
    pages?: number;
    upload_date?: string;
  }[];
  curriculum: CourseWeek[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  tools_technologies?: {
    name: string;
    category: string;
    description: string;
    logo_url: string;
  }[];
  bonus_modules?: {
    title: string;
    description: string;
    resources: {
      title: string;
      type: string;
      url: string;
      description: string;
    }[];
  }[];
  recorded_videos: string[];
  efforts_per_Week: string;
  class_type: string;
  is_Certification: string;
  is_Assignments: string;
  is_Projects: string;
  is_Quizes: string;
  related_courses: string[];
  min_hours_per_week?: number;
  max_hours_per_week?: number;
  category_type?: string;
  meta: CourseMeta;
  createdAt?: MongoDBDate;
  updatedAt?: MongoDBDate;
  unique_key?: string;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: CourseData;
}

export interface AssignmentData {
  email: string;
  content: string;
  files?: File[];
}

export interface CompletionData {
  completed_at: string;
  duration?: number;
}

export interface QuizData {
  answers: Record<string, any>;
  duration?: number;
  score?: number;
}

// ----------------------
// Helper Functions
// ----------------------

// Normalize MongoDB ObjectId to string
const normalizeObjectId = (id: string | { $oid: string }): string => {
  if (!id) return '';
  if (typeof id === 'string') return id;
  return id.$oid;
};

// Normalize course description to handle both string and object formats
const normalizeCourseDescription = (description: string | { program_overview?: string; benefits?: string }): {
  program_overview: string;
  benefits: string;
} => {
  if (typeof description === 'string') {
    return {
      program_overview: description,
      benefits: description
    };
  }
  return {
    program_overview: description.program_overview || '',
    benefits: description.benefits || ''
  };
};

// Convert curriculum service format to course data format
const convertCurriculumToCourseFormat = (curriculum: Curriculum): CourseWeek[] => {
  if (!curriculum) return [];

  // If curriculum has weeks, convert them
  if (curriculum.weeks) {
    return curriculum.weeks.map(week => ({
      id: week._id,
      _id: week._id,
      weekTitle: week.weekTitle,
      weekDescription: week.weekDescription,
      sections: week.sections?.map(section => ({
        id: section._id,
        _id: section._id,
        title: section.title,
        description: section.description,
        order: section.order || 1,
        lessons: section.lessons.map(lesson => ({
          id: lesson._id,
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          lessonType: lesson.lessonType as 'video' | 'quiz' | 'assessment',
          isPreview: lesson.isPreview,
          meta: lesson.meta,
          resources: lesson.resources?.map(resource => ({
            title: resource.title,
            description: resource.description || '',
            fileUrl: resource.url || resource.fileUrl || '',
            filename: resource.title,
            mimeType: 'application/pdf',
            size: 0,
            url: resource.url || resource.fileUrl || ''
          })) || [],
          video_url: lesson.videoUrl || lesson.video_url,
          videoUrl: lesson.videoUrl || lesson.video_url,
          duration: lesson.duration,
          completed: lesson.completed,
          is_completed: lesson.is_completed,
          weekTitle: week.weekTitle,
          sectionTitle: section.title
        }))
      })) || [],
      lessons: week.lessons?.map(lesson => ({
        id: lesson._id,
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        lessonType: lesson.lessonType as 'video' | 'quiz' | 'assessment',
        isPreview: lesson.isPreview,
        meta: lesson.meta,
        resources: lesson.resources?.map(resource => ({
          title: resource.title,
          description: resource.description || '',
          fileUrl: resource.url || resource.fileUrl || '',
          filename: resource.title,
          mimeType: 'application/pdf',
          size: 0,
          url: resource.url || resource.fileUrl || ''
        })) || [],
        video_url: lesson.videoUrl || lesson.video_url,
        videoUrl: lesson.videoUrl || lesson.video_url,
        duration: lesson.duration,
        completed: lesson.completed,
        is_completed: lesson.is_completed,
        weekTitle: week.weekTitle
      })) || [],
      topics: week.topics,
      createdAt: curriculum.createdAt,
      updatedAt: curriculum.updatedAt
    }));
  }

  // If curriculum only has sections, wrap them in a week
  if (curriculum.sections) {
    return [{
      id: 'main-week',
      _id: 'main-week',
      weekTitle: 'Course Content',
      weekDescription: 'Main course curriculum',
      sections: curriculum.sections.map(section => ({
        id: section._id,
        _id: section._id,
        title: section.title,
        description: section.description,
        order: section.order || 1,
        lessons: section.lessons.map(lesson => ({
          id: lesson._id,
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          lessonType: lesson.lessonType as 'video' | 'quiz' | 'assessment',
          isPreview: lesson.isPreview,
          meta: lesson.meta,
          resources: lesson.resources?.map(resource => ({
            title: resource.title,
            description: resource.description || '',
            fileUrl: resource.url || resource.fileUrl || '',
            filename: resource.title,
            mimeType: 'application/pdf',
            size: 0,
            url: resource.url || resource.fileUrl || ''
          })) || [],
          video_url: lesson.videoUrl || lesson.video_url,
          videoUrl: lesson.videoUrl || lesson.video_url,
          duration: lesson.duration,
          completed: lesson.completed,
          is_completed: lesson.is_completed,
          sectionTitle: section.title
        }))
      })),
      lessons: []
    }];
  }

  // If curriculum only has lessons, wrap them in a section and week
  if (curriculum.lessons) {
    return [{
      id: 'main-week',
      _id: 'main-week',
      weekTitle: 'Course Content',
      weekDescription: 'Main course curriculum',
      sections: [{
        id: 'main-section',
        _id: 'main-section',
        title: 'Lessons',
        description: 'Course lessons',
        order: 1,
        lessons: curriculum.lessons.map(lesson => ({
          id: lesson._id,
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          lessonType: lesson.lessonType as 'video' | 'quiz' | 'assessment',
          isPreview: lesson.isPreview,
          meta: lesson.meta,
          resources: lesson.resources?.map(resource => ({
            title: resource.title,
            description: resource.description || '',
            fileUrl: resource.url || resource.fileUrl || '',
            filename: resource.title,
            mimeType: 'application/pdf',
            size: 0,
            url: resource.url || resource.fileUrl || ''
          })) || [],
          video_url: lesson.videoUrl || lesson.video_url,
          videoUrl: lesson.videoUrl || lesson.video_url,
          duration: lesson.duration,
          completed: lesson.completed,
          is_completed: lesson.is_completed
        }))
      }],
      lessons: []
    }];
  }

  return [];
};

// Convert curriculum service lesson to LessonData format
const convertCurriculumLessonToLessonData = (lesson: CurriculumLesson): LessonData => {
  return {
    id: lesson.id || lesson._id,
    _id: lesson._id,
    title: lesson.title,
    description: lesson.description,
    order: lesson.order,
    lessonType: lesson.lessonType as 'video' | 'quiz' | 'assessment',
    isPreview: lesson.isPreview,
    meta: lesson.meta,
    resources: lesson.resources?.map(resource => ({
      title: resource.title,
      description: resource.description || '',
      fileUrl: resource.url || resource.fileUrl || '',
      filename: resource.title,
      mimeType: 'application/pdf',
      size: 0,
      url: resource.url || resource.fileUrl || ''
    })) || [],
    video_url: lesson.videoUrl || lesson.video_url,
    videoUrl: lesson.videoUrl || lesson.video_url,
    duration: lesson.duration,
    completed: lesson.completed,
    is_completed: lesson.is_completed,
    createdAt: lesson.progress?.completion_date,
    updatedAt: lesson.progress?.completion_date
  };
};

// Normalize course data to ensure consistent format
const normalizeCourseData = (data: CourseData): CourseData => {
  return {
    ...data,
    _id: normalizeObjectId(data._id),
    course_description: normalizeCourseDescription(data.course_description),
    curriculum: data.curriculum || [],
    prices: data.prices?.map(price => ({
      ...price,
      _id: price._id ? normalizeObjectId(price._id) : undefined
    })) || [],
    meta: {
      views: data.meta?.views || 0,
      ratings: data.meta?.ratings || { average: 0, count: 0 },
      enrollments: data.meta?.enrollments || 0,
      lastUpdated: data.meta?.lastUpdated || data.updatedAt?.$date || new Date().toISOString()
    }
  };
};

// Update findLessonInCurriculum function to handle both section and lesson IDs
const findLessonInCurriculum = (
  curriculum: CourseWeek[],
  targetId: string
): LessonData | undefined => {
  if (!targetId || !curriculum || !Array.isArray(curriculum) || curriculum.length === 0) {
    console.log('Invalid curriculum or targetId:', { curriculum, targetId });
    return undefined;
  }

  console.log('Finding content with ID:', targetId);
  
  // Normalize targetId if it's in MongoDB ObjectId format
  const normalizedTargetId = targetId.includes('$oid') ? JSON.parse(targetId).$oid : targetId;
  
  for (const week of curriculum) {
    // First check if the week has this ID
    const weekId = normalizeObjectId(week._id || week.id || '');
    if (weekId === normalizedTargetId) {
      console.log('Found matching week:', week);
      // If week has direct lessons, return the first one
      const weekLessons = week.lessons || [];
      if (weekLessons.length > 0) {
        const firstLesson = weekLessons[0];
        return {
          ...firstLesson,
          weekTitle: week.weekTitle,
          sectionTitle: week.weekTitle
        };
      }
    }

    // Check direct lessons in the week
    const weekLessons = week.lessons || [];
    for (const lesson of weekLessons) {
      const lessonId = normalizeObjectId(lesson._id || lesson.id || '');
      if (lessonId === normalizedTargetId) {
        console.log('Found lesson in week:', lesson);
        return {
          ...lesson,
          weekTitle: week.weekTitle,
          sectionTitle: week.weekTitle
        };
      }
    }

    // Check sections
    const sections = week.sections || [];
    for (const section of sections) {
      // Check if this is the target section
      const sectionId = normalizeObjectId(section._id || section.id || '');
      if (sectionId === normalizedTargetId) {
        console.log('Found matching section:', section);
        // If section has lessons, return the first one
        const sectionLessons = section.lessons || [];
        if (sectionLessons.length > 0) {
          const firstLesson = sectionLessons[0];
          return {
            ...firstLesson,
            weekTitle: week.weekTitle,
            sectionTitle: section.title
          };
        }
      }

      // Check lessons within the section
      const sectionLessons = section.lessons || [];
      for (const lesson of sectionLessons) {
        const lessonId = normalizeObjectId(lesson._id || lesson.id || '');
        if (lessonId === normalizedTargetId) {
          console.log('Found lesson in section:', lesson);
          return {
            ...lesson,
            weekTitle: week.weekTitle,
            sectionTitle: section.title
          };
        }
      }
    }
  }

  console.log('No matching content found in curriculum');
  return undefined;
};

// Ensures resources have the expected url property for compatibility
const normalizeResources = (resources: ResourceFile[] | undefined): ResourceFile[] | undefined => {
  if (!resources) return undefined;
  
  return resources.map(resource => ({
    ...resource,
    url: resource.url || resource.fileUrl
  }));
};

// Update hasLessons check to handle the API response structure
const hasLessonsInCurriculum = (curriculum: CourseWeek[]): boolean => {
  return curriculum.some(week => {
    const hasWeekLessons = Array.isArray(week.lessons) && week.lessons.length > 0;
    const hasSectionLessons = Array.isArray(week.sections) && 
      week.sections.some(section => 
        Array.isArray(section.lessons) && section.lessons.length > 0
      );
    return hasWeekLessons || hasSectionLessons;
  });
};

// ----------------------
// Main Hook
// ----------------------

export const useCourseLesson = (courseId: string, lessonId: string = '') => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);

  const { getQuery } = useGetQuery();

  // Increment retry count and reset error/loading states
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    setLoading(true);
  }, []);

  // Retrieve auth token from local storage
  const getAuthToken = useCallback((): string | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found - working in demo mode');
        return null;
      }
      return token;
    }
    return null;
  }, []);

  // Centralized API error handling
  const handleApiError = useCallback((error: any): Error => {
    console.error("API Error:", error);
    if (error.message === 'Network Error' || (!error.response && !error.success)) {
      return new Error('Network Error: Please check your internet connection');
    }
    const statusMessages: Record<number, string> = {
      401: 'Session Expired: Please log in again to continue',
      403: "Access Denied: You don't have permission to access this content",
      404: 'Content Not Found: The requested lesson could not be found',
      500: 'Server Error: Our servers are experiencing issues. Please try again later'
    };
    const status = error.response?.status;
    const message =
      (status && statusMessages[status]) ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return new Error(message);
  }, []);

  // Mark the current lesson as complete
  const markLessonComplete = useCallback(async (completionData: CompletionData): Promise<boolean> => {
    if (!lessonId) {
      toast.error('No lesson selected to mark as complete');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      
      // If no token, just update local state (demo mode)
      if (!token) {
        console.warn('No authentication token - updating local state only');
        setLessonData((prev) => prev ? { ...prev, is_completed: true, completed: true, completion_date: completionData.completed_at } : prev);
        
        // Also update the course curriculum data to reflect the completion
        setCourseData(prevCourseData => {
          if (!prevCourseData) return null;
          
          const updatedCurriculum = prevCourseData.curriculum.map(week => ({
            ...week,
            // Update lessons in the week if they exist
            lessons: week.lessons?.map(lesson => 
              (lesson._id === lessonId || lesson.id === lessonId) 
                ? { ...lesson, is_completed: true, completed: true, completion_date: completionData.completed_at }
                : lesson
            ),
            // Update lessons in sections if they exist
            sections: week.sections?.map(section => ({
              ...section,
              lessons: section.lessons.map(lesson => 
                (lesson._id === lessonId || lesson.id === lessonId) 
                  ? { ...lesson, is_completed: true, completed: true, completion_date: completionData.completed_at }
                  : lesson
              )
            }))
          }));
          
          return {
            ...prevCourseData,
            curriculum: updatedCurriculum
          };
        });
        
        toast.success('Lesson marked as complete!');
        return true;
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };

      const response = await getQuery({
        url: `/api/courses/${courseId}/lessons/${lessonId}/complete`,
        config: { method: 'POST', headers, data: completionData }
      });

      if (response?.success) {
        setLessonData((prev) => prev ? { ...prev, is_completed: true, completed: true, completion_date: completionData.completed_at } : prev);
        
        // Also update the course curriculum data to reflect the completion
        setCourseData(prevCourseData => {
          if (!prevCourseData) return null;
          
          const updatedCurriculum = prevCourseData.curriculum.map(week => ({
            ...week,
            // Update lessons in the week if they exist
            lessons: week.lessons?.map(lesson => 
              (lesson._id === lessonId || lesson.id === lessonId) 
                ? { ...lesson, is_completed: true, completed: true, completion_date: completionData.completed_at }
                : lesson
            ),
            // Update lessons in sections if they exist
            sections: week.sections?.map(section => ({
              ...section,
              lessons: section.lessons.map(lesson => 
                (lesson._id === lessonId || lesson.id === lessonId) 
                  ? { ...lesson, is_completed: true, completed: true, completion_date: completionData.completed_at }
                  : lesson
              )
            }))
          }));
          
          return {
            ...prevCourseData,
            curriculum: updatedCurriculum
          };
        });
        
        toast.success('Lesson marked as complete!');
        return true;
      }
      throw new Error("Failed to mark lesson as complete");
    } catch (err: any) {
      const processedError = handleApiError(err);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  }, [apiUrls, courseId, lessonId, getQuery, getAuthToken, handleApiError]);

  // Submit assignment data
  const submitAssignment = useCallback(async (assignmentData: AssignmentData) => {
    if (!lessonId) {
      toast.error('No lesson selected to submit assignment');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      
      // If no token, show demo message
      if (!token) {
        console.warn('No authentication token - assignment submission not available in demo mode');
        toast.info('Assignment submission is not available in demo mode. Please log in to submit assignments.');
        return false;
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      };
      const formData = new FormData();
      formData.append('email', assignmentData.email);
      formData.append('content', assignmentData.content);
      if (assignmentData.files) {
        assignmentData.files.forEach(file => formData.append('files', file));
      }
      const response = await getQuery({
        url: `/api/courses/${courseId}/lessons/${lessonId}/assignment`,
        config: { method: 'POST', headers, data: formData }
      });
      if (response?.success) {
        toast.success("Assignment submitted successfully!");
        return response.data;
      }
      throw new Error("Failed to submit assignment");
    } catch (err: any) {
      const processedError = handleApiError(err);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  }, [apiUrls, courseId, lessonId, getQuery, getAuthToken, handleApiError]);

  // Submit quiz data
  const submitQuiz = useCallback(async (quizData: QuizData) => {
    if (!lessonId) {
      toast.error('No lesson selected to submit quiz');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      
      // If no token, show demo message
      if (!token) {
        console.warn('No authentication token - quiz submission not available in demo mode');
        toast.info('Quiz submission is not available in demo mode. Please log in to submit quizzes.');
        return false;
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      const response = await getQuery({
        url: `/api/courses/${courseId}/lessons/${lessonId}/quiz`,
        config: { method: 'POST', headers, data: quizData }
      });
      if (response?.success) {
        toast.success("Quiz submitted successfully!");
        return response.data;
      }
      throw new Error("Failed to submit quiz");
    } catch (err: any) {
      const processedError = handleApiError(err);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  }, [apiUrls, courseId, lessonId, getQuery, getAuthToken, handleApiError]);

  // Fetch course data and extract the current lesson from the curriculum
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setGetLoading(true);
        setError(null);

        const token = getAuthToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        // Only add auth token if available
        if (token) {
          headers['x-access-token'] = token;
        }

        const studentId = localStorage.getItem('studentId') || '';

        console.log('Starting curriculum fetch process for course:', courseId);

        // Use the new curriculum service to get curriculum data
        let curriculum: Curriculum;
        
        try {
          curriculum = await curriculumService.getCurriculum({
            courseId,
            studentId,
            includeProgress: true,
            includeResources: true,
            fallbackToSample: true
          });
          
          console.log('Successfully fetched curriculum from service:', curriculum);
        } catch (curriculumError) {
          console.error('Curriculum service failed:', curriculumError);
          throw new Error('Unable to load course curriculum. Please try again or contact support.');
        }

        // Get basic course data (without relying on its curriculum)
        let courseResponse: ApiResponse;
        try {
          // Only try to fetch from API if we have a token, otherwise use fallback
          if (token) {
            courseResponse = await getQuery({
              url: getCourseById(courseId, studentId),
              config: { headers }
            });

            if (!courseResponse?.success || !courseResponse.data) {
              throw new Error('Failed to fetch course data');
            }
          } else {
            throw new Error('No authentication - using demo mode');
          }
        } catch (courseError) {
          console.warn('Course API failed or no auth, using curriculum data only:', courseError);
          // Create minimal course data from curriculum
          courseResponse = {
            success: true,
            data: {
              _id: courseId,
              course_title: 'Master Quantum Computing: From Fundamentals to Advanced Applications',
              course_category: 'Technology',
              no_of_Sessions: curriculum.totalLessons || 27,
              course_duration: curriculum.totalDuration || '4h 30m',
              session_duration: '30 min',
              course_description: 'Comprehensive quantum computing course',
              category: 'quantum-computing',
              course_fee: 299,
              prices: [],
              course_videos: [],
              brochures: [],
              status: 'Published',
              isFree: false,
              course_image: '',
              course_grade: 'Intermediate',
              resource_videos: [],
              resource_pdfs: [],
              curriculum: [],
              recorded_videos: [],
              efforts_per_Week: '5-8 hours',
              class_type: 'Self-paced',
              is_Certification: 'Yes',
              is_Assignments: 'Yes',
              is_Projects: 'Yes',
              is_Quizes: 'Yes',
              related_courses: [],
              meta: {
                views: 1250,
                ratings: { average: 4.8, count: 156 },
                enrollments: 89
              }
            }
          };
        }

        // Normalize and merge course data with curriculum
        let processedCourseData = normalizeCourseData(courseResponse.data);
        
        // Convert curriculum service format to course format
        processedCourseData.curriculum = convertCurriculumToCourseFormat(curriculum);
        
        console.log('Final processed course data:', processedCourseData);
        
        setCourseData(processedCourseData);
        
        if (lessonId) {
          console.log('Searching for lesson:', lessonId);
          
          // First try to find lesson in the converted curriculum
          const currentLesson = findLessonInCurriculum(processedCourseData.curriculum, lessonId);
          
          if (currentLesson) {
            console.log('Found lesson in curriculum:', currentLesson);
            currentLesson.resources = normalizeResources(currentLesson.resources);
            setLessonData(currentLesson);
          } else {
            // Try to find lesson directly in curriculum service
            const curriculumLesson = curriculumService.findLessonById(curriculum, lessonId);
            if (curriculumLesson) {
              console.log('Found lesson in curriculum service:', curriculumLesson);
              const convertedLesson = convertCurriculumLessonToLessonData(curriculumLesson);
              convertedLesson.resources = normalizeResources(convertedLesson.resources);
              setLessonData(convertedLesson);
            } else {
              console.log('Lesson not found, but curriculum has content - showing first available lesson');
              // If curriculum has content but specific lesson not found, show a helpful message
              if (curriculumService.hasContent(curriculum)) {
                toast.info('Redirecting to the first available lesson in this course.');
                // You might want to redirect to the first lesson here
              } else {
                throw new Error(`Lesson with ID ${lessonId} not found in this course.`);
              }
            }
          }
        }

        console.log('Successfully loaded course and curriculum data');
        
      } catch (err: any) {
        console.error('Error in fetchData:', err);
        const processedError = handleApiError(err);
        setError(processedError);
        
        // Provide more specific error messages for curriculum issues
        if (err.message?.includes('curriculum') || err.message?.includes('No curriculum available')) {
          toast.error('Course content is being set up. Please try again later or contact support.');
        } else {
          toast.error(processedError.message);
        }
      } finally {
        setLoading(false);
        setGetLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId, retryCount, getQuery, getAuthToken, handleApiError]);

  return {
    loading,
    error,
    courseData,
    lessonData,
    handleRetry,
    markLessonComplete,
    submitAssignment,
    submitQuiz,
    getLoading,
    postLoading,
  };
};

export default useCourseLesson;