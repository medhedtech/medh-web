import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define a custom interface for the JWT payload
interface CustomJwtPayload {
  _id?: string;
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
  name?: string;
  exp?: number;
  [key: string]: any;
}

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const token = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    // Decode the token to get user info
    const decoded = jwtDecode<CustomJwtPayload>(token);
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded._id || decoded.id || decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
} 