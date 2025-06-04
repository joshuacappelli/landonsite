import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { posts } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

// GET a single post by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const post = await db.select().from(posts).where(eq(posts.id, id));
    
    if (!post || post.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Parse the tags for the post
    const postWithParsedTags = {
      ...post[0],
      tags: JSON.parse(post[0].tags as string)
    };

    return NextResponse.json(postWithParsedTags);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT (update) a post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

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

    // Update the post
    await db.update(posts)
      .set({
        title: data.title,
        content: data.content,
        date: new Date(data.date),
        image: data.image,
        location: data.location,
        country: data.country,
        tags: JSON.stringify(data.tags),
        guide: data.guide
      })
      .where(eq(posts.id, id));

    // Get the updated post
    const updatedPost = await db.select().from(posts).where(eq(posts.id, id));
    
    if (!updatedPost || updatedPost.length === 0) {
      throw new Error('Failed to retrieve updated post');
    }

    // Parse the tags back to an array for the response
    const post = {
      ...updatedPost[0],
      tags: JSON.parse(updatedPost[0].tags as string)
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Check if post exists before deleting
    const existingPost = await db.select().from(posts).where(eq(posts.id, id));
    if (!existingPost || existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete the post
    await db.delete(posts).where(eq(posts.id, id));

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}