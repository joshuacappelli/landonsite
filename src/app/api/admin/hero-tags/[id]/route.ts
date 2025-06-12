import { NextResponse } from 'next/server';
import { updateHeroTag, deleteHeroTag } from '@/app/db/queries';

// PUT update hero tag
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idInt = parseInt(id);
    const data = await request.json();
    
    console.log('Updating hero tag with ID:', idInt);
    console.log('Update data:', data);
    
    const result = await updateHeroTag(idInt, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating hero tag:', error);
    return NextResponse.json({ error: 'Failed to update hero tag' }, { status: 500 });
  }
}

// DELETE hero tag
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idInt = parseInt(id);
    
    console.log('Deleting hero tag with ID:', idInt);
    
    const result = await deleteHeroTag(idInt);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting hero tag:', error);
    return NextResponse.json({ error: 'Failed to delete hero tag' }, { status: 500 });
  }
}