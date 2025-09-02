import React from 'react';
import SizeChart from '../components/SizeChart';

const ContactSizeGuide = () => {
  return (
    <div className="min-h-screen bg-light-gray py-12 font-arial">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <SizeChart 
          category="Contact Lenses" 
          isOpen={true} 
          onClose={() => window.history.back()} 
        />
      </div>
    </div>
  );
};
export default ContactSizeGuide;
