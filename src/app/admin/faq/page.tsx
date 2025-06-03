// app/admin/faq/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FormData {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: '',
  });

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch('/api/admin/faq');
        if (!response.ok) throw new Error('Failed to fetch FAQs');
        
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFAQs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        // Update existing FAQ
        const response = await fetch(`/api/admin/faq/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Failed to update FAQ');
        
        const updatedFaq = await response.json();
        setFaqs(faqs.map(faq => faq.id === editingId ? updatedFaq : faq));
        resetForm();
        alert('FAQ updated successfully!');
      } else {
        // Create new FAQ
        const response = await fetch('/api/admin/faq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Failed to create FAQ');
        
        const newFaq = await response.json();
        setFaqs([...faqs, newFaq]);
        resetForm();
        alert('FAQ created successfully!');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setEditingId(faq.id);
    
    // Scroll to form
    const formElement = document.getElementById('faq-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      const response = await fetch(`/api/admin/faq/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete FAQ');
      
      setFaqs(faqs.filter(faq => faq.id !== id));
      
      // If deleting the FAQ being edited, reset the form
      if (editingId === id) {
        resetForm();
      }
      
      alert('FAQ deleted successfully!');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
    });
    setEditingId(null);
  };

  if (loading && faqs.length === 0) return <div>Loading FAQs...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      
      {/* FAQ Form */}
      <div id="faq-form" className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Update FAQ' : 'Add New FAQ'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="question">
              Question
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="question"
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="answer">
              Answer
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows={5}
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
              {loading ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </div>
        </form>
      </div>
      
      {/* FAQs List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All FAQs ({faqs.length})
          </h3>
        </div>
        
        {faqs.length === 0 ? (
          <div className="p-4 text-center">No FAQs found. Add your first FAQ above!</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Q: {faq.question}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      A: {faq.answer}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
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
    </div>
  );
}