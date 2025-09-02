import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SecondaryNav = () => {
  const location = useLocation();
  
  // Only show on specific pages
  const showOnPages = ['/', '/collection', '/about'];
  const shouldShow = showOnPages.includes(location.pathname);
  
  if (!shouldShow) return null;

  return (
    <div className="bg-black text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-8 text-sm">
          <Link 
            to="/blogs" 
            className="hover:text-gray-300 transition-colors"
          >
            📖 Style Guide & Blog
          </Link>
          <span className="text-gray-400">|</span>
          <Link 
            to="/collection?new=true" 
            className="hover:text-gray-300 transition-colors"
          >
            ✨ New Arrivals
          </Link>
          <span className="text-gray-400">|</span>
          <Link 
            to="/collection?sale=true" 
            className="hover:text-gray-300 transition-colors"
          >
            🔥 Sale
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;
