// app/admin/about/page.jsx
'use client';

import { useState, useEffect } from 'react';

interface AboutData {
  id: number;
  title: string;
  secondTitle: string;
  description: string;
  secondDescription: string;
  image: string;
}

interface QuickFact {
  id: number;
  title: string;
  description: string;
}

interface FormData {
  title: string;
  secondTitle: string;
  description: string;
  secondDescription: string;
  image: string;
}

interface NewFact {
  title: string;
  description: string;
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [quickFacts, setQuickFacts] = useState<QuickFact[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    secondTitle: '',
    description: '',
    secondDescription: '',
    image: '',
  });
  const [newFact, setNewFact] = useState<NewFact>({ title: '', description: '' });
  const [editingFactId, setEditingFactId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const [aboutRes, factsRes] = await Promise.all([
          fetch('/api/admin/about'),
          fetch('/api/admin/quick-facts')
        ]);
        
        if (!aboutRes.ok || !factsRes.ok) {
          throw new Error('Failed to fetch about data');
        }
        
        const aboutData = await aboutRes.json();
        const factsData = await factsRes.json();
        
        setAboutData(aboutData);
        setQuickFacts(factsData);
        
        // Only set form data if aboutData exists
        if (aboutData) {
          setFormData({
            title: aboutData.title || '',
            secondTitle: aboutData.secondTitle || '',
            description: aboutData.description || '',
            secondDescription: aboutData.secondDescription || '',
            image: aboutData.image || '',
          });
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAboutData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFact(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const method = aboutData ? 'PUT' : 'POST';
      const url = aboutData ? `/api/admin/about/${aboutData.id}` : '/api/admin/about';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update about data');
      
      const updatedData = await response.json();
      setAboutData(updatedData);
      alert('About information updated successfully!');
    } catch (error) {
      console.error('Error updating about data:', error);
      alert('Failed to update about information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newFact.title.trim() || !newFact.description.trim()) {
      alert('Please fill in both title and description for the quick fact');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/quick-facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFact),
      });
      
      if (!response.ok) throw new Error('Failed to add quick fact');
      
      const newFactData = await response.json();
      setQuickFacts([...quickFacts, newFactData]);
      setNewFact({ title: '', description: '' });
      alert('Quick fact added successfully!');
    } catch (error) {
      console.error('Error adding quick fact:', error);
      alert('Failed to add quick fact');
    }
  };

  const handleEditFact = (fact: QuickFact) => {
    setNewFact({
      title: fact.title,
      description: fact.description
    });
    setEditingFactId(fact.id);
  };

  const handleUpdateFact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newFact.title.trim() || !newFact.description.trim()) {
      alert('Please fill in both title and description for the quick fact');
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/quick-facts/${editingFactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFact),
      });
      
      if (!response.ok) throw new Error('Failed to update quick fact');
      
      const updatedFact = await response.json();
      setQuickFacts(quickFacts.map(fact => 
        fact.id === editingFactId ? updatedFact : fact
      ));
      setNewFact({ title: '', description: '' });
      setEditingFactId(null);
      alert('Quick fact updated successfully!');
    } catch (error) {
      console.error('Error updating quick fact:', error);
      alert('Failed to update quick fact');
    }
  };

  const handleDeleteFact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quick fact?')) return;
    
    try {
      const response = await fetch(`/api/admin/quick-facts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete quick fact');
      
      setQuickFacts(quickFacts.filter(fact => fact.id !== id));
      alert('Quick fact deleted successfully!');
      
      // Reset editing state if deleting the fact being edited
      if (editingFactId === id) {
        setNewFact({ title: '', description: '' });
        setEditingFactId(null);
      }
    } catch (error) {
      console.error('Error deleting quick fact:', error);
      alert('Failed to delete quick fact');
    }
  };

  const cancelFactEdit = () => {
    setNewFact({ title: '', description: '' });
    setEditingFactId(null);
  };

  if (loading && !aboutData) return <div>Loading about information...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">About Me Information</h1>
      
      {/* About Me Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Main Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secondTitle">
                Second Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="secondTitle"
                type="text"
                name="secondTitle"
                value={formData.secondTitle}
                onChange={handleChange}
                required
              />
            </div>
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
              rows={4}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secondDescription">
              Second Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="secondDescription"
              name="secondDescription"
              value={formData.secondDescription}
              onChange={handleChange}
              rows={4}
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
          
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Quick Facts Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Facts</h2>
        
        {/* Add/Edit Quick Fact Form */}
        <form onSubmit={editingFactId ? handleUpdateFact : handleAddFact} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="factTitle">
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="factTitle"
                type="text"
                name="title"
                value={newFact.title}
                onChange={handleFactInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="factDescription">
                Description
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="factDescription"
                type="text"
                name="description"
                value={newFact.description}
                onChange={handleFactInputChange}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {editingFactId && (
              <button
                type="button"
                onClick={cancelFactEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`${
                editingFactId ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-green-500 hover:bg-green-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              {editingFactId ? 'Update Fact' : 'Add Fact'}
            </button>
          </div>
        </form>
        
        {/* Quick Facts List */}
        {quickFacts.length === 0 ? (
          <p>No quick facts found. Add your first fact!</p>
        ) : (
          <div className="space-y-4">
            {quickFacts.map((fact, index) => (
              <div 
                key={`${fact.id}-${index}`}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{fact.title}</h3>
                  <p className="text-gray-600 text-sm">{fact.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditFact(fact)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFact(fact.id)}
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