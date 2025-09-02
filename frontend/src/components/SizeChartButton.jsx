import React, { useState } from 'react';
import SizeChart from './SizeChart';

/**
 * A button component that opens the size chart
 * @param {Object} props
 * @param {string} props.category - 'Eyeglasses', 'Sunglasses', or 'Contact Lenses'
 * @param {string} props.className - Additional classes for the button
 * @param {string} props.label - Button label text, defaults to "Size Guide"
 */
const SizeChartButton = ({ category = 'Eyeglasses', className = '', label = 'Size Guide' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`text-sm flex items-center gap-1 text-gray hover:text-pink underline font-arial ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {label}
      </button>
      
      {isOpen && (
        <SizeChart
          category={category}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SizeChartButton;
