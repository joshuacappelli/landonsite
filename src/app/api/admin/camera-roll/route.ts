import { NextResponse } from 'next/server';
import { createCameraRollImage, createCameraRollVideo } from '@/app/db/queries';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, url, location, date } = data;
    console.log(data);

    if (!type || !url || !location) {
      return NextResponse.json(
        { error: 'Type, URL, and location are required' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'image') {
      result = await createCameraRollImage({
        image: url,
        location,
        date: date || new Date().toISOString()
      });
    } else if (type === 'video') {
      result = await createCameraRollVideo({
        video: url,
        location,
        date: date || new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid media type. Must be "image" or "video"' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating camera roll entry:', error);
    return NextResponse.json(
      { error: 'Failed to create camera roll entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const [images, videos] = await Promise.all([
      fetch('/api/admin/camera-roll/images'),
      fetch('/api/admin/camera-roll/videos')
    ]);

    const imagesData = await images.json();
    const videosData = await videos.json();

    const formattedData = [
      ...imagesData.map((img: any) => ({
        ...img,
        type: 'image'
      })),
      ...videosData.map((vid: any) => ({
        ...vid,
        type: 'video'
      }))
    ];

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching camera roll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch camera roll' },
      { status: 500 }
    );
  }
} 