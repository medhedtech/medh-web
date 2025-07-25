import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// This would typically come from your database models
interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  phone_numbers: { country: string; number: string }[];
  status: string;
}

interface IBatchStudentsResponse {
  success: boolean;
  batch: {
    id: string;
    name: string;
    course: string;
    capacity: number;
    enrolled: number;
  };
  students: {
    count: number;
    totalStudents: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    data: Array<{
      enrollmentId: string;
      student: IStudent;
      enrollmentDate: string;
      status: string;
      progress: number;
      totalPaid: number;
      paymentPlan: string;
      accessExpiryDate: string;
    }>;
  };
}

// Mock function to get batch students (replace with actual database call)
async function getBatchStudents(batchId: string): Promise<IBatchStudentsResponse> {
  // Mock response matching the structure you provided
  return {
    success: true,
    batch: {
      id: batchId,
      name: 'incompetsd',
      course: 'Digital Marketing with Data Analytics',
      capacity: 10,
      enrolled: 3
    },
    students: {
      count: 5,
      totalStudents: 5,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      data: [
        {
          enrollmentId: '6836bb6fd5d3e50e4b812c6b',
          student: {
            _id: '6822e9bf2703b671efcf9ba6',
            full_name: 'Shivansh Rajak',
            email: 'shivanshrajak2803@gmail.com',
            phone_numbers: [
              {
                country: 'IN',
                number: '+919109496001'
              }
            ],
            status: 'Active'
          },
          enrollmentDate: '2025-05-28T07:29:51.274Z',
          status: 'active',
          progress: 0,
          totalPaid: 0,
          paymentPlan: 'full',
          accessExpiryDate: '2025-09-14T00:00:00.000Z'
        },
        {
          enrollmentId: '6836bb6fd5d3e50e4b812c69',
          student: {
            _id: '6800b0508c413e0442bf11e0',
            full_name: 'Student',
            email: 'student@medh.co',
            phone_numbers: [
              {
                country: 'IN',
                number: '+917710840696'
              }
            ],
            status: 'Active'
          },
          enrollmentDate: '2025-05-28T07:29:51.272Z',
          status: 'active',
          progress: 0,
          totalPaid: 0,
          paymentPlan: 'full',
          accessExpiryDate: '2025-09-14T00:00:00.000Z'
        },
        {
          enrollmentId: '6836bb4ad5d3e50e4b812c0a',
          student: {
            _id: '683030b29c7613b5eef12893',
            full_name: 'Test User for Token Testing',
            email: 'testuser@medh.co',
            phone_numbers: [
              {
                country: 'US',
                number: '+1234567890'
              }
            ],
            status: 'Active'
          },
          enrollmentDate: '2025-05-28T07:29:14.556Z',
          status: 'active',
          progress: 0,
          totalPaid: 0,
          paymentPlan: 'full',
          accessExpiryDate: '2025-09-14T00:00:00.000Z'
        }
      ]
    }
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    // Verify authentication token
    const headersList = await headers();
    const token = headersList.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { batchId } = params;

    // Validate parameters
    if (!batchId) {
      return NextResponse.json(
        { success: false, message: 'Batch ID is required' },
        { status: 400 }
      );
    }

    // Get batch students
    const batchStudents = await getBatchStudents(batchId);
    
    return NextResponse.json(batchStudents);

  } catch (error) {
    console.error('Error fetching batch students:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while fetching batch students' },
      { status: 500 }
    );
  }
} 