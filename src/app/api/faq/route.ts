import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define interfaces for our data types
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

// GET all FAQs
export async function GET(request: NextRequest) {
  try {
    // Implementation for getting all FAQs from your database
    const faqs: FAQ[] = []; // Replace with actual database query
    
    return NextResponse.json<APIResponse<FAQ[]>>({
      success: true,
      message: "FAQs retrieved successfully",
      data: faqs
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      message: "Failed to fetch FAQs",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}

// POST create new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.question || !body.answer) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        message: "Question and answer are required",
        error: "Missing required fields"
      }, { status: 400 });
    }
    
    // Create new FAQ in database
    const newFaq: FAQ = {
      id: '', // Generate ID
      question: body.question,
      answer: body.answer,
      category: body.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json<APIResponse<FAQ>>({
      success: true,
      message: "FAQ created successfully",
      data: newFaq
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      message: "Failed to create FAQ",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}

// PUT update FAQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        message: "FAQ ID is required",
        error: "Missing FAQ ID"
      }, { status: 400 });
    }
    
    // Update FAQ in database
    const updatedFaq: FAQ = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json<APIResponse<FAQ>>({
      success: true,
      message: "FAQ updated successfully",
      data: updatedFaq
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      message: "Failed to update FAQ",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}

// DELETE FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        message: "FAQ ID is required",
        error: "Missing FAQ ID"
      }, { status: 400 });
    }
    
    // Delete FAQ from database
    
    return NextResponse.json<APIResponse<null>>({
      success: true,
      message: "FAQ deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      message: "Failed to delete FAQ",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
} 