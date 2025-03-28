import { NextResponse } from 'next/server';

// This would typically connect to your actual database
// For now, returning mock data to fix the 404 error
export async function GET() {
  try {
    // Mock data for dashboard counts
    const mockCounts = {
      counts: {
        enrolledCourses: 157,
        activeStudents: 329,
        totalInstructors: 48,
        totalCourses: 72,
        corporateEmployees: 213,
        schools: 18
      }
    };

    return NextResponse.json(mockCounts);
  } catch (error: any) {
    console.error('Error fetching dashboard counts:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

// Configure rendering mode to ensure fresh data
export const dynamic = 'force-dynamic'; 