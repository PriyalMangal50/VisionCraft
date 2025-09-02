import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!products || !Array.isArray(products) || products.length === 0 || !category) {
      setRelatedProducts([]);
      return;
    }

    try {
      // Make a copy of the products array to avoid mutation
      let productsCopy = [...products];
      
      // Filter out the current product if we can identify it
      // This is to avoid showing the current product in related products
      const currentUrl = window.location.pathname;
      const currentProductId = currentUrl.split('/').pop();
      if (currentProductId) {
        productsCopy = productsCopy.filter(item => item._id !== currentProductId);
      }
      
      // Filter by category first
      const sameCategoryProducts = productsCopy.filter(item => 
        item && item.category && item.category === category
      );
      
      // If we have enough products of the same category and subcategory, prefer those
      if (subCategory) {
        const sameSubcategoryProducts = sameCategoryProducts.filter(
          item => item && item.subCategory && item.subCategory === subCategory
        );
        
        if (sameSubcategoryProducts.length >= 3) {
          setRelatedProducts(sameSubcategoryProducts.slice(0, 5));
          return;
        }
      }
      
      // If not enough products with the same subcategory, use products from the same category
      if (sameCategoryProducts.length > 0) {
        setRelatedProducts(sameCategoryProducts.slice(0, 5));
      } else {
        // If no products in the same category, just show some random products
        setRelatedProducts(productsCopy.slice(0, 5));
      }
    } catch (error) {
      console.error("Error in RelatedProducts component:", error);
      setRelatedProducts([]);
    }
  }, [products, category, subCategory]);
  
  if (relatedProducts.length === 0) {
    return null; // Don't show the section if no related products
  }

  return (
    <div className='my-24' onClick={() => scrollTo(0, 0)}>
      <div className='text-center text-3xl py-2'>
        <Title 
          text1={`RELATED`} 
          text2={category ? category.toUpperCase() : "PRODUCTS"} 
        />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {relatedProducts.map((product, i) => (
          <ProductItem key={i} {...product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
