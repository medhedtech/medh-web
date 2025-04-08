import { ICourse, ICourseFilters } from '@/types/course.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.app';

export async function getCourseById(id: string): Promise<ICourse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch course: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getCourseById:', error);
    throw error;
  }
}

export async function getAllCourses(filters?: ICourseFilters): Promise<ICourse[]> {
  try {
    const queryParams = filters ? `?${new URLSearchParams(filters as any).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/api/courses${queryParams}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch courses: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    throw error;
  }
}

export async function createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create course: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
}

export async function updateCourse(id: string, courseData: Partial<ICourse>): Promise<ICourse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update course: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete course: ${error}`);
    }
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    throw error;
  }
} 