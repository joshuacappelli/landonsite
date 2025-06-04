import { notFound } from 'next/navigation';
import PostForm from '../postform';
import { db } from '@/app/db';
import { posts } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

type Params = Promise<{ id: string }>

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params;
  
  try {
    const post = await db.select().from(posts).where(eq(posts.id, parseInt(id))).limit(1);
    
    if (!post || post.length === 0) {
      return notFound();
    }

    const parsedPost = {
      ...post[0],
      tags: typeof post[0].tags === 'string' ? JSON.parse(post[0].tags) : post[0].tags
    };
    
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <PostForm post={parsedPost} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    return <div>Error loading post</div>;
  }
}