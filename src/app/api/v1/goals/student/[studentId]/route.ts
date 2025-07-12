import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration
const mockGoals = [
  {
    id: 'goal1',
    title: 'Complete React Course',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    progress: 40,
    category: 'course',
    type: 'course',
  },
  {
    id: 'goal2',
    title: 'Finish Assignment 3',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    progress: 80,
    category: 'assignment',
    type: 'assignment',
  },
  {
    id: 'goal3',
    title: 'Prepare for Quiz',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    progress: 20,
    category: 'quiz',
    type: 'quiz',
  },
  {
    id: 'goal4',
    title: 'Project Submission',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    progress: 0,
    category: 'project',
    type: 'project',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }
    // In a real implementation, fetch goals for the studentId from DB
    // For now, return mock data
    return NextResponse.json(mockGoals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
} 