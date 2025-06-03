import { NextResponse } from 'next/server';
import { generatePresignedUrl } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'File name and type are required' },
        { status: 400 }
      );
    }

    // Generate a unique file name to prevent collisions
    const uniqueFileName = `${Date.now()}-${fileName}`;
    
    const presignedUrl = await generatePresignedUrl(uniqueFileName, fileType);

    return NextResponse.json({
      presignedUrl,
      fileName: uniqueFileName,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 