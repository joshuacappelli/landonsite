import { NextResponse } from 'next/server';
import { getHeroFavorites, createHeroFavorite, updateHeroFavorite, deleteHeroFavorite, getHeroSettings, createHeroSettings, updateHeroSettings, getHeroTags, createHeroTag, updateHeroTag, deleteHeroTag } from '@/app/db/queries';

// GET all hero favorites
export async function GET() {
  try {
    const favorites = await getHeroFavorites();
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching hero favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch hero favorites' }, { status: 500 });
  }
}

// POST new hero favorite
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createHeroFavorite(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating hero favorite:', error);
    return NextResponse.json({ error: 'Failed to create hero favorite' }, { status: 500 });
  }
}

// PUT update hero favorite
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const result = await updateHeroFavorite(data.id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating hero favorite:', error);
    return NextResponse.json({ error: 'Failed to update hero favorite' }, { status: 500 });
  }
}

// DELETE hero favorite
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await deleteHeroFavorite(parseInt(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting hero favorite:', error);
    return NextResponse.json({ error: 'Failed to delete hero favorite' }, { status: 500 });
  }


} 

