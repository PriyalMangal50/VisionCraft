import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    setBestSeller(products.filter((item) => item.bestseller).slice(0, 6));
  }, [products]);
  return (
    <section className='my-16 font-arial'>
      <div className='text-center text-3xl py-8 mb-4'>
        <div className="section-title">
          <Title text1={"BEST"} text2={"SELLERS"} />
        </div>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our most popular products loved by customers worldwide. These top-rated items combine
          exceptional quality with timeless appeal, making them the perfect choice for any occasion.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-8'>
        {bestSeller.map((item, index) => (
          <ProductItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
