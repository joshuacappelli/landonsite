import { NextResponse } from 'next/server';
import { getQuickFacts, createQuickFact, updateQuickFact } from '@/app/db/queries';

// GET all quick facts
export async function GET() {
  try {
    const facts = await getQuickFacts();
    return NextResponse.json(facts);
  } catch (error) {
    console.error('Error fetching quick facts:', error);
    return NextResponse.json({ error: 'Failed to fetch quick facts' }, { status: 500 });
  }
}

// POST new quick fact
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createQuickFact(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating quick fact:', error);
    return NextResponse.json({ error: 'Failed to create quick fact' }, { status: 500 });
  }
}

// PUT update quick fact
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const result = await updateQuickFact(data.id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating quick fact:', error);
    return NextResponse.json({ error: 'Failed to update quick fact' }, { status: 500 });
  }
} 