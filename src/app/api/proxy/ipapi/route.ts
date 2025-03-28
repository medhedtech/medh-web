import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching from ipapi:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    );
  }
}

// Configure rendering mode to ensure fresh data
export const dynamic = 'force-dynamic'; 