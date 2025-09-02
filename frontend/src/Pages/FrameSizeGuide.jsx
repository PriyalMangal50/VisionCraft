import React from 'react';
import SizeChart from '../components/SizeChart';

const FrameSizeGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <SizeChart 
          category="Eyeglasses" 
          isOpen={true} 
          onClose={() => window.history.back()} 
        />
      </div>
    </div>
  );
};

export default FrameSizeGuide;
