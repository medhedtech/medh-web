import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// GET FAQ by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        message: "FAQ ID is required",
        error: "Missing FAQ ID"
      }, { status: 400 });
    }
    
    // Fetch FAQ by ID from database
    const faq: FAQ | null = null; // Replace with actual database query
    
    if (!faq) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        message: "FAQ not found",
        error: "FAQ with the specified ID does not exist"
      }, { status: 404 });
    }
    
    return NextResponse.json<APIResponse<FAQ>>({
      success: true,
      message: "FAQ retrieved successfully",
      data: faq
    });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      message: "Failed to fetch FAQ",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
} 