"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 dark:bg-black/80 backdrop-blur-sm border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl text-gray-300 font-bold">
              Home
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-24 pr-18">
            <Link
              href="/blog"
              className="text-gray-300 font-bold dark:text-gray-300 hover:text-gray-100 dark:hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/cameraroll"
              className="text-gray-300 font-bold dark:text-gray-300 hover:text-gray-100 dark:hover:text-white transition-colors"
            >
              Camera Roll
            </Link>
            <Link
              href="/about"
              className="text-gray-300 font-bold dark:text-gray-300 hover:text-gray-100 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 font-bold dark:text-gray-300 hover:text-gray-100 dark:hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
          
          {/* Mobile Expandable Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 space-y-1"
            >
              <div className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile Expandable Menu Content */}
        {isMenuOpen && (
          <div 
            className="md:hidden bg-gray-800 border-t border-gray-700"
            style={{
              animation: "slideDown 0.3s ease-out forwards",
            }}
          >
            <style jsx>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  max-height: 0;
                }
                to {
                  opacity: 1;
                  max-height: 200px;
                }
              }
            `}</style>
            <div className="py-2">
              <Link
                href="/blog"
                className="block px-4 py-3 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/cameraroll"
                className="block px-4 py-3 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Camera Roll
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
