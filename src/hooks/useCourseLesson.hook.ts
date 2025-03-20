import { useState, useEffect } from 'react';
import { apiUrls } from '@/apis';
import useGetQuery from './getQuery.hook';
import { toast } from 'react-toastify';

// Types for the course data structure
interface CourseWeek {
  weekTitle: string;
  weekDescription: string;
  sections: CourseSection[];
}

interface CourseSection {
  title: string;
  description: string;
  order: number;
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
}

interface LessonData {
  _id?: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  videoUrl?: string;
  resources?: ResourceFile[];
  is_completed?: boolean;
  completion_date?: string;
  type?: string;
  weekTitle: string;
  sectionTitle: string;
  assignments: AssignmentData[];
  quizzes: QuizData[];
}

interface CoursePrice {
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
  ratings: {
    average: number;
    count: number;
  };
  enrollments: number;
  lastUpdated: string;
}

interface CourseData {
  _id: string;
  course_category: string;
  course_title: string;
  course_tag: string;
  no_of_Sessions: number;
  course_duration: string;
  session_duration: string;
  course_description: {
    program_overview: string;
    benefits: string;
  };
  category: string;
  course_fee: number;
  prices: CoursePrice[];
  course_videos: string[];
  brochures: string[];
  status: string;
  isFree: boolean;
  course_image: string;
  course_grade: string;
  resource_videos: string[];
  resource_pdfs: {
    title: string;
    url: string;
    description: string;
    size_mb: number;
    pages: number;
    upload_date: string;
  }[];
  curriculum: CourseWeek[];
  faqs: {
    question: string;
    answer: string;
  }[];
  tools_technologies: {
    name: string;
    category: string;
    description: string;
    logo_url: string;
  }[];
  bonus_modules: {
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
  min_hours_per_week: number;
  max_hours_per_week: number;
  category_type: string;
  meta: CourseMeta;
}

interface ApiResponse {
  success: boolean;
  data: CourseData;
}

interface AssignmentData {
  email: string;
  content: string;
  files?: File[];
}

interface CompletionData {
  completed_at: string;
  duration?: number;
}

interface QuizData {
  answers: Record<string, any>;
  duration?: number;
  score?: number;
}

export const useCourseLesson = (courseId: string, lessonId: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  
  const { getQuery } = useGetQuery();
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };
  
  // Helper function to get auth token
  const getAuthToken = (): string => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication Required');
      }
      return token;
    }
    return '';
  };

  // Helper function to handle API errors
  const handleApiError = (error: any) => {
    console.error("API Error:", error);
    
    // Check if it's a network error (no response at all)
    if (error.message === 'Network Error' || (!error.response && !error.success)) {
      return new Error('Network Error: Please check your internet connection');
    }

    // If we have a response with success: true, this is not an error
    if (error.success === true && error.data) {
      return null;
    }

    // Handle different HTTP status codes
    const statusMessages: Record<number, string> = {
      401: 'Session Expired: Please log in again to continue',
      403: 'Access Denied: You don\'t have permission to access this content',
      404: 'Content Not Found: The requested lesson could not be found',
      500: 'Server Error: Our servers are experiencing issues. Please try again later'
    };

    const message = error.response?.status ? statusMessages[error.response.status] : 
                   error.response?.data?.message || 
                   error.message ||
                   'An unexpected error occurred';

    return new Error(message);
  };
  
  // Mark lesson as complete
  const markLessonComplete = async (completionData: CompletionData): Promise<boolean> => {
    try {
      setPostLoading(true);
      const token = getAuthToken();
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      
      const response = await getQuery({
        url: apiUrls.courses.markLessonComplete(courseId, lessonId),
        config: {
          method: 'POST',
          headers,
          data: completionData
        }
      });

      if (response?.success) {
        setLessonData(prev => ({
          ...prev!,
          is_completed: true,
          completion_date: completionData.completed_at
        }));
        toast.success('Lesson marked as complete!');
        return true;
      }
      
      throw new Error("Failed to mark lesson as complete");
    } catch (error) {
      const processedError = handleApiError(error);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  };
  
  // Submit assignment
  const submitAssignment = async (assignmentData: AssignmentData) => {
    try {
      setPostLoading(true);
      const token = getAuthToken();
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      };
      
      const formData = new FormData();
      formData.append('email', assignmentData.email);
      formData.append('content', assignmentData.content);
      if (assignmentData.files) {
        assignmentData.files.forEach(file => {
          formData.append('files', file);
        });
      }
      
      const response = await getQuery({
        url: apiUrls.courses.submitAssignment(courseId, lessonId),
        config: {
          method: 'POST',
          headers,
          data: formData
        }
      });

      if (response?.success) {
        toast.success("Assignment submitted successfully!");
        return response.data;
      }
      
      throw new Error("Failed to submit assignment");
    } catch (error) {
      const processedError = handleApiError(error);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  };
  
  // Submit quiz
  const submitQuiz = async (quizData: QuizData) => {
    try {
      setPostLoading(true);
      const token = getAuthToken();
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      
      const response = await getQuery({
        url: apiUrls.courses.submitQuiz(courseId, lessonId),
        config: {
          method: 'POST',
          headers,
          data: quizData
        }
      });

      if (response?.success) {
        toast.success("Quiz submitted successfully!");
        return response.data;
      }
      
      throw new Error("Failed to submit quiz");
    } catch (error) {
      const processedError = handleApiError(error);
      toast.error(processedError.message);
      throw processedError;
    } finally {
      setPostLoading(false);
    }
  };
  
  // Fetch course and lesson data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setGetLoading(true);
        setError(null);
        
        const token = getAuthToken();
        const headers = {
          'x-access-token': token,
          'Content-Type': 'application/json'
        };
        
        // Fetch course data
        const response: ApiResponse = await getQuery({
          url: apiUrls.courses.getCourseById(courseId),
          config: { headers }
        });

        if (response?.success && response?.data) {
          setCourseData(response.data);
          
          // Find the current lesson in the curriculum structure
          let currentLesson: LessonData | undefined;
          let currentWeek: any;
          let currentSection: any;
          
          // Iterate through weeks and sections to find the lesson
          for (const week of response.data.curriculum) {
            for (const section of week.sections) {
              const lesson = section.lessons.find(l => l._id === lessonId);
              if (lesson) {
                currentLesson = {
                  ...lesson,
                  weekTitle: week.weekTitle,
                  sectionTitle: section.title,
                  assignments: section.assignments,
                  quizzes: section.quizzes
                };
                currentWeek = week;
                currentSection = section;
                break;
              }
            }
            if (currentLesson) break;
          }
          
          if (currentLesson) {
            setLessonData(currentLesson);
            return;
          }
          
          throw new Error('Lesson not found in this course. Please check the lesson ID and try again.');
        }
        
        throw new Error('Invalid server response');
      } catch (error) {
        const processedError = handleApiError(error);
        if (processedError) {
          setError(processedError);
          toast.error(processedError.message);
        }
      } finally {
        setLoading(false);
        setGetLoading(false);
      }
    };
    
    if (courseId && lessonId) {
      fetchData();
    }
  }, [courseId, lessonId, retryCount]);
  
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
    postLoading
  };
};

export default useCourseLesson; 