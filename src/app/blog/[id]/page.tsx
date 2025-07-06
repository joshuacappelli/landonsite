"use client"
import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Tag, ArrowLeft, Clock, Share2 } from "lucide-react"
import Nav from "../../components/nav"
import CountryNav from "../../components/countryNav"
import Loader from "../../components/loader"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Post {
  id: number
  title: string
  content: string
  date: string
  image: string
  guide: boolean
  location: string
  country: string
  tags: string[]
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [readingTime, setReadingTime] = useState(0)
  const resolvedParams = use(params)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/admin/posts/${resolvedParams.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch post")
        }
        const data = await response.json()
        setPost(data)

        // Calculate reading time (average 200 words per minute)
        const wordCount = data.content.split(/\s+/).length
        const estimatedReadingTime = Math.ceil(wordCount / 200)
        setReadingTime(estimatedReadingTime)
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <>
        <Nav />
        <CountryNav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Nav />
        <CountryNav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <ArrowLeft className="w-8 h-8 text-slate-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Post not found</h1>
              <p className="text-slate-600 mb-8">The blog post you're looking for doesn't exist.</p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <CountryNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="relative pt-20 md:pt-24">
          <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <Image 
              src={post.image || "/placeholder.svg"} 
              alt={post.title} 
              fill 
              className="object-cover object-center" 
              priority 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Back Navigation */}
            <div className="absolute top-6 left-4 md:left-8 z-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white transition-all duration-200 shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
            </div>



            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <div className="container mx-auto max-w-4xl">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {post.guide && (
                    <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-lg">
                      Guide
                    </span>
                  )}
                  {post.country && (
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {post.country}
                    </span>
                  )}
                  {post.location && (
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {post.location}
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date} className="text-sm font-medium">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

                 {post.tags && post.tags.length > 0 && (
           <div className="container border-t border-slate-200 mx-auto max-w-4xl px-4 py-2 md:py-2">
             <div className="flex items-center gap-2 mb-2">
               <Tag className="w-5 h-5 text-slate-600" />
               <h2 className="text-lg font-semibold text-slate-900">Tags</h2>
             </div>
             <div className="flex flex-wrap gap-2">
               {post.tags.map((tag) => (
                 <Link
                   key={tag}
                   href={`/tags/${encodeURIComponent(tag)}`}
                   className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 text-sm font-medium group"
                 >
                   <Tag className="w-3 h-3 group-hover:scale-110 transition-transform" />
                   {tag}
                 </Link>
               ))}
             </div>
           </div>
         )}

        {/* Article Content */}
        <div className="container mx-auto max-w-4xl px-4 py-2 md:py-4">
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-6 md:p-8 lg:p-12">
              <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-strong:text-slate-900 prose-strong:font-semibold prose-em:text-slate-700 prose-em:italic prose-ul:space-y-2 prose-ol:space-y-2 prose-li:marker:text-slate-400">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, children, ...props }) => {
                      const hasOnlyImage =
                        node?.children?.length === 1 &&
                        node.children[0].type === "element" &&
                        node.children[0].tagName === "img"

                      if (hasOnlyImage) {
                        return <>{children}</>
                      }

                      const hasFigure = node?.children?.some(
                        (child) => child.type === "element" && child.tagName === "figure",
                      )

                      if (hasFigure) {
                        return <>{children}</>
                      }

                      return (
                        <p className="mb-6 text-base md:text-lg leading-relaxed" {...props}>
                          {children}
                        </p>
                      )
                    },
                    img: ({ src, alt }) => (
                      <figure className="relative my-8 md:my-12">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                          <Image
                            src={(src as string) || "/placeholder.svg"}
                            alt={alt || "Blog post image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          />
                        </div>
                        {alt && (
                          <figcaption className="text-sm text-slate-500 text-center mt-3 italic">{alt}</figcaption>
                        )}
                      </figure>
                    ),
                    a: ({ ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      />
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className?.includes('language-')
                      return (
                        <code
                          className={`${
                            isInline
                              ? 'bg-slate-100 text-slate-800 rounded px-1.5 py-0.5 text-sm font-mono'
                              : 'bg-slate-900 text-slate-100 rounded-md px-2 py-1 text-sm font-mono'
                          }`}
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children, ...props }) => (
                      <div className="relative my-6">
                        <pre
                          className="bg-slate-900 text-slate-100 rounded-xl p-4 md:p-6 overflow-x-auto text-sm leading-relaxed"
                          {...props}
                        >
                          {children}
                        </pre>
                      </div>
                    ),
                    table: ({ ...props }) => (
                      <div className="overflow-x-auto my-8 rounded-xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200" {...props} />
                      </div>
                    ),
                    th: ({ ...props }) => (
                      <th
                        className="px-6 py-4 bg-slate-50 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider"
                        {...props}
                      />
                    ),
                    td: ({ ...props }) => (
                      <td className="px-6 py-4 text-sm text-slate-700 border-t border-slate-100" {...props} />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="list-disc list-inside space-y-2 my-6 text-slate-700 leading-relaxed" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="list-decimal list-inside space-y-2 my-6 text-slate-700 leading-relaxed" {...props} />
                    ),
                    li: ({ ...props }) => (
                      <li className="text-slate-700 leading-relaxed pl-2" {...props} />
                    ),
                    h1: ({ ...props }) => (
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 mt-12 first:mt-0" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 mt-10 first:mt-0" {...props} />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 mt-8 first:mt-0" {...props} />
                    ),
                    h4: ({ ...props }) => (
                      <h4 className="text-base md:text-lg font-bold text-slate-900 mb-3 mt-6 first:mt-0" {...props} />
                    ),
                    h5: ({ ...props }) => (
                      <h5 className="text-sm md:text-base font-bold text-slate-900 mb-3 mt-6 first:mt-0" {...props} />
                    ),
                    h6: ({ ...props }) => (
                      <h6 className="text-sm font-bold text-slate-900 mb-3 mt-6 first:mt-0" {...props} />
                    ),
                    hr: ({ ...props }) => <hr className="my-12 border-t-2 border-slate-100" {...props} />,
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className="border-l-4 border-slate-300 bg-slate-50 pl-6 py-4 my-8 rounded-r-lg text-slate-700 leading-relaxed"
                        {...props}
                      />
                    ),
                    br: ({ ...props }) => <br {...props} />,
                    strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                    em: ({ ...props }) => <em className="italic text-slate-700" {...props} />,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags Section */}
              
            </div>
          </article>

          {/* Navigation Footer */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
