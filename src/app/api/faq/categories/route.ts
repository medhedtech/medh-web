import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface Category {
  id: string;
  name: string;
  description?: string;
  faqCount?: number;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// GET all FAQ categories
export async function GET(request: NextRequest) {
  try {
    // Fetch all categories from database
    const categories: Category[] = []; // Replace with actual database query
    
    return NextResponse.json<APIResponse<Category[]>>({
      success: true,
      message: "FAQ categories retrieved successfully",
      data: categories
    });
  } catch (error) {
    console.error("Error fetching FAQ categories:", error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      message: "Failed to fetch FAQ categories",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
} 