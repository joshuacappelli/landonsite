// pages/about.tsx
"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../components/nav';
import CountryNav from '../components/countryNav';

interface AboutData {
  title: string;
  secondTitle: string;
  description: string;
  secondDescription: string;
  image: string;
  secondImage: string;
}

interface QuickFact {
  id: number;
  title: string;
  description: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [quickFacts, setQuickFacts] = useState<QuickFact[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutRes, factsRes, faqsRes] = await Promise.all([
          fetch('/api/admin/about'),
          fetch('/api/admin/quick-facts'),
          fetch('/api/admin/faq')
        ]);
        
        if (!aboutRes.ok || !factsRes.ok || !faqsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const aboutData = await aboutRes.json();
        const factsData = await factsRes.json();
        const faqsData = await faqsRes.json();
        
        // Validate image URL
        if (aboutData && aboutData.image) {
          try {
            new URL(aboutData.image);
          } catch {
            aboutData.image = '/placeholder-profile.jpg';
          }
        }
        
        setAboutData(aboutData);
        setQuickFacts(factsData);
        setFaqs(faqsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  if (loading) {
    return (
      <>
        <Nav />
        <CountryNav />
        <div className="p-8 pt-40">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (!aboutData) {
    return (
      <>
        <Nav />
        <CountryNav />
        <div className="p-8 pt-40">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center">No data available</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <CountryNav />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Head>
          <title>About Me | My Travel Blog</title>
          <meta name="description" content="Learn more about the traveler behind the adventures" />
        </Head>

        {/* Hero Section with Parallax Effect */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0">
            {aboutData?.image && (
              <Image
                src={aboutData.image}
                alt="Travel Background"
                fill
                className="object-cover transform scale-105"
                priority
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
                {aboutData?.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                {aboutData?.secondTitle}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          {/* Photo and Intro Section */}
          <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
            <div className="md:w-1/3 flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
              <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto rounded-2xl overflow-hidden shadow-2xl">
                {aboutData?.image && !imageError ? (
                  <Image
                    src={aboutData.secondImage}
                    alt="Travel Blogger Portrait"
                    fill
                    className="object-cover"
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-amber-700 flex items-center justify-center">
                    <span className="text-white text-lg">Image not available</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-900">{aboutData.title}</h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {aboutData.description}
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {aboutData.secondDescription}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-6 py-3 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Adventure Seeker
                </span>
                <span className="px-6 py-3 bg-slate-100 text-slate-800 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
                  Photographer
                </span>
                <span className="px-6 py-3 bg-stone-100 text-stone-800 rounded-full text-sm font-medium hover:bg-stone-200 transition-colors">
                  Food Explorer
                </span>
                <span className="px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                  Culture Enthusiast
                </span>
              </div>
            </div>
          </div>

          {/* Quick Facts Section */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
              Quick Facts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quickFacts.map((fact) => (
                <div 
                  key={fact.id} 
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">{fact.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left focus:outline-none"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
                      <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${
                          openFaqId === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    className={`px-6 transition-all duration-300 ease-in-out ${
                      openFaqId === faq.id ? 'max-h-96 pb-6' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="relative overflow-hidden rounded-3xl bg-green-800 p-12">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Join Me On This Journey</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">  
                Stay updated with my latest adventures, travel tips, and exclusive content by subscribing to my newsletter and following me on social media.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#" 
                  className="group bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
                <a 
                  href="#" 
                  className="group bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </a>
                <Link 
                  href="/contact" 
                  className="group bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Newsletter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

