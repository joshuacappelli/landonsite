"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CountryData {
  country: string;
  postCount: number;
  id: number;
}

interface ContinentMap {
  [key: string]: CountryData[];
}

export default function CountryNav() {
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [continents, setContinents] = useState<ContinentMap>({});

  useEffect(() => {
    async function fetchContinents() {
      try {
        const response = await fetch('/api/continents');
        if (!response.ok) throw new Error('Failed to fetch continents');
        const data = await response.json();
        setContinents(data);
      } catch (error) {
        console.error('Error fetching continents:', error);
      } 
    }

    fetchContinents();
  }, []);

  

  return (
    <nav className="fixed top-16 left-0 right-0 z-40 bg-gray-900 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12">
          <div className="flex items-center justify-between w-full space-x-8 px-16">
            {Object.keys(continents).map((continent) => (
              <div key={continent} className="relative">
                <button
                  onClick={() => setActiveContinent(activeContinent === continent ? null : continent)}
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 font-medium"
                >
                  {continent}
                  {activeContinent === continent ? 
                    <ChevronUp className="h-4 w-4 text-blue-400" /> : 
                    <ChevronDown className="h-4 w-4 text-blue-400" />
                  }
                </button>
                {activeContinent === continent && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700"
                    style={{
                      animation: "fadeInDown 0.3s ease-out forwards",
                    }}
                  >
                    <style jsx>{`
                      @keyframes fadeInDown {
                        from {
                          opacity: 0;
                          transform: translateY(-10px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                    `}</style>
                    {continents[continent].map(({ country, id }) => (
                      <Link
                        key={country}
                        href={`/blog/${id}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        {country}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}