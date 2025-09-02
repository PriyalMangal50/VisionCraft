import React from 'react';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  return (
    <div className="bg-gray-50 py-6 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-8 text-sm">
          <span className="text-gray-600 font-medium">Discover:</span>
          <Link 
            to="/blogs" 
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <span>📝</span>
            <span>Style Blog</span>
          </Link>
          <Link 
            to="/collection?category=new" 
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <span>✨</span>
            <span>New Arrivals</span>
          </Link>
          <Link 
            to="/collection?sale=true" 
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <span>🔥</span>
            <span>Sale Items</span>
          </Link>
          <Link 
            to="/faq" 
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <span>❓</span>
            <span>Help Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
