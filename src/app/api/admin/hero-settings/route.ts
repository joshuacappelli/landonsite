import { NextResponse } from 'next/server';
import { getHeroSettings, createHeroSettings, updateHeroSettings } from '@/app/db/queries';

// GET all hero settings
export async function GET() {
  try {
    const settings = await getHeroSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    return NextResponse.json({ error: 'Failed to fetch hero settings' }, { status: 500 });
  }
}

// POST new hero settings
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createHeroSettings(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating hero settings:', error);
    return NextResponse.json({ error: 'Failed to create hero settings' }, { status: 500 });
  }
}

// PUT update hero settings
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const result = await updateHeroSettings(1, data);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating hero settings:', error);
    return NextResponse.json({ error: 'Failed to update hero settings' }, { status: 500 });
  }
} 