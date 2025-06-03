import { NextResponse } from 'next/server';
import { getGuidePostsByContinent } from '@/app/db/queries';

export async function GET() {
  try {
    const continentData = await getGuidePostsByContinent();
    console.log(continentData);
    return NextResponse.json(continentData);
  } catch (error) {
    console.error('Error fetching continent data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch continent data' },
      { status: 500 }
    );
  }
} 