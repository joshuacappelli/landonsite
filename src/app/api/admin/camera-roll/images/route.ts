import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { cameraRollImages } from '@/app/db/schema';

export async function GET() {
  try {
    const images = await db.select().from(cameraRollImages).orderBy(cameraRollImages.date);
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching camera roll images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch camera roll images' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { image, location, date } = data;

    if (!image || !location) {
      return NextResponse.json(
        { error: 'Image URL and location are required' },
        { status: 400 }
      );
    }

    const result = await db.insert(cameraRollImages).values({
      image, // Store the full S3 URL
      location,
      date: date || new Date().toISOString()
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating camera roll image:', error);
    return NextResponse.json(
      { error: 'Failed to create camera roll image' },
      { status: 500 }
    );
  }
} 