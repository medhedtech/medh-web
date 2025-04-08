import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Log the authentication event
    console.log('Auth Log:', {
      timestamp: new Date().toISOString(),
      ...data
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth logging error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 