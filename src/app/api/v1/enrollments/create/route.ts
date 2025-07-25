import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface EnrollmentRequest {
  student_id: string;
  course_id: string;
  enrollment_type: 'individual' | 'batch';
  payment_information: {
    payment_method: string;
    amount: number;
    currency: string;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };
  is_emi?: boolean;
  emi_config?: {
    totalAmount: number;
    downPayment: number;
    numberOfInstallments: number;
    startDate: string;
    installmentAmount: number;
    emiId: string;
    schedule: any[];
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication token
    const headersList = await headers();
    const token = headersList.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const enrollmentData: EnrollmentRequest = await request.json();

    // Validate required fields
    if (!enrollmentData.student_id || !enrollmentData.course_id) {
      return NextResponse.json(
        { message: 'Student ID and Course ID are required' },
        { status: 400 }
      );
    }

    // For paid courses, validate payment information
    if (enrollmentData.payment_information.amount > 0) {
      if (!enrollmentData.payment_information.razorpay_payment_id) {
        return NextResponse.json(
          { message: 'Payment verification required for paid courses' },
          { status: 400 }
        );
      }
    }

    // In a real implementation, you would:
    // 1. Verify the payment with Razorpay
    // 2. Create enrollment record in database
    // 3. Send confirmation emails
    // 4. Update course enrollment count
    // 5. Create progress tracking record

    // For now, we'll simulate successful enrollment
    const enrollmentId = `enroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const enrollmentResponse = {
      success: true,
      message: 'Successfully enrolled in the course',
      data: {
        enrollment_id: enrollmentId,
        student_id: enrollmentData.student_id,
        course_id: enrollmentData.course_id,
        enrollment_type: enrollmentData.enrollment_type,
        enrollment_date: new Date().toISOString(),
        status: 'active',
        payment_status: enrollmentData.payment_information.amount > 0 ? 'completed' : 'free',
        access_granted: true,
        next_steps: [
          'Check your email for course access details',
          'Join the course dashboard to start learning',
          'Attend the orientation session if applicable'
        ]
      }
    };

    // Log enrollment for monitoring (in production, use proper logging)
    console.log('New enrollment created:', {
      enrollment_id: enrollmentId,
      student_id: enrollmentData.student_id,
      course_id: enrollmentData.course_id,
      amount: enrollmentData.payment_information.amount,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(enrollmentResponse, { status: 201 });

  } catch (error) {
    console.error('Enrollment creation error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to process enrollment. Please try again or contact support.',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 