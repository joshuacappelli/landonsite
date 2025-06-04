"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavProps {
  onGlobeClick: () => void;
}

export default function Nav({ onGlobeClick }: NavProps) {

  const [isGlobeOpen, setIsGlobeOpen] = useState(false);

  const toggleGlobe = () => {
    setIsGlobeOpen(!isGlobeOpen);
  };

  useEffect(() => {
    if (isGlobeOpen) {
      window.location.href = "/globe";
    }
    toggleGlobe();
  }, [isGlobeOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 dark:bg-black/80 backdrop-blur-sm border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center w-full">
            <Link href="/" className="text-xl text-gray-300 font-bold pl-15">
              Home
            </Link>
          </div>
          <div className="flex items-center space-x-8 w-full justify-between px-17">
            <button
              onClick={onGlobeClick}
              className="text-gray-300 font-bold dark:text-gray-300 hover:text-gray-100 dark:hover:text-white transition-colors"
            >
              Globe
            </button>
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
        </div>
      </div>
    </nav>
  );
}
