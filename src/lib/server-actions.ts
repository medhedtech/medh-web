'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiUrls, apiBaseUrl } from '@/apis';
import { apiClient } from '@/apis/apiClient';

// Types for server actions
interface IServerActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ICourse {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface IBlog {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface IUser {
  _id: string;
  full_name: string;
  email: string;
  role: string[];
  status: string;
  phone_numbers?: Array<{
    country: string;
    number: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// ===== COURSE ACTIONS =====

/**
 * Server action to fetch all courses with filters and pagination
 * This replaces client-side course fetching in components
 */
export async function fetchCoursesAction(
  filters: {
    category?: string;
    level?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<IServerActionResponse<{
  courses: ICourse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>> {
  try {
    const {
      category = 'all',
      level = 'all',
      search = '',
      status = 'active',
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    // Build query parameters
    const queryParams = new URLSearchParams({
      category: category !== 'all' ? category : '',
      level: level !== 'all' ? level : '',
      search,
      status,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    // Remove empty parameters
    Array.from(queryParams.entries()).forEach(([key, value]) => {
      if (!value) queryParams.delete(key);
    });

    const response = await fetch(`${apiBaseUrl}${apiUrls.course.getAllCourses}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: {
        courses: data.courses || [],
        totalCount: data.totalCount || 0,
        totalPages: Math.ceil((data.totalCount || 0) / limit),
        currentPage: page
      }
    };
  } catch (error) {
    console.error('Server Action - Fetch Courses Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch courses'
    };
  }
}

/**
 * Server action to fetch course details with related data
 * Optimized for server-side rendering with caching
 */
export async function fetchCourseDetailsAction(
  courseId: string
): Promise<IServerActionResponse<{
  course: ICourse;
  relatedCourses: ICourse[];
  instructor: IUser;
}>> {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Parallel fetching for better performance
    const [courseResponse, relatedCoursesResponse] = await Promise.all([
      fetch(`${apiBaseUrl}${apiUrls.course.getCourseById}/${courseId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 600 } // Revalidate every 10 minutes
      }),
      fetch(`${apiBaseUrl}${apiUrls.course.getAllCourses}?limit=4&exclude=${courseId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 300 }
      })
    ]);

    if (!courseResponse.ok) {
      throw new Error(`Course not found: ${courseResponse.status}`);
    }

    const courseData = await courseResponse.json();
    const relatedCoursesData = await relatedCoursesResponse.json();

    // Fetch instructor details if available
    let instructorData = null;
    if (courseData.instructor) {
      try {
        const instructorResponse = await fetch(`${apiBaseUrl}${apiUrls.Instructor.getInstructorById}/${courseData.instructor}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'force-cache',
          next: { revalidate: 1800 } // Revalidate every 30 minutes
        });
        
        if (instructorResponse.ok) {
          instructorData = await instructorResponse.json();
        }
      } catch (error) {
        console.warn('Failed to fetch instructor data:', error);
      }
    }

    return {
      success: true,
      data: {
        course: courseData,
        relatedCourses: relatedCoursesData.courses || [],
        instructor: instructorData
      }
    };
  } catch (error) {
    console.error('Server Action - Fetch Course Details Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch course details'
    };
  }
}

// ===== BLOG ACTIONS =====

/**
 * Server action to fetch blogs with pagination and filters
 * Replaces client-side blog loading
 */
export async function fetchBlogsAction(
  filters: {
    category?: string;
    search?: string;
    status?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<IServerActionResponse<{
  blogs: IBlog[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  categories: string[];
}>> {
  try {
    const {
      category = 'all',
      search = '',
      status = 'published',
      featured,
      page = 1,
      limit = 9,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    // Build query parameters
    const queryParams = new URLSearchParams({
      category: category !== 'all' ? category : '',
      search,
      status,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (featured !== undefined) {
      queryParams.append('featured', featured.toString());
    }

    // Remove empty parameters
    Array.from(queryParams.entries()).forEach(([key, value]) => {
      if (!value) queryParams.delete(key);
    });

    // Parallel fetching for blogs and categories
    const [blogsResponse, categoriesResponse] = await Promise.all([
      fetch(`${apiBaseUrl}${apiUrls.blog.getAllBlogs}?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 180 } // Revalidate every 3 minutes
      }),
      fetch(`${apiBaseUrl}${apiUrls.blog.getCategories}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 1800 } // Revalidate every 30 minutes
      })
    ]);

    if (!blogsResponse.ok) {
      throw new Error(`Failed to fetch blogs: ${blogsResponse.status}`);
    }

    const blogsData = await blogsResponse.json();
    const categoriesData = categoriesResponse.ok ? await categoriesResponse.json() : { categories: [] };

    return {
      success: true,
      data: {
        blogs: blogsData.blogs || [],
        totalCount: blogsData.totalCount || 0,
        totalPages: Math.ceil((blogsData.totalCount || 0) / limit),
        currentPage: page,
        categories: categoriesData.categories || []
      }
    };
  } catch (error) {
    console.error('Server Action - Fetch Blogs Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blogs'
    };
  }
}

/**
 * Server action to fetch blog details with related content
 */
export async function fetchBlogDetailsAction(
  blogId: string
): Promise<IServerActionResponse<{
  blog: IBlog;
  relatedBlogs: IBlog[];
  author: IUser;
}>> {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }

    // Parallel fetching for better performance
    const [blogResponse, relatedBlogsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}${apiUrls.blog.getBlogById}/${blogId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 300 }
      }),
      fetch(`${apiBaseUrl}${apiUrls.blog.getAllBlogs}?limit=3&exclude=${blogId}&status=published`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 300 }
      })
    ]);

    if (!blogResponse.ok) {
      throw new Error(`Blog not found: ${blogResponse.status}`);
    }

    const blogData = await blogResponse.json();
    const relatedBlogsData = await relatedBlogsResponse.json();

    // Fetch author details if available
    let authorData = null;
    if (blogData.author) {
      try {
        const authorResponse = await fetch(`${apiBaseUrl}/users/${blogData.author}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'force-cache',
          next: { revalidate: 1800 }
        });
        
        if (authorResponse.ok) {
          authorData = await authorResponse.json();
        }
      } catch (error) {
        console.warn('Failed to fetch author data:', error);
      }
    }

    return {
      success: true,
      data: {
        blog: blogData,
        relatedBlogs: relatedBlogsData.blogs || [],
        author: authorData
      }
    };
  } catch (error) {
    console.error('Server Action - Fetch Blog Details Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blog details'
    };
  }
}

// ===== USER & DASHBOARD ACTIONS =====

/**
 * Server action to fetch user dashboard data
 * Consolidates multiple API calls into single server action
 */
export async function fetchUserDashboardAction(
  userId: string,
  userRole: string
): Promise<IServerActionResponse<{
  user: IUser;
  courses: ICourse[];
  recentActivity: any[];
  notifications: any[];
  stats: any;
}>> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Define role-specific API endpoints
    const roleEndpoints = {
      student: {
        courses: `${apiUrls.student.getEnrolledCourses}/${userId}`,
        stats: `${apiUrls.student.getStats}/${userId}`
      },
      instructor: {
        courses: `${apiUrls.Instructor.getCourses}/${userId}`,
        stats: `${apiUrls.Instructor.getStats}/${userId}`
      },
      admin: {
        courses: `${apiUrls.course.getAllCourses}?limit=5`,
        stats: `${apiUrls.admin.getStats}`
      }
    };

    const endpoints = roleEndpoints[userRole as keyof typeof roleEndpoints] || roleEndpoints.student;

    // Parallel fetching for dashboard data
    const [userResponse, coursesResponse, statsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 600 }
      }),
      fetch(`${apiBaseUrl}${endpoints.courses}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 300 }
      }),
      fetch(`${apiBaseUrl}${endpoints.stats}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 180 }
      })
    ]);

    if (!userResponse.ok) {
      throw new Error(`User not found: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const coursesData = coursesResponse.ok ? await coursesResponse.json() : { courses: [] };
    const statsData = statsResponse.ok ? await statsResponse.json() : {};

    return {
      success: true,
      data: {
        user: userData,
        courses: coursesData.courses || [],
        recentActivity: [], // TODO: Implement activity fetching
        notifications: [], // TODO: Implement notifications fetching
        stats: statsData
      }
    };
  } catch (error) {
    console.error('Server Action - Fetch User Dashboard Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
    };
  }
}

// ===== REVALIDATION ACTIONS =====

/**
 * Server action to revalidate specific pages after data mutations
 */
export async function revalidateContentAction(paths: string[]): Promise<IServerActionResponse> {
  try {
    for (const path of paths) {
      revalidatePath(path);
    }
    
    return {
      success: true,
      message: 'Content revalidated successfully'
    };
  } catch (error) {
    console.error('Server Action - Revalidate Content Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revalidate content'
    };
  }
}

// ===== SEARCH ACTIONS =====

/**
 * Global search server action that combines multiple content types
 */
export async function globalSearchAction(
  query: string,
  filters: {
    type?: 'all' | 'courses' | 'blogs' | 'instructors';
    category?: string;
    limit?: number;
  } = {}
): Promise<IServerActionResponse<{
  courses: ICourse[];
  blogs: IBlog[];
  instructors: IUser[];
  total: number;
}>> {
  try {
    if (!query.trim()) {
      return {
        success: true,
        data: { courses: [], blogs: [], instructors: [], total: 0 }
      };
    }

    const { type = 'all', category, limit = 20 } = filters;
    const searchPromises = [];

    // Search courses
    if (type === 'all' || type === 'courses') {
      searchPromises.push(
        fetch(`${apiBaseUrl}${apiUrls.course.getAllCourses}?search=${encodeURIComponent(query)}&limit=${limit}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store' // Search should be fresh
        }).then(res => res.ok ? res.json() : { courses: [] })
      );
    } else {
      searchPromises.push(Promise.resolve({ courses: [] }));
    }

    // Search blogs
    if (type === 'all' || type === 'blogs') {
      searchPromises.push(
        fetch(`${apiBaseUrl}${apiUrls.blog.getAllBlogs}?search=${encodeURIComponent(query)}&limit=${limit}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        }).then(res => res.ok ? res.json() : { blogs: [] })
      );
    } else {
      searchPromises.push(Promise.resolve({ blogs: [] }));
    }

    // Search instructors
    if (type === 'all' || type === 'instructors') {
      searchPromises.push(
        fetch(`${apiBaseUrl}${apiUrls.Instructor.getAllInstructors}?search=${encodeURIComponent(query)}&limit=${limit}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        }).then(res => res.ok ? res.json() : { instructors: [] })
      );
    } else {
      searchPromises.push(Promise.resolve({ instructors: [] }));
    }

    const [coursesData, blogsData, instructorsData] = await Promise.all(searchPromises);

    const results = {
      courses: coursesData.courses || [],
      blogs: blogsData.blogs || [],
      instructors: instructorsData.instructors || [],
      total: (coursesData.courses?.length || 0) + (blogsData.blogs?.length || 0) + (instructorsData.instructors?.length || 0)
    };

    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.error('Server Action - Global Search Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Search failed'
    };
  }
} 