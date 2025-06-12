import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface IGenerateContentRequest {
  title: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  contentType: 'blog';
  approach?: 'creative' | 'professional' | 'technical';
  regenerate?: boolean;
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

    // Parse request body
    const body: IGenerateContentRequest = await request.json();
    const { title, description, categories, tags, approach = 'professional', regenerate = false } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required for content generation' },
        { status: 400 }
      );
    }

    // Build context for content generation
    const contextParts = [
      `Title: ${title.trim()}`,
      description?.trim() ? `Description: ${description.trim()}` : '',
      categories?.length ? `Categories: ${categories.join(', ')}` : '',
      tags?.length ? `Tags: ${tags.join(', ')}` : ''
    ].filter(Boolean);

    const context = contextParts.join('\n');

    // Define approach-specific prompts
    const approachPrompts = {
      creative: `Write a creative and engaging blog post that captures readers' attention with storytelling, vivid examples, and a conversational tone. Use metaphors, analogies, and personal anecdotes where appropriate.`,
      professional: `Write a professional and informative blog post that provides valuable insights, actionable advice, and well-researched information. Maintain a formal yet accessible tone suitable for business audiences.`,
      technical: `Write a detailed technical blog post that explains concepts thoroughly, includes step-by-step instructions, code examples where relevant, and provides in-depth analysis for technically-minded readers.`
    };

    // Create the prompt for content generation
    const systemPrompt = `You are an expert content writer specializing in creating high-quality blog posts. ${approachPrompts[approach]}

Requirements:
- Write in HTML format suitable for a rich text editor
- Include proper headings (h2, h3), paragraphs, lists, and formatting
- Aim for 800-1500 words
- Make the content engaging, informative, and valuable
- Include a compelling introduction and conclusion
- Use proper HTML tags like <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>
- Ensure the content is original and plagiarism-free
- Make it SEO-friendly with natural keyword usage

${regenerate ? 'Generate a completely different version with a fresh perspective and new angles.' : ''}`;

    const userPrompt = `Create a comprehensive blog post based on the following information:

${context}

Please generate engaging, well-structured content that would be valuable to readers interested in this topic.`;

    // Generate content using OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Using a more accessible model
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
      temperature: approach === 'creative' ? 0.9 : approach === 'technical' ? 0.3 : 0.7,
      max_tokens: 2048,
      top_p: 1,
    });

    const generatedContent = response.choices[0]?.message?.content;

    if (!generatedContent) {
      return NextResponse.json(
        { success: false, message: 'No content was generated. Please try again.' },
        { status: 500 }
      );
    }

    // Return the generated content
    return NextResponse.json({
      success: true,
      content: generatedContent,
      approach: approach,
      wordCount: generatedContent.split(' ').length,
      message: `Content generated successfully with ${approach} approach`
    });

  } catch (error) {
    console.error('Content generation error:', error);
    
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
        message: 'Failed to generate content. Please try again later.',
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