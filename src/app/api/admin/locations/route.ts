import { NextResponse } from 'next/server';
import { getLocations, createLocation, updateLocation, deleteLocation } from '@/app/db/queries';

export async function GET() {
  try {
    const locations = await getLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const result = await createLocation(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}

type Params = Promise<{ id: string }>

export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const idInt = parseInt(id);
  const data = await request.json();

  try {
    const result = await updateLocation(idInt, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const idInt = parseInt(id);

  try {
    await deleteLocation(idInt);
    return NextResponse.json({ message: 'Location deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}






