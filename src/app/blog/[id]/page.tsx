"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Nav from "../../components/nav";
import CountryNav from "../../components/countryNav";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
  location: string;
  country: string;
  tags: string[];
}

interface ContentBlock {
  type: 'text' | 'image';
  content: string;
  caption?: string;
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  // Function to parse content into blocks
  const parseContent = (content: string): ContentBlock[] => {
    const blocks: ContentBlock[] = [];
    const lines = content.split('\n');
    let currentTextBlock = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if line is an image link (format: ![caption](image_url))
      const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      
      if (imageMatch) {
        // If we have accumulated text, add it as a text block
        if (currentTextBlock.trim()) {
          blocks.push({
            type: 'text',
            content: currentTextBlock.trim()
          });
          currentTextBlock = '';
        }
        
        // Add the image block
        blocks.push({
          type: 'image',
          content: imageMatch[2],
          caption: imageMatch[1]
        });
      } else {
        // Add line to current text block
        currentTextBlock += line + '\n';
      }
    }

    // Add any remaining text
    if (currentTextBlock.trim()) {
      blocks.push({
        type: 'text',
        content: currentTextBlock.trim()
      });
    }

    return blocks;
  };

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/admin/posts/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        
        const data = await response.json();
        setPost({
          ...data,
          tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags
        });
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Nav />
        <CountryNav />
        <div className="p-8 pt-40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Loading post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Nav />
        <CountryNav />
        <div className="p-8 pt-40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-red-500">Post not found</div>
            <button
              onClick={() => router.push('/blog')}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              ← Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const contentBlocks = parseContent(post.content);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Nav />
      <CountryNav />
      <div className="p-8 pt-40">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.push('/blog')}
            className="mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Blog
          </button>

          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <span>{post.location}, {post.country}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            {contentBlocks.map((block, index) => (
              <div key={index} className="mb-8">
                {block.type === 'text' ? (
                  <div className="space-y-4">
                    {block.content.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-600 dark:text-gray-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={block.content}
                        alt={block.caption || 'Blog post image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {block.caption && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                        {block.caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 