'use client';

import { useState, useEffect } from 'react';

interface HeroTag {
  id: number;
  tag: string;
  image: string;
}

interface FormData {
  tag: string;
  image: string;
}

export default function HeroTagsPage() {
  const [tags, setTags] = useState<HeroTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    tag: '',
    image: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/hero-tags');
      if (!response.ok) throw new Error('Failed to fetch hero tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching hero tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/admin/hero-tags/${editingId}`
        : '/api/admin/hero-tags';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} hero tag`);

      await fetchTags();
      resetForm();
      alert(`Hero tag ${editingId ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving hero tag:', error);
      alert(`Failed to ${editingId ? 'update' : 'create'} hero tag`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: HeroTag) => {
    setFormData({
      tag: tag.tag,
      image: tag.image,
    });
    setEditingId(tag.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hero tag?')) return;

    try {
      const response = await fetch(`/api/admin/hero-tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete hero tag');

      setTags(tags.filter(tag => tag.id !== id));
      alert('Hero tag deleted successfully!');
    } catch (error) {
      console.error('Error deleting hero tag:', error);
      alert('Failed to delete hero tag');
    }
  };

  const resetForm = () => {
    setFormData({
      tag: '',
      image: '',
    });
    setEditingId(null);
  };

  if (loading && tags.length === 0) return <div>Loading hero tags...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hero Tags</h1>

      {/* Add/Edit Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Hero Tag' : 'Add New Hero Tag'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tag">
              Tag
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tag"
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
            />
          </div>

          <div>
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

          <div className="flex justify-end space-x-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* List of Tags */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {tags.length === 0 ? (
          <div className="p-4 text-center">No hero tags found. Add your first tag!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="aspect-video mb-4 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={tag.image}
                    alt={tag.tag}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg mb-4">{tag.tag}</h3>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 