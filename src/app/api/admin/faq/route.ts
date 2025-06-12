import { NextResponse } from 'next/server';
import { getFAQ, createFAQ, updateFAQ, deleteFAQ } from '@/app/db/queries';

export async function GET() {
  try {
    const faqs = await getFAQ();
    return NextResponse.json(faqs);
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

type Params = Promise<{ id: string }>

export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const idInt = parseInt(id);
  const data = await request.json();

  try {
    const result = await updateFAQ(idInt, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const idInt = parseInt(id);

  try {
    await deleteFAQ(idInt);
    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
