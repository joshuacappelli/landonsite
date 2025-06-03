import { NextResponse } from 'next/server';
import { updateHeroFavorite, deleteHeroFavorite } from '@/app/db/queries';

// PUT update hero favorite
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    
    console.log('Updating hero favorite with ID:', id);
    console.log('Update data:', data);
    
    const result = await updateHeroFavorite(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating hero favorite:', error);
    return NextResponse.json({ error: 'Failed to update hero favorite' }, { status: 500 });
  }
}

// DELETE hero favorite
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    console.log('Deleting hero favorite with ID:', id);
    
    const result = await deleteHeroFavorite(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting hero favorite:', error);
    return NextResponse.json({ error: 'Failed to delete hero favorite' }, { status: 500 });
  }
} 