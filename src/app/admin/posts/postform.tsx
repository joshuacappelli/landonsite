'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  date: Date;
  content: string;
  country: string | null;
  guide: boolean;
  location: string | null;
  tags: string[];
  image: string;
}

interface PostFormProps {
  post?: Post;
}

interface FormData {
  title: string;
  content: string;
  date: string;
  image: string;
  location: string | null;
  country: string | null;
  tags: string[];
  guide: boolean;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!post;
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    location: '',
    country: '',
    guide: false,
    tags: [],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
      
      setFormData({
        title: post.title,
        content: post.content,
        date: new Date(post.date).toISOString().split('T')[0],
        image: post.image,
        location: post.location,
        country: post.country,
        tags: tags,
        guide: post.guide,
      });
    }
  }, [post, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | boolean } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/admin/posts/${post.id}` : '/api/admin/posts';
    
    // Log the exact data being sent
    console.log('Submitting form data:', {
      ...formData,
      date: new Date(formData.date).toISOString(),
      guide: formData.guide ? 1 : 0
    });
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
          guide: formData.guide ? 1 : 0
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(
          errorData.details?.message || 
          errorData.error || 
          `Failed to ${isEditing ? 'update' : 'create'} post`
        );
      }
      
      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} post:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
          Content
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={10}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Continent
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Country
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="country"
            type="text"
            name="country"
            value={formData.country || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guide">
          Guide Post
        </label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleChange({ target: { name: 'guide', value: !formData.guide } })}
            className={`px-4 py-2 rounded ${
              formData.guide 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white font-bold transition-colors`}
          >
            {formData.guide ? 'Yes' : 'No'}
          </button>
        </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Image URL
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="image"
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
          Tags
        </label>
        <div className="flex">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin/posts')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}