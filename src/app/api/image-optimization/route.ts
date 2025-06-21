import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = searchParams.get('w') ? parseInt(searchParams.get('w')!) : undefined;
    const height = searchParams.get('h') ? parseInt(searchParams.get('h')!) : undefined;
    const quality = searchParams.get('q') ? parseInt(searchParams.get('q')!) : 85;
    const format = searchParams.get('f') || 'webp';

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 400 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Process image with Sharp
    let sharpInstance = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }

    // Convert format and compress
    let outputBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case 'avif':
        outputBuffer = await sharpInstance
          .avif({ quality, effort: 4 })
          .toBuffer();
        contentType = 'image/avif';
        break;
      case 'webp':
        outputBuffer = await sharpInstance
          .webp({ quality, effort: 4 })
          .toBuffer();
        contentType = 'image/webp';
        break;
      case 'jpeg':
      case 'jpg':
        outputBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/jpeg';
        break;
      case 'png':
        outputBuffer = await sharpInstance
          .png({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/png';
        break;
      default:
        outputBuffer = await sharpInstance
          .webp({ quality, effort: 4 })
          .toBuffer();
        contentType = 'image/webp';
    }

    // Set cache headers for better performance
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Content-Length', outputBuffer.length.toString());

    return new NextResponse(outputBuffer, { headers });

  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;
    const quality = formData.get('quality') ? parseInt(formData.get('quality') as string) : 85;
    const format = (formData.get('format') as string) || 'webp';

    if (!file) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process image with Sharp
    let sharpInstance = sharp(buffer);

    // Auto-orient and remove EXIF data
    sharpInstance = sharpInstance.rotate();

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }

    // Convert format and compress
    let outputBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case 'avif':
        outputBuffer = await sharpInstance
          .avif({ quality, effort: 4 })
          .toBuffer();
        contentType = 'image/avif';
        break;
      case 'webp':
        outputBuffer = await sharpInstance
          .webp({ quality, effort: 4 })
          .toBuffer();
        contentType = 'image/webp';
        break;
      case 'jpeg':
      case 'jpg':
        outputBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/jpeg';
        break;
      case 'png':
        outputBuffer = await sharpInstance
          .png({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/png';
        break;
      default:
        outputBuffer = await sharpInstance
          .webp({ quality, effort: 4 })
          .toBuffer();
        contentType = 'image/webp';
    }

    // Return optimized image
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', outputBuffer.length.toString());

    return new NextResponse(outputBuffer, { headers });

  } catch (error) {
    console.error('Image upload optimization error:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}