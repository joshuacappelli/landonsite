"use client"
import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Tag, FileText, ArrowLeft } from "lucide-react"
import Nav from "../../components/nav"
import CountryNav from "../../components/countryNav"
import Loader from "../../components/loader"

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

export default function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [tag, setTag] = useState<string>("")
  const [showAllTags, setShowAllTags] = useState(false)
  const resolvedParams = use(params)

  useEffect(() => {
    async function fetchPostsByTag() {
      try {
        const decodedTag = decodeURIComponent(resolvedParams.tag)
        setTag(decodedTag)

        const response = await fetch(`/api/admin/posts`)
        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }

        const allPosts = await response.json()

        // Filter posts that contain the specified tag
        const filteredPosts = allPosts.filter((post: Post) => post.tags && post.tags.includes(decodedTag))

        // Extract all unique tags from all posts
        const tagsSet = new Set<string>()
        allPosts.forEach((post: Post) => {
          if (post.tags) {
            post.tags.forEach(tag => tagsSet.add(tag))
          }
        })
        const uniqueTags = Array.from(tagsSet).sort()

        setPosts(filteredPosts)
        setAllTags(uniqueTags)
      } catch (error) {
        console.error("Error fetching posts by tag:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPostsByTag()
  }, [resolvedParams.tag])

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

  return (
    <>
      <Nav />
      <CountryNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Back Navigation */}
          <div className="mb-6 md:mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Blog</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="mb-6">
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                <Tag className="w-4 h-4" />
                <span>Tag</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showAllTags ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* All Tags Spread */}
            {showAllTags && (
              <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
                <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                  {allTags.map((tagItem) => (
                    <Link
                      key={tagItem}
                      href={`/tags/${encodeURIComponent(tagItem)}`}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        tagItem === tag
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 hover:scale-105'
                      }`}
                    >
                      {tagItem}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">{tag}</h1>
            <p className="text-lg md:text-xl text-slate-600">
              {posts.length} {posts.length === 1 ? "post" : "posts"} found
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">No posts found</h3>
                <p className="text-slate-600 mb-8 text-sm md:text-base">
                  No posts found with the tag "{tag}". Try exploring other tags or browse all posts.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse All Posts
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200"
                >
                  <div className="relative h-48 md:h-52 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {post.guide && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-lg">
                          Guide
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-6">
                    {/* Location and Country Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {post.country && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                          <MapPin className="w-3 h-3" />
                          {post.country}
                        </div>
                      )}
                      {post.location && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                          <MapPin className="w-3 h-3" />
                          {post.location}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-slate-600 text-sm md:text-base mb-4 line-clamp-3 leading-relaxed">
                      {post.content.replace(/[#*`]/g, "").substring(0, 120)}...
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <time className="text-xs md:text-sm font-medium">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tagItem) => (
                            <span
                              key={tagItem}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                            >
                              {tagItem}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button (if you want to add pagination later) */}
          {posts.length > 0 && (
            <div className="text-center mt-12 md:mt-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium shadow-sm">
                <span className="text-sm">Showing all {posts.length} posts</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
