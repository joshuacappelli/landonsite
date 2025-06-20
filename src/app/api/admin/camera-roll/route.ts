import { NextResponse } from 'next/server';
import { createCameraRollImage, createCameraRollVideo } from '@/app/db/queries';

interface Media {
  id: string;
  type: 'image' | 'video';
  image: string;
  url: string;
  name: string;
  continent: string;
  location: string;
  country: string;
  googleMaps: string;
  date: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, url, name, continent, country, googleMaps, date, location } = data;
    console.log(data);

    if (!type || !url || !name || !continent || !country || !googleMaps || !location) {
      return NextResponse.json(
        { error: 'Type, URL, name, continent, country, and googleMaps are required' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'image') {
      result = await createCameraRollImage({
        image: url,
        name,
        continent,
        country,
        googleMaps,
        location,
        date: date || new Date().toISOString()
      });
    } else if (type === 'video') {
      result = await createCameraRollVideo({
        video: url,
        name,
        continent,
        country,
        googleMaps,
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

export async function GET() {
  try {
    const [images, videos] = await Promise.all([
      fetch('/api/admin/camera-roll/images'),
      fetch('/api/admin/camera-roll/videos')
    ]);

    const imagesData = await images.json();
    const videosData = await videos.json();

    const formattedData = [
      ...imagesData.map((img: Media) => ({
        ...img,
        type: 'image'
      })),
      ...videosData.map((vid: Media) => ({
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