import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const page = parseInt(searchParams.get('page') || '1');

    // Mock data for free courses
    const mockFreeCourses = [
      {
        _id: '1',
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript to build your first website.',
        instructor: {
          name: 'Sarah Johnson',
          avatar: '/images/instructors/sarah.jpg'
        },
        thumbnail: '/images/courses/web-dev-basics.jpg',
        duration: '4 weeks',
        level: 'Beginner',
        category: 'Web Development',
        rating: 4.8,
        enrolledCount: 1247,
        isFree: true,
        progress: 0,
        lessons: 12,
        certificate: true
      },
      {
        _id: '2',
        title: 'Python for Beginners',
        description: 'Start your programming journey with Python - the most beginner-friendly language.',
        instructor: {
          name: 'Michael Chen',
          avatar: '/images/instructors/michael.jpg'
        },
        thumbnail: '/images/courses/python-basics.jpg',
        duration: '6 weeks',
        level: 'Beginner',
        category: 'Programming',
        rating: 4.9,
        enrolledCount: 2156,
        isFree: true,
        progress: 0,
        lessons: 18,
        certificate: true
      },
      {
        _id: '3',
        title: 'Digital Marketing Fundamentals',
        description: 'Master the basics of digital marketing including SEO, social media, and content marketing.',
        instructor: {
          name: 'Emily Rodriguez',
          avatar: '/images/instructors/emily.jpg'
        },
        thumbnail: '/images/courses/digital-marketing.jpg',
        duration: '5 weeks',
        level: 'Beginner',
        category: 'Marketing',
        rating: 4.7,
        enrolledCount: 892,
        isFree: true,
        progress: 0,
        lessons: 15,
        certificate: true
      },
      {
        _id: '4',
        title: 'Data Science Essentials',
        description: 'Learn the fundamentals of data science, statistics, and data visualization.',
        instructor: {
          name: 'Dr. Alex Thompson',
          avatar: '/images/instructors/alex.jpg'
        },
        thumbnail: '/images/courses/data-science.jpg',
        duration: '8 weeks',
        level: 'Intermediate',
        category: 'Data Science',
        rating: 4.6,
        enrolledCount: 1567,
        isFree: true,
        progress: 0,
        lessons: 24,
        certificate: true
      },
      {
        _id: '5',
        title: 'UI/UX Design Principles',
        description: 'Learn user interface and user experience design principles for modern applications.',
        instructor: {
          name: 'Lisa Wang',
          avatar: '/images/instructors/lisa.jpg'
        },
        thumbnail: '/images/courses/ui-ux-design.jpg',
        duration: '6 weeks',
        level: 'Beginner',
        category: 'Design',
        rating: 4.8,
        enrolledCount: 1034,
        isFree: true,
        progress: 0,
        lessons: 20,
        certificate: true
      },
      {
        _id: '6',
        title: 'Business Analytics Basics',
        description: 'Understand business analytics and how to make data-driven decisions.',
        instructor: {
          name: 'Robert Kim',
          avatar: '/images/instructors/robert.jpg'
        },
        thumbnail: '/images/courses/business-analytics.jpg',
        duration: '7 weeks',
        level: 'Intermediate',
        category: 'Business',
        rating: 4.5,
        enrolledCount: 678,
        isFree: true,
        progress: 0,
        lessons: 21,
        certificate: true
      }
    ];

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = mockFreeCourses.slice(startIndex, endIndex);

    const response = {
      status: 'success',
      message: 'Free courses retrieved successfully',
      data: {
        courses: paginatedCourses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(mockFreeCourses.length / limit),
          totalCount: mockFreeCourses.length,
          hasNextPage: page < Math.ceil(mockFreeCourses.length / limit),
          hasPrevPage: page > 1,
          limit
        }
      }
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching free courses:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch free courses',
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
