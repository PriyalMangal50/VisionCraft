import { useState } from 'react';

/**
 * Hook to manage the size chart modal state
 * @returns {Object} - Size chart state and controls
 */
export const useSizeChart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('Eyeglasses');
  
  const openChart = (productCategory = 'Eyeglasses') => {
    setCategory(productCategory);
    setIsOpen(true);
  };
  
  const closeChart = () => {
    setIsOpen(false);
  };
  
  return {
    isOpen,
    category,
    openChart,
    closeChart
  };
};
