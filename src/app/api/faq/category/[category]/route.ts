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

// GET FAQs by category
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;
    
    if (!category) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        message: "Category is required",
        error: "Missing category parameter"
      }, { status: 400 });
    }
    
    // Fetch FAQs by category from database
    const faqs: FAQ[] = []; // Replace with actual database query
    
    return NextResponse.json<APIResponse<FAQ[]>>({
      success: true,
      message: `FAQs for category '${category}' retrieved successfully`,
      data: faqs
    });
  } catch (error) {
    console.error(`Error fetching FAQs for category:`, error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      message: "Failed to fetch FAQs by category",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
} 