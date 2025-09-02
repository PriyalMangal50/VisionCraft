import { sanitizeImageUrl } from "../utils/image";
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductRecommendations = ({ currentProduct, currentProductId, category, collection, limit = 4 }) => {
  const { products, currency } = useContext(ShopContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // New implementation that works with either the full product object or just ID/category
    const fetchRecommendations = async () => {
      setLoading(true);
      
      // Case 1: We have the full currentProduct object (old implementation)
      if (currentProduct) {
        if (products && products.length > 0) {
          // Get recommendations based on same category, brand, frame shape, etc.
          let filteredProducts = products.filter(product => 
            product._id !== currentProduct._id && // Don't include the current product
            (
              // Same category is the highest priority match
              product.category === currentProduct.category ||
              // Same brand is also a good match
              (currentProduct.brand && product.brand === currentProduct.brand) ||
              // Same frame shape for eyewear
              (currentProduct.frameShape && product.frameShape === currentProduct.frameShape) ||
              // Same frame material
              (currentProduct.frameMaterial && product.frameMaterial === currentProduct.frameMaterial)
            )
          );
      
          // Sort by relevance - products that match more criteria should appear first
          filteredProducts.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;
            
            // Award points for matching attributes
            if (a.category === currentProduct.category) scoreA += 3;
            if (b.category === currentProduct.category) scoreB += 3;
            
            if (currentProduct.brand && a.brand === currentProduct.brand) scoreA += 2;
            if (currentProduct.brand && b.brand === currentProduct.brand) scoreB += 2;
            
            if (currentProduct.frameShape && a.frameShape === currentProduct.frameShape) scoreA += 1;
            if (currentProduct.frameShape && b.frameShape === currentProduct.frameShape) scoreB += 1;
            
            if (currentProduct.frameMaterial && a.frameMaterial === currentProduct.frameMaterial) scoreA += 1;
            if (currentProduct.frameMaterial && b.frameMaterial === currentProduct.frameMaterial) scoreB += 1;
            
            // Bestsellers get a bonus
            if (a.bestseller) scoreA += 1;
            if (b.bestseller) scoreB += 1;
            
            return scoreB - scoreA;
          });
          
          // Limit the number of recommendations
          setRecommendations(filteredProducts.slice(0, limit));
          setLoading(false);
        }
      }
      // Case 2: We have just the currentProductId, category and collection (new implementation)
      else if (currentProductId) {
        try {
          const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          let fetchedProducts = [];
          
          // First try to get products from the same collection
          if (collection) {
            const collectionResponse = await axios.post(
              `${apiUrl}/api/product/filter`,
              { collection: collection, limit: limit + 1 }
            );
            
            if (collectionResponse.data.success && 
                Array.isArray(collectionResponse.data.products) && 
                collectionResponse.data.products.length > 1) {
              // Filter out the current product
              fetchedProducts = collectionResponse.data.products
                .filter(product => product._id !== currentProductId)
                .slice(0, limit);
            }
          }
          
          // If we don't have enough products, try category
          if (fetchedProducts.length < limit && category) {
            const categoryResponse = await axios.post(
              `${apiUrl}/api/product/filter`,
              { category: category, limit: limit + 1 }
            );
            
            if (categoryResponse.data.success && 
                Array.isArray(categoryResponse.data.products) && 
                categoryResponse.data.products.length > 1) {
              // Filter out the current product and any products we already have
              const categoryProducts = categoryResponse.data.products
                .filter(product => product._id !== currentProductId &&
                  !fetchedProducts.some(p => p._id === product._id));
                
              // Add as many as we need to reach the limit
              fetchedProducts = [...fetchedProducts, ...categoryProducts]
                .slice(0, limit);
            }
          }
          
          // If we still don't have enough, add bestsellers
          if (fetchedProducts.length < limit) {
            const bestsellersResponse = await axios.post(
              `${apiUrl}/api/product/filter`,
              { bestseller: true, limit: limit }
            );
            
            if (bestsellersResponse.data.success) {
              const bestsellerProducts = bestsellersResponse.data.products
                .filter(product => product._id !== currentProductId && 
                  !fetchedProducts.some(p => p._id === product._id));
                
              fetchedProducts = [...fetchedProducts, ...bestsellerProducts]
                .slice(0, limit);
            }
          }
          
          setRecommendations(fetchedProducts);
        } catch (error) {
          console.error("Error fetching product recommendations:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [products, currentProduct, currentProductId, category, collection, limit]);  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-10 h-10 border-4 border-t-primary-700 border-primary-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-xl font-medium mb-4">You May Also Like</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <div 
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="cursor-pointer group"
          >
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <img
                src={sanitizeImageUrl(product.image && Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : '/images/no_image.png')}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={e => { e.target.onerror = null; e.target.src = '/images/no_image.png'; }}
              />
            </div>
            
            <div className="mt-2">
              <h3 className="text-sm font-medium truncate">{product.name || 'Product'}</h3>
              <p className="text-sm text-gray-500 truncate">{product.brand || product.category || 'Brand'}</p>
              <p className="mt-1 font-medium">{currency}{product.price || '0.00'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
