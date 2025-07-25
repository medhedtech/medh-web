// curriculum.api.ts
import { apiBaseUrl, apiUtils } from './utils';

/**
 * Comprehensive Curriculum API endpoints for handling course curriculum data
 * Specifically designed to handle "No curriculum available" scenarios
 */
export const curriculumAPI = {
  // Core curriculum retrieval endpoints
  getCurriculumByCourseId: (courseId: string, options: {
    includeProgress?: boolean;
    studentId?: string;
    includeResources?: boolean;
    includeLessonDetails?: boolean;
    fallbackToEmpty?: boolean;
  } = {}): string => {
    if (!courseId) throw new Error('Course ID is required');
    const { 
      includeProgress = false, 
      studentId = "", 
      includeResources = true, 
      includeLessonDetails = true,
      fallbackToEmpty = true 
    } = options;
    
    const queryParams = new URLSearchParams();
    
    if (includeProgress && studentId) {
      queryParams.append('include_progress', 'true');
      queryParams.append('student_id', studentId);
    }
    if (includeResources) {
      queryParams.append('include_resources', 'true');
    }
    if (includeLessonDetails) {
      queryParams.append('include_lesson_details', 'true');
    }
    if (fallbackToEmpty) {
      queryParams.append('fallback_to_empty', 'true');
    }
    
    const queryString = queryParams.toString();
    return `${apiBaseUrl}/curriculum/course/${courseId}${queryString ? '?' + queryString : ''}`;
  },

  // Get or create curriculum (handles "No curriculum available" scenarios)
  getOrCreateCurriculum: (courseId: string, options: {
    templateId?: string;
    structure?: 'weekly' | 'sectioned' | 'linear';
  } = {}): string => {
    if (!courseId) throw new Error('Course ID is required');
    const { templateId = "", structure = "sectioned" } = options;
    
    const queryParams = new URLSearchParams();
    queryParams.append('structure', structure);
    if (templateId) {
      queryParams.append('template_id', templateId);
    }
    
    return `${apiBaseUrl}/curriculum/course/${courseId}/get-or-create?${queryParams.toString()}`;
  },

  // Check curriculum availability
  checkCurriculumAvailability: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/check-availability`;
  },

  // Get curriculum summary (minimal data for existence check)
  getCurriculumSummary: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/summary`;
  },

  // Lesson-specific endpoints
  getLessonById: (courseId: string, lessonId: string, options: {
    studentId?: string;
    includeProgress?: boolean;
    includeResources?: boolean;
    includeComments?: boolean;
  } = {}): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!lessonId) throw new Error('Lesson ID is required');
    
    const { studentId = "", includeProgress = false, includeResources = true, includeComments = false } = options;
    const queryParams = new URLSearchParams();
    
    if (studentId) {
      queryParams.append('student_id', studentId);
    }
    if (includeProgress) {
      queryParams.append('include_progress', 'true');
    }
    if (includeResources) {
      queryParams.append('include_resources', 'true');
    }
    if (includeComments) {
      queryParams.append('include_comments', 'true');
    }
    
    const queryString = queryParams.toString();
    return `${apiBaseUrl}/curriculum/course/${courseId}/lesson/${lessonId}${queryString ? '?' + queryString : ''}`;
  },

  // Navigation endpoints
  getNavigationData: (courseId: string, currentLessonId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!currentLessonId) throw new Error('Current lesson ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/navigation/${currentLessonId}`;
  },

  getAdjacentLessons: (courseId: string, currentLessonId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!currentLessonId) throw new Error('Current lesson ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/lesson/${currentLessonId}/adjacent`;
  },

  // Curriculum management endpoints
  createCurriculum: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}`;
  },

  updateCurriculum: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}`;
  },

  deleteCurriculum: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}`;
  },

  // Section management
  addSection: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections`;
  },

  updateSection: (courseId: string, sectionId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!sectionId) throw new Error('Section ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections/${sectionId}`;
  },

  deleteSection: (courseId: string, sectionId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!sectionId) throw new Error('Section ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections/${sectionId}`;
  },

  reorderSections: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections/reorder`;
  },

  // Lesson management
  addLesson: (courseId: string, sectionId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!sectionId) throw new Error('Section ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections/${sectionId}/lessons`;
  },

  updateLesson: (courseId: string, sectionId: string, lessonId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!sectionId) throw new Error('Section ID is required');
    if (!lessonId) throw new Error('Lesson ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections/${sectionId}/lessons/${lessonId}`;
  },

  deleteLesson: (courseId: string, sectionId: string, lessonId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!sectionId) throw new Error('Section ID is required');
    if (!lessonId) throw new Error('Lesson ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections/${sectionId}/lessons/${lessonId}`;
  },

  reorderLessons: (courseId: string, sectionId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!sectionId) throw new Error('Section ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sections/${sectionId}/lessons/reorder`;
  },

  batchUpdateLessons: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/batch-update-lessons`;
  },

  // Analytics and statistics
  getCurriculumStats: (courseId: string, options: {
    studentId?: string;
    includeProgress?: boolean;
    includeEngagement?: boolean;
  } = {}): string => {
    if (!courseId) throw new Error('Course ID is required');
    
    const { studentId = "", includeProgress = false, includeEngagement = false } = options;
    const queryParams = new URLSearchParams();
    
    if (studentId) {
      queryParams.append('student_id', studentId);
    }
    if (includeProgress) {
      queryParams.append('include_progress', 'true');
    }
    if (includeEngagement) {
      queryParams.append('include_engagement', 'true');
    }
    
    const queryString = queryParams.toString();
    return `${apiBaseUrl}/curriculum/course/${courseId}/stats${queryString ? '?' + queryString : ''}`;
  },

  getLessonAnalytics: (courseId: string, lessonId: string, options: {
    period?: 'day' | 'week' | 'month' | 'year';
    includeEngagement?: boolean;
  } = {}): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!lessonId) throw new Error('Lesson ID is required');
    
    const { period = 'week', includeEngagement = false } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('period', period);
    if (includeEngagement) {
      queryParams.append('include_engagement', 'true');
    }
    
    return `${apiBaseUrl}/curriculum/course/${courseId}/lesson/${lessonId}/analytics?${queryParams.toString()}`;
  },

  // Validation and quality checks
  validateCurriculum: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/validate`;
  },

  checkCurriculumIntegrity: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/integrity-check`;
  },

  // Template and duplication features
  importFromTemplate: (courseId: string, templateId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!templateId) throw new Error('Template ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/import/${templateId}`;
  },

  exportAsTemplate: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/export`;
  },

  duplicateFromCourse: (courseId: string, sourceCourseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    if (!sourceCourseId) throw new Error('Source course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/duplicate/${sourceCourseId}`;
  },

  getTemplates: (options: {
    category?: string;
    difficulty?: string;
    duration?: string;
    page?: number;
    limit?: number;
    includeEmpty?: boolean;
  } = {}): string => {
    const { 
      category = "", 
      difficulty = "", 
      duration = "", 
      page = 1, 
      limit = 10,
      includeEmpty = false 
    } = options;
    
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    
    if (category) queryParams.append('category', category);
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (duration) queryParams.append('duration', duration);
    if (includeEmpty) queryParams.append('include_empty', 'true');
    
    return `${apiBaseUrl}/curriculum/templates?${queryParams.toString()}`;
  },

  // Emergency endpoints for handling missing curriculum
  initializeEmptyCurriculum: (courseId: string, structure: 'weekly' | 'sectioned' | 'linear' = 'sectioned'): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/initialize-empty?structure=${structure}`;
  },

  recoverCurriculum: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/recover`;
  },

  // Course integration endpoints
  syncWithCourseData: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/sync-with-course`;
  },

  getCurriculumCompatibility: (courseId: string): string => {
    if (!courseId) throw new Error('Course ID is required');
    return `${apiBaseUrl}/curriculum/course/${courseId}/compatibility`;
  }
};

// Utility functions for curriculum handling
export const curriculumUtils = {
  /**
   * Checks if curriculum data is valid and not empty
   */
  isValidCurriculum: (curriculum: any): boolean => {
    console.log('Checking curriculum validity:', curriculum);
    
    if (!curriculum) {
      console.log('Curriculum is null/undefined');
      return false;
    }
    
    // Check if has any content structure
    const hasWeeks = curriculum.weeks && curriculum.weeks.length > 0;
    const hasSections = curriculum.sections && curriculum.sections.length > 0;
    const hasLessons = curriculum.lessons && curriculum.lessons.length > 0;
    
    console.log('Curriculum structure check:', { hasWeeks, hasSections, hasLessons });
    
    const isValid = hasWeeks || hasSections || hasLessons;
    console.log('Curriculum is valid:', isValid);
    
    return isValid;
  },

  /**
   * Generates a fallback curriculum structure
   */
  generateFallbackCurriculum: (courseId: string, courseTitle: string = 'Course') => ({
    _id: `curriculum_${courseId}`,
    courseId,
    structure_type: 'sectioned' as const,
    totalLessons: 0,
    totalSections: 0,
    totalWeeks: 0,
    id: 'getting-started',
    weekTitle: 'Getting Started',
    weekDescription: 'This course curriculum is being set up. Check back soon!',
    sections: [{
      _id: `section_${Date.now()}`,
      id: `section_${Date.now()}`,
      title: 'Getting Started',
      description: 'This course curriculum is being set up. Check back soon!',
      order: 1,
      lessons: [],
      totalLessons: 0,
      completedLessons: 0
    }],
    lessons: [],
    isPublished: false,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),

  /**
   * Extracts navigation data from curriculum
   */
  extractNavigationFromCurriculum: (curriculum: any, currentLessonId: string) => {
    if (!curriculum || !curriculumUtils.isValidCurriculum(curriculum)) {
      return { currentLesson: null, previousLesson: null, nextLesson: null };
    }

    // Flatten all lessons from curriculum structure
    const allLessons: any[] = [];
    
    if (curriculum.weeks) {
      curriculum.weeks.forEach((week: any) => {
        if (week.sections) {
          week.sections.forEach((section: any) => {
            if (section.lessons) {
              allLessons.push(...section.lessons);
            }
          });
        }
        if (week.lessons) {
          allLessons.push(...week.lessons);
        }
      });
    }
    
    if (curriculum.sections) {
      curriculum.sections.forEach((section: any) => {
        if (section.lessons) {
          allLessons.push(...section.lessons);
        }
      });
    }
    
    if (curriculum.lessons) {
      allLessons.push(...curriculum.lessons);
    }

    // Find current lesson index
    const currentIndex = allLessons.findIndex(lesson => 
      lesson._id === currentLessonId || lesson.id === currentLessonId
    );

    if (currentIndex === -1) {
      return { currentLesson: null, previousLesson: null, nextLesson: null };
    }

    return {
      currentLesson: allLessons[currentIndex],
      previousLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      nextLesson: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
  }
};

export default curriculumAPI; 