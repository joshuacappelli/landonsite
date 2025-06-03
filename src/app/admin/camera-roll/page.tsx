'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';

interface Media {
  id: string;
  type: 'image' | 'video';
  image: string;
  url: string;
  location: string;
  date: string;
}

export default function CameraRollPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMedia, setNewMedia] = useState({
    type: 'image' as 'image' | 'video',
    location: ''
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
          ...imagesData.map((img: any) => ({ ...img, type: 'image' as const })),
          ...videosData.map((vid: any) => ({ ...vid, type: 'video' as const }))
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
          location: newMedia.location,
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Failed to save media');

      const newItem = await response.json();
      setMedia([...media, { ...newItem, type: newMedia.type }]);
      setNewMedia({ type: 'image', location: '' });
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Error saving media:', error);
      alert('Failed to save media');
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMedia(prev => ({
      ...prev,
      location: e.target.value
    }));
  };

  if (loading) return <div>Loading camera roll...</div>;

  const filteredMedia = media.filter(item => item.type === activeTab);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Camera Roll</h1>
      
      {/* Add New Media Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Media</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Media Type</label>
            <select
              value={newMedia.type}
              onChange={(e) => setNewMedia(prev => ({ ...prev, type: e.target.value as 'image' | 'video' }))}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
            <input
              type="text"
              value={newMedia.location}
              onChange={handleLocationChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter location"
              required
            />
          </div>
          
          <FileUpload
            onUploadCompleteAction={handleUploadComplete}
            acceptedFileTypes={newMedia.type === 'image' ? 'image/*' : 'video/*'}
            maxFileSize={newMedia.type === 'image' ? 1 * 1024 * 1024 * 1024 : 100 * 1024 * 1024 * 1024} // 5MB for images, 100MB for videos
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('image')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'image'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Images ({media.filter(m => m.type === 'image').length})
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`ml-8 py-2 px-4 text-center border-b-2 font-medium text-sm ${
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
        <p>No {activeTab}s found. Add your first {activeTab}!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                {item.type === 'image' ? (
                  <>
                    <img 
                      src={item.image} 
                      alt={`Camera roll ${item.type}`} 
                      className="w-full h-full object-cover"
                      onError={async (e) => {
                        console.error('Error loading image:', {
                          originalUrl: item.image,
                          error: e
                        });
                        
                        // Try to fetch the image to check if it's accessible
                        try {
                          const response = await fetch(item.image);
                          console.log('Image fetch response:', {
                            status: response.status,
                            statusText: response.statusText,
                            headers: Object.fromEntries(response.headers.entries())
                          });
                        } catch (fetchError) {
                          console.error('Image fetch error:', fetchError);
                        }
                      }}
                      onLoad={() => {
                        console.log('Successfully loaded image:', item.image);
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                      <p className="text-white text-xs truncate">{item.image}</p>
                    </div>
                  </>
                ) : (
                  <video 
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls
                    onError={(e) => {
                      console.error('Error loading video:', {
                        originalUrl: item.url,
                        error: e
                      });
                    }}
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Location:</span> {item.location}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Date:</span> {new Date(item.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">URL:</span> {item.image}
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
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