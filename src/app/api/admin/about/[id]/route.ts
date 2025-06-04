import { NextResponse } from 'next/server';
import { updateAboutMe } from '@/app/db/queries';

// PUT update about me information
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    console.log('Updating about with ID:', id);
    console.log('Update data:', data);
    
    const result = await updateAboutMe(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating about information:', error);
    return NextResponse.json({ error: 'Failed to update about information' }, { status: 500 });
  }
}