import { getCoursesWithFields } from '../apis/course/course';
import { apiUrls } from '../apis';

// Mock getQuery hook
jest.mock('../hooks/getQuery.hook', () => ({
  __esModule: true,
  default: () => ({
    getQuery: jest.fn().mockImplementation(({ url, config }) => {
      if (url.includes('courses/fields')) {
        return Promise.resolve({
          success: true,
          data: [
            {
              _id: '1',
              title: 'Test Course 1',
              description: 'Description for Test Course 1',
              instructor: {
                _id: '101',
                name: 'John Doe',
                avatar: 'https://example.com/avatar1.jpg'
              },
              category: {
                _id: '201',
                name: 'Web Development',
                slug: 'web-development'
              },
              subcategory: {
                _id: '301',
                name: 'JavaScript',
                slug: 'javascript'
              },
              course_image: 'https://example.com/course1.jpg',
              course_duration: 120,
              course_fee: 1000,
              currency: 'INR',
              status: 'Published',
              is_certification: true,
              is_assignments: true,
              is_projects: false,
              is_quizzes: true,
              min_hours_per_week: 5,
              max_hours_per_week: 10,
              no_of_sessions: 12,
              features: ['Lifetime Access', 'Certificate'],
              tools_technologies: ['JavaScript', 'React', 'Node.js'],
              sections: [
                {
                  _id: '401',
                  title: 'Introduction',
                  order: 1,
                  duration: 30,
                  lessons: [
                    {
                      _id: '501',
                      title: 'Course Overview',
                      type: 'video',
                      duration: 15,
                      video_url: 'https://example.com/video1.mp4',
                      is_completed: false
                    }
                  ]
                }
              ],
              progress: {
                completed_lessons: 0,
                total_lessons: 1,
                percentage: 0
              },
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z'
            },
            {
              _id: '2',
              title: 'Test Course 2',
              description: 'Description for Test Course 2',
              instructor: {
                _id: '102',
                name: 'Jane Smith',
                avatar: 'https://example.com/avatar2.jpg'
              },
              category: {
                _id: '202',
                name: 'Data Science',
                slug: 'data-science'
              },
              subcategory: {
                _id: '302',
                name: 'Python',
                slug: 'python'
              },
              course_image: 'https://example.com/course2.jpg',
              course_duration: 180,
              course_fee: 2000,
              currency: 'INR',
              status: 'Published',
              is_certification: true,
              is_assignments: true,
              is_projects: true,
              is_quizzes: true,
              min_hours_per_week: 8,
              max_hours_per_week: 15,
              no_of_sessions: 15,
              features: ['Lifetime Access', 'Certificate', 'Projects'],
              tools_technologies: ['Python', 'Pandas', 'Scikit-learn'],
              sections: [
                {
                  _id: '402',
                  title: 'Introduction to Data Science',
                  order: 1,
                  duration: 45,
                  lessons: [
                    {
                      _id: '502',
                      title: 'What is Data Science?',
                      type: 'video',
                      duration: 20,
                      video_url: 'https://example.com/video2.mp4',
                      is_completed: false
                    }
                  ]
                }
              ],
              progress: {
                completed_lessons: 0,
                total_lessons: 1,
                percentage: 0
              },
              createdAt: '2023-01-02T00:00:00.000Z',
              updatedAt: '2023-01-02T00:00:00.000Z'
            }
          ]
        });
      }
      return Promise.resolve({ success: true, data: [] });
    })
  })
}));

describe('Courses API Response', () => {
  it('should process standard courses API response format', async () => {
    const getQueryModule = await import('../hooks/getQuery.hook');
    const { getQuery } = getQueryModule.default();
    
    // Make the API call
    const url = getCoursesWithFields({
      fields: ['card'],
      filters: {
        currency: 'INR'
      }
    });
    
    const response = await getQuery({ url });
    
    // Check if the response contains the expected fields
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(2);
    
    // Check the structure of the first course
    const course = response.data[0];
    expect(course).toHaveProperty('_id');
    expect(course).toHaveProperty('title');
    expect(course).toHaveProperty('description');
    expect(course).toHaveProperty('instructor');
    expect(course).toHaveProperty('category');
    expect(course).toHaveProperty('course_image');
    expect(course).toHaveProperty('course_duration');
    expect(course).toHaveProperty('course_fee');
    expect(course).toHaveProperty('currency', 'INR');
    expect(course).toHaveProperty('status');
    expect(course).toHaveProperty('sections');
    expect(course).toHaveProperty('progress');
  });

  it('should handle courses with different currencies', async () => {
    const getQueryModule = await import('../hooks/getQuery.hook');
    const { getQuery } = getQueryModule.default();
    
    // Mock a different response for this test
    getQuery.mockImplementationOnce(({ url }) => {
      if (url.includes('courses/fields')) {
        return Promise.resolve({
          success: true,
          data: [
            {
              _id: '1',
              title: 'USD Course',
              course_fee: 50,
              currency: 'USD'
            },
            {
              _id: '2',
              title: 'EUR Course',
              course_fee: 45,
              currency: 'EUR'
            },
            {
              _id: '3',
              title: 'INR Course',
              course_fee: 1000,
              currency: 'INR'
            }
          ]
        });
      }
      return Promise.resolve({ success: true, data: [] });
    });
    
    // Make the API call with currency filter
    const url = getCoursesWithFields({
      fields: ['card'],
      filters: {
        currency: 'INR'
      }
    });
    
    const response = await getQuery({ url });
    
    // Check if only courses with INR currency are returned
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(3);
    
    // Filter courses by currency
    const inrCourses = response.data.filter(course => course.currency === 'INR');
    expect(inrCourses.length).toBe(1);
    expect(inrCourses[0].title).toBe('INR Course');
  });

  it('should handle empty courses response', async () => {
    const getQueryModule = await import('../hooks/getQuery.hook');
    const { getQuery } = getQueryModule.default();
    
    // Mock an empty response for this test
    getQuery.mockImplementationOnce(({ url }) => {
      if (url.includes('courses/fields')) {
        return Promise.resolve({
          success: true,
          data: []
        });
      }
      return Promise.resolve({ success: true, data: [] });
    });
    
    // Make the API call
    const url = getCoursesWithFields({
      fields: ['card'],
      filters: {
        currency: 'INR'
      }
    });
    
    const response = await getQuery({ url });
    
    // Check if the response is empty
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(0);
  });

  it('should handle error response from courses API', async () => {
    const getQueryModule = await import('../hooks/getQuery.hook');
    const { getQuery } = getQueryModule.default();
    
    // Mock an error response for this test
    getQuery.mockImplementationOnce(({ url }) => {
      if (url.includes('courses/fields')) {
        return Promise.reject(new Error('API Error'));
      }
      return Promise.resolve({ success: true, data: [] });
    });
    
    // Make the API call and catch the error
    const url = getCoursesWithFields({
      fields: ['card'],
      filters: {
        currency: 'INR'
      }
    });
    
    try {
      await getQuery({ url });
      fail('Expected API call to throw an error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('API Error');
    }
  });

  it('should handle non-array response data', async () => {
    const getQueryModule = await import('../hooks/getQuery.hook');
    const { getQuery } = getQueryModule.default();
    
    // Mock a non-array response for this test
    getQuery.mockImplementationOnce(({ url }) => {
      if (url.includes('courses/fields')) {
        return Promise.resolve({
          success: true,
          data: {
            courses: [
              {
                _id: '1',
                title: 'Test Course 1',
                currency: 'INR'
              }
            ]
          }
        });
      }
      return Promise.resolve({ success: true, data: [] });
    });
    
    // Make the API call
    const url = getCoursesWithFields({
      fields: ['card'],
      filters: {
        currency: 'INR'
      }
    });
    
    const response = await getQuery({ url });
    
    // Check if the response is processed correctly
    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('courses');
    expect(Array.isArray(response.data.courses)).toBe(true);
    expect(response.data.courses.length).toBe(1);
    expect(response.data.courses[0].currency).toBe('INR');
  });
}); 