"use client";

import Image from "next/image";
import CountryNav from "./components/countryNav";
import Nav from "./components/nav";
import Link from "next/link";
import { useState, useEffect } from "react";

interface HeroSettings {
  id: number;
  title: string;
  description: string;
  fontColor: string;
  textColor: string;
  video: string;
  backgroundColor: string;
  fontSize: number;
  image: string;
}

interface HeroFavorite {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface HeroTag {
  id: number;
  tag: string;
  image: string;
}

export default function Home() {
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [heroFavorites, setHeroFavorites] = useState<HeroFavorite[]>([]);
  const [heroTags, setHeroTags] = useState<HeroTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const [settingsRes, favoritesRes, tagsRes] = await Promise.all([
          fetch('/api/admin/hero-settings'),
          fetch('/api/admin/hero-favorites'),
          fetch('/api/admin/hero-tags')
        ]);

        if (!settingsRes.ok || !favoritesRes.ok || !tagsRes.ok) {
          throw new Error('Failed to fetch hero data');
        }

        const [settings, favorites, tags] = await Promise.all([
          settingsRes.json(),
          favoritesRes.json(),
          tagsRes.json()
        ]);

        // Validate and set hero settings
        if (settings) {
          // Ensure image URL is valid
          if (settings.image && !settings.image.startsWith('http') && !settings.image.startsWith('/')) {
            settings.image = `/${settings.image}`;
          }
          // Ensure video URL is valid
          if (settings.video && !settings.video.startsWith('http') && !settings.video.startsWith('/')) {
            settings.video = `/${settings.video}`;
          }
          setHeroSettings(settings);
        }

        // Validate and set hero favorites
        const validatedFavorites = favorites.map((favorite: HeroFavorite) => ({
          ...favorite,
          image: favorite.image && !favorite.image.startsWith('http') && !favorite.image.startsWith('/')
            ? `/${favorite.image}`
            : favorite.image
        }));
        setHeroFavorites(validatedFavorites);

        // Validate and set hero tags
        const validatedTags = tags.map((tag: HeroTag) => ({
          ...tag,
          image: tag.image && !tag.image.startsWith('http') && !tag.image.startsWith('/')
            ? `/${tag.image}`
            : tag.image
        }));
        setHeroTags(validatedTags);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Nav />
        <CountryNav />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Nav />
      <CountryNav />
      
      <main className="pt-27">
        <div className="flex flex-col">
          <div className="relative w-full">
            <div className="w-full h-[750px]">
              <iframe
                src={heroSettings?.video || "https://www.youtube.com/embed/RLfNgIDUnoE?autoplay=1&mute=1&controls=0&loop=1&playlist=RLfNgIDUnoE"}
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="absolute inset-0 flex justify-center pt-12">
              <div className="flex flex-col space-y-4">
                <h1 
                  className="text-6xl font-bold drop-shadow-lg"
                  style={{ 
                    color: heroSettings?.fontColor || 'black',
                    fontSize: `${heroSettings?.fontSize || 48}px`
                  }}
                >
                  {heroSettings?.title}
                </h1>
                
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <section className="py-20 px-8 md:px-16 lg:px-24 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left Column - Text */}
                <div className="space-y-6">
                  <h2 className="text-5xl font-bold text-amber-800 dark:text-amber-600">
                    Hey, I&apos;m Landon
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {heroSettings?.description}
                      
                    </p>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      Through this platform, I curate authentic travel experiences that go beyond 
                      typical tourist attractions. I believe in sustainable tourism, connecting with 
                      local communities, and creating memories that last a lifetime. Join me as we 
                      explore this amazing world together, one adventure at a time.
                    </p>

                    <Link 
                      href="/about" 
                      className="inline-block px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-amber-800 hover:scale-105"
                    >
                      More About Me
                    </Link>
                  </div>
                </div>
                
                <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                  {heroSettings?.image ? (
                    <Image
                      src={heroSettings.image}
                      alt="Landon's profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500 text-lg">
                      Landon image will go here
                    </div>
                  )}
                </div>
              </div>

              {/* Want to Learn More Section */}
              <div className="mt-16 text-center">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-0.5 w-24 bg-amber-600 dark:bg-amber-500"></div>
                  <h3 className="text-6xl font-bold text-gray-900 dark:text-white">
                    Ready to Learn More?
                  </h3>
                  <div className="h-0.5 w-24 bg-amber-600 dark:bg-amber-500"></div>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {heroFavorites.map((favorite) => (
                    <div 
                      key={favorite.id}
                      className="group relative aspect-video overflow-hidden rounded-xl shadow-lg 
                               transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl
                               cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent 
                                    opacity-75 group-hover:opacity-90 transition-opacity duration-500"></div>
                      <Image
                        src={favorite.image}
                        alt={favorite.title}
                        fill
                        className="object-cover transform transition-transform duration-500 
                                 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 p-6 transform transition-transform duration-500
                                    group-hover:translate-y-[-8px]">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 
                                     transition-colors duration-300">{favorite.title}</h3>
                        <p className="text-white/0 group-hover:text-white/90 transition-all duration-500 
                                    text-sm mt-2">{favorite.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Tags Section */}
              <div className="mt-16">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-0.5 w-24 bg-amber-600 dark:bg-amber-500"></div>
                  <h3 className="text-6xl font-bold text-gray-900 dark:text-white">
                    Explore by Category
                  </h3>
                  <div className="h-0.5 w-24 bg-amber-600 dark:bg-amber-500"></div>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {heroTags.map((tag) => (
                    <div 
                      key={tag.id}
                      className="group relative aspect-video overflow-hidden rounded-xl shadow-lg 
                               transition-all duration-500 ease-in-out hover:scale-105"
                    >
                      <Image
                        src={tag.image}
                        alt={tag.tag}
                        fill
                        className="object-cover transform transition-transform duration-500 
                                 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent 
                                    opacity-75 group-hover:opacity-90 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <h3 className="text-2xl font-bold text-white mb-2">{tag.tag}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Signup Section */}
          <div className="relative py-20 overflow-hidden">
            <div className="absolute inset-0"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-0.5 w-24 bg-amber-600 dark:bg-amber-500"> </div>
                  <h2 className="text-6xl font-bold text-gray-900 dark:text-white">
                    Stay Updated
                  </h2>
                  <div className="h-0.5 w-24 bg-amber-600 dark:bg-amber-500"></div>
                </div>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Join my newsletter to receive updates about new travel destinations, tips, and exclusive content.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}