import { apiBaseUrl } from '@/apis';

// Interfaces for tracking progress
export interface ILessonNote {
  _id?: string;
  lesson_id: string;
  content: string;
  timestamp?: number; // For video-specific notes
  created_at?: string;
  updated_at?: string;
}

export interface ILessonComment {
  _id?: string;
  lesson_id: string;
  content: string;
  timestamp: number; // Timestamp in the video where comment was made
  created_at?: string;
  updated_at?: string;
  replies?: ILessonComment[];
}

export interface ILessonProgress {
  lesson_id: string;
  completed: boolean;
  completion_date?: string;
  watch_duration?: number; // Seconds watched
  completion_percentage?: number; // 0-100
  last_position?: number; // Last watched position in video
  notes?: ILessonNote[];
  comments?: ILessonComment[];
}

export interface ISectionProgress {
  section_id: string;
  lessons: ILessonProgress[];
  completed: boolean;
  completion_percentage: number;
}

export interface ICourseProgress {
  _id?: string;
  course_id: string;
  student_id: string;
  sections: ISectionProgress[];
  overall_progress: number; // 0-100
  last_accessed: string;
  start_date: string;
  estimated_completion_date?: string;
}

export interface IProgressStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_lessons: number;
  completed_lessons: number;
  average_completion: number;
  study_streak: number; // Days in a row with activity
  total_study_time: number; // In minutes
}

/**
 * Progress model for tracking and managing course progress
 */
export class ProgressModel {
  /**
   * Fetches the progress for a course for a specific student
   * @param courseId - The course ID
   * @param studentId - The student ID
   * @returns Promise with the course progress data
   */
  static async getCourseProgress(courseId: string, studentId: string): Promise<ICourseProgress> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/student/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw error;
    }
  }

  /**
   * Fetches progress for all courses for a student
   * @param studentId - The student ID
   * @returns Promise with an array of course progress data
   */
  static async getStudentProgress(studentId: string): Promise<ICourseProgress[]> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/student/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch student progress: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching student progress:', error);
      throw error;
    }
  }

  /**
   * Fetches progress statistics for a student
   * @param studentId - The student ID
   * @returns Promise with progress statistics
   */
  static async getProgressStats(studentId: string): Promise<IProgressStats> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/stats/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch progress stats: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      throw error;
    }
  }

  /**
   * Marks a lesson as complete or incomplete
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param studentId - The student ID
   * @param completed - Whether the lesson is completed
   * @returns Promise with the updated lesson progress
   */
  static async updateLessonCompletion(
    courseId: string,
    lessonId: string,
    studentId: string,
    completed: boolean
  ): Promise<ILessonProgress> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/student/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update lesson completion: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating lesson completion:', error);
      throw error;
    }
  }

  /**
   * Updates the video watch position for a lesson
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param studentId - The student ID
   * @param position - Current position in the video (seconds)
   * @param duration - Total watch duration (seconds)
   * @returns Promise with the updated lesson progress
   */
  static async updateWatchPosition(
    courseId: string,
    lessonId: string,
    studentId: string,
    position: number,
    duration: number
  ): Promise<ILessonProgress> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/position/student/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position, duration }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update watch position: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating watch position:', error);
      throw error;
    }
  }

  /**
   * Adds a note to a lesson
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param studentId - The student ID
   * @param note - The note content
   * @param timestamp - Optional timestamp in the video for the note
   * @returns Promise with the created note
   */
  static async addLessonNote(
    courseId: string,
    lessonId: string,
    studentId: string,
    content: string,
    timestamp?: number
  ): Promise<ILessonNote> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/student/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, timestamp }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add lesson note: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding lesson note:', error);
      throw error;
    }
  }

  /**
   * Updates an existing note
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param noteId - The note ID
   * @param studentId - The student ID
   * @param content - The updated note content
   * @returns Promise with the updated note
   */
  static async updateLessonNote(
    courseId: string,
    lessonId: string,
    noteId: string,
    studentId: string,
    content: string
  ): Promise<ILessonNote> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/${noteId}/student/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update lesson note: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating lesson note:', error);
      throw error;
    }
  }

  /**
   * Deletes a note
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param noteId - The note ID
   * @param studentId - The student ID
   * @returns Promise indicating success
   */
  static async deleteLessonNote(
    courseId: string,
    lessonId: string,
    noteId: string,
    studentId: string
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/${noteId}/student/${studentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete lesson note: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting lesson note:', error);
      throw error;
    }
  }

  /**
   * Adds a comment to a lesson video at a specific timestamp
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param studentId - The student ID
   * @param content - The comment content
   * @param timestamp - Timestamp in the video for the comment
   * @returns Promise with the created comment
   */
  static async addVideoComment(
    courseId: string,
    lessonId: string,
    studentId: string,
    content: string,
    timestamp: number
  ): Promise<ILessonComment> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/student/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, timestamp }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add video comment: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding video comment:', error);
      throw error;
    }
  }

  /**
   * Updates an existing comment
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param commentId - The comment ID
   * @param studentId - The student ID
   * @param content - The updated comment content
   * @returns Promise with the updated comment
   */
  static async updateVideoComment(
    courseId: string,
    lessonId: string,
    commentId: string,
    studentId: string,
    content: string
  ): Promise<ILessonComment> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/${commentId}/student/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update video comment: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating video comment:', error);
      throw error;
    }
  }

  /**
   * Deletes a comment
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param commentId - The comment ID
   * @param studentId - The student ID
   * @returns Promise indicating success
   */
  static async deleteVideoComment(
    courseId: string,
    lessonId: string,
    commentId: string,
    studentId: string
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/${commentId}/student/${studentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete video comment: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting video comment:', error);
      throw error;
    }
  }

  /**
   * Gets all notes for a lesson
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param studentId - The student ID
   * @returns Promise with an array of notes
   */
  static async getLessonNotes(
    courseId: string,
    lessonId: string,
    studentId: string
  ): Promise<ILessonNote[]> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/notes/student/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson notes: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching lesson notes:', error);
      throw error;
    }
  }

  /**
   * Gets all comments for a lesson
   * @param courseId - The course ID
   * @param lessonId - The lesson ID
   * @param studentId - The student ID
   * @returns Promise with an array of comments
   */
  static async getLessonComments(
    courseId: string,
    lessonId: string,
    studentId: string
  ): Promise<ILessonComment[]> {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/course/${courseId}/lesson/${lessonId}/comments/student/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson comments: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching lesson comments:', error);
      throw error;
    }
  }
}

export default ProgressModel;

/**
 * BACKEND REQUIREMENTS
 * 
 * The following REST API endpoints need to be implemented on the backend:
 * 
 * 1. Course Progress Endpoints:
 *    - GET /progress/course/:courseId/student/:studentId - Get progress for a specific course
 *    - POST /progress/course/:courseId/student/:studentId - Create/initialize progress for a course
 *    - PATCH /progress/course/:courseId/student/:studentId - Update overall course progress
 * 
 * 2. Student Progress Endpoints:
 *    - GET /progress/student/:studentId - Get progress for all courses for a student
 *    - GET /progress/stats/:studentId - Get progress statistics for a student
 * 
 * 3. Lesson Progress Endpoints:
 *    - GET /progress/course/:courseId/lesson/:lessonId/student/:studentId - Get progress for a specific lesson
 *    - PATCH /progress/course/:courseId/lesson/:lessonId/student/:studentId - Update lesson completion status
 *    - PATCH /progress/course/:courseId/lesson/:lessonId/position/student/:studentId - Update video position
 * 
 * 4. Notes Endpoints:
 *    - GET /progress/course/:courseId/lesson/:lessonId/notes/student/:studentId - Get all notes for a lesson
 *    - POST /progress/course/:courseId/lesson/:lessonId/notes/student/:studentId - Create a new note
 *    - PATCH /progress/course/:courseId/lesson/:lessonId/notes/:noteId/student/:studentId - Update a note
 *    - DELETE /progress/course/:courseId/lesson/:lessonId/notes/:noteId/student/:studentId - Delete a note
 * 
 * 5. Comments Endpoints:
 *    - GET /progress/course/:courseId/lesson/:lessonId/comments/student/:studentId - Get all comments for a lesson
 *    - POST /progress/course/:courseId/lesson/:lessonId/comments/student/:studentId - Create a new comment
 *    - PATCH /progress/course/:courseId/lesson/:lessonId/comments/:commentId/student/:studentId - Update a comment
 *    - DELETE /progress/course/:courseId/lesson/:lessonId/comments/:commentId/student/:studentId - Delete a comment
 * 
 * 6. Data Models Required:
 *    - CourseProgress: Stores overall progress for a course
 *    - LessonProgress: Stores progress for individual lessons
 *    - LessonNote: Stores notes for lessons
 *    - LessonComment: Stores comments for video timestamps
 *    - ProgressStats: Stores aggregated progress statistics
 * 
 * 7. Required Database Fields:
 *    - All models should include standard fields: _id, created_at, updated_at
 *    - CourseProgress: course_id, student_id, overall_progress, sections, last_accessed, start_date
 *    - LessonProgress: lesson_id, course_id, student_id, completed, completion_date, watch_duration, last_position
 *    - LessonNote: lesson_id, course_id, student_id, content, timestamp, created_at
 *    - LessonComment: lesson_id, course_id, student_id, content, timestamp, created_at
 */
