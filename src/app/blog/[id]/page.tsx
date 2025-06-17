"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Nav from '../../components/nav';
import CountryNav from '../../components/countryNav';
import Loader from '../../components/loader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
  guide: boolean;
  location: string;
  country: string;
  tags: string[];
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/admin/posts/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
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
      <>
        <Nav />
        <CountryNav />
        <div className="p-8 pt-40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Loader />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Nav />
        <CountryNav />
        <div className="p-8 pt-40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <CountryNav />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-24 md:py-24">
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                {post.guide && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Guide
                  </span>
                )}
                {post.country && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {post.country}
                  </span>
                )}
                {post.location && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {post.location}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-500 mb-8">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>

              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700 prose-em:italic prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-gray-400 prose-li:my-1">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, children, ...props }) => {
                      // Check if the paragraph only contains an image
                      const hasOnlyImage = node?.children?.length === 1 && 
                        node.children[0].type === 'element' && 
                        node.children[0].tagName === 'img';
                      
                      if (hasOnlyImage) {
                        // If it's just an image, render it without the paragraph wrapper
                        return <>{children}</>;
                      }
                      
                      // Otherwise, render as a normal paragraph
                      return <p {...props}>{children}</p>;
                    },
                    img: ({ src, alt }) => (
                      <figure className="relative aspect-video my-8">
                        <Image
                          src={src as string}
                          alt={alt || 'Blog post image'}
                          fill
                          className="object-contain rounded-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {alt && (
                          <figcaption className="text-sm text-gray-500 text-center mt-2">
                            {alt}
                          </figcaption>
                        )}
                      </figure>
                    ),
                    a: ({ ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      />
                    ),
                    code: ({ className, children, ...props }) => (
                      <code
                        className={`${className} bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono`}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                    pre: ({ ...props }) => (
                      <pre
                        className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4"
                        {...props}
                      />
                    ),
                    table: ({ ...props }) => (
                      <div className="overflow-x-auto my-4">
                        <table
                          className="min-w-full divide-y divide-gray-200"
                          {...props}
                        />
                      </div>
                    ),
                    th: ({ ...props }) => (
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-black uppercase tracking-wider"
                        {...props}
                      />
                    ),
                    td: ({ ...props }) => (
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-black"
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="list-disc pl-6 space-y-1" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="list-decimal pl-6 space-y-1" {...props} />
                    ),
                    li: ({ ...props }) => (
                      <li className="text-gray-900" {...props} />
                    ),
                    h1: ({ ...props }) => (
                      <h1
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
                        {...props}
                      />
                    ),
                    h4: ({ ...props }) => (
                      <h4
                        className="text-lg md:text-xl font-bold text-gray-900 mb-4"
                        {...props}
                      />
                    ),
                    h5: ({ ...props }) => (
                      <h5
                        className="text-base md:text-lg font-bold text-gray-900 mb-4"
                        {...props}
                      />
                    ),
                    h6: ({ ...props }) => (
                      <h6
                        className="text-sm md:text-base font-bold text-gray-900 mb-4"
                        {...props}
                      />
                    ),
                    hr: ({ ...props }) => (
                      <hr
                        className="my-8 border-t border-gray-200"
                        {...props}
                      />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className="border-l-4 border-gray-300 pl-4 italic text-gray-900 mb-4"
                        {...props}
                      />
                    ),
                    strong: ({ ...props }) => (
                      <strong
                        className="font-semibold text-gray-900"
                        {...props}
                      />
                    ),
                    em: ({ ...props }) => (
                      <em
                        className="italic text-gray-900"
                        {...props}
                      />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </>
  );
} 