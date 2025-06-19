import { NextRequest, NextResponse } from 'next/server';

interface CouponValidationRequest {
  code: string;
  courseId: string;
  amount: number;
  userId: string;
}

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
  minAmount?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  applicableCourses?: string[];
  excludedCourses?: string[];
}

// Mock coupon data - In production, this would come from your database
const mockCoupons: Coupon[] = [
  {
    _id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: '10% off for new students',
    minAmount: 100,
    maxDiscount: 1000,
    isActive: true,
    usageLimit: 1000,
    usedCount: 50
  },
  {
    _id: '2',
    code: 'SAVE500',
    type: 'fixed',
    value: 500,
    description: '₹500 off on any course',
    minAmount: 2000,
    isActive: true,
    usageLimit: 500,
    usedCount: 25
  },
  {
    _id: '3',
    code: 'STUDENT25',
    type: 'percentage',
    value: 25,
    description: '25% off for students',
    minAmount: 500,
    maxDiscount: 2000,
    isActive: true,
    usageLimit: 200,
    usedCount: 75
  },
  {
    _id: '4',
    code: 'EARLYBIRD',
    type: 'percentage',
    value: 15,
    description: 'Early bird special - 15% off',
    minAmount: 1000,
    maxDiscount: 1500,
    isActive: true,
    validUntil: '2024-12-31T23:59:59.999Z',
    usageLimit: 300,
    usedCount: 120
  },
  {
    _id: '5',
    code: 'TESTMODE',
    type: 'fixed',
    value: 100,
    description: 'Test coupon for development',
    minAmount: 1,
    isActive: true,
    usageLimit: 999,
    usedCount: 0
  },
  {
    _id: '6',
    code: 'WELCOME50',
    type: 'percentage',
    value: 50,
    description: '50% off welcome discount for test users',
    minAmount: 1,
    isActive: true,
    usageLimit: 100,
    usedCount: 0
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: CouponValidationRequest = await request.json();
    const { code, courseId, amount, userId } = body;

    // Validate required fields
    if (!code || !courseId || !amount || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: code, courseId, amount, userId' 
        },
        { status: 400 }
      );
    }

    // Find the coupon
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid coupon code' 
        },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'This coupon is no longer active' 
        },
        { status: 400 }
      );
    }

    // Check expiry date
    if (coupon.validUntil) {
      const expiryDate = new Date(coupon.validUntil);
      if (new Date() > expiryDate) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This coupon has expired' 
          },
          { status: 400 }
        );
      }
    }

    // Check valid from date
    if (coupon.validFrom) {
      const validFromDate = new Date(coupon.validFrom);
      if (new Date() < validFromDate) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This coupon is not yet valid' 
          },
          { status: 400 }
        );
      }
    }

    // Check minimum amount
    if (coupon.minAmount && amount < coupon.minAmount) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Minimum order amount of ₹${coupon.minAmount} required for this coupon` 
        },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'This coupon has reached its usage limit' 
        },
        { status: 400 }
      );
    }

    // Check course applicability
    if (coupon.applicableCourses && coupon.applicableCourses.length > 0) {
      if (!coupon.applicableCourses.includes(courseId)) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This coupon is not applicable to this course' 
          },
          { status: 400 }
        );
      }
    }

    // Check course exclusions
    if (coupon.excludedCourses && coupon.excludedCourses.includes(courseId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'This coupon cannot be used for this course' 
        },
        { status: 400 }
      );
    }

    // TODO: In production, check if user has already used this coupon
    // const userUsage = await checkUserCouponUsage(userId, coupon._id);

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (amount * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed the amount
    discount = Math.min(discount, amount);

    return NextResponse.json({
      success: true,
      message: 'Coupon is valid',
      coupon: coupon,
      discount: discount,
      finalAmount: amount - discount
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error while validating coupon' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to list all coupons (for admin management)
export async function GET() {
  try {
    // Return all coupons with complete data for admin management
    return NextResponse.json({
      success: true,
      coupons: mockCoupons.map(coupon => ({
        _id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
        minAmount: coupon.minAmount,
        maxDiscount: coupon.maxDiscount,
        validFrom: coupon.validFrom || new Date().toISOString().split('T')[0],
        validUntil: coupon.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        isActive: coupon.isActive,
        applicableCourses: coupon.applicableCourses || [],
        excludedCourses: coupon.excludedCourses || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error while fetching coupons' 
      },
      { status: 500 }
    );
  }
} 