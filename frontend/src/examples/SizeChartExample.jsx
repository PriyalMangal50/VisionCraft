import React from 'react';
import SizeChart from '../components/SizeChart';
import SizeChartButton from '../components/SizeChartButton';
import { useSizeChart } from '../hooks/useSizeChart';

/**
 * Example of how to use the size chart in a product component
 */
const SizeChartExample = ({ product }) => {
  // Using the size chart hook
  const { isOpen, category, openChart, closeChart } = useSizeChart();
  
  const handleOpenSizeChart = () => {
    // Open the size chart with the product category
    openChart(product?.category || 'Eyeglasses');
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">Size:</h3>
        <div className="flex gap-1">
          {/* Example size selection UI */}
          {product?.category === 'Contact Lenses' ? (
            // Contact lens sizes (typically base curve/diameter)
            <>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">8.5/14.0</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">8.6/14.2</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">8.7/14.5</button>
            </>
          ) : (
            // Eyeglasses/Sunglasses sizes
            <>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">Small</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">Medium</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">Large</button>
            </>
          )}
        </div>
      </div>
      
      {/* Size chart button */}
      <SizeChartButton onClick={handleOpenSizeChart} />
      
      {/* Size chart modal */}
      <SizeChart 
        isOpen={isOpen} 
        onClose={closeChart} 
        category={category} 
      />
    </div>
  );
};

export default SizeChartExample;
