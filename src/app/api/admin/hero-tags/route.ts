import { NextResponse } from 'next/server';
import { getHeroTags, createHeroTag, updateHeroTag, deleteHeroTag } from '@/app/db/queries';

// GET all hero tags
export async function GET() {
  try {
    const tags = await getHeroTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching hero tags:', error);
    return NextResponse.json({ error: 'Failed to fetch hero tags' }, { status: 500 });
  }
}

// POST new hero tag
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createHeroTag(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating hero tag:', error);
    return NextResponse.json({ error: 'Failed to create hero tag' }, { status: 500 });
  }
}

// PUT update hero tag
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const result = await updateHeroTag(data.id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating hero tag:', error);
    return NextResponse.json({ error: 'Failed to update hero tag' }, { status: 500 });
  }
}

// DELETE hero tag
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await deleteHeroTag(parseInt(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting hero tag:', error);
    return NextResponse.json({ error: 'Failed to delete hero tag' }, { status: 500 });
  }
} 