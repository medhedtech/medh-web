import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// This would typically come from your database models
interface IEnrollment {
  _id: string;
  student: string;
  course: string;
  batch: string | {
    _id: string;
    batch_name: string;
    batch_code: string;
    start_date: string;
    end_date: string;
    capacity: number;
    assigned_instructor: string;
    schedule: {
      day: string;
      start_time: string;
      end_time: string;
    }[];
    batch_notes?: string;
  };
  enrollment_date: string;
  status: string;
  enrollment_type: string;
  enrollment_source: string;
  payment_plan: string;
  payments: {
    amount: number;
    payment_method: string;
    transaction_id: string;
    payment_status: string;
    currency: string;
    payment_date?: string;
  }[];
  access_expiry_date: string;
  progress: {
    lesson_id: string;
    status: string;
    progress_percentage: number;
    time_spent_seconds: number;
    completed_at?: string;
  }[];
  assessments: {
    assessment_id: string;
    score: number;
    max_possible_score: number;
    passed: boolean;
    attempts: number;
    completed_at?: string;
  }[];
}

// In a real app, this would come from your database
const getMockEnrollments = (studentId: string): IEnrollment[] => {
  return [
    {
      _id: '61234567890123456789abcd',
      student: studentId,
      course: '61234567890123456789abce',
      batch: {
        _id: '61234567890123456789abcf',
        batch_name: 'Evening Batch - June 2023',
        batch_code: 'EB-JUN23',
        start_date: '2023-06-15',
        end_date: '2023-09-15',
        capacity: 30,
        assigned_instructor: '6123a8d2c1f3c22e4c85b492',
        schedule: [
          {
            day: 'Monday',
            start_time: '18:00',
            end_time: '20:00'
          },
          {
            day: 'Wednesday',
            start_time: '18:00',
            end_time: '20:00'
          }
        ],
        batch_notes: 'Beginner-friendly batch with additional weekend support'
      },
      enrollment_date: '2023-06-01',
      status: 'in_progress',
      enrollment_type: 'individual',
      enrollment_source: 'website',
      payment_plan: 'full',
      payments: [
        {
          amount: 15000,
          payment_method: 'credit_card',
          transaction_id: 'txn_123456789',
          payment_status: 'completed',
          currency: 'INR',
          payment_date: '2023-06-01'
        }
      ],
      access_expiry_date: '2023-12-15',
      progress: [
        {
          lesson_id: 'lesson1',
          status: 'completed',
          progress_percentage: 100,
          time_spent_seconds: 3600,
          completed_at: '2023-06-20'
        },
        {
          lesson_id: 'lesson2',
          status: 'completed',
          progress_percentage: 100,
          time_spent_seconds: 2700,
          completed_at: '2023-06-22'
        },
        {
          lesson_id: 'lesson3',
          status: 'in_progress',
          progress_percentage: 60,
          time_spent_seconds: 1800
        }
      ],
      assessments: [
        {
          assessment_id: 'assessment1',
          score: 85,
          max_possible_score: 100,
          passed: true,
          attempts: 1,
          completed_at: '2023-06-21'
        }
      ]
    },
    {
      _id: '61234567890123456789abdd',
      student: studentId,
      course: '61234567890123456789abee',
      batch: {
        _id: '61234567890123456789abff',
        batch_name: 'Weekend Batch - July 2023',
        batch_code: 'WB-JUL23',
        start_date: '2023-07-01',
        end_date: '2023-10-01',
        capacity: 25,
        assigned_instructor: '6123a8d2c1f3c22e4c85b493',
        schedule: [
          {
            day: 'Saturday',
            start_time: '10:00',
            end_time: '13:00'
          },
          {
            day: 'Sunday',
            start_time: '10:00',
            end_time: '13:00'
          }
        ]
      },
      enrollment_date: '2023-06-15',
      status: 'completed',
      enrollment_type: 'individual',
      enrollment_source: 'referral',
      payment_plan: 'installment',
      payments: [
        {
          amount: 5000,
          payment_method: 'debit_card',
          transaction_id: 'txn_987654321',
          payment_status: 'completed',
          currency: 'INR',
          payment_date: '2023-06-15'
        },
        {
          amount: 5000,
          payment_method: 'debit_card',
          transaction_id: 'txn_987654322',
          payment_status: 'completed',
          currency: 'INR',
          payment_date: '2023-07-15'
        },
        {
          amount: 5000,
          payment_method: 'debit_card',
          transaction_id: 'txn_987654323',
          payment_status: 'completed',
          currency: 'INR',
          payment_date: '2023-08-15'
        }
      ],
      access_expiry_date: '2024-01-01',
      progress: [
        {
          lesson_id: 'lesson1',
          status: 'completed',
          progress_percentage: 100,
          time_spent_seconds: 4200,
          completed_at: '2023-07-10'
        },
        {
          lesson_id: 'lesson2',
          status: 'completed',
          progress_percentage: 100,
          time_spent_seconds: 3600,
          completed_at: '2023-07-17'
        },
        {
          lesson_id: 'lesson3',
          status: 'completed',
          progress_percentage: 100,
          time_spent_seconds: 3200,
          completed_at: '2023-07-24'
        },
        {
          lesson_id: 'lesson4',
          status: 'completed',
          progress_percentage: 100,
          time_spent_seconds: 3800,
          completed_at: '2023-07-31'
        }
      ],
      assessments: [
        {
          assessment_id: 'assessment1',
          score: 92,
          max_possible_score: 100,
          passed: true,
          attempts: 1,
          completed_at: '2023-07-15'
        },
        {
          assessment_id: 'assessment2',
          score: 88,
          max_possible_score: 100,
          passed: true,
          attempts: 1,
          completed_at: '2023-08-01'
        }
      ]
    }
  ];
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    
    // Verify authentication token
    const headersList = await headers();
    const token = headersList.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // In a real implementation, verify the token with your auth service
    // const isValidToken = await verifyToken(token);
    // if (!isValidToken) {
    //   return NextResponse.json(
    //     { message: 'Invalid or expired token' },
    //     { status: 401 }
    //   );
    // }
    
    // In a real implementation, fetch enrollments from your database
    // const enrollments = await Enrollment.find({ student: studentId }).populate('batch');
    
    // Using mock data for demonstration
    const enrollments = getMockEnrollments(studentId);
    
    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { message: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
} 