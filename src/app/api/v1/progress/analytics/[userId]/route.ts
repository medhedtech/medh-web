import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User ID is required',
          error: 'Missing user ID parameter'
        },
        { status: 400 }
      );
    }

    // Mock progress analytics data
    const mockAnalytics = {
      status: 'success',
      message: 'Progress analytics retrieved successfully',
      data: {
        analytics: {
          overview: {
            totalCourses: 8,
            activeCourses: 5,
            completedCourses: 3,
            averageProgress: 67,
            totalStudyTime: 1240, // minutes
            studyStreak: 7, // days
            improvementRate: 12, // percentage
            certificatesEarned: 2,
            skillPoints: 450
          },
          weeklyActivity: [
            { week: 'Week 1', hours: 12, lessons: 8, assignments: 3 },
            { week: 'Week 2', hours: 15, lessons: 10, assignments: 4 },
            { week: 'Week 3', hours: 18, lessons: 12, assignments: 5 },
            { week: 'Week 4', hours: 14, lessons: 9, assignments: 3 },
            { week: 'Week 5', hours: 16, lessons: 11, assignments: 4 },
            { week: 'Week 6', hours: 20, lessons: 14, assignments: 6 },
            { week: 'Week 7', hours: 22, lessons: 15, assignments: 7 }
          ],
          courseProgress: [
            {
              courseId: 'course_1',
              title: 'Advanced React Development',
              progress: 75,
              completedLessons: 9,
              totalLessons: 12,
              lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              courseId: 'course_2',
              title: 'Data Science Fundamentals',
              progress: 45,
              completedLessons: 4,
              totalLessons: 8,
              lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              courseId: 'course_3',
              title: 'Digital Marketing Strategy',
              progress: 90,
              completedLessons: 9,
              totalLessons: 10,
              lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              courseId: 'course_4',
              title: 'Python for Data Analysis',
              progress: 30,
              completedLessons: 2,
              totalLessons: 6,
              lastAccessed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              courseId: 'course_5',
              title: 'UI/UX Design Workshop',
              progress: 60,
              completedLessons: 5,
              totalLessons: 8,
              lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          achievements: [
            {
              id: '1',
              title: 'First Course Completed',
              description: 'Completed your first course successfully',
              icon: '🎓',
              earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              title: 'Study Streak',
              description: 'Studied for 7 consecutive days',
              icon: '🔥',
              earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '3',
              title: 'Perfect Score',
              description: 'Achieved 100% on an assignment',
              icon: '⭐',
              earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          recentActivity: [
            {
              id: '1',
              type: 'lesson_completed',
              title: 'React Hooks Deep Dive',
              course: 'Advanced React Development',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              description: 'Completed lesson 5 of 12'
            },
            {
              id: '2',
              type: 'assignment_submitted',
              title: 'Data Visualization Project',
              course: 'Data Science Fundamentals',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              description: 'Submitted assignment with 85% score'
            },
            {
              id: '3',
              type: 'quiz_completed',
              title: 'Marketing Strategy Quiz',
              course: 'Digital Marketing Strategy',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              description: 'Scored 92% on quiz'
            }
          ]
        }
      }
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(mockAnalytics);

  } catch (error) {
    console.error('Error fetching progress analytics:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch progress analytics',
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
