import { NextApiRequest, NextApiResponse } from 'next';
import { createApiHandler, authenticate } from '@/middleware/api.middleware';
import { courseAPI } from '@/apis/courses';
import { apiUtils } from '@/apis';

// Create a handler with middleware
const handler = createApiHandler({
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 100 // Allow more requests for course listing
  },
  logging: true
});

// Apply authentication middleware - courses endpoint is public but can have enhanced features for logged-in users
handler.use(authenticate);

// GET: Retrieve all courses with filtering options
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      page = '1',
      limit = '10',
      course_title,
      course_category,
      status,
      search,
      course_grade,
      class_type,
      skill_level,
      language,
      sort_by,
      sort_order
    } = req.query;

    // Convert query params to appropriate types
    const queryParams = {
      page: apiUtils.safeNumber(page, 1),
      limit: apiUtils.safeNumber(limit, 10),
      course_title: course_title as string,
      course_category: course_category as string | string[],
      status: status as 'Draft' | 'Published' | 'Archived' | undefined,
      search: search as string,
      course_grade: course_grade as string,
      class_type: class_type as string,
      skill_level: skill_level as string,
      language: language as string,
      sort_by: sort_by as string,
      sort_order: sort_order as 'asc' | 'desc' | undefined
    };

    // Get courses from API
    const response = await courseAPI.getAllCourses(queryParams);

    // Handle API response
    if (response.status === 'success' && response.data) {
      return res.status(200).json({
        status: 'success',
        data: response.data,
        message: 'Courses retrieved successfully'
      });
    } else {
      return res.status(400).json({
        status: 'error',
        error: response.error || 'Failed to retrieve courses',
        message: response.message || 'An error occurred while fetching courses'
      });
    }
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// POST: Create a new course (requires authentication)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        error: 'Unauthorized',
        message: 'Authentication required to create a course'
      });
    }

    // Create course
    const response = await courseAPI.createCourse(req.body);

    // Handle API response
    if (response.status === 'success' && response.data) {
      return res.status(201).json({
        status: 'success',
        data: response.data,
        message: 'Course created successfully'
      });
    } else {
      return res.status(400).json({
        status: 'error',
        error: response.error || 'Failed to create course',
        message: response.message || 'An error occurred while creating the course'
      });
    }
  } catch (error: any) {
    console.error('Error creating course:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

export default handler; 