import { NextResponse } from 'next/server';
import { createNewsletterUser, getNewsletterUsers } from '@/app/db/queries';

export async function GET() {
    try {
        const users = await getNewsletterUsers();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching newsletter users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch newsletter users' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
  const data = await request.json();
  
  try {
    const result = await createNewsletterUser(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating newsletter user:', error);
    return NextResponse.json(
      { error: 'Failed to create newsletter user' },
      { status: 500 }
    );
  }
}