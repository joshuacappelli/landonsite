import { NextResponse } from 'next/server';
import { deleteCameraRollImage, deleteCameraRollVideo } from '@/app/db/queries';
import { deleteFile } from '@/lib/s3';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get the media type from the URL query parameter
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (!type || !['image', 'video'].includes(type)) {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }

    // Get the file URL from the request body
    const { url: fileUrl } = await request.json();
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }

    // Extract the file name from the S3 URL
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
    }

    // Delete from S3 first
    try {
      await deleteFile(fileName);
      console.log('Successfully deleted file from S3:', fileName);
    } catch (s3Error) {
      console.error('Error deleting file from S3:', s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database
    if (type === 'image') {
      await deleteCameraRollImage(id);
    } else {
      await deleteCameraRollVideo(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
} 