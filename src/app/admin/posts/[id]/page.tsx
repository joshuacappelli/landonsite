import { notFound } from 'next/navigation';
import PostForm from '../postform';
import { db } from '@/app/db';
import { posts } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    const post = await db.select().from(posts).where(eq(posts.id, parseInt(id))).limit(1);
    
    if (!post || post.length === 0) {
      return notFound();
    }
    
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <PostForm post={post[0]} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    return <div>Error loading post</div>;
  }
}