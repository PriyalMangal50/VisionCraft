import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollections = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className='my-16 font-arial'>
      <div className="w-full py-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="accent-blob w-72 h-72 -left-24 top-6"></div>
        <div className="accent-blob w-96 h-96 -right-32 -bottom-20"></div>
        
        <div className='text-center py-8 text-3xl mb-4 relative z-10'>
          <div className="inline-block bg-[#233362]/10 px-4 py-1 rounded-full mb-3">
            <span className="text-[#233362] text-sm font-medium">New Arrivals</span>
          </div>
          <div className="section-title">
            <Title text1={"LATEST"} text2={"COLLECTIONS"} />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto mt-4 mb-6 rounded-full"></div>
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            VisionCraft brings you the latest in trendy, high-quality eyewear — stylish frames and lenses designed to elevate your look for every occasion.
          </p>
        </div>
      </div>

      {/* Rendering Products */}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-8'>
        {latestProducts.map((product, index) => (
          <ProductItem key={index} {...product} />
        ))}
      </div>
    </section>
  );
};

export default LatestCollections;
