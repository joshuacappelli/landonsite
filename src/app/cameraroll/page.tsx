"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Nav from '../components/nav';
import CountryNav from '../components/countryNav';
import Loader from '../components/loader';

interface Media {
  id: number;
  type: 'image' | 'video';
  image: string;
  name: string;
  continent: string;
  country: string;
  googleMaps: string;
  date: string;
}

export default function CameraRoll() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const [imagesRes, videosRes] = await Promise.all([
          fetch('/api/admin/camera-roll/images'),
          fetch('/api/admin/camera-roll/videos')
        ]);
        
        if (!imagesRes.ok || !videosRes.ok) {
          throw new Error('Failed to fetch media');
        }
        
        const images = await imagesRes.json();
        const videos = await videosRes.json();
        
        const formattedImages = images.map((img: Media) => ({
          id: img.id,
          type: 'image' as const,
          image: img.image,
          name: img.name,
          continent: img.continent,
          country: img.country,
          googleMaps: img.googleMaps,
          date: img.date
        }));
        
        const formattedVideos = videos.map((vid: Media) => ({
          id: vid.id,
          type: 'video' as const,
          image: vid.image,
          name: vid.name,
          continent: vid.continent,
          country: vid.country,
          googleMaps: vid.googleMaps,
          date: vid.date
        }));
        
        const allMedia = [...formattedImages, ...formattedVideos].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setMedia(allMedia);
        
        // Extract unique countries
        const uniqueCountries = Array.from(new Set(
          allMedia
            .map(item => item.country)
            .filter(country => country) // Remove null/undefined
        )).sort();
        
        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMedia();
  }, []);

  const filteredMedia = media.filter(item => {
    const typeMatch = activeTab === 'all' || item.type === activeTab;
    const countryMatch = selectedCountry === 'all' || item.country === selectedCountry;
    return typeMatch && countryMatch;
  });

  const handleMediaClick = (item: Media) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

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

  return (
    <>
      <Nav />
      <CountryNav />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="py-8">
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            {/* Type Tabs */}
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'image'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'video'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Videos
              </button>
            </div>

            {/* Country Filter */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Media Grid */}
          {filteredMedia.length === 0 ? (
            <div className="text-center text-gray-500">
              No media found. Try adjusting your filters!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleMediaClick(item)}
                >
                  {item.type === 'image' ? (
                    <Image
                      src={item.image}
                      alt={`Photo from ${item.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={item.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="font-medium">{item.name}</p>
                      {item.country && (
                        <p className="text-sm opacity-90">{item.country}</p>
                      )}
                      <p className="text-sm opacity-90">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative aspect-video">
                {selectedMedia.type === 'image' ? (
                  <Image
                    src={selectedMedia.image}
                    alt={`Photo from ${selectedMedia.name}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={selectedMedia.image}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              <div className="p-8 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMedia.name}</h3>
                    {selectedMedia.country && (
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">{selectedMedia.country}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <time dateTime={selectedMedia.date} className="text-sm">
                        {new Date(selectedMedia.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
                
                {selectedMedia.googleMaps && (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={selectedMedia.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
