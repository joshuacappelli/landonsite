import { NextResponse } from 'next/server';
import { deleteQuickFact } from '@/app/db/queries';

// DELETE quick fact
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idInt = parseInt(id);
    
    console.log('Deleting quick fact with ID:', idInt);
    
    const result = await deleteQuickFact(idInt);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting quick fact:', error);
    return NextResponse.json({ error: 'Failed to delete quick fact' }, { status: 500 });
  }
} 