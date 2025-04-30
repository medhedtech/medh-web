import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Shape of stored settings
interface CourseCardSettings {
  selectedLiveCourseIds: string[];
  selectedBlendedCourseIds: string[];
  cardConfig: Record<string, any>;
  textCustomization: Record<string, any>;
  previewConfig?: Record<string, any>;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const doc = await db
      .collection('admin_settings')
      .findOne<{ _id: string; settings: CourseCardSettings }>({ _id: 'courseCardSettings' });

    const settings = doc?.settings || null;
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/course-card-settings error:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const settings: CourseCardSettings = payload.settings;

    if (!settings) {
      return NextResponse.json({ error: 'Missing settings payload' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection('admin_settings').updateOne(
      { _id: 'courseCardSettings' },
      { $set: { settings, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Settings saved' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/admin/course-card-settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
} 