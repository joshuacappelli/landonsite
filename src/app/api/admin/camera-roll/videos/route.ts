import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { cameraRollVideos } from '@/app/db/schema';

export async function GET() {
  try {
    const videos = await db.select().from(cameraRollVideos).orderBy(cameraRollVideos.date);
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching camera roll videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch camera roll videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { video, location, date } = data;

    if (!video || !location) {
      return NextResponse.json(
        { error: 'Video URL and location are required' },
        { status: 400 }
      );
    }

    const result = await db.insert(cameraRollVideos).values({
      video, // Store the full S3 URL
      location,
      date: date || new Date().toISOString()
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating camera roll video:', error);
    return NextResponse.json(
      { error: 'Failed to create camera roll video' },
      { status: 500 }
    );
  }
} 