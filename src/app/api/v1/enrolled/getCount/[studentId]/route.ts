import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;

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

    // Mock data for student enrollment counts
    const mockData = {
      status: 'success',
      message: 'Enrollment counts retrieved successfully',
      data: {
        counts: {
          total: 8,
          active: 5,
          completed: 3,
          byCourseType: {
            live: 3,
            blended: 2,
            selfPaced: 3,
            corporate: 1,
            school: 1
          }
        },
        progress: {
          averageProgress: 67,
          coursesInProgress: 5,
          coursesCompleted: 3,
          totalStudyTime: 1240, // in minutes
          studyStreak: 7, // days
          improvementRate: 12 // percentage
        },
        recent_activity: [
          {
            id: '1',
            type: 'course_completed',
            title: 'Introduction to React',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Completed course with 85% score'
          },
          {
            id: '2',
            type: 'lesson_watched',
            title: 'Advanced JavaScript Concepts',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Watched lesson 5 of 12'
          },
          {
            id: '3',
            type: 'assignment_submitted',
            title: 'Data Science Fundamentals',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            description: 'Submitted assignment 3'
          }
        ]
      }
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(mockData);

  } catch (error) {
    console.error('Error fetching enrollment counts:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch enrollment counts',
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
