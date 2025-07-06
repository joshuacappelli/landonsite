'use client';

import { useState, useEffect } from 'react';

interface HeroFavorite {
  id: number;
  title: string;
  description: string;
  image: string;
  blogId: number;
}

interface FormData {
  title: string;
  description: string;
  image: string;
  blogId: number;
}

export default function HeroFavoritesPage() {
  const [favorites, setFavorites] = useState<HeroFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image: '',
    blogId: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/admin/hero-favorites');
      if (!response.ok) throw new Error('Failed to fetch hero favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching hero favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/admin/hero-favorites/${editingId}`
        : '/api/admin/hero-favorites';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} hero favorite`);

      await fetchFavorites();
      resetForm();
      alert(`Hero favorite ${editingId ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving hero favorite:', error);
      alert(`Failed to ${editingId ? 'update' : 'create'} hero favorite`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (favorite: HeroFavorite) => {
    setFormData({
      title: favorite.title,
      description: favorite.description,
      image: favorite.image,
      blogId: favorite.blogId,
    });
    setEditingId(favorite.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hero favorite?')) return;

    try {
      const response = await fetch(`/api/admin/hero-favorites/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete hero favorite');

      setFavorites(favorites.filter(fav => fav.id !== id));
      alert('Hero favorite deleted successfully!');
    } catch (error) {
      console.error('Error deleting hero favorite:', error);
      alert('Failed to delete hero favorite');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      blogId: 0,
    });
    setEditingId(null);
  };

  if (loading && favorites.length === 0) return <div>Loading hero favorites...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hero Favorites</h1>

      {/* Add/Edit Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Hero Favorite' : 'Add New Hero Favorite'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
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

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blogId">
              Blog ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="blogId"
              type="number"
              name="blogId"
              value={formData.blogId}
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

      {/* List of Favorites */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {favorites.length === 0 ? (
          <div className="p-4 text-center">No hero favorites found. Add your first favorite!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="aspect-video mb-4 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={favorite.image}
                    alt={favorite.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg mb-2">{favorite.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{favorite.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(favorite)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(favorite.id)}
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