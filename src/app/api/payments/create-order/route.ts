import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * POST /api/payments/create-order
 * Creates a Razorpay order for payment processing
 */
export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Authorization header required' 
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      amount, 
      currency = 'INR', 
      payment_type, 
      productInfo, 
      course_id, 
      enrollment_type,
      is_self_paced,
      original_currency,
      price_id 
    } = body;

    // Validate required fields
    if (!amount || !payment_type || !productInfo) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required fields: amount, payment_type, productInfo' 
        },
        { status: 400 }
      );
    }

    // Mock order creation (in production, this would call Razorpay API)
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order object
    const order = {
      id: orderId,
      amount: typeof amount === 'string' ? parseInt(amount) : amount,
      currency,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
      notes: {
        payment_type,
        course_id: course_id || '',
        enrollment_type: enrollment_type || 'individual',
        is_self_paced: is_self_paced || false,
        original_currency: original_currency || currency,
        price_id: price_id || ''
      }
    };

    // Log the order creation for debugging
    console.log('Order created:', {
      orderId,
      amount: order.amount,
      currency,
      course_id,
      enrollment_type
    });

    return NextResponse.json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to create payment order' 
      },
      { status: 500 }
    );
  }
}