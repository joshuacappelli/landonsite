import { NextResponse } from 'next/server';
import { getFAQ, createFAQ, updateFAQ, deleteFAQ } from '@/app/db/queries';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    const faq = await getFAQ();
    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const result = await createFAQ(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await request.json();

  try {
    const result = await updateFAQ(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    await deleteFAQ(id);
    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
