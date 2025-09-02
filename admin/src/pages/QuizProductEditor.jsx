import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/http';
import { FACE_SHAPES, USAGE_OPTIONS, FEATURE_OPTIONS } from '../utils/quizConstants';

const QuizProductEditor = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    brand: '',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    faceShapes: [],
    usage: [],
    features: {
      blueLight: false,
      lightweight: false,
      polarized: false,
      transition: false
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
  const { data } = await api.get(`/api/product/list`);
      
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const updateProductQuizAttributes = async (productId, updates) => {
    try {
      const { data } = await api.post(`/api/product/update`, {
        productId,
        updates
      });
      
      if (data.success) {
        toast.success('Product updated successfully');
        
        // Update the local state
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, ...updates } 
              : product
          )
        );
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleFaceShapeChange = (productId, faceShape, checked) => {
    const product = products.find(p => p._id === productId);
    
    if (!product) return;
    
    const currentShapes = Array.isArray(product.suitableFaceShapes) ? product.suitableFaceShapes : [];
    let updatedShapes;
    
    if (checked) {
      updatedShapes = [...currentShapes, faceShape];
    } else {
      updatedShapes = currentShapes.filter(shape => shape !== faceShape);
    }
    
    updateProductQuizAttributes(productId, { suitableFaceShapes: updatedShapes });
  };

  const handleUsageChange = (productId, usage, checked) => {
    const product = products.find(p => p._id === productId);
    
    if (!product) return;
    
    const currentUsage = Array.isArray(product.usage) ? product.usage : [];
    let updatedUsage;
    
    if (checked) {
      updatedUsage = [...currentUsage, usage];
    } else {
      updatedUsage = currentUsage.filter(u => u !== usage);
    }
    
    updateProductQuizAttributes(productId, { usage: updatedUsage });
  };

  const handleFeatureChange = (productId, feature, checked) => {
    const product = products.find(p => p._id === productId);
    
    if (!product) return;
    
    const currentFeatures = product.features || {
      blueLight: false,
      lightweight: false,
      polarized: false,
      transition: false
    };
    
    const updatedFeatures = {
      ...currentFeatures,
      [feature]: checked
    };
    
    updateProductQuizAttributes(productId, { features: updatedFeatures });
  };

  const handleRelevanceScoreChange = (productId, score) => {
    updateProductQuizAttributes(productId, { quizRelevanceScore: parseInt(score) });
  };

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.subCategory && product.subCategory !== filters.subCategory) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    return true;
  });

  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const uniqueSubCategories = [...new Set(products.map(p => p.subCategory))].filter(Boolean);
  const uniqueBrands = [...new Set(products.map(p => p.brand))].filter(Boolean);

  // Use standardized constants for consistency with the frontend
  const faceShapes = FACE_SHAPES.map(shape => shape.value);
  const usageOptions = USAGE_OPTIONS.map(usage => usage.value);
  const featureOptions = FEATURE_OPTIONS;

  return (
    <div className="px-6 py-8 bg-brand-white font-arial">
      <h1 className="text-2xl font-extrabold mb-6 text-brand-navy">Quiz Product Editor</h1>
      
      {/* Filters */}
      <div className="bg-brand-white rounded-lg shadow-sm p-4 mb-6 border border-brand-light-gray">
        <h2 className="text-lg font-extrabold mb-3 text-brand-blue">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-regular text-brand-gray mb-1">Category</label>
            <select 
              value={filters.category} 
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="border border-brand-light-gray rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-regular text-brand-gray mb-1">Sub-Category</label>
            <select 
              value={filters.subCategory} 
              onChange={(e) => setFilters({ ...filters, subCategory: e.target.value })}
              className="border border-brand-light-gray rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">All Sub-Categories</option>
              {uniqueSubCategories.map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-regular text-brand-gray mb-1">Brand</label>
            <select 
              value={filters.brand} 
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="border border-brand-light-gray rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="bg-brand-white rounded-lg shadow overflow-hidden border border-brand-light-gray">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-light-gray">
            <thead className="bg-brand-blue">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-extrabold text-brand-white uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-extrabold text-brand-white uppercase tracking-wider">
                  Suitable Face Shapes
                </th>
                <th className="px-6 py-3 text-left text-xs font-extrabold text-brand-white uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-extrabold text-brand-white uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-extrabold text-brand-white uppercase tracking-wider">
                  Quiz Relevance
                </th>
              </tr>
            </thead>
            <tbody className="bg-brand-white divide-y divide-brand-light-gray">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-brand-gray font-regular">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-brand-gray font-regular">No products found</td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-brand-light-gray/10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover border border-brand-light-gray" 
                            src={product.image[0]} 
                            alt={product.name}
                            onError={(e) => {
                              const fallbackPng = '/images/no_image.svg';
                              const inlineSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif">No image</text></svg>`);
                              if (!e.currentTarget.dataset.fallbackTried) {
                                e.currentTarget.dataset.fallbackTried = '1';
                                e.currentTarget.src = fallbackPng;
                              } else {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = inlineSvg;
                              }
                            }} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-extrabold text-brand-navy">{product.name}</div>
                          <div className="text-sm text-brand-gray font-regular">{product.category} • {product.subCategory}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {faceShapes.map(shape => {
                          const isSelected = product.suitableFaceShapes?.includes(shape);
                          return (
                            <label key={shape} className="inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-brand-blue border-brand-light-gray rounded focus:ring-brand-blue"
                                checked={isSelected}
                                onChange={(e) => handleFaceShapeChange(product._id, shape, e.target.checked)}
                              />
                              <span className="ml-2 text-sm text-brand-gray font-regular capitalize">{shape}</span>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {usageOptions.map(usage => {
                          const isSelected = product.usage?.includes(usage);
                          return (
                            <label key={usage} className="inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-brand-blue border-brand-light-gray rounded focus:ring-brand-blue"
                                checked={isSelected}
                                onChange={(e) => handleUsageChange(product._id, usage, e.target.checked)}
                              />
                              <span className="ml-2 text-sm text-brand-gray font-regular capitalize">{usage}</span>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {featureOptions.map(({ key, label }) => {
                          const isSelected = product.features?.[key];
                          return (
                            <label key={key} className="inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-brand-blue border-brand-light-gray rounded focus:ring-brand-blue"
                                checked={isSelected}
                                onChange={(e) => handleFeatureChange(product._id, key, e.target.checked)}
                              />
                              <span className="ml-2 text-sm text-brand-gray font-regular">{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={product.quizRelevanceScore || 0}
                        onChange={(e) => handleRelevanceScoreChange(product._id, e.target.value)}
                        className="border border-brand-light-gray rounded w-16 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      />
                      <p className="text-xs text-brand-gray font-regular mt-1">0-10 (higher = more relevant)</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizProductEditor;
