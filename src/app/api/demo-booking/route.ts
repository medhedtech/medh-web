import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for demo booking
const DemoBookingSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Valid email is required'),
  fullName: z.string().min(1, 'Full name is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  courseInterest: z.string().optional(),
  phoneNumber: z.string().optional(),
  timezone: z.string().default('UTC'),
  additionalNotes: z.string().optional(),
});

// Type for demo booking request
type DemoBookingRequest = z.infer<typeof DemoBookingSchema>;

// Type for demo booking response
interface DemoBookingResponse {
  success: boolean;
  message: string;
  data?: {
    bookingId: string;
    timeSlot: string;
    confirmationEmail: boolean;
    meetingLink?: string;
  };
  error?: string;
}

// Available time slots configuration
const AVAILABLE_TIME_SLOTS = {
  'today-6pm': 'Today 6:00 PM',
  'tomorrow-11am': 'Tomorrow 11:00 AM',
  'tomorrow-3pm': 'Tomorrow 3:00 PM',
  'tomorrow-6pm': 'Tomorrow 6:00 PM',
  'day-after-11am': 'Day After Tomorrow 11:00 AM',
  'day-after-3pm': 'Day After Tomorrow 3:00 PM',
} as const;

// Helper function to generate booking ID
function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `DEMO-${timestamp}-${randomStr}`.toUpperCase();
}

// Helper function to calculate actual date/time for time slot
function calculateScheduledTime(timeSlot: string): Date {
  const now = new Date();
  const scheduled = new Date();
  
  switch (timeSlot) {
    case 'today-6pm':
      scheduled.setHours(18, 0, 0, 0);
      break;
    case 'tomorrow-11am':
      scheduled.setDate(now.getDate() + 1);
      scheduled.setHours(11, 0, 0, 0);
      break;
    case 'tomorrow-3pm':
      scheduled.setDate(now.getDate() + 1);
      scheduled.setHours(15, 0, 0, 0);
      break;
    case 'tomorrow-6pm':
      scheduled.setDate(now.getDate() + 1);
      scheduled.setHours(18, 0, 0, 0);
      break;
    case 'day-after-11am':
      scheduled.setDate(now.getDate() + 2);
      scheduled.setHours(11, 0, 0, 0);
      break;
    case 'day-after-3pm':
      scheduled.setDate(now.getDate() + 2);
      scheduled.setHours(15, 0, 0, 0);
      break;
    default:
      throw new Error('Invalid time slot');
  }
  
  return scheduled;
}

// Helper function to send confirmation email (mock implementation)
async function sendConfirmationEmail(booking: {
  email: string;
  fullName: string;
  timeSlot: string;
  bookingId: string;
  meetingLink: string;
}): Promise<boolean> {
  try {
    // In a real implementation, you would use a service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    // - Resend
    
    console.log('Sending confirmation email:', {
      to: booking.email,
      subject: `Demo Class Confirmation - ${booking.bookingId}`,
      template: 'demo-booking-confirmation',
      data: booking
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful email send
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

// Helper function to save booking to database (mock implementation)
async function saveBookingToDatabase(bookingData: {
  bookingId: string;
  userId: string;
  email: string;
  fullName: string;
  timeSlot: string;
  scheduledDateTime: Date;
  courseInterest?: string;
  phoneNumber?: string;
  timezone: string;
  additionalNotes?: string;
  status: string;
  createdAt: Date;
}): Promise<boolean> {
  try {
    // In a real implementation, you would save to your database:
    // - MongoDB
    // - PostgreSQL
    // - MySQL
    // - Prisma ORM
    // - Supabase
    
    console.log('Saving booking to database:', bookingData);
    
    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock successful save
    return true;
  } catch (error) {
    console.error('Failed to save booking to database:', error);
    return false;
  }
}

// POST handler for creating demo bookings
export async function POST(request: NextRequest): Promise<NextResponse<DemoBookingResponse>> {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input data
    const validationResult = DemoBookingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        error: validationResult.error.errors.map(err => err.message).join(', ')
      }, { status: 400 });
    }
    
    const bookingData = validationResult.data;
    
    // Check if time slot is valid
    if (!Object.keys(AVAILABLE_TIME_SLOTS).includes(bookingData.timeSlot)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid time slot selected',
        error: 'The selected time slot is not available'
      }, { status: 400 });
    }
    
    // Generate booking ID and calculate scheduled time
    const bookingId = generateBookingId();
    const scheduledDateTime = calculateScheduledTime(bookingData.timeSlot);
    
    // Check if the scheduled time is not in the past
    if (scheduledDateTime < new Date()) {
      return NextResponse.json({
        success: false,
        message: 'Selected time slot is no longer available',
        error: 'Please select a future time slot'
      }, { status: 400 });
    }
    
    // Generate meeting link (in production, this would integrate with Zoom/Teams/Meet)
    const meetingLink = `https://meet.medh.com/demo/${bookingId}`;
    
    // Prepare booking data for database
    const dbBookingData = {
      bookingId,
      userId: bookingData.userId,
      email: bookingData.email,
      fullName: bookingData.fullName,
      timeSlot: bookingData.timeSlot,
      scheduledDateTime,
      courseInterest: bookingData.courseInterest,
      phoneNumber: bookingData.phoneNumber,
      timezone: bookingData.timezone,
      additionalNotes: bookingData.additionalNotes,
      status: 'confirmed',
      createdAt: new Date(),
    };
    
    // Save to database
    const dbSaved = await saveBookingToDatabase(dbBookingData);
    if (!dbSaved) {
      return NextResponse.json({
        success: false,
        message: 'Failed to save booking',
        error: 'Database error occurred while saving booking'
      }, { status: 500 });
    }
    
    // Send confirmation email
    const emailSent = await sendConfirmationEmail({
      email: bookingData.email,
      fullName: bookingData.fullName,
      timeSlot: AVAILABLE_TIME_SLOTS[bookingData.timeSlot as keyof typeof AVAILABLE_TIME_SLOTS],
      bookingId,
      meetingLink,
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Demo class booked successfully',
      data: {
        bookingId,
        timeSlot: AVAILABLE_TIME_SLOTS[bookingData.timeSlot as keyof typeof AVAILABLE_TIME_SLOTS],
        confirmationEmail: emailSent,
        meetingLink,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Demo booking API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred while processing your booking'
    }, { status: 500 });
  }
}

// GET handler for retrieving user's demo bookings
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required',
        error: 'Please provide a valid user ID'
      }, { status: 400 });
    }
    
    // In a real implementation, fetch from database
    // For now, return mock data
    const mockBookings = [
      {
        bookingId: 'DEMO-12345-ABC',
        timeSlot: 'Tomorrow 11:00 AM',
        scheduledDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'confirmed',
        meetingLink: 'https://meet.medh.com/demo/DEMO-12345-ABC',
        createdAt: new Date(),
      }
    ];
    
    return NextResponse.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: mockBookings,
        total: mockBookings.length
      }
    });
    
  } catch (error) {
    console.error('Get bookings API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to retrieve bookings'
    }, { status: 500 });
  }
}

// PUT handler for updating/canceling bookings
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { bookingId, action, ...updateData } = body;
    
    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: 'Booking ID is required',
        error: 'Please provide a valid booking ID'
      }, { status: 400 });
    }
    
    if (action === 'cancel') {
      // Cancel booking logic
      console.log(`Canceling booking: ${bookingId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Booking canceled successfully',
        data: { bookingId, status: 'canceled' }
      });
    }
    
    if (action === 'reschedule') {
      // Reschedule booking logic
      const { newTimeSlot } = updateData;
      
      if (!newTimeSlot || !Object.keys(AVAILABLE_TIME_SLOTS).includes(newTimeSlot)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid time slot for rescheduling',
          error: 'Please provide a valid time slot'
        }, { status: 400 });
      }
      
      console.log(`Rescheduling booking ${bookingId} to ${newTimeSlot}`);
      
      return NextResponse.json({
        success: true,
        message: 'Booking rescheduled successfully',
        data: {
          bookingId,
          newTimeSlot: AVAILABLE_TIME_SLOTS[newTimeSlot as keyof typeof AVAILABLE_TIME_SLOTS],
          status: 'rescheduled'
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action',
      error: 'Supported actions: cancel, reschedule'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Update booking API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to update booking'
    }, { status: 500 });
  }
} 