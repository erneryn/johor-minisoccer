"use client";

import Link from "next/link";
import { useState } from "react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white focus:outline-none"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div 
        className={`fixed h-h-screen-80 top-16 right-0 w-64 z-50 text-gray-900 opacity-80 bg-gray-100/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="p-4 text-right">
          <ul className="flex flex-col gap-4">
            <Link 
              onClick={() => setIsOpen(false)} 
              href="/" 
              className="text-2xl font-bold mb-4 border-b-2 border-gray-200 hover:text-orange-500 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              onClick={() => setIsOpen(false)} 
              href="/booking" 
              className="text-2xl font-bold mb-4 border-b-2 border-gray-200 hover:text-orange-500 transition-colors duration-200"
            >
              Booking
            </Link>
            <Link 
              onClick={() => setIsOpen(false)} 
              href="/login" 
              className="text-2xl font-bold mb-4 border-b-2 border-gray-200 hover:text-orange-500 transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              onClick={() => setIsOpen(false)} 
              href="/register" 
              className="text-2xl font-bold mb-4 border-b-2 border-gray-200 hover:text-orange-500 transition-colors duration-200"
            >
              Register
            </Link>
          </ul>
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute bottom-4 right-4 text-2xl font-bold mb-4 border-b-2 border-gray-200 hover:text-orange-500 transition-colors duration-200"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
