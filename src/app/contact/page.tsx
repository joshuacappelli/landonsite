"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import Nav from '../components/nav';
import CountryNav from '../components/countryNav';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletterEmail: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletterEmail: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    message: '',
    isError: false,
    isSubmitted: false,
  });
  
  const [newsletterStatus, setNewsletterStatus] = useState({
    message: '',
    isError: false,
    isSubmitted: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        message: 'Please fill in all required fields',
        isError: true,
        isSubmitted: false,
      });
      return;
    }
    
    try {
      setFormStatus({
        message: 'Message sent successfully! I&apos;ll get back to you soon.',
        isError: false,
        isSubmitted: true,
      });
      
      setFormData(prev => ({
        ...prev,
        name: '',
        email: '',
        subject: '',
        message: '',
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus({
        message: 'Failed to send message. Please try again later.',
        isError: true,
        isSubmitted: false,
      });
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.newsletterEmail) {
      setNewsletterStatus({
        message: 'Please enter your email',
        isError: true,
        isSubmitted: false,
      });
      return;
    }
    
    try {
      setNewsletterStatus({
        message: 'Successfully subscribed to the newsletter!',
        isError: false,
        isSubmitted: true,
      });
      
      setFormData(prev => ({ ...prev, newsletterEmail: '' }));
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setNewsletterStatus({
        message: 'Failed to subscribe. Please try again later.',
        isError: true,
        isSubmitted: false,
      });
    }
  };

  return (
    <>
      <Nav onGlobeClick={() => {}} />
      <CountryNav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-40 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Contact Me | My Travel Blog</title>
          <meta name="description" content="Get in touch with me about my travel adventures" />
        </Head>
        
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get in Touch</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Have questions or want to collaborate? I&apos;d love to hear from you!</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Connect With Me</h2>
              
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>hello@mytravelblog.com</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <a href="https://instagram.com/mytravelblog" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">@mytravelblog</a>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
                <a href="https://twitter.com/mytravelblog" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">@mytravelblog</a>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <a href="https://facebook.com/mytravelblog" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">My Travel Blog</a>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <a href="https://linkedin.com/in/mytravelblog" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">My Travel Blog</a>
              </div>
            </div>
            
            {/* Contact Form Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Send Me a Message</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  ></textarea>
                </div>
                
                {formStatus.message && (
                  <div className={`p-3 rounded-md ${formStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {formStatus.message}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
          {/* Newsletter Section */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Subscribe to My Newsletter</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Get the latest travel stories, tips, and photos delivered straight to your inbox!</p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4">
              <input
                type="email"
                name="newsletterEmail"
                placeholder="Your email address"
                value={formData.newsletterEmail}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Subscribe
              </button>
            </form>
            
            {newsletterStatus.message && (
              <div className={`mt-4 p-3 rounded-md ${newsletterStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {newsletterStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}