import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface IGenerateBlogFromPromptRequest {
  prompt: string;
  approach?: 'comprehensive' | 'creative' | 'professional' | 'technical';
}

interface IBlogData {
  title: string;
  description: string;
  content: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Parse request body
    const body: IGenerateBlogFromPromptRequest = await request.json();
    const { prompt, approach = 'comprehensive' } = body;

    // Validate required fields
    if (!prompt?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required for blog generation' },
        { status: 400 }
      );
    }

    // Create the comprehensive system prompt
    const systemPrompt = `You are an expert content strategist and writer who creates comprehensive blog content. Your task is to generate a complete blog structure with all necessary fields based on the user's prompt.

You must respond with a valid JSON object containing the following fields:
{
  "title": "An engaging, SEO-friendly blog title (50-60 characters)",
  "description": "A compelling description that summarizes the blog (150-160 characters)",
  "content": "Full HTML-formatted blog content (800-1500 words) with proper headings, paragraphs, lists, and formatting",
  "tags": ["array", "of", "relevant", "tags", "max", "10"],
  "metaTitle": "SEO-optimized meta title (50-60 characters)",
  "metaDescription": "SEO meta description (150-160 characters)"
}

Content Requirements:
- Write in HTML format suitable for a rich text editor
- Include proper headings (h2, h3), paragraphs, lists, and formatting
- Use HTML tags like <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>
- Make content engaging, informative, and valuable
- Include compelling introduction and conclusion
- Ensure content is original and SEO-friendly
- Target 800-1500 words for the content field
- Generate 5-10 relevant tags
- Make meta fields optimized for search engines

Approach: ${approach === 'creative' ? 'Creative and engaging with storytelling' : approach === 'technical' ? 'Technical and detailed with step-by-step instructions' : 'Professional and informative with actionable insights'}

IMPORTANT: Respond ONLY with the JSON object, no additional text or formatting.`;

    const userPrompt = `Generate a complete blog based on this prompt: "${prompt.trim()}"

Create comprehensive content that would be valuable to readers interested in this topic. Include all necessary fields in the JSON response.`;

    // Generate blog data using OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: approach === 'creative' ? 0.8 : approach === 'technical' ? 0.3 : 0.6,
      max_tokens: 3000,
      top_p: 1,
    });

    const generatedContent = response.choices[0]?.message?.content;

    if (!generatedContent) {
      return NextResponse.json(
        { success: false, message: 'No content was generated. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let blogData: IBlogData;
    try {
      // Clean the response in case there are markdown code blocks
      const cleanedContent = generatedContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      blogData = JSON.parse(cleanedContent);
      
      // Validate required fields
      if (!blogData.title || !blogData.description || !blogData.content) {
        throw new Error('Missing required fields in generated content');
      }
      
      // Ensure tags is an array
      if (!Array.isArray(blogData.tags)) {
        blogData.tags = [];
      }
      
      // Limit tags to 10
      blogData.tags = blogData.tags.slice(0, 10);
      
      // Ensure meta fields exist
      if (!blogData.metaTitle) {
        blogData.metaTitle = blogData.title;
      }
      if (!blogData.metaDescription) {
        blogData.metaDescription = blogData.description;
      }
      
    } catch (parseError) {
      console.error('Failed to parse generated JSON:', parseError);
      return NextResponse.json(
        { success: false, message: 'Failed to parse generated content. Please try again.' },
        { status: 500 }
      );
    }

    // Return the generated blog data
    return NextResponse.json({
      success: true,
      blogData: blogData,
      approach: approach,
      wordCount: blogData.content.split(' ').length,
      message: `Complete blog generated successfully with ${approach} approach`
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, message: 'Invalid OpenAI API key configuration' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, message: 'OpenAI API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { success: false, message: 'Rate limit exceeded. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate blog. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
} 