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

    // Mock data for student certificates
    const mockCertificates = [
      {
        _id: 'cert_1',
        course_id: {
          _id: 'course_1',
          course_title: 'Advanced React Development',
          course_image: '/images/courses/react-advanced.jpg'
        },
        student_id: {
          _id: studentId,
          full_name: 'John Doe'
        },
        certificateUrl: '/certificates/cert_1.pdf',
        completion_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'issued',
        grade: 'A+',
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'cert_2',
        course_id: {
          _id: 'course_2',
          course_title: 'Data Science Fundamentals',
          course_image: '/images/courses/data-science.jpg'
        },
        student_id: {
          _id: studentId,
          full_name: 'John Doe'
        },
        certificateUrl: '/certificates/cert_2.pdf',
        completion_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'issued',
        grade: 'A',
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'cert_3',
        course_id: {
          _id: 'course_3',
          course_title: 'Digital Marketing Strategy',
          course_image: '/images/courses/digital-marketing.jpg'
        },
        student_id: {
          _id: studentId,
          full_name: 'John Doe'
        },
        certificateUrl: null,
        completion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        grade: 'B+',
        validUntil: null
      },
      {
        _id: 'cert_4',
        course_id: {
          _id: 'course_4',
          course_title: 'Python for Data Analysis',
          course_image: '/images/courses/python-data.jpg'
        },
        student_id: {
          _id: studentId,
          full_name: 'John Doe'
        },
        certificateUrl: '/certificates/cert_4.pdf',
        completion_date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expired',
        grade: 'A-',
        validUntil: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const response = {
      status: 'success',
      message: 'Certificates retrieved successfully',
      data: mockCertificates
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching certificates:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch certificates',
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
