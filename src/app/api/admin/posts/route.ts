import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { posts } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allPosts = await db.select().from(posts).orderBy(posts.date);
    
    // Parse the tags for each post
    const postsWithParsedTags = allPosts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags as string)
    }));

    return NextResponse.json(postsWithParsedTags);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'date', 'image', 'location', 'country', 'tags', 'guide'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate tags is an array
    if (!Array.isArray(data.tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
    }

    // Create the post
    const result = await db.insert(posts).values({
      title: data.title,
      content: data.content,
      date: new Date(data.date),
      image: data.image,
      location: data.location,
      country: data.country,
      tags: JSON.stringify(data.tags),
      guide: data.guide,
      createdAt: new Date()
    });
    // Get the created post
    const createdPost = await db.select().from(posts).where(eq(posts.id, Number(result.lastInsertRowid)));
    
    if (!createdPost || createdPost.length === 0) {
      throw new Error('Failed to retrieve created post');
    }

    // Parse the tags back to an array for the response
    const post = {
      ...createdPost[0],
      tags: JSON.parse(createdPost[0].tags as string)
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 