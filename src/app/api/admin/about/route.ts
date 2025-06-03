import { NextResponse } from 'next/server';
import { getAboutMe, createAboutMe, updateAboutMe } from '@/app/db/queries';

// GET about me information
export async function GET() {
  try {
    const about = await getAboutMe();
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about information:', error);
    return NextResponse.json({ error: 'Failed to fetch about information' }, { status: 500 });
  }
}

// POST new about me information
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createAboutMe(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating about information:', error);
    return NextResponse.json({ error: 'Failed to create about information' }, { status: 500 });
  }
}

// PUT update about me information
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    // Extract ID from the URL
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '1');
    
    console.log('Updating about with ID:', id);
    console.log('Update data:', data);
    
    const result = await updateAboutMe(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating about information:', error);
    return NextResponse.json({ error: 'Failed to update about information' }, { status: 500 });
  }
} 