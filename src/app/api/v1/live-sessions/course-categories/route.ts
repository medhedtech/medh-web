import { NextRequest, NextResponse } from 'next/server';

import { apiBaseUrl } from '@/apis/config';
export async function GET(request: NextRequest) {
  try {
    const BASE_URL = apiBaseUrl;
    const response = await fetch(`${BASE_URL}/live-classes/course-categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch course categories', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching course categories:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

