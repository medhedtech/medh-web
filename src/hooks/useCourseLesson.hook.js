import { useState, useEffect } from 'react';
import { apiUrls } from '@/apis';
import useGetQuery from './getQuery.hook';

export const useCourseLesson = (courseId, lessonId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { getQuery } = useGetQuery();
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };
  
  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  // Mark lesson as complete
  const markLessonComplete = async (completionData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error({
          message: "Authentication Required",
          type: "auth",
          details: "Please log in to mark lesson as complete"
        });
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      
      return await getQuery({
        url: apiUrls.courses.markLessonComplete(courseId, lessonId),
        method: 'POST',
        headers,
        data: completionData,
        onSuccess: (response) => {
          if (response?.success) {
            // Update local lesson data
            setLessonData(prev => ({
              ...prev,
              is_completed: true
            }));
            return true;
          }
          return false;
        },
        onError: (error) => {
          throw error;
        }
      });
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      throw error;
    }
  };
  
  // Submit assignment
  const submitAssignment = async (assignmentData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error({
          message: "Authentication Required",
          type: "auth",
          details: "Please log in to submit assignment"
        });
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      };
      
      const formData = new FormData();
      formData.append('email', assignmentData.email);
      formData.append('content', assignmentData.content);
      assignmentData.files.forEach(file => {
        formData.append('files', file);
      });
      
      return await getQuery({
        url: apiUrls.courses.submitAssignment(courseId, lessonId),
        method: 'POST',
        headers,
        data: formData,
        onSuccess: (response) => {
          if (response?.success) {
            return response.data;
          }
          throw new Error("Failed to submit assignment");
        },
        onError: (error) => {
          throw error;
        }
      });
    } catch (error) {
      console.error("Error submitting assignment:", error);
      throw error;
    }
  };
  
  // Submit quiz
  const submitQuiz = async (quizData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error({
          message: "Authentication Required",
          type: "auth",
          details: "Please log in to submit quiz"
        });
      }
      
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };
      
      return await getQuery({
        url: apiUrls.courses.submitQuiz(courseId, lessonId),
        method: 'POST',
        headers,
        data: quizData,
        onSuccess: (response) => {
          if (response?.success) {
            return response.data;
          }
          throw new Error("Failed to submit quiz");
        },
        onError: (error) => {
          throw error;
        }
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      throw error;
    }
  };
  
  // Fetch course and lesson data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        if (!token) {
          setError({
            message: "Authentication Required",
            type: "auth",
            details: "Please log in to view this lesson"
          });
          setLoading(false);
          return;
        }
        
        const headers = {
          'x-access-token': token,
          'Content-Type': 'application/json'
        };
        
        // Fetch course data
        await getQuery({
          url: apiUrls.courses.detail(courseId),
          headers,
          onSuccess: async (response) => {
            if (response?.success && response?.course) {
              setCourseData(response.course);
              
              // Find the current lesson
              if (response.course.sections) {
                const currentLesson = response.course.sections
                  .flatMap(section => section.lessons)
                  .find(lesson => lesson._id === lessonId);
                
                if (currentLesson) {
                  setLessonData(currentLesson);
                } else {
                  setError({
                    message: "Lesson not found",
                    type: "not_found",
                    details: "The requested lesson could not be found in this course"
                  });
                }
              } else {
                setError({
                  message: "No content available",
                  type: "empty",
                  details: "This course does not have any content yet"
                });
              }
            } else {
              setError({
                message: "Failed to load course",
                type: "api_error",
                details: "The course data is invalid or incomplete"
              });
            }
            setLoading(false);
          },
          onError: (error) => {
            console.error("Error fetching course data:", error);
            let errorMessage = {
              message: "Failed to load course",
              type: "unknown",
              details: error?.message || "Please try again later"
            };

            if (error?.response?.status === 401) {
              errorMessage = {
                message: "Session Expired",
                type: "auth",
                details: "Please log in again to continue"
              };
            } else if (error?.response?.status === 404) {
              errorMessage = {
                message: "Course Not Found",
                type: "not_found",
                details: "The requested course could not be found"
              };
            } else if (error?.response?.status >= 500) {
              errorMessage = {
                message: "Server Error",
                type: "server",
                details: "Our servers are experiencing issues. Please try again later"
              };
            }

            setError(errorMessage);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError({
          message: "An unexpected error occurred",
          type: "unknown",
          details: "There was a problem loading the course content"
        });
        setLoading(false);
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
    submitQuiz
  };
};

export default useCourseLesson; 