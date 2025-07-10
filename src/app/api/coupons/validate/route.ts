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

// TODO: Replace with actual database integration
// This should connect to your database to fetch coupon data
const getCouponFromDatabase = async (code: string): Promise<Coupon | null> => {
  // TODO: Implement actual database query
  // Example: return await db.collection('coupons').findOne({ code: code.toUpperCase(), isActive: true });
  console.warn('getCouponFromDatabase: Mock data removed. Please implement database integration.');
  return null;
};

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

    // Find the coupon from database
    const coupon = await getCouponFromDatabase(code);

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
    // TODO: Implement actual database query to fetch all coupons
    // const coupons = await db.collection('coupons').find({}).toArray();
    
    console.warn('GET /api/coupons/validate: Mock data removed. Please implement database integration.');
    
    return NextResponse.json({
      success: true,
      coupons: [],
      message: 'Database integration required'
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