import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'schedule';

    if (!studentId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Student ID is required',
          error: 'Missing student ID parameter'
        },
        { status: 400 }
      );
    }

    // Mock data for upcoming classes
    const mockUpcomingClasses = [
      {
        _id: '1',
        courseTitle: 'Advanced React Development',
        instructor: 'Sarah Johnson',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM - 12:00 PM',
        duration: '2 hours',
        meetingLink: 'https://zoom.us/j/123456789',
        meetingId: '123456789',
        password: 'react2024',
        sessionNumber: 5,
        totalSessions: 12,
        courseType: 'live',
        status: 'scheduled',
        courseId: 'course_1',
        thumbnail: '/images/courses/react-advanced.jpg'
      },
      {
        _id: '2',
        courseTitle: 'Data Science Fundamentals',
        instructor: 'Dr. Alex Thompson',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        time: '2:00 PM - 4:00 PM',
        duration: '2 hours',
        meetingLink: 'https://zoom.us/j/987654321',
        meetingId: '987654321',
        password: 'data2024',
        sessionNumber: 3,
        totalSessions: 8,
        courseType: 'live',
        status: 'scheduled',
        courseId: 'course_2',
        thumbnail: '/images/courses/data-science.jpg'
      },
      {
        _id: '3',
        courseTitle: 'Digital Marketing Strategy',
        instructor: 'Emily Rodriguez',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        time: '11:00 AM - 1:00 PM',
        duration: '2 hours',
        meetingLink: 'https://zoom.us/j/456789123',
        meetingId: '456789123',
        password: 'marketing2024',
        sessionNumber: 7,
        totalSessions: 10,
        courseType: 'live',
        status: 'scheduled',
        courseId: 'course_3',
        thumbnail: '/images/courses/digital-marketing.jpg'
      },
      {
        _id: '4',
        courseTitle: 'Python for Data Analysis',
        instructor: 'Michael Chen',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        time: '3:00 PM - 5:00 PM',
        duration: '2 hours',
        meetingLink: 'https://zoom.us/j/789123456',
        meetingId: '789123456',
        password: 'python2024',
        sessionNumber: 2,
        totalSessions: 6,
        courseType: 'live',
        status: 'scheduled',
        courseId: 'course_4',
        thumbnail: '/images/courses/python-data.jpg'
      },
      {
        _id: '5',
        courseTitle: 'UI/UX Design Workshop',
        instructor: 'Lisa Wang',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        time: '1:00 PM - 3:00 PM',
        duration: '2 hours',
        meetingLink: 'https://zoom.us/j/321654987',
        meetingId: '321654987',
        password: 'design2024',
        sessionNumber: 4,
        totalSessions: 8,
        courseType: 'live',
        status: 'scheduled',
        courseId: 'course_5',
        thumbnail: '/images/courses/ui-ux-design.jpg'
      }
    ];

    // Filter based on view type
    let filteredData = mockUpcomingClasses;
    
    if (view === 'sessions') {
      // Return session count summary
      const sessionSummary = mockUpcomingClasses.reduce((acc, class_) => {
        acc[class_.courseTitle] = {
          completed: class_.sessionNumber - 1,
          total: class_.totalSessions,
          remaining: class_.totalSessions - class_.sessionNumber + 1
        };
        return acc;
      }, {} as Record<string, any>);

      return NextResponse.json({
        status: 'success',
        message: 'Session counts retrieved successfully',
        data: {
          sessionSummary,
          totalUpcoming: mockUpcomingClasses.length
        }
      });
    }

    if (view === 'links') {
      // Return only meeting links
      const meetingLinks = mockUpcomingClasses.map(class_ => ({
        courseTitle: class_.courseTitle,
        instructor: class_.instructor,
        date: class_.date,
        time: class_.time,
        meetingLink: class_.meetingLink,
        meetingId: class_.meetingId,
        password: class_.password
      }));

      return NextResponse.json({
        status: 'success',
        message: 'Meeting links retrieved successfully',
        data: {
          meetingLinks,
          totalUpcoming: mockUpcomingClasses.length
        }
      });
    }

    // Default view - return full schedule
    const response = {
      status: 'success',
      message: 'Upcoming classes retrieved successfully',
      data: {
        upcomingClasses: filteredData,
        totalUpcoming: filteredData.length,
        summary: {
          totalSessions: filteredData.reduce((sum, class_) => sum + class_.totalSessions, 0),
          completedSessions: filteredData.reduce((sum, class_) => sum + (class_.sessionNumber - 1), 0),
          remainingSessions: filteredData.reduce((sum, class_) => sum + (class_.totalSessions - class_.sessionNumber + 1), 0)
        }
      }
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch upcoming classes',
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
