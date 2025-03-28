import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://ipapi.co/json/', {
      validateStatus: function (status) {
        // Accept all status codes to handle them manually
        return true;
      },
    });
    
    // Handle non-200 responses explicitly
    if (response.status !== 200) {
      console.error(`Error fetching from ipapi: Status ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch location data: Status ${response.status}` },
        { status: response.status }
      );
    }
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching from ipapi:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch location data: ' + (error.message || 'Unknown error') },
      { status: error.response?.status || 500 }
    );
  }
}

// Configure rendering mode to ensure fresh data
export const dynamic = 'force-dynamic'; 