'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/app/components/FileUpload';

interface Media {
  id: string;
  type: 'image' | 'video';
  image: string;
  url: string;
  name: string;
  continent: string;
  country: string;
  location: string;
  googleMaps: string;
  date: string;
}

export default function CameraRollPage() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMedia, setNewMedia] = useState({
    type: 'image' as 'image' | 'video',
    name: '',
    continent: '',
    country: '',
    location: '',
    googleMaps: ''
  });

  useEffect(() => {
    async function fetchMedia() {
      try {
        console.log('Fetching media...');
        const [imagesRes, videosRes] = await Promise.all([
          fetch('/api/admin/camera-roll/images'),
          fetch('/api/admin/camera-roll/videos')
        ]);
        
        if (!imagesRes.ok || !videosRes.ok) {
          throw new Error('Failed to fetch media');
        }
        
        const imagesData = await imagesRes.json();
        const videosData = await videosRes.json();
        
        console.log('Fetched images:', imagesData);
        console.log('Fetched videos:', videosData);
        
        setMedia([
          ...imagesData.map((img: Media) => ({ ...img, type: 'image' as const })),
          ...videosData.map((vid: Media) => ({ ...vid, type: 'video' as const }))
        ]);
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMedia();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const item = media.find(m => m.id === id);
      if (!item) {
        throw new Error('Item not found');
      }

      const response = await fetch(`/api/admin/camera-roll/${id}?type=${item.type}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: item.type === 'image' ? item.image : item.url
        }),
      });
      
      if (!response.ok) throw new Error('Failed to delete media');
      
      setMedia(media.filter(item => item.id !== id));
      alert('Media deleted successfully!');
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media');
    }
  };

  const handleUploadComplete = async (fileUrl: string) => {
    try {
      const response = await fetch('/api/admin/camera-roll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newMedia.type,
          url: fileUrl,
          name: newMedia.name,
          continent: newMedia.continent,
          country: newMedia.country,
          location: newMedia.location,
          googleMaps: newMedia.googleMaps,
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Failed to save media');

      const newItem = await response.json();
      setMedia([...media, { ...newItem, type: newMedia.type }]);
      setNewMedia({ type: 'image', name: '', continent: '', country: '', location: '', googleMaps: '' });
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Error saving media:', error);
      alert('Failed to save media');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedia(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const filteredMedia = media.filter(item => item.type === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Camera Roll</h1>
      
      {/* Add New Media Form */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Add New Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <select
                value={newMedia.type}
                onChange={(e) => setNewMedia(prev => ({ ...prev, type: e.target.value as 'image' | 'video' }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={newMedia.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Continent</label>
              <input
                type="text"
                name="continent"
                value={newMedia.continent}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter continent"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={newMedia.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={newMedia.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
              <input
                type="url"
                name="googleMaps"
                value={newMedia.googleMaps}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Google Maps URL"
              />
            </div>

            <div className="pt-4">
              <FileUpload
                onUploadCompleteAction={handleUploadComplete}
                acceptedFileTypes={newMedia.type === 'image' ? 'image/*' : 'video/*'}
                maxFileSize={newMedia.type === 'image' ? 1 * 1024 * 1024 * 1024 : 100 * 1024 * 1024 * 1024}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('image')}
              className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'image'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Images ({media.filter(m => m.type === 'image').length})
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'video'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Videos ({media.filter(m => m.type === 'video').length})
            </button>
          </nav>
        </div>
      </div>
      
      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {activeTab}s found. Add your first {activeTab}!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {item.type === 'image' ? (
                  <img 
                    src={item.image} 
                    alt={item.name || `Camera roll ${item.type}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', {
                        originalUrl: item.image,
                        error: e
                      });
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                ) : (
                  <video 
                    src={item.url} 
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{item.name || 'Untitled'}</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  {item.continent && <p>Continent: {item.continent}</p>}
                  {item.country && <p>Country: {item.country}</p>}
                  {item.location && <p>Location: {item.location}</p>}
                  {item.googleMaps && (
                    <a 
                      href={item.googleMaps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}