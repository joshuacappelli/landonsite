import { NextResponse } from 'next/server';
import { deleteQuickFact } from '@/app/db/queries';

// DELETE quick fact
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    console.log('Deleting quick fact with ID:', id);
    
    const result = await deleteQuickFact(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting quick fact:', error);
    return NextResponse.json({ error: 'Failed to delete quick fact' }, { status: 500 });
  }
} 