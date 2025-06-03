// app/admin/locations/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Location {
  id: string;
  country: string;
  city: string;
  continent: string;
  image: string;
}

interface FormData {
  country: string;
  continent: string;
  city: string;
  image: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    country: '',
    continent: '',
    city: '',
    image: '',
  });

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/admin/locations');
        if (!response.ok) throw new Error('Failed to fetch locations');
        
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLocations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        // Update existing location
        const response = await fetch(`/api/admin/locations/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Failed to update location');
        
        const updatedLocation = await response.json();
        setLocations(locations.map(loc => loc.id === editingId ? updatedLocation : loc));
        resetForm();
        alert('Location updated successfully!');
      } else {
        // Create new location
        const response = await fetch('/api/admin/locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Failed to create location');
        
        const newLocation = await response.json();
        setLocations([...locations, newLocation]);
        resetForm();
        alert('Location added successfully!');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location: Location) => {
    setFormData({
      country: location.country,
      city: location.city,
      image: location.image,
      continent: location.continent,
    });
    setEditingId(location.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete location');
      
      setLocations(locations.filter(location => location.id !== id));
      
      // If deleting the location being edited, reset the form
      if (editingId === id) {
        resetForm();
      }
      
      alert('Location deleted successfully!');
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location');
    }
  };

  const resetForm = () => {
    setFormData({
      country: '',
      city: '',
      image: '',
      continent: '',
    });
    setEditingId(null);
  };

  if (loading && locations.length === 0) return <div>Loading locations...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Locations</h1>
      
      {/* Locations Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Location' : 'Add New Location'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                Country
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="country"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                City
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="continent">
                Continent
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="continent"
                type="text"
                name="continent"
                value={formData.continent}
                onChange={handleChange}
                required
              />
            </div>
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
              className={`${
                editingId ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-blue-500 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingId ? 'Update Location' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Locations Grid */}
      {locations.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          No locations found. Add your first location above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={location.image} 
                  alt={`${location.city}, ${location.country}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{location.city}</h3>
                <p className="text-gray-600 mb-4">{location.country}</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(location)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}